import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../contexts/DatabaseContext';
import CountryFlag from './CountryFlags';
import PriceChart from './PriceChart';
import CreatePlanModal from './CreatePlanModal';
import { 
  fetchCryptoPrices,
  fetchStockPrices,
  fetchETFPrices,
  fetchFuturesPrices,
  fetchRealTimeForexRates,
  formatPrice,
  formatPercentage,
  generateRealTimeChartData
} from '../services/api';

const SmartTrading = () => {
  const [activeTab, setActiveTab] = useState('Stocks');
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const { t } = useLanguage();
  const { user } = useDatabase();

  const tabs = [
    { key: 'Forex', label: t('forex') },
    { key: 'Crypto', label: t('crypto') },
    { key: 'Stocks', label: t('stocks') },
    { key: 'ETF', label: t('etf') },
    { key: 'Futures', label: t('futures') }
  ];

  // Data fetching functions for each tab
  const fetchForexData = async () => {
    try {
      const forexRates = await fetchRealTimeForexRates();
      const mockData = [
        {
          id: 1,
          pair: 'USD/CHF',
          country: 'Switzerland',
          value: formatPrice(forexRates.rates.CHF, 4),
          change: formatPercentage(0.09),
          isPositive: true,
          flags: ['US', 'CH'],
          flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/ch.png'],
          chart: generateRealTimeChartData(forexRates.rates.CHF, true)
        },
        {
          id: 2,
          pair: 'USD/JPY',
          country: 'Japan',
          value: formatPrice(forexRates.rates.JPY, 4),
          change: formatPercentage(0.09),
          isPositive: true,
          flags: ['US', 'JP'],
          flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/jp.png'],
          chart: generateRealTimeChartData(forexRates.rates.JPY, true)
        },
        {
          id: 3,
          pair: 'USD/EUR',
          country: 'Eurozone',
          value: formatPrice(forexRates.rates.EUR, 4),
          change: formatPercentage(0.04),
          isPositive: true,
          flags: ['US', 'EU'],
          flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/eu.png'],
          chart: generateRealTimeChartData(forexRates.rates.EUR, true)
        },
        {
          id: 4,
          pair: 'USD/GBP',
          country: 'United Kingdom',
          value: formatPrice(forexRates.rates.GBP, 4),
          change: formatPercentage(-0.02),
          isPositive: false,
          flags: ['US', 'GB'],
          flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/gb.png'],
          chart: generateRealTimeChartData(forexRates.rates.GBP, false)
        },
        {
          id: 5,
          pair: 'USD/CAD',
          country: 'Canada',
          value: formatPrice(forexRates.rates.CAD, 4),
          change: formatPercentage(0.03),
          isPositive: true,
          flags: ['US', 'CA'],
          flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/ca.png'],
          chart: generateRealTimeChartData(forexRates.rates.CAD, true)
        },
        {
          id: 6,
          pair: 'USD/AUD',
          country: 'Australia',
          value: formatPrice(forexRates.rates.AUD, 4),
          change: formatPercentage(-0.05),
          isPositive: false,
          flags: ['US', 'AU'],
          flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/au.png'],
          chart: generateRealTimeChartData(forexRates.rates.AUD, false)
        }
      ];
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching Forex data:', error);
      setError('Failed to fetch Forex data');
    }
  };

  const fetchStocksData = async () => {
    try {
      const stockData = await fetchStockPrices(['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT']);
      const mockData = [
        {
          id: 1,
          pair: 'AAPL',
          country: 'Apple Inc.',
          value: formatPrice(stockData.AAPL?.price || 150, 2),
          change: formatPercentage(stockData.AAPL?.changePercent || 0),
          isPositive: (stockData.AAPL?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          logo: 'https://logo.clearbit.com/apple.com',
          chart: generateRealTimeChartData(stockData.AAPL?.price || 150, (stockData.AAPL?.changePercent || 0) >= 0)
        },
        {
          id: 2,
          pair: 'TSLA',
          country: 'Tesla Inc.',
          value: formatPrice(stockData.TSLA?.price || 200, 2),
          change: formatPercentage(stockData.TSLA?.changePercent || 0),
          isPositive: (stockData.TSLA?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          logo: 'https://logo.clearbit.com/tesla.com',
          chart: generateRealTimeChartData(stockData.TSLA?.price || 200, (stockData.TSLA?.changePercent || 0) >= 0)
        },
        {
          id: 3,
          pair: 'AMZN',
          country: 'Amazon.com Inc.',
          value: formatPrice(stockData.AMZN?.price || 3000, 2),
          change: formatPercentage(stockData.AMZN?.changePercent || 0),
          isPositive: (stockData.AMZN?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          logo: 'https://logo.clearbit.com/amazon.com',
          chart: generateRealTimeChartData(stockData.AMZN?.price || 3000, (stockData.AMZN?.changePercent || 0) >= 0)
        },
        {
          id: 4,
          pair: 'GOOGL',
          country: 'Alphabet Inc.',
          value: formatPrice(stockData.GOOGL?.price || 2500, 2),
          change: formatPercentage(stockData.GOOGL?.changePercent || 0),
          isPositive: (stockData.GOOGL?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          logo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png',
          chart: generateRealTimeChartData(stockData.GOOGL?.price || 2500, (stockData.GOOGL?.changePercent || 0) >= 0)
        },
        {
          id: 5,
          pair: 'MSFT',
          country: 'Microsoft Corporation',
          value: formatPrice(stockData.MSFT?.price || 350, 2),
          change: formatPercentage(stockData.MSFT?.changePercent || 0),
          isPositive: (stockData.MSFT?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          logo: 'https://logo.clearbit.com/microsoft.com',
          chart: generateRealTimeChartData(stockData.MSFT?.price || 350, (stockData.MSFT?.changePercent || 0) >= 0)
        }
      ];
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching Stocks data:', error);
      setError('Failed to fetch Stocks data');
    }
  };

  const fetchETFsData = async () => {
    try {
      const etfData = await fetchETFPrices(['SPY', 'QQQ', 'IWM', 'VTI', 'VEA']);
      const mockData = [
        {
          id: 1,
          pair: 'SPY',
          country: 'SPDR S&P 500 ETF',
          value: formatPrice(etfData.SPY?.price || 400, 2),
          change: formatPercentage(etfData.SPY?.changePercent || 0),
          isPositive: (etfData.SPY?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(etfData.SPY?.price || 400, (etfData.SPY?.changePercent || 0) >= 0)
        },
        {
          id: 2,
          pair: 'QQQ',
          country: 'Invesco QQQ Trust',
          value: formatPrice(etfData.QQQ?.price || 350, 2),
          change: formatPercentage(etfData.QQQ?.changePercent || 0),
          isPositive: (etfData.QQQ?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(etfData.QQQ?.price || 350, (etfData.QQQ?.changePercent || 0) >= 0)
        },
        {
          id: 3,
          pair: 'IWM',
          country: 'iShares Russell 2000 ETF',
          value: formatPrice(etfData.IWM?.price || 200, 2),
          change: formatPercentage(etfData.IWM?.changePercent || 0),
          isPositive: (etfData.IWM?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(etfData.IWM?.price || 200, (etfData.IWM?.changePercent || 0) >= 0)
        },
        {
          id: 4,
          pair: 'VTI',
          country: 'Vanguard Total Stock Market ETF',
          value: formatPrice(etfData.VTI?.price || 220, 2),
          change: formatPercentage(etfData.VTI?.changePercent || 0),
          isPositive: (etfData.VTI?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(etfData.VTI?.price || 220, (etfData.VTI?.changePercent || 0) >= 0)
        },
        {
          id: 5,
          pair: 'VEA',
          country: 'Vanguard FTSE Developed Markets ETF',
          value: formatPrice(etfData.VEA?.price || 50, 2),
          change: formatPercentage(etfData.VEA?.changePercent || 0),
          isPositive: (etfData.VEA?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(etfData.VEA?.price || 50, (etfData.VEA?.changePercent || 0) >= 0)
        }
      ];
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching ETF data:', error);
      setError('Failed to fetch ETF data');
    }
  };

  const fetchFuturesData = async () => {
    try {
      const futuresData = await fetchFuturesPrices(['ES', 'NQ', 'YM', 'RTY', 'GC']);
      const mockData = [
        {
          id: 1,
          pair: 'ES',
          country: 'E-mini S&P 500',
          value: formatPrice(futuresData.ES?.price || 4500, 2),
          change: formatPercentage(futuresData.ES?.changePercent || 0),
          isPositive: (futuresData.ES?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(futuresData.ES?.price || 4500, (futuresData.ES?.changePercent || 0) >= 0)
        },
        {
          id: 2,
          pair: 'NQ',
          country: 'E-mini NASDAQ-100',
          value: formatPrice(futuresData.NQ?.price || 15000, 2),
          change: formatPercentage(futuresData.NQ?.changePercent || 0),
          isPositive: (futuresData.NQ?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(futuresData.NQ?.price || 15000, (futuresData.NQ?.changePercent || 0) >= 0)
        },
        {
          id: 3,
          pair: 'YM',
          country: 'E-mini Dow Jones',
          value: formatPrice(futuresData.YM?.price || 35000, 2),
          change: formatPercentage(futuresData.YM?.changePercent || 0),
          isPositive: (futuresData.YM?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(futuresData.YM?.price || 35000, (futuresData.YM?.changePercent || 0) >= 0)
        },
        {
          id: 4,
          pair: 'RTY',
          country: 'E-mini Russell 2000',
          value: formatPrice(futuresData.RTY?.price || 2000, 2),
          change: formatPercentage(futuresData.RTY?.changePercent || 0),
          isPositive: (futuresData.RTY?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(futuresData.RTY?.price || 2000, (futuresData.RTY?.changePercent || 0) >= 0)
        },
        {
          id: 5,
          pair: 'GC',
          country: 'Gold Futures',
          value: formatPrice(futuresData.GC?.price || 2000, 2),
          change: formatPercentage(futuresData.GC?.changePercent || 0),
          isPositive: (futuresData.GC?.changePercent || 0) >= 0,
          flags: ['US', 'US'],
          chart: generateRealTimeChartData(futuresData.GC?.price || 2000, (futuresData.GC?.changePercent || 0) >= 0)
        }
      ];
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching Futures data:', error);
      setError('Failed to fetch Futures data');
    }
  };

  // Fetch real-time market data
  useEffect(() => {
    let forexInterval = null;
    let stocksInterval = null;
    let etfInterval = null;
    let futuresInterval = null;
    
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'Forex') {
          console.log('🔄 [SmartTrading] Initializing Forex tab with dedicated data feed');
          await fetchForexData();
          forexInterval = setInterval(async () => {
            await fetchForexData();
          }, 5000);
          
        } else if (activeTab === 'Stocks') {
          console.log('🔄 [SmartTrading] Initializing Stocks tab with dedicated data feed');
          await fetchStocksData();
          stocksInterval = setInterval(async () => {
            await fetchStocksData();
          }, 5000);
          
        } else if (activeTab === 'ETF') {
          console.log('🔄 [SmartTrading] Initializing ETF tab with dedicated data feed');
          await fetchETFsData();
          etfInterval = setInterval(async () => {
            await fetchETFsData();
          }, 5000);
          
        } else if (activeTab === 'Futures') {
          console.log('🔄 [SmartTrading] Initializing Futures tab with dedicated data feed');
          await fetchFuturesData();
          futuresInterval = setInterval(async () => {
            await fetchFuturesData();
          }, 5000);
          
        } else if (activeTab === 'Crypto') {
          console.log('🚀 [SmartTrading] Initializing Crypto tab with WebSocket-only data');
          const cryptoData = await fetchCryptoPrices(['bitcoin', 'ethereum', 'filecoin', 'dogecoin', 'ripple']);
          const mockData = [
            {
              id: 1,
              pair: 'BTC/USD',
              country: 'Bitcoin',
              value: formatPrice(cryptoData.bitcoin?.usd || 0, 2),
              change: formatPercentage(cryptoData.bitcoin?.usd_24h_change || 0),
              isPositive: (cryptoData.bitcoin?.usd_24h_change || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              chart: generateRealTimeChartData(cryptoData.bitcoin?.usd || 50000, (cryptoData.bitcoin?.usd_24h_change || 0) >= 0)
            },
            {
              id: 2,
              pair: 'ETH/USD',
              country: 'Ethereum',
              value: formatPrice(cryptoData.ethereum?.usd || 0, 2),
              change: formatPercentage(cryptoData.ethereum?.usd_24h_change || 0),
              isPositive: (cryptoData.ethereum?.usd_24h_change || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              chart: generateRealTimeChartData(cryptoData.ethereum?.usd || 3000, (cryptoData.ethereum?.usd_24h_change || 0) >= 0)
            },
            {
              id: 3,
              pair: 'FIL/USD',
              country: 'Filecoin',
              value: formatPrice(cryptoData.filecoin?.usd || 0, 2),
              change: formatPercentage(cryptoData.filecoin?.usd_24h_change || 0),
              isPositive: (cryptoData.filecoin?.usd_24h_change || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
              chart: generateRealTimeChartData(cryptoData.filecoin?.usd || 5, (cryptoData.filecoin?.usd_24h_change || 0) >= 0)
            },
            {
              id: 4,
              pair: 'DOGE/USD',
              country: 'Dogecoin',
              value: formatPrice(cryptoData.dogecoin?.usd || 0, 6),
              change: formatPercentage(cryptoData.dogecoin?.usd_24h_change || 0),
              isPositive: (cryptoData.dogecoin?.usd_24h_change || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
              chart: generateRealTimeChartData(cryptoData.dogecoin?.usd || 0.1, (cryptoData.dogecoin?.usd_24h_change || 0) >= 0)
            },
            {
              id: 5,
              pair: 'XRP/USD',
              country: 'Ripple',
              value: formatPrice(cryptoData.ripple?.usd || 0, 4),
              change: formatPercentage(cryptoData.ripple?.usd_24h_change || 0),
              isPositive: (cryptoData.ripple?.usd_24h_change || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
              chart: generateRealTimeChartData(cryptoData.ripple?.usd || 0.5, (cryptoData.ripple?.usd_24h_change || 0) >= 0)
            }
          ];
          setMarketData(mockData);
        } else {
          setMarketData([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data. Using cached data.');
        setMarketData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    return () => {
      if (forexInterval) {
        clearInterval(forexInterval);
        console.log('🧹 [SmartTrading] Cleared Forex polling interval');
      }
      if (stocksInterval) {
        clearInterval(stocksInterval);
        console.log('🧹 [SmartTrading] Cleared Stocks polling interval');
      }
      if (etfInterval) {
        clearInterval(etfInterval);
        console.log('🧹 [SmartTrading] Cleared ETF polling interval');
      }
      if (futuresInterval) {
        clearInterval(futuresInterval);
        console.log('🧹 [SmartTrading] Cleared Futures polling interval');
      }
    };
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToWatchlist = (pair) => {
    setSelectedSymbol(pair);
    setShowCreatePlanModal(true);
  };

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Main Content */}
      <div className="container-max py-6 sm:py-8 lg:py-12">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-6 sm:mb-8 lg:mb-12"
        >
          {t('smartTradingTitle')}
        </motion.h1>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-gray-100 p-1 sm:p-2 rounded-lg sm:rounded-xl max-w-full overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm lg:text-base transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Market Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:block bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-xs sm:text-sm font-medium text-gray-600">
              <div className="text-left">Name</div>
              <div className="text-center">{t('spotPrice')}</div>
              <div className="text-center">24h%</div>
              <div className="text-center">{t('chart')}</div>
              <div className="text-right"></div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm sm:text-base">Loading market data...</span>
                </div>
              </div>
            ) : error ? (
              <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                <div className="text-red-500 mb-2 text-sm sm:text-base">{error}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            ) : marketData.length === 0 ? (
              <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
                No data available for {activeTab}
              </div>
            ) : (
              marketData.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/trading/${activeTab.toLowerCase()}/${item.pair}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {activeTab === 'Crypto' && item.logo ? (
                            <img 
                              src={item.logo} 
                              alt={`${item.pair} logo`} 
                              className="w-6 h-6 rounded-full"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : activeTab === 'Stocks' && item.logo ? (
                            <img 
                              src={item.logo} 
                              alt={`${item.pair} logo`} 
                              className="w-6 h-6 rounded-full"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : activeTab === 'Forex' && item.flagUrls ? (
                            <div className="flex -space-x-1">
                              {item.flagUrls.map((flagUrl, index) => (
                                <img 
                                  key={index}
                                  src={flagUrl} 
                                  alt={`${item.flags[index]} flag`} 
                                  className="w-5 h-5 rounded-full"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex -space-x-1">
                              <CountryFlag countryCode={item.flags[0]} />
                              <CountryFlag countryCode={item.flags[1]} />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{item.pair}</div>
                            <div className="text-xs text-gray-600">{item.country}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 text-sm">{item.value}</div>
                          <div className={`text-xs font-medium ${
                            item.isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center mb-2">
                        <PriceChart data={item.chart} isPositive={item.isPositive} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToWatchlist(item.pair);
                          }}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid grid-cols-5 gap-4 items-center">
                      {/* Name */}
                      <div className="flex items-center space-x-3 text-left">
                        {activeTab === 'Crypto' && item.logo ? (
                          <img 
                            src={item.logo} 
                            alt={`${item.pair} logo`} 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : activeTab === 'Stocks' && item.logo ? (
                          <img 
                            src={item.logo} 
                            alt={`${item.pair} logo`} 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : activeTab === 'Forex' && item.flagUrls ? (
                          <div className="flex -space-x-1">
                            {item.flagUrls.map((flagUrl, index) => (
                              <img 
                                key={index}
                                src={flagUrl} 
                                alt={`${item.flags[index]} flag`} 
                                className="w-6 h-6 rounded-full"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex -space-x-1">
                            <CountryFlag countryCode={item.flags[0]} />
                            <CountryFlag countryCode={item.flags[1]} />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{item.pair}</div>
                          <div className="text-sm text-gray-600">{item.country}</div>
                        </div>
                      </div>
                      
                      {/* Spot Price */}
                      <div className="font-medium text-gray-900 text-center">
                        {item.value}
                      </div>
                      
                      {/* 24h% */}
                      <div className={`font-medium text-center ${
                        item.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
                      
                      {/* Chart */}
                      <div className="flex justify-center">
                        <PriceChart data={item.chart} isPositive={item.isPositive} />
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToWatchlist(item.pair);
                          }}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
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

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        symbol={selectedSymbol}
        availableBalance={user?.balance || 0}
      />
    </div>
  );
};

export default SmartTrading;
