import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config-loader.service';
import {
  AuditLog,
  AuditLogRequest,
  AuditLogFilter,
  AuditLogResponse,
  ENTITY_TYPES,
  AUDIT_ACTIONS,
  EntityType,
  AuditAction
} from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    config.loadConfig();
    this.apiUrl = config.backendHost;
  }

  public getAuditLogs(filter?: AuditLogFilter): Observable<AuditLogResponse> {
    let params: any = {};

    if (filter) {
      if (filter.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
      if (filter.dateTo) params.dateTo = filter.dateTo.toISOString();
      if (filter.performedBy) params.performedBy = filter.performedBy;
      if (filter.action) params.action = filter.action;
      if (filter.entityType) params.entityType = filter.entityType;
      if (filter.page !== undefined) params.page = filter.page.toString();
      if (filter.size !== undefined) params.size = filter.size.toString();
    }

    return this.http.get<AuditLogResponse>(`${this.apiUrl}/audit/logs`, { params });
  }

  public createAuditLog(request: AuditLogRequest): Observable<AuditLog> {
    return this.http.post<AuditLog>(`${this.apiUrl}/audit/logs`, request);
  }

  public getAuditLogById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.apiUrl}/audit/logs/${id}`);
  }

  public getAuditLogsByEntity(entityType: string, entityId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit/logs/entity/${entityType}/${entityId}`);
  }

  public getAuditLogsByUser(username: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit/logs/user/${username}`);
  }

  public exportAuditLogs(filter?: AuditLogFilter): Observable<Blob> {
    let params: any = {};

    if (filter) {
      if (filter.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
      if (filter.dateTo) params.dateTo = filter.dateTo.toISOString();
      if (filter.performedBy) params.performedBy = filter.performedBy;
      if (filter.action) params.action = filter.action;
      if (filter.entityType) params.entityType = filter.entityType;
    }

    return this.http.get(`${this.apiUrl}/audit/logs/export`, {
      params,
      responseType: 'blob'
    });
  }

  // Helper methods for creating audit logs
  public logCustomerAction(action: AuditAction, customerId: number, details: string, oldValues?: any, newValues?: any): Observable<AuditLog> {
    const request: AuditLogRequest = {
      entityType: ENTITY_TYPES.CUSTOMER,
      entityId: customerId.toString(),
      action,
      details,
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: newValues ? JSON.stringify(newValues) : undefined
    };
    return this.createAuditLog(request);
  }

  public logAccountAction(action: AuditAction, accountId: string, details: string, oldValues?: any, newValues?: any): Observable<AuditLog> {
    const request: AuditLogRequest = {
      entityType: ENTITY_TYPES.ACCOUNT,
      entityId: accountId,
      action,
      details,
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: newValues ? JSON.stringify(newValues) : undefined
    };
    return this.createAuditLog(request);
  }

  public logOperationAction(action: AuditAction, operationId: number, details: string): Observable<AuditLog> {
    const request: AuditLogRequest = {
      entityType: ENTITY_TYPES.OPERATION,
      entityId: operationId.toString(),
      action,
      details
    };
    return this.createAuditLog(request);
  }

  public logUserAction(action: AuditAction, userId: number, details: string, oldValues?: any, newValues?: any): Observable<AuditLog> {
    const request: AuditLogRequest = {
      entityType: ENTITY_TYPES.USER,
      entityId: userId.toString(),
      action,
      details,
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: newValues ? JSON.stringify(newValues) : undefined
    };
    return this.createAuditLog(request);
  }
}
