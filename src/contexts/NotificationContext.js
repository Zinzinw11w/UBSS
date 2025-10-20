import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import { useWallet } from './WalletContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useDatabase();
  const { isConnected } = useWallet();

  // Listen for deposit status changes
  useEffect(() => {
    if (!user?.id || !isConnected) return;

    let unsubscribeDeposits = null;

    try {
      // Subscribe to user deposits for status changes
      const { collection, query, where, onSnapshot, orderBy } = require('firebase/firestore');
      const { db } = require('../config/firebase');
      
      const depositsRef = collection(db, 'deposits');
      const q = query(
        depositsRef,
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );

      unsubscribeDeposits = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const deposit = { id: change.doc.id, ...change.doc.data() };
            if (deposit.status === 'pending') {
              addNotification({
                id: `deposit-pending-${deposit.id}`,
                type: 'deposit',
                title: 'Deposit Submitted',
                message: `Your deposit of $${deposit.amount} has been submitted and is pending approval.`,
                status: 'pending',
                timestamp: deposit.createdAt,
                read: false
              });
            }
          } else if (change.type === 'modified') {
            const deposit = { id: change.doc.id, ...change.doc.data() };
            const oldDeposit = change.doc.metadata.fromCache ? null : change.doc.data();
            
            // Check if status changed from pending to approved
            if (oldDeposit?.status === 'pending' && deposit.status === 'approved') {
              addNotification({
                id: `deposit-approved-${deposit.id}`,
                type: 'deposit',
                title: 'Deposit Approved',
                message: `Your deposit of $${deposit.amount} has been approved and added to your balance.`,
                status: 'approved',
                timestamp: deposit.approvedAt,
                read: false
              });
            }
            // Check if status changed from pending to rejected
            else if (oldDeposit?.status === 'pending' && deposit.status === 'rejected') {
              addNotification({
                id: `deposit-rejected-${deposit.id}`,
                type: 'deposit',
                title: 'Deposit Rejected',
                message: `Your deposit of $${deposit.amount} was rejected. Reason: ${deposit.rejectionReason || 'No reason provided'}`,
                status: 'rejected',
                timestamp: deposit.rejectedAt,
                read: false
              });
            }
          }
        });
      });
    } catch (error) {
      console.error('Error setting up deposit notifications:', error);
    }

    return () => {
      if (unsubscribeDeposits) unsubscribeDeposits();
    };
  }, [user?.id, isConnected]);

  const addNotification = (notification) => {
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      const newNotifications = [notification, ...prev].slice(0, 50); // Keep only last 50
      setUnreadCount(prev => prev + 1);
      return newNotifications;
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

