import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface GameStore {
  // State
  playerNum: number
  theme: string | null
  currentPlayer: number
  liarPosition: number
  word: string | null
  stage: 'intro' | 'select' | 'play'
  revealedPlayers: number[]
  hasVisitedHome: boolean  // Track if we've been to home before
  isWordRevealed: boolean  // Track if current player has seen their word
  
  // Actions
  setPlayerNum: (num: number) => void
  incrementPlayerNum: () => void
  decrementPlayerNum: () => void
  setTheme: (theme: string) => void
  setWord: (word: string) => void
  setLiarPosition: (position: number) => void
  startGame: () => void
  nextPlayer: () => void
  resetGame: () => void
  markHomeVisited: () => void
  initializeHomeState: () => void
  revealWord: () => void  // Called when 1s hold is reached
}

// Constants
const MIN_PLAYERS = 3
const MAX_PLAYERS = 20
const DEFAULT_PLAYERS = 4

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        playerNum: DEFAULT_PLAYERS,
        theme: null,
        currentPlayer: 0,
        liarPosition: -1,
        word: null,
        stage: 'intro',
        revealedPlayers: [],
        hasVisitedHome: false,
        isWordRevealed: false,
      
      // Actions
      setPlayerNum: (num) => {
        const clampedNum = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, num))
        console.log('GameStore: setPlayerNum', { from: get().playerNum, to: clampedNum })
        set({ playerNum: clampedNum })
      },
      
      incrementPlayerNum: () => {
        const current = get().playerNum
        if (current < MAX_PLAYERS) {
          console.log('GameStore: incrementPlayerNum', { from: current, to: current + 1 })
          set({ playerNum: current + 1 })
        }
      },
      
      decrementPlayerNum: () => {
        const current = get().playerNum
        if (current > MIN_PLAYERS) {
          console.log('GameStore: decrementPlayerNum', { from: current, to: current - 1 })
          set({ playerNum: current - 1 })
        }
      },
      
      setTheme: (theme) => {
        console.log('GameStore: setTheme', { from: get().theme, to: theme })
        set({ theme })
      },
      
      setWord: (word) => {
        console.log('GameStore: setWord', { word })
        set({ word })
      },
      
      setLiarPosition: (position) => {
        console.log('GameStore: setLiarPosition', { position })
        set({ liarPosition: position })
      },
      
      startGame: () => {
        const playerNum = get().playerNum
        const liarPosition = Math.floor(Math.random() * playerNum)
        console.log('GameStore: startGame', { playerNum, liarPosition })
        set({
          stage: 'select',
          currentPlayer: 0,
          liarPosition,
          revealedPlayers: []
        })
      },
      
      nextPlayer: () => {
        const { currentPlayer, revealedPlayers } = get()
        console.log('GameStore: nextPlayer', { from: currentPlayer, to: currentPlayer + 1 })
        set({
          currentPlayer: currentPlayer + 1,
          revealedPlayers: [...revealedPlayers, currentPlayer],
          isWordRevealed: false  // Reset for next player
        })
      },
      
      revealWord: () => {
        console.log('GameStore: revealWord for player', get().currentPlayer)
        set({ isWordRevealed: true })
      },
      
      resetGame: () => {
        console.log('GameStore: resetGame')
        set({
          stage: 'intro',
          currentPlayer: 0,
          liarPosition: -1,
          word: null,
          revealedPlayers: [],
          theme: null,
          isWordRevealed: false
        })
      },
      
      markHomeVisited: () => {
        console.log('GameStore: markHomeVisited')
        set({ hasVisitedHome: true })
      },
      
      initializeHomeState: () => {
        const { hasVisitedHome, playerNum } = get()
        console.log('GameStore: initializeHomeState', { hasVisitedHome, currentPlayerNum: playerNum })
        
        // Only reset to default playerNum if this is the first time visiting home
        if (!hasVisitedHome) {
          console.log('GameStore: First visit to home, setting playerNum to', DEFAULT_PLAYERS)
          set({ 
            playerNum: DEFAULT_PLAYERS,
            hasVisitedHome: true
          })
        }
        
        // Always reset active game state when coming to home (but keep playerNum)
        console.log('GameStore: Resetting active game state (keeping playerNum:', get().playerNum, ')')
        set({
          stage: 'intro',
          currentPlayer: 0,
          liarPosition: -1,
          word: null,
          revealedPlayers: [],
          theme: null,  // Reset selected theme when returning to home
          isWordRevealed: false  // Reset reveal state
        })
      }
      }),
      {
        name: 'liar-game-storage', // Key in localStorage
        // Persist everything! If someone refreshes mid-game, they should continue where they left off
        // The game only resets when explicitly returning to home page
      }
    ),
    {
      name: 'game-store', // Name for Redux DevTools
    }
  )
)

// Subscribe to all state changes for debugging
// Note: In development, React.StrictMode will cause double renders/effects
// This is normal and won't happen in production
if (import.meta.env.DEV) {
  useGameStore.subscribe((state) => {
    console.log('GameStore State Updated:', {
      playerNum: state.playerNum,
      theme: state.theme,
      stage: state.stage,
      currentPlayer: state.currentPlayer,
      liarPosition: state.liarPosition,
      word: state.word,
      revealedPlayers: state.revealedPlayers,
      hasVisitedHome: state.hasVisitedHome,
      isWordRevealed: state.isWordRevealed
    })
  })
}

// Export constants for use in components
export { MIN_PLAYERS, MAX_PLAYERS, DEFAULT_PLAYERS }
