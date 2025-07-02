// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabaseClient');
const { sendWhatsApp } = require('./whatsapp');

const app = express();
app.use(cors());
app.use(express.json());

// M-Pesa credentials from .env
const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY } = process.env;

// Get M-Pesa access token
async function getAccessToken() {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return data.access_token;
}

// Initiate STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount, reference, description } = req.body;
    const accessToken = await getAccessToken();

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: 'https://yourdomain.com/api/mpesa/callback', // Change to your backend callback
      AccountReference: reference,
      TransactionDesc: description
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed', details: err.response?.data || err.message });
  }
});

app.post('/api/mpesa/status', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    if (!checkoutRequestId) {
      return res.status(400).json({ error: 'Missing checkoutRequestId' });
    }

    const accessToken = await getAccessToken();

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Return the raw response to the frontend
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Status check failed', details: err.response?.data || err.message });
  }
});

app.post('/api/fundi/subscribe', async (req, res) => {
  try {
    const { phone, fundi_id } = req.body;
    const amount = 150;
    const reference = `FUNDISUB-${fundi_id}-${Date.now()}`;
    const description = 'Fundi Weekly Subscription';

    // Initiate M-Pesa payment (reuse your STK push logic)
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BACKEND_URL}/api/mpesa/callback`, // Set this in your .env
      AccountReference: reference,
      TransactionDesc: description
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json({ ...data, reference });
  } catch (err) {
    res.status(500).json({ error: 'Subscription initiation failed', details: err.message });
  }
});

app.post('/api/mpesa/callback', async (req, res) => {
  try {
    // Safaricom sends callback as JSON
    const body = req.body;
    // Parse the payment result
    const stkCallback = body.Body?.stkCallback;
    if (!stkCallback) return res.sendStatus(400);

    const resultCode = stkCallback.ResultCode;
    const reference = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'AccountReference')?.Value
      || stkCallback.MerchantRequestID; // Use your reference logic

    // Only proceed if payment was successful
    if (resultCode === 0) {
      // Handle fundi subscription
      if (reference && reference.startsWith('FUNDISUB-')) {
        // Extract fundi_id from reference
        const fundi_id = reference.split('-')[1];
        const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
        const now = new Date();
        const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Insert into subscriptions table
        await supabase.from('subscriptions').insert([{
          fundi_id,
          amount: 150,
          start_date: now.toISOString(),
          end_date: expiry.toISOString(),
          payment_reference: mpesaReceiptNumber
        }]);

        // Update fundi status
        await supabase.from('fundis').update({
          subscription_active: true,
          subscription_expiry: expiry.toISOString()
        }).eq('id', fundi_id);

        // Get fundi phone number and send WhatsApp notification
        const { data: fundi } = await supabase
          .from('fundis')
          .select('phone')
          .eq('id', fundi_id)
          .single();

        if (fundi?.phone) {
          await sendWhatsApp(
            fundi.phone,
            `Your subscription has been renewed! You are now active for the next 7 days.`
          );
        }
      } else {
        // Handle job/booking payment
        // Extract bookingId from reference (assuming reference is bookingId)
        const bookingId = reference;
        // Fetch the booking to get the amount and details
        const { data: booking, error } = await supabase
          .from('bookings')
          .select('amount, service, date, location, client_id, fundi_id')
          .eq('id', bookingId)
          .single();
        
        if (!booking || error) return res.sendStatus(400);
        
        const amount = booking.amount;
        const commission = Math.round(amount * 0.10); // 10% commission
        const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

        // Update booking with payment info and commission
        await supabase.from('bookings').update({
          status: 'confirmed',
          payment_reference: mpesaReceiptNumber,
          payment_date: new Date().toISOString(),
          commission: commission
        }).eq('id', bookingId);

        // Get client and fundi phone numbers
        const { data: client } = await supabase
          .from('users')
          .select('phone')
          .eq('id', booking.client_id)
          .single();

        const { data: fundi } = await supabase
          .from('fundis')
          .select('phone')
          .eq('id', booking.fundi_id)
          .single();

        // Send WhatsApp notifications
        if (fundi?.phone) {
          await sendWhatsApp(
            fundi.phone,
            `Booking confirmed! You have a new job for ${booking.service} on ${new Date(booking.date).toLocaleDateString()} at ${booking.location}. Payment received: KES ${amount.toLocaleString()}.`
          );
        }

        if (client?.phone) {
          await sendWhatsApp(
            client.phone,
            `Payment received! Your booking for ${booking.service} is confirmed. Your fundi will contact you soon.`
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Callback error:', err);
    res.sendStatus(500);
  }
});

// Booking creation endpoint with WhatsApp notifications
app.post('/api/bookings', async (req, res) => {
  try {
    const { service, location, date, description, amount, client_id, fundi_id } = req.body;
    
    // Create the booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        service,
        location,
        date,
        description,
        amount,
        client_id,
        fundi_id,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // Get client and fundi phone numbers
    const { data: client } = await supabase
      .from('users')
      .select('phone')
      .eq('id', client_id)
      .single();

    const { data: fundi } = await supabase
      .from('fundis')
      .select('phone')
      .eq('id', fundi_id)
      .single();

    // Send WhatsApp notifications
    if (fundi?.phone) {
      await sendWhatsApp(
        fundi.phone,
        `New booking received for ${service} on ${new Date(date).toLocaleDateString()} at ${location}. Please check your dashboard.`
      );
    }

    if (client?.phone) {
      await sendWhatsApp(
        client.phone,
        `Your booking for ${service} has been received! Your fundi will contact you soon.`
      );
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fundi earnings/commission stats endpoint
app.get('/api/fundi/bookings-stats', async (req, res) => {
  try {
    const { fundi_id } = req.query;
    if (!fundi_id) return res.status(400).json({ error: 'Missing fundi_id' });
    // Fetch all bookings for this fundi
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('amount, commission, status')
      .eq('fundi_id', fundi_id);
    if (error) return res.status(500).json({ error: error.message });
    let total = 0, commission = 0, net = 0, completed = 0;
    for (const b of bookings || []) {
      if ((b.status === 'completed' || b.status === 'confirmed') && typeof b.amount === 'number') {
        total += b.amount;
        commission += b.commission || 0;
        completed++;
      }
    }
    net = total - commission;
    res.json({ data: { total, commission, net, completed } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  const { client_id, fundi_id, client_phone, fundi_phone } = req.body;
  const commission = 50; // or calculate 10% of a standard lead value

  // Optionally, trigger M-Pesa payment for commission here

  // Record the lead
  const { data, error } = await supabase
    .from('leads')
    .insert([{ client_id, fundi_id, commission, status: 'charged' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Notify fundi via WhatsApp
  await sendWhatsApp(
    fundi_phone,
    `You have a new lead! A client is interested in your services.`
  );

  res.json({ success: true, lead: data });
});

app.get('/api/fundi/leads-stats', async (req, res) => {
  const { fundi_id } = req.query;
  const { data, error } = await supabase
    .from('leads')
    .select('commission')
    .eq('fundi_id', fundi_id);
  if (error) return res.status(500).json({ error: error.message });
  const leadCommission = (data || []).reduce((sum, l) => sum + (l.commission || 0), 0);
  res.json({ data: { leadCommission } });
});

app.get('/api/admin/stats', async (req, res) => {
  // Total commission from bookings
  const { data: bookings, error: bErr } = await supabase.from('bookings').select('commission');
  // Total commission from leads
  const { data: leads, error: lErr } = await supabase.from('leads').select('commission');
  // Fundis count
  const { count: fundisCount } = await supabase.from('fundis').select('*', { count: 'exact', head: true });
  // Clients count
  const { count: clientsCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  // Bookings count
  const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });

  if (bErr || lErr) return res.status(500).json({ error: bErr?.message || lErr?.message });

  const totalCommission = (bookings || []).reduce((sum, b) => sum + (b.commission || 0), 0)
    + (leads || []).reduce((sum, l) => sum + (l.commission || 0), 0);

  res.json({
    data: {
      totalCommission,
      fundisCount,
      clientsCount,
      bookingsCount,
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`M-Pesa backend running on port ${PORT}`));