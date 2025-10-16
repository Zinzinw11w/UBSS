import React from 'react';

const SmartTradingFAQModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'What is Smart Trading?',
      a: 'Smart Trading automates strategy execution with predefined rules for risk and returns.'
    },
    {
      q: 'How is yield generated?',
      a: 'Yield comes from market-making, arbitrage, and short-term momentum strategies.'
    },
    {
      q: 'Is my principal guaranteed?',
      a: 'No. Strategies target capital preservation but returns are not guaranteed.'
    },
    {
      q: 'Can I withdraw anytime?',
      a: 'You can stop a plan at the end of its current cycle and withdraw available funds.'
    },
    {
      q: 'Minimum amount required?',
      a: 'The minimum amount depends on the timeframe; typically it starts from 1,000 USD.'
    },
    {
      q: 'How often does it trade?',
      a: 'Frequency varies by market conditions and chosen timeframe; risk controls throttle activity.'
    },
    {
      q: 'What fees apply?',
      a: 'No management fee for basic plans; spreads and execution costs are embedded.'
    },
    {
      q: 'Can I change the plan later?',
      a: 'You can adjust amount and timeframe between cycles; edits mid-cycle are limited.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Smart Trading FAQs</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="font-medium text-gray-900">{item.q}</div>
              <div className="text-gray-700 mt-1">{item.a}</div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTradingFAQModal;



