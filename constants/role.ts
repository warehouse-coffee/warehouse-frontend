export const ROLE_NAMES = {
  SUPER_ADMIN: 'Super-Admin',
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee'
} as const

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES]
