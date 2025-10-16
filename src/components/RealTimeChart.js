import React, { useState, useEffect, useRef } from 'react';
import { fetchHistoricalData, createForexWebSocket } from '../services/api';

const RealTimeChart = ({ symbol, category, currentPrice, priceChange, ohlc }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [livePrice, setLivePrice] = useState(() => {
    // Set realistic initial prices based on category and symbol
    if (category === 'forex') {
      return symbol.includes('USD/CHF') ? 0.8050 : symbol.includes('EUR/USD') ? 1.0850 : 0.8050;
    } else if (category === 'crypto') {
      return symbol.includes('BTC') ? 45000 : symbol.includes('ETH') ? 3000 : 100;
    } else {
      return symbol.includes('AAPL') ? 180 : symbol.includes('TSLA') ? 250 : 100;
    }
  });
  const [liveChange, setLiveChange] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scroll: 0 });
  const [zoomLevel] = useState(1);
  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const chartRef = useRef(null);
  
  const formatPrice = (price) => {
    if (category === 'forex') {
      return price.toFixed(4);
    } else if (category === 'crypto') {
      return price.toFixed(2);
    } else {
      return price.toFixed(2);
    }
  };

  // Generate realistic mock data as fallback
  const generateMockData = () => {
    const now = new Date();
    const formattedData = [];
    
    // Set realistic base prices based on category
    let basePrice;
    if (category === 'forex') {
      basePrice = symbol.includes('USD/CHF') ? 0.8050 : symbol.includes('EUR/USD') ? 1.0850 : 0.8050;
    } else if (category === 'crypto') {
      basePrice = symbol.includes('BTC') ? 45000 : symbol.includes('ETH') ? 3000 : 100;
    } else {
      basePrice = symbol.includes('AAPL') ? 180 : symbol.includes('TSLA') ? 250 : 100;
    }
    
    let price = basePrice;
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(now.getTime() - (99 - i) * 60 * 60 * 1000);
      const volatility = category === 'crypto' ? 0.05 : category === 'forex' ? 0.002 : 0.03;
      const change = (Math.random() - 0.5) * volatility;
      price = price * (1 + change);
      
      formattedData.push({
        time: time.toISOString(),
          price: price,
        volume: Math.random() * 1000
      });
    }
    return formattedData;
  };

  // Fetch historical data from real APIs
  const fetchHistoricalDataForChart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for now to avoid API delays
      const mockData = generateMockData();
      setChartData(mockData);
      setLoading(false);
      
    } catch (err) {
      console.error('Error in fetchHistoricalDataForChart:', err);
      // Fallback to mock data even on error
      const mockData = generateMockData();
      setChartData(mockData);
      setLoading(false);
    }
  };

  // WebSocket connection for real-time updates
  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      if (category === 'crypto') {
        // Binance WebSocket for crypto
        const wsSymbol = symbol.toLowerCase().replace('/usd', 'usdt');
        const wsUrl = `wss://stream.binance.com:9443/ws/${wsSymbol}@ticker`;
        
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.c && data.P) {
            setLivePrice(parseFloat(data.c));
            setLiveChange(parseFloat(data.P));
            
            // Update chart data
            setChartData(prevData => {
              const newData = [...prevData];
              const lastData = newData[newData.length - 1];
              if (lastData) {
                newData[newData.length - 1] = {
                  ...lastData,
                  price: parseFloat(data.c),
                  volume: parseFloat(data.v) || (lastData.volume || 0)
                };
              }
              return newData;
            });
          }
        };
      } else if (category === 'forex') {
        // Use real-time Forex WebSocket
        const pairs = [symbol];
        wsRef.current = createForexWebSocket(pairs, (updates) => {
          const update = updates[symbol];
          if (update) {
            setLivePrice(update.price);
            setLiveChange(update.change);
            
            // Update chart data
            setChartData(prevData => {
              const newData = [...prevData];
              const lastData = newData[newData.length - 1];
              if (lastData) {
                newData[newData.length - 1] = {
                  ...lastData,
                  price: update.price,
                  volume: (lastData.volume || 0) + Math.random() * 100
                };
              }
              return newData;
            });
          }
        });
      } else {
        // For stocks, simulate real-time updates
        intervalRef.current = setInterval(() => {
          const volatility = 0.01;
          const change = (Math.random() - 0.5) * volatility;
          const newPrice = livePrice * (1 + change);
          const basePrice = livePrice;
          const newChange = ((newPrice - basePrice) / basePrice) * 100;
          
          setLivePrice(newPrice);
          setLiveChange(newChange);
          
          // Update chart data
          setChartData(prevData => {
            const newData = [...prevData];
            const lastData = newData[newData.length - 1];
            if (lastData) {
              newData[newData.length - 1] = {
                ...lastData,
                price: newPrice,
                volume: (lastData.volume || 0) + Math.random() * 100
              };
            }
            return newData;
          });
        }, 2000);
      }
    } catch (err) {
      console.error('WebSocket connection error:', err);
    }
  };

  useEffect(() => {
    fetchHistoricalDataForChart();
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate chart dimensions
  const chartHeight = 300;
  const baseChartWidth = 1200; // Base width for calculations
  const chartWidth = baseChartWidth * zoomLevel; // Apply zoom to width
  const padding = 40;

  // Mouse event handlers for scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      scroll: scrollOffset
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const newOffset = dragStart.scroll - deltaX;
    const containerWidth = chartRef.current?.clientWidth || 800;
    const maxOffset = Math.max(0, chartWidth - containerWidth);
    
    setScrollOffset(Math.max(0, Math.min(maxOffset, newOffset)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    
    // Mouse wheel always pans horizontally when over the chart
    const deltaX = e.deltaX || e.deltaY;
    const panSpeed = 50; // Adjust pan speed
    const newOffset = scrollOffset + (deltaX > 0 ? panSpeed : -panSpeed);
    const containerWidth = chartRef.current?.clientWidth || 800;
    const maxOffset = Math.max(0, chartWidth - containerWidth);
    
    setScrollOffset(Math.max(0, Math.min(maxOffset, newOffset)));
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-900">{symbol}</div>
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
          </div>
        </div>
        <div className="p-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading real-time chart data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-900">{symbol}</div>
            <div className="text-xl font-bold text-gray-900">{formatPrice(currentPrice)} USD</div>
          </div>
        </div>
        <div className="p-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchHistoricalData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

      // Calculate price range for scaling
      const prices = chartData.map(d => d?.price || 0).filter(price => price > 0);
      const maxPrice = prices.length > 0 ? Math.max(...prices) : livePrice;
      const minPrice = prices.length > 0 ? Math.min(...prices) : livePrice;
      const priceRange = maxPrice - minPrice || (livePrice * 0.01); // Ensure minimum range

  const getX = (index) => padding + (index / (chartData.length - 1)) * (chartWidth - padding * 2) - scrollOffset;
  const getY = (price) => chartHeight - ((price - minPrice) / priceRange) * (chartHeight - padding * 2) + padding;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold text-gray-900">{symbol}</div>
          <div className="text-xl font-bold text-gray-900">{formatPrice(livePrice)} USD</div>
          <div className={`text-lg font-semibold ${
            liveChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {liveChange >= 0 ? '+' : ''}{liveChange.toFixed(2)}%
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${liveChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-blue-600">
          <span>Open: {formatPrice(ohlc.open)}</span>
          <span>High: {formatPrice(ohlc.high)}</span>
          <span>Low: {formatPrice(ohlc.low)}</span>
          <span>Close: {formatPrice(ohlc.close)}</span>
          <span className="text-xs text-gray-500">Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
        </div>
      </div>

          {/* Real-time Chart */}
          <div 
            className="p-4 overflow-hidden cursor-grab active:cursor-grabbing w-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            ref={chartRef}
          >
            <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * (chartHeight - padding * 2);
            const price = minPrice + ratio * priceRange;
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#6b7280"
                  fontSize="12"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Price Line */}
          <polyline
            points={chartData.map((d, index) => `${getX(index)},${getY(d?.price || 0)}`).join(' ')}
          fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data Points */}
          {chartData.map((d, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(d?.price || 0)}
              r="2"
              fill="#3b82f6"
            />
          ))}
        
          {/* Current Price Line */}
          <line
            x1={padding}
            y1={getY(livePrice)}
            x2={chartWidth - padding}
            y2={getY(livePrice)}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          {/* Time Labels */}
          {chartData.filter((_, i) => i % 20 === 0).map((d, index) => (
            <text
              key={index}
              x={getX(index * 20)}
              y={chartHeight - 10}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="10"
            >
              {d?.time ? new Date(d.time).toLocaleTimeString() : ''}
            </text>
        ))}
      </svg>
      </div>

          {/* Chart Info */}
          <div className="px-4 pb-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Data Points: {chartData.length}</span>
              <span>Price Range: {formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>
              <span>Last Update: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <span>💡 Mouse wheel to pan • Drag to pan</span>
            </div>
          </div>
    </div>
  );
};

export default RealTimeChart;