import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { AuditLog } from '../models/index.js';

/**
 * Middleware to create an audit log AFTER the request successfully completes.
 * @param action - Action being performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param entityType - The type of entity being affected (e.g., 'User', 'Transaction')
 */
export const audit = (action: string, entityType: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Capture the original send function
    const originalSend = res.send;

    res.send = function (body) {
      // Check if request was successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Record audit log asynchronously
        try {
          const logEntry = new AuditLog({
            actorId: req.user?.userId || 'system',
            actorRole: req.user?.roleKey || 'system',
            action,
            entityType,
            entityId: req.params.id || req.body?.id || null, // Best effort to capture ID
            before: req.body?.audit_before || null, // Can be injected by route handler if needed
            after: req.body, // The payload sent
            ip: req.ip,
            userAgent: req.headers['user-agent']
          });
          logEntry.save().catch(err => console.error('Failed to save audit log:', err));
        } catch (e) {
          console.error('Audit Log Error:', e);
        }
      }
      return originalSend.call(this, body);
    };

    next();
  };
};
