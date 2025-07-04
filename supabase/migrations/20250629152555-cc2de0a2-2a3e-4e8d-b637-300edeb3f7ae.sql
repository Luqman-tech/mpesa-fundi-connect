-- First, let's add proper RLS policies and fix the existing tables

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fundis ENABLE ROW LEVEL SECURITY;

-- Add payment-related columns to bookings table if they don't exist
DO $$ 
BEGIN
    -- Add amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'amount') THEN
        ALTER TABLE public.bookings ADD COLUMN amount DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'description') THEN
        ALTER TABLE public.bookings ADD COLUMN description TEXT;
    END IF;
    
    -- Add payment_reference column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_reference') THEN
        ALTER TABLE public.bookings ADD COLUMN payment_reference VARCHAR(255);
    END IF;
    
    -- Add payment_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_date') THEN
        ALTER TABLE public.bookings ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Fundis can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = fundi_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Fundis can update booking status" ON public.bookings
  FOR UPDATE USING (auth.uid() = fundi_id);

-- Create RLS policies for fundis table
CREATE POLICY "Anyone can view active fundis" ON public.fundis
  FOR SELECT USING (status = 'active');

CREATE POLICY "Fundis can view their own profile" ON public.fundis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Fundis can update their own profile" ON public.fundis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create fundi profiles" ON public.fundis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, phone, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_fundi_id ON public.bookings(fundi_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_reference ON public.bookings(payment_reference);
CREATE INDEX IF NOT EXISTS idx_fundis_location ON public.fundis(location);
CREATE INDEX IF NOT EXISTS idx_fundis_skill ON public.fundis(skill);
CREATE INDEX IF NOT EXISTS idx_fundis_status ON public.fundis(status);
