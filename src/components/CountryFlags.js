import React from 'react';

const CountryFlag = ({ countryCode }) => {
  const flags = {
    'US': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#B22234"/>
        <rect width="24" height="1.23" fill="#FFFFFF"/>
        <rect y="2.46" width="24" height="1.23" fill="#FFFFFF"/>
        <rect y="4.92" width="24" height="1.23" fill="#FFFFFF"/>
        <rect y="7.38" width="24" height="1.23" fill="#FFFFFF"/>
        <rect y="9.84" width="24" height="1.23" fill="#FFFFFF"/>
        <rect y="12.3" width="24" height="1.23" fill="#FFFFFF"/>
        <rect y="14.76" width="24" height="1.23" fill="#FFFFFF"/>
        <rect width="9.6" height="8.61" fill="#3C3B6E"/>
        <g fill="#FFFFFF">
          <circle cx="1.2" cy="1" r="0.2"/>
          <circle cx="2.4" cy="1" r="0.2"/>
          <circle cx="3.6" cy="1" r="0.2"/>
          <circle cx="4.8" cy="1" r="0.2"/>
          <circle cx="6" cy="1" r="0.2"/>
          <circle cx="7.2" cy="1" r="0.2"/>
          <circle cx="8.4" cy="1" r="0.2"/>
        </g>
      </svg>
    ),
    'CH': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#FF0000"/>
        <rect x="10" y="2" width="4" height="12" fill="#FFFFFF"/>
        <rect x="2" y="6" width="20" height="4" fill="#FFFFFF"/>
      </svg>
    ),
    'HK': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#DE2910"/>
        <g fill="#FFFFFF">
          <path d="M12 4c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
          <path d="M8 6c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M16 6c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M6 8c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M18 8c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M8 10c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M16 10c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M12 12c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
        </g>
      </svg>
    ),
    'SG': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="8" fill="#ED2939"/>
        <rect y="8" width="24" height="8" fill="#FFFFFF"/>
        <g fill="#FFFFFF">
          <circle cx="4" cy="3" r="1"/>
          <circle cx="6" cy="2" r="0.5"/>
          <circle cx="8" cy="2" r="0.5"/>
          <circle cx="10" cy="2" r="0.5"/>
          <circle cx="12" cy="2" r="0.5"/>
          <circle cx="14" cy="2" r="0.5"/>
        </g>
      </svg>
    ),
    'GB': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#012169"/>
        <g fill="#FFFFFF">
          <path d="M0 0l24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="1"/>
          <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="0.5"/>
          <rect x="10" y="0" width="4" height="16" fill="#FFFFFF"/>
          <rect x="0" y="6" width="24" height="4" fill="#FFFFFF"/>
          <rect x="11" y="0" width="2" height="16" fill="#C8102E"/>
          <rect x="0" y="7" width="24" height="2" fill="#C8102E"/>
        </g>
      </svg>
    ),
    'CN': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#DE2910"/>
        <g fill="#FFDE00">
          {/* Large star */}
          <path d="M4 4c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          {/* Four smaller stars */}
          <path d="M7 2c0-0.3 0.3-0.6 0.6-0.6s0.6 0.3 0.6 0.6-0.3 0.6-0.6 0.6-0.6-0.3-0.6-0.6z"/>
          <path d="M9 3c0-0.3 0.3-0.6 0.6-0.6s0.6 0.3 0.6 0.6-0.3 0.6-0.6 0.6-0.6-0.3-0.6-0.6z"/>
          <path d="M9 5c0-0.3 0.3-0.6 0.6-0.6s0.6 0.3 0.6 0.6-0.3 0.6-0.6 0.6-0.6-0.3-0.6-0.6z"/>
          <path d="M7 6c0-0.3 0.3-0.6 0.6-0.6s0.6 0.3 0.6 0.6-0.3 0.6-0.6 0.6-0.6-0.3-0.6-0.6z"/>
        </g>
      </svg>
    ),
    'JP': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#FFFFFF"/>
        <circle cx="12" cy="8" r="3" fill="#BC002D"/>
      </svg>
    ),
    'EU': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#003399"/>
        <g fill="#FFCC00">
          <circle cx="12" cy="8" r="1"/>
          <circle cx="8" cy="6" r="0.5"/>
          <circle cx="16" cy="6" r="0.5"/>
          <circle cx="8" cy="10" r="0.5"/>
          <circle cx="16" cy="10" r="0.5"/>
          <circle cx="6" cy="8" r="0.5"/>
          <circle cx="18" cy="8" r="0.5"/>
          <circle cx="10" cy="4" r="0.5"/>
          <circle cx="14" cy="4" r="0.5"/>
          <circle cx="10" cy="12" r="0.5"/>
          <circle cx="14" cy="12" r="0.5"/>
          <circle cx="4" cy="8" r="0.5"/>
          <circle cx="20" cy="8" r="0.5"/>
        </g>
      </svg>
    ),
    'AU': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#00008B"/>
        <g fill="#FFFFFF">
          <path d="M6 4c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M18 4c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M6 12c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M18 12c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M12 8c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
        </g>
      </svg>
    ),
    'CA': (
      <svg viewBox="0 0 24 16" className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
        <rect width="24" height="16" fill="#FF0000"/>
        <rect x="8" y="0" width="8" height="16" fill="#FFFFFF"/>
        <g fill="#FF0000">
          <path d="M12 4c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
          <path d="M10 6c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M14 6c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M8 8c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M16 8c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z"/>
          <path d="M12 12c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
        </g>
      </svg>
    )
  };

  return flags[countryCode] || (
    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold border border-gray-200">
      ?
    </div>
  );
};

export default CountryFlag;


