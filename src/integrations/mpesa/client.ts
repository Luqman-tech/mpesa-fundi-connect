interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  businessShortCode: string;
  environment: 'sandbox' | 'production';
}

interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  reference: string;
  description: string;
}

interface MpesaResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class MpesaClient {
  private config: MpesaConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || '',
      consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || '',
      passkey: import.meta.env.VITE_MPESA_PASSKEY || '',
      businessShortCode: import.meta.env.VITE_MPESA_BUSINESS_SHORT_CODE || '',
      environment: (import.meta.env.VITE_MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
    };

    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    this.validateConfig();
  }

  private validateConfig(): void {
    const requiredFields = ['consumerKey', 'consumerSecret', 'passkey', 'businessShortCode'];
    for (const field of requiredFields) {
      if (!this.config[field as keyof MpesaConfig]) {
        throw new Error(`Missing M-Pesa configuration: ${field}`);
      }
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute early
      
      return this.accessToken;
    } catch (error) {
      throw new Error(`M-Pesa authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp();
    const password = btoa(`${this.config.businessShortCode}${this.config.passkey}${timestamp}`);
    return password;
  }

  async initiatePayment(request: MpesaPaymentRequest): Promise<MpesaResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount),
        PartyA: request.phoneNumber,
        PartyB: this.config.businessShortCode,
        PhoneNumber: request.phoneNumber,
        CallBackURL: `${import.meta.env.VITE_APP_URL}/api/mpesa/callback`,
        AccountReference: request.reference,
        TransactionDesc: request.description
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || `Payment failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.ResponseCode === '0') {
        return {
          success: true,
          data: {
            checkoutRequestId: data.CheckoutRequestID,
            merchantRequestId: data.MerchantRequestID,
            customerMessage: data.CustomerMessage
          }
        };
      } else {
        return {
          success: false,
          error: data.CustomerMessage || 'Payment initiation failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  async checkPaymentStatus(checkoutRequestId: string): Promise<MpesaResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          resultCode: data.ResultCode,
          resultDesc: data.ResultDesc,
          amount: data.Amount,
          mpesaReceiptNumber: data.MpesaReceiptNumber,
          transactionDate: data.TransactionDate
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed'
      };
    }
  }
}

export const mpesaClient = new MpesaClient();
export type { MpesaPaymentRequest, MpesaResponse }; 