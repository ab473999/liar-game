#!/usr/bin/env node

/**
 * Test script for Slack service
 * Usage: node test-slack.js
 */

require('dotenv').config();
const slackService = require('./services/slackService');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function checkEnvironmentVariables() {
  console.log(`\n${colors.cyan}${colors.bright}=== Checking Environment Variables ===${colors.reset}`);
  
  const botToken = process.env.SLACK_BOT_TOKEN;
  const channelId = process.env.DEFAULT_CHANNEL_ID;
  const channelName = process.env.DEFAULT_CHANNEL_NAME || '#liar-game';
  
  console.log('\nSLACK_BOT_TOKEN:', botToken ? 
    `${colors.green}✓ Set${colors.reset} (${botToken.substring(0, 10)}...)` : 
    `${colors.red}✗ Not set${colors.reset}`);
  
  console.log('DEFAULT_CHANNEL_ID:', channelId ? 
    `${colors.green}✓ Set${colors.reset} (${channelId})` : 
    `${colors.red}✗ Not set${colors.reset}`);
  
  console.log('DEFAULT_CHANNEL_NAME:', `${colors.blue}${channelName}${colors.reset}`);
  
  if (!botToken || !channelId) {
    console.log(`\n${colors.red}${colors.bright}ERROR:${colors.reset} Missing required environment variables!`);
    console.log('\nTo fix this, create a .env file in the backend directory with:');
    console.log(`${colors.yellow}SLACK_BOT_TOKEN=xoxb-your-token-here`);
    console.log(`DEFAULT_CHANNEL_ID=C1234567890`);
    console.log(`DEFAULT_CHANNEL_NAME=#your-channel-name${colors.reset}`);
    console.log('\nGet these values from your Slack app configuration:');
    console.log('1. Go to https://api.slack.com/apps');
    console.log('2. Select your app (or create one)');
    console.log('3. Go to OAuth & Permissions → copy the Bot User OAuth Token');
    console.log('4. Get the channel ID by right-clicking a channel in Slack → View channel details');
    return false;
  }
  
  return true;
}

async function testSimpleMessage() {
  console.log(`\n${colors.cyan}${colors.bright}=== Testing Simple Message ===${colors.reset}`);
  
  const result = await slackService.sendMessage({
    text: '🧪 Test message from Liar Game backend',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🧪 Slack Integration Test',
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'This is a test message to verify Slack integration is working correctly.'
        },
        fields: [
          {
            type: 'mrkdwn',
            text: `*Status:*\n✅ Connected`
          },
          {
            type: 'mrkdwn',
            text: `*Timestamp:*\n${new Date().toLocaleString()}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `Test executed from: ${process.env.NODE_ENV || 'development'} environment`,
            emoji: true
          }
        ]
      }
    ]
  });
  
  if (result.success) {
    console.log(`${colors.green}✅ Test message sent successfully!${colors.reset}`);
    console.log('Response:', JSON.stringify(result.response, null, 2));
  } else {
    console.log(`${colors.red}❌ Failed to send test message${colors.reset}`);
    console.log('Error:', result.error);
  }
  
  return result.success;
}

async function testNotificationMethods() {
  console.log(`\n${colors.cyan}${colors.bright}=== Testing Notification Methods ===${colors.reset}`);
  
  // Test auth notification
  console.log('\n1. Testing Auth Success Notification...');
  const authResult = await slackService.notifyAuthSuccess({
    ip: '127.0.0.1',
    headers: { 'user-agent': 'Test Script/1.0' }
  });
  console.log(authResult.success ? 
    `${colors.green}✅ Auth notification sent${colors.reset}` : 
    `${colors.red}❌ Auth notification failed${colors.reset}`);
  
  // Test new theme notification
  console.log('\n2. Testing New Theme Notification...');
  const themeResult = await slackService.notifyNewTheme({
    id: 999,
    type: 'test_theme',
    name: 'Test Theme'
  });
  console.log(themeResult.success ? 
    `${colors.green}✅ Theme notification sent${colors.reset}` : 
    `${colors.red}❌ Theme notification failed${colors.reset}`);
  
  // Test new word notification
  console.log('\n3. Testing New Word Notification...');
  const wordResult = await slackService.notifyNewWord(
    { id: 999, word: 'TestWord' },
    'Test Theme'
  );
  console.log(wordResult.success ? 
    `${colors.green}✅ Word notification sent${colors.reset}` : 
    `${colors.red}❌ Word notification failed${colors.reset}`);
  
  // Test word edit notification
  console.log('\n4. Testing Word Edit Notification...');
  const editResult = await slackService.notifyWordEdit(
    'OldTestWord',
    'NewTestWord',
    'Test Theme'
  );
  console.log(editResult.success ? 
    `${colors.green}✅ Edit notification sent${colors.reset}` : 
    `${colors.red}❌ Edit notification failed${colors.reset}`);
  
  // Test new game notification
  console.log('\n5. Testing New Game Notification...');
  const gameResult = await slackService.notifyNewGame({
    gameId: 'TEST-123',
    playerCount: 4,
    theme: 'Test Theme',
    word: 'TestWord'
  });
  console.log(gameResult.success ? 
    `${colors.green}✅ Game notification sent${colors.reset}` : 
    `${colors.red}❌ Game notification failed${colors.reset}`);
}

async function main() {
  console.log(`${colors.bright}${colors.blue}
╔═══════════════════════════════════════╗
║     Liar Game Slack Service Test     ║
╚═══════════════════════════════════════╝
${colors.reset}`);
  
  // Check environment variables
  const envOk = await checkEnvironmentVariables();
  if (!envOk) {
    process.exit(1);
  }
  
  // Test simple message
  const messageOk = await testSimpleMessage();
  if (!messageOk) {
    console.log(`\n${colors.yellow}⚠️  Basic message test failed. Check your token and channel ID.${colors.reset}`);
    process.exit(1);
  }
  
  // Ask if user wants to test all notification methods
  console.log(`\n${colors.yellow}Would you like to test all notification methods?${colors.reset}`);
  console.log('This will send 5 test notifications to your Slack channel.');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test all notification methods
  await testNotificationMethods();
  
  console.log(`\n${colors.green}${colors.bright}✅ All tests completed!${colors.reset}`);
  console.log('\nIf messages were sent successfully, check your Slack channel.');
  console.log('If not, verify your Slack app has the necessary permissions:');
  console.log('- chat:write');
  console.log('- chat:write.public (if posting to public channels)');
}

// Run the test
main().catch(error => {
  console.error(`${colors.red}${colors.bright}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
