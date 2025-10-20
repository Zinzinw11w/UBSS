// Test script to verify Supabase connection and database tables
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📊 Testing database tables...');
    
    // Test users table
    console.log('\n1. Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
      console.log(`   Records found: ${users.length}`);
      if (users.length > 0) {
        console.log('   Sample user:', {
          id: users[0].id,
          wallet_address: users[0].wallet_address,
          balance: users[0].balance
        });
      }
    }
    
    // Test trading_plans table
    console.log('\n2. Testing trading_plans table...');
    const { data: plans, error: plansError } = await supabase
      .from('trading_plans')
      .select('*')
      .limit(5);
    
    if (plansError) {
      console.log('❌ Trading plans table error:', plansError.message);
    } else {
      console.log('✅ Trading plans table accessible');
      console.log(`   Records found: ${plans.length}`);
      if (plans.length > 0) {
        console.log('   Sample plan:', {
          id: plans[0].id,
          user_id: plans[0].user_id,
          asset_symbol: plans[0].asset_symbol,
          status: plans[0].status
        });
      }
    }
    
    // Test deposits table
    console.log('\n3. Testing deposits table...');
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('*')
      .limit(5);
    
    if (depositsError) {
      console.log('❌ Deposits table error:', depositsError.message);
    } else {
      console.log('✅ Deposits table accessible');
      console.log(`   Records found: ${deposits.length}`);
    }
    
    // Test withdrawals table
    console.log('\n4. Testing withdrawals table...');
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .limit(5);
    
    if (withdrawalsError) {
      console.log('❌ Withdrawals table error:', withdrawalsError.message);
    } else {
      console.log('✅ Withdrawals table accessible');
      console.log(`   Records found: ${withdrawals.length}`);
    }
    
    // Test trades table
    console.log('\n5. Testing trades table...');
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .limit(5);
    
    if (tradesError) {
      console.log('❌ Trades table error:', tradesError.message);
    } else {
      console.log('✅ Trades table accessible');
      console.log(`   Records found: ${trades.length}`);
    }
    
    // Test chat_messages table
    console.log('\n6. Testing chat_messages table...');
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .limit(5);
    
    if (messagesError) {
      console.log('❌ Chat messages table error:', messagesError.message);
    } else {
      console.log('✅ Chat messages table accessible');
      console.log(`   Records found: ${messages.length}`);
    }
    
    // Test insert operation
    console.log('\n7. Testing insert operation...');
    const testUser = {
      wallet_address: 'test-wallet-' + Date.now(),
      balance: 1000,
      total_deposits: 1000,
      total_withdrawals: 0,
      total_trades: 0,
      total_profit: 0,
      is_active: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert test successful!');
      console.log('   Created user ID:', insertData[0].id);
      
      // Clean up test data
      await supabase
        .from('users')
        .delete()
        .eq('id', insertData[0].id);
      console.log('   Test data cleaned up');
    }
    
    console.log('\n🎉 Supabase connection test completed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();

