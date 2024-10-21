export const METHODS = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const

export type Method = typeof METHODS[keyof typeof METHODS]
