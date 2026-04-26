import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  /**
   * Records an audit log inside a transaction
   */
  async record(
    manager: EntityManager,
    data: {
      tableName: string;
      recordId: number;
      actionType: string;
      fieldName?: string;
      oldValue?: any;
      newValue?: any;
      userId?: number;
      ipAddress?: string;
      userAgent?: string;
      isSensitive?: boolean;
    },
  ): Promise<void> {
    const { 
      tableName, recordId, actionType, fieldName, 
      oldValue, newValue, userId, ipAddress, userAgent, isSensitive 
    } = data;

    const log = manager.create(AuditLog, {
      tableName,
      recordId,
      actionType,
      fieldName,
      oldValue: oldValue !== undefined ? String(oldValue) : null,
      newValue: newValue !== undefined ? String(newValue) : null,
      userId: userId || 0,
      // Only store metadata for sensitive actions as per user request
      ipAddress: isSensitive ? ipAddress : null,
      userAgent: isSensitive ? userAgent : null,
    } as any);

    await manager.save(log);
  }

  /**
   * Compares numeric values to avoid false-positive logs (e.g. 5.5 vs 5.50)
   */
  hasChanged(oldVal: any, newVal: any): boolean {
    if (oldVal === newVal) return false;
    
    // Numeric check
    if (!isNaN(parseFloat(oldVal)) && !isNaN(parseFloat(newVal))) {
      return parseFloat(oldVal) !== parseFloat(newVal);
    }
    
    return String(oldVal) !== String(newVal);
  }
}
