import { Router } from 'express';
import { getRoles, updateRolePermissions } from '../controllers/roles.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permission.js';
import { audit } from '../middleware/audit.js';
import { PERMISSIONS } from '../../src/shared/permissions.js';

const router = Router();

router.get('/', authenticate, requirePermission(PERMISSIONS.USERS_VIEW), getRoles);

router.patch('/:key/permissions', 
  authenticate, 
  requirePermission(PERMISSIONS.ROLES_PERMISSIONS_ASSIGN),
  audit('UPDATE_PERMISSIONS', 'Role'),
  updateRolePermissions
);

export default router;
