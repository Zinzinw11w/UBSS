import React from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';

const MobileTradingPlanDetail = ({ trade, onClose, onRecreate }) => {
  const { user } = useDatabase();

  if (!trade) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitColor = (profit) => {
    const numProfit = parseFloat(profit) || 0;
    return numProfit >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/account" className="flex items-center">
            <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-gray-900 font-medium">Trading Plan</span>
          </Link>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Plan Summary Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {trade.symbol || trade.asset || 'USD/CHF'}
              </h2>
              <p className="text-sm text-gray-500">
                {trade.timeframe || '15 Days'} • {trade.direction || 'Up'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
              {trade.status || 'Active'}
            </span>
          </div>

          {/* Amount and Profit */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${formatCurrency(trade.amount)}
              </div>
              <div className="text-xs text-gray-500">Amount</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getProfitColor(trade.profit)}`}>
                ${formatCurrency(trade.profit)}
              </div>
              <div className="text-xs text-gray-500">Current Profit</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: trade.progress ? `${Math.min(trade.progress, 100)}%` : '0%' 
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {trade.progress ? `${trade.progress.toFixed(1)}% Complete` : 'Starting...'}
          </div>
        </div>

        {/* Trading Details */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Trading Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Open Price:</span>
              <span className="text-sm font-medium text-gray-900">
                ${formatCurrency(trade.openPrice)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Price:</span>
              <span className="text-sm font-medium text-gray-900">
                ${formatCurrency(trade.currentPrice)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Close Price:</span>
              <span className="text-sm font-medium text-gray-900">
                {trade.closePrice ? `$${formatCurrency(trade.closePrice)}` : 'Pending'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Leverage:</span>
              <span className="text-sm font-medium text-gray-900">
                {trade.leverage ? `${trade.leverage}x` : '1x'}
              </span>
            </div>
          </div>
        </div>

        {/* Time Information */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Time Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Start Time:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(trade.startTime)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expiration Time:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(trade.endTime)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Run Time:</span>
              <span className="text-sm font-medium text-gray-900">
                {trade.runTime || 'Calculating...'}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Trading Specific Details */}
        {(trade.isSmartTrade || trade.type === 'Smart Trading') && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Trading Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily ROR:</span>
                <span className="text-sm font-medium text-gray-900">
                  {trade.dailyRor || '2.5%-3.0%'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Earnings:</span>
                <span className="text-sm font-medium text-green-600">
                  ${formatCurrency(trade.todayEarnings)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue:</span>
                <span className="text-sm font-medium text-green-600">
                  ${formatCurrency(trade.totalRevenue || trade.profit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cycle:</span>
                <span className="text-sm font-medium text-gray-900">
                  {trade.timeframe || '15 Days'}
                </span>
              </div>
            </div>
          </div>
        )}


        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRecreate}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Recreate Plan
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileTradingPlanDetail;
