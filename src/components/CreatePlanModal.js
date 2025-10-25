import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDatabase } from '../contexts/DatabaseContext';

const CreatePlanModal = ({ isOpen, onClose, symbol, availableBalance = 0 }) => {
  const { createTrade } = useDatabase();
  const [amount, setAmount] = useState('');
  const [timeframe, setTimeframe] = useState('1 Day');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [lastOperationTime, setLastOperationTime] = useState(0);
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  // Dynamic configuration based on amount
  const getPlanConfig = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount >= 1000 && numericAmount <= 9999) {
      return {
        timeframeOptions: ['1 Day', '7 Days', '15 Days']
      };
    } else if (numericAmount >= 10000 && numericAmount <= 49999) {
      return {
        timeframeOptions: ['7 Days', '15 Days', '30 Days']
      };
    } else if (numericAmount >= 50000 && numericAmount <= 199999) {
      return {
        timeframeOptions: ['15 Days', '30 Days', '60 Days']
      };
    } else {
      return {
        timeframeOptions: ['1 Day', '7 Days', '15 Days', '30 Days', '60 Days']
      };
    }
  };

  // Get amount limit based on selected timeframe
  const getAmountLimit = (selectedTimeframe) => {
    const days = parseInt(selectedTimeframe.split(' ')[0]);
    
    if (days === 1) {
      return '1000-9999 USD';
    } else if (days === 7) {
      return '10000-49999 USD';
    } else if (days === 15) {
      return '50000-199999 USD';
    } else if (days === 30) {
      return '100000-499999 USD';
    } else if (days === 60) {
      return '500000-999999 USD';
    } else {
      return '1000-999999 USD';
    }
  };

  // Get yield based on selected timeframe
  const getDailyYield = (selectedTimeframe) => {
    const days = parseInt(selectedTimeframe.split(' ')[0]);
    
    if (days === 1) {
      return '1.50%-1.80%';
    } else if (days === 7) {
      return '1.80%-4.80%';
    } else if (days === 15) {
      return '2.10%-2.50%';
    } else if (days === 30) {
      return '2.50%-2.80%';
    } else if (days === 60) {
      return '2.80%-3.00%';
    } else {
      return '1.50%-3.00%';
    }
  };

  const planConfig = getPlanConfig(amount);
  const amountLimit = getAmountLimit(timeframe);
  const dailyYield = getDailyYield(timeframe);

  // Handle amount change and update timeframe if current selection is not valid
  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    setError('');
    
    // Update timeframe if current selection is not in the new options
    const numericAmount = parseFloat(newAmount) || 0;
    const newConfig = getPlanConfig(numericAmount);
    if (!newConfig.timeframeOptions.includes(timeframe)) {
      setTimeframe(newConfig.timeframeOptions[0]);
    }
  };

  // Handle amount input focus
  const handleAmountFocus = () => {
    setIsAmountFocused(true);
  };

  // Handle amount input blur
  const handleAmountBlur = () => {
    setIsAmountFocused(false);
    // If field is empty, set it back to empty string
    if (amount === '' || amount === null || amount === undefined) {
      setAmount('');
    }
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setError('');
  };

  // Validation function
  const validatePlan = () => {
    const currentTime = Date.now();
    const numericAmount = parseFloat(amount) || 0;
    
    // Check for insufficient balance
    if (numericAmount > availableBalance) {
      setError('Insufficient balance in user account');
      return false;
    }
    
    // Check for operation frequency (prevent operations within 5 seconds)
    if (currentTime - lastOperationTime < 5000) {
      setError('Operation too frequent');
      return false;
    }
    
    // Check amount limits based on timeframe
    const days = parseInt(timeframe.split(' ')[0]) || 1;
    let minAmount, maxAmount;
    
    if (days === 1) {
      minAmount = 1000; maxAmount = 9999; // 1 day: 1000-9999 USD
    } else if (days === 7) {
      minAmount = 10000; maxAmount = 49999; // 7 days: 10000-49999 USD
    } else if (days === 15) {
      minAmount = 50000; maxAmount = 199999; // 15 days: 50000-199999 USD
    } else if (days === 30) {
      minAmount = 100000; maxAmount = 499999; // 30 days: 100000-499999 USD
    } else if (days === 60) {
      minAmount = 500000; maxAmount = 999999; // 60 days: 500000-999999 USD
    } else {
      minAmount = 1000; maxAmount = 199999; // Default fallback
    }
    
    if (numericAmount < minAmount) {
      setError(`Minimum amount is ${minAmount.toLocaleString()} USD for ${timeframe} plans`);
      return false;
    }
    
    if (numericAmount > maxAmount) {
      setError(`Maximum amount is ${maxAmount.toLocaleString()} USD for ${timeframe} plans`);
      return false;
    }
    
    return true;
  };

  // Handle create button click
  const handleCreate = async () => {
    if (validatePlan()) {
      setLastOperationTime(Date.now());
      
      try {
        // Create trade data object
        const tradeData = {
          symbol: symbol,
          amount: parseFloat(amount) || 0,
          timeframe: timeframe,
          direction: 'Up', // Default direction
          openPrice: Math.random() * 100000 + 50000, // Mock price
          closePrice: null,
          profit: 0,
          type: 'Smart Trading',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + (parseInt(timeframe.split(' ')[0]) * 24 * 60 * 60 * 1000)).toISOString()
        };

        // Use the new validation system
        await createTrade(tradeData);
        
        console.log('Trade created successfully:', tradeData);
        onClose();
      } catch (error) {
        console.error('Error creating trade:', error);
        
        if (error.message === 'INSUFFICIENT_FUNDS' || error.message === 'RATE_LIMIT_EXCEEDED') {
          // Error alert is already shown by the context
          // Just close the modal
          onClose();
        } else {
          setError('Failed to create trading plan. Please try again.');
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Create a plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 sm:space-y-4">
          {/* Amount Limit */}
          <div className="bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
            <label className="text-xs sm:text-sm font-normal text-gray-900">Amount Limit:</label>
            <div className="text-xs sm:text-sm text-gray-500">{amountLimit}</div>
          </div>

          {/* Daily Yield */}
          <div className="bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
            <label className="text-xs sm:text-sm font-normal text-gray-900">Daily yield:</label>
            <div className="text-xs sm:text-sm text-gray-500">{dailyYield}</div>
          </div>

          {/* Product */}
          <div className="bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
            <label className="text-xs sm:text-sm font-normal text-gray-900">Product:</label>
            <div className="text-xs sm:text-sm text-gray-500">{symbol || 'Apple Tokenize'}</div>
          </div>

          {/* Timeframe */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center hover:bg-gray-200 transition-colors"
            >
              <label className="text-xs sm:text-sm font-normal text-gray-900">Timeframe:</label>
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-900 mr-2">{timeframe}</span>
                <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                {planConfig.timeframeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleTimeframeChange(option);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-xs sm:text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1 sm:mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onFocus={handleAmountFocus}
              onBlur={handleAmountBlur}
              className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-none outline-none no-spinner text-right text-sm sm:text-base"
              placeholder="0"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-700 text-xs sm:text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={handleCreate}
            className="w-full bg-gray-800 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            Create
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePlanModal;
