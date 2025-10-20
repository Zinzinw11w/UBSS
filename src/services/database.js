import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp, 
  increment,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';
import axios from 'axios';
import { supabase } from '../supabaseClient';

// Backend routing flags (temporary while migrating)
export const USE_SUPABASE_PLANS = true;
export const USE_SUPABASE_TRADES = true;

// =========================
// Supabase Helpers (Users)
// =========================
export const supabaseEnsureUser = async (walletAddress) => {
  const lower = walletAddress.toLowerCase();
  // Try find existing
  const { data: existing, error: findErr } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', lower)
    .limit(1)
    .maybeSingle();
  if (findErr && findErr.code !== 'PGRST116') throw findErr;
  if (existing) return existing;

  // Create new
  const { data: created, error: createErr } = await supabase
    .from('users')
    .insert([{ wallet_address: lower, balance: 0 }])
    .select()
    .single();
  if (createErr) throw createErr;
  return created;
};

export const supabaseGetUserByWallet = async (walletAddress) => {
  const lower = walletAddress.toLowerCase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', lower)
    .limit(1)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

// ==================================
// Supabase Smart Trading Plan methods
// ==================================
export const createTradingPlanSupabase = async (walletAddress, planData, currentBalanceOverride) => {
  // Ensure user row
  const userRow = await supabaseEnsureUser(walletAddress);
  let currentBalance = Number(userRow.balance || 0);
  // If Supabase user has no balance yet but the app knows current balance, seed it
  if ((currentBalance === 0 || Number.isNaN(currentBalance)) && typeof currentBalanceOverride === 'number') {
    currentBalance = Number(currentBalanceOverride) || 0;
    await supabase
      .from('users')
      .update({ balance: currentBalance })
      .eq('id', userRow.id);
  }
  const planAmount = Number(planData.amount || 0);

  if (currentBalance < planAmount) {
    return {
      success: false,
      error: 'INSUFFICIENT_FUNDS',
      currentBalance,
      requiredAmount: planAmount,
      shortfall: planAmount - currentBalance
    };
  }

  const days = parseInt((planData.timeframe || '1 Day').split(' ')[0]) || 1;
  const durationHours = days * 24;
  const yieldRange = days === 1 ? [1.5, 1.8]
    : days === 7 ? [1.8, 2.1]
    : days === 15 ? [2.1, 2.5]
    : days === 30 ? [2.5, 2.8]
    : days === 60 ? [2.8, 3.0]
    : [1.5, 3.0];

  // Insert plan
  const insertPayload = {
    user_id: userRow.id,
    investment_amount: planAmount,
    asset_symbol: planData.symbol || 'AAPL',
    status: 'active',
    duration_hours: durationHours,
    yield_range_min: yieldRange[0],
    yield_range_max: yieldRange[1]
  };

  const { data: planRows, error: planErr } = await supabase
    .from('trading_plans')
    .insert([insertPayload])
    .select()
    .single();
  if (planErr) throw planErr;

  // Deduct balance (non-transactional client-side step)
  const { error: updErr } = await supabase
    .from('users')
    .update({ balance: currentBalance - planAmount })
    .eq('id', userRow.id);
  if (updErr) throw updErr;

  const planId = planRows.id;
  return {
    success: true,
    planId,
    newBalance: currentBalance - planAmount,
    planData: {
      id: planId,
      userId: userRow.id,
      investmentAmount: planAmount,
      assetSymbol: insertPayload.asset_symbol,
      status: 'active',
      durationHours,
      yieldRange
    }
  };
};

export const supabaseListUserActivePlans = async (userId) => {
  const { data, error } = await supabase
    .from('trading_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const supabaseSubscribeToUserTradingPlans = (userId, onChange) => {
  const channel = supabase.channel(`plans_${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trading_plans', filter: `user_id=eq.${userId}` }, async () => {
      const list = await supabaseListUserActivePlans(userId);
      onChange(list);
    })
    .subscribe();

  // Initial load
  supabaseListUserActivePlans(userId).then(onChange).catch(() => {});

  return () => {
    supabase.removeChannel(channel);
  };
};

// Get user's IP address
export const getUserIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'Unknown';
  }
};

// User Management
export const createUser = async (walletAddress, walletType) => {
  try {
    const ipAddress = await getUserIP();
    const userData = {
      walletAddress: walletAddress.toLowerCase(),
      walletType,
      ipAddress,
      createdAt: serverTimestamp(),
      balance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTrades: 0,
      totalProfit: 0,
      isActive: true,
      lastLogin: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'users'), userData);
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByWallet = async (walletAddress) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('walletAddress', '==', walletAddress.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId, amount, type = 'deposit') => {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData = {
      balance: increment(amount),
      lastUpdated: serverTimestamp()
    };

    if (type === 'deposit') {
      updateData.totalDeposits = increment(amount);
    } else if (type === 'withdrawal') {
      updateData.totalWithdrawals = increment(amount);
    }

    await updateDoc(userRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

// Deposit Management
export const createDeposit = async (userId, amount, currency, txHash) => {
  try {
    // Validate txHash before proceeding
    if (!txHash || txHash.trim() === '') {
      throw new Error('Transaction hash is required');
    }
    
    const depositData = {
      userId,
      amount: parseFloat(amount),
      currency: currency?.toUpperCase() || 'USD',
      txHash: txHash.trim(), // Ensure it's trimmed and not undefined
      status: 'pending',
      createdAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null
    };

    const docRef = await addDoc(collection(db, 'deposits'), depositData);
    return { id: docRef.id, ...depositData };
  } catch (error) {
    console.error('Error creating deposit:', error);
    throw error;
  }
};

export const approveDeposit = async (depositId, adminId) => {
  try {
    const depositRef = doc(db, 'deposits', depositId);
    
    // Use Firestore transaction to ensure atomicity
    await runTransaction(db, async (transaction) => {
      const depositDoc = await transaction.get(depositRef);
      
      if (!depositDoc.exists()) {
        throw new Error('Deposit not found');
      }

      const depositData = depositDoc.data();
      const userRef = doc(db, 'users', depositData.userId);
      
      // Update 1: Change deposit status from 'pending' to 'approved'
      transaction.update(depositRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: adminId
      });

      // Update 2: Increment user's balance by deposit amount
      transaction.update(userRef, {
        balance: increment(depositData.amount),
        totalDeposits: increment(depositData.amount),
        lastUpdated: serverTimestamp()
      });
    });

    console.log('Deposit approved successfully with transaction');
    return true;
  } catch (error) {
    console.error('Error approving deposit:', error);
    throw error;
  }
};

export const rejectDeposit = async (depositId, adminId, reason) => {
  try {
    const depositRef = doc(db, 'deposits', depositId);
    await updateDoc(depositRef, {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectedBy: adminId,
      rejectionReason: reason
    });

    return true;
  } catch (error) {
    console.error('Error rejecting deposit:', error);
    throw error;
  }
};

// Withdrawal Management
export const createWithdrawal = async (userId, amount, currency, walletAddress) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    if (userData.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const withdrawalData = {
      userId,
      amount: parseFloat(amount),
      currency: currency?.toUpperCase() || 'USD',
      walletAddress,
      status: 'pending',
      createdAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null
    };

    const docRef = await addDoc(collection(db, 'withdrawals'), withdrawalData);
    return { id: docRef.id, ...withdrawalData };
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    throw error;
  }
};

export const approveWithdrawal = async (withdrawalId, adminId) => {
  try {
    const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
    const withdrawalDoc = await getDoc(withdrawalRef);
    
    if (!withdrawalDoc.exists()) {
      throw new Error('Withdrawal not found');
    }

    const withdrawalData = withdrawalDoc.data();
    
    // Update withdrawal status
    await updateDoc(withdrawalRef, {
      status: 'approved',
      approvedAt: serverTimestamp(),
      approvedBy: adminId
    });

    // Deduct from user balance
    await updateUserBalance(withdrawalData.userId, -withdrawalData.amount, 'withdrawal');

    return true;
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    throw error;
  }
};

export const rejectWithdrawal = async (withdrawalId, adminId, reason) => {
  try {
    const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
    await updateDoc(withdrawalRef, {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectedBy: adminId,
      rejectionReason: reason
    });

    return true;
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    throw error;
  }
};

// Trading System
export const createTrade = async (userId, asset, amount, tradeType, leverage = 1) => {
  try {
    if (USE_SUPABASE_TRADES) {
      // Load user row
      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (userErr) throw userErr;
      const currentBalance = Number(userRow.balance || 0);
      if (currentBalance < amount) throw new Error('Insufficient balance');

      const currentPrice = await getRealTimePrice(asset);
      const insert = {
        user_id: userId,
        asset: (asset || 'BTC').toUpperCase(),
        amount: Number(amount),
        trade_type: tradeType,
        leverage: Number(leverage),
        entry_price: currentPrice,
        current_price: currentPrice,
        status: 'open',
        profit: 0
      };
      const { data: row, error: insErr } = await supabase
        .from('trades')
        .insert([insert])
        .select()
        .single();
      if (insErr) throw insErr;

      const { error: balErr } = await supabase
        .from('users')
        .update({ balance: currentBalance - Number(amount) })
        .eq('id', userId);
      if (balErr) throw balErr;

      return {
        id: row.id,
        userId,
        asset: row.asset,
        amount: row.amount,
        tradeType: row.trade_type,
        leverage: row.leverage,
        entryPrice: row.entry_price,
        currentPrice: row.current_price,
        status: row.status,
        profit: row.profit,
        createdAt: row.created_at
      };
    } else {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      const userData = userDoc.data();
      if (userData.balance < amount) {
        throw new Error('Insufficient balance');
      }
      const currentPrice = await getRealTimePrice(asset);
      const tradeData = {
        userId,
        asset: asset?.toUpperCase() || 'BTC',
        amount: parseFloat(amount),
        tradeType,
        leverage: parseFloat(leverage),
        entryPrice: currentPrice,
        currentPrice,
        status: 'open',
        profit: 0,
        createdAt: serverTimestamp(),
        closedAt: null,
        isSmartTrade: false
      };
      const docRef = await addDoc(collection(db, 'trades'), tradeData);
      await updateUserBalance(userId, -amount);
      return { id: docRef.id, ...tradeData };
    }
  } catch (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
};

export const createSmartTrade = async (userId, asset, amount, tradeType, leverage = 1) => {
  try {
    const tradeData = await createTrade(userId, asset, amount, tradeType, leverage);
    
    // Update trade to mark as smart trade
    const tradeRef = doc(db, 'trades', tradeData.id);
    await updateDoc(tradeRef, {
      isSmartTrade: true
    });

    return { ...tradeData, isSmartTrade: true };
  } catch (error) {
    console.error('Error creating smart trade:', error);
    throw error;
  }
};

// Rate limiting to prevent spam orders
const orderRateLimit = new Map();

export const checkRateLimit = (walletAddress) => {
  const now = Date.now();
  const userOrders = orderRateLimit.get(walletAddress) || [];
  
  // Remove orders older than 1 minute
  const recentOrders = userOrders.filter(timestamp => now - timestamp < 60000);
  
  // Check if user has made more than 3 orders in the last minute
  if (recentOrders.length >= 3) {
    return false; // Rate limit exceeded
  }
  
  // Add current order timestamp
  recentOrders.push(now);
  orderRateLimit.set(walletAddress, recentOrders);
  
  return true; // Rate limit OK
};

// Trading Plan Creation with Balance Deduction
export const createTradingPlan = async (walletAddress, planData) => {
  try {
    console.log('Creating trading plan for wallet:', walletAddress);
    console.log('Plan data:', planData);
    
    // Check rate limiting first
    if (!checkRateLimit(walletAddress)) {
      return {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many orders. Please wait before creating another order.'
      };
    }
    
    // Get user data
    const userQuery = query(
      collection(db, 'users'),
      where('walletAddress', '==', walletAddress.toLowerCase())
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      throw new Error('User not found');
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const currentBalance = userData.balance || 0;
    const planAmount = planData.amount || 0;
    
    console.log('Current balance:', currentBalance);
    console.log('Plan amount:', planAmount);
    
    // Server-side balance validation
    if (currentBalance < planAmount) {
      console.log('Insufficient balance detected');
      return {
        success: false,
        error: 'INSUFFICIENT_FUNDS',
        currentBalance,
        requiredAmount: planAmount,
        shortfall: planAmount - currentBalance
      };
    }
    
    // Convert timeframe to hours
    const timeframeHours = parseInt(planData.timeframe.split(' ')[0]) * 24;
    
    // Get yield range based on timeframe
    const getYieldRange = (timeframe) => {
      const days = parseInt(timeframe.split(' ')[0]);
      if (days === 1) {
        return [1.50, 1.80];
      } else if (days === 7) {
        return [1.80, 2.10];
      } else if (days === 15) {
        return [2.10, 2.50];
      } else if (days === 30) {
        return [2.50, 2.80];
      } else if (days === 60) {
        return [2.80, 3.00];
      } else {
        return [1.50, 3.00];
      }
    };
    
    const yieldRange = getYieldRange(planData.timeframe);
    
    // Create trading plan document
    const planWithValidation = {
      userId: userDoc.id,
      investmentAmount: planAmount,
      assetSymbol: planData.symbol || 'AAPL',
      status: 'active',
      createdAt: serverTimestamp(),
      durationHours: timeframeHours,
      yieldRange: yieldRange,
      // Additional fields for compatibility
      symbol: planData.symbol,
      amount: planAmount,
      timeframe: planData.timeframe,
      direction: planData.direction,
      openPrice: planData.openPrice,
      closePrice: null,
      profit: 0,
      type: 'Smart Trading',
      startTime: planData.startTime,
      endTime: planData.endTime,
      walletAddress: walletAddress.toLowerCase(),
      balanceAtCreation: currentBalance
    };
    
    // Use Firestore transaction to ensure data integrity
    const result = await runTransaction(db, async (transaction) => {
      // Create trading plan document
      const planRef = doc(collection(db, 'trading_plans'));
      transaction.set(planRef, planWithValidation);
      
      // Update user's balance (deduct the plan amount)
      const userRef = doc(db, 'users', userDoc.id);
      transaction.update(userRef, {
        balance: increment(-planAmount),
        totalTrades: increment(1),
        lastTradeAt: serverTimestamp()
      });
      
      return planRef.id;
    });
    
    console.log('Trading plan created successfully:', result);
    
    return {
      success: true,
      planId: result,
      newBalance: currentBalance - planAmount,
      planData: { ...planWithValidation, id: result }
    };
    
  } catch (error) {
    console.error('Error creating trading plan:', error);
    throw error;
  }
};

// Balance Validation and Order Creation with Real-time Alerts
export const validateBalanceAndCreateTrade = async (walletAddress, tradeData) => {
  try {
    console.log('Validating balance for wallet:', walletAddress);
    console.log('Trade data:', tradeData);
    
    // Check rate limiting first
    if (!checkRateLimit(walletAddress)) {
      return {
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many orders. Please wait before creating another order.'
      };
    }
    
    // Get user data
    const userQuery = query(
      collection(db, 'users'),
      where('walletAddress', '==', walletAddress.toLowerCase())
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      throw new Error('User not found');
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const currentBalance = userData.balance || 0;
    const orderAmount = tradeData.amount || 0;
    
    console.log('Current balance:', currentBalance);
    console.log('Order amount:', orderAmount);
    
    // Server-side balance validation
    if (currentBalance < orderAmount) {
      console.log('Insufficient balance detected');
      return {
        success: false,
        error: 'INSUFFICIENT_FUNDS',
        currentBalance,
        requiredAmount: orderAmount,
        shortfall: orderAmount - currentBalance
      };
    }
    
    // Balance is sufficient - create the trade
    const tradeWithValidation = {
      ...tradeData,
      walletAddress: walletAddress.toLowerCase(),
      status: 'Active', // Set to Active since balance is sufficient
      createdAt: serverTimestamp(),
      validatedAt: serverTimestamp(),
      balanceAtCreation: currentBalance,
      orderAmount: orderAmount,
      // Add realistic profit calculations
      profit: 0, // Will be calculated when trade completes
      totalRevenue: 0, // Will accumulate over time
      todayEarnings: 0, // Daily earnings for Smart Trading
      dailyRor: tradeData.timeframe === '1 Day' ? '2.5%-3.0%' : 
                tradeData.timeframe === '7 Days' ? '1.8%-2.1%' :
                tradeData.timeframe === '15 Days' ? '1.5%-1.8%' :
                tradeData.timeframe === '30 Days' ? '1.2%-1.5%' : '1.0%-1.3%'
    };
    
    // Create trade document
    const tradeRef = await addDoc(collection(db, 'trades'), tradeWithValidation);
    
    // Update user's balance (deduct the order amount)
    await updateDoc(doc(db, 'users', userDoc.id), {
      balance: increment(-orderAmount),
      totalTrades: increment(1),
      lastTradeAt: serverTimestamp()
    });
    
    console.log('Trade created successfully:', tradeRef.id);
    
    return {
      success: true,
      tradeId: tradeRef.id,
      newBalance: currentBalance - orderAmount,
      tradeData: { ...tradeWithValidation, id: tradeRef.id }
    };
    
  } catch (error) {
    console.error('Error validating balance and creating trade:', error);
    throw error;
  }
};

export const closeTrade = async (tradeId) => {
  try {
    const tradeRef = doc(db, 'trades', tradeId);
    const tradeDoc = await getDoc(tradeRef);
    
    if (!tradeDoc.exists()) {
      throw new Error('Trade not found');
    }

    const tradeData = tradeDoc.data();
    
    // For Smart Trading orders, calculate realistic profit
    if (tradeData.type === 'Smart Trading') {
      const days = parseInt(tradeData.timeframe?.split(' ')[0]) || 1;
      const baseAmount = tradeData.amount || tradeData.orderAmount || 0;
      
      // More realistic profit calculation
      let profitRate;
      if (days === 1) {
        profitRate = Math.random() * 0.03 + 0.025; // 2.5% to 5.5%
      } else if (days === 7) {
        profitRate = Math.random() * 0.03 + 0.018; // 1.8% to 4.8%
      } else if (days === 15) {
        profitRate = Math.random() * 0.03 + 0.015; // 1.5% to 4.5%
      } else if (days === 30) {
        profitRate = Math.random() * 0.025 + 0.012; // 1.2% to 3.7%
      } else {
        profitRate = Math.random() * 0.02 + 0.01; // 1.0% to 3.0%
      }
      
      const finalProfit = baseAmount * profitRate;
      
      await updateDoc(tradeRef, {
        status: 'completed',
        closePrice: tradeData.openPrice * (1 + profitRate),
        profit: finalProfit,
        totalRevenue: finalProfit,
        closedAt: serverTimestamp()
      });
      
      // Add profit back to user balance
      await updateUserBalance(tradeData.walletAddress, finalProfit, 'profit');
    } else {
      // Original logic for other trade types
      const currentPrice = await getRealTimePrice(tradeData.asset);
      
      // Calculate profit
      let profit = 0;
      if (tradeData.tradeType === 'buy') {
        profit = (currentPrice - tradeData.entryPrice) * tradeData.amount * tradeData.leverage;
      } else {
        profit = (tradeData.entryPrice - currentPrice) * tradeData.amount * tradeData.leverage;
      }

      // Update trade
      await updateDoc(tradeRef, {
        status: 'closed',
        currentPrice,
        profit,
        closedAt: serverTimestamp()
      });

      // Update user balance with profit
      await updateUserBalance(tradeData.userId, profit);
    }

    return true;
  } catch (error) {
    console.error('Error closing trade:', error);
    throw error;
  }
};

// Function to simulate daily profit updates for active Smart Trading orders
export const updateActiveTradeProfits = async () => {
  try {
    const tradesQuery = query(
      collection(db, 'trades'),
      where('status', '==', 'Active'),
      where('type', '==', 'Smart Trading')
    );
    const tradesSnapshot = await getDocs(tradesQuery);
    
    const updatePromises = tradesSnapshot.docs.map(async (tradeDoc) => {
      const tradeData = tradeDoc.data();
      const tradeRef = doc(db, 'trades', tradeDoc.id);
      
      // Calculate daily earnings based on timeframe
      const days = parseInt(tradeData.timeframe?.split(' ')[0]) || 1;
      const baseAmount = tradeData.amount || tradeData.orderAmount || 0;
      
      let dailyRate;
      if (days === 1) {
        dailyRate = 0.03; // 3% daily
      } else if (days === 7) {
        dailyRate = 0.0025; // 0.25% daily
      } else if (days === 15) {
        dailyRate = 0.0015; // 0.15% daily
      } else if (days === 30) {
        dailyRate = 0.0012; // 0.12% daily
      } else {
        dailyRate = 0.001; // 0.1% daily
      }
      
      const dailyEarnings = baseAmount * dailyRate;
      const currentTotalRevenue = tradeData.totalRevenue || 0;
      
      await updateDoc(tradeRef, {
        todayEarnings: dailyEarnings,
        totalRevenue: currentTotalRevenue + dailyEarnings,
        profit: currentTotalRevenue + dailyEarnings
      });
    });
    
    await Promise.all(updatePromises);
    console.log('Updated active Smart Trading profits');
  } catch (error) {
    console.error('Error updating active trade profits:', error);
  }
};

// Real-time Price API
export const getRealTimePrice = async (asset) => {
  try {
    let price = 0;
    
    if (asset?.toUpperCase().includes('BTC')) {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      price = response.data.bitcoin.usd;
    } else if (asset?.toUpperCase().includes('ETH')) {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      price = response.data.ethereum.usd;
    } else if (asset?.toUpperCase().includes('EUR')) {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      price = 1 / response.data.rates.EUR;
    } else if (asset?.toUpperCase().includes('GBP')) {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      price = 1 / response.data.rates.GBP;
    } else {
      // Default to random price for other assets
      price = Math.random() * 1000 + 100;
    }

    return price;
  } catch (error) {
    console.error('Error fetching real-time price:', error);
    // Fallback to random price
    return Math.random() * 1000 + 100;
  }
};

// Get user orders/trades
export const getUserTrades = async (userId) => {
  try {
    if (USE_SUPABASE_TRADES) {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        asset: row.asset,
        amount: row.amount,
        tradeType: row.trade_type,
        leverage: row.leverage,
        entryPrice: row.entry_price,
        currentPrice: row.current_price,
        closePrice: row.close_price,
        status: row.status,
        profit: row.profit,
        createdAt: row.created_at,
        closedAt: row.closed_at
      }));
    } else {
      const q = query(
        collection(db, 'trades'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.error('Error getting user trades:', error);
    throw error;
  }
};

export const getUserDeposits = async (userId) => {
  try {
    const q = query(
      collection(db, 'deposits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user deposits:', error);
    throw error;
  }
};

export const getUserWithdrawals = async (userId) => {
  try {
    const q = query(
      collection(db, 'withdrawals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user withdrawals:', error);
    throw error;
  }
};

// Admin functions
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const getAllDeposits = async () => {
  try {
    const q = query(collection(db, 'deposits'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all deposits:', error);
    throw error;
  }
};

export const getAllWithdrawals = async () => {
  try {
    const q = query(collection(db, 'withdrawals'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all withdrawals:', error);
    throw error;
  }
};

export const getAllTrades = async () => {
  try {
    const q = query(collection(db, 'trades'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all trades:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToUserTrades = (userId, callback) => {
  try {
    if (USE_SUPABASE_TRADES) {
      const channel = supabase.channel(`trades_${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trades', filter: `user_id=eq.${userId}` }, async () => {
          const { data, error } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          if (!error) {
            const mapped = (data || []).map(row => ({
              id: row.id,
              userId: row.user_id,
              asset: row.asset,
              amount: row.amount,
              tradeType: row.trade_type,
              leverage: row.leverage,
              entryPrice: row.entry_price,
              currentPrice: row.current_price,
              closePrice: row.close_price,
              status: row.status,
              profit: row.profit,
              createdAt: row.created_at,
              closedAt: row.closed_at
            }));
            callback({ docs: mapped.map(x => ({ id: x.id, data: () => x })) });
          }
        })
        .subscribe();
      // Initial emit
      supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          const mapped = (data || []).map(row => ({
            id: row.id,
            userId: row.user_id,
            asset: row.asset,
            amount: row.amount,
            tradeType: row.trade_type,
            leverage: row.leverage,
            entryPrice: row.entry_price,
            currentPrice: row.current_price,
            closePrice: row.close_price,
            status: row.status,
            profit: row.profit,
            createdAt: row.created_at,
            closedAt: row.closed_at
          }));
          callback({ docs: mapped.map(x => ({ id: x.id, data: () => x })) });
        });
      return () => { supabase.removeChannel(channel); };
    } else {
      const q = query(
        collection(db, 'trades'),
        where('walletAddress', '==', userId.toLowerCase())
      );
      return onSnapshot(q, callback, (error) => {
        console.error('Error in subscribeToUserTrades:', error);
      });
    }
  } catch (error) {
    console.error('Error setting up subscribeToUserTrades:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};

export const subscribeToUserBalance = (userId, callback) => {
  try {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, callback, (error) => {
      console.error('Error in subscribeToUserBalance:', error);
    });
  } catch (error) {
    console.error('Error setting up subscribeToUserBalance:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};

// Subscribe to user's trading plans
export const subscribeToUserTradingPlans = (userId, callback) => {
  try {
    const q = query(
      collection(db, 'trading_plans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, callback, (error) => {
      console.error('Error in subscribeToUserTradingPlans:', error);
    });
  } catch (error) {
    console.error('Error setting up subscribeToUserTradingPlans:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};
