export interface User {
  id: string;
  name: { bn: string; en: string };
  phone: string;
  email?: string;
  avatarUrl?: string;
  roleKey: string;
  memberCode?: string;
  memberStatus: 'none' | 'pending' | 'active' | 'suspended' | 'expired';
  bloodGroup?: string;
  joinedAt: string;
}

export interface Role {
  key: string;
  label: { bn: string; en: string };
  rank: number;
  permissions: string[];
  responsibilities: { bn: string[]; en: string[] };
  delegatedBy?: string;
  delegationExpiresAt?: string | null;
}

export interface Settings {
  siteName: { bn: string; en: string };
  tagline: { bn: string; en: string };
  logoUrl?: string;
  defaultLanguage: 'bn' | 'en';
  memberCodePrefix: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'expense' | 'withdrawal' | 'donation' | 'sponsorship' | 'due_payment' | 'opening_balance';
  amount: number;
  currency: string;
  category: string;
  method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank';
  referenceNo?: string;
  description: { bn: string; en: string };
  transactionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Tournament {
  id: string;
  title: { bn: string; en: string };
  sport: 'football' | 'cricket' | 'badminton' | 'carrom' | 'other';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
}

export interface Project {
  id: string;
  title: { bn: string; en: string };
  category: string;
  summary: string;
  progressPercent: number;
  status: 'planned' | 'ongoing' | 'completed' | 'paused';
}

