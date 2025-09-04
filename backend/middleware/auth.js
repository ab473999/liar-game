/**
 * Authentication middleware for write operations
 * Validates password from Authorization header
 */

const slackService = require('../services/slackService');

const requireAuth = (req, res, next) => {
  // Check if authentication is enabled
  const isAuthEnabled = process.env.IS_AUTH_ENABLED === 'true' || 
                        process.env.IS_AUTH_ENABLED === 'True' ||
                        process.env.IS_AUTH_ENABLED === 'TRUE';
  
  // If auth is disabled, skip authentication check
  if (!isAuthEnabled) {
    console.log('🔓 Authentication disabled - allowing request');
    return next();
  }
  
  // Get the admin password from environment variable
  // Default password for development only
  const DEFAULT_DEV_PASSWORD = 'liar2024';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 
    (process.env.NODE_ENV === 'development' ? DEFAULT_DEV_PASSWORD : null);
  
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD not set in environment variables');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
  }
  
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  // Expected format: "Bearer <password>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authorization format'
    });
  }
  
  const password = parts[1];
  
  // Validate password
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({
      success: false,
      error: 'Invalid password'
    });
  }
  
  // Password is valid, send Slack notification
  slackService.notifyAuthSuccess(req)
    .catch(err => console.error('Failed to send Slack notification:', err));
  
  // Proceed to the route handler
  next();
};

module.exports = { requireAuth };
