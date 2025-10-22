import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  increment,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { authenticator } from 'otplib';

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
    console.log(`Updating user balance: ${userId}, ${amount}, ${type}`);
    
    // First try to find user by wallet address if userId looks like a wallet address
    let userRef;
    
    if (userId.startsWith('0x')) {
      // userId is a wallet address, find user by walletAddress
      const usersQuery = query(
        collection(db, 'users'),
        where('walletAddress', '==', userId)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        throw new Error(`User not found with wallet address: ${userId}`);
      }
      
      userRef = doc(db, 'users', usersSnapshot.docs[0].id);
    } else {
      // userId is a document ID
      userRef = doc(db, 'users', userId);
    }
    
    const updateData = {
      balance: increment(amount),
      lastUpdated: serverTimestamp()
    };

    if (type === 'deposit') {
      updateData.totalDeposits = increment(amount);
    } else if (type === 'withdrawal') {
      updateData.totalWithdrawals = increment(amount);
    } else if (type === 'profit') {
      // Track total profit earned from trading
      updateData.totalProfit = increment(amount);
      console.log(`💰 Added $${amount.toFixed(2)} profit to user's total profit`);
    }

    await updateDoc(userRef, updateData);
    console.log(`✅ User balance updated successfully: +${amount} (${type})`);
    return true;
  } catch (error) {
    console.error('❌ Error updating user balance:', error);
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
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    if (userData.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Get real-time price
    const currentPrice = await getRealTimePrice(asset);
    
    const tradeData = {
      userId,
      walletAddress: userData.walletAddress, // Add wallet address for consistency
      asset: asset?.toUpperCase() || 'BTC',
      amount: parseFloat(amount),
      tradeType, // 'buy' or 'sell'
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
    
    // Deduct amount from user balance
    await updateUserBalance(userId, -amount);

    return { id: docRef.id, ...tradeData };
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
      userId: userDoc.id, // Add the Firestore document ID
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
    console.log('✅ Trade document created in database with ID:', tradeRef.id);
    
    // Update user's balance (deduct the order amount)
    await updateDoc(doc(db, 'users', userDoc.id), {
      balance: increment(-orderAmount),
      totalTrades: increment(1),
      lastTradeAt: serverTimestamp()
    });
    console.log('✅ User balance updated in database');
    
    // Verify the trade was actually saved by reading it back
    const savedTradeDoc = await getDoc(tradeRef);
    if (savedTradeDoc.exists()) {
      console.log('✅ Trade verification successful - trade exists in database');
    } else {
      console.error('❌ Trade verification failed - trade not found in database');
    }
    
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
      
      // Calculate total profit based on timeframe and amount
      let totalProfitRate;
      
      if (days === 1) {
        // 1 day: (1000-9999USD) 1.5% to 1.8% profit
        if (baseAmount >= 1000 && baseAmount <= 9999) {
          totalProfitRate = Math.random() * 0.003 + 0.015; // 1.5% to 1.8%
        } else {
          totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for other amounts
        }
      } else if (days === 7) {
        // 7 Days: (10000-49999USD) 1.8% to 4.8% profit
        if (baseAmount >= 10000 && baseAmount <= 49999) {
          totalProfitRate = Math.random() * 0.03 + 0.018; // 1.8% to 4.8%
        } else {
          totalProfitRate = Math.random() * 0.02 + 0.015; // 1.5% to 3.5% for other amounts
        }
      } else if (days === 15) {
        // 15 days: (50000-199999USD) 2.10% to 2.5% profit
        if (baseAmount >= 50000 && baseAmount <= 199999) {
          totalProfitRate = Math.random() * 0.004 + 0.021; // 2.10% to 2.5%
        } else {
          totalProfitRate = Math.random() * 0.015 + 0.018; // 1.8% to 3.3% for other amounts
        }
      } else if (days === 30) {
        // 30 days: (100000-499999USD) 2.5% to 2.8% profit
        if (baseAmount >= 100000 && baseAmount <= 499999) {
          totalProfitRate = Math.random() * 0.003 + 0.025; // 2.5% to 2.8%
      } else {
          totalProfitRate = Math.random() * 0.02 + 0.02; // 2.0% to 4.0% for other amounts
        }
      } else if (days === 60) {
        // 60 days: (500000-999999USD) 2.8% to 3% profit
        if (baseAmount >= 500000 && baseAmount <= 999999) {
          totalProfitRate = Math.random() * 0.002 + 0.028; // 2.8% to 3.0%
        } else {
          totalProfitRate = Math.random() * 0.025 + 0.025; // 2.5% to 5.0% for other amounts
        }
      } else {
        totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for other timeframes
      }
      
      const finalProfit = baseAmount * totalProfitRate;
      
      await updateDoc(tradeRef, {
        status: 'completed',
        closePrice: tradeData.openPrice * (1 + totalProfitRate),
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
    console.log('🔄 Starting daily profit update for active Smart Trading orders...');
    
    const tradesQuery = query(
      collection(db, 'trades'),
      where('status', '==', 'Active'),
      where('type', '==', 'Smart Trading')
    );
    const tradesSnapshot = await getDocs(tradesQuery);
    
    console.log(`📊 Found ${tradesSnapshot.docs.length} active Smart Trading orders`);
    
    const updatePromises = tradesSnapshot.docs.map(async (tradeDoc) => {
      const tradeData = tradeDoc.data();
      const tradeRef = doc(db, 'trades', tradeDoc.id);
      
      // Calculate daily earnings based on timeframe and amount
      const days = parseInt(tradeData.timeframe?.split(' ')[0]) || 1;
      const baseAmount = tradeData.amount || tradeData.orderAmount || 0;
      
      console.log(`💰 Processing trade ${tradeDoc.id}: $${baseAmount} for ${days} days`);
      
      let totalProfitRate;
      let dailyRate;
      
      // Calculate profit rates based on capital amount and timeframe
      if (days === 1) {
        // 1 day: (1000-9999USD) 1.5% to 1.8% profit
        if (baseAmount >= 1000 && baseAmount <= 9999) {
          totalProfitRate = Math.random() * 0.003 + 0.015; // 1.5% to 1.8%
        } else if (baseAmount < 1000) {
          totalProfitRate = Math.random() * 0.005 + 0.01; // 1.0% to 1.5% for amounts under 1000
        } else {
          totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for amounts over 9999
        }
        dailyRate = totalProfitRate; // For 1 day, all profit is added in one day
      } else if (days === 7) {
        // 7 Days: (10000-49999USD) 1.8% to 4.8% profit
        if (baseAmount >= 10000 && baseAmount <= 49999) {
          totalProfitRate = Math.random() * 0.03 + 0.018; // 1.8% to 4.8%
        } else if (baseAmount < 10000) {
          totalProfitRate = Math.random() * 0.015 + 0.012; // 1.2% to 2.7% for amounts under 10000
        } else {
          totalProfitRate = Math.random() * 0.02 + 0.015; // 1.5% to 3.5% for amounts over 49999
        }
        dailyRate = totalProfitRate / 7; // Distribute profit across 7 days
      } else if (days === 15) {
        // 15 days: (50000-199999USD) 2.10% to 2.5% profit
        if (baseAmount >= 50000 && baseAmount <= 199999) {
          totalProfitRate = Math.random() * 0.004 + 0.021; // 2.10% to 2.5%
        } else if (baseAmount < 50000) {
          totalProfitRate = Math.random() * 0.015 + 0.015; // 1.5% to 3.0% for amounts under 50000
        } else {
          totalProfitRate = Math.random() * 0.015 + 0.018; // 1.8% to 3.3% for amounts over 199999
        }
        dailyRate = totalProfitRate / 15; // Distribute profit across 15 days
      } else if (days === 30) {
        // 30 days: (100000-499999USD) 2.5% to 2.8% profit
        if (baseAmount >= 100000 && baseAmount <= 499999) {
          totalProfitRate = Math.random() * 0.003 + 0.025; // 2.5% to 2.8%
        } else if (baseAmount < 100000) {
          totalProfitRate = Math.random() * 0.02 + 0.02; // 2.0% to 4.0% for amounts under 100000
      } else {
          totalProfitRate = Math.random() * 0.02 + 0.02; // 2.0% to 4.0% for amounts over 499999
        }
        dailyRate = totalProfitRate / 30; // Distribute profit across 30 days
      } else if (days === 60) {
        // 60 days: (500000-999999USD) 2.8% to 3% profit
        if (baseAmount >= 500000 && baseAmount <= 999999) {
          totalProfitRate = Math.random() * 0.002 + 0.028; // 2.8% to 3.0%
        } else if (baseAmount < 500000) {
          totalProfitRate = Math.random() * 0.025 + 0.025; // 2.5% to 5.0% for amounts under 500000
        } else {
          totalProfitRate = Math.random() * 0.025 + 0.025; // 2.5% to 5.0% for amounts over 999999
        }
        dailyRate = totalProfitRate / 60; // Distribute profit across 60 days
      } else {
        // Default rates for other timeframes
        totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0%
        dailyRate = totalProfitRate / days; // Distribute profit across the timeframe
      }
      
      const dailyEarnings = baseAmount * dailyRate;
      const currentTotalRevenue = tradeData.totalRevenue || 0;
      const newTotalRevenue = currentTotalRevenue + dailyEarnings;
      
      console.log(`💵 Daily earnings for trade ${tradeDoc.id}: $${dailyEarnings.toFixed(2)} (${(dailyRate * 100).toFixed(2)}% daily rate)`);
      console.log(`📈 Total revenue so far: $${newTotalRevenue.toFixed(2)}`);
      
      // Update trade document with daily earnings and total revenue
      await updateDoc(tradeRef, {
        todayEarnings: dailyEarnings,
        totalRevenue: newTotalRevenue,
        profit: newTotalRevenue, // This profit is cumulative daily profit
        lastProfitUpdate: serverTimestamp()
      });
      
      // Add daily earnings to user's balance
      console.log(`💳 Adding $${dailyEarnings.toFixed(2)} to user balance...`);
      
      if (tradeData.walletAddress) {
        await updateUserBalance(tradeData.walletAddress, dailyEarnings, 'profit');
        console.log(`✅ Added profit to user balance via wallet address: ${tradeData.walletAddress}`);
      } else if (tradeData.userId) {
        await updateUserBalance(tradeData.userId, dailyEarnings, 'profit');
        console.log(`✅ Added profit to user balance via user ID: ${tradeData.userId}`);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Successfully updated all active Smart Trading profits');
  } catch (error) {
    console.error('❌ Error updating active trade profits:', error);
  }
};

// Auto-complete orders based on timeframe
export const processCompletedOrders = async () => {
  try {
    console.log('Processing completed orders...');
    
    // Get all active orders
    const activeOrdersQuery = query(
      collection(db, 'trades'),
      where('status', '==', 'Active')
    );
    
    const activeOrdersSnapshot = await getDocs(activeOrdersQuery);
    const now = new Date();
    
    for (const orderDoc of activeOrdersSnapshot.docs) {
      const orderData = orderDoc.data();
      const createdAt = orderData.createdAt?.toDate ? orderData.createdAt.toDate() : new Date(orderData.createdAt || 0);
      
      // Calculate expected completion time based on timeframe
      let expectedCompletionTime;
      const timeframe = orderData.timeframe || '1 Day';
      const days = parseInt(timeframe.split(' ')[0]) || 1;
      
      expectedCompletionTime = new Date(createdAt.getTime() + (days * 24 * 60 * 60 * 1000));
      
      // Check if order should be completed
      if (now >= expectedCompletionTime) {
        console.log(`Completing order ${orderDoc.id} - timeframe expired`);
        
        // Calculate total profit based on timeframe and amount
        const baseAmount = orderData.amount || orderData.orderAmount || 0;
        let totalProfitRate;
        
        if (days === 1) {
          // 1 day: (1000-9999USD) 1.5% to 1.8% profit
          if (baseAmount >= 1000 && baseAmount <= 9999) {
            totalProfitRate = Math.random() * 0.003 + 0.015; // 1.5% to 1.8%
          } else {
            totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for other amounts
          }
        } else if (days === 7) {
          // 7 Days: (10000-49999USD) 1.8% to 4.8% profit
          if (baseAmount >= 10000 && baseAmount <= 49999) {
            totalProfitRate = Math.random() * 0.03 + 0.018; // 1.8% to 4.8%
          } else {
            totalProfitRate = Math.random() * 0.02 + 0.015; // 1.5% to 3.5% for other amounts
          }
        } else if (days === 15) {
          // 15 days: (50000-199999USD) 2.10% to 2.5% profit
          if (baseAmount >= 50000 && baseAmount <= 199999) {
            totalProfitRate = Math.random() * 0.004 + 0.021; // 2.10% to 2.5%
          } else {
            totalProfitRate = Math.random() * 0.015 + 0.018; // 1.8% to 3.3% for other amounts
          }
        } else if (days === 30) {
          // 30 days: (100000-499999USD) 2.5% to 2.8% profit
          if (baseAmount >= 100000 && baseAmount <= 499999) {
            totalProfitRate = Math.random() * 0.003 + 0.025; // 2.5% to 2.8%
          } else {
            totalProfitRate = Math.random() * 0.02 + 0.02; // 2.0% to 4.0% for other amounts
          }
        } else if (days === 60) {
          // 60 days: (500000-999999USD) 2.8% to 3% profit
          if (baseAmount >= 500000 && baseAmount <= 999999) {
            totalProfitRate = Math.random() * 0.002 + 0.028; // 2.8% to 3.0%
          } else {
            totalProfitRate = Math.random() * 0.025 + 0.025; // 2.5% to 5.0% for other amounts
          }
        } else {
          totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for other timeframes
        }
        
        const finalProfit = baseAmount * totalProfitRate;
        const totalReturn = baseAmount + finalProfit;
        
        // Update order status
        await updateDoc(doc(db, 'trades', orderDoc.id), {
          status: 'completed',
          profit: finalProfit,
          totalReturn: totalReturn,
          completedAt: serverTimestamp(),
          profitRate: totalProfitRate
        });
        
        // Add profit to user balance
        if (orderData.walletAddress) {
          await updateUserBalance(orderData.walletAddress, finalProfit, 'profit');
        } else if (orderData.userId) {
          await updateUserBalance(orderData.userId, finalProfit, 'profit');
        }
        
        console.log(`Order ${orderDoc.id} completed with profit: $${finalProfit.toFixed(2)}`);
      }
    }
    
    console.log('Completed order processing');
  } catch (error) {
    console.error('Error processing completed orders:', error);
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
export const getUserTrades = async (userId, walletAddress) => {
  try {
    console.log('Getting user trades for:', { userId, walletAddress });
    
    // Get all trades and filter client-side to avoid index issues
    const q = query(collection(db, 'trades'));
    const snapshot = await getDocs(q);
    
    // Filter by userId OR walletAddress client-side (more precise matching)
    const trades = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(trade => {
        // Exact match by userId (if userId is a document ID)
        if (trade.userId === userId && !userId.startsWith('0x')) {
          return true;
        }
        // Exact match by walletAddress
        if (trade.walletAddress === walletAddress) {
          return true;
        }
        // If userId is actually a wallet address, match it
        if (userId.startsWith('0x') && trade.walletAddress === userId) {
          return true;
        }
        return false;
      });
    
    console.log('Retrieved trades:', trades.length, trades);
    
    // Sort by createdAt in descending order
    return trades.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return timeB - timeA; // Descending order (newest first)
    });
  } catch (error) {
    console.error('Error getting user trades:', error);
    throw error;
  }
};

export const getUserDeposits = async (userId) => {
  try {
    // Get all deposits and filter client-side to avoid index issues
    const q = query(collection(db, 'deposits'));
    const snapshot = await getDocs(q);
    
    // Filter by userId client-side and sort
    const deposits = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(deposit => deposit.userId === userId)
      .sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return timeB - timeA; // Descending order (newest first)
      });
    
    return deposits;
  } catch (error) {
    console.error('Error getting user deposits:', error);
    throw error;
  }
};

export const getUserWithdrawals = async (userId) => {
  try {
    // Get all withdrawals and filter client-side to avoid index issues
    const q = query(collection(db, 'withdrawals'));
    const snapshot = await getDocs(q);
    
    // Filter by userId client-side and sort
    const withdrawals = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(withdrawal => withdrawal.userId === userId)
      .sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return timeB - timeA; // Descending order (newest first)
      });
    
    return withdrawals;
  } catch (error) {
    console.error('Error getting user withdrawals:', error);
    throw error;
  }
};

// Admin Authentication Functions

// Generate a secure secret key for TOTP
const generateSecretKey = () => {
  return authenticator.generateSecret();
};

// Generate recovery codes
const generateRecoveryCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
};

// Encrypt sensitive data
const encrypt = (text) => {
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Decrypt sensitive data
const decrypt = (encryptedText) => {
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Create admin user
export const createAdminUser = async (username, password, email) => {
  try {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const adminData = {
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      twoFactorEnabled: false,
      twoFactorSecret: null,
      recoveryCodes: [],
      createdAt: serverTimestamp(),
      lastLogin: null,
      isActive: true
    };

    const docRef = await addDoc(collection(db, 'admins'), adminData);
    return { id: docRef.id, ...adminData };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Authenticate admin user
export const authenticateAdmin = async (username, password) => {
  try {
    const q = query(
      collection(db, 'admins'),
      where('username', '==', username),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, message: 'Invalid credentials' };
    }

    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();
    const hashedPassword = CryptoJS.SHA256(password).toString();

    if (adminData.password !== hashedPassword) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Update last login
    await updateDoc(doc(db, 'admins', adminDoc.id), {
      lastLogin: serverTimestamp()
    });

    // Generate session token
    const token = CryptoJS.lib.WordArray.random(32).toString();

    return {
      success: true,
      admin: { id: adminDoc.id, ...adminData },
      token,
      requires2FA: adminData.twoFactorEnabled
    };
  } catch (error) {
    console.error('Error authenticating admin:', error);
    throw error;
  }
};

// Setup 2FA for admin
export const setup2FA = async (adminId) => {
  try {
    const secretKey = generateSecretKey();
    const recoveryCodes = generateRecoveryCodes();
    
    // Generate QR code data
    const qrCodeData = authenticator.keyuri(
      'UBSS Admin',
      'admin@ubss.com',
      secretKey
    );

    // Encrypt and store the secret
    const encryptedSecret = encrypt(secretKey);

    await updateDoc(doc(db, 'admins', adminId), {
      twoFactorSecret: encryptedSecret,
      recoveryCodes: recoveryCodes.map(code => encrypt(code))
    });

    return {
      success: true,
      secretKey,
      qrCodeData,
      recoveryCodes
    };
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    throw error;
  }
};

// Verify 2FA code
export const verify2FA = async (adminId, totpCode) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', adminId));
    
    if (!adminDoc.exists()) {
      return { success: false, message: 'Admin not found' };
    }

    const adminData = adminDoc.data();
    
    if (!adminData.twoFactorEnabled || !adminData.twoFactorSecret) {
      return { success: false, message: '2FA not enabled' };
    }

    const decryptedSecret = decrypt(adminData.twoFactorSecret);
    const isValid = authenticator.verify({ token: totpCode, secret: decryptedSecret });

    if (!isValid) {
      return { success: false, message: 'Invalid 2FA code' };
    }

    // Generate session token
    const token = CryptoJS.lib.WordArray.random(32).toString();

    return {
      success: true,
      admin: { id: adminDoc.id, ...adminData },
      token
    };
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    throw error;
  }
};

// Complete 2FA setup
export const complete2FASetup = async (adminId, totpCode) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', adminId));
    
    if (!adminDoc.exists()) {
      return { success: false, message: 'Admin not found' };
    }

    const adminData = adminDoc.data();
    
    if (!adminData.twoFactorSecret) {
      return { success: false, message: '2FA not initialized' };
    }

    const decryptedSecret = decrypt(adminData.twoFactorSecret);
    const isValid = authenticator.verify({ token: totpCode, secret: decryptedSecret });

    if (!isValid) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Enable 2FA
    await updateDoc(doc(db, 'admins', adminId), {
      twoFactorEnabled: true
    });

    // Generate session token
    const token = CryptoJS.lib.WordArray.random(32).toString();

    return {
      success: true,
      admin: { id: adminDoc.id, ...adminData, twoFactorEnabled: true },
      token
    };
  } catch (error) {
    console.error('Error completing 2FA setup:', error);
    throw error;
  }
};

// Verify recovery code
export const verifyRecoveryCode = async (adminId, recoveryCode) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', adminId));
    
    if (!adminDoc.exists()) {
      return { success: false, message: 'Admin not found' };
    }

    const adminData = adminDoc.data();
    
    if (!adminData.recoveryCodes || adminData.recoveryCodes.length === 0) {
      return { success: false, message: 'No recovery codes available' };
    }

    // Check if recovery code matches
    const isValidCode = adminData.recoveryCodes.some(encryptedCode => {
      const decryptedCode = decrypt(encryptedCode);
      return decryptedCode === recoveryCode;
    });

    if (!isValidCode) {
      return { success: false, message: 'Invalid recovery code' };
    }

    // Remove used recovery code
    const updatedCodes = adminData.recoveryCodes.filter(encryptedCode => {
      const decryptedCode = decrypt(encryptedCode);
      return decryptedCode !== recoveryCode;
    });

    await updateDoc(doc(db, 'admins', adminId), {
      recoveryCodes: updatedCodes
    });

    // Generate session token
    const token = CryptoJS.lib.WordArray.random(32).toString();

    return {
      success: true,
      admin: { id: adminDoc.id, ...adminData },
      token
    };
  } catch (error) {
    console.error('Error verifying recovery code:', error);
    throw error;
  }
};

