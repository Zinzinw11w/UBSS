# UBSS Cloud Functions Deployment Guide

This guide explains how to deploy the automated Smart Trading Plan system using Google Cloud Functions and Cloud Scheduler.

## Prerequisites

1. **Firebase CLI**: Install Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Google Cloud Project**: Ensure you have access to the Firebase project `ubss-9f4a1`

3. **Authentication**: Login to Firebase
   ```bash
   firebase login
   ```

## Deployment Steps

### 1. Deploy Cloud Functions

Run the deployment script:
```bash
./deploy-functions.sh
```

Or manually:
```bash
# Install dependencies
cd functions
npm install
cd ..

# Deploy functions
firebase deploy --only functions

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

### 2. Set Up Cloud Scheduler

After deploying the functions, you need to set up Cloud Scheduler to trigger the function every 5 minutes:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Cloud Scheduler**
3. Click **Create Job**
4. Configure the job:
   - **Name**: `process-completed-plans`
   - **Frequency**: `*/5 * * * *` (every 5 minutes)
   - **Target**: HTTP
   - **URL**: `https://us-central1-ubss-9f4a1.cloudfunctions.net/processCompletedPlans`
   - **HTTP Method**: POST
   - **Headers**: `Content-Type: application/json`

### 3. Test the System

#### Manual Testing
You can manually trigger the function using the HTTP endpoint:
```bash
curl -X POST https://us-central1-ubss-9f4a1.cloudfunctions.net/manualProcessPlans
```

#### Check Function Logs
```bash
firebase functions:log
```

#### Get Plan Statistics
```bash
curl https://us-central1-ubss-9f4a1.cloudfunctions.net/getPlanStats
```

## Function Details

### `processCompletedPlans`
- **Trigger**: Cloud Scheduler (every 5 minutes)
- **Purpose**: Automatically processes expired trading plans
- **Actions**:
  - Queries all active trading plans
  - Checks if plans have expired
  - Calculates random profit within yield range
  - Updates user balance with investment + profit
  - Marks plans as completed

### `manualProcessPlans`
- **Trigger**: HTTP request
- **Purpose**: Manual testing and debugging
- **Usage**: `POST /manualProcessPlans`

### `getPlanStats`
- **Trigger**: HTTP request
- **Purpose**: Get statistics about trading plans
- **Usage**: `GET /getPlanStats`

## Database Schema

### `trading_plans` Collection
```javascript
{
  userId: string,           // User ID who created the plan
  investmentAmount: number, // Amount invested
  assetSymbol: string,      // Asset being traded (e.g., 'AAPL')
  status: string,           // 'active' or 'completed'
  createdAt: timestamp,     // When plan was created
  durationHours: number,    // Plan duration in hours
  yieldRange: [number, number], // Min and max yield percentage
  completedAt: timestamp,   // When plan was completed (if completed)
  profitAmount: number,     // Calculated profit (if completed)
  totalReturn: number,      // Investment + profit (if completed)
  finalYield: number        // Actual yield achieved (if completed)
}
```

## Monitoring and Maintenance

### View Function Logs
```bash
firebase functions:log --only processCompletedPlans
```

### Monitor Function Performance
- Go to [Google Cloud Console > Cloud Functions](https://console.cloud.google.com/functions)
- Check metrics, errors, and execution times

### Update Functions
To update the functions after making changes:
```bash
firebase deploy --only functions
```

## Troubleshooting

### Common Issues

1. **Function not triggering**: Check Cloud Scheduler configuration
2. **Permission errors**: Verify Firestore rules are deployed
3. **Timeout errors**: Check function timeout settings
4. **Balance not updating**: Verify user document exists and has correct structure

### Debug Steps

1. Check function logs: `firebase functions:log`
2. Test manually: `curl -X POST [function-url]`
3. Verify Firestore data structure
4. Check Cloud Scheduler job status

## Security Considerations

- Functions run with admin privileges
- Firestore rules control data access
- Rate limiting prevents abuse
- All operations use Firestore transactions for data integrity

## Cost Optimization

- Function runs every 5 minutes (288 times per day)
- Each execution is lightweight
- Consider adjusting frequency based on usage
- Monitor Cloud Function usage in Google Cloud Console

