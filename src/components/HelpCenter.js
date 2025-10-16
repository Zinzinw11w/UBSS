import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'General',
    'Account',
    'Trading',
    'Deposits',
    'Withdrawals',
    'Security',
    'Technical'
  ];

  const faqs = {
    General: [
      {
        question: 'What is UBS?',
        answer: 'UBS is a leading financial services platform that provides advanced trading tools, real-time market data, and comprehensive investment solutions for both beginners and experienced traders.'
      },
      {
        question: 'How do I get started?',
        answer: 'To get started, simply create an account, complete the verification process, deposit funds, and start trading. Our platform is designed to be user-friendly for all experience levels.'
      },
      {
        question: 'Is UBS regulated?',
        answer: 'Yes, UBS operates under strict regulatory compliance and is licensed in multiple jurisdictions. We maintain the highest standards of security and regulatory adherence.'
      }
    ],
    Account: [
      {
        question: 'How do I verify my account?',
        answer: 'Account verification involves submitting your personal information, identity documents, and proof of address. This process typically takes 1-3 business days to complete.'
      },
      {
        question: 'What documents do I need for verification?',
        answer: 'You will need a government-issued ID (passport, driver\'s license, or national ID), proof of address (utility bill or bank statement), and in some cases, additional documentation for enhanced verification.'
      },
      {
        question: 'Can I have multiple accounts?',
        answer: 'No, each user is allowed only one account per person. Multiple accounts are not permitted and may result in account suspension.'
      }
    ],
    Trading: [
      {
        question: 'What trading pairs are available?',
        answer: 'We offer a wide range of trading pairs including major cryptocurrencies (BTC, ETH, etc.), forex pairs, stocks, ETFs, and futures contracts.'
      },
      {
        question: 'What are the trading fees?',
        answer: 'Our trading fees are competitive and vary based on your trading volume and account type. Maker fees start at 0.1% and taker fees start at 0.2%.'
      },
      {
        question: 'How do I place a trade?',
        answer: 'To place a trade, select your desired trading pair, choose your order type (market, limit, stop), enter the amount, and confirm your trade. Always review your order before confirming.'
      }
    ],
    Deposits: [
      {
        question: 'How do I deposit funds?',
        answer: 'You can deposit funds via bank transfer, credit/debit card, or cryptocurrency. Navigate to the deposit section in your account dashboard and follow the instructions.'
      },
      {
        question: 'Are there deposit fees?',
        answer: 'Deposit fees vary by method. Bank transfers are usually free, while card deposits may have a small fee. Cryptocurrency deposits are typically free.'
      },
      {
        question: 'How long do deposits take?',
        answer: 'Deposit times vary by method: bank transfers (1-3 business days), card deposits (instant), cryptocurrency deposits (10-30 minutes depending on network congestion).'
      }
    ],
    Withdrawals: [
      {
        question: 'How do I withdraw funds?',
        answer: 'To withdraw funds, go to the withdrawal section in your account, select your preferred method, enter the amount, and confirm your withdrawal request.'
      },
      {
        question: 'What are the withdrawal limits?',
        answer: 'Withdrawal limits depend on your account verification level. Basic accounts have lower limits, while fully verified accounts have higher limits.'
      },
      {
        question: 'How long do withdrawals take?',
        answer: 'Withdrawal processing times vary: bank transfers (1-3 business days), card withdrawals (1-2 business days), cryptocurrency withdrawals (10-30 minutes).'
      }
    ],
    Security: [
      {
        question: 'How secure is my account?',
        answer: 'We use bank-level security including SSL encryption, two-factor authentication, cold storage for cryptocurrencies, and regular security audits.'
      },
      {
        question: 'What is two-factor authentication?',
        answer: 'Two-factor authentication (2FA) adds an extra layer of security by requiring a second verification step, typically through an authenticator app or SMS.'
      },
      {
        question: 'What should I do if I suspect unauthorized access?',
        answer: 'If you suspect unauthorized access, immediately change your password, enable 2FA if not already active, and contact our support team immediately.'
      }
    ],
    Technical: [
      {
        question: 'What browsers are supported?',
        answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome.'
      },
      {
        question: 'Is there a mobile app?',
        answer: 'Yes, we have mobile apps for both iOS and Android devices. You can download them from the App Store or Google Play Store.'
      },
      {
        question: 'What if I experience technical issues?',
        answer: 'If you experience technical issues, try refreshing your browser, clearing cache and cookies, or using a different browser. If problems persist, contact our technical support.'
      }
    ]
  };

  const filteredFaqs = faqs[activeCategory].filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white account-container pt-20" style={{ minWidth: '1200px' }}>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container-max">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">UBS</Link>
            <span>></span>
            <Link to="/account" className="hover:text-gray-900">Account</Link>
            <span>></span>
            <span className="text-gray-900">Help Center (FAQ)</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-max py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Help Center (FAQ)</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get the support you need</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full px-6 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
            </div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
            <p className="text-gray-600 mb-6">Our support team is here to assist you 24/7</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                Contact Support
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors duration-300">
                Live Chat
              </button>
            </div>
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
    </div>
  );
};

export default HelpCenter;
