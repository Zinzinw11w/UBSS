import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountryFlag from './CountryFlags';
import { 
  fetchRealTimeForexRates,
  fetchCryptoPrices,
  fetchStockPrices,
  fetchETFPrices,
  fetchFuturesPrices,
  formatPrice,
  formatPercentage,
  generateRealTimeChartData,
  createCryptoWebSocket,
  createForexWebSocket,
  createStockWebSocket,
  createETFWebSocket,
  createFuturesWebSocket
} from '../services/api';
import SparklineChart from './SparklineChart';

export default function MobileMarket() {
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

  const tabs = ['Forex', 'Crypto', 'Stocks', 'ETF', 'Futures'];

  // NEW: Dedicated function for fetching Forex data
  const fetchForexData = async () => {
    try {
      console.log('🔄 [Mobile] Fetching Forex data...');
      const forexRates = await fetchRealTimeForexRates();
      
      const forexPairs = [
        { pair: 'USD/CHF', country: 'Switzerland', flags: ['US', 'CH'], rate: forexRates.rates?.CHF || 0.8963, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/ch.png'] },
        { pair: 'USD/JPY', country: 'Japan', flags: ['US', 'JP'], rate: forexRates.rates?.JPY || 152.00, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/jp.png'] },
        { pair: 'USD/EUR', country: 'Eurozone', flags: ['US', 'EU'], rate: forexRates.rates?.EUR || 0.9200, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/eu.png'] },
        { pair: 'USD/GBP', country: 'United Kingdom', flags: ['US', 'GB'], rate: forexRates.rates?.GBP || 0.7900, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/gb.png'] },
        { pair: 'USD/CAD', country: 'Canada', flags: ['US', 'CA'], rate: forexRates.rates?.CAD || 1.3600, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/ca.png'] },
        { pair: 'USD/AUD', country: 'Australia', flags: ['US', 'AU'], rate: forexRates.rates?.AUD || 1.5200, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/au.png'] },
        { pair: 'USD/HKD', country: 'Hong Kong', flags: ['US', 'HK'], rate: forexRates.rates?.HKD || 7.8000, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/hk.png'] },
        { pair: 'USD/SGD', country: 'Singapore', flags: ['US', 'SG'], rate: forexRates.rates?.SGD || 1.3500, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/sg.png'] },
        { pair: 'USD/CNY', country: 'China', flags: ['US', 'CN'], rate: forexRates.rates?.CNY || 7.2000, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/cn.png'] }
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
      console.log('✅ [Mobile] Forex data updated:', forexData.length, 'pairs');
    } catch (error) {
      console.error('❌ [Mobile] Error fetching Forex data:', error);
    }
  };

  // NEW: Dedicated function for fetching Stocks data
  const fetchStocksData = async () => {
    try {
      console.log('🔄 [Mobile] Fetching Stocks data...');
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
        console.log(`📊 [Mobile Stocks] Generated sparkline for ${item.symbol}:`, {
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
      console.log('✅ [Mobile] Stocks data updated:', stocksData.length, 'stocks');
    } catch (error) {
      console.error('❌ [Mobile] Error fetching Stocks data:', error);
    }
  };

  // NEW: Dedicated function for fetching ETF data
  const fetchETFsData = async () => {
    try {
      console.log('🔄 [Mobile] Fetching ETF data...');
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
        console.log(`📊 [Mobile ETF] Generated sparkline for ${item.symbol}:`, {
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
      console.log('✅ [Mobile] ETF data updated:', etfsData.length, 'ETFs');
    } catch (error) {
      console.error('❌ [Mobile] Error fetching ETF data:', error);
    }
  };

  // NEW: Dedicated function for fetching Futures data
  const fetchFuturesData = async () => {
    try {
      console.log('🔄 [Mobile] Fetching Futures data...');
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
        console.log(`📊 [Mobile Futures] Generated sparkline for ${item.symbol}:`, {
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
          logo: logoUrl,
          sparkline: sparklineData,
          realTimePrice: price,
          lastUpdated: new Date().toISOString()
        };
      });

      setFuturesData(futuresDataArray);
      console.log('✅ [Mobile] Futures data updated:', futuresDataArray.length, 'Futures');
    } catch (error) {
      console.error('❌ [Mobile] Error fetching Futures data:', error);
    }
  };

  // Real-time WebSocket data integration
  useEffect(() => {
    let forexInterval = null;
    let stocksInterval = null;
    let etfInterval = null;
    let futuresInterval = null;
    // Close existing WebSocket
    if (webSocket) {
      webSocket.close();
    }

    const initializeRealTimeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let transformedData = [];
        let newWebSocket = null;
        
        if (activeTab === 'Forex') {
          // FOREX TAB: Use new dedicated Forex data fetching
          console.log('🔄 [Mobile] Initializing Forex tab with dedicated data feed');
          
          // Initial fetch
          await fetchForexData();
          
          // Set up polling for real-time updates every 5 seconds
          forexInterval = setInterval(async () => {
            await fetchForexData();
          }, 5000);
          
          transformedData = []; // Not used for Forex anymore
          
        } else if (activeTab === 'Stocks') {
          // STOCKS TAB: Use new dedicated Stocks data fetching
          console.log('🔄 [Mobile] Initializing Stocks tab with dedicated data feed');
          
          // Initial fetch
          await fetchStocksData();
          
          // Set up polling for real-time updates every 5 seconds
          stocksInterval = setInterval(async () => {
            await fetchStocksData();
          }, 5000);
          
          transformedData = []; // Not used for Stocks anymore
          
        } else if (activeTab === 'ETF') {
          // ETF TAB: Use new dedicated ETF data fetching
          console.log('🔄 [Mobile] Initializing ETF tab with dedicated data feed');
          
          // Initial fetch
          await fetchETFsData();
          
          // Set up polling for real-time updates every 5 seconds
          etfInterval = setInterval(async () => {
            await fetchETFsData();
          }, 5000);
          
          transformedData = []; // Not used for ETF anymore
          
        } else if (activeTab === 'Futures') {
          // FUTURES TAB: Use new dedicated Futures data fetching
          console.log('🔄 [Mobile] Initializing Futures tab with dedicated data feed');
          
          // Initial fetch
          await fetchFuturesData();
          
          // Set up polling for real-time updates every 5 seconds
          futuresInterval = setInterval(async () => {
            await fetchFuturesData();
          }, 5000);
          
          transformedData = []; // Not used for Futures anymore
          
        } else if (activeTab === 'Crypto') {
          // Initialize Crypto data - NO API CALL, WebSocket only
          console.log('🚀 Initializing Crypto tab with WebSocket-only data');
          
          const cryptoPairs = [
            { symbol: 'BTC', name: 'Bitcoin', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
            { symbol: 'ETH', name: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
            { symbol: 'LTC', name: 'Litecoin', logo: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
            { symbol: 'DOT', name: 'Polkadot', logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
            { symbol: 'FIL', name: 'Filecoin', logo: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png' },
            { symbol: 'DOGE', name: 'Dogecoin', logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
            { symbol: 'XRP', name: 'Ripple', logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
            { symbol: 'TRX', name: 'TRON', logo: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
            { symbol: 'MATIC', name: 'Polygon', logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
            { symbol: 'ADA', name: 'Cardano', logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
            { symbol: 'LINK', name: 'Chainlink', logo: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
            { symbol: 'ATOM', name: 'Cosmos', logo: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png' }
          ];

          transformedData = cryptoPairs.map((item, index) => {
            // Start with zero values - WebSocket will populate real data
            return {
              id: index + 1,
              pair: item.symbol,
              symbol: item.name,
              price: '$0.00',
              change: '0.00%',
              isPositive: true,
              flags: ['US', 'US'],
              logo: item.logo,
              chart: generateRealTimeChartData(0, true),
              sparkline: generateRealTimeChartData(0, true, 12),
              realTimePrice: 0,
              lastUpdated: new Date().toISOString()
            };
          });

          // Create Crypto WebSocket
          newWebSocket = createCryptoWebSocket(
            cryptoPairs.map(p => {
              // Map display symbols to API symbols
              const symbolMap = {
                'BTC': 'bitcoin',
                'ETH': 'ethereum', 
                'LTC': 'litecoin',
                'DOT': 'polkadot',
                'FIL': 'filecoin',
                'DOGE': 'dogecoin',
                'XRP': 'ripple',
                'TRX': 'tron',
                'MATIC': 'polygon',
                'ADA': 'cardano',
                'LINK': 'chainlink',
                'ATOM': 'cosmos'
              };
              return symbolMap[p.symbol] || p.symbol.toLowerCase();
            }),
            (updates) => {
              console.log('🔄 MobileMarket component received WebSocket updates:', updates);
              setMarketData(prevData => 
                prevData.map(item => {
                  // Map display symbols to API symbols
                  const symbolMap = {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum',
                    'LTC': 'litecoin', 
                    'DOT': 'polkadot',
                    'FIL': 'filecoin',
                    'DOGE': 'dogecoin',
                    'XRP': 'ripple',
                    'TRX': 'tron',
                    'MATIC': 'polygon',
                    'ADA': 'cardano',
                    'LINK': 'chainlink',
                    'ATOM': 'cosmos'
                  };
                  const apiSymbol = symbolMap[item.pair] || item.pair.toLowerCase();
                  const update = updates[apiSymbol];
                  console.log(`🔍 MobileMarket checking ${item.pair} -> ${apiSymbol}:`, update ? 'FOUND' : 'NOT FOUND');
                  if (update) {
                    console.log(`💰 MobileMarket updating ${item.pair} with price: $${update.price} (${update.change24h}%)`);
                    
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
                      price: formatPrice(update.price, 2),
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
        } else if (activeTab === 'Stocks') {
          // Initialize Stock data
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
            { symbol: 'FLNC', name: 'Fluence Energy', logo: 'https://logo.clearbit.com/fluenceenergy.com' },
            { symbol: 'SNOW', name: 'Snowflake Inc.', logo: 'https://logo.clearbit.com/snowflake.com' },
            { symbol: 'BB', name: 'BlackBerry Limited', logo: 'https://logo.clearbit.com/blackberry.com' },
            { symbol: 'EVGO', name: 'EVgo Inc.', logo: 'https://logo.clearbit.com/evgo.com' },
            { symbol: 'MQ', name: 'Marqeta Inc.', logo: 'https://logo.clearbit.com/marqeta.com' }
          ];

          transformedData = stockPairs.map((item, index) => {
            const stockInfo = stockData[item.symbol] || {};
            const price = stockInfo.price || Math.random() * 500 + 50;
            const change24h = stockInfo.changePercent || (Math.random() - 0.5) * 5;
            const isPositive = change24h >= 0;
            
            return {
              id: index + 1,
              pair: item.symbol,
              symbol: item.name,
              price: formatPrice(price, 2),
              change: formatPercentage(change24h),
              isPositive: isPositive,
              flags: ['US', 'US'],
              logo: item.logo,
              chart: generateRealTimeChartData(price, isPositive),
              sparkline: generateRealTimeChartData(price, isPositive, 12),
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });

          // Create Stock WebSocket
          newWebSocket = createStockWebSocket(
            stockPairs.map(p => p.symbol),
            (updates) => {
              setMarketData(prevData => 
                prevData.map(item => {
                  const update = updates[item.pair];
                  if (update) {
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
                      price: formatPrice(update.price, 2),
                      change: formatPercentage(update.change),
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
        } else if (activeTab === 'ETF') {
          // Initialize ETF data
          const etfData = await fetchETFPrices(['SPY', 'QQQ', 'GLD', 'VTI', 'IWM', 'EFA', 'VEA', 'EEM', 'XLF', 'XLK', 'XLE', 'XLV']);
          
          const etfPairs = [
            { symbol: 'SPY', name: 'SPDR S&P 500 ETF', logo: 'https://logo.clearbit.com/spdrs.com' },
            { symbol: 'QQQ', name: 'Invesco QQQ Trust', logo: 'https://logo.clearbit.com/invesco.com' },
            { symbol: 'IWM', name: 'iShares Russell 2000 ETF', logo: 'https://logo.clearbit.com/ishares.com' },
            { symbol: 'EFA', name: 'iShares MSCI EAFE ETF', logo: 'https://logo.clearbit.com/ishares.com' },
            { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
            { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
            { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', logo: 'https://logo.clearbit.com/vanguard.com' },
            { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', logo: 'https://logo.clearbit.com/ishares.com' },
            { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', logo: 'https://logo.clearbit.com/ishares.com' },
            { symbol: 'GLD', name: 'SPDR Gold Shares', logo: 'https://logo.clearbit.com/spdrs.com' }
          ];

          transformedData = etfPairs.map((item, index) => {
            const etfInfo = etfData[item.symbol] || {};
            const price = etfInfo.price || Math.random() * 200 + 50;
            const change24h = etfInfo.changePercent || (Math.random() - 0.5) * 3;
            const isPositive = change24h >= 0;
            
            return {
              id: index + 1,
              pair: item.symbol,
              symbol: item.name,
              price: formatPrice(price, 2),
              change: formatPercentage(change24h),
              isPositive: isPositive,
              flags: ['US', 'US'],
              logo: item.logo,
              chart: generateRealTimeChartData(price, isPositive),
              sparkline: generateRealTimeChartData(price, isPositive, 12),
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });

          // Create ETF WebSocket
          newWebSocket = createETFWebSocket(
            etfPairs.map(p => p.symbol),
            (updates) => {
              setMarketData(prevData => 
                prevData.map(item => {
                  const update = updates[item.pair];
                  if (update) {
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
                      price: formatPrice(update.price, 2),
                      change: formatPercentage(update.change),
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
        } else if (activeTab === 'Futures') {
          // Initialize Futures data
          const futuresData = await fetchFuturesPrices(['ES', 'GC', 'CL', 'NQ', 'YM', 'RTY', 'NG', 'ZB', 'ZN', 'ZF']);
          
          const futuresPairs = [
            { symbol: 'ES', name: 'E-mini S&P 500', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'NQ', name: 'E-mini NASDAQ-100', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'YM', name: 'E-mini Dow Jones', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'RTY', name: 'E-mini Russell 2000', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'GC', name: 'Gold Futures', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'CL', name: 'Crude Oil Futures', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'NG', name: 'Natural Gas Futures', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'ZB', name: '30-Year Treasury Bond', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'ZN', name: '10-Year Treasury Note', logo: 'https://logo.clearbit.com/cmegroup.com' },
            { symbol: 'ZF', name: '5-Year Treasury Note', logo: 'https://logo.clearbit.com/cmegroup.com' }
          ];

          transformedData = futuresPairs.map((item, index) => {
            const futuresInfo = futuresData[item.symbol] || {};
            const price = futuresInfo.price || Math.random() * 5000 + 1000;
            const change24h = futuresInfo.changePercent || (Math.random() - 0.5) * 2;
            const isPositive = change24h >= 0;
            
            return {
              id: index + 1,
              pair: item.symbol,
              symbol: item.name,
              price: formatPrice(price, 2),
              change: formatPercentage(change24h),
              isPositive: isPositive,
              flags: ['US', 'US'],
              logo: item.logo,
              chart: generateRealTimeChartData(price, isPositive),
              sparkline: generateRealTimeChartData(price, isPositive, 12),
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });

          // Create Futures WebSocket
          newWebSocket = createFuturesWebSocket(
            futuresPairs.map(p => p.symbol),
            (updates) => {
              setMarketData(prevData => 
                prevData.map(item => {
                  const update = updates[item.pair];
                  if (update) {
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
                      price: formatPrice(update.price, 2),
                      change: formatPercentage(update.change),
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
        }
        
        setMarketData(transformedData);
        setWebSocket(newWebSocket);
      } catch (err) {
        console.error('Error initializing real-time data:', err);
        setError('Failed to load market data');
        setMarketData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    initializeRealTimeData();
    
    // Cleanup function
    return () => {
      // Close WebSocket connection
      if (webSocket) {
        webSocket.close();
      }
      
      // Clear Forex polling interval
      if (forexInterval) {
        clearInterval(forexInterval);
        console.log('🧹 [Mobile] Cleared Forex polling interval');
      }
      
      // Clear Stocks polling interval
      if (stocksInterval) {
        clearInterval(stocksInterval);
        console.log('🧹 [Mobile] Cleared Stocks polling interval');
      }
      
      // Clear ETF polling interval
      if (etfInterval) {
        clearInterval(etfInterval);
        console.log('🧹 [Mobile] Cleared ETF polling interval');
      }
      
      // Clear Futures polling interval
      if (futuresInterval) {
        clearInterval(futuresInterval);
        console.log('🧹 [Mobile] Cleared Futures polling interval');
      }
    };
  }, [activeTab]);

  const getFallbackData = () => {
    return [
      {
        id: 1,
        pair: 'USD/HKD',
        symbol: 'USDHKD',
        price: '7.7712',
        change: '-0.04%',
        isPositive: false,
        flags: ['US', 'HK'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/hk.png']
      },
      {
        id: 2,
        pair: 'USD/SGD',
        symbol: 'USDSGD',
        price: '1.2940',
        change: '-0.16%',
        isPositive: false,
        flags: ['US', 'SG'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/sg.png']
      },
      {
        id: 3,
        pair: 'GBP/USD',
        symbol: 'Us Dollar',
        price: '1.3430',
        change: '0.27%',
        isPositive: true,
        flags: ['GB', 'US'],
        flagUrls: ['https://flagcdn.com/32x24/gb.png', 'https://flagcdn.com/32x24/us.png']
      },
      {
        id: 4,
        pair: 'USD/CNH',
        symbol: 'USD/CNH',
        price: '7.1264',
        change: '-0.07%',
        isPositive: false,
        flags: ['US', 'CN'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/cn.png']
      },
      {
        id: 5,
        pair: 'USD/JPY',
        symbol: 'USD/JPY',
        price: '150.7964',
        change: '-0.67%',
        isPositive: false,
        flags: ['US', 'JP'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/jp.png']
      },
      {
        id: 6,
        pair: 'EUR/USD',
        symbol: 'EUR/USD',
        price: '1.1672',
        change: '0.24%',
        isPositive: true,
        flags: ['EU', 'US'],
        flagUrls: ['https://flagcdn.com/32x24/eu.png', 'https://flagcdn.com/32x24/us.png']
      },
      {
        id: 7,
        pair: 'USD/CHF',
        symbol: 'USD/CHF',
        price: '0.7959',
        change: '-0.11%',
        isPositive: false,
        flags: ['US', 'CH'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/ch.png']
      },
    ];
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
          {/* Header */}
          <header className="flex items-center justify-between px-2 py-2 bg-white border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://www.ubs.com/etc/designs/fit/img/UBS_Logo_Semibold.svg" 
            alt="UBS Logo" 
            className="h-8 w-auto"
          />
          <span className="text-gray-900 text-xl font-semibold">Market</span>
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

          <main className="px-1 pb-16">
        {/* Category Tabs */}
        <div className="mt-2 mb-2">
          <div className="bg-gray-800 rounded-lg px-1 py-1 flex items-center justify-between">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
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
            <div className="grid grid-cols-3 gap-1 mb-2">
              {(Array.isArray(activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData) ? (activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData).slice(0, 3) : []).map((item) => (
                <Link
                  key={item.id}
                  to={`/trading/${activeTab.toLowerCase()}/${item.pair}`}
                  className="block"
                >
                  <div className="bg-gray-100 rounded-md p-3 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer h-28">
                    {/* New Clean Mobile Layout */}
                    <div className="flex flex-col gap-2 h-full">
                      {/* Top Section: Symbol and Name */}
                      <div className="flex items-center space-x-2">
                        {/* Logo/Flag */}
                        <div className="flex-shrink-0">
                          {activeTab === 'Crypto' && item.logo ? (
                            <img 
                              src={item.logo} 
                              alt={`${item.pair} logo`} 
                              className="w-5 h-5 rounded-full"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : activeTab === 'Stocks' && item.logo ? (
                            <img 
                              src={item.logo} 
                              alt={`${item.pair} logo`} 
                              className="w-5 h-5 rounded-full"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : activeTab === 'ETF' && item.logo ? (
                            <img 
                              src={item.logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik02IDFDMy4yNCAxIDEgMy4yNCAxIDZTMy4yNCAxMSA2IDExUzExIDguNzYgMTEgNlM4Ljc2IDEgNiAxWiIgZmlsbD0iIzlDQTNBRiIvPgo8c3ZnIHg9IjIiIHk9IjIiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHZpZXdCb3g9IjAgMCA4IDgiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNNCAyTDYgNEw0IDZMMiA0WiIgZmlsbD0iIzYzNjZGMTIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K'} 
                              alt={`${item.pair} logo`} 
                              className="w-5 h-5 rounded-full"
                              onError={(e) => { 
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik02IDFDMy4yNCAxIDEgMy4yNCAxIDZTMy4yNCAxMSA2IDExUzExIDguNzYgMTEgNlM4Ljc2IDEgNiAxWiIgZmlsbD0iIzlDQTNBRiIvPgo8c3ZnIHg9IjIiIHk9IjIiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHZpZXdCb3g9IjAgMCA4IDgiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNNCAyTDYgNEw0IDZMMiA0WiIgZmlsbD0iIzYzNjZGMTIiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K';
                              }}
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
                              {item.flags && item.flags.length >= 2 ? (
                                <>
                                  <CountryFlag countryCode={item.flags[0]} />
                                  <CountryFlag countryCode={item.flags[1]} />
                                </>
                              ) : (
                                item.flags?.map((flag, index) => (
                                  <span key={index} className="text-lg">{flag}</span>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Symbol and Name */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-bold text-xs truncate">{item.pair}</h3>
                          <p className="text-gray-600 text-xs truncate">{item.symbol}</p>
                        </div>
                      </div>
                      
                      {/* Bottom Section: Price, Percentage, and Chart */}
                      <div className="flex items-center justify-between flex-1">
                        {/* Price and Percentage */}
                        <div className="flex flex-col">
                          <p className={`text-gray-900 font-bold text-sm transition-colors duration-1000 ${
                            priceChanges[item.pair] === 'increase' ? 'bg-green-100' : 
                            priceChanges[item.pair] === 'decrease' ? 'bg-red-100' : ''
                          }`}>{item.price}</p>
                          <p className={`text-xs font-semibold ${
                            item.isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change}
                          </p>
                        </div>
                        
                        {/* Chart */}
                        <div className="flex items-center">
                          <SparklineChart 
                            data={item.sparkline} 
                            isPositive={item.isPositive}
                            width={50}
                            height={16}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Currency Pairs List */}
            <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-2 px-2 py-1">
            <div className="text-gray-600 text-xs font-medium">Name</div>
            <div className="text-gray-600 text-xs font-medium">24h%</div>
            <div className="text-gray-600 text-xs font-medium">Chart</div>
            <div className="text-gray-600 text-xs font-medium">Price</div>
          </div>

              {/* Currency Pair Cards */}
              {(Array.isArray(activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData) ? (activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData) : []).map((item) => (
                <Link
                  key={item.id}
                  to={`/trading/${activeTab.toLowerCase()}/${item.pair}`}
                  className="block"
                >
                  <div className="bg-white rounded-md border border-gray-200 p-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="grid grid-cols-4 gap-2 items-center">
                      {/* Name */}
                      <div className="flex items-center space-x-1">
                        <div className="flex -space-x-1">
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
                          ) : activeTab === 'Forex' ? (
                            <div className="flex -space-x-1">
                              {/* No flags for Forex */}
                            </div>
                          ) : (
                            <div className="flex -space-x-1">
                              {item.flags && item.flags.length >= 2 ? (
                                <>
                                  <CountryFlag countryCode={item.flags[0]} />
                                  <CountryFlag countryCode={item.flags[1]} />
                                </>
                              ) : (
                                item.flags?.map((flag, index) => (
                                  <span key={index} className="text-sm">{flag}</span>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium text-xs">{item.pair}</span>
                      </div>

                      {/* 24h% */}
                      <div className={`text-xs font-medium ${
                        item.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>

                      {/* Chart */}
                      <div className="flex items-center">
                        <SparklineChart 
                          data={item.sparkline} 
                          isPositive={item.isPositive}
                          width={60}
                          height={20}
                        />
                      </div>

                      {/* Price */}
                      <div className={`text-gray-900 font-medium text-xs transition-colors duration-1000 ${
                        priceChanges[item.pair] === 'increase' ? 'bg-green-100' : 
                        priceChanges[item.pair] === 'decrease' ? 'bg-red-100' : ''
                      }`}>
                        {item.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </main>

          {/* Bottom Navigation Bar */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <div className="bg-gray-800 mx-1 mb-1 rounded-lg shadow-2xl px-2 py-1.5 flex items-center justify-between">
              <Link to="/" className="flex flex-col items-center space-y-1 flex-1">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span className="text-xs text-gray-300">Home</span>
              </Link>
              <Link to="/market" className="flex flex-col items-center space-y-1 flex-1">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs text-white">Market</span>
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
