import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MpesaPaymentProps {
  amount: number;
  reference: string;
  description: string;
  onSuccess?: (data: { mpesaReceiptNumber: string; resultCode: string; resultDesc: string; amount: number; transactionDate: string }) => void;
  onError?: (error: string) => void;
}

const MpesaPayment = ({ amount, reference, description, onSuccess, onError }: MpesaPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'pending' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid Kenyan phone number
    if (cleaned.startsWith('254') && cleaned.length === 12) return true;
    if (cleaned.startsWith('0') && cleaned.length === 10) return true;
    if (cleaned.startsWith('7') && cleaned.length === 9) return true;
    
    return false;
  };

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('initiating');

    try {
      const paymentRequest = {
        phone: formatPhoneNumber(phoneNumber),
        amount,
        reference,
        description
      };

      const response = await fetch('http://localhost:5000/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest)
      }).then(res => res.json());

      if (response.CheckoutRequestID) {
        setCheckoutRequestId(response.CheckoutRequestID);
        setPaymentStatus('pending');
        toast({
          title: "Payment initiated",
          description: response.CustomerMessage || "Please check your phone for the M-Pesa prompt",
        });
        pollPaymentStatus(response.CheckoutRequestID);
      } else {
        setPaymentStatus('failed');
        const errorMessage = response.error || 'Payment initiation failed';
        toast({
          title: "Payment failed",
          description: errorMessage,
          variant: "destructive",
        });
        onError?.(errorMessage);
      }
    } catch (error) {
      setPaymentStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (requestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus('failed');
        toast({
          title: "Payment timeout",
          description: "Payment verification timed out. Please contact support if payment was made.",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/mpesa/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutRequestId: requestId })
        }).then(res => res.json());

        if (response.ResultCode === '0') {
          setPaymentStatus('success');
          toast({
            title: "Payment successful!",
            description: `Receipt: ${response.MpesaReceiptNumber}`,
          });
          onSuccess?.({
            mpesaReceiptNumber: response.MpesaReceiptNumber,
            resultCode: response.ResultCode,
            resultDesc: response.ResultDesc,
            amount: response.Amount,
            transactionDate: response.TransactionDate
          });
          return;
        } else if (response.ResultCode === '1032') {
          // User cancelled
          setPaymentStatus('failed');
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment",
            variant: "destructive",
          });
          return;
        }
        // Continue polling
        attempts++;
        setTimeout(poll, 10000); // Poll every 10 seconds
      } catch (error) {
        console.error('Payment status check failed:', error);
        attempts++;
        setTimeout(poll, 10000);
      }
    };
    setTimeout(poll, 10000); // Start polling after 10 seconds
  };

  const resetPayment = () => {
    setPhoneNumber('');
    setPaymentStatus('idle');
    setCheckoutRequestId(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          M-Pesa Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentStatus === 'idle' && (
          <>
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-green-600">KES {amount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            
            <div>
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712345678"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the phone number registered with M-Pesa
              </p>
            </div>

            <Button 
              onClick={handlePayment} 
              className="w-full" 
              disabled={loading || !phoneNumber.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initiating Payment...
                </>
              ) : (
                `Pay KES ${amount.toLocaleString()}`
              )}
            </Button>
          </>
        )}

        {paymentStatus === 'pending' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Payment Pending</h3>
              <p className="text-sm text-gray-600">
                Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
              </p>
            </div>
            <Alert>
              <AlertDescription>
                We're verifying your payment. This may take a few moments.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-green-600">Payment Successful!</h3>
              <p className="text-sm text-gray-600">
                Your payment has been processed successfully.
              </p>
            </div>
            <Button onClick={resetPayment} variant="outline" className="w-full">
              Make Another Payment
            </Button>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-red-600">Payment Failed</h3>
              <p className="text-sm text-gray-600">
                The payment could not be processed. Please try again.
              </p>
            </div>
            <Button onClick={resetPayment} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MpesaPayment; 