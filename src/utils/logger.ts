/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
}

const formatLog = (level: LogLevel, message: string, data?: any): LogMessage => {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  }
}

export const logger = {
  info: (message: string, data?: any) => {
    const log = formatLog(LogLevel.INFO, message, data)
    console.log(log)
  },

  warn: (message: string, data?: any) => {
    const log = formatLog(LogLevel.WARN, message, data)
    console.warn(JSON.stringify(log))
  },

  error: (message: string, data?: any) => {
    const log = formatLog(LogLevel.ERROR, message, data)
    console.error(log)
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      const log = formatLog(LogLevel.DEBUG, message, data)
      console.debug(log)
    }
  },
}

export default logger
