import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnectionModal from './WalletConnectionModal';

export default function MobileLoan() {
  const [borrowAmount, setBorrowAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('7 Days');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showLoanTermDropdown, setShowLoanTermDropdown] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthdate: '',
    country: '',
    address: '',
    email: '',
    phoneNumber: '',
    document: null
  });
  const { isConnected, account } = useWallet();

  const loanTerms = ['7 Days', '14 Days', '30 Days', '60 Days', '90 Days'];

  const handleLoanTermSelect = (term) => {
    setLoanTerm(term);
    setShowLoanTermDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLoanTermDropdown && !event.target.closest('.loan-term-dropdown')) {
        setShowLoanTermDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoanTermDropdown]);

  const calculateInterest = () => {
    const amount = parseFloat(borrowAmount) || 0;
    const dailyRate = 0.001; // 0.1%
    const days = parseInt(loanTerm) || 7;
    const totalInterest = amount * dailyRate * days;
    return totalInterest.toFixed(2);
  };

  const handleBorrowNow = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    if (parseFloat(borrowAmount) > 5000000) {
      alert('Maximum loan amount is 5,000,000 USD');
      return;
    }

    setIsProcessing(true);
    
    // Simulate loan processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Loan application for ${borrowAmount} USD for ${loanTerm} submitted successfully!`);
    }, 2000);
  };

  const handleStartVerification = () => {
    setShowVerification(true);
    setVerificationStep(1);
  };

  const [errors, setErrors] = useState({});

  const handleVerificationInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    setVerificationData(prev => ({
      ...prev,
      document: e.target.files[0]
    }));
  };

  const handleNextStep = () => {
    // Clear previous errors
    setErrors({});
    
    // Validate current step before proceeding
    if (verificationStep === 1) {
      // Validate personal information
      const newErrors = {};
      const requiredFields = ['firstName', 'lastName', 'gender', 'birthdate', 'country', 'address'];
      
      requiredFields.forEach(field => {
        if (!verificationData[field]) {
          newErrors[field] = 'This field is required';
        }
      });
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (verificationStep === 2) {
      // Validate contact details
      const newErrors = {};
      
      if (!verificationData.email) {
        newErrors.email = 'Email is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(verificationData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
      }
      
      if (!verificationData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(verificationData.phoneNumber.replace(/\s/g, ''))) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    
    if (verificationStep < 3) {
      setVerificationStep(verificationStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (verificationStep > 1) {
      setVerificationStep(verificationStep - 1);
    }
  };

  const handleSubmitVerification = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'gender', 'birthdate', 'country', 'address', 'email', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !verificationData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (!verificationData.document) {
      alert('Please upload a document');
      return;
    }

    // Submit verification
    alert('Verification submitted successfully! You will receive an email confirmation within 24 hours.');
    setShowVerification(false);
    setVerificationStep(1);
    setVerificationData({
      firstName: '',
      lastName: '',
      gender: '',
      birthdate: '',
      country: '',
      address: '',
      email: '',
      phoneNumber: '',
      document: null
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Wallet Connection Modal */}
      <WalletConnectionModal />
      
      {/* Header */}
      <header className="flex items-center justify-between px-2 py-2 bg-white border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
            alt="UBS Logo" 
            className="h-8 w-auto"
          />
          <span className="text-gray-900 text-xl font-semibold">Loan account</span>
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
        {/* Loan Offer Section */}
        <div className="mt-3 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">5,000,000 USD</h1>
          <p className="text-gray-600 text-xs mb-3">Verify your identity and get more loan amount!</p>
          <button 
            onClick={handleStartVerification}
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold text-sm"
          >
            Start verification
          </button>
        </div>

        {/* Borrowing Form */}
        <div className="mt-8 space-y-4">
          {/* Borrow Amount Input */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white border border-gray-300 rounded-2xl px-4 py-4">
              <input
                type="text"
                placeholder="I want to borrow..."
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="w-full text-gray-900 placeholder-gray-500 outline-none"
              />
            </div>
            <button className="bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium">
              USD
            </button>
          </div>

          {/* Loan Term Input */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-800 border border-gray-300 rounded-2xl px-4 py-4">
              <span className="text-white text-sm">Loan term (Days):</span>
            </div>
            <div className="relative loan-term-dropdown">
              <button 
                onClick={() => setShowLoanTermDropdown(!showLoanTermDropdown)}
                className="bg-white border border-gray-300 rounded-2xl px-4 py-4 text-gray-900 font-medium flex items-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <span>{loanTerm}</span>
                <svg className={`w-4 h-4 transition-transform ${showLoanTermDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showLoanTermDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                  {loanTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleLoanTermSelect(term)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        term === loanTerm ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interest Rate Information */}
        <div className="mt-8 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Daily interest rate:</span>
            <span className="text-gray-900 font-bold">0.1%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total interest amount:</span>
            <span className="text-gray-900 font-bold">{calculateInterest()} USD</span>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            No interest need to pay within 0 days of the loan, after that, interest is payable.
          </p>
        </div>

        {/* Borrow Now Button */}
        <div className="mt-8">
          <button 
            onClick={handleBorrowNow}
            disabled={isProcessing}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Borrow now'
            )}
          </button>
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
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs text-white">Loan</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center space-y-1 flex-1">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs text-gray-300">Account</span>
          </Link>
        </div>
      </nav>
      {/* Mobile Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Account Verification</h2>
              <button
                onClick={() => setShowVerification(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  verificationStep >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${verificationStep >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  verificationStep >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-1 mx-2 ${verificationStep >= 3 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  verificationStep >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Personal Info</span>
                <span>Contact Details</span>
                <span>Documents</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4">
              {verificationStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={verificationData.firstName}
                        onChange={handleVerificationInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={verificationData.lastName}
                        onChange={handleVerificationInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={verificationData.gender}
                      onChange={handleVerificationInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      name="birthdate"
                      value={verificationData.birthdate}
                      onChange={handleVerificationInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.birthdate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.birthdate && (
                      <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      name="country"
                      value={verificationData.country}
                      onChange={handleVerificationInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="CH">Switzerland</option>
                      <option value="JP">Japan</option>
                      <option value="SG">Singapore</option>
                      <option value="HK">Hong Kong</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <textarea
                      name="address"
                      value={verificationData.address}
                      onChange={handleVerificationInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows="3"
                      placeholder="Enter your full address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                </div>
              )}

              {verificationStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={verificationData.email}
                      onChange={handleVerificationInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={verificationData.phoneNumber}
                      onChange={handleVerificationInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Verification Process</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• We will send a verification code to your email</li>
                      <li>• You may receive a call for phone verification</li>
                      <li>• Processing typically takes 1-3 business days</li>
                      <li>• You'll receive email updates on your status</li>
                    </ul>
                  </div>
                </div>
              )}

              {verificationStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Identity Document *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {verificationData.document ? verificationData.document.name : 'Click to upload document'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Accepted Documents</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Passport (preferred)</li>
                      <li>• Driver's License</li>
                      <li>• National ID Card</li>
                      <li>• Government-issued ID</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Document Requirements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Document must be valid and not expired</li>
                      <li>• All text must be clearly visible</li>
                      <li>• No blurry or low-quality images</li>
                      <li>• Document must match your personal information</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-3 mt-6">
                {verificationStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {verificationStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitVerification}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Submit Verification
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
