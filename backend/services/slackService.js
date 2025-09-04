const https = require('https');

/**
 * Slack notification service
 * Sends formatted messages to Slack channel using Bot token
 */
class SlackService {
  constructor() {
    this.botToken = process.env.SLACK_BOT_TOKEN;
    this.defaultChannelId = process.env.DEFAULT_CHANNEL_ID;
    this.defaultChannelName = process.env.DEFAULT_CHANNEL_NAME || '#liar-game';
    this.enabled = !!(this.botToken && this.defaultChannelId);
    
    if (!this.enabled) {
      console.log('⚠️  Slack notifications disabled - missing SLACK_BOT_TOKEN or DEFAULT_CHANNEL_ID');
    } else {
      console.log(`✅ Slack notifications enabled for channel: ${this.defaultChannelName}`);
    }
  }

  /**
   * Send a message to Slack
   * @param {Object} options - Message options
   * @param {string} options.text - Plain text message (fallback)
   * @param {Array} options.blocks - Slack blocks for rich formatting
   * @param {string} options.channel - Channel ID (optional, uses default if not provided)
   */
  async sendMessage({ text, blocks, channel = this.defaultChannelId }) {
    if (!this.enabled) {
      console.log('Slack notification skipped (not configured):', text);
      return { success: false, reason: 'Slack not configured' };
    }

    const payload = {
      channel,
      text,
      blocks,
      unfurl_links: false,
      unfurl_media: false
    };

    console.log('📤 Sending to Slack:', {
      channel,
      hasText: !!text,
      hasBlocks: !!blocks,
      blocksCount: blocks ? blocks.length : 0
    });

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);
      console.log('📦 Payload size:', Buffer.byteLength(data), 'bytes');

      const options = {
        hostname: 'slack.com',
        port: 443,
        path: '/api/chat.postMessage',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(data),
          'Authorization': `Bearer ${this.botToken}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            console.log('📥 Slack API response:', JSON.stringify(response, null, 2));
            if (response.ok) {
              console.log('✅ Slack notification sent successfully');
              resolve({ success: true, response });
            } else {
              console.error('❌ Slack API error:', response.error);
              console.error('Full error response:', response);
              resolve({ success: false, error: response.error });
            }
          } catch (error) {
            console.error('❌ Failed to parse Slack response:', error);
            console.error('Raw response:', responseData);
            resolve({ success: false, error: error.message });
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Slack request failed:', error);
        resolve({ success: false, error: error.message });
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * Format and send authentication success notification
   */
  async notifyAuthSuccess(req) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🔐 Authentication Successful',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*IP Address:*\n${ip}`
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
            text: `User Agent: ${userAgent.substring(0, 100)}`,
            emoji: true
          }
        ]
      }
    ];

    return this.sendMessage({
      text: 'Admin authentication successful',
      blocks
    });
  }

  /**
   * Format and send new theme notification
   */
  async notifyNewTheme(theme) {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎨 New Theme Added',
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `A new theme has been added to the Liar Game!`
        },
        fields: [
          {
            type: 'mrkdwn',
            text: `*Theme Type:*\n\`${theme.type}\``
          },
          {
            type: 'mrkdwn',
            text: `*Name:*\n${theme.name}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `Theme ID: ${theme.id} | Created: ${new Date().toLocaleString()}`,
            emoji: true
          }
        ]
      }
    ];

    return this.sendMessage({
      text: `New theme added: ${theme.name}`,
      blocks
    });
  }

  /**
   * Format and send new word notification
   */
  async notifyNewWord(word, themeName) {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📝 New Word Added',
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `A new word has been added to the *${themeName}* theme!`
        },
        fields: [
          {
            type: 'mrkdwn',
            text: `*Word:*\n\`${word.word}\``
          },
          {
            type: 'mrkdwn',
            text: `*Theme:*\n${themeName}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `Word ID: ${word.id} | Created: ${new Date().toLocaleString()}`,
            emoji: true
          }
        ]
      }
    ];

    return this.sendMessage({
      text: `New word added to ${themeName}: ${word.word}`,
      blocks
    });
  }

  /**
   * Format and send word edit notification
   */
  async notifyWordEdit(oldWord, newWord, themeName) {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '✏️ Word Edited',
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `A word has been edited in the *${themeName}* theme`
        },
        fields: [
          {
            type: 'mrkdwn',
            text: `*Old Word:*\n~${oldWord}~`
          },
          {
            type: 'mrkdwn',
            text: `*New Word:*\n\`${newWord}\``
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `Theme: ${themeName} | Edited: ${new Date().toLocaleString()}`,
            emoji: true
          }
        ]
      }
    ];

    return this.sendMessage({
      text: `Word edited in ${themeName}: ${oldWord} → ${newWord}`,
      blocks
    });
  }

  /**
   * Format and send new game notification
   */
  async notifyNewGame(gameData) {
    const playerCount = gameData.playerCount || 'Unknown';
    const theme = gameData.theme || 'Unknown';
    const word = gameData.word || 'Hidden';
    
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎮 New Game Started',
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `A new Liar Game session has begun!`
        },
        fields: [
          {
            type: 'mrkdwn',
            text: `*Players:*\n${playerCount}`
          },
          {
            type: 'mrkdwn',
            text: `*Theme:*\n${theme}`
          },
          {
            type: 'mrkdwn',
            text: `*Word:*\n||${word}||`
          },
          {
            type: 'mrkdwn',
            text: `*Game ID:*\n\`${gameData.gameId || 'N/A'}\``
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `Started: ${new Date().toLocaleString()}`,
            emoji: true
          }
        ]
      }
    ];

    return this.sendMessage({
      text: `New game started with ${playerCount} players`,
      blocks
    });
  }
}

// Create singleton instance
const slackService = new SlackService();

module.exports = slackService;
