import React from 'react';

const SparklineChart = ({ data, isPositive, width = 60, height = 20 }) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className={`w-${width/4} h-${height/4} rounded ${
          isPositive ? 'bg-green-100' : 'bg-red-100'
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className={`w-full h-full rounded ${
          isPositive ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </div>
    );
  }

  // Find min and max values for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = isPositive ? '#10B981' : '#EF4444'; // green-500 or red-500

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Add area fill for better visual effect */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
        />
      </svg>
    </div>
  );
};

export default SparklineChart;
