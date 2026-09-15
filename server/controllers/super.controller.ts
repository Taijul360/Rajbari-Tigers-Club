import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Role } from '../models/index.js';
import { PERMISSIONS } from '../../src/shared/permissions.js';

export const delegateToAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { expiresAt } = req.body;
    
    // Admin cannot get system.* permissions even with full delegation
    const allPerms = Object.values(PERMISSIONS).filter(p => !p.startsWith('system.'));
    
    const adminRole = await Role.findOneAndUpdate(
      { key: 'admin' },
      { 
        permissions: allPerms,
        delegatedBy: req.user?.userId,
        delegationExpiresAt: expiresAt ? new Date(expiresAt) : null
      },
      { new: true }
    );

    res.json({ success: true, data: adminRole, message: 'Full authority delegated to Admin' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to delegate authority' } });
  }
};

export const revokeDelegation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Base safe permissions for Admin when not fully delegated
    const safePerms = [
      PERMISSIONS.USERS_VIEW, 
      PERMISSIONS.MEMBERS_DIR_MANAGE,
      PERMISSIONS.NOTICES_PUBLISH
    ];
    
    const adminRole = await Role.findOneAndUpdate(
      { key: 'admin' },
      { 
        permissions: safePerms,
        $unset: { delegatedBy: 1, delegationExpiresAt: 1 }
      },
      { new: true }
    );
    
    res.json({ success: true, data: adminRole, message: 'Delegation revoked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to revoke delegation' } });
  }
};
