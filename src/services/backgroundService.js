import * as database from './database';

class BackgroundService {
  constructor() {
    this.intervals = [];
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    console.log('Starting background service...');
    this.isRunning = true;

    // Process completed trading plans every 5 minutes
    this.intervals.push(
      setInterval(async () => {
        try {
          await database.processCompletedTradingPlans();
        } catch (error) {
          console.error('Error in processCompletedTradingPlans interval:', error);
        }
      }, 5 * 60 * 1000) // 5 minutes
    );

    // Process completed orders every 5 minutes (legacy)
    this.intervals.push(
      setInterval(async () => {
        try {
          await database.processCompletedOrders();
        } catch (error) {
          console.error('Error in processCompletedOrders interval:', error);
        }
      }, 5 * 60 * 1000) // 5 minutes
    );

    // Update active trade profits every 30 seconds for testing (change to 1 hour in production)
    this.intervals.push(
      setInterval(async () => {
        try {
          await database.updateActiveTradeProfits();
        } catch (error) {
          console.error('Error in updateActiveTradeProfits interval:', error);
        }
      }, 30 * 1000) // 30 seconds for testing
    );

    // Run immediately on start
    database.processCompletedTradingPlans();
    database.processCompletedOrders();
    database.updateActiveTradeProfits();
  }

  stop() {
    console.log('Stopping background service...');
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.isRunning = false;
  }

  // Manual trigger for testing
  async processTradingPlansNow() {
    await database.processCompletedTradingPlans();
  }

  async processOrdersNow() {
    await database.processCompletedOrders();
  }

  async updateProfitsNow() {
    await database.updateActiveTradeProfits();
  }

  // For testing - complete orders immediately (useful for demo)
  async completeAllOrdersNow() {
    try {
      console.log('Manually completing all active orders...');
      
      // Get all active orders
      const { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } = require('firebase/firestore');
      const { db } = require('../config/firebase');
      
      const activeOrdersQuery = query(
        collection(db, 'trades'),
        where('status', '==', 'Active')
      );
      
      const activeOrdersSnapshot = await getDocs(activeOrdersQuery);
      
      for (const orderDoc of activeOrdersSnapshot.docs) {
        const orderData = orderDoc.data();
        const baseAmount = orderData.amount || orderData.orderAmount || 0;
        const days = parseInt(orderData.timeframe?.split(' ')[0]) || 1;
        
        // Calculate total profit based on timeframe and amount
        let totalProfitRate;
        
        if (days === 1) {
          // 1 day: (1000-9999USD) 1.5% to 1.8% profit
          if (baseAmount >= 1000 && baseAmount <= 9999) {
            totalProfitRate = Math.random() * 0.003 + 0.015; // 1.5% to 1.8%
          } else {
            totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for other amounts
          }
        } else if (days === 7) {
          // 7 Days: (10000-49999USD) 1.8% to 4.8% profit
          if (baseAmount >= 10000 && baseAmount <= 49999) {
            totalProfitRate = Math.random() * 0.03 + 0.018; // 1.8% to 4.8%
          } else {
            totalProfitRate = Math.random() * 0.02 + 0.015; // 1.5% to 3.5% for other amounts
          }
        } else if (days === 15) {
          // 15 days: (50000-199999USD) 2.10% to 2.5% profit
          if (baseAmount >= 50000 && baseAmount <= 199999) {
            totalProfitRate = Math.random() * 0.004 + 0.021; // 2.10% to 2.5%
          } else {
            totalProfitRate = Math.random() * 0.015 + 0.018; // 1.8% to 3.3% for other amounts
          }
        } else if (days === 30) {
          // 30 days: (100000-499999USD) 2.5% to 2.8% profit
          if (baseAmount >= 100000 && baseAmount <= 499999) {
            totalProfitRate = Math.random() * 0.003 + 0.025; // 2.5% to 2.8%
          } else {
            totalProfitRate = Math.random() * 0.02 + 0.02; // 2.0% to 4.0% for other amounts
          }
        } else if (days === 60) {
          // 60 days: (500000-999999USD) 2.8% to 3% profit
          if (baseAmount >= 500000 && baseAmount <= 999999) {
            totalProfitRate = Math.random() * 0.002 + 0.028; // 2.8% to 3.0%
          } else {
            totalProfitRate = Math.random() * 0.025 + 0.025; // 2.5% to 5.0% for other amounts
          }
        } else {
          totalProfitRate = Math.random() * 0.01 + 0.01; // 1.0% to 2.0% for other timeframes
        }
        
        const finalProfit = baseAmount * totalProfitRate;
        
        // Update order status
        await updateDoc(doc(db, 'trades', orderDoc.id), {
          status: 'completed',
          profit: finalProfit,
          totalReturn: baseAmount + finalProfit,
          completedAt: serverTimestamp(),
          profitRate: totalProfitRate
        });
        
        // Add profit to user balance
        if (orderData.walletAddress) {
          await database.updateUserBalance(orderData.walletAddress, finalProfit, 'profit');
        } else if (orderData.userId) {
          await database.updateUserBalance(orderData.userId, finalProfit, 'profit');
        }
        
        console.log(`Order ${orderDoc.id} completed with profit: $${finalProfit.toFixed(2)}`);
      }
      
      console.log('All orders completed manually');
    } catch (error) {
      console.error('Error completing orders manually:', error);
    }
  }
}

// Create singleton instance
const backgroundService = new BackgroundService();

export default backgroundService;
