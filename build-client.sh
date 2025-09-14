#!/bin/bash
echo "🧹 Cleaning dependencies..."
npm ci

echo "🏗️  Building with vite.client.config.ts..."
vite build --config vite.client.config.ts

echo "📁 Contents of dist directory:"
ls -la dist