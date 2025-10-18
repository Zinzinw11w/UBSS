import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';
import LanguageModal from './LanguageModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { isConnected, account, formatAddress, balance } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-max py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <img 
                src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
                alt="UBS Logo" 
                className="h-8 sm:h-10 w-auto"
              />
              <span className="text-lg sm:text-2xl font-bold text-black">Tokenize</span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-300 font-medium text-sm xl:text-base ${
                location.pathname === '/' 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/market" 
              className={`transition-colors duration-300 font-medium text-sm xl:text-base ${
                location.pathname === '/market' 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {t('market')}
            </Link>
            <Link 
              to="/smart-trading" 
              className={`transition-colors duration-300 font-medium text-sm xl:text-base ${
                location.pathname === '/smart-trading' 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {t('smartTrading')}
            </Link>
            <Link 
              to="/loan" 
              className={`transition-colors duration-300 font-medium text-sm xl:text-base ${
                location.pathname === '/loan' 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {t('loan')}
            </Link>
            <Link 
              to="/account" 
              className={`transition-colors duration-300 font-medium text-sm xl:text-base ${
                location.pathname === '/account' 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {t('account')}
            </Link>
          </div>
          
          {/* Desktop Search, Notification, Language Selector and Wallet Status */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Search Icon */}
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Notification Bell Icon */}
            <Link to="/notifications" className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </Link>
            
            {/* Wallet Status Indicator */}
            {isConnected && (
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-2 xl:px-3 py-1">
                <img 
                  src="https://avatars.githubusercontent.com/u/11744586?s=200&v=4" 
                  alt="MetaMask" 
                  className="w-3 h-3 xl:w-4 xl:h-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <span className="text-green-600 text-xs hidden">🦊</span>
                <span className="text-green-800 text-xs xl:text-sm font-medium">{formatAddress(account)}</span>
                {balance && (
                  <span className="text-green-600 text-xs">{balance} ETH</span>
                )}
              </div>
            )}
            
            <button
              onClick={() => setShowLanguageModal(true)}
              className="text-gray-700 font-medium hover:text-black transition-colors text-sm xl:text-base"
            >
              {t('language')}
            </button>
          </div>
          
          {/* Mobile Search, Notification and Menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search Icon */}
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Mobile Notification Bell Icon */}
            <Link to="/notifications" className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </Link>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 border-t border-gray-200 pt-4"
          >
            <div className="flex flex-col space-y-4">
              {/* Mobile Wallet Status */}
              {isConnected && (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                  <img 
                    src="https://avatars.githubusercontent.com/u/11744586?s=200&v=4" 
                    alt="MetaMask" 
                    className="w-4 h-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-green-600 text-sm hidden">🦊</span>
                  <span className="text-green-800 text-sm font-medium">{formatAddress(account)}</span>
                  {balance && (
                    <span className="text-green-600 text-xs">{balance} ETH</span>
                  )}
                </div>
              )}
              
              {/* Mobile Navigation Links */}
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-colors duration-300 font-medium py-2 ${
                  location.pathname === '/' 
                    ? 'text-black font-bold' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {t('home')}
              </Link>
              <Link 
                to="/market" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-colors duration-300 font-medium py-2 ${
                  location.pathname === '/market' 
                    ? 'text-black font-bold' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {t('market')}
              </Link>
              <Link 
                to="/smart-trading" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-colors duration-300 font-medium py-2 ${
                  location.pathname === '/smart-trading' 
                    ? 'text-black font-bold' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {t('smartTrading')}
              </Link>
              <Link 
                to="/loan" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-colors duration-300 font-medium py-2 ${
                  location.pathname === '/loan' 
                    ? 'text-black font-bold' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {t('loan')}
              </Link>
              <Link 
                to="/account" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-colors duration-300 font-medium py-2 ${
                  location.pathname === '/account' 
                    ? 'text-black font-bold' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {t('account')}
              </Link>
              
              {/* Mobile Language Selector */}
              <button
                onClick={() => {
                  setShowLanguageModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 font-medium hover:text-black transition-colors py-2 text-left"
              >
                {t('language')}
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Language Modal */}
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </motion.header>
  );
};

export default Header;
