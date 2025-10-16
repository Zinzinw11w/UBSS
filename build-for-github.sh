#!/bin/bash

# Build the React app
npm run build

# Copy .nojekyll and 404.html to build directory
cp .nojekyll build/ 2>/dev/null || echo "" > build/.nojekyll
cp 404.html build/ 2>/dev/null || echo "404.html not found, skipping"

echo "Build completed with GitHub Pages configuration"
