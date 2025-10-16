import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AccountVerificationModal from './AccountVerificationModal';

const Loan = () => {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(7);
  const [currency, setCurrency] = useState('USD');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [dailyInterestRate] = useState(0.1);
  const [totalInterest, setTotalInterest] = useState(0);

  const maxLoanAmount = 5000000;
  const termOptions = [7, 14, 30, 60, 90, 180, 365];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'CHF'];

  // Calculate total interest
  useEffect(() => {
    if (loanAmount && loanAmount > 0) {
      const amount = parseFloat(loanAmount);
      const interest = (amount * dailyInterestRate / 100) * loanTerm;
      setTotalInterest(interest);
    } else {
      setTotalInterest(0);
    }
  }, [loanAmount, loanTerm, dailyInterestRate]);

  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLoanAmount(value);
    }
  };

  const handleBorrowNow = () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }
    
    if (parseFloat(loanAmount) > maxLoanAmount) {
      alert(`Maximum loan amount is ${maxLoanAmount.toLocaleString()} ${currency}`);
      return;
    }

    // Here you would typically submit the loan application
    alert(`Loan application submitted for ${loanAmount} ${currency} for ${loanTerm} days`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white account-container pt-20" style={{ minWidth: '1200px' }}>
      {/* Main Content */}
      <div className="container-max py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Loan Offer Display */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl font-bold text-gray-900 mb-4"
            >
              {maxLoanAmount.toLocaleString()} {currency}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              {t('loanSubtitle')}
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => setShowVerificationModal(true)}
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105"
            >
{t('verification')}
            </motion.button>
          </div>

          {/* Loan Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg"
          >
            {/* Loan Amount Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('loanAmount')}
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  placeholder="I want to borrow..."
                  className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-6 py-4 bg-gray-800 text-white border-2 border-l-0 border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencyOptions.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              {loanAmount && parseFloat(loanAmount) > maxLoanAmount && (
                <p className="text-red-500 text-sm mt-2">
                  Maximum loan amount is {maxLoanAmount.toLocaleString()} {currency}
                </p>
              )}
            </div>

            {/* Loan Term Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('loanTerm')}
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={`${loanTerm} Days`}
                  readOnly
                  className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-l-xl bg-gray-50 text-lg"
                />
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="px-6 py-4 bg-gray-800 text-white border-2 border-l-0 border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {termOptions.map((days) => (
                    <option key={days} value={days}>{days} Days</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interest Rate and Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-2">{t('interestRate')}:</p>
                  <p className="text-3xl font-bold text-gray-900">{dailyInterestRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Total interest amount:</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalInterest)}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  No interest need to pay within {loanTerm} days of the loan, after that, interest is payable.
                </p>
              </div>
            </div>

            {/* Borrow Now Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBorrowNow}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
            >
{t('getStarted')}
            </motion.button>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Interest Rates</h3>
                <p className="text-gray-600">Competitive rates starting from 0.1% daily</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Approval</h3>
                <p className="text-gray-600">Get approved within minutes</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
                <p className="text-gray-600">Bank-level security for your transactions</p>
              </div>
            </div>
          </motion.div>
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
                  <li><a href="#products" className="text-gray-300 hover:text-white transition-colors duration-300">Markets</a></li>
                  <li><a href="#products" className="text-gray-300 hover:text-white transition-colors duration-300">Investment & Lending</a></li>
                  <li><a href="#products" className="text-gray-300 hover:text-white transition-colors duration-300">Smart Trading</a></li>
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
                  <li><a href="#company" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</a></li>
                  <li><a href="#company" className="text-gray-300 hover:text-white transition-colors duration-300">License Supervision</a></li>
                  <li><a href="#company" className="text-gray-300 hover:text-white transition-colors duration-300">Help Center</a></li>
                  <li><a href="#company" className="text-gray-300 hover:text-white transition-colors duration-300">Online Support</a></li>
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
                  <li><a href="#legal" className="text-gray-300 hover:text-white transition-colors duration-300">Terms & Conditions</a></li>
                  <li><a href="#legal" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Legal Links */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <a href="#legal" className="hover:text-white transition-colors duration-300">Legal Information</a>
                <a href="#legal" className="hover:text-white transition-colors duration-300">Disclaimer</a>
                <a href="#legal" className="hover:text-white transition-colors duration-300">Risk Warning</a>
                <a href="#legal" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
                <a href="#legal" className="hover:text-white transition-colors duration-300">About Advertising</a>
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

      {/* Verification Modal */}
      <AccountVerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)} 
      />
    </div>
  );
};

export default Loan;
