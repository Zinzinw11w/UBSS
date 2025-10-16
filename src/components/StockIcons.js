import React from 'react';

const StockIcon = ({ symbol, className = "w-8 h-8" }) => {
  const icons = {
    'AAPL': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#000000"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'AMZN': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#FF9900"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'GOOGL': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#4285F4"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'TSLA': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#E31937"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'MSFT': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#00BCF2"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'NVDA': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#76B900"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'META': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#1877F2"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'UNH': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#1E3A8A"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'AI': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#8B5CF6"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'BRZE': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#059669"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'FLNC': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#DC2626"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'SNOW': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#0EA5E9"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'BB': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#000000"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'EVGO': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#10B981"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'MQ': (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#F59E0B"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
  };

  return icons[symbol] || (
    <div className={`${className} bg-gray-300 rounded-full flex items-center justify-center`}>
      <span className="text-gray-600 text-xs font-bold">?</span>
    </div>
  );
};

export default StockIcon;
