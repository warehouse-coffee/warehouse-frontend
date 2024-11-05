export type LogLevel = 'INFO' | 'WARNING' | 'ERROR'

export interface Log {
  id: string
  date: string
  logLevel: LogLevel
  message: string
  hour: string
  type: string
}