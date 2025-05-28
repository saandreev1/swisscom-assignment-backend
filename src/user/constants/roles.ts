export const ROLES = ['ADMIN', 'REVIEWER'] as const;
export type Role = typeof ROLES[number];