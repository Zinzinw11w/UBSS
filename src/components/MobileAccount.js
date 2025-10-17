import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { QRCodeSVG } from 'qrcode.react';
import AccountVerificationModal from './AccountVerificationModal';
import LiveChat from './LiveChat';

export default function MobileAccount() {
  const [activeOrderTab, setActiveOrderTab] = useState('Options');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceActiveTab, setBalanceActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [txHash, setTxHash] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  
  const navigate = useNavigate();
  const { createDeposit, createWithdrawal, user } = useDatabase();
  const { t } = useLanguage();

  const orderTabs = ['All orders', 'Options', 'Smart', 'Static Inco'];

  const currencies = [
    { 
      id: 'BTC', 
      name: 'Bitcoin', 
      symbol: '₿',
      address: 'bc1q009nsstau3mmzgzwz6vkjqw06tw3jukqfd0vhz',
      type: 'Bitcoin'
    },
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      symbol: 'Ξ',
      address: '0xAe7298dDa2AF52388aFde60160cD8ab0805Ed94D',
      type: 'Ethereum'
    },
    { 
      id: 'USDC', 
      name: 'USD Coin', 
      symbol: '$',
      address: '0xAe7298dDa2AF52388aFde60160cD8ab0805Ed94D',
      type: 'Ethereum'
    },
    { 
      id: 'USDT', 
      name: 'Tether', 
      symbol: '₮',
      address: '0xAe7298dDa2AF52388aFde60160cD8ab0805Ed94D',
      type: 'Ethereum'
    }
  ];

  const copyToClipboard = async (text, currency) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(currency);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getSelectedCurrency = () => {
    return currencies.find(c => c.id === selectedCurrency);
  };

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (balanceActiveTab === 'deposit') {
        await createDeposit({
          amount: parseFloat(amount),
          currency: selectedCurrency,
          txHash: txHash,
          status: 'pending'
        });
        alert('Deposit request submitted successfully!');
      } else {
        await createWithdrawal({
          amount: parseFloat(amount),
          currency: selectedCurrency,
          address: withdrawalAddress,
          status: 'pending'
        });
        alert('Withdrawal request submitted successfully!');
      }
      
      setAmount('');
      setTxHash('');
      setWithdrawalAddress('');
      setShowBalanceModal(false);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const settingsOptions = [
    { name: 'Account verification', action: () => setShowVerificationModal(true) },
    { name: 'Invite your friends', action: () => navigate('/invite-friends') },
    { name: 'Contact us', action: () => setShowLiveChat(true) },
    { name: 'Help center (FAQ)', action: () => navigate('/help-center') },
    { name: 'Notification', action: () => navigate('/notifications') },
    { name: 'Change language', action: () => navigate('/language-settings') }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
       {/* Header */}
       <header className="flex items-center justify-between px-2 py-2 bg-white border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
            alt="UBS Logo" 
            className="h-8 w-auto"
          />
          <span className="text-gray-900 text-xl font-semibold">My account</span>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="px-1 pb-16">
        {/* Account Selector */}
        <div className="mt-3">
          <button className="w-full bg-white border-2 border-gray-800 rounded-lg px-2 py-1 flex items-center justify-between">
            <span className="text-gray-900 font-medium text-sm">CeDE8D</span>
            <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Account Summary Card */}
        <div className="mt-3 bg-gray-800 rounded-lg p-3 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            {/* Main Balance */}
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold text-white">0.00 USD</h1>
            </div>

            {/* Financial Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowBalanceModal(true)}
                  className="text-orange-400 text-xs hover:text-orange-300 transition-colors cursor-pointer underline hover:no-underline flex items-center space-x-1"
                >
                  <span>Balance:</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <span className="text-white text-sm">{user ? `$${user.balance?.toFixed(2) || '0.00'}` : '0.00 USD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => navigate('/loan')}
                  className="text-orange-400 text-xs hover:text-orange-300 transition-colors cursor-pointer underline hover:no-underline flex items-center space-x-1"
                >
                  <span>Loan:</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <span className="text-white text-sm">0.00 USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">Margin Used:</span>
                <span className="text-white text-sm">0.00 USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">Expected Profit:</span>
                <span className="text-white text-sm">0.00 USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Section */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Order</h2>
          
          {/* Order Tabs */}
          <div className="bg-gray-800 rounded-lg px-1 py-1 flex items-center justify-between mb-3">
            {orderTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOrderTab(tab)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  activeOrderTab === tab
                    ? 'bg-white text-gray-900'
                    : 'text-gray-300 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Order Content */}
          <div className="text-center py-8">
            <p className="text-gray-600">No more data</p>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Settings</h2>
          
           <div className="space-y-1.5">
             {settingsOptions.map((option, index) => (
               <button
                 key={index}
                 onClick={option.action}
                 className="w-full bg-gray-800 rounded-lg px-2 py-2 flex items-center justify-between hover:bg-gray-700 transition-colors"
               >
                 <span className="text-white font-medium">{option.name}</span>
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </button>
             ))}
           </div>
        </div>
      </main>

       {/* Bottom Navigation Bar */}
       <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
         <div className="bg-gray-800 mx-1 mb-1 rounded-lg shadow-2xl px-2 py-1.5 flex items-center justify-between">
           <Link to="/" className="flex flex-col items-center space-y-1 flex-1">
             <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
             </svg>
             <span className="text-xs text-gray-300">Home</span>
           </Link>
           <Link to="/market" className="flex flex-col items-center space-y-1 flex-1">
             <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
             </svg>
             <span className="text-xs text-gray-300">Market</span>
           </Link>
           <Link to="/smart-trading" className="flex flex-col items-center space-y-1 flex-1">
             <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
             </svg>
             <span className="text-xs text-gray-300">Smart</span>
           </Link>
           <Link to="/loan" className="flex flex-col items-center space-y-1 flex-1">
             <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
             <span className="text-xs text-gray-300">Loan</span>
           </Link>
           <Link to="/account" className="flex flex-col items-center space-y-1 flex-1">
             <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
             </svg>
             <span className="text-xs text-white">Account</span>
           </Link>
         </div>
       </nav>

      {/* Mobile Balance Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Balance Management</h2>
              <button
                onClick={() => setShowBalanceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-3 bg-gray-100 rounded-lg p-1 mx-4 mt-4">
              <button
                onClick={() => setBalanceActiveTab('deposit')}
                className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
                  balanceActiveTab === 'deposit'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setBalanceActiveTab('withdrawal')}
                className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
                  balanceActiveTab === 'withdrawal'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Withdraw
              </button>
            </div>

            {/* Current Balance */}
            <div className="bg-gray-50 rounded-lg p-3 mx-4 mb-4">
              <div className="text-xs text-gray-600 mb-1">Current Balance</div>
              <div className="text-lg font-bold text-gray-900">
                ${user?.balance?.toFixed(2) || '0.00'} USD
              </div>
            </div>

            {/* Form */}
            <div className="px-4 pb-4">
              <form onSubmit={handleBalanceSubmit} className="space-y-4">
                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((currency) => (
                      <button
                        key={currency.id}
                        type="button"
                        onClick={() => setSelectedCurrency(currency.id)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          selectedCurrency === currency.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{currency.symbol}</span>
                          <span>{currency.id}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Deposit-specific fields */}
                {balanceActiveTab === 'deposit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Hash</label>
                    <input
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter transaction hash"
                      required
                    />
                  </div>
                )}

                {/* Withdrawal-specific fields */}
                {balanceActiveTab === 'withdrawal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Address</label>
                    <input
                      type="text"
                      value={withdrawalAddress}
                      onChange={(e) => setWithdrawalAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter withdrawal address"
                      required
                    />
                  </div>
                )}

                {/* Deposit Address Display */}
                {balanceActiveTab === 'deposit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Address</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{getSelectedCurrency()?.name}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(getSelectedCurrency()?.address, selectedCurrency)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {copiedAddress === selectedCurrency ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 break-all mb-2">
                        {getSelectedCurrency()?.address}
                      </div>
                      <div className="flex justify-center">
                        <QRCodeSVG value={getSelectedCurrency()?.address} size={120} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Processing...' : `${balanceActiveTab === 'deposit' ? 'Submit Deposit' : 'Submit Withdrawal'}`}
                </button>
              </form>
            </div>
          </div>
         </div>
       )}

       {/* Account Verification Modal */}
       <AccountVerificationModal 
         isOpen={showVerificationModal} 
         onClose={() => setShowVerificationModal(false)} 
       />

       {/* Live Chat Modal */}
       <LiveChat 
         isOpen={showLiveChat} 
         onClose={() => setShowLiveChat(false)} 
       />
     </div>
  );
}
