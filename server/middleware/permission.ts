import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { User, Role } from '../models/index.js';

export const requirePermission = (requiredPermission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }

      const { userId, roleKey } = req.user;

      // Super Admin Wildcard Rule
      if (roleKey === 'super_admin') {
        return next();
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } });
      }

      const role = await Role.findOne({ key: user.roleKey });
      if (!role) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Role not found' } });
      }

      // Calculate effective permissions
      // effective = (role.permissions U user.permissionGrants) \ user.permissionRevokes
      const basePermissions = new Set(role.permissions);
      const grants = user.permissionGrants || [];
      const revokes = user.permissionRevokes || [];

      grants.forEach(p => basePermissions.add(p));
      revokes.forEach(p => basePermissions.delete(p));

      if (basePermissions.has(requiredPermission) || basePermissions.has('*')) {
        return next();
      }

      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Missing required permission: ${requiredPermission}` }
      });
    } catch (error) {
      console.error('Permission Check Error:', error);
      return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error checking permissions' } });
    }
  };
};
