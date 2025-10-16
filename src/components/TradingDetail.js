import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDatabase } from '../contexts/DatabaseContext';
import RealTimeChart from './RealTimeChart';
import CreatePlanModal from './CreatePlanModal';
import SmartTradingFAQModal from './SmartTradingFAQModal';

const TradingDetail = () => {
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
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showSmartTradingFAQ, setShowSmartTradingFAQ] = useState(false);

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
          // Fallback for ETF and Futures
          price = Math.random() * 1000 + 100;
          change = (Math.random() - 0.5) * 10;
        }
        
        setCurrentPrice(price);
        setPriceChange(change);
        
        // Calculate OHLC
        const volatility = Math.abs(change) * 0.1;
        const open = price * (1 + (Math.random() - 0.5) * volatility);
        const high = Math.max(price, open) * (1 + Math.random() * volatility);
        const low = Math.min(price, open) * (1 - Math.random() * volatility);
        
        setOhlc({
          open: open,
          high: high,
          low: low,
          close: price
        });
        
      } catch (error) {
        console.error('Error fetching real-time price:', error);
        // Fallback to simulated data
        const fallbackPrice = Math.random() * 1000 + 100;
        const fallbackChange = (Math.random() - 0.5) * 10;
        setCurrentPrice(fallbackPrice);
        setPriceChange(fallbackChange);
        setOhlc({
          open: fallbackPrice * 0.99,
          high: fallbackPrice * 1.02,
          low: fallbackPrice * 0.98,
          close: fallbackPrice
        });
      }
    };

    fetchRealTimePrice();
    
    // Update prices every 5 seconds
    const interval = setInterval(fetchRealTimePrice, 5000);
    
    return () => clearInterval(interval);
  }, [category, symbol]);

  const durationOptions = [
    { duration: 60, return: '30.00% return' },
    { duration: 180, return: '40.00% return' },
    { duration: 300, return: '50.00% return' },
    { duration: 450, return: '60.00% return' },
    { duration: 600, return: '70.00% return' }
  ];


  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">UBS</Link>
            <span className="mx-2">/</span>
            <Link to="/market" className="hover:text-gray-900">Market</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{symbol}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Chart Section */}
        <div className="mb-8">
          <RealTimeChart 
            symbol={symbol}
            category={category}
            currentPrice={currentPrice}
            priceChange={priceChange}
            ohlc={ohlc}
          />
        </div>

        {/* Trading Options Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          {/* Options Button */}
          <div className="text-center mb-6">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Options
            </button>
          </div>

          {/* Duration Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-4">
              {durationOptions.map((option) => (
                <button
                  key={option.duration}
                  onClick={() => setSelectedDuration(option.duration)}
                  className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                    selectedDuration === option.duration
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg font-semibold">{option.duration}s</div>
                  <div className="text-sm opacity-75 mt-1">{option.return}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Investment Input */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">Investment:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                  className="text-right text-blue-600 font-semibold bg-transparent border-none outline-none no-spinner"
                  placeholder="0"
                />
                <span className="text-blue-600 font-semibold">USD</span>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Available:</span>
                <span className="text-gray-700 font-medium">
                  {user?.balance?.toFixed(2) || '0.00'}
                </span>
                <span className="text-gray-700">USD</span>
              </div>
              <span className="text-gray-700">Fee: 0 USD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedDirection('up')}
              className={`py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                selectedDirection === 'up'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              Up
            </button>
            <button
              onClick={() => setSelectedDirection('down')}
              className={`py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                selectedDirection === 'down'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              Down
            </button>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create a plan to trade! Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 text-white p-8 rounded-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500 opacity-20 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Create a plan to trade!</h3>
              <p className="text-gray-300 mb-6">Want more stable earning?</p>
              <button 
                onClick={() => setShowCreatePlanModal(true)}
                className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>

          {/* What is smart trading? Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border border-gray-200 p-8 rounded-lg"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What is smart trading?</h3>
            <p className="text-gray-600 mb-6">Learn about our advanced trading algorithms and how they can help you make better investment decisions.</p>
            <button 
              onClick={() => setShowSmartTradingFAQ(true)}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        symbol={symbol}
        availableBalance={user?.balance || 0}
      />

      {/* Smart Trading FAQ Modal */}
      <SmartTradingFAQModal
        isOpen={showSmartTradingFAQ}
        onClose={() => setShowSmartTradingFAQ(false)}
      />
    </div>
  );
};

export default TradingDetail;