// Verify admin session
export const verifyAdminSession = async (token) => {
  try {
    // In a real implementation, you would verify the token against stored sessions
    // For now, we'll check if the token exists in localStorage
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminUser');
    
    if (!storedToken || !storedAdmin || storedToken !== token) {
      return { success: false, message: 'Invalid session' };
    }

    return {
      success: true,
      admin: JSON.parse(storedAdmin)
    };
  } catch (error) {
    console.error('Error verifying admin session:', error);
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
export const subscribeToUserTrades = (userId, walletAddress, callback) => {
  try {
    console.log('Setting up trade subscription for:', { userId, walletAddress });
    
    // Subscribe to all trades and filter client-side to avoid index issues
    const q = query(collection(db, 'trades'));
    
    // Set up listener for the query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Trade subscription update:', {
        userId,
        walletAddress,
        totalDocs: snapshot.docs.length
      });
      
      // Filter by userId OR walletAddress client-side (more precise matching)
      const allTrades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userTrades = allTrades.filter(trade => {
        // Exact match by userId (if userId is a document ID)
        if (trade.userId === userId && !userId.startsWith('0x')) {
          return true;
        }
        // Exact match by walletAddress
        if (trade.walletAddress === walletAddress) {
          return true;
        }
        // If userId is actually a wallet address, match it
        if (userId.startsWith('0x') && trade.walletAddress === userId) {
          return true;
        }
        return false;
      });
      
      console.log('Filtered trades for user:', {
        totalTrades: allTrades.length,
        userTrades: userTrades.length,
        trades: userTrades,
        searchCriteria: { userId, walletAddress },
        sampleTrade: allTrades[0], // Show first trade structure for debugging
        allTradeUserIds: allTrades.map(t => t.userId).slice(0, 5), // Show first 5 userIds
        allTradeWalletAddresses: allTrades.map(t => t.walletAddress).slice(0, 5), // Show first 5 wallet addresses
        matchingTrades: userTrades.map(t => ({
          id: t.id,
          userId: t.userId,
          walletAddress: t.walletAddress,
          type: t.type,
          amount: t.amount,
          status: t.status
        }))
      });
      
      // Create a mock snapshot with only the user's trades
      const mockSnapshot = {
        docs: userTrades.map(trade => ({
          id: trade.id,
          data: () => trade
        }))
      };
      
      callback(mockSnapshot);
    }, (error) => {
      console.error('Error in subscribeToUserTrades:', error);
    });
    
    return unsubscribe;
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
