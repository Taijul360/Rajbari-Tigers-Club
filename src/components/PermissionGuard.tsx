import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  permission?: string;
  children: ReactNode;
  superAdminOnly?: boolean;
}

export function PermissionGuard({ permission, children, superAdminOnly = false }: PermissionGuardProps) {
  const { user, hasPermission } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (superAdminOnly && user.roleKey !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="p-8 text-center text-red-500 font-bangla">
        <h2 className="text-xl font-bold">অনুমতি নেই</h2>
        <p>এই পাতাটি দেখার জন্য আপনার পর্যাপ্ত অনুমতি নেই।</p>
      </div>
    );
  }

  return <>{children}</>;
}
