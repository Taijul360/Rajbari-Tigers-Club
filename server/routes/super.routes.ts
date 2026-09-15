import { Router } from 'express';
import { delegateToAdmin, revokeDelegation } from '../controllers/super.controller.js';
import { authenticate } from '../middleware/auth.js';
import { audit } from '../middleware/audit.js';

const router = Router();

// Custom middleware to strictly enforce Super Admin only
const requireSuperAdmin = (req: any, res: any, next: any) => {
  if (req.user?.roleKey !== 'super_admin') {
    return res.status(403).json({ success: false, error: { message: 'Strictly Super Admin Only' } });
  }
  next();
};

router.post('/delegate', 
  authenticate, 
  requireSuperAdmin, 
  audit('DELEGATE_AUTHORITY', 'System'),
  delegateToAdmin
);

router.post('/revoke', 
  authenticate, 
  requireSuperAdmin, 
  audit('REVOKE_AUTHORITY', 'System'),
  revokeDelegation
);

export default router;
