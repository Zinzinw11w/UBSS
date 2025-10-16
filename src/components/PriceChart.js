import React from 'react';

const PriceChart = ({ data, isPositive = false, width = 80, height = 30 }) => {
  // Generate sample data if none provided
  const chartData = data || [3, 5, 2, 4, 6, 3, 2, 4, 5, 2, 1, 3, 2, 1, 2, 1];
  
  const maxValue = Math.max(...chartData);
  const minValue = Math.min(...chartData);
  const range = maxValue - minValue;
  
  // Create SVG path with more natural curves
  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' L');
  
  const pathData = `M ${points}`;
  
  // Use teal for positive trends, red for negative
  const strokeColor = isPositive ? "#14B8A6" : "#EF4444";
  
  return (
    <div className="flex items-center justify-center">
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default PriceChart;
