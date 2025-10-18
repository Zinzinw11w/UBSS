import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CountryFlag from './CountryFlags';
import PriceChart from './PriceChart';
import { 
  formatPrice, 
  formatPercentage,
  createForexWebSocket,
  createCryptoWebSocket,
  createStockWebSocket,
  createETFWebSocket,
  createFuturesWebSocket,
  fetchRealTimeForexRates,
  generateRealTimeChartData,
  createRealTimeForexWebSocket,
  fetchCryptoPrices,
  fetchStockPrices,
  fetchETFPrices,
  fetchFuturesPrices
} from '../services/api';
import SparklineChart from './SparklineChart';

const Market = () => {
  const [activeTab, setActiveTab] = useState('Forex');
  const [marketData, setMarketData] = useState([]);
  const [forexData, setForexData] = useState([]); // Separate state for Forex data
  const [stocksData, setStocksData] = useState([]); // Separate state for Stocks data
  const [etfsData, setEtfsData] = useState([]); // Separate state for ETF data
  const [futuresData, setFuturesData] = useState([]); // NEW: Separate state for Futures data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [priceChanges, setPriceChanges] = useState({});
  const { t } = useLanguage();

  // NEW: Dedicated function for fetching Forex data
  const fetchForexData = async () => {
    try {
      console.log('🔄 Fetching Forex data...');
      const forexRates = await fetchRealTimeForexRates();
      
          const forexPairs = [
        { pair: 'USD/CHF', country: 'Switzerland', flags: ['US', 'CH'], rate: forexRates.rates?.CHF || 0.8963, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/ch.png'] },
        { pair: 'USD/JPY', country: 'Japan', flags: ['US', 'JP'], rate: forexRates.rates?.JPY || 152.00, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/jp.png'] },
        { pair: 'USD/EUR', country: 'Eurozone', flags: ['US', 'EU'], rate: forexRates.rates?.EUR || 0.9200, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/eu.png'] },
        { pair: 'USD/GBP', country: 'United Kingdom', flags: ['US', 'GB'], rate: forexRates.rates?.GBP || 0.7900, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/gb.png'] },
        { pair: 'USD/CAD', country: 'Canada', flags: ['US', 'CA'], rate: forexRates.rates?.CAD || 1.3600, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/ca.png'] },
        { pair: 'USD/AUD', country: 'Australia', flags: ['US', 'AU'], rate: forexRates.rates?.AUD || 1.5200, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/au.png'] },
        { pair: 'USD/HKD', country: 'Hong Kong', flags: ['US', 'HK'], rate: forexRates.rates?.HKD || 7.8000, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/hk.png'] },
        { pair: 'USD/SGD', country: 'Singapore', flags: ['US', 'SG'], rate: forexRates.rates?.SGD || 1.3500, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/sg.png'] },
        { pair: 'USD/CNY', country: 'China', flags: ['US', 'CN'], rate: forexRates.rates?.CNY || 7.2000, flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/cn.png'] }
      ];

      const forexData = forexPairs.map((item, index) => {
            const isPositive = Math.random() > 0.5;
            const chartData = generateRealTimeChartData(item.rate, isPositive);
            const volatility = 0.002; // 0.2% daily volatility for forex
            const change24h = (Math.random() - 0.5) * volatility * 100;
            
            return {
              id: index + 1,
              pair: item.pair,
              country: item.country,
              value: formatPrice(item.rate, item.pair.includes('JPY') ? 2 : 4),
          price: formatPrice(item.rate, item.pair.includes('JPY') ? 2 : 4), // Add price field for UI
              change: formatPercentage(change24h),
              isPositive: change24h >= 0,
              flags: item.flags,
              flagUrls: item.flagUrls,
              chart: chartData,
          sparkline: generateRealTimeChartData(item.rate, isPositive, 12),
              realTimePrice: item.rate,
          lastUpdated: forexRates.last_updated || new Date().toISOString()
            };
          });

      setForexData(forexData);
      console.log('✅ Forex data updated:', forexData.length, 'pairs');
    } catch (error) {
      console.error('❌ Error fetching Forex data:', error);
    }
  };

  // NEW: Dedicated function for fetching Stocks data
  const fetchStocksData = async () => {
    try {
      console.log('🔄 Fetching Stocks data...');
      const stockData = await fetchStockPrices(['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'UNH', 'AI', 'BRZE', 'FLNC', 'SNOW', 'BB', 'EVGO', 'MQ']);
      
      const stockPairs = [
        { symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com' },
        { symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', logo: 'https://logo.clearbit.com/amazon.com' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', logo: 'https://logo.clearbit.com/microsoft.com' },
        { symbol: 'UNH', name: 'UnitedHealth Group', logo: 'https://logo.clearbit.com/unitedhealthgroup.com' },
        { symbol: 'AI', name: 'C3.ai Inc.', logo: 'https://logo.clearbit.com/c3.ai' },
        { symbol: 'BRZE', name: 'Braze Inc.', logo: 'https://logo.clearbit.com/braze.com' },
        { symbol: 'FLNC', name: 'Fluence Energy Inc.', logo: 'https://logo.clearbit.com/fluenceenergy.com' },
        { symbol: 'SNOW', name: 'Snowflake Inc.', logo: 'https://logo.clearbit.com/snowflake.com' },
        { symbol: 'BB', name: 'BlackBerry Limited', logo: 'https://logo.clearbit.com/blackberry.com' },
        { symbol: 'EVGO', name: 'EVgo Inc.', logo: 'https://logo.clearbit.com/evgo.com' },
        { symbol: 'MQ', name: 'Marqeta Inc.', logo: 'https://logo.clearbit.com/marqeta.com' }
      ];

      const stocksData = stockPairs.map((item, index) => {
        const stockInfo = stockData[item.symbol] || {};
        const price = stockInfo.price || Math.random() * 500 + 50;
        const change24h = stockInfo.change || (Math.random() - 0.5) * 10;
        const isPositive = change24h >= 0;
        
        // Generate sparkline data with proper debugging
        const sparklineData = generateRealTimeChartData(price, isPositive, 12);
        console.log(`📊 [Stocks] Generated sparkline for ${item.symbol}:`, {
          price,
          change24h,
          isPositive,
          sparklineData: sparklineData.length > 0 ? `${sparklineData.length} points` : 'EMPTY',
          firstPoint: sparklineData[0],
          lastPoint: sparklineData[sparklineData.length - 1]
        });
        
                  return {
          id: index + 1,
          pair: item.symbol,
          symbol: item.name,
          price: formatPrice(price, 2),
          value: formatPrice(price, 2), // Add value field for consistency
          change: formatPercentage(change24h),
          isPositive: isPositive,
          flags: ['US', 'US'],
          logo: item.logo,
          chart: generateRealTimeChartData(price, isPositive),
          sparkline: sparklineData,
          realTimePrice: price,
                    lastUpdated: new Date().toISOString()
                  };
      });

      setStocksData(stocksData);
      console.log('✅ Stocks data updated:', stocksData.length, 'stocks');
    } catch (error) {
      console.error('❌ Error fetching Stocks data:', error);
    }
  };

  // NEW: Dedicated function for fetching ETF data
  const fetchETFsData = async () => {
    try {
      console.log('🔄 Fetching ETF data...');
      const etfData = await fetchETFPrices(['SPY', 'QQQ', 'IWM', 'VTI', 'VEA', 'VWO', 'AGG', 'BND', 'GLD', 'SLV', 'USO', 'UNG']);
      
      const etfPairs = [
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', logo: 'https://logo.clearbit.com/ssga.com' },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', logo: 'https://logo.clearbit.com/invesco.com' },
        { symbol: 'IWM', name: 'iShares Russell 2000 ETF', logo: 'https://logo.clearbit.com/ishares.com' },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
        { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
        { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
        { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', logo: 'https://logo.clearbit.com/ishares.com' },
        { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
        { symbol: 'GLD', name: 'SPDR Gold Trust', logo: 'https://logo.clearbit.com/ssga.com' },
        { symbol: 'SLV', name: 'iShares Silver Trust', logo: 'https://logo.clearbit.com/ishares.com' },
        { symbol: 'USO', name: 'United States Oil Fund', logo: 'https://logo.clearbit.com/uscfinvestments.com' },
        { symbol: 'UNG', name: 'United States Natural Gas Fund', logo: 'https://logo.clearbit.com/uscfinvestments.com' }
      ];

      const etfsData = etfPairs.map((item, index) => {
        const etfInfo = etfData[item.symbol] || {};
        const price = etfInfo.price || Math.random() * 200 + 50;
        const change24h = etfInfo.change || (Math.random() - 0.5) * 5;
        const isPositive = change24h >= 0;
        const logoUrl = etfInfo.logoUrl || item.logo; // Use API logo URL or fallback to hardcoded logo
        
        // Generate sparkline data with proper debugging
        const sparklineData = generateRealTimeChartData(price, isPositive, 12);
        console.log(`📊 [ETF] Generated sparkline for ${item.symbol}:`, {
          price,
          change24h,
          isPositive,
          logoUrl,
          sparklineData: sparklineData.length > 0 ? `${sparklineData.length} points` : 'EMPTY',
          firstPoint: sparklineData[0],
          lastPoint: sparklineData[sparklineData.length - 1]
        });
        
        return {
          id: index + 1,
          pair: item.symbol,
          symbol: item.name,
          price: formatPrice(price, 2),
          value: formatPrice(price, 2), // Add value field for consistency
          change: formatPercentage(change24h),
          isPositive: isPositive,
          flags: ['US', 'US'],
          logo: logoUrl, // Use dynamic logo URL from API
          chart: generateRealTimeChartData(price, isPositive),
          sparkline: sparklineData,
          realTimePrice: price,
          lastUpdated: new Date().toISOString()
        };
      });

      setEtfsData(etfsData);
      console.log('✅ ETF data updated:', etfsData.length, 'ETFs');
          } catch (error) {
      console.error('❌ Error fetching ETF data:', error);
    }
  };

  // NEW: Dedicated function for fetching Futures data
  const fetchFuturesData = async () => {
    try {
      console.log('🔄 Fetching Futures data...');
      const futuresData = await fetchFuturesPrices(['ES', 'NQ', 'YM', 'RTY', 'GC', 'SI', 'CL', 'NG', 'ZB', 'ZN', 'ZF', 'ZT']);
      
      const futuresPairs = [
        { symbol: 'ES', name: 'E-mini S&P 500', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'NQ', name: 'E-mini NASDAQ-100', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'YM', name: 'E-mini Dow Jones', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'RTY', name: 'E-mini Russell 2000', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'GC', name: 'Gold Futures', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'SI', name: 'Silver Futures', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'CL', name: 'Crude Oil Futures', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'NG', name: 'Natural Gas Futures', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'ZB', name: '30-Year Treasury Bond', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'ZN', name: '10-Year Treasury Note', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'ZF', name: '5-Year Treasury Note', logo: 'https://logo.clearbit.com/cme.com' },
        { symbol: 'ZT', name: '2-Year Treasury Note', logo: 'https://logo.clearbit.com/cme.com' }
      ];

      const futuresDataArray = futuresPairs.map((item, index) => {
        const futureInfo = futuresData[item.symbol] || {};
        const price = futureInfo.price || Math.random() * 5000 + 1000;
        const change24h = futureInfo.change || (Math.random() - 0.5) * 3;
        const isPositive = change24h >= 0;
        const logoUrl = futureInfo.logoUrl || item.logo;
        
        // Generate sparkline data with proper debugging
        const sparklineData = generateRealTimeChartData(price, isPositive, 12);
        console.log(`📊 [Futures] Generated sparkline for ${item.symbol}:`, {
          price,
          change24h,
          isPositive,
          logoUrl,
          sparklineData: sparklineData.length > 0 ? `${sparklineData.length} points` : 'EMPTY',
          firstPoint: sparklineData[0],
          lastPoint: sparklineData[sparklineData.length - 1]
        });
        
        return {
          id: index + 1,
          pair: item.symbol,
          symbol: item.name,
          price: formatPrice(price, 2),
          value: formatPrice(price, 2), // Add value field for consistency
          change: formatPercentage(change24h),
          changeValue: change24h,
          isPositive,
          sparkline: sparklineData,
          logoUrl: logoUrl
        };
      });

      setFuturesData(futuresDataArray);
      console.log('✅ Futures data updated:', futuresDataArray.length, 'Futures');
          } catch (error) {
      console.error('❌ Error fetching Futures data:', error);
    }
  };

  const tabs = [
    { key: 'Forex', label: t('forex') },
    { key: 'Crypto', label: t('crypto') },
    { key: 'Stocks', label: t('stocks') },
    { key: 'ETF', label: t('etf') },
    { key: 'Futures', label: t('futures') }
  ];

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

        // Close any existing WebSocket connection
        if (webSocket) {
          webSocket.close();
          setWebSocket(null);
        }

        if (activeTab === 'Forex') {
          // FOREX TAB: Use new dedicated Forex data fetching
          console.log('🔄 Initializing Forex tab with dedicated data feed');
          
          // Initial fetch
          await fetchForexData();
          
          // Set up polling for real-time updates every 5 seconds
          forexInterval = setInterval(async () => {
            await fetchForexData();
          }, 5000);
          
        } else if (activeTab === 'Stocks') {
          // STOCKS TAB: Use new dedicated Stocks data fetching
          console.log('🔄 Initializing Stocks tab with dedicated data feed');
          
          // Initial fetch
          await fetchStocksData();
          
          // Set up polling for real-time updates every 5 seconds
          stocksInterval = setInterval(async () => {
            await fetchStocksData();
          }, 5000);
          
        } else if (activeTab === 'ETF') {
          // ETF TAB: Use new dedicated ETF data fetching
          console.log('🔄 Initializing ETF tab with dedicated data feed');
          
          // Initial fetch
          await fetchETFsData();
          
          // Set up polling for real-time updates every 5 seconds
          etfInterval = setInterval(async () => {
            await fetchETFsData();
          }, 5000);
          
        } else if (activeTab === 'Futures') {
          // FUTURES TAB: Use new dedicated Futures data fetching
          console.log('🔄 Initializing Futures tab with dedicated data feed');
          
          // Initial fetch
          await fetchFuturesData();
          
          // Set up polling for real-time updates every 5 seconds
          futuresInterval = setInterval(async () => {
            await fetchFuturesData();
          }, 5000);
          
        } else if (activeTab === 'Crypto') {
          // Initialize Crypto data - NO API CALL, WebSocket only
          console.log('🚀 Initializing Crypto tab with WebSocket-only data');
               const mockData = [
                 {
                   id: 1,
                   pair: 'BTC/USD',
                   country: 'Bitcoin',
                   value: '$0.00',
                   change: '0.00%',
                   isPositive: true,
                   flags: ['US', 'US'],
                   logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                   chart: generateRealTimeChartData(0, true),
                   sparkline: generateRealTimeChartData(0, true, 12)
                 },
            {
              id: 2,
              pair: 'ETH/USD',
              country: 'Ethereum',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
                   chart: generateRealTimeChartData(0, true),
                   sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 3,
              pair: 'LTC/USD',
              country: 'Litecoin',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 4,
              pair: 'DOT/USD',
              country: 'Polkadot',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 5,
              pair: 'FIL/USD',
              country: 'Filecoin',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 6,
              pair: 'DOGE/USD',
              country: 'Dogecoin',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 7,
              pair: 'XRP/USD',
              country: 'XRP',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 8,
              pair: 'TRX/USD',
              country: 'TRON',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 9,
              pair: 'MATIC/USD',
              country: 'Polygon',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 10,
              pair: 'ADA/USD',
              country: 'Cardano',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 11,
              pair: 'LINK/USD',
              country: 'Chainlink',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            },
            {
              id: 12,
              pair: 'ATOM/USD',
              country: 'Cosmos',
              value: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12)
            }
          ];
          setMarketData(mockData);
          
          // Create Crypto WebSocket for real-time updates
          const cryptoWebSocket = createCryptoWebSocket(
            ['bitcoin', 'ethereum', 'litecoin', 'polkadot', 'filecoin', 'dogecoin', 'ripple', 'tron', 'polygon', 'cardano', 'chainlink', 'cosmos'],
            (updates) => {
              console.log('🔄 Market component received WebSocket updates:', updates);
              setMarketData(prevData => 
                prevData.map(item => {
                  // Map display symbols to API symbols
                  const symbolMap = {
                    'BTC/USD': 'bitcoin',
                    'ETH/USD': 'ethereum',
                    'LTC/USD': 'litecoin', 
                    'DOT/USD': 'polkadot',
                    'FIL/USD': 'filecoin',
                    'DOGE/USD': 'dogecoin',
                    'XRP/USD': 'ripple',
                    'TRX/USD': 'tron',
                    'MATIC/USD': 'polygon',
                    'ADA/USD': 'cardano',
                    'LINK/USD': 'chainlink',
                    'ATOM/USD': 'cosmos'
                  };
                  const apiSymbol = symbolMap[item.pair] || item.pair.toLowerCase();
                  const update = updates[apiSymbol];
                  console.log(`🔍 Checking ${item.pair} -> ${apiSymbol}:`, update ? 'FOUND' : 'NOT FOUND');
                  if (update) {
                    console.log(`💰 Updating ${item.pair} with price: $${update.price} (${update.change24h}%)`);
                    
                    // Track price changes for visual feedback
                    setPriceChanges(prev => ({
                      ...prev,
                      [item.pair]: update.isPositive ? 'increase' : 'decrease'
                    }));
                    
                    // Clear visual feedback after animation
                    setTimeout(() => {
                      setPriceChanges(prev => ({
                        ...prev,
                        [item.pair]: null
                      }));
                    }, 1000);

                    return {
                      ...item,
                      value: formatPrice(update.price, 2),
                      change: formatPercentage(update.change24h),
                      isPositive: update.isPositive,
                      sparkline: update.sparkline,
                      realTimePrice: update.price,
                      lastUpdated: new Date().toISOString()
                    };
                  }
                  return item;
                })
              );
            }
          );
          
          // Store WebSocket for cleanup
          setWebSocket(cryptoWebSocket);
        } else if (activeTab === 'Stocks') {
          // Fetch real-time stock data
          let stockData;
          try {
            stockData = await fetchStockPrices(['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'UNH', 'AI', 'BRZE', 'FLNC', 'SNOW', 'BB', 'EVGO', 'MQ']);
          } catch (error) {
            console.warn('Failed to fetch real-time stock data, using fallback:', error);
            stockData = {
              AAPL: { price: 255.46, change: 0.54, changePercent: 0.21 },
              TSLA: { price: 440.40, change: 2.83, changePercent: 0.65 },
              AMZN: { price: 219.78, change: 0.32, changePercent: 0.15 },
              GOOGL: { price: 246.54, change: 0.21, changePercent: 0.09 },
              MSFT: { price: 511.46, change: 0.27, changePercent: 0.05 },
              UNH: { price: 344.08, change: -1.11, changePercent: -0.32 },
              AI: { price: 17.14, change: -0.93, changePercent: -5.15 },
              BRZE: { price: 31.58, change: 0.22, changePercent: 0.70 },
              FLNC: { price: 11.91, change: 3.66, changePercent: 30.75 },
              SNOW: { price: 224.64, change: 1.05, changePercent: 0.47 },
              BB: { price: 4.96, change: 6.17, changePercent: 124.40 },
              EVGO: { price: 4.57, change: -1.32, changePercent: -22.40 },
              MQ: { price: 5.36, change: 0.38, changePercent: 7.63 }
            };
          }
          
          const mockData = [
            {
              id: 1,
              pair: 'AAPL',
              country: 'Apple Tokenize',
              value: formatPrice(stockData.AAPL?.price || 255.46, 4),
              change: formatPercentage(stockData.AAPL?.changePercent || 0.21),
              isPositive: (stockData.AAPL?.changePercent || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/apple.com',
              chart: generateRealTimeChartData(stockData.AAPL?.price || 255.46, (stockData.AAPL?.changePercent || 0) >= 0)
            },
            {
              id: 2,
              pair: 'TSLA',
              country: 'Tesla Tokenize',
              value: formatPrice(stockData.TSLA?.price || 440.40, 4),
              change: formatPercentage(stockData.TSLA?.changePercent || 0.65),
              isPositive: (stockData.TSLA?.changePercent || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/tesla.com',
              chart: generateRealTimeChartData(stockData.TSLA?.price || 440.40, (stockData.TSLA?.changePercent || 0) >= 0)
            },
            {
              id: 3,
              pair: 'AMZN',
              country: 'Amazon.com',
              value: formatPrice(stockData.AMZN?.price || 219.78, 4),
              change: formatPercentage(stockData.AMZN?.changePercent || 0.15),
              isPositive: (stockData.AMZN?.changePercent || 0) >= 0,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/amazon.com',
              chart: generateRealTimeChartData(stockData.AMZN?.price || 219.78, (stockData.AMZN?.changePercent || 0) >= 0)
            },
            {
              id: 4,
              pair: 'GOOGL',
              country: 'Alphabet',
              value: formatPrice(246.5391, 4),
              change: formatPercentage(0.21),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png',
              chart: generateRealTimeChartData(246.5391, true)
            },
            {
              id: 5,
              pair: 'MSFT',
              country: 'Microsoft',
              value: formatPrice(511.4605, 4),
              change: formatPercentage(0.27),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/microsoft.com',
              chart: generateRealTimeChartData(511.4605, true)
            },
            {
              id: 6,
              pair: 'UNH',
              country: 'Unitedhealth Group Inc',
              value: formatPrice(344.0802, 4),
              change: formatPercentage(-1.11),
              isPositive: false,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/unitedhealthgroup.com',
              chart: generateRealTimeChartData(false)
            },
            {
              id: 7,
              pair: 'AI',
              country: 'C3.ai, Inc',
              value: formatPrice(17.1391, 4),
              change: formatPercentage(-0.93),
              isPositive: false,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/c3.ai',
              chart: generateRealTimeChartData(false)
            },
            {
              id: 8,
              pair: 'BRZE',
              country: 'Braze, Inc.',
              value: formatPrice(31.5802, 4),
              change: formatPercentage(0.22),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/braze.com',
              chart: generateRealTimeChartData(stockData.BRZE?.price || 31.58, (stockData.BRZE?.changePercent || 0) >= 0)
            },
            {
              id: 9,
              pair: 'FLNC',
              country: 'Fluence Energy, Inc.',
              value: formatPrice(11.9107, 4),
              change: formatPercentage(3.66),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/fluenceenergy.com',
              chart: generateRealTimeChartData(stockData.FLNC?.price || 11.91, (stockData.FLNC?.changePercent || 0) >= 0)
            },
            {
              id: 10,
              pair: 'SNOW',
              country: 'Snowflake Inc.',
              value: formatPrice(224.6404, 4),
              change: formatPercentage(1.05),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/snowflake.com',
              chart: generateRealTimeChartData(stockData.SNOW?.price || 224.64, (stockData.SNOW?.changePercent || 0) >= 0)
            },
            {
              id: 11,
              pair: 'BB',
              country: 'BlackBerry Limited',
              value: formatPrice(4.9580, 4),
              change: formatPercentage(6.17),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/blackberry.com',
              chart: generateRealTimeChartData(stockData.BB?.price || 4.96, (stockData.BB?.changePercent || 0) >= 0)
            },
            {
              id: 12,
              pair: 'EVGO',
              country: 'EVgo, Inc.',
              value: formatPrice(4.5691, 4),
              change: formatPercentage(-1.32),
              isPositive: false,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/evgo.com',
              chart: generateRealTimeChartData(stockData.EVGO?.price || 4.57, (stockData.EVGO?.changePercent || 0) >= 0)
            },
            {
              id: 13,
              pair: 'MQ',
              country: 'Marqeta, Inc.',
              value: formatPrice(5.3602, 4),
              change: formatPercentage(0.38),
              isPositive: true,
              flags: ['US', 'US'],
              logo: 'https://logo.clearbit.com/marqeta.com',
              chart: generateRealTimeChartData(5.3602, true)
            }
          ];
          setMarketData(mockData);
        } else if (activeTab === 'ETF') {
          // Fetch real-time ETF data
          let etfData;
          try {
            etfData = await fetchETFPrices(['SPY', 'QQQ', 'GLD', 'VTI', 'IWM', 'EFA', 'VEA', 'EEM', 'XLF', 'XLK', 'XLE', 'XLV']);
          } catch (error) {
            console.warn('Failed to fetch real-time ETF data, using fallback:', error);
            etfData = {
              SPY: { price: 456.78, change: 0.85, changePercent: 0.19 },
              QQQ: { price: 389.45, change: 1.23, changePercent: 0.32 },
              GLD: { price: 189.67, change: 1.45, changePercent: 0.77 },
              VTI: { price: 234.56, change: 0.67, changePercent: 0.29 },
              IWM: { price: 198.34, change: -0.23, changePercent: -0.12 },
              EFA: { price: 78.91, change: 0.34, changePercent: 0.43 },
              VEA: { price: 45.23, change: 0.12, changePercent: 0.27 },
              EEM: { price: 42.15, change: -0.56, changePercent: -1.31 },
              XLF: { price: 35.67, change: 0.78, changePercent: 2.24 },
              XLK: { price: 178.45, change: 1.23, changePercent: 0.69 },
              XLE: { price: 89.12, change: -0.45, changePercent: -0.50 },
              XLV: { price: 134.78, change: 0.67, changePercent: 0.50 }
            };
          }
          
          const mockData = [
            {
              id: 1,
              pair: 'SPY',
              country: 'SPDR S&P 500 ETF',
              value: formatPrice(etfData.SPY?.price || 456.78, 2),
              change: formatPercentage(etfData.SPY?.changePercent || 0.19),
              isPositive: (etfData.SPY?.changePercent || 0) >= 0,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(etfData.SPY?.price || 456.78, (etfData.SPY?.changePercent || 0) >= 0)
            },
            {
              id: 2,
              pair: 'QQQ',
              country: 'Invesco QQQ Trust',
              value: formatPrice(389.45, 2),
              change: formatPercentage(1.23),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(etfData.QQQ?.price || 389.45, (etfData.QQQ?.changePercent || 0) >= 0)
            },
            {
              id: 3,
              pair: 'IWM',
              country: 'iShares Russell 2000 ETF',
              value: formatPrice(198.32, 2),
              change: formatPercentage(-0.45),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 4,
              pair: 'VTI',
              country: 'Vanguard Total Stock Market ETF',
              value: formatPrice(234.67, 2),
              change: formatPercentage(0.67),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 5,
              pair: 'EFA',
              country: 'iShares MSCI EAFE ETF',
              value: formatPrice(78.91, 2),
              change: formatPercentage(0.34),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 6,
              pair: 'VEA',
              country: 'Vanguard FTSE Developed Markets ETF',
              value: formatPrice(45.23, 2),
              change: formatPercentage(-0.12),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 7,
              pair: 'BND',
              country: 'Vanguard Total Bond Market ETF',
              value: formatPrice(78.45, 2),
              change: formatPercentage(0.18),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 8,
              pair: 'GLD',
              country: 'SPDR Gold Shares',
              value: formatPrice(189.67, 2),
              change: formatPercentage(1.45),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 9,
              pair: 'SLV',
              country: 'iShares Silver Trust',
              value: formatPrice(22.34, 2),
              change: formatPercentage(2.12),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 10,
              pair: 'XLF',
              country: 'Financial Select Sector SPDR Fund',
              value: formatPrice(38.92, 2),
              change: formatPercentage(-0.78),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 11,
              pair: 'XLK',
              country: 'Technology Select Sector SPDR Fund',
              value: formatPrice(167.89, 2),
              change: formatPercentage(1.56),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 12,
              pair: 'XLE',
              country: 'Energy Select Sector SPDR Fund',
              value: formatPrice(89.45, 2),
              change: formatPercentage(-1.23),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            }
          ];
          setMarketData(mockData);
        } else if (activeTab === 'Futures') {
          // Fetch real-time Futures data
          let futuresData;
          try {
            futuresData = await fetchFuturesPrices(['ES', 'GC', 'CL', 'NQ', 'YM']);
          } catch (error) {
            console.warn('Failed to fetch real-time Futures data, using fallback:', error);
            futuresData = {
              ES: { price: 4567.25, change: 0.92, changePercent: 0.02 },
              GC: { price: 2034.80, change: 1.23, changePercent: 0.06 },
              CL: { price: 78.45, change: -1.67, changePercent: -2.08 },
              NQ: { price: 15678.90, change: 0.45, changePercent: 0.00 },
              YM: { price: 34567.89, change: -0.12, changePercent: 0.00 }
            };
          }
          
          const mockData = [
            {
              id: 1,
              pair: 'ES',
              country: 'E-mini S&P 500',
              value: formatPrice(futuresData.ES?.price || 4567.25, 2),
              change: formatPercentage(futuresData.ES?.changePercent || 0),
              isPositive: (futuresData.ES?.changePercent || 0) >= 0,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(futuresData.ES?.price || 4567.25, (futuresData.ES?.changePercent || 0) >= 0)
            },
            {
              id: 2,
              pair: 'NQ',
              country: 'E-mini NASDAQ-100',
              value: formatPrice(15890.50, 2),
              change: formatPercentage(1.34),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 3,
              pair: 'YM',
              country: 'E-mini Dow Jones',
              value: formatPrice(34567.00, 2),
              change: formatPercentage(0.67),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 4,
              pair: 'RTY',
              country: 'E-mini Russell 2000',
              value: formatPrice(1987.30, 2),
              change: formatPercentage(-0.45),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 5,
              pair: 'GC',
              country: 'Gold Futures',
              value: formatPrice(2034.80, 2),
              change: formatPercentage(1.23),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 6,
              pair: 'SI',
              country: 'Silver Futures',
              value: formatPrice(24.567, 3),
              change: formatPercentage(2.45),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 7,
              pair: 'CL',
              country: 'Crude Oil Futures',
              value: formatPrice(78.45, 2),
              change: formatPercentage(-1.67),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 8,
              pair: 'NG',
              country: 'Natural Gas Futures',
              value: formatPrice(3.234, 3),
              change: formatPercentage(0.89),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 9,
              pair: 'ZB',
              country: '30-Year Treasury Bond',
              value: formatPrice(118.25, 2),
              change: formatPercentage(-0.34),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 10,
              pair: 'ZN',
              country: '10-Year Treasury Note',
              value: formatPrice(109.875, 3),
              change: formatPercentage(-0.12),
              isPositive: false,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(false)
            },
            {
              id: 11,
              pair: 'ZC',
              country: 'Corn Futures',
              value: formatPrice(4.567, 3),
              change: formatPercentage(1.45),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            },
            {
              id: 12,
              pair: 'ZS',
              country: 'Soybean Futures',
              value: formatPrice(12.89, 2),
              change: formatPercentage(0.78),
              isPositive: true,
              flags: ['US', 'US'],
              chart: generateRealTimeChartData(true)
            }
          ];
          setMarketData(mockData);
        } else {
          // For other tabs, use mock data
          setMarketData([]);
        }
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to fetch market data. Using cached data.');
        // Fallback to mock data
        setMarketData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => {
      clearInterval(interval);
      
      // Close WebSocket connection
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
      }
      
      // Clear Forex polling interval
      if (forexInterval) {
        clearInterval(forexInterval);
        console.log('🧹 Cleared Forex polling interval');
      }
      
      // Clear Stocks polling interval
      if (stocksInterval) {
        clearInterval(stocksInterval);
        console.log('🧹 Cleared Stocks polling interval');
      }
      
      // Clear ETF polling interval
      if (etfInterval) {
        clearInterval(etfInterval);
        console.log('🧹 Cleared ETF polling interval');
      }
      
      // Clear Futures polling interval
      if (futuresInterval) {
        clearInterval(futuresInterval);
        console.log('🧹 Cleared Futures polling interval');
      }
    };
       }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const featuredPairs = activeTab === 'Crypto' ? [
    {
      id: 1,
      pair: 'BTC/USD',
      country: 'Bitcoin',
      value: '$0.00',
      change: '0.00%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    {
      id: 2,
      pair: 'ETH/USD',
      country: 'Ethereum',
      value: '$0.00',
      change: '0.00%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    {
      id: 3,
      pair: 'FIL/USD',
      country: 'Filecoin',
      value: '$2.1979',
      change: '1.41%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png'
    },
    {
      id: 4,
      pair: 'DOGE/USD',
      country: 'Dogecoin',
      value: '$0.2366',
      change: '2.94%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png'
    },
    {
      id: 5,
      pair: 'XRP/USD',
      country: 'XRP',
      value: '$2.8707',
      change: '2.14%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
    }
  ] : activeTab === 'Stocks' ? [
    {
      id: 1,
      pair: 'AAPL',
      country: 'Apple Tokenize',
      value: '$255.4603',
      change: '0.54%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/apple.com'
    },
    {
      id: 2,
      pair: 'AMZN',
      country: 'Amazon.com',
      value: '$219.7825',
      change: '0.32%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/amazon.com'
    },
    {
      id: 3,
      pair: 'GOOGL',
      country: 'Alphabet',
      value: '$246.5391',
      change: '0.21%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png'
    },
    {
      id: 4,
      pair: 'MSFT',
      country: 'Microsoft',
      value: '$511.4601',
      change: '0.27%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/microsoft.com'
    },
    {
      id: 5,
      pair: 'TSLA',
      country: 'Tesla Tokenize',
      value: '$440.3997',
      change: '2.83%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/tesla.com'
    }
  ] : activeTab === 'ETF' ? [
    {
      id: 1,
      pair: 'SPY',
      country: 'SPDR S&P 500 ETF',
      value: '$456.78',
      change: '0.85%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 2,
      pair: 'QQQ',
      country: 'Invesco QQQ Trust',
      value: '$389.45',
      change: '1.23%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 3,
      pair: 'GLD',
      country: 'SPDR Gold Shares',
      value: '$189.67',
      change: '1.45%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 4,
      pair: 'XLK',
      country: 'Technology Select Sector SPDR Fund',
      value: '$167.89',
      change: '1.56%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 5,
      pair: 'VTI',
      country: 'Vanguard Total Stock Market ETF',
      value: '$234.67',
      change: '0.67%',
      isPositive: true,
      flags: ['US', 'US']
    }
  ] : activeTab === 'Futures' ? [
    {
      id: 1,
      pair: 'ES',
      country: 'E-mini S&P 500',
      value: '$4567.25',
      change: '0.92%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 2,
      pair: 'GC',
      country: 'Gold Futures',
      value: '$2034.80',
      change: '1.23%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 3,
      pair: 'NQ',
      country: 'E-mini NASDAQ-100',
      value: '$15890.50',
      change: '1.34%',
      isPositive: true,
      flags: ['US', 'US']
    },
    {
      id: 4,
      pair: 'CL',
      country: 'Crude Oil Futures',
      value: '$78.45',
      change: '-1.67%',
      isPositive: false,
      flags: ['US', 'US']
    },
    {
      id: 5,
      pair: 'SI',
      country: 'Silver Futures',
      value: '$24.567',
      change: '2.45%',
      isPositive: true,
      flags: ['US', 'US']
    }
  ] : activeTab === 'Forex' ? (forexData.length > 0 ? forexData.slice(0, 5) : [
    {
      id: 1,
      pair: 'USD/CHF',
      country: 'Switzerland',
      value: '0.8963',
      change: '0.15%',
      isPositive: true,
      flags: ['US', 'CH'],
      flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/ch.png']
    },
    {
      id: 2,
      pair: 'USD/JPY',
      country: 'Japan',
      value: '152.00',
      change: '0.25%',
      isPositive: true,
      flags: ['US', 'JP'],
      flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/jp.png']
    },
    {
      id: 3,
      pair: 'USD/EUR',
      country: 'Eurozone',
      value: '0.9200',
      change: '0.12%',
      isPositive: true,
      flags: ['US', 'EU'],
      flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/eu.png']
    },
    {
      id: 4,
      pair: 'USD/GBP',
      country: 'United Kingdom',
      value: '0.7900',
      change: '0.18%',
      isPositive: true,
      flags: ['US', 'GB'],
      flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/gb.png']
    },
    {
      id: 5,
      pair: 'USD/CAD',
      country: 'Canada',
      value: '1.3600',
      change: '0.22%',
      isPositive: true,
      flags: ['US', 'CA'],
      flagUrls: ['https://flagcdn.com/w20/us.png', 'https://flagcdn.com/w20/ca.png']
    }
  ]) : activeTab === 'Stocks' ? (stocksData.length > 0 ? stocksData.slice(0, 5) : [
    {
      id: 1,
      pair: 'AAPL',
      country: 'Apple Inc.',
      value: '$255.46',
      change: '0.54%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/apple.com'
    },
    {
      id: 2,
      pair: 'TSLA',
      country: 'Tesla Inc.',
      value: '$219.78',
      change: '0.32%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/tesla.com'
    },
    {
      id: 3,
      pair: 'AMZN',
      country: 'Amazon.com Inc.',
      value: '$246.54',
      change: '0.21%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/amazon.com'
    },
    {
      id: 4,
      pair: 'GOOGL',
      country: 'Alphabet Inc.',
      value: '$246.54',
      change: '0.21%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/google.com'
    },
    {
      id: 5,
      pair: 'MSFT',
      country: 'Microsoft Corporation',
      value: '$246.54',
      change: '0.21%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/microsoft.com'
    }
  ]) : activeTab === 'ETF' ? (etfsData.length > 0 ? etfsData.slice(0, 5) : [
    {
      id: 1,
      pair: 'SPY',
      country: 'SPDR S&P 500 ETF',
      value: '$456.78',
      change: '0.85%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/ssga.com'
    },
    {
      id: 2,
      pair: 'QQQ',
      country: 'Invesco QQQ Trust',
      value: '$389.45',
      change: '1.23%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/invesco.com'
    },
    {
      id: 3,
      pair: 'IWM',
      country: 'iShares Russell 2000 ETF',
      value: '$198.32',
      change: '0.67%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/ishares.com'
    },
    {
      id: 4,
      pair: 'VTI',
      country: 'Vanguard Total Stock Market ETF',
      value: '$234.56',
      change: '0.92%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/vanguard.com'
    },
    {
      id: 5,
      pair: 'GLD',
      country: 'SPDR Gold Trust',
      value: '$189.45',
      change: '0.45%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/ssga.com'
    }
  ]) : activeTab === 'Futures' ? (futuresData.length > 0 ? futuresData.slice(0, 5) : [
    {
      id: 1,
      pair: 'ES',
      country: 'E-mini S&P 500',
      value: '$4,567.25',
      change: '0.85%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/cme.com'
    },
    {
      id: 2,
      pair: 'NQ',
      country: 'E-mini NASDAQ-100',
      value: '$15,234.50',
      change: '1.23%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/cme.com'
    },
    {
      id: 3,
      pair: 'GC',
      country: 'Gold Futures',
      value: '$2,045.80',
      change: '0.54%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/cme.com'
    },
    {
      id: 4,
      pair: 'CL',
      country: 'Crude Oil Futures',
      value: '$78.45',
      change: '0.32%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/cme.com'
    },
    {
      id: 5,
      pair: 'ZB',
      country: '30-Year Treasury Bond',
      value: '$125.67',
      change: '0.21%',
      isPositive: true,
      flags: ['US', 'US'],
      logo: 'https://logo.clearbit.com/cme.com'
    }
  ]) : [];




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
          {t('marketTitle')}
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

        {/* Featured Currency Pairs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto">
            {featuredPairs.map((pair, index) => (
              <Link
                key={pair.id}
                to={`/trading/${activeTab.toLowerCase()}/${pair.pair}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 min-h-[180px] sm:min-h-[200px] cursor-pointer ${
                    index === 0 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border-2 border-gray-700' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                {/* New Clean Layout Structure */}
                <div className="flex flex-col gap-3">
                  {/* Top Section: Symbol and Name */}
                  <div className="flex items-center space-x-3">
                    {/* Logo/Flag */}
                    <div className="flex-shrink-0">
                    {activeTab === 'Crypto' ? (
                      <img 
                        src={pair.logo} 
                        alt={`${pair.pair} logo`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : activeTab === 'Stocks' ? (
                      <img 
                        src={pair.logo} 
                        alt={`${pair.pair} logo`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'block';
                          }
                        }}
                      />
                      ) : activeTab === 'ETF' ? (
                        <img 
                          src={pair.logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMlM2LjQ4IDIyIDEyIDIyUzIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDRMMTIgOEw4IDEyTDQgOFoiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K'} 
                          alt={`${pair.pair} logo`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMlM2LjQ4IDIyIDEyIDIyUzIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDRMMTIgOEw4IDEyTDQgOFoiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K';
                        }}
                      />
                    ) : (
                      <div className="flex -space-x-1">
                        {pair.flagUrls ? (
                          pair.flagUrls.map((flagUrl, index) => (
                            <img 
                              key={index}
                              src={flagUrl} 
                              alt={`${pair.flags[index]} flag`}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ))
                        ) : (
                          <>
                            <CountryFlag countryCode={pair.flags[0]} />
                            <CountryFlag countryCode={pair.flags[1]} />
                          </>
                        )}
                      </div>
                    )}
                </div>
                
                    {/* Symbol and Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg sm:text-xl font-bold truncate ${
                    index === 0 ? 'text-white' : 'text-gray-900'
                  }`}>{pair.pair}</h3>
                      <p className={`text-sm truncate ${
                    index === 0 ? 'text-gray-300' : 'text-gray-600'
                  }`}>({pair.country})</p>
                    </div>
                </div>
                
                  {/* Bottom Section: Price, Percentage, and Chart */}
                  <div className="flex items-center justify-between">
                    {/* Price and Percentage */}
                    <div className="flex flex-col">
                      <div className={`text-2xl sm:text-3xl font-bold ${
                    index === 0 ? 'text-white' : 'text-gray-900'
                  }`}>{pair.value}</div>
                      <div className={`text-sm font-semibold ${
                  index === 0 
                    ? (pair.isPositive ? 'text-green-400' : 'text-red-400')
                    : (pair.isPositive ? 'text-green-600' : 'text-red-600')
                }`}>
                  {pair.change}
                      </div>
                    </div>
                    
                    {/* Chart */}
                    <div className="flex items-center">
                      <SparklineChart 
                        data={pair.sparkline || pair.chart} 
                        isPositive={pair.isPositive}
                        width={80}
                        height={24}
                      />
                    </div>
                </div>
                </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          {/* Scroll Indicator - Hidden on mobile */}
          <div className="hidden lg:flex justify-center mt-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Market Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:block bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-xs sm:text-sm font-medium text-gray-600">
              <div className="text-left">Name</div>
              <div className="text-center">24h%</div>
              <div className="text-center">Chart</div>
              <div className="text-right">Price</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm sm:text-base">{t('loadingMarketData')}</span>
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
            ) : (activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData).length === 0 ? (
              <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
                No data available for {activeTab}
              </div>
            ) : (
              (activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData).map((item, index) => (
                <Link
                  key={item.id}
                  to={`/trading/${activeTab.toLowerCase()}/${item.pair}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                    className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {activeTab === 'Crypto' ? (
                            <img 
                              src={item.logo} 
                              alt={`${item.pair} logo`}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : activeTab === 'Stocks' ? (
                            <img 
                              src={item.logo} 
                              alt={`${item.pair} logo`}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'block';
                                }
                              }}
                            />
                          ) : activeTab === 'ETF' ? (
                            <img 
                              src={item.logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDNi4yNCAyIDQgNC4yNCA0IDZTNi4yNCAxMCA4IDEwUzEyIDcuNzYgMTIgNlM5Ljc2IDIgOCAyWiIgZmlsbD0iIzlDQTNBRiIvPgo8c3ZnIHg9IjIiIHk9IjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTYgM0w5IDZMNiA5TDMgNloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K'} 
                              alt={`${item.pair} logo`}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJDNi4yNCAyIDQgNC4yNCA0IDZTNi4yNCAxMCA4IDEwUzEyIDcuNzYgMTIgNlM5Ljc2IDIgOCAyWiIgZmlsbD0iIzlDQTNBRiIvPgo8c3ZnIHg9IjIiIHk9IjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTYgM0w5IDZMNiA5TDMgNloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K';
                              }}
                            />
                          ) : (
                            <div className="flex -space-x-1">
                              {item.flagUrls ? (
                                item.flagUrls.map((flagUrl, flagIndex) => (
                                  <img 
                                    key={flagIndex}
                                    src={flagUrl} 
                                    alt={`${item.flags[flagIndex]} flag`}
                                    className="w-5 h-5 rounded-full border border-white"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ))
                              ) : (
                                <>
                                  <CountryFlag countryCode={item.flags[0]} />
                                  <CountryFlag countryCode={item.flags[1]} />
                                </>
                              )}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{item.pair}</div>
                            <div className="text-xs text-gray-600">{item.country}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium text-gray-900 text-sm transition-colors duration-1000 ${
                            priceChanges[item.pair] === 'increase' ? 'bg-green-100' : 
                            priceChanges[item.pair] === 'decrease' ? 'bg-red-100' : ''
                          }`}>{item.value}</div>
                          <div className={`text-xs font-medium ${
                            item.isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <SparklineChart 
                          data={item.sparkline || item.chart} 
                          isPositive={item.isPositive}
                          width={60}
                          height={20}
                        />
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                      {/* Name */}
                      <div className="flex items-center space-x-3 text-left">
                        {activeTab === 'Crypto' ? (
                          <img 
                            src={item.logo} 
                            alt={`${item.pair} logo`}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : activeTab === 'Stocks' ? (
                          <img 
                            src={item.logo} 
                            alt={`${item.pair} logo`}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'block';
                              }
                            }}
                          />
                        ) : (
                          <div className="flex -space-x-1">
                            {item.flagUrls ? (
                              item.flagUrls.map((flagUrl, flagIndex) => (
                                <img 
                                  key={flagIndex}
                                  src={flagUrl} 
                                  alt={`${item.flags[flagIndex]} flag`}
                                  className="w-6 h-6 rounded-full border border-white"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ))
                            ) : (
                              <>
                                <CountryFlag countryCode={item.flags[0]} />
                                <CountryFlag countryCode={item.flags[1]} />
                              </>
                            )}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{item.pair}</div>
                          <div className="text-sm text-gray-600">{item.country}</div>
                        </div>
                      </div>
                      
                      {/* 24h% */}
                      <div className={`font-medium text-center ${
                        item.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
                      
                      {/* Chart */}
                      <div className="flex justify-center">
                        <SparklineChart 
                          data={item.sparkline || item.chart} 
                          isPositive={item.isPositive}
                          width={60}
                          height={20}
                        />
                      </div>
                      
                      {/* Price */}
                      <div className={`font-medium text-gray-900 text-right transition-colors duration-1000 ${
                        priceChanges[item.pair] === 'increase' ? 'bg-green-100' : 
                        priceChanges[item.pair] === 'decrease' ? 'bg-red-100' : ''
                      }`}>{item.value}</div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container-max">
          {/* Main Footer Content */}
          <div className="py-8 sm:py-10 lg:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Branding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <img 
                    src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
                    alt="UBS Logo" 
                    className="h-6 sm:h-8 w-auto"
                  />
                  <span className="text-lg sm:text-xl font-bold text-white">Tokenize</span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Advanced trading platform with real-time market data, smart trading algorithms, and comprehensive investment solutions.
                </p>
              </motion.div>

              {/* Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Products</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link to="/market" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Markets
                    </Link>
                  </li>
                  <li>
                    <Link to="/loan" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Investment & Lending
                    </Link>
                  </li>
                  <li>
                    <Link to="/smart-trading" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Smart Trading
                    </Link>
                  </li>
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Company</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#license" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      License Supervision
                    </a>
                  </li>
                  <li>
                    <Link to="/help-center" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <a href="#support" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Online Support
                    </a>
                  </li>
                </ul>
              </motion.div>

              {/* Policies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Policies</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a href="#terms" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#privacy" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Legal Links */}
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 justify-center lg:justify-start">
                <a href="#legal" className="hover:text-white transition-colors">Legal Information</a>
                <a href="#disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
                <a href="#risk" className="hover:text-white transition-colors">Risk Warning</a>
                <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
                <a href="#advertising" className="hover:text-white transition-colors">About Advertising</a>
              </div>

              {/* Social Media Icons & Copyright */}
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Social Media Icons */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <a href="#discord" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                  <a href="#twitter" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#telegram" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                </div>

                {/* Copyright */}
                <div className="text-xs sm:text-sm text-gray-400 text-center lg:text-right">
                  © {new Date().getFullYear()} UBS. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Market;
