interface WhatsAppConfig {
  phone: string;
  defaultMessage: string;
}

interface WhatsAppMessage {
  phone: string;
  message: string;
  service?: string;
  location?: string;
}

class WhatsAppClient {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      phone: import.meta.env.VITE_WHATSAPP_PHONE || '254700000000',
      defaultMessage: import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello! I need a service provider.'
    };
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Ensure it starts with country code
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  private buildMessage(message: WhatsAppMessage): string {
    let fullMessage = message.message;
    
    if (message.service) {
      fullMessage += `\n\nService: ${message.service}`;
    }
    
    if (message.location) {
      fullMessage += `\nLocation: ${message.location}`;
    }
    
    return encodeURIComponent(fullMessage);
  }

  openChat(message: WhatsAppMessage): void {
    try {
      const formattedPhone = this.formatPhoneNumber(message.phone);
      const formattedMessage = this.buildMessage(message);
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${formattedMessage}`;
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Failed to open WhatsApp chat:', error);
      throw new Error('Failed to open WhatsApp chat');
    }
  }

  openDefaultChat(service?: string, location?: string): void {
    this.openChat({
      phone: this.config.phone,
      message: this.config.defaultMessage,
      service,
      location
    });
  }

  getSupportNumber(): string {
    return this.config.phone;
  }
}

export const whatsappClient = new WhatsAppClient();
export type { WhatsAppMessage }; 