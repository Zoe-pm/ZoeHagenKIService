import { spawn } from 'child_process';

console.log('🚀 Starting Client-Only Development (ohne SSR)');

// Start API server
console.log('📡 Starting API server on port 3001...');
const apiServer = spawn('tsx', ['server/api.ts'], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit'
});

// Wait a moment
await new Promise(resolve => setTimeout(resolve, 2000));

// Start Vite dev server
console.log('⚡ Starting Vite dev server on port 5173...');
const viteServer = spawn('vite', ['dev', '--port', '5173', '--host', '0.0.0.0', '--config', 'vite.client.config.ts'], {
  stdio: 'inherit'
});

console.log('✅ Setup complete!');
console.log('📱 Frontend: http://localhost:5173');
console.log('🔌 API Server: http://localhost:3001/api');

// Handle cleanup
process.on('SIGTERM', () => {
  apiServer.kill();
  viteServer.kill();
});

process.on('SIGINT', () => {
  apiServer.kill();
  viteServer.kill();
  process.exit(0);
});