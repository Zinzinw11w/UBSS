import React from 'react';

const SparklineChart = ({ data, isPositive, width = 60, height = 20 }) => {
  console.log('📊 [SparklineChart] Rendering with data:', { data, dataLength: data?.length, isPositive, width, height });
  
  // Special debugging for MATIC data
  if (data && data.length > 0 && data[0] && typeof data[0] === 'number' && data[0] > 0 && data[0] < 1) {
    console.log('🎯 [MATIC Chart Debug] Detected MATIC-like data:', {
      data,
      dataLength: data.length,
      firstValue: data[0],
      lastValue: data[data.length - 1],
      minValue: Math.min(...data),
      maxValue: Math.max(...data)
    });
  }
  
  if (!data || data.length < 2) {
    console.log('📊 [SparklineChart] Insufficient data, showing fallback');
    return (
      <div 
        className={`rounded ${
          isPositive ? 'bg-green-100' : 'bg-red-100'
        }`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className={`rounded ${
            isPositive ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{
            width: `${width * 0.6}px`,
            height: `${height * 0.6}px`
          }}
        ></div>
      </div>
    );
  }

  // Find min and max values for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;
  
  // Ensure we have valid data for rendering
  if (minValue === maxValue) {
    console.log('📊 [SparklineChart] All data points are the same, adjusting range');
    const adjustedMin = minValue * 0.99;
    const adjustedMax = maxValue * 1.01;
    const adjustedRange = adjustedMax - adjustedMin;
    
    const adjustedPoints = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - adjustedMin) / adjustedRange) * height;
      return `${x},${y}`;
    }).join(' ');
    
    const color = isPositive ? '#10B981' : '#EF4444';
    
    console.log('📊 [SparklineChart] Rendering adjusted chart with:', {
      points: adjustedPoints,
      width,
      height,
      adjustedMin,
      adjustedMax,
      adjustedRange,
      color,
      dataLength: data.length
    });
    
    return (
      <div 
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          display: 'block',
          overflow: 'visible'
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{
            display: 'block',
            overflow: 'visible'
          }}
        >
          <polygon
            points={`0,${height} ${adjustedPoints} ${width},${height}`}
            fill={isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
          />
          <polyline
            points={adjustedPoints}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = isPositive ? '#10B981' : '#EF4444'; // green-500 or red-500
  
  console.log('📊 [SparklineChart] Rendering chart with:', {
    points,
    width,
    height,
    minValue,
    maxValue,
    range,
    color,
    dataLength: data.length
  });

  return (
    <div 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        display: 'block',
        overflow: 'visible'
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: 'block',
          overflow: 'visible'
        }}
      >
        {/* Add area fill for better visual effect */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default SparklineChart;
