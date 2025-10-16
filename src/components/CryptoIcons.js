import React from 'react';

const CryptoIcon = ({ symbol, className = "w-8 h-8" }) => {
  const icons = {
    'BTC': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#F7931A"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="white"/>
      </svg>
    ),
    'ETH': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#627EEA"/>
        <path d="M12 2l3.09 6.26L12 8.5l-3.09-.24L12 2zM8.5 12l3.5 1.5L8.5 15l-3.5-1.5L8.5 12zM12 15.5l3.5-1.5L12 15l-3.5 1.5L12 15.5z" fill="white"/>
      </svg>
    ),
    'LTC': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#BFBBBB"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-1.5-1.5L10.5 13H7v-2h3.5l-2-2L8 7.5 12 11.5l-2 5.5z" fill="white"/>
      </svg>
    ),
    'DOT': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#E6007A"/>
        <circle cx="12" cy="12" r="3" fill="white"/>
        <circle cx="6" cy="12" r="1.5" fill="white"/>
        <circle cx="18" cy="12" r="1.5" fill="white"/>
        <circle cx="12" cy="6" r="1.5" fill="white"/>
        <circle cx="12" cy="18" r="1.5" fill="white"/>
      </svg>
    ),
    'FIL': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#0090FF"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'DOGE': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#C2A633"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" fill="white"/>
      </svg>
    ),
    'XRP': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#23292F"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M8 12l4-4 4 4-4 4-4-4z" fill="white"/>
      </svg>
    ),
    'TRX': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#FF060A"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'MATIC': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#8247E5"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'ADA': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#0033AD"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'LINK': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#2A5ADA"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    ),
    'ATOM': (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#2E3148"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
        <path d="M12 6l-3 6h6l-3-6z" fill="white"/>
      </svg>
    )
  };

  return icons[symbol] || (
    <div className={`${className} bg-gray-300 rounded-full flex items-center justify-center`}>
      <span className="text-gray-600 text-xs font-bold">?</span>
    </div>
  );
};

export default CryptoIcon;


