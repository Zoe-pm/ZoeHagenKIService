#!/bin/bash
# Emergency deployment script to fix NODE_ENV issue
echo "🚀 Starting emergency deployment..."
export NODE_ENV=production
echo "✅ NODE_ENV set to production"
npm run build
echo "✅ Build completed"
echo "🎉 Ready for publishing!"