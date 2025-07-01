# M-Pesa Fundi Connect

A platform connecting skilled professionals and artisans with customers through M-Pesa integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

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
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Preview production build
npm run preview
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Connect your repository to Netlify**
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Set environment variables in Netlify dashboard**

### Option 3: Static Hosting (GitHub Pages, etc.)

1. **Build the project**
   ```bash
   npm run build:prod
   ```

2. **Upload the `dist` folder to your hosting provider**

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Application URL | No |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel/Netlify ready

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── booking/        # Booking related components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components
└── main.tsx           # Application entry point
```

## 🔒 Security

- Environment variables are used for sensitive data
- Supabase Row Level Security (RLS) is enabled
- No sensitive data is exposed in the frontend

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@mpesa-fundi-connect.com or create an issue in this repository.
