import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MpesaPayment from '@/components/payment/MpesaPayment';

interface BookingFormData {
  service: string;
  location: string;
  date: string;
  description: string;
  amount: number;
}

const BookingForm = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    location: '',
    date: '',
    description: '',
    amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const services = [
    { name: 'Plumbing', price: 2000 },
    { name: 'Electrical', price: 2500 },
    { name: 'Carpentry', price: 1800 },
    { name: 'Cleaning', price: 1500 },
    { name: 'Painting', price: 3000 },
    { name: 'Appliance Repair', price: 2200 },
    { name: 'Garden Services', price: 1200 },
    { name: 'Auto Repair', price: 3500 },
    { name: 'Tutoring', price: 1000 },
    { name: 'Beauty Services', price: 800 }
  ];

  const handleServiceChange = (serviceName: string) => {
    const selectedService = services.find(s => s.name === serviceName);
    setFormData({
      ...formData,
      service: serviceName,
      amount: selectedService?.price || 0
    });
  };

  const validateForm = (): string | null => {
    if (!formData.service) return 'Please select a service';
    if (!formData.location.trim()) return 'Please enter your location';
    if (!formData.date) return 'Please select a preferred date';
    if (formData.amount <= 0) return 'Invalid service amount';
    
    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Please select a future date';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Check for existing booking with same details
    try {
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('client_id', user.id)
        .eq('service', formData.service)
        .eq('date', formData.date)
        .eq('location', formData.location);

      if (checkError) throw checkError;

      if (existingBookings && existingBookings.length > 0) {
        const existingBooking = existingBookings[0];
        toast({
          title: "Booking already exists",
          description: `You already have a ${existingBooking.status} booking for ${formData.service} on ${new Date(formData.date).toLocaleDateString()}. Please check your bookings or choose a different date/service.`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    } catch (checkError) {
      console.error('Error checking existing bookings:', checkError);
      // Continue with booking creation even if check fails
    }

    try {
      // Debug: Log the data we're trying to insert
      const bookingData = {
        client_id: user.id,
        service: formData.service,
        location: formData.location,
        date: formData.date,
        description: formData.description || null, // Ensure null if empty
        status: 'pending',
        amount: formData.amount || null, // Ensure null if 0
        created_at: new Date().toISOString(), // Add the required created_at field
        fundi_id: null // Explicitly set fundi_id to null since no fundi is assigned yet
      };
      
      console.log('Attempting to insert booking data:', bookingData);
      console.log('User ID:', user.id);
      console.log('Form data:', formData);
      
      // Validate that all required fields are present
      if (!bookingData.client_id) {
        throw new Error('Client ID is required');
      }
      if (!bookingData.service) {
        throw new Error('Service is required');
      }
      if (!bookingData.location) {
        throw new Error('Location is required');
      }
      if (!bookingData.date) {
        throw new Error('Date is required');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      setBookingId(data.id);
      setShowPayment(true);
      
      toast({
        title: "Booking created!",
        description: "Please complete payment to confirm your booking.",
      });

    } catch (error: any) {
      let errorMessage = 'An unknown error occurred';
      
      // Check if it's a 409 conflict error (duplicate booking)
      if (error?.code === '23505' || error?.message?.includes('duplicate key value') || error?.message?.includes('409')) {
        errorMessage = 'You have already made this booking. Please check your existing bookings or try a different date/service.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Booking failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: { mpesaReceiptNumber: string }) => {
    if (!bookingId) return;

    try {
      // Update booking with payment information
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_reference: paymentData.mpesaReceiptNumber,
          payment_date: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Payment successful!",
        description: "Your booking has been confirmed. We'll contact you soon.",
      });

      // Reset form
      setFormData({
        service: '',
        location: '',
        date: '',
        description: '',
        amount: 0
      });
      setShowPayment(false);
      setBookingId(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking';
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
  };

  if (showPayment && bookingId) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Complete payment to confirm your booking for {formData.service} on {new Date(formData.date).toLocaleDateString()}
          </AlertDescription>
        </Alert>
        
        <MpesaPayment
          amount={formData.amount}
          reference={bookingId}
          description={`${formData.service} - ${formData.location}`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
        
        <Button 
          variant="outline" 
          onClick={() => setShowPayment(false)}
          className="w-full"
        >
          Back to Booking Form
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="service">Service Needed</Label>
        <Select value={formData.service} onValueChange={handleServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.name} value={service.name}>
                <div className="flex justify-between items-center w-full">
                  <span>{service.name}</span>
                  <span className="text-sm text-gray-500">KES {service.price.toLocaleString()}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="Enter your location"
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Preferred Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe what you need..."
          rows={3}
        />
      </div>

      {formData.amount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              KES {formData.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Payment will be processed via M-Pesa after booking confirmation
            </p>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating booking...' : 'Book Service'}
      </Button>
    </form>
  );
};

export default BookingForm;
