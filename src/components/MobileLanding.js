import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function MobileLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
            alt="UBS Logo" 
            className="h-8 w-auto"
          />
          <span className="text-gray-900 text-xl font-semibold">Tokenize</span>
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

      <main className="px-4 pb-32">
        {/* Balance Cards */}
        <div className="relative mt-6">
            {/* USDC Balance Card */}
            <div className="bg-gradient-to-r from-gray-100 to-purple-100 rounded-2xl p-4 mb-3 relative z-10 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-sm">USDC Balance</p>
                </div>
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              </div>
            </div>

            {/* USDT Balance Card */}
            <div className="bg-gradient-to-r from-gray-100 to-green-100 rounded-2xl p-4 relative z-20 -mt-2 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-700 text-sm">USDT Balance</p>
                  <p className="text-gray-900 text-2xl font-bold">0.000000 USDT</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">₮</span>
                  </div>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Open</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>$0.00000000 Today's Profit</span>
              </div>
            </div>
        </div>

        {/* New Features Section */}
        <div className="bg-gray-100 rounded-2xl p-4 mt-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-semibold">New features in online!</p>
              <p className="text-gray-600 text-sm">in the process of updating</p>
            </div>
          </div>
        </div>

        {/* Demo Account Button */}
        <div className="mt-4">
          <button className="w-full bg-gray-100 rounded-2xl p-4 flex items-center justify-center space-x-3 border border-gray-200">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-900 font-semibold">Operate with a Demo Account</span>
          </button>
        </div>

        {/* Feature Cards Section */}
        <div className="space-y-4 mt-6">
          {/* Trading Features Card */}
          <div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden border border-gray-200">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full translate-y-8 -translate-x-8"></div>
            <div className="text-center relative z-10">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">Lowest transactions fees &lt; 0.3%</p>
              <h2 className="text-gray-900 text-2xl font-bold mb-2">Trade all assets in one place</h2>
              <p className="text-gray-600 text-sm mb-6">Forex, crypto, stocks, indices, commodities</p>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold">
                Get started
              </button>
            </div>
          </div>

          {/* Smart Trading Card */}
          <div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden border border-gray-200">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full translate-y-8 -translate-x-8"></div>
            <div className="text-center relative z-10">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">Simple and stable</p>
              <h2 className="text-gray-900 text-2xl font-bold mb-2">Smart trading</h2>
              <p className="text-gray-600 text-sm mb-6">One click to create your earning plan</p>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold">
                Get started
              </button>
            </div>
          </div>

          {/* Cryptocurrency Loans Card */}
          <div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden border border-gray-200">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-full translate-y-8 -translate-x-8"></div>
            <div className="text-center relative z-10">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">Low interest rate and higher amount</p>
              <h2 className="text-gray-900 text-2xl font-bold mb-2">Cryptocurrency loans</h2>
              <p className="text-gray-600 text-sm mb-6">Borrow cryptocurrency spots without any collateral!</p>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold">
                Get started
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <Footer />
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-gray-800 rounded-3xl shadow-2xl px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link to="/market" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Link>
          <Link to="/smart-trading" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </Link>
          <Link to="/loan" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          </Link>
          <Link to="/account" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>
    </div>
  );
}


