#!/usr/bin/env node

/**
 * Script to get Slack channel IDs
 * This will list all channels and help you find the channel ID
 */

require('dotenv').config();
const https = require('https');

const token = process.env.SLACK_BOT_TOKEN;

if (!token) {
  console.error('❌ SLACK_BOT_TOKEN not found in .env file');
  process.exit(1);
}

console.log('🔍 Fetching Slack channels...\n');

// Get list of channels
const options = {
  hostname: 'slack.com',
  port: 443,
  path: '/api/conversations.list?limit=200',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (!response.ok) {
        console.error('❌ Error from Slack API:', response.error);
        console.log('\nPossible issues:');
        console.log('1. Token might be invalid');
        console.log('2. Bot might not have channels:read permission');
        console.log('3. Bot needs to be invited to channels first');
        return;
      }

      const channels = response.channels || [];
      
      console.log('📋 Found', channels.length, 'channels:\n');
      console.log('Channel Name                    | Channel ID       | Private | Members');
      console.log('--------------------------------|------------------|---------|--------');
      
      channels.forEach(channel => {
        const name = (channel.name || 'unnamed').padEnd(30);
        const id = channel.id.padEnd(16);
        const isPrivate = channel.is_private ? 'Yes    ' : 'No     ';
        const members = channel.num_members || 0;
        
        console.log(`${name} | ${id} | ${isPrivate} | ${members}`);
      });
      
      console.log('\n✅ To use a channel, add this to your .env file:');
      console.log('DEFAULT_CHANNEL_ID=<channel_id_from_above>');
      
      // Try to find the channel specified in DEFAULT_CHANNEL_NAME
      const targetName = process.env.DEFAULT_CHANNEL_NAME;
      if (targetName) {
        const cleanName = targetName.replace('#', '');
        const found = channels.find(c => c.name === cleanName);
        if (found) {
          console.log(`\n🎯 Found your channel "${cleanName}": ${found.id}`);
          console.log('Add this to your .env file:');
          console.log(`DEFAULT_CHANNEL_ID=${found.id}`);
        } else {
          console.log(`\n⚠️  Could not find channel "${cleanName}"`);
          console.log('Make sure the bot is added to this channel!');
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to parse response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error);
});

req.end();
