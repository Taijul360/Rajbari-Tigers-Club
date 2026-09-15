import { create } from 'zustand';
import { fetchApi } from '../lib/api/client';
import { Role } from '../shared/types';
import { logger } from '../lib/logger';
import { analytics } from '../lib/analytics';

interface AuthState {
  user: any | null;
  roles: Role[];
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchRoles: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // Set null by default
  roles: [],
  isLoading: false,
  
  login: async (credentials) => {
    logger.info('Login attempt initiated', { phone: credentials.phone, hasOtp: !!credentials.otp });
    set({ isLoading: true });
    try {
      const data = await fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      logger.info('Login response received', { success: true, userId: data.user.id, role: data.user.roleKey });
      localStorage.setItem('access_token', data.accessToken);
      logger.info('Access token stored in localStorage');
      
      analytics.trackEvent('Auth', 'Login', data.user.roleKey);
      
      set({ user: data.user, isLoading: false });
    } catch (error: any) {
      logger.error('Login failed', error, { phone: credentials.phone });
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    logger.info('User logged out');
    analytics.trackEvent('Auth', 'Logout');
    localStorage.removeItem('access_token');
    set({ user: null });
  },

  fetchRoles: async () => {
    try {
      const roles = await fetchApi<Role[]>('/roles');
      set({ roles });
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  },
  
  hasPermission: (permission: string) => {
    const { user, roles } = get();
    if (!user) return false;
    if (user.roleKey === 'super_admin') return true;
    
    const role = roles.find(r => r.key === user.roleKey);
    if (!role) return false;
    
    return role.permissions.includes(permission) || role.permissions.includes('*');
  }
}));
