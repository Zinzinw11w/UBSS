import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import * as database from '../services/database';
import * as chat from '../services/chat';
import { showAlert } from '../components/AlertSystem';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const { isConnected, account, walletType } = useWallet();
  const [user, setUser] = useState(null);
  const [userTrades, setUserTrades] = useState([]);
  const [userDeposits, setUserDeposits] = useState([]);
  const [userWithdrawals, setUserWithdrawals] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user when wallet connects
  useEffect(() => {
    const initializeUser = async () => {
      if (isConnected && account) {
        setIsLoading(true);
        try {
          console.log('Initializing user for wallet:', account);
          // Check if user exists
          let userData = await database.getUserByWallet(account);
          console.log('Existing user data:', userData);
          
          if (!userData) {
            // Create new user
            console.log('Creating new user...');
            userData = await database.createUser(account, walletType);
            console.log('New user created:', userData);
          }
          
          setUser(userData);
          
          // Load user data
          await loadUserData(userData.id);
          
        } catch (error) {
          console.error('Error initializing user:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setUserTrades([]);
        setUserDeposits([]);
        setUserWithdrawals([]);
        setChatMessages([]);
      }
    };

    initializeUser();
  }, [isConnected, account, walletType]);

  // Load user data
  const loadUserData = async (userId) => {
    try {
      const [trades, deposits, withdrawals, messages] = await Promise.all([
        database.getUserTrades(userId),
        database.getUserDeposits(userId),
        database.getUserWithdrawals(userId),
        chat.getChatHistory(userId)
      ]);

      setUserTrades(trades);
      setUserDeposits(deposits);
      setUserWithdrawals(withdrawals);
      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Deposit functions
  const createDeposit = async (amount, currency, txHash) => {
    if (!user) throw new Error('User not found');
    
    try {
      const deposit = await database.createDeposit(user.id, amount, currency, txHash);
      setUserDeposits(prev => [deposit, ...prev]);
      return deposit;
    } catch (error) {
      console.error('Error creating deposit:', error);
      throw error;
    }
  };

  // Withdrawal functions
  const createWithdrawal = async (amount, currency, walletAddress) => {
    if (!user) throw new Error('User not found');
    
    try {
      const withdrawal = await database.createWithdrawal(user.id, amount, currency, walletAddress);
      setUserWithdrawals(prev => [withdrawal, ...prev]);
      return withdrawal;
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      throw error;
    }
  };

  // Trading functions with balance validation
  const createTrade = async (tradeData) => {
    if (!user || !account) throw new Error('User not found or wallet not connected');
    
    try {
      console.log('Creating trade with validation:', tradeData);
      
      // Use the new validation function
      const result = await database.validateBalanceAndCreateTrade(account, tradeData);
      
      if (result.success) {
        // Trade created successfully
        setUserTrades(prev => [result.tradeData, ...prev]);
        
        // Update user balance in context
        setUser(prev => ({
          ...prev,
          balance: result.newBalance
        }));
        
        // Show success alert
        showAlert('success', 
          `Trading plan created successfully! Order #${result.tradeId.slice(-8)} is now active.`,
          5000
        );
        
        return result.tradeData;
      } else if (result.error === 'RATE_LIMIT_EXCEEDED') {
        // Rate limit exceeded
        showAlert('warning', result.message, 5000);
        throw new Error('RATE_LIMIT_EXCEEDED');
      } else {
        // Insufficient funds
        const shortfall = result.shortfall;
        showAlert('error', 
          `Insufficient funds! You need ${shortfall.toFixed(2)} USD more to create this order.`,
          8000,
          {
            text: 'Deposit Funds',
            onClick: () => {
              // This will be handled by the component that calls this function
              window.dispatchEvent(new CustomEvent('openDepositModal'));
            }
          }
        );
        
        throw new Error('INSUFFICIENT_FUNDS');
      }
    } catch (error) {
      console.error('Error creating trade:', error);
      
      if (error.message === 'INSUFFICIENT_FUNDS') {
        throw error; // Re-throw to let component handle it
      }
      
      // Other errors
      showAlert('error', 'Failed to create trading plan. Please try again.', 5000);
      throw error;
    }
  };

  const createSmartTrade = async (asset, amount, tradeType, leverage = 1) => {
    if (!user) throw new Error('User not found');
    
    try {
      const trade = await database.createSmartTrade(user.id, asset, amount, tradeType, leverage);
      setUserTrades(prev => [trade, ...prev]);
      return trade;
    } catch (error) {
      console.error('Error creating smart trade:', error);
      throw error;
    }
  };

  const closeTrade = async (tradeId) => {
    try {
      await database.closeTrade(tradeId);
      // Reload user data to get updated balance
      if (user) {
        await loadUserData(user.id);
      }
    } catch (error) {
      console.error('Error closing trade:', error);
      throw error;
    }
  };

  // Chat functions
  const sendMessage = async (message) => {
    if (!user) throw new Error('User not found');
    
    try {
      console.log('=== SEND MESSAGE DEBUG ===');
      console.log('User:', user);
      console.log('User ID:', user.id);
      console.log('Message:', message);
      
      const newMessage = await chat.sendMessage(user.id, message, false);
      console.log('New message created:', newMessage);
      
      // Don't manually update chatMessages here - let the subscription handle it
      // This prevents duplicate messages and ensures real-time updates work properly
      console.log('Message sent successfully, waiting for subscription update...');
      console.log('Auto-reply will be sent automatically for user messages');
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const sendAdminMessage = async (userId, message) => {
    try {
      const newMessage = await chat.sendAdminMessage(userId, message);
      return newMessage;
    } catch (error) {
      console.error('Error sending admin message:', error);
      throw error;
    }
  };

  // Real-time updates
  useEffect(() => {
    if (!user || !user.id) return;

    let unsubscribeBalance = null;
    let unsubscribeTrades = null;
    let unsubscribeChat = null;

    try {
      // Subscribe to user balance changes
      unsubscribeBalance = database.subscribeToUserBalance(user.id, (doc) => {
        if (doc.exists()) {
          setUser(prev => ({ ...prev, ...doc.data() }));
        }
      });

      // Subscribe to user trades
      unsubscribeTrades = database.subscribeToUserTrades(user.id, user.walletAddress, (snapshot) => {
        const trades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserTrades(trades);
      });

      // Subscribe to chat messages
      unsubscribeChat = chat.subscribeToChatMessages(user.id, (snapshot) => {
        console.log('=== CHAT SUBSCRIPTION UPDATE ===');
        console.log('User ID:', user.id);
        console.log('Snapshot docs count:', snapshot.docs.length);
        console.log('Snapshot docs:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort messages by createdAt in ascending order (oldest first) for proper chat flow
        const sortedMessages = messages.sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return timeA - timeB; // Ascending order (oldest first)
        });
        
        console.log('Processed messages (sorted):', sortedMessages);
        setChatMessages(sortedMessages);
      });
    } catch (error) {
      console.error('Error setting up real-time subscriptions:', error);
    }

    return () => {
      if (unsubscribeBalance) unsubscribeBalance();
      if (unsubscribeTrades) unsubscribeTrades();
      if (unsubscribeChat) unsubscribeChat();
    };
  }, [user?.id, user?.walletAddress]); // Depend on both user.id and user.walletAddress

  const value = {
    user,
    userTrades,
    userDeposits,
    userWithdrawals,
    chatMessages,
    isLoading,
    createDeposit,
    createWithdrawal,
    createTrade,
    createSmartTrade,
    closeTrade,
    sendMessage,
    sendAdminMessage,
    loadUserData,
    updateUserBalance: database.updateUserBalance
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
