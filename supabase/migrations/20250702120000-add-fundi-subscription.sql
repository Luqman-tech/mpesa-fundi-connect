-- Add subscription fields to fundis table
ALTER TABLE fundis ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT FALSE;
ALTER TABLE fundis ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMP;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundi_id UUID REFERENCES fundis(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  payment_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
); 