const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function to process completed trading plans
 * This function runs on a schedule to check for expired plans and complete them
 */
exports.processCompletedPlans = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    console.log('Starting processCompletedPlans function...');
    
    try {
      // Query for all active trading plans
      const activePlansQuery = db.collection('trading_plans')
        .where('status', '==', 'active');
      
      const activePlansSnapshot = await activePlansQuery.get();
      
      if (activePlansSnapshot.empty) {
        console.log('No active trading plans found');
        return null;
      }
      
      console.log(`Found ${activePlansSnapshot.size} active trading plans`);
      
      const currentTime = admin.firestore.Timestamp.now();
      const completedPlans = [];
      
      // Process each active plan
      for (const planDoc of activePlansSnapshot.docs) {
        const planData = planDoc.data();
        const planId = planDoc.id;
        
        console.log(`Processing plan ${planId}:`, {
          createdAt: planData.createdAt,
          durationHours: planData.durationHours,
          status: planData.status
        });
        
        // Check if plan has expired
        const planCreatedAt = planData.createdAt;
        const expirationTime = new admin.firestore.Timestamp(
          planCreatedAt.seconds + (planData.durationHours * 3600),
          planCreatedAt.nanoseconds
        );
        
        if (currentTime.toMillis() >= expirationTime.toMillis()) {
          console.log(`Plan ${planId} has expired, processing completion...`);
          
          try {
            // Use Firestore transaction to ensure data integrity
            await db.runTransaction(async (transaction) => {
              // Get user document
              const userRef = db.collection('users').doc(planData.userId);
              const userDoc = await transaction.get(userRef);
              
              if (!userDoc.exists) {
                throw new Error(`User ${planData.userId} not found`);
              }
              
              const userData = userDoc.data();
              
              // Calculate random yield between yieldRange values
              const yieldRange = planData.yieldRange || [1.5, 3.0];
              const randomYield = Math.random() * (yieldRange[1] - yieldRange[0]) + yieldRange[0];
              
              // Calculate profit
              const profit = planData.investmentAmount * (randomYield / 100);
              const totalReturn = planData.investmentAmount + profit;
              
              console.log(`Plan ${planId} calculations:`, {
                investmentAmount: planData.investmentAmount,
                yield: randomYield,
                profit: profit,
                totalReturn: totalReturn
              });
              
              // Update user's balance (add investment + profit)
              transaction.update(userRef, {
                balance: admin.firestore.FieldValue.increment(totalReturn),
                totalProfit: admin.firestore.FieldValue.increment(profit),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
              });
              
              // Update plan status to completed
              const planRef = db.collection('trading_plans').doc(planId);
              transaction.update(planRef, {
                status: 'completed',
                completedAt: admin.firestore.FieldValue.serverTimestamp(),
                profitAmount: profit,
                totalReturn: totalReturn,
                finalYield: randomYield
              });
              
              completedPlans.push({
                planId,
                userId: planData.userId,
                assetSymbol: planData.assetSymbol,
                investmentAmount: planData.investmentAmount,
                profit: profit,
                totalReturn: totalReturn,
                yield: randomYield
              });
            });
            
            console.log(`Successfully completed plan ${planId}`);
            
          } catch (error) {
            console.error(`Error processing plan ${planId}:`, error);
            // Continue with other plans even if one fails
          }
        } else {
          console.log(`Plan ${planId} is still active (expires in ${Math.round((expirationTime.toMillis() - currentTime.toMillis()) / 1000 / 60)} minutes)`);
        }
      }
      
      console.log(`Processed ${completedPlans.length} completed plans:`, completedPlans);
      
      return {
        message: `Processed ${activePlansSnapshot.size} active plans, completed ${completedPlans.length} plans`,
        completedPlans: completedPlans
      };
      
    } catch (error) {
      console.error('Error in processCompletedPlans function:', error);
      throw error;
    }
  });

/**
 * HTTP function to manually trigger plan processing (for testing)
 */
exports.manualProcessPlans = functions.https.onRequest(async (req, res) => {
  try {
    console.log('Manual trigger of processCompletedPlans...');
    
    // Call the same logic as the scheduled function
    const result = await exports.processCompletedPlans.run();
    
    res.status(200).json({
      success: true,
      message: 'Plans processed successfully',
      result: result
    });
    
  } catch (error) {
    console.error('Error in manual process:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * HTTP function to get plan statistics
 */
exports.getPlanStats = functions.https.onRequest(async (req, res) => {
  try {
    const activePlansQuery = db.collection('trading_plans')
      .where('status', '==', 'active');
    
    const completedPlansQuery = db.collection('trading_plans')
      .where('status', '==', 'completed');
    
    const [activeSnapshot, completedSnapshot] = await Promise.all([
      activePlansQuery.get(),
      completedPlansQuery.get()
    ]);
    
    const stats = {
      activePlans: activeSnapshot.size,
      completedPlans: completedSnapshot.size,
      totalPlans: activeSnapshot.size + completedSnapshot.size
    };
    
    res.status(200).json({
      success: true,
      stats: stats
    });
    
  } catch (error) {
    console.error('Error getting plan stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

