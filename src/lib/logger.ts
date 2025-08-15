/**
 * Logger utility for conditional logging based on environment
 */

import { isDevelopment } from './env-validation'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.log(...args)
    }
  },
  
  error: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.error(...args)
    } else {
      // In production, you might want to send errors to a logging service
      // For now, we'll still log errors as they're important for debugging
      console.error(...args)
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.warn(...args)
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment()) {
      console.info(...args)
    }
  }
}