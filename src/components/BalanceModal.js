import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDatabase } from '../contexts/DatabaseContext';
import { QRCodeSVG } from 'qrcode.react';

const BalanceModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [txHash, setTxHash] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');
  
  const { createDeposit, createWithdrawal, user } = useDatabase();

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
      type: 'ERC20'
    },
    { 
      id: 'USDT', 
      name: 'Tether', 
      symbol: '$',
      address: '0xAe7298dDa2AF52388aFde60160cD8ab0805Ed94D',
      type: 'ERC20'
    }
  ];

  const handleDeposit = async () => {
    if (!amount || !txHash) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDeposit(parseFloat(amount), selectedCurrency, txHash);
      alert('Deposit request submitted successfully!');
      onClose();
      setAmount('');
      setTxHash('');
      setError('');
    } catch (error) {
      setError('Failed to submit deposit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || !withdrawalAddress) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) > (user?.balance || 0)) {
      setError('Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    try {
      await createWithdrawal(parseFloat(amount), selectedCurrency, withdrawalAddress);
      alert('Withdrawal request submitted successfully!');
      onClose();
      setAmount('');
      setWithdrawalAddress('');
      setError('');
    } catch (error) {
      setError('Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'deposit') {
      handleDeposit();
    } else {
      handleWithdrawal();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-3 sm:p-4 w-full max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Balance Management</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-1 sm:py-2 px-2 sm:px-3 rounded-md font-medium text-xs sm:text-sm transition-colors ${
                activeTab === 'deposit'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdrawal')}
              className={`flex-1 py-1 sm:py-2 px-2 sm:px-3 rounded-md font-medium text-xs sm:text-sm transition-colors ${
                activeTab === 'withdrawal'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Current Balance */}
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-3">
            <div className="text-xs text-gray-600 mb-1">Current Balance</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">
              ${user?.balance?.toFixed(2) || '0.00'} USD
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Amount ({activeTab === 'deposit' ? 'to deposit' : 'to withdraw'})
              </label>
               <input
                 type="number"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 placeholder="0.00"
                 className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                 min="0"
                 step="0.01"
               />
            </div>

            {/* Currency Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-1">
                {currencies.map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => setSelectedCurrency(currency.id)}
                    className={`p-1 sm:p-2 rounded-lg border-2 transition-colors text-xs ${
                      selectedCurrency === currency.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{currency.symbol} {currency.id}</div>
                    <div className="text-xs text-gray-500">{currency.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Address Section */}
            {activeTab === 'deposit' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="text-xs font-medium text-blue-900 mb-2">
                  Deposit to {getSelectedCurrency()?.name} Address
                </div>
                
                {/* QR Code */}
                <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="bg-white p-1 rounded mx-auto sm:mx-0">
                    <QRCodeSVG 
                      value={getSelectedCurrency()?.address || ''} 
                      size={60}
                      level="M"
                    />
                  </div>
                  
                  {/* Address and Copy Button */}
                  <div className="flex-1 w-full">
                    <div className="text-xs text-gray-600 mb-1">
                      {getSelectedCurrency()?.type} Address:
                    </div>
                    <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                      <div className="text-xs font-mono text-gray-800 break-all">
                        {getSelectedCurrency()?.address}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getSelectedCurrency()?.address || '', selectedCurrency)}
                      className={`w-full py-1 px-2 rounded font-medium text-xs transition-colors flex items-center justify-center space-x-1 ${
                        copiedAddress === selectedCurrency
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copiedAddress === selectedCurrency ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-blue-700">
                  <p>• Send only {getSelectedCurrency()?.id} to this address</p>
                  <p>• Minimum deposit: $1000 USD equivalent</p>
                  <p>• Double-check the address before sending</p>
                </div>
              </div>
            )}

            {/* Transaction Hash (for deposits) */}
            {activeTab === 'deposit' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Transaction Hash *
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter transaction hash"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Withdrawal Address (for withdrawals) */}
            {activeTab === 'withdrawal' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Withdrawal Address *
                </label>
                <input
                  type="text"
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                <div className="text-red-600 text-xs">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                activeTab === 'deposit'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : `${activeTab === 'deposit' ? 'Submit Deposit' : 'Submit Withdrawal'}`}
            </button>
          </div>

          {/* Info */}
          <div className="mt-3 text-xs text-gray-500">
            {activeTab === 'deposit' ? (
              <div>
                <p>• Deposits are processed after blockchain confirmation</p>
                <p>• Minimum deposit: $1000 USD equivalent</p>
                <p>• Processing time: 10-30 minutes</p>
              </div>
            ) : (
              <div>
                <p>• Processing time: 1-24 hours</p>
                <p>• Network fees may apply</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BalanceModal;
