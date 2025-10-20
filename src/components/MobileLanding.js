import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useWallet } from '../contexts/WalletContext';
import { useDatabase } from '../contexts/DatabaseContext';
import WalletConnectionModal from './WalletConnectionModal';

export default function MobileLanding() {
  const { isConnected } = useWallet();
  const { user } = useDatabase();

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
          <span className="text-gray-900 text-xl font-semibold">Tokenize</span>
        </Link>
        <div className="flex items-center space-x-3">
          {/* Search Icon */}
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Notification Bell Icon */}
          <Link to="/notifications" className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </Link>
        </div>
      </header>

      <main className="px-1 pb-16">
        {/* Balance Card */}
        <div className="relative mt-4">
                {/* Balance Card */}
                <div className="bg-gray-600 rounded-xl p-4 relative shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-gray-200 text-sm font-medium">Balance</p>
                      <p className="text-white text-2xl font-bold">
                        {isConnected ? `$${user?.balance?.toFixed(2) || '0.00'}` : 'Connect Wallet'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>{isConnected ? 'Open' : 'Connect'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-200 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>
                      {isConnected ? `$${((user?.balance || 0) * 0.01).toFixed(2)} Today's Profit` : 'Connect wallet to see profit'}
                    </span>
                  </div>
                </div>
        </div>

            {/* New Features Section */}
            <div className="bg-gray-100 rounded-md p-1.5 mt-2 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">New features in online!</p>
              <p className="text-gray-600 text-xs">in the process of updating</p>
            </div>
          </div>
        </div>

            {/* Demo Account Button */}
            <div className="mt-1.5">
              <button className="w-full bg-gray-100 rounded-md p-1.5 flex items-center justify-center space-x-2 border border-gray-200">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-900 font-semibold text-sm">Operate with a Demo Account</span>
          </button>
        </div>

            {/* Feature Cards Section */}
            <div className="space-y-1.5 mt-2">
          {/* Trading Features Card */}
          <div className="bg-gray-100 rounded-md p-2 relative overflow-hidden border border-gray-200">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full translate-y-8 -translate-x-8"></div>
            <div className="text-center relative z-10">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">Lowest transactions fees &lt; 0.3%</p>
              <h2 className="text-gray-900 text-2xl font-bold mb-2">Trade all assets in one place</h2>
              <p className="text-gray-600 text-sm mb-6">Forex, crypto, stocks, indices, commodities</p>
              <Link to="/market">
                <button className="bg-gray-900 text-white px-3 py-1.5 rounded-md font-semibold text-xs">
                  Get started
                </button>
              </Link>
            </div>
          </div>

          {/* Smart Trading Card */}
          <div className="bg-gray-100 rounded-xl p-4 relative overflow-hidden border border-gray-200">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full translate-y-8 -translate-x-8"></div>
            <div className="text-center relative z-10">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">Simple and stable</p>
              <h2 className="text-gray-900 text-2xl font-bold mb-2">Smart trading</h2>
              <p className="text-gray-600 text-sm mb-6">One click to create your earning plan</p>
              <Link to="/smart-trading">
                <button className="bg-gray-900 text-white px-3 py-1.5 rounded-md font-semibold text-xs">
                  Get started
                </button>
              </Link>
            </div>
          </div>

          {/* Cryptocurrency Loans Card */}
          <div className="bg-gray-100 rounded-xl p-4 relative overflow-hidden border border-gray-200">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full translate-y-8 -translate-x-8"></div>
            <div className="text-center relative z-10">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">Low interest rate and higher amount</p>
              <h2 className="text-gray-900 text-2xl font-bold mb-2">Cryptocurrency loans</h2>
              <p className="text-gray-600 text-sm mb-6">Borrow cryptocurrency spots without any collateral!</p>
              <Link to="/loan">
                <button className="bg-gray-900 text-white px-3 py-1.5 rounded-md font-semibold text-xs">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <Footer />
        </div>
      </main>

          {/* Bottom Navigation Bar */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <div className="bg-gray-800 mx-1 mb-1 rounded-lg shadow-2xl px-2 py-1.5 flex items-center justify-between">
              <Link to="/" className="flex flex-col items-center space-y-1 flex-1">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span className="text-xs text-white">Home</span>
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
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-xs text-gray-300">Account</span>
              </Link>
            </div>
          </nav>
    </div>
  );
}


