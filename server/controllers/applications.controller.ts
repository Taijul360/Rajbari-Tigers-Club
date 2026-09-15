import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Settings } from '../models/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Public: Apply for membership (Registers a new user and sets status to pending)
export const applyForMembership = async (req: Request, res: Response) => {
  try {
    const { phone, password, name_bn, name_en, bloodGroup, address } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, error: { message: 'এই ফোন নম্বরটি ইতিমধ্যে নিবন্ধিত আছে।' } });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User({
      phone,
      passwordHash,
      name: { bn: name_bn, en: name_en },
      bloodGroup,
      address,
      roleKey: 'user', 
      memberStatus: 'pending', // Directly set to pending
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'আপনার আবেদন সফলভাবে জমা হয়েছে। কর্তৃপক্ষের অনুমোদনের জন্য অপেক্ষা করুন।',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'আবেদন জমা দিতে সমস্যা হয়েছে।' } });
  }
};

// Admin: Get all pending applications
export const getPendingApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const applications = await User.find({ memberStatus: 'pending' })
      .select('-passwordHash')
      .sort({ createdAt: 1 });
    
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'আবেদন তালিকা পেতে সমস্যা হয়েছে।' } });
  }
};

// Admin: Approve application
export const approveApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.memberStatus !== 'pending') {
      return res.status(404).json({ success: false, error: { message: 'আবেদন পাওয়া যায়নি।' } });
    }

    // Generate member code (e.g. RTC-001)
    const settings = await Settings.findOne() || { memberCodePrefix: 'RTC' };
    const prefix = settings.memberCodePrefix || 'RTC';
    
    // Find the highest member code sequence
    const lastUser = await User.findOne({ memberCode: new RegExp(`^${prefix}-\\d+$`) })
      .sort({ memberCode: -1 });

    let nextNumber = 1;
    if (lastUser && lastUser.memberCode) {
      const parts = lastUser.memberCode.split('-');
      if (parts.length === 2) {
        nextNumber = parseInt(parts[1], 10) + 1;
      }
    }

    const memberCode = `${prefix}-${nextNumber.toString().padStart(3, '0')}`;

    user.memberStatus = 'active';
    user.memberCode = memberCode;
    user.roleKey = 'member'; // Upgrade role
    await user.save();

    res.json({ success: true, message: 'আবেদন অনুমোদন করা হয়েছে।', data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'অনুমোদন করতে সমস্যা হয়েছে।' } });
  }
};

// Admin: Reject application
export const rejectApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.memberStatus !== 'pending') {
      return res.status(404).json({ success: false, error: { message: 'আবেদন পাওয়া যায়নি।' } });
    }

    user.memberStatus = 'none'; // Revert back to regular user
    await user.save();

    res.json({ success: true, message: 'আবেদন বাতিল করা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'বাতিল করতে সমস্যা হয়েছে।' } });
  }
};
