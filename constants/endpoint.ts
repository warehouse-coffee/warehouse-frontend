export const API_ENDPOINTS = {
  CREATE_USER: '/api/dashboard/superadmin/users/create',
  UPDATE_USER: '/api/dashboard/superadmin/users/update',
  DELETE_USER: '/api/dashboard/superadmin/users/delete',
  GET_ALL_USERS: '/api/dashboard/superadmin/users/list',
  GET_USER_DETAIL: '/api/dashboard/superadmin/users/detail',
  GET_ALL_LOGS: '/api/dashboard/superadmin/logs'
} as const

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]
