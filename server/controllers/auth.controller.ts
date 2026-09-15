import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req: Request, res: Response) => {
  try {
    const { phone, password, name_bn, name_en } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Phone number already registered' } });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User({
      phone,
      passwordHash,
      name: { bn: name_bn, en: name_en },
      roleKey: 'user', // Default role. Member status is 'none' by default.
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.',
      data: { userId: user._id }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Registration failed' } });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Account is suspended' } });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    // 2FA check for Super Admin (Simulated logic for Phase 3)
    if (user.roleKey === 'super_admin') {
      if (!otp) {
        // In a real flow, you'd check TOTP here using otplib
        return res.status(403).json({ success: false, error: { code: '2FA_REQUIRED', message: '2FA OTP required for Super Admin' } });
      }
      // Assuming OTP is correct for demonstration (Placeholder for otplib verify)
      if (otp !== '123456') { // Mock verification
         return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid OTP' } });
      }
    }

    user.lastSeenAt = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id.toString(), user.roleKey);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          roleKey: user.roleKey,
          memberStatus: user.memberStatus,
          memberCode: user.memberCode
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Login failed' } });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token' } });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' } });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.isBanned) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found or banned' } });
    }

    const accessToken = generateAccessToken(user._id.toString(), user.roleKey);

    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to refresh token' } });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ success: true, message: 'Logged out successfully' });
};
