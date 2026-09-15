/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Home, Trophy, HeartHandshake, FileText, Activity, Moon, Sun } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import { useSettingsStore } from './store/useSettingsStore';
import { useAuthStore } from './store/useAuthStore';
import { PermissionGuard } from './components/PermissionGuard';
import { HeaderSearch } from './components/HeaderSearch';
import { NotificationCenter } from './components/NotificationCenter';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useDrag } from '@use-gesture/react';
import { useState, useEffect } from 'react';

// Pages
import HomePage from './pages/public/HomePage';
import TournamentsPage from './pages/public/TournamentsPage';
import ProjectsPage from './pages/public/ProjectsPage';
import BloodDonorsPage from './pages/public/BloodDonorsPage';
import CommitteePage from './pages/public/CommitteePage';
import NoticesPage from './pages/public/NoticesPage';
import LoginPage from './pages/auth/LoginPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import RolesPage from './pages/admin/RolesPage';
import DelegationPage from './pages/super/DelegationPage';

import JoinPage from './pages/public/JoinPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const MOBILE_TABS = ['/', '/tournaments', '/projects', '/notices', '/blood-donors'];

function AppContent() {
  const { t } = useTranslation();
  const { settings } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const superAdminRoute = import.meta.env.VITE_SUPER_ADMIN_ROUTE || '/super-admin';
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const bindGestures = useDrag(({ swipe: [swipeX], direction: [dirX], active, cancel }) => {
    // Only process when swipe is finished and we're not touching an element that scrolls horizontally
    if (active) return;
    
    const currentIndex = MOBILE_TABS.indexOf(location.pathname);
    if (currentIndex === -1) return; // Not on a mobile tab page
    
    // Swipe left (dirX = -1) means next tab, Swipe right (dirX = 1) means prev tab
    if (swipeX === -1 && currentIndex < MOBILE_TABS.length - 1) {
      navigate(MOBILE_TABS[currentIndex + 1]);
    } else if (swipeX === 1 && currentIndex > 0) {
      navigate(MOBILE_TABS[currentIndex - 1]);
    }
  }, { 
    axis: 'x', 
    preventScroll: true, 
    filterTaps: true,
    swipe: { velocity: 0.3, distance: 50 }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col font-body transition-colors" {...bindGestures()}>
      {/* Top Header */}
      <header className="bg-tiger-navy text-bone p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-bone rounded-full flex items-center justify-center">
                <span className="text-tiger-navy font-bold text-xs">RTC</span>
              </div>
            )}
            <div>
              <h1 className="font-bangla font-bold text-xl leading-tight">
                {settings?.siteName?.bn || 'রাজবাড়ি টাইগার্স ক্লাব'}
              </h1>
              <p className="font-english text-[10px] text-tiger-gold uppercase tracking-wider hidden sm:block">
                {settings?.siteName?.en || 'Rajbari Tigers Club'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 items-center">
            <Link to="/" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">নীড়পাতা</Link>
            <Link to="/tournaments" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">টুর্নামেন্ট</Link>
            <Link to="/projects" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">প্রকল্প</Link>
            <Link to="/notices" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">নোটিশ</Link>
            <Link to="/blood-donors" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">রক্তদাতা</Link>
            <Link to="/committee" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">কমিটি</Link>
          </nav>

          <div className="flex gap-2 md:gap-3 items-center">
            <button onClick={toggleTheme} className="p-2 text-white hover:bg-white/10 rounded-sm transition-colors" aria-label="Toggle Theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <HeaderSearch />
            <NotificationCenter />
            <PWAInstallButton />
            
            <div className="hidden md:flex gap-3 items-center ml-2 border-l border-white/20 pl-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold font-bangla text-tiger-gold">{user.name?.bn}</span>
                  <button onClick={handleLogout} className="text-sm font-bold font-bangla text-white hover:text-tiger-orange transition-colors">লগআউট</button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold font-bangla hover:text-tiger-orange transition-colors">লগইন</Link>
                  <Link to="/join" className="bg-tiger-orange text-white px-4 py-1.5 rounded-sm text-sm font-bold font-bangla hover:bg-tiger-orange/90 transition-colors shadow-sm">
                    যোগদান
                  </Link>
                </>
              )}
            </div>
            
            <button className="p-2 hover:bg-white/10 rounded-sm lg:hidden ml-1">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="tiger-stripe w-full"></div>

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-24">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/blood-donors" element={<BloodDonorsPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />

          {/* Admin Routes */}
          <Route path="/admin/settings" element={
            <PermissionGuard permission="content.branding.edit">
              <AdminSettingsPage />
            </PermissionGuard>
          } />
          <Route path="/admin/roles" element={
            <PermissionGuard permission="roles.permissions.assign">
              <RolesPage />
            </PermissionGuard>
          } />
          <Route path="/admin/applications" element={
            <PermissionGuard permission="users.manage">
              <ApplicationsPage />
            </PermissionGuard>
          } />

          {/* Super Admin Routes (Hidden from navigation) */}
          <Route path={`${superAdminRoute}/delegation`} element={
            <PermissionGuard superAdminOnly={true}>
              <DelegationPage />
            </PermissionGuard>
          } />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center justify-center w-full h-full gap-1 text-tiger-navy hover:text-tiger-royal">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold font-bangla">নীড়পাতা</span>
        </Link>
        <Link to="/tournaments" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-tiger-royal">
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-bold font-bangla">টুর্নামেন্ট</span>
        </Link>
        <Link to="/projects" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-tiger-royal">
          <HeartHandshake className="w-5 h-5" />
          <span className="text-[10px] font-bold font-bangla">প্রকল্প</span>
        </Link>
        <Link to="/notices" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-tiger-royal">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold font-bangla">নোটিশ</span>
        </Link>
        <Link to="/blood-donors" className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-tiger-royal">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-bold font-bangla">রক্তদাতা</span>
        </Link>
      </nav>
    </div>
  );
}
