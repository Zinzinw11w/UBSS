import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoanModal = ({ isOpen, onClose }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanType, setLoanType] = useState('personal');
  const [isProcessing, setIsProcessing] = useState(false);

  const loanTypes = [
    { 
      id: 'personal', 
      name: 'Personal Loan', 
      icon: '👤',
      minAmount: 1000,
      maxAmount: 50000,
      interestRate: '8.5%',
      term: '12-60 months'
    },
    { 
      id: 'business', 
      name: 'Business Loan', 
      icon: '🏢',
      minAmount: 5000,
      maxAmount: 200000,
      interestRate: '6.9%',
      term: '12-84 months'
    },
    { 
      id: 'mortgage', 
      name: 'Mortgage Loan', 
      icon: '🏠',
      minAmount: 50000,
      maxAmount: 1000000,
      interestRate: '4.2%',
      term: '15-30 years'
    },
    { 
      id: 'auto', 
      name: 'Auto Loan', 
      icon: '🚗',
      minAmount: 5000,
      maxAmount: 100000,
      interestRate: '5.8%',
      term: '24-84 months'
    }
  ];

  const selectedLoanData = loanTypes.find(l => l.id === loanType);

  const handleLoanRequest = async () => {
    if (!loanAmount || parseFloat(loanAmount) < selectedLoanData.minAmount || parseFloat(loanAmount) > selectedLoanData.maxAmount) {
      alert(`Loan amount must be between $${selectedLoanData.minAmount.toLocaleString()} and $${selectedLoanData.maxAmount.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    
    // Simulate loan processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Loan application for $${parseFloat(loanAmount).toLocaleString()} ${selectedLoanData.name} submitted successfully!`);
      onClose();
      setLoanAmount('');
    }, 2000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setLoanAmount('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Apply for Loan</h2>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Loan Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Loan Type</label>
              <div className="grid grid-cols-2 gap-3">
                {loanTypes.map((loan) => (
                  <button
                    key={loan.id}
                    onClick={() => setLoanType(loan.id)}
                    disabled={isProcessing}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      loanType === loan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{loan.icon}</div>
                      <div className="font-medium text-gray-900 text-sm">{loan.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{loan.interestRate} APR</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  disabled={isProcessing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  USD
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Range: ${selectedLoanData.minAmount.toLocaleString()} - ${selectedLoanData.maxAmount.toLocaleString()}
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Loan Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{selectedLoanData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-medium">{selectedLoanData.interestRate} APR</span>
                </div>
                <div className="flex justify-between">
                  <span>Term:</span>
                  <span className="font-medium">{selectedLoanData.term}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">1-3 business days</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLoanRequest}
                disabled={isProcessing || !loanAmount}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Apply for Loan'
                )}
              </button>
            </div>

            {/* Information */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Quick Approval:</p>
                  <p>Get pre-approved in minutes with our instant decision process.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoanModal;

