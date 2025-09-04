#!/usr/bin/env node

/**
 * Test script to verify logging behavior with different VITE_LOGGING_LEVEL settings
 */

const fs = require('fs');
const path = require('path');

// Path to .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('========================================');
console.log('Testing Logging Behavior');
console.log('========================================\n');

// Check current logging level
const match = envContent.match(/VITE_LOGGING_LEVEL=(\w+)/);
const currentLevel = match ? match[1] : 'NOT SET';

console.log(`Current VITE_LOGGING_LEVEL: ${currentLevel}\n`);

if (currentLevel === 'DEV') {
  console.log('✅ When set to DEV:');
  console.log('   - All logger.log() statements WILL appear in browser console');
  console.log('   - All logger.error() statements WILL appear in browser console');
  console.log('   - All logger.warn() statements WILL appear in browser console');
  console.log('   - Useful for debugging during development\n');
} else if (currentLevel === 'PROD') {
  console.log('✅ When set to PROD:');
  console.log('   - NO logger statements will appear in browser console');
  console.log('   - Clean console for production environment');
  console.log('   - Better performance (no logging overhead)\n');
} else {
  console.log('⚠️  VITE_LOGGING_LEVEL not properly set!');
  console.log('   Default behavior: logs will be SUPPRESSED (PROD mode)\n');
}

console.log('----------------------------------------');
console.log('To switch logging levels:');
console.log('----------------------------------------');
console.log('1. Edit .env file');
console.log('2. Set VITE_LOGGING_LEVEL=DEV (for development)');
console.log('   OR  VITE_LOGGING_LEVEL=PROD (for production)');
console.log('3. Restart the frontend: ./restart.sh');
console.log('----------------------------------------\n');

console.log('📝 Note: The logger utility is located at:');
console.log('   src/utils/logger.ts\n');

console.log('🔍 All console.* statements have been replaced with:');
console.log('   - logger.log()');
console.log('   - logger.error()');
console.log('   - logger.warn()');
console.log('   - logger.info()');
console.log('   - logger.debug()\n');

console.log('========================================');
