import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';
import { useDatabase } from '../contexts/DatabaseContext';
import AccountVerificationModal from './AccountVerificationModal';
import DepositModal from './DepositModal';
import BalanceModal from './BalanceModal';
import LiveChat from './LiveChat';

const Account = () => {
  const [activeOrderTab, setActiveOrderTab] = useState('All orders');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [realTimeProfit, setRealTimeProfit] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousProfit, setPreviousProfit] = useState(0);
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isConnected, account, walletType, formatAddress } = useWallet();
  const { user, userTrades, updateUserBalance } = useDatabase();

  // Update selectedAccount when wallet address changes
  useEffect(() => {
    if (account) {
      const lastSixChars = account?.slice(-6)?.toUpperCase() || '';
      setSelectedAccount(lastSixChars);
    } else {
      setSelectedAccount('');
    }
  }, [account]);

  // Listen for deposit modal opening from alerts
  useEffect(() => {
    const handleOpenDepositModal = () => {
      setShowDepositModal(true);
    };

    window.addEventListener('openDepositModal', handleOpenDepositModal);
    return () => window.removeEventListener('openDepositModal', handleOpenDepositModal);
  }, []);

  // Calculate real-time total profit from all trades
  const calculateTotalProfit = useCallback(() => {
    if (!userTrades || userTrades.length === 0) {
      return 0;
    }

    return userTrades.reduce((total, trade) => {
      // For completed trades, use the final profit
      if (trade.status === 'completed' || trade.status === 'closed') {
        return total + (trade.profit || 0);
      }
      
      // For active trades, calculate real-time profit
      if (trade.status === 'Active' || trade.status === 'active') {
        const baseAmount = trade.amount || trade.orderAmount || 0;
        const days = parseInt(trade.timeframe?.split(' ')[0]) || 1;
        
        // Calculate elapsed time since trade creation
        const createdAt = trade.createdAt?.toDate ? trade.createdAt.toDate() : new Date(trade.createdAt);
        const now = new Date();
        const elapsedHours = (now - createdAt) / (1000 * 60 * 60);
        const elapsedDays = elapsedHours / 24;
        
        // Calculate real-time profit based on elapsed time
        let profitRate = 0;
        if (days === 1) {
          profitRate = Math.min(elapsedDays, 1) * 0.05; // 5% per day
        } else if (days === 7) {
          profitRate = Math.min(elapsedDays / 7, 1) * 0.35; // 35% over 7 days
        } else if (days === 30) {
          profitRate = Math.min(elapsedDays / 30, 1) * 1.5; // 150% over 30 days
        } else if (days === 90) {
          profitRate = Math.min(elapsedDays / 90, 1) * 4.5; // 450% over 90 days
        }
        
        return total + (baseAmount * profitRate);
      }
      
      return total;
    }, 0);
  }, [userTrades]);

  // Real-time profit update effect
  useEffect(() => {
    const updateRealTimeProfit = async () => {
      setIsUpdating(true);
      const calculatedProfit = calculateTotalProfit();
      
      // Calculate profit difference
      const profitDifference = calculatedProfit - previousProfit;
      
      // If profit increased, update user balance automatically
      if (profitDifference > 0 && user && account) {
        try {
          await updateUserBalance(account, profitDifference, 'profit');
          console.log(`Auto-updated balance: +${profitDifference.toFixed(2)} USD from profit`);
          setBalanceUpdated(true);
          setTimeout(() => setBalanceUpdated(false), 3000); // Show indicator for 3 seconds
        } catch (error) {
          console.error('Error updating balance from profit:', error);
        }
      }
      
      setRealTimeProfit(calculatedProfit);
      setPreviousProfit(calculatedProfit);
      
      // Reset updating indicator after a short delay
      setTimeout(() => setIsUpdating(false), 1000);
    };

    // Update immediately
    updateRealTimeProfit();

    // Update every 5 seconds for real-time effect
    const interval = setInterval(updateRealTimeProfit, 5000);

    return () => clearInterval(interval);
  }, [userTrades, user, account, previousProfit, calculateTotalProfit, updateUserBalance]); // Re-run when userTrades changes

  const orderTabs = ['All orders', 'Options', 'Smart', 'Static Income'];

  // Get orders based on active tab
  const getOrdersForTab = () => {
    if (activeOrderTab === 'All orders') {
      return userTrades || [];
    } else if (activeOrderTab === 'Smart') {
      return (userTrades || []).filter(trade => trade.type === 'Smart Trading');
    } else if (activeOrderTab === 'Options') {
      return (userTrades || []).filter(trade => trade.type === 'Options');
    } else if (activeOrderTab === 'Static Income') {
      return (userTrades || []).filter(trade => trade.type === 'Static Income');
    }
    return [];
  };

  const currentOrders = getOrdersForTab();

  const totalProfit = realTimeProfit;

  // Calculate number of profitable trades
  const profitableTradesCount = userTrades ? userTrades.filter(trade => 
    (trade.profit || trade.totalRevenue || 0) > 0
  ).length : 0;

  const settingsItems = [
    { name: t('verification'), action: () => setShowVerificationModal(true) },
    { name: t('inviteFriends'), action: () => window.location.href = '/invite-friends' },
    { name: t('liveChat'), action: () => setShowLiveChat(true) },
    { name: t('helpCenter'), action: () => window.location.href = '/help-center' },
    { name: t('notifications'), action: () => window.location.href = '/notifications' },
    { name: t('language'), action: () => window.location.href = '/language-settings' }
  ];

  const footerLinks = {
    products: [
      "Markets",
      "Investment & Lending", 
      "Smart Trading"
    ],
    company: [
      "About Us",
      "License Supervision",
      "Help Center",
      "Online Support"
    ],
    policies: [
      "Terms & Conditions",
      "Privacy Policy"
    ]
  };

  const legalLinks = [
    "Legal Information",
    "Disclaimer", 
    "Risk Warning",
    "Cookie Policy",
    "About Advertising"
  ];

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Main Content */}
      <div className="container-max py-4 sm:py-6 lg:py-8">
        {/* Account Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <button className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-300">
            <span className="font-medium text-sm sm:text-base">{selectedAccount}</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Account Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-2xl">
            {/* Gradient Glow Effect */}
            <div className="absolute right-0 top-0 w-16 sm:w-24 lg:w-32 h-full bg-gradient-to-l from-green-500/20 to-purple-500/20"></div>
            
            {/* Main Balance */}
            <div className="relative z-10 mb-4 sm:mb-6 lg:mb-8">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 flex flex-col sm:flex-row sm:items-center">
                <span>{user?.balance ? `${user.balance.toFixed(2)} USD` : '0.00 USD'}</span>
                {balanceUpdated && (
                  <div className="mt-2 sm:mt-0 sm:ml-3 flex items-center text-green-400 text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Updated from profit
                  </div>
                )}
              </div>
              {isConnected && (
                <div className="text-xs sm:text-sm text-gray-300">
                  Connected: {formatAddress(account)} ({walletType})
                </div>
              )}
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 relative z-10">
              <div>
                <button 
                  onClick={() => setShowBalanceModal(true)}
                  className="text-blue-400 text-xs sm:text-sm mb-2 hover:text-blue-300 transition-colors duration-300 cursor-pointer underline hover:no-underline flex items-center space-x-1"
                >
                  <span>{t('balance')}:</span>
                  <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <div className="bg-gray-700 px-2 sm:px-3 py-2 rounded-lg text-white font-medium text-sm sm:text-base">
                  {user ? `$${user.balance?.toFixed(2) || '0.00'}` : '0.00 USD'}
                </div>
              </div>
              <div>
                <button 
                  onClick={() => navigate('/loan')}
                  className="text-blue-400 text-xs sm:text-sm mb-2 hover:text-blue-300 transition-colors duration-300 cursor-pointer underline hover:no-underline flex items-center space-x-1"
                >
                  <span>Loan:</span>
                  <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <div className="bg-gray-700 px-2 sm:px-3 py-2 rounded-lg text-white font-medium text-sm sm:text-base">0.00 USD</div>
              </div>
              <div>
                <div className="text-gray-300 text-xs sm:text-sm mb-2">Margin Used:</div>
                <div className="text-white font-medium text-sm sm:text-base">0.00 USD</div>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="text-gray-300 text-xs sm:text-sm mb-2 flex items-center">
                  Total Profit:
                  {isUpdating && (
                    <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className={`font-medium text-sm sm:text-base ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} USD
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {profitableTradesCount} profitable trades
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {balanceUpdated && (
                    <span className="text-green-400">• Balance auto-updated</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Order</h2>
          
          {/* Order Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
            {orderTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOrderTab(tab)}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm lg:text-base transition-all duration-300 whitespace-nowrap ${
                  activeOrderTab === tab
                    ? 'bg-gray-300 text-gray-900'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Order Content */}
          <div className="space-y-3 sm:space-y-4">
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <div key={order.id || index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-500">#{order.id ? order.id.slice(-8) : `ORDER-${index + 1}`}</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{order.amount?.toFixed(2) || '0.00'} USD</div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="font-bold text-gray-900 text-sm sm:text-base">{order.symbol || 'N/A'}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <span className="text-xs sm:text-sm text-gray-600">{order.direction || 'Up'} {order.timeframe || '1 Day'}</span>
                        <span className="text-green-600 font-semibold text-sm sm:text-base">{order.profit?.toFixed(2) || '0.00'} USD</span>
                      </div>
                    </div>

                    {/* Basic Order Info */}
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div>Open: {order.openPrice?.toFixed(4) || '0.0000'}</div>
                      <div>Close: {order.closePrice?.toFixed(4) || 'Pending'}</div>
                      <div>Start time: {order.startTime ? new Date(order.startTime).toLocaleString() : 'N/A'}</div>
                      <div>Expiration time: {order.endTime ? new Date(order.endTime).toLocaleString() : 'N/A'}</div>
                      <div>Run time: {order.runTime || 'Calculating...'}</div>
                    </div>

                    {/* Detailed Order Info (for Smart Trading orders) */}
                    {order.type === 'Smart Trading' && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div>
                            <div className="text-gray-600">Transaction:</div>
                            <div className="font-medium">{order.symbol || 'N/A'}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Cycle:</div>
                            <div className="font-medium">{order.timeframe || '1 Day'}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Daily Ror:</div>
                            <div className="font-medium">{order.dailyRor || '2.5%-3.0%'}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Amount:</div>
                            <div className="font-medium">{order.amount?.toFixed(2) || '0.00'} USD</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Today's Earnings:</div>
                            <div className="font-medium text-green-600">{order.todayEarnings?.toFixed(2) || '0.00'} USDC</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Total Revenue:</div>
                            <div className="font-medium text-green-600">{order.totalRevenue?.toFixed(2) || order.profit?.toFixed(2) || '0.00'} USDC</div>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
                          <div className="text-gray-600">Status: <span className="font-medium">{order.status || 'Active'}</span></div>
                        </div>
                        <div className="mt-3 sm:mt-4 text-center">
                          <button className="bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-700 transition-colors">
                            Recreate Plan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Arrow */}
                    <div className="flex justify-end">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                <div className="text-gray-500 text-base sm:text-lg">No orders found</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Settings</h2>
          
          <div className="space-y-2 sm:space-y-3 account-settings-list">
            {settingsItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={item.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="w-full bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-300 account-settings-item"
              >
                <span className="font-medium text-sm sm:text-base">{item.name}</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container-max">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="md:col-span-1"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <img 
                    src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
                    alt="UBS Logo" 
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-white">Tokenize</span>
                </div>
              </motion.div>

              {/* Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-4">Products</h4>
                <ul className="space-y-2">
                  {footerLinks.products.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#products"
                        className="text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#company"
                        className="text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Policies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-lg font-semibold mb-4">Policies</h4>
                <ul className="space-y-2">
                  {footerLinks.policies.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#legal"
                        className="text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Legal Links */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#legal"
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Social Media & Copyright */}
              <div className="flex items-center space-x-6">
                {/* Social Media Icons */}
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </motion.a>
                </div>

                <div className="text-gray-400 text-sm">
                  • 2023 UBS. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AccountVerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)} 
      />
      <DepositModal 
        isOpen={showDepositModal} 
        onClose={() => setShowDepositModal(false)} 
      />
      <BalanceModal 
        isOpen={showBalanceModal} 
        onClose={() => setShowBalanceModal(false)} 
      />
      <LiveChat 
        isOpen={showLiveChat} 
        onClose={() => setShowLiveChat(false)} 
      />
    </div>
  );
};

export default Account;
