import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';

const MobileTradingDetail = () => {
  const { category } = useParams();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const symbol = pathParts.slice(3).join('/');
  const { user } = useDatabase();
  
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [ohlc, setOhlc] = useState({ open: 0, high: 0, low: 0, close: 0 });
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [selectedDirection, setSelectedDirection] = useState('up');
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  // Real-time price fetching
  useEffect(() => {
    const fetchRealTimePrice = async () => {
      try {
        let price = 0;
        let change = 0;
        
        if (category === 'crypto') {
          // Use CoinGecko API for crypto
          const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true`);
          const data = await response.json();
          const cryptoId = symbol.toLowerCase();
          if (data[cryptoId]) {
            price = data[cryptoId].usd;
            change = data[cryptoId].usd_24h_change || 0;
          }
        } else if (category === 'forex') {
          // Use ExchangeRate-API for forex
          const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
          const data = await response.json();
          const [, quote] = symbol.split('/');
          if (data.rates[quote]) {
            price = data.rates[quote];
            change = (Math.random() - 0.5) * 0.02; // Simulated change for forex
          }
        } else if (category === 'stocks') {
          // Use Alpha Vantage API for stocks
          const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`);
          const data = await response.json();
          if (data['Global Quote']) {
            price = parseFloat(data['Global Quote']['05. price']);
            change = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
          }
        } else {
          // Fallback for other categories
          price = Math.random() * 100 + 50;
          change = (Math.random() - 0.5) * 5;
        }
        
        setCurrentPrice(price);
        setPriceChange(change);
        setOhlc({
          open: price * (1 + (Math.random() - 0.5) * 0.02),
          high: price * (1 + Math.random() * 0.03),
          low: price * (1 - Math.random() * 0.03),
          close: price
        });
      } catch (error) {
        console.error('Error fetching real-time price:', error);
        // Fallback values
        const fallbackPrice = Math.random() * 100 + 50;
        setCurrentPrice(fallbackPrice);
        setPriceChange((Math.random() - 0.5) * 5);
        setOhlc({
          open: fallbackPrice * 0.99,
          high: fallbackPrice * 1.02,
          low: fallbackPrice * 0.98,
          close: fallbackPrice
        });
      }
    };

    fetchRealTimePrice();
    const interval = setInterval(fetchRealTimePrice, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [category, symbol]);

  const durationOptions = [
    { duration: 60, return: '30.00% return' },
    { duration: 300, return: '50.00% return' },
    { duration: 600, return: '70.00% return' }
  ];

  const handleAmountChange = (value) => {
    setInvestmentAmount(parseFloat(value) || 0);
  };

  const handleCreatePlan = () => {
    setShowCreatePlan(true);
  };

  const handleConfirmPlan = () => {
    // Create the trading plan
    console.log('Creating trading plan:', {
      symbol,
      amount: investmentAmount,
      duration: selectedDuration,
      direction: selectedDirection
    });
    
    // Show success message
    alert('Trading plan created successfully!');
    setShowCreatePlan(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-3 bg-white border-b border-gray-200">
        <Link to="/market" className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-gray-900 text-lg font-semibold">Back</span>
        </Link>
        <div className="flex items-center space-x-3">
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
        </div>
      </header>

      <main className="px-3 pb-24">
        {/* Breadcrumbs */}
        <div className="py-2">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">UBS</Link>
            <span className="mx-2">/</span>
            <Link to="/market" className="hover:text-gray-900">Market</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{symbol}</span>
          </nav>
        </div>

        {/* Price Display */}
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{symbol}</h1>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentPrice.toFixed(4)}
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${priceChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-lg font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
              <span className="text-gray-600">Live</span>
            </div>
            <div className="text-gray-600 text-sm">
              Open: {ohlc.open.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="text-center">
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">Real-time Chart</p>
              </div>
            </div>
            <div className="text-gray-600 text-sm">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Trading Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Smart Trading</h2>
          
          {/* Duration Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Duration:</label>
            <div className="grid grid-cols-3 gap-3">
              {durationOptions.map((option) => (
                <button
                  key={option.duration}
                  onClick={() => setSelectedDuration(option.duration)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedDuration === option.duration
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold">{option.duration}s</div>
                  <div className="text-xs">{option.return}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Investment Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount:</label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl border-none outline-none text-right text-lg font-semibold"
              placeholder="0"
            />
          </div>

          {/* Direction Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Direction:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedDirection('up')}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedDirection === 'up'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-semibold">↑ Up</div>
                <div className="text-sm">Price will rise</div>
              </button>
              <button
                onClick={() => setSelectedDirection('down')}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedDirection === 'down'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-semibold">↓ Down</div>
                <div className="text-sm">Price will fall</div>
              </button>
            </div>
          </div>

          {/* Create Plan Button */}
          <button
            onClick={handleCreatePlan}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
          >
            Create Trading Plan
          </button>
        </div>

        {/* What is Smart Trading */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">What is Smart Trading?</h3>
          <p className="text-gray-600 mb-4">Learn about our advanced trading algorithms and how they can help you make better investment decisions.</p>
          <button 
            onClick={() => alert('Smart Trading FAQ coming soon!')}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Learn More
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
        <div className="bg-gray-800 rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link to="/market" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Link>
          <Link to="/smart-trading" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </Link>
          <Link to="/loan" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </Link>
          <Link to="/account" className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Simple Confirmation Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Trading Plan</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Symbol:</span>
                <span className="font-semibold">{symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">${investmentAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{selectedDuration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Direction:</span>
                <span className="font-semibold">{selectedDirection === 'up' ? '↑ Up' : '↓ Down'}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreatePlan(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlan}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTradingDetail;