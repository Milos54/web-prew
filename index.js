#!/usr/bin/env node
const os = require('os');
const { spawn } = require('child_process');
const qrcode = require('qrcode-terminal');

// Configuration
const WEB_PORT = 4200; // Angular default port
const DEV_COMMAND = 'npx';
const DEV_ARGS = ['ng', 'serve', '-c', 'development', '--host', '0.0.0.0'];

// Function to get your local IPv4 address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return null;
}

// Main launcher
const ip = getLocalIP();
if (!ip) {
  console.error(
    "❌ Could not detect local IP. Make sure you're connected to a network.",
  );
  process.exit(1);
}

// Prepare URLs
const webUrl = `http://${ip}:${WEB_PORT}`;

// Show info and QR code
console.log('\n🔗 Local server link for mobile access:');
console.log(`📱 Angular App: ${webUrl}\n`);

console.log('📷 Scan the QR code below to open the web app on your phone:');
qrcode.generate(webUrl, { small: true });

console.log('\n🚀 Starting the Angular dev server...');
console.log(`Running: ${DEV_COMMAND} ${DEV_ARGS.join(' ')}\n`);

// Launch the development server
const dev = spawn(DEV_COMMAND, DEV_ARGS, {
  stdio: 'inherit',
  shell: true, // Use shell on Windows for better command compatibility
});

// Handle process events
dev.on('error', (err) => {
  console.error(`❌ Failed to start development server: ${err}`);
  process.exit(1);
});

dev.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Development server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle termination signals to properly shut down the child process
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  dev.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  dev.kill('SIGTERM');
});
