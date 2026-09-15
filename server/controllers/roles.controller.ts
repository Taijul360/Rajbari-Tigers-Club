import { Request, Response } from 'express';
import { Role } from '../models/index.js';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().sort({ rank: -1 });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch roles' } });
  }
};

export const updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { permissions } = req.body;

    if (key === 'super_admin') {
      return res.status(403).json({ success: false, error: { message: 'Cannot modify super_admin permissions' } });
    }

    const role = await Role.findOneAndUpdate(
      { key },
      { permissions },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ success: false, error: { message: 'Role not found' } });
    }

    res.json({ success: true, data: role, message: 'Permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to update permissions' } });
  }
};
