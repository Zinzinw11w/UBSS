#!/bin/bash

# UBSS Cloud Functions Deployment Script
echo "🚀 Deploying UBSS Cloud Functions..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

# Install dependencies
echo "📦 Installing function dependencies..."
cd functions
npm install
cd ..

# Deploy functions
echo "🔥 Deploying Cloud Functions..."
firebase deploy --only functions

# Deploy Firestore rules and indexes
echo "📋 Deploying Firestore rules and indexes..."
firebase deploy --only firestore:rules,firestore:indexes

echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up Cloud Scheduler to trigger the function every 5 minutes"
echo "2. Test the function using the manual trigger endpoint"
echo "3. Monitor function logs: firebase functions:log"


