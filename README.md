# M-Pesa Fundi Connect

M-Pesa Fundi Connect is a modern platform that connects clients with trusted local service providers (fundis, freelancers, artisans, etc.) in Kenya. Clients can find, book, and pay for services securely via M-Pesa, while providers can list, manage, and monetize their services. The platform also features WhatsApp integration for seamless communication and supports both web and mobile users.

## 🌟 Features
- **Role Flexibility:** Any user can act as a client (book services) or a provider (offer services).
- **Service Marketplace:** Browse, search, and request custom services across multiple categories.
- **Provider Dashboard:** Fundis can create, manage, and price their own services.
- **Booking & Payments:** Secure M-Pesa payment gateway for bookings and subscriptions.
- **WhatsApp Integration:** Instantly connect clients and providers via WhatsApp chat.
- **Custom Service Requests:** Users can request services not listed and get matched with providers.
- **Commission & Subscription:** Monetization via lead/job commission and provider subscriptions.
- **Supabase Auth & RLS:** Secure authentication and data access.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (with required tables and RLS policies)

### Local Development
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mpesa-fundi-connect
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and add your Supabase, M-Pesa, Twilio, and app credentials.
4. **Start backend (API server)**
   ```bash
   cd mpesa-backend
   npm install
   npm start
   ```
5. **Start frontend (Vite dev server)**
   ```bash
   cd ..
   npm run dev
   ```
6. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Build & Deployment

- **Build frontend:**
  ```bash
  npm run build
  ```
- **Deploy:**
  - Vercel, Netlify, or any static hosting for frontend
  - Render, Railway, or your own server for backend
- **Set environment variables** in your deployment dashboard for both frontend and backend.

## 🔧 Environment Variables

| Variable                  | Description                        | Required |
|---------------------------|------------------------------------|----------|
| VITE_SUPABASE_URL         | Supabase project URL                | Yes      |
| VITE_SUPABASE_ANON_KEY    | Supabase anon key                   | Yes      |
| VITE_APP_NAME             | Application name                    | No       |
| VITE_APP_URL              | Application URL                     | Yes      |
| VITE_API_URL              | Backend API base URL                | Yes      |
| BACKEND_URL               | Public backend URL (for callbacks)  | Yes      |
| FRONTEND_URL              | Public frontend URL (for CORS)      | Yes      |
| VITE_MPESA_CONSUMER_KEY   | M-Pesa API consumer key             | Yes      |
| VITE_MPESA_CONSUMER_SECRET| M-Pesa API consumer secret          | Yes      |
| VITE_MPESA_PASSKEY        | M-Pesa API passkey                  | Yes      |
| VITE_MPESA_BUSINESS_SHORT_CODE | M-Pesa shortcode              | Yes      |
| VITE_MPESA_ENVIRONMENT    | 'sandbox' or 'production'           | Yes      |
| VITE_WHATSAPP_PHONE       | WhatsApp default phone              | No       |
| VITE_WHATSAPP_MESSAGE     | WhatsApp default message            | No       |
| TWILIO_ACCOUNT_SID        | Twilio account SID                  | Yes      |
| TWILIO_AUTH_TOKEN         | Twilio auth token                   | Yes      |
| TWILIO_WHATSAPP_NUMBER    | Twilio WhatsApp number              | Yes      |
| VITE_GA_TRACKING_ID       | Google Analytics ID                 | No       |

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js (Express), Supabase (Postgres), M-Pesa API, Twilio API
- **Authentication:** Supabase Auth
- **Payments:** M-Pesa (STK Push)
- **Messaging:** WhatsApp (via Twilio)
- **Deployment:** Vercel/Netlify (frontend), Railway/Render/Custom (backend)

## 📁 Project Structure
```
mpesa-fundi-connect/
├── mpesa-backend/         # Backend API (Express)
├── src/
│   ├── components/        # UI and feature components
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Supabase, M-Pesa, WhatsApp clients
│   ├── lib/               # Utilities
│   ├── pages/             # Page components
│   └── main.tsx           # App entry point
├── public/                # Static assets
├── env.example            # Example environment variables
└── README.md
```

## 👥 User Flows
- **Clients:**
  - Browse or search for services
  - Book a service and pay via M-Pesa
  - Request a custom service if not listed
  - Chat with providers via WhatsApp
- **Providers (Fundis):**
  - Register and create service listings
  - Manage jobs and earnings in dashboard
  - Receive bookings and payments
  - Subscribe for premium listing (optional)

## 🔒 Security
- All sensitive data is managed via environment variables
- Supabase Row Level Security (RLS) is enabled
- HTTPS recommended for all deployments

## 📝 License
MIT License

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support
For support, email support@mpesa-fundi-connect.com or create an issue in this repository.
