// Browser Console Test for Supabase Connection
// Copy and paste this code into your browser's developer console on localhost:3000

console.log('🔍 Testing Supabase Connection from Browser...');

// Test if Supabase client is available
if (typeof window.supabase !== 'undefined') {
  console.log('✅ Supabase client found');
  testSupabaseConnection();
} else {
  console.log('❌ Supabase client not found. Make sure you are on the Account page.');
}

async function testSupabaseConnection() {
  try {
    console.log('\n📊 Testing database tables...');
    
    // Test users table
    console.log('\n1. Testing users table...');
    const { data: users, error: usersError } = await window.supabase
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
    const { data: plans, error: plansError } = await window.supabase
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
    
    // Test insert operation
    console.log('\n3. Testing insert operation...');
    const testUser = {
      wallet_address: 'test-wallet-' + Date.now(),
      balance: 1000,
      total_deposits: 1000,
      total_withdrawals: 0,
      total_trades: 0,
      total_profit: 0,
      is_active: true
    };
    
    const { data: insertData, error: insertError } = await window.supabase
      .from('users')
      .insert([testUser])
      .select();
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert test successful!');
      console.log('   Created user ID:', insertData[0].id);
      
      // Clean up test data
      await window.supabase
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

// Alternative test if Supabase is not globally available
async function testWithImport() {
  try {
    // Try to import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = 'https://iyjvblxyefhbnzounucv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5anZibHh5ZWZoYm56b3VudWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTYzMzAsImV4cCI6MjA3NjQ3MjMzMH0.yoGkt2QmiufbRHkAJ7cqgrQOOqX8c--7faaCdicc8Gk';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('✅ Supabase client created successfully');
    
    // Test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection successful!');
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

// Instructions
console.log('\n📋 Instructions:');
console.log('1. Go to your React app at http://localhost:3000');
console.log('2. Navigate to the Account page');
console.log('3. Open Developer Tools (F12)');
console.log('4. Go to Console tab');
console.log('5. Copy and paste this entire script');
console.log('6. Press Enter to run the test');


