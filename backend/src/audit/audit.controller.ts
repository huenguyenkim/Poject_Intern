import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuditService } from './audit.service';
import type { Request } from 'express';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  @Post('log')
  async logAction(
    @Body() body: { actionType: string; recordId?: number; tableName?: string; userId?: number },
    @Req() req: Request,
  ) {
    const ip = req.ip || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    await this.auditService.record(this.manager, {
      actionType: body.actionType || 'ANALYTICS',
      recordId: body.recordId || 0,
      tableName: body.tableName || 'analytics',
      userId: body.userId || 0,
      ipAddress: ip,
      userAgent: ua,
      isSensitive: true, // Force IP/UA recording for forensics
    });

    return { success: true };
  }
}
