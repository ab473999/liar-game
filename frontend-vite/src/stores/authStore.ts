import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { logger } from '@/utils/logger'

interface AuthStore {
  // State
  password: string | null
  isAuthenticated: boolean
  lastAuthTime: number | null
  
  // Actions
  setPassword: (password: string) => void
  clearPassword: () => void
  checkAuth: () => boolean
  
  // Getters
  getPassword: () => string | null
}

// Auth expires after 1 hour
const AUTH_EXPIRY_MS = 60 * 60 * 1000

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        password: null,
        isAuthenticated: false,
        lastAuthTime: null,
        
        // Actions
        setPassword: (password) => {
          logger.log('AuthStore: Password set')
          set({ 
            password, 
            isAuthenticated: true,
            lastAuthTime: Date.now()
          })
        },
        
        clearPassword: () => {
          logger.log('AuthStore: Password cleared')
          set({ 
            password: null, 
            isAuthenticated: false,
            lastAuthTime: null
          })
        },
        
        checkAuth: () => {
          const state = get()
          if (!state.password || !state.lastAuthTime) {
            return false
          }
          
          // Check if auth has expired
          const now = Date.now()
          const timeSinceAuth = now - state.lastAuthTime
          
          if (timeSinceAuth > AUTH_EXPIRY_MS) {
            logger.log('AuthStore: Auth expired')
            get().clearPassword()
            return false
          }
          
          return true
        },
        
        getPassword: () => {
          const state = get()
          if (state.checkAuth()) {
            return state.password
          }
          return null
        }
      }),
      {
        name: 'liar-auth-storage', // Key in localStorage
        partialize: (state) => ({
          // Only persist password and auth time (with encryption in real app)
          password: state.password,
          lastAuthTime: state.lastAuthTime,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    {
      name: 'auth-store', // Name for Redux DevTools
    }
  )
)

// Subscribe to state changes for debugging in dev
if (import.meta.env.DEV) {
  useAuthStore.subscribe((state) => {
    logger.log('AuthStore State Updated:', {
      isAuthenticated: state.isAuthenticated,
      hasPassword: !!state.password,
      lastAuthTime: state.lastAuthTime ? new Date(state.lastAuthTime).toISOString() : null
    })
  })
}
