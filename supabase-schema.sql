-- Supabase Database Schema for UBSS Trading Platform
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    balance NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    total_deposits NUMERIC DEFAULT 0,
    total_withdrawals NUMERIC DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    total_profit NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create trading_plans table
CREATE TABLE IF NOT EXISTS trading_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investment_amount NUMERIC NOT NULL,
    asset_symbol TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    duration_hours INTEGER NOT NULL,
    yield_range_min NUMERIC NOT NULL,
    yield_range_max NUMERIC NOT NULL,
    profit_amount NUMERIC,
    total_return NUMERIC,
    final_yield NUMERIC,
    completed_at TIMESTAMPTZ
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    tx_hash TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    rejected_at TIMESTAMPTZ,
    rejected_by UUID,
    rejection_reason TEXT
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    wallet_address TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    rejected_at TIMESTAMPTZ,
    rejected_by UUID,
    rejection_reason TEXT
);

-- Create trades table (for compatibility with existing system)
CREATE TABLE IF NOT EXISTS trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT,
    asset TEXT,
    amount NUMERIC,
    trade_type TEXT,
    leverage NUMERIC DEFAULT 1,
    entry_price NUMERIC,
    current_price NUMERIC,
    close_price NUMERIC,
    status TEXT DEFAULT 'open',
    profit NUMERIC DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0,
    today_earnings NUMERIC DEFAULT 0,
    daily_ror TEXT,
    type TEXT DEFAULT 'Smart Trading',
    timeframe TEXT,
    direction TEXT,
    open_price NUMERIC,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    run_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    is_smart_trade BOOLEAN DEFAULT FALSE,
    balance_at_creation NUMERIC,
    order_amount NUMERIC,
    validated_at TIMESTAMPTZ
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_trading_plans_user_id ON trading_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_plans_status ON trading_plans(status);
CREATE INDEX IF NOT EXISTS idx_trading_plans_created_at ON trading_plans(created_at);
CREATE INDEX IF NOT EXISTS idx_trading_plans_completed_at ON trading_plans(completed_at);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_wallet_address ON trades(wallet_address);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - customize as needed)

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Trading plans policies
CREATE POLICY "Users can view own trading plans" ON trading_plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own trading plans" ON trading_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own trading plans" ON trading_plans
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Deposits policies
CREATE POLICY "Users can view own deposits" ON deposits
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own deposits" ON deposits
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals" ON withdrawals
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own withdrawals" ON withdrawals
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Trades policies
CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own trades" ON trades
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
INSERT INTO users (wallet_address, balance, total_deposits) VALUES
('0x1234567890123456789012345678901234567890', 10000, 10000),
('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 5000, 5000)
ON CONFLICT (wallet_address) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully!' as message;

