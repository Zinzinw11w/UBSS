import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MobileMarket() {
  const [activeTab, setActiveTab] = useState('Forex');

  const tabs = ['Forex', 'Crypto', 'Stocks', 'ETF', 'Futures'];

  const forexData = [
    {
      id: 1,
      pair: 'USD/HKD',
      symbol: 'USDHKD',
      price: '7.7712',
      change: '-0.04%',
      isPositive: false,
      flags: ['🇺🇸', '🇭🇰']
    },
    {
      id: 2,
      pair: 'USD/SGD',
      symbol: 'USDSGD',
      price: '1.2940',
      change: '-0.16%',
      isPositive: false,
      flags: ['🇺🇸', '🇸🇬']
    },
    {
      id: 3,
      pair: 'GBP/USD',
      symbol: 'Us Dollar',
      price: '1.3430',
      change: '0.27%',
      isPositive: true,
      flags: ['🇬🇧', '🇺🇸']
    },
    {
      id: 4,
      pair: 'USD/CNH',
      symbol: 'USD/CNH',
      price: '7.1264',
      change: '-0.07%',
      isPositive: false,
      flags: ['🇺🇸', '🇨🇳']
    },
    {
      id: 5,
      pair: 'USD/JPY',
      symbol: 'USD/JPY',
      price: '150.7964',
      change: '-0.67%',
      isPositive: false,
      flags: ['🇺🇸', '🇯🇵']
    },
    {
      id: 6,
      pair: 'EUR/USD',
      symbol: 'EUR/USD',
      price: '1.1672',
      change: '0.24%',
      isPositive: true,
      flags: ['🇪🇺', '🇺🇸']
    },
    {
      id: 7,
      pair: 'USD/CHF',
      symbol: 'USD/CHF',
      price: '0.7959',
      change: '-0.11%',
      isPositive: false,
      flags: ['🇺🇸', '🇨🇭']
    }
  ];

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
          <span className="text-gray-900 text-xl font-semibold">Market</span>
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
        {/* Category Tabs */}
        <div className="mt-6 mb-6">
          <div className="bg-gray-800 rounded-3xl px-2 py-2 flex items-center justify-between">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gray-900'
                    : 'text-gray-300 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Currency Pairs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {forexData.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex -space-x-1">
                  {item.flags.map((flag, index) => (
                    <span key={index} className="text-lg">{flag}</span>
                  ))}
                </div>
              </div>
              <h3 className="text-gray-900 font-bold text-sm mb-1">{item.pair}</h3>
              <p className="text-gray-600 text-xs mb-2">{item.symbol}</p>
              <p className="text-gray-900 font-bold text-lg mb-1">{item.price}</p>
              <p className={`text-xs font-medium ${
                item.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>

        {/* Currency Pairs List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Name</div>
            <div className="text-gray-600 text-sm font-medium">24h%</div>
            <div className="text-gray-600 text-sm font-medium">Chart</div>
            <div className="text-gray-600 text-sm font-medium">Price</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {forexData.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 px-4 py-4">
                {/* Name */}
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-1">
                    {item.flags.map((flag, index) => (
                      <span key={index} className="text-sm">{flag}</span>
                    ))}
                  </div>
                  <span className="text-gray-900 font-medium text-sm">{item.pair}</span>
                </div>

                {/* 24h% */}
                <div className={`text-sm font-medium ${
                  item.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change}
                </div>

                {/* Chart */}
                <div className="flex items-center">
                  <div className={`w-12 h-6 rounded ${
                    item.isPositive ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <div className={`w-full h-full rounded ${
                      item.isPositive ? 'bg-green-500' : 'bg-red-500'
                    }`} style={{
                      clipPath: 'polygon(0% 100%, 25% 80%, 50% 60%, 75% 40%, 100% 20%)'
                    }}></div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-gray-900 font-medium text-sm">
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-gray-800 rounded-3xl shadow-2xl px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link to="/market" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
