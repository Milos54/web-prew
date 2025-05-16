#!/usr/bin/env node

const os = require('os');
const { exec } = require('child_process');
const qrcode = require('qrcode-terminal');

const PORT = 5173; // Customize if needed
const DEV_COMMAND = 'vite --host';

// ✅ Function to get your local IPv4 address
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

// 🚀 Main launcher
const ip = getLocalIP();

if (!ip) {
  console.error(
    "❌ Could not detect local IP. Make sure you're connected to a network.",
  );
  process.exit(1);
}

const url = `http://${ip}:${PORT}`;

console.log('\n🔗 Local server link for mobile access:');
console.log(`📱 ${url}\n`);

console.log('📷 Scan the QR code below to open the site on your phone:');
qrcode.generate(url, { small: true });

console.log('\n🚀 Starting the dev server... (running: ' + DEV_COMMAND + ')');

const dev = exec(DEV_COMMAND);
dev.stdout.pipe(process.stdout);
dev.stderr.pipe(process.stderr);
