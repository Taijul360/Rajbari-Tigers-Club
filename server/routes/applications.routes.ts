import { Router } from 'express';
import { applyForMembership, getPendingApplications, approveApplication, rejectApplication } from '../controllers/applications.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permission.js';
import { audit } from '../middleware/audit.js';
import { PERMISSIONS } from '../../src/shared/permissions.js';

const router = Router();

// Public route to apply
router.post('/apply', applyForMembership);

// Admin routes
router.get('/pending', 
  authenticate, 
  requirePermission(PERMISSIONS.USERS_VIEW), 
  getPendingApplications
);

router.post('/:id/approve', 
  authenticate, 
  requirePermission(PERMISSIONS.MEMBERS_APP_REVIEW), 
  audit('APPROVE_MEMBER', 'User'),
  approveApplication
);

router.post('/:id/reject', 
  authenticate, 
  requirePermission(PERMISSIONS.MEMBERS_APP_REVIEW), 
  audit('REJECT_MEMBER', 'User'),
  rejectApplication
);

export default router;
