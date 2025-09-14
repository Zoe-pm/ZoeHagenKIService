#!/bin/bash

echo "🚀 Starting Client-Only Development Setup (ohne SSR)"

# Start API server on port 3001
echo "📡 Starting API server on port 3001..."
NODE_ENV=development tsx server/api.ts &
API_PID=$!

# Wait a moment for API server to start
sleep 2

# Start Vite dev server on port 5173
echo "⚡ Starting Vite dev server on port 5173..."
vite dev --port 5173 --host 0.0.0.0 &
VITE_PID=$!

echo "✅ Setup complete!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 API Server: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for any process to exit
wait $API_PID $VITE_PID