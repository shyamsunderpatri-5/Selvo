-- ReelScript Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  scripts_used INTEGER DEFAULT 0,
  scripts_limit INTEGER DEFAULT 3,
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripts table
CREATE TABLE IF NOT EXISTS public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  tone TEXT NOT NULL,
  duration INTEGER NOT NULL,
  hooks JSONB,
  script TEXT,
  caption TEXT,
  hashtags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON public.scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON public.scripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Users: Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Scripts: Users can only see/edit their own scripts
CREATE POLICY "Users can view own scripts" ON public.scripts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scripts" ON public.scripts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts" ON public.scripts
  FOR DELETE USING (auth.uid() = user_id);

-- Function to increment script usage
CREATE OR REPLACE FUNCTION increment_script_usage(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET scripts_used = scripts_used + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily scripts (run via cron job)
CREATE OR REPLACE FUNCTION reset_daily_scripts()
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET scripts_used = 0,
      updated_at = NOW()
  WHERE is_pro = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment usage on script creation
CREATE OR REPLACE FUNCTION on_script_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM increment_script_usage(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_script_usage
  AFTER INSERT ON public.scripts
  FOR EACH ROW
  EXECUTE FUNCTION on_script_created();

-- Enable realtime for scripts
ALTER PUBLICATION supabase_realtime ADD TABLE public.scripts;
