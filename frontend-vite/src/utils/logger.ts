/**
 * Logger utility that respects VITE_LOGGING_LEVEL environment variable
 * When VITE_LOGGING_LEVEL=DEV, logs are shown
 * When VITE_LOGGING_LEVEL=PROD, logs are suppressed
 */

// Get the logging level from environment variable (defaults to PROD if not set)
const loggingLevel = import.meta.env.VITE_LOGGING_LEVEL || 'PROD'
const isDevelopment = loggingLevel === 'DEV'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
  
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data)
    }
  },
  
  group: (...args: any[]) => {
    if (isDevelopment) {
      console.group(...args)
    }
  },
  
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd()
    }
  },
  
  time: (label?: string) => {
    if (isDevelopment) {
      console.time(label)
    }
  },
  
  timeEnd: (label?: string) => {
    if (isDevelopment) {
      console.timeEnd(label)
    }
  }
}
