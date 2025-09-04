/**
 * Authentication configuration settings
 * These can be overridden by environment variables
 */

// Check if authentication is enabled
// Default to false (no auth required) if not specified
export const IS_AUTH_ENABLED = 
  import.meta.env.VITE_IS_AUTH_ENABLED === 'true' || 
  import.meta.env.VITE_IS_AUTH_ENABLED === 'True' ||
  import.meta.env.VITE_IS_AUTH_ENABLED === 'TRUE'

// Export for debugging
if (import.meta.env.DEV) {
  console.log('🔐 Auth Config:', {
    IS_AUTH_ENABLED,
    env_value: import.meta.env.VITE_IS_AUTH_ENABLED
  })
}
