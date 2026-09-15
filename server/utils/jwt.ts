import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, roleKey: string): string => {
  return jwt.sign(
    { userId, roleKey },
    process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'default_access_secret');
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret');
  } catch (error) {
    return null;
  }
};
