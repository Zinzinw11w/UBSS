import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountryFlag from './CountryFlags';
import { useDatabase } from '../contexts/DatabaseContext';
import CreatePlanModal from './CreatePlanModal';
import { 
  fetchRealTimeForexRates,
  fetchCryptoPrices,
  fetchStockPrices,
  fetchETFPrices,
  fetchFuturesPrices,
  formatPrice,
  formatPercentage,
  generateRealTimeChartData,
  createCryptoWebSocket
} from '../services/api';
import SparklineChart from './SparklineChart';

export default function MobileSmartTrading() {
  const [activeTab, setActiveTab] = useState('Forex');
  const [marketData, setMarketData] = useState([]);
  const [forexData, setForexData] = useState([]); // Separate state for Forex data
  const [stocksData, setStocksData] = useState([]); // Separate state for Stocks data
  const [etfsData, setEtfsData] = useState([]); // Separate state for ETF data
  const [futuresData, setFuturesData] = useState([]); // Separate state for Futures data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [priceChanges, setPriceChanges] = useState({});
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const { user } = useDatabase();

  const tabs = ['Forex', 'Crypto', 'Stocks', 'ETF', 'Futures'];

  // Handle plus button click
  const handleAddToWatchlist = (symbol) => {
    setSelectedSymbol(symbol);
    setShowCreatePlan(true);
  };

  const handleConfirmPlan = () => {
    // Create the trading plan
    console.log('Creating trading plan:', {
      symbol: selectedSymbol,
      user: user?.uid
    });
    
    // Show success message
    alert('Trading plan created successfully!');
    setShowCreatePlan(false);
  };

  // NEW: Dedicated function for fetching Forex data
  const fetchForexData = async () => {
    try {
      console.log('🔄 [Smart Trading] Fetching Forex data...');
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

      const forexDataArray = forexPairs.map((item, index) => {
        const isPositive = Math.random() > 0.5;
        const change24h = (Math.random() - 0.5) * 2;
        const sparklineData = generateRealTimeChartData(item.rate, isPositive, 12);
        
        return {
          id: index + 1,
          pair: item.pair,
          symbol: item.country,
          price: formatPrice(item.rate, item.pair.includes('JPY') ? 2 : 4),
          value: formatPrice(item.rate, item.pair.includes('JPY') ? 2 : 4),
          change: formatPercentage(change24h),
          changeValue: change24h,
          isPositive: isPositive,
          flags: item.flags,
          flagUrls: item.flagUrls,
          sparkline: sparklineData,
          realTimePrice: item.rate,
          lastUpdated: new Date().toISOString()
        };
      });

      setForexData(forexDataArray);
      console.log('✅ [Smart Trading] Forex data updated:', forexDataArray.length, 'pairs');
    } catch (error) {
      console.error('❌ [Smart Trading] Error fetching Forex data:', error);
    }
  };

  // NEW: Dedicated function for fetching Stocks data
  const fetchStocksData = async () => {
    try {
      console.log('🔄 [Smart Trading] Fetching Stocks data...');
      const stockData = await fetchStockPrices(['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'CRM', 'ADBE', 'PYPL']);
      
      const stockPairs = [
        { symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com' },
        { symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', logo: 'https://logo.clearbit.com/amazon.com' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', logo: 'https://logo.clearbit.com/microsoft.com' },
        { symbol: 'META', name: 'Meta Platforms Inc.', logo: 'https://logo.clearbit.com/meta.com' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', logo: 'https://logo.clearbit.com/nvidia.com' },
        { symbol: 'NFLX', name: 'Netflix Inc.', logo: 'https://logo.clearbit.com/netflix.com' },
        { symbol: 'AMD', name: 'Advanced Micro Devices', logo: 'https://logo.clearbit.com/amd.com' },
        { symbol: 'INTC', name: 'Intel Corporation', logo: 'https://logo.clearbit.com/intel.com' },
        { symbol: 'CRM', name: 'Salesforce Inc.', logo: 'https://logo.clearbit.com/salesforce.com' },
        { symbol: 'ADBE', name: 'Adobe Inc.', logo: 'https://logo.clearbit.com/adobe.com' },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.', logo: 'https://logo.clearbit.com/paypal.com' }
      ];

      const stocksDataArray = stockPairs.map((item, index) => {
        const stockInfo = stockData[item.symbol] || {};
        const price = stockInfo.price || Math.random() * 500 + 50;
        const change24h = stockInfo.change || (Math.random() - 0.5) * 5;
        const isPositive = change24h >= 0;
        const logoUrl = stockInfo.logoUrl || item.logo;
        
        const sparklineData = generateRealTimeChartData(price, isPositive, 12);
        
        return {
          id: index + 1,
          pair: item.symbol,
          symbol: item.name,
          price: formatPrice(price, 2),
          value: formatPrice(price, 2),
          change: formatPercentage(change24h),
          changeValue: change24h,
          isPositive: isPositive,
          flags: ['US', 'US'],
          logo: logoUrl,
          sparkline: sparklineData,
          realTimePrice: price,
          lastUpdated: new Date().toISOString()
        };
      });

      setStocksData(stocksDataArray);
      console.log('✅ [Smart Trading] Stocks data updated:', stocksDataArray.length, 'stocks');
    } catch (error) {
      console.error('❌ [Smart Trading] Error fetching Stocks data:', error);
    }
  };

  // NEW: Dedicated function for fetching ETF data
  const fetchETFsData = async () => {
    try {
      console.log('🔄 [Smart Trading] Fetching ETF data...');
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

      const etfsDataArray = etfPairs.map((item, index) => {
        const etfInfo = etfData[item.symbol] || {};
        const price = etfInfo.price || Math.random() * 200 + 50;
        const change24h = etfInfo.change || (Math.random() - 0.5) * 5;
        const isPositive = change24h >= 0;
        const logoUrl = etfInfo.logoUrl || item.logo;
        
        const sparklineData = generateRealTimeChartData(price, isPositive, 12);
        
        return {
          id: index + 1,
          pair: item.symbol,
          symbol: item.name,
          price: formatPrice(price, 2),
          value: formatPrice(price, 2),
          change: formatPercentage(change24h),
          changeValue: change24h,
          isPositive: isPositive,
          flags: ['US', 'US'],
          logo: logoUrl,
          sparkline: sparklineData,
          realTimePrice: price,
          lastUpdated: new Date().toISOString()
        };
      });

      setEtfsData(etfsDataArray);
      console.log('✅ [Smart Trading] ETF data updated:', etfsDataArray.length, 'ETFs');
    } catch (error) {
      console.error('❌ [Smart Trading] Error fetching ETF data:', error);
    }
  };

  // NEW: Dedicated function for fetching Futures data
  const fetchFuturesData = async () => {
    try {
      console.log('🔄 [Smart Trading] Fetching Futures data...');
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
        
        const sparklineData = generateRealTimeChartData(price, isPositive, 12);
        
        return {
          id: index + 1,
          pair: item.symbol,
          symbol: item.name,
          price: formatPrice(price, 2),
          value: formatPrice(price, 2),
          change: formatPercentage(change24h),
          changeValue: change24h,
          isPositive: isPositive,
          flags: ['US', 'US'],
          logo: logoUrl,
          sparkline: sparklineData,
          realTimePrice: price,
          lastUpdated: new Date().toISOString()
        };
      });

      setFuturesData(futuresDataArray);
      console.log('✅ [Smart Trading] Futures data updated:', futuresDataArray.length, 'Futures');
    } catch (error) {
      console.error('❌ [Smart Trading] Error fetching Futures data:', error);
    }
  };

  // Fetch real-time market data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let transformedData = [];
        
        if (activeTab === 'Forex') {
          // Fetch real-time Forex data
          let forexData;
          try {
            forexData = await fetchRealTimeForexRates();
          } catch (error) {
            console.warn('Failed to fetch real-time Forex data, using fallback:', error);
            forexData = {
              rates: {
                CHF: 0.8963,
                JPY: 152.00,
                EUR: 0.9200,
                GBP: 0.7900,
                CAD: 1.3600,
                AUD: 1.5200,
                HKD: 7.8000,
                SGD: 1.3500,
                CNY: 7.2000
              },
              last_updated: new Date().toISOString()
            };
          }
          
          // Create Forex pairs with proper structure
          const forexPairs = [
            { pair: 'USD/CHF', country: 'Switzerland', flags: ['US', 'CH'], rate: forexData.rates?.CHF || 0.8963, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/ch.png'] },
            { pair: 'USD/JPY', country: 'Japan', flags: ['US', 'JP'], rate: forexData.rates?.JPY || 152.00, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/jp.png'] },
            { pair: 'USD/EUR', country: 'Eurozone', flags: ['US', 'EU'], rate: forexData.rates?.EUR || 0.9200, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/eu.png'] },
            { pair: 'USD/GBP', country: 'United Kingdom', flags: ['US', 'GB'], rate: forexData.rates?.GBP || 0.7900, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/gb.png'] },
            { pair: 'USD/CAD', country: 'Canada', flags: ['US', 'CA'], rate: forexData.rates?.CAD || 1.3600, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/ca.png'] },
            { pair: 'USD/AUD', country: 'Australia', flags: ['US', 'AU'], rate: forexData.rates?.AUD || 1.5200, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/au.png'] },
            { pair: 'USD/HKD', country: 'Hong Kong', flags: ['US', 'HK'], rate: forexData.rates?.HKD || 7.8000, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/hk.png'] },
            { pair: 'USD/SGD', country: 'Singapore', flags: ['US', 'SG'], rate: forexData.rates?.SGD || 1.3500, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/sg.png'] },
            { pair: 'USD/CNY', country: 'China', flags: ['US', 'CN'], rate: forexData.rates?.CNY || 7.2000, flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/cn.png'] }
          ];

          transformedData = forexPairs.map((item, index) => {
            const isPositive = Math.random() > 0.5;
            const volatility = 0.002;
            const change24h = (Math.random() - 0.5) * volatility * 100;
            
            return {
              id: index + 1,
              pair: item.pair,
              symbol: item.pair,
              price: formatPrice(item.rate, item.pair.includes('JPY') ? 2 : 4),
              change: formatPercentage(change24h),
              isPositive: change24h >= 0,
              flags: item.flags,
              flagUrls: item.flagUrls,
              chart: generateRealTimeChartData(item.rate, isPositive),
              realTimePrice: item.rate,
              lastUpdated: forexData.last_updated || new Date().toISOString()
            };
          });
        } else if (activeTab === 'Crypto') {
          // Fetch real-time crypto data
          let cryptoData;
          try {
            cryptoData = await fetchCryptoPrices(['bitcoin', 'ethereum', 'litecoin', 'polkadot', 'filecoin', 'dogecoin', 'ripple', 'tron', 'polygon', 'cardano', 'chainlink', 'cosmos']);
          } catch (error) {
            console.warn('Failed to fetch real-time crypto data, using fallback:', error);
            cryptoData = {};
          }
          
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
            const cryptoInfo = cryptoData[item.symbol.toLowerCase()] || {};
            const price = cryptoInfo.price || Math.random() * 50000 + 1000;
            const change24h = cryptoInfo.change24h || (Math.random() - 0.5) * 10;
            const isPositive = change24h >= 0;
            
            return {
              id: index + 1,
              pair: item.symbol,
              symbol: item.name,
              price: formatPrice(price, 2),
              change: formatPercentage(change24h),
              isPositive: isPositive,
              flags: ['US', 'US'], // Crypto doesn't have country flags
              logo: item.logo,
              chart: generateRealTimeChartData(price, isPositive),
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });
        } else if (activeTab === 'Stocks') {
          // Fetch real-time stock data
          let stockData;
          try {
            stockData = await fetchStockPrices(['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'UNH', 'AI', 'BRZE', 'FLNC', 'SNOW', 'BB', 'EVGO', 'MQ']);
          } catch (error) {
            console.warn('Failed to fetch real-time stock data, using fallback:', error);
            stockData = {};
          }
          
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
              flags: ['US', 'US'], // US stocks
              logo: item.logo,
              chart: generateRealTimeChartData(price, isPositive),
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });
        } else if (activeTab === 'ETF') {
          // ETF data
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
            const price = Math.random() * 200 + 50;
            const change24h = (Math.random() - 0.5) * 3;
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
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });
        } else if (activeTab === 'Futures') {
          // Futures data
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
            const price = Math.random() * 5000 + 1000;
            const change24h = (Math.random() - 0.5) * 2;
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
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });
        }
        
        setMarketData(transformedData);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to load market data');
        setMarketData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    // Initialize with fallback data first
    setMarketData(getFallbackData());
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

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

    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'Forex') {
          // FOREX TAB: Use new dedicated Forex data fetching
          console.log('🔄 [Smart Trading] Initializing Forex tab with dedicated data feed');
          
          // Initial fetch
          await fetchForexData();
          
          // Set up polling for real-time updates every 5 seconds
          forexInterval = setInterval(async () => {
            await fetchForexData();
          }, 5000);
          
        } else if (activeTab === 'Stocks') {
          // STOCKS TAB: Use new dedicated Stocks data fetching
          console.log('🔄 [Smart Trading] Initializing Stocks tab with dedicated data feed');
          
          // Initial fetch
          await fetchStocksData();
          
          // Set up polling for real-time updates every 5 seconds
          stocksInterval = setInterval(async () => {
            await fetchStocksData();
          }, 5000);
          
        } else if (activeTab === 'ETF') {
          // ETF TAB: Use new dedicated ETF data fetching
          console.log('🔄 [Smart Trading] Initializing ETF tab with dedicated data feed');
          
          // Initial fetch
          await fetchETFsData();
          
          // Set up polling for real-time updates every 5 seconds
          etfInterval = setInterval(async () => {
            await fetchETFsData();
          }, 5000);
          
        } else if (activeTab === 'Futures') {
          // FUTURES TAB: Use new dedicated Futures data fetching
          console.log('🔄 [Smart Trading] Initializing Futures tab with dedicated data feed');
          
          // Initial fetch
          await fetchFuturesData();
          
          // Set up polling for real-time updates every 5 seconds
          futuresInterval = setInterval(async () => {
            await fetchFuturesData();
          }, 5000);
          
        } else if (activeTab === 'Crypto') {
          // Initialize Crypto data - NO API CALL, WebSocket only
          console.log('🚀 [Smart Trading] Initializing Crypto tab with WebSocket-only data');
          
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
            { symbol: 'ATOM', name: 'Cosmos', logo: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png' },
            { symbol: 'BNB', name: 'BNB', logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
            { symbol: 'SOL', name: 'Solana', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' }
          ];

          const mockData = cryptoPairs.map((item, index) => {
            const isPositive = Math.random() > 0.5;
            const price = 0; // Start with $0.00, let WebSocket update
            const change24h = 0; // Start with 0%, let WebSocket update
            // Generate sparkline with a reasonable base price for initial display
            const sparklineData = generateRealTimeChartData(100, isPositive, 12);
            
            return {
              id: index + 1,
              pair: `${item.symbol}/USD`,
              symbol: item.name,
              price: formatPrice(price, 2),
              value: formatPrice(price, 2),
              change: formatPercentage(change24h),
              changeValue: change24h,
              isPositive: isPositive,
              flags: ['US', 'US'],
              logo: item.logo,
              sparkline: sparklineData,
              chart: sparklineData, // Add chart property for compatibility
              realTimePrice: price,
              lastUpdated: new Date().toISOString()
            };
          });

          setMarketData(mockData);
          
          // Set up WebSocket for real-time updates
          const symbolsToSubscribe = ['bitcoin', 'ethereum', 'litecoin', 'polkadot', 'filecoin', 'dogecoin', 'ripple', 'tron', 'polygon', 'cardano', 'chainlink', 'cosmos', 'binancecoin', 'solana'];
          console.log('🔗 [Smart Trading] Subscribing to symbols:', symbolsToSubscribe);
          const ws = createCryptoWebSocket(
            symbolsToSubscribe,
            (data) => {
              console.log('📡 [Smart Trading] Received WebSocket data:', data);
              console.log('📡 [Smart Trading] WebSocket data keys:', Object.keys(data));
              setMarketData(prevData => {
                return prevData.map(item => {
                  const displaySymbol = item.pair.split('/')[0];
                  // Map display symbols to API symbols for WebSocket data lookup
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
                    'ATOM': 'cosmos',
                    'BNB': 'binancecoin',
                    'SOL': 'solana'
                  };
                  const apiSymbol = symbolMap[displaySymbol];
                  const update = data[apiSymbol];
                  console.log(`🔍 [Smart Trading] Processing ${displaySymbol} -> ${apiSymbol}:`, {
                    displaySymbol,
                    apiSymbol,
                    hasUpdate: !!update,
                    update: update ? { price: update.price, change24h: update.change24h, sparkline: update.sparkline } : null,
                    currentItem: { pair: item.pair, price: item.price }
                  });
                  
                  // Special debugging for MATIC
                  if (displaySymbol === 'MATIC') {
                    console.log('🎯 [MATIC Debug] Special processing:', {
                      displaySymbol,
                      apiSymbol,
                      update,
                      sparklineData: update?.sparkline,
                      sparklineLength: update?.sparkline?.length
                    });
                  }
                  if (update) {
                    const updatedItem = {
                      ...item,
                      price: formatPrice(update.price, 2),
                      value: formatPrice(update.price, 2),
                      change: formatPercentage(update.change24h),
                      changeValue: update.change24h,
                      isPositive: update.change24h >= 0,
                      sparkline: update.sparkline, // Use sparkline from WebSocket update
                      chart: update.sparkline, // Use sparkline from WebSocket update
                      realTimePrice: update.price,
                      lastUpdated: new Date().toISOString()
                    };
                    console.log(`✅ [Smart Trading] Updated ${displaySymbol}:`, {
                      oldPrice: item.price,
                      newPrice: updatedItem.price,
                      oldChange: item.change,
                      newChange: updatedItem.change,
                      sparklineData: updatedItem.sparkline,
                      sparklineLength: updatedItem.sparkline?.length
                    });
                    return updatedItem;
                  }
                  return item;
                });
              });
              
              // Update price changes for visual feedback
              setPriceChanges(prev => ({
                ...prev,
                ...data
              }));
            }
          );
          
          setWebSocket(ws);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ [Smart Trading] Error fetching market data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMarketData();

    // Cleanup function
    return () => {
      // Close WebSocket
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
      }
      
      // Clear Forex polling interval
      if (forexInterval) {
        clearInterval(forexInterval);
        console.log('🧹 [Smart Trading] Cleared Forex polling interval');
      }
      
      // Clear Stocks polling interval
      if (stocksInterval) {
        clearInterval(stocksInterval);
        console.log('🧹 [Smart Trading] Cleared Stocks polling interval');
      }
      
      // Clear ETF polling interval
      if (etfInterval) {
        clearInterval(etfInterval);
        console.log('🧹 [Smart Trading] Cleared ETF polling interval');
      }
      
      // Clear Futures polling interval
      if (futuresInterval) {
        clearInterval(futuresInterval);
        console.log('🧹 [Smart Trading] Cleared Futures polling interval');
      }
    };
  }, [activeTab]);

  const getFallbackData = () => {
    return [
      {
        id: 1,
        pair: 'USD/CNH',
        symbol: 'USDCNH',
        price: '7.1229',
        change: '-0.12%',
        isPositive: false,
        flags: ['US', 'CN'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/cn.png']
      },
      {
        id: 2,
        pair: 'USD/JPY',
        symbol: 'USDJPY',
        price: '150.6454',
        change: '-0.77%',
        isPositive: false,
        flags: ['US', 'JP'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/jp.png']
      },
      {
        id: 3,
        pair: 'EUR/USD',
        symbol: 'EURUSD',
        price: '1.1679',
        change: '0.58%',
        isPositive: true,
        flags: ['EU', 'US'],
        flagUrls: ['https://flagcdn.com/32x24/eu.png', 'https://flagcdn.com/32x24/us.png']
      },
      {
        id: 4,
        pair: 'USD/CHF',
        symbol: 'USDCHF',
        price: '0.7946',
        change: '-0.28%',
        isPositive: false,
        flags: ['US', 'CH'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/ch.png']
      },
      {
        id: 5,
        pair: 'USD/HKD',
        symbol: 'USDHKD',
        price: '7.7709',
        change: '-0.04%',
        isPositive: false,
        flags: ['US', 'HK'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/hk.png']
      },
      {
        id: 6,
        pair: 'USD/SGD',
        symbol: 'USDSGD',
        price: '1.2933',
        change: '-0.22%',
        isPositive: false,
        flags: ['US', 'SG'],
        flagUrls: ['https://flagcdn.com/32x24/us.png', 'https://flagcdn.com/32x24/sg.png']
      },
      {
        id: 7,
        pair: 'GBP/USD',
        symbol: 'GBPUSD',
        price: '1.3437',
        change: '0.32%',
        isPositive: true,
        flags: ['GB', 'US'],
        flagUrls: ['https://flagcdn.com/32x24/gb.png', 'https://flagcdn.com/32x24/us.png']
      },
      {
        id: 8,
        pair: 'HKD/CNY',
        symbol: 'HKDCNY',
        price: '0.9167',
        change: '-0.05%',
        isPositive: false,
        flags: ['HK', 'CN'],
        flagUrls: ['https://flagcdn.com/32x24/hk.png', 'https://flagcdn.com/32x24/cn.png']
      },
      {
        id: 9,
        pair: 'AUD/USD',
        symbol: 'AUDUSD',
        price: '0.6543',
        change: '0.15%',
        isPositive: true,
        flags: ['AU', 'US'],
        flagUrls: ['https://flagcdn.com/32x24/au.png', 'https://flagcdn.com/32x24/us.png']
      },
      {
        id: 10,
        pair: 'CAD/USD',
        symbol: 'CADUSD',
        price: '0.7321',
        change: '-0.08%',
        isPositive: false,
        flags: ['CA', 'US'],
        flagUrls: ['https://flagcdn.com/32x24/ca.png', 'https://flagcdn.com/32x24/us.png']
      }
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
          <span className="text-gray-900 text-xl font-semibold">Smart Trading</span>
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

        {/* Currency Pairs List */}
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-2 px-2 py-2 bg-gray-50 rounded-lg">
            <div className="text-gray-700 text-xs font-semibold">Name</div>
            <div className="text-gray-700 text-xs font-semibold">Spot price</div>
            <div className="text-gray-700 text-xs font-semibold">24h%</div>
            <div className="text-gray-700 text-xs font-semibold">Chart</div>
            <div className="text-gray-700 text-xs font-semibold"></div>
          </div>

          {/* Currency Pair Cards */}
          {(Array.isArray(activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData) ? (activeTab === 'Forex' ? forexData : activeTab === 'Stocks' ? stocksData : activeTab === 'ETF' ? etfsData : activeTab === 'Futures' ? futuresData : marketData) : []).map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-5 gap-2 items-center">
                {/* Name */}
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {activeTab === 'Crypto' && item.logo ? (
                      <img 
                        src={item.logo} 
                        alt={`${item.pair} logo`} 
                        className="w-8 h-8 rounded-full border border-gray-200"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : activeTab === 'Stocks' && item.logo ? (
                      <img 
                        src={item.logo} 
                        alt={`${item.pair} logo`} 
                        className="w-8 h-8 rounded-full border border-gray-200"
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
                  <span className="text-gray-900 font-semibold text-xs">{item.pair}</span>
                </div>

                {/* Spot Price */}
                <div className={`text-gray-900 font-semibold text-xs transition-colors duration-1000 ${
                  priceChanges[item.pair?.split('/')[0]?.toLowerCase()] ? 'bg-green-100' : ''
                }`}>
                  {item.price}
                </div>

                {/* 24h% */}
                <div className={`text-xs font-semibold ${
                  item.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change}
                </div>

                {/* Chart */}
                <div className="flex items-center justify-center">
                  <SparklineChart 
                    data={item.sparkline || item.chart} 
                    isPositive={item.isPositive} 
                    width={40} 
                    height={20} 
                  />
                </div>

                {/* Plus Button */}
                <div className="flex items-center justify-end">
                  <button 
                    onClick={() => handleAddToWatchlist(item.pair)}
                    className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs text-gray-300">Market</span>
              </Link>
              <Link to="/smart-trading" className="flex flex-col items-center space-y-1 flex-1">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-white">Smart</span>
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

      {/* Desktop-style Create Plan Modal */}
      {showCreatePlan && (
        <CreatePlanModal
          isOpen={showCreatePlan}
          onClose={() => setShowCreatePlan(false)}
          symbol={selectedSymbol}
          availableBalance={user?.balance || 0}
          onPlanCreated={handleConfirmPlan}
        />
      )}
    </div>
  );
}
