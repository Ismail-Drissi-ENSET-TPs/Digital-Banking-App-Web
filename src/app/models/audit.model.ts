export interface AuditLog {
  id: number;
  entityType: string; // 'CUSTOMER', 'ACCOUNT', 'OPERATION', 'USER'
  entityId: string;
  action: string; // 'CREATE', 'UPDATE', 'DELETE', 'DEBIT', 'CREDIT', 'TRANSFER'
  performedBy: string; // Username of the authenticated user
  performedAt: Date;
  details: string; // JSON string with operation details
  ipAddress?: string;
  userAgent?: string;
  oldValues?: string; // JSON string with old values (for updates)
  newValues?: string; // JSON string with new values (for updates)
}

export interface AuditLogRequest {
  entityType: string;
  entityId: string;
  action: string;
  details: string;
  oldValues?: string;
  newValues?: string;
}

export interface AuditLogFilter {
  entityType?: string;
  action?: string;
  performedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  size?: number;
}

export interface AuditLogResponse {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Enum-like constants for better type safety
export const ENTITY_TYPES = {
  CUSTOMER: 'CUSTOMER',
  ACCOUNT: 'ACCOUNT', 
  OPERATION: 'OPERATION',
  USER: 'USER'
} as const;

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
  TRANSFER: 'TRANSFER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE'
} as const;

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];
export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];
