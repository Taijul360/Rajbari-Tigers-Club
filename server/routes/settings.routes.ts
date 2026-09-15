import { Router } from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permission.js';
import { audit } from '../middleware/audit.js';
import { PERMISSIONS } from '../../src/shared/permissions.js';

const router = Router();

// Public route to fetch settings at boot
router.get('/public', getPublicSettings);

// Protected route to update settings
router.patch('/', 
  authenticate, 
  requirePermission(PERMISSIONS.CONTENT_BRANDING_EDIT), 
  audit('UPDATE', 'Settings'), 
  updateSettings
);

export default router;
