// mpesa-backend/whatsapp.js
const twilio = require('twilio');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendWhatsApp(to, message) {
  try {
    const result = await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    return result;
  } catch (err) {
    console.error('WhatsApp send error:', err.message);
    return null;
  }
}

module.exports = { sendWhatsApp };