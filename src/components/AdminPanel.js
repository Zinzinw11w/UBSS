import React, { useState, useEffect, useCallback } from 'react';
import * as database from '../services/database';
import * as chat from '../services/chat';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [trades, setTrades] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const tabs = [
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'deposits', name: 'Deposits', icon: '💰' },
    { id: 'withdrawals', name: 'Withdrawals', icon: '💸' },
    { id: 'trades', name: 'Trades', icon: '📈' },
    { id: 'chat', name: 'Live Chat', icon: '💬' }
  ];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Loading data for tab:', activeTab);
      switch (activeTab) {
        case 'users':
          const usersData = await database.getAllUsers();
          console.log('Users data:', usersData);
          setUsers(usersData);
          break;
        case 'deposits':
          const depositsData = await database.getAllDeposits();
          console.log('Deposits data:', depositsData);
          setDeposits(depositsData);
          break;
        case 'withdrawals':
          const withdrawalsData = await database.getAllWithdrawals();
          console.log('Withdrawals data:', withdrawalsData);
          setWithdrawals(withdrawalsData);
          break;
        case 'trades':
          const tradesData = await database.getAllTrades();
          console.log('Trades data:', tradesData);
          setTrades(tradesData);
          break;
        case 'chat':
          const chatData = await chat.getAllChatMessages();
          console.log('Chat data:', chatData);
          setChatMessages(chatData);
          break;
        default:
          console.log('Unknown tab:', activeTab);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [activeTab, loadData]);

  // Real-time subscription for conversations
  useEffect(() => {
    if (activeTab === 'chat') {
      console.log('=== ADMIN CHAT SUBSCRIPTION SETUP ===');
      console.log('Users data:', users);
      
      const unsubscribe = chat.subscribeToConversations((conversationList) => {
        console.log('=== ADMIN CONVERSATIONS UPDATE ===');
        console.log('Raw conversation list:', conversationList);
        
        // Enhance conversations with user data
        const enhancedConversations = conversationList.map(async (conversation) => {
          // Try to find user data from the users list
          const userData = users.find(user => user.id === conversation.userId);
          console.log(`Conversation ${conversation.userId} - Found user data:`, userData);
          
          return {
            ...conversation,
            walletAddress: userData?.walletAddress || conversation.userId,
            userData: userData
          };
        });
        
        // Wait for all user data to be resolved
        Promise.all(enhancedConversations).then(enhanced => {
          console.log('Enhanced conversations:', enhanced);
          setConversations(enhanced);
        });
      });

      return () => unsubscribe();
    }
  }, [activeTab, users]);

  // Real-time subscription for selected conversation messages
  useEffect(() => {
    if (selectedConversation) {
      console.log('=== ADMIN SELECTED CONVERSATION SUBSCRIPTION ===');
      console.log('Selected conversation:', selectedConversation);
      console.log('User ID:', selectedConversation.userId);
      
      const unsubscribe = chat.subscribeToChatMessages(selectedConversation.userId, (snapshot) => {
        console.log('=== ADMIN MESSAGES UPDATE ===');
        console.log('Snapshot docs count:', snapshot.docs.length);
        console.log('Snapshot docs:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort messages by createdAt in ascending order (oldest first) for proper chat flow
        const sortedMessages = messages.sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return timeA - timeB; // Ascending order (oldest first)
        });
        
        console.log('Processed messages (sorted):', sortedMessages);
        setChatMessages(sortedMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedConversation]);

  const handleApproveDeposit = async (depositId) => {
    try {
      await database.approveDeposit(depositId, 'admin');
      alert('Deposit approved successfully!');
      loadData();
    } catch (error) {
      alert('Error approving deposit: ' + error.message);
    }
  };

  const handleRejectDeposit = async (depositId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await database.rejectDeposit(depositId, 'admin', reason);
        alert('Deposit rejected successfully!');
        loadData();
      } catch (error) {
        alert('Error rejecting deposit: ' + error.message);
      }
    }
  };

  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      await database.approveWithdrawal(withdrawalId, 'admin');
      alert('Withdrawal approved successfully!');
      loadData();
    } catch (error) {
      alert('Error approving withdrawal: ' + error.message);
    }
  };

  const handleRejectWithdrawal = async (withdrawalId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await database.rejectWithdrawal(withdrawalId, 'admin', reason);
        alert('Withdrawal rejected successfully!');
        loadData();
      } catch (error) {
        alert('Error rejecting withdrawal: ' + error.message);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    // If it's a wallet address (starts with 0x), format it normally
    if (address.startsWith('0x')) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    // If it's a Firestore document ID, show first 6 characters
    return `${address.slice(0, 6)}...`;
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    // Mark conversation as read
    await chat.markConversationAsRead(conversation.userId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      // Use the user's Firestore document ID for sending messages
      await chat.sendAdminMessage(selectedConversation.userId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message: ' + error.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const renderUsers = () => (
    <div className="space-y-3 sm:space-y-4">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{formatAddress(user.walletAddress)}</h3>
              <p className="text-xs sm:text-sm text-gray-500">Wallet Type: {user.walletType}</p>
              <p className="text-xs sm:text-sm text-gray-500">IP: {user.ipAddress}</p>
              <p className="text-xs sm:text-sm text-gray-500">Joined: {formatDate(user.createdAt)}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-bold text-green-600">${user.balance?.toFixed(2) || '0.00'}</p>
              <p className="text-xs sm:text-sm text-gray-500">Total Deposits: ${user.totalDeposits?.toFixed(2) || '0.00'}</p>
              <p className="text-xs sm:text-sm text-gray-500">Total Profit: ${user.totalProfit?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeposits = () => (
    <div className="space-y-3 sm:space-y-4">
      {deposits.map((deposit) => (
        <div key={deposit.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{deposit.amount} {deposit.currency}</h3>
              <p className="text-xs sm:text-sm text-gray-500">User: {formatAddress(deposit.userId)}</p>
              <p className="text-xs sm:text-sm text-gray-500">TX Hash: {deposit.txHash}</p>
              <p className="text-xs sm:text-sm text-gray-500">Date: {formatDate(deposit.createdAt)}</p>
            </div>
            <div className="flex flex-col sm:items-end space-y-2">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {deposit.status}
              </span>
              {deposit.status === 'pending' && (
                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleApproveDeposit(deposit.id)}
                    className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectDeposit(deposit.id)}
                    className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded text-xs sm:text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWithdrawals = () => (
    <div className="space-y-3 sm:space-y-4">
      {withdrawals.map((withdrawal) => (
        <div key={withdrawal.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{withdrawal.amount} {withdrawal.currency}</h3>
              <p className="text-xs sm:text-sm text-gray-500">User: {formatAddress(withdrawal.userId)}</p>
              <p className="text-xs sm:text-sm text-gray-500">To: {formatAddress(withdrawal.walletAddress)}</p>
              <p className="text-xs sm:text-sm text-gray-500">Date: {formatDate(withdrawal.createdAt)}</p>
            </div>
            <div className="flex flex-col sm:items-end space-y-2">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {withdrawal.status}
              </span>
              {withdrawal.status === 'pending' && (
                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleApproveWithdrawal(withdrawal.id)}
                    className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectWithdrawal(withdrawal.id)}
                    className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded text-xs sm:text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrades = () => (
    <div className="space-y-4">
      {trades.map((trade) => (
        <div key={trade.id} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{trade.asset} - {trade.tradeType}</h3>
              <p className="text-sm text-gray-500">Amount: {trade.amount}</p>
              <p className="text-sm text-gray-500">Leverage: {trade.leverage}x</p>
              <p className="text-sm text-gray-500">Entry Price: ${trade.entryPrice?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Current Price: ${trade.currentPrice?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Date: {formatDate(trade.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                trade.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {trade.status}
              </span>
              <p className={`text-lg font-bold mt-2 ${
                trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${trade.profit?.toFixed(2) || '0.00'}
              </p>
              {trade.isSmartTrade && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Smart Trade
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChat = () => (
    <div className="flex h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Conversations</h3>
          <p className="text-sm text-gray-500">{conversations?.length || 0} active chats</p>
        </div>
        <div className="overflow-y-auto">
          {!conversations || conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.userId}
                onClick={() => handleSelectConversation(conversation)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedConversation?.userId === conversation.userId ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {formatAddress(conversation.walletAddress || conversation.userId)}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage || 'No message'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {formatAddress(selectedConversation.walletAddress || selectedConversation.userId).slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {formatAddress(selectedConversation.walletAddress || selectedConversation.userId)}
                  </h3>
                  <p className="text-sm text-gray-500">User Support</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet</p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isAdmin
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <div className={`text-xs mt-1 flex items-center justify-between ${
                        message.isAdmin ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.createdAt)}</span>
                        {message.isAutoReply && (
                          <span className="text-xs opacity-75">🤖 Auto</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSendingMessage}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSendingMessage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSendingMessage ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage users, deposits, withdrawals, and trades</p>
      </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-4 sm:mb-6">
          <div className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-3 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'deposits' && renderDeposits()}
                {activeTab === 'withdrawals' && renderWithdrawals()}
                {activeTab === 'trades' && renderTrades()}
                {activeTab === 'chat' && renderChat()}
              </>
            )}
          </div>
        </div>
      </div>
    );
};

export default AdminPanel;
