const express = require('express');
const router = express.Router();
const slackService = require('../services/slackService');

/**
 * POST /api/test/slack
 * Test Slack integration by sending a test message
 * Body parameters (optional):
 * - message: string - Custom message to send
 * - channel: string - Channel ID to send to (uses default if not provided)
 */
router.post('/slack', async (req, res) => {
  try {
    const { message = 'Test message from API', channel } = req.body;
    
    // Check if Slack is configured
    if (!slackService.enabled) {
      return res.status(503).json({
        success: false,
        error: 'Slack service not configured',
        details: 'Missing SLACK_BOT_TOKEN or DEFAULT_CHANNEL_ID environment variables'
      });
    }
    
    // Send test message
    const result = await slackService.sendMessage({
      text: message,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🧪 API Test Message',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:* ${message}`
          },
          fields: [
            {
              type: 'mrkdwn',
              text: `*Source:*\nAPI Test Endpoint`
            },
            {
              type: 'mrkdwn',
              text: `*Timestamp:*\n${new Date().toLocaleString()}`
            }
          ]
        }
      ],
      channel
    });
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test message sent to Slack',
        details: {
          channel: channel || slackService.defaultChannelId,
          timestamp: result.response.ts
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send message to Slack',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Error in Slack test endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/test/slack/status
 * Check Slack service configuration status
 */
router.get('/slack/status', (req, res) => {
  res.json({
    success: true,
    enabled: slackService.enabled,
    configuration: {
      hasToken: !!process.env.SLACK_BOT_TOKEN,
      hasChannelId: !!process.env.DEFAULT_CHANNEL_ID,
      channelName: process.env.DEFAULT_CHANNEL_NAME || '#liar-game'
    }
  });
});

module.exports = router;
