# M-Pesa Backend

This is a simple Node.js backend for handling M-Pesa payments for the Fundi Connect app.

## Setup

1. Copy `.env.example` to `.env` and fill in your Safaricom Daraja sandbox credentials.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

The backend will run on `http://localhost:5000` by default.

## Endpoints
- `POST /api/mpesa/stkpush` — Initiate an M-Pesa STK Push payment
- `POST /api/mpesa/status` — Check the status of a payment 