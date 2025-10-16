import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const InviteFriends = () => {
  const [copied, setCopied] = useState(false);

  const inviteLink = "https://tokenize.com/invite/ref123456";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Register",
      description: "Fill in the online form and open a trading account.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Fund",
      description: "Deposit funds into your account to start trading.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Trade",
      description: "Start trading with our award-winning trading platform.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

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
            <span className="text-gray-900">Invite friends</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-max py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Page Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Invite your friends</h1>

          {/* User Icons */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="w-20 h-20 bg-blue-100 border-4 border-blue-300 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-16 leading-relaxed">
            Invite your friends and family to join us, and reap the rewards together while embarking on a journey towards financial prosperity!
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title} #{step.number}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Copy Link Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            onClick={handleCopyLink}
            className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {copied ? (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </div>
            ) : (
              'Copy link'
            )}
          </motion.button>

          {/* Referral Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <div className="text-gray-600">Friends Invited</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">$0.00</div>
              <div className="text-gray-600">Total Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <div className="text-gray-600">Active Referrals</div>
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
    </div>
  );
};

export default InviteFriends;
