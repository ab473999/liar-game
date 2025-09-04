/**
 * Game configuration settings
 * These can be overridden by environment variables
 */

// Check if first player can be the Liar
// Default to false (first player cannot be Liar) if not specified
export const CAN_FIRST_PLAYER_BE_LIAR = 
  import.meta.env.VITE_CAN_FIRST_PLAYER_BE_LIAR === 'true' || 
  import.meta.env.VITE_CAN_FIRST_PLAYER_BE_LIAR === true

/**
 * Select a random liar position based on configuration
 * @param playerCount - Total number of players
 * @returns The 0-indexed position of the liar
 */
export function selectLiarPosition(playerCount: number): number {
  if (CAN_FIRST_PLAYER_BE_LIAR) {
    // Original logic: any player can be the liar (0 to playerCount-1)
    return Math.floor(Math.random() * playerCount)
  } else {
    // New logic: exclude first player (1 to playerCount-1)
    // If there are only 2 players, player 2 is always the liar
    if (playerCount <= 1) return 0 // Edge case: single player
    return Math.floor(Math.random() * (playerCount - 1)) + 1
  }
}
