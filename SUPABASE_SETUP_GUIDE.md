# Supabase Integration Setup Guide

## Overview

This guide will help you integrate your React application with Supabase and set up the required database tables.

## Step 1: Install Supabase Client Library ✅

The Supabase client library has been installed successfully:
```bash
npm install @supabase/supabase-js
```

## Step 2: Configure Environment Variables

### Create .env File

Create a `.env` file in your project root with the following content:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
```

### Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** > **API**
3. Copy the following values:
   - **Project URL** → Use as `REACT_APP_SUPABASE_URL`
   - **anon public** key → Use as `REACT_APP_SUPABASE_ANON_KEY`

### Example .env File

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.example-key-here
```

## Step 3: Supabase Client Configuration ✅

The Supabase client has been configured in `src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
```

## Step 4: Create Database Tables in Supabase

### Navigate to Table Editor

1. Go to your Supabase project dashboard
2. Click on the **"Table Editor"** icon in the left sidebar

### Create the `users` Table

1. Click **"New table"**
2. Name the table: `users`
3. Add the following columns:

| Column Name | Data Type | Constraints | Default Value |
|-------------|-----------|-------------|---------------|
| `id` | `uuid` | Primary Key | `uuid_generate_v4()` |
| `wallet_address` | `text` | Unique | - |
| `balance` | `numeric` | - | `0` |
| `created_at` | `timestamptz` | - | `now()` |
| `updated_at` | `timestamptz` | - | `now()` |
| `total_deposits` | `numeric` | - | `0` |
| `total_withdrawals` | `numeric` | - | `0` |
| `total_trades` | `integer` | - | `0` |
| `total_profit` | `numeric` | - | `0` |
| `is_active` | `boolean` | - | `true` |

### Create the `trading_plans` Table

1. Click **"New table"**
2. Name the table: `trading_plans`
3. Add the following columns:

| Column Name | Data Type | Constraints | Default Value |
|-------------|-----------|-------------|---------------|
| `id` | `uuid` | Primary Key | `uuid_generate_v4()` |
| `user_id` | `uuid` | Foreign Key → `users.id` | - |
| `investment_amount` | `numeric` | - | - |
| `asset_symbol` | `text` | - | - |
| `status` | `text` | - | `'active'` |
| `created_at` | `timestamptz` | - | `now()` |
| `duration_hours` | `integer` | - | - |
| `yield_range_min` | `numeric` | - | - |
| `yield_range_max` | `numeric` | - | - |
| `profit_amount` | `numeric` | Nullable | - |
| `total_return` | `numeric` | Nullable | - |
| `final_yield` | `numeric` | Nullable | - |
| `completed_at` | `timestamptz` | Nullable | - |

### Enable Row Level Security (RLS)

For both tables:

1. Click on the table name in the Table Editor
2. Go to the **"Settings"** tab
3. Enable **"Row Level Security"**
4. **Do not add policies yet** - this will be configured later

## Step 5: Test the Connection

### Create a Test Component

Create a simple test to verify the Supabase connection:

```javascript
// src/components/SupabaseTest.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [tables, setTables] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        setConnectionStatus(`❌ Connection failed: ${error.message}`);
      } else {
        setConnectionStatus('✅ Supabase connection successful!');
        loadTables();
      }
    } catch (err) {
      setConnectionStatus(`❌ Connection error: ${err.message}`);
    }
  };

  const loadTables = async () => {
    try {
      // Test users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      // Test trading_plans table
      const { data: plans, error: plansError } = await supabase
        .from('trading_plans')
        .select('*')
        .limit(5);

      setTables([
        { name: 'users', count: users?.length || 0, error: usersError?.message },
        { name: 'trading_plans', count: plans?.length || 0, error: plansError?.message }
      ]);
    } catch (err) {
      console.error('Error loading tables:', err);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Supabase Connection Test</h3>
      
      <div className="mb-4">
        <p className="font-semibold">Connection Status:</p>
        <p>{connectionStatus}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Tables Status:</p>
        {tables.map((table, index) => (
          <div key={index} className="ml-4">
            <p>
              {table.error ? '❌' : '✅'} {table.name}: {table.count} records
              {table.error && <span className="text-red-600"> ({table.error})</span>}
            </p>
          </div>
        ))}
      </div>

      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Connection Again
      </button>
    </div>
  );
};

export default SupabaseTest;
```

## Step 6: Next Steps

After completing the setup:

1. **Add the test component** to your app to verify the connection
2. **Update your existing database service** to use Supabase instead of Firebase
3. **Implement Row Level Security policies** for data protection
4. **Set up authentication** if needed
5. **Deploy your application** with the new Supabase backend

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Ensure `.env` file is in the project root
   - Restart your development server after adding environment variables
   - Check that variable names start with `REACT_APP_`

2. **Connection errors**:
   - Verify your Supabase URL and API key are correct
   - Check that your Supabase project is active
   - Ensure tables exist and have the correct structure

3. **Table access errors**:
   - Verify Row Level Security is enabled
   - Check that you have the correct permissions
   - Ensure foreign key relationships are properly set up

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the [React Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

## Summary

✅ Supabase client library installed  
✅ Client configuration created  
✅ Environment variables template provided  
✅ Database schema defined  
✅ Setup guide completed  

**Next**: Add your Supabase credentials to the `.env` file and create the database tables in your Supabase dashboard.

