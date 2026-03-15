import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import BottomNav from './BottomNav';
import SideNav from './SideNav';
import PageTransition from './PageTransition';
import Spinner from '@/components/ui/Spinner';

export default function AppShell() {
  const { user, isLoading, isOnboarded } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    if (!isOnboarded) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, isLoading, isOnboarded, navigate]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-dvh"
        style={{ background: 'var(--bg)' }}
      >
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm font-body" style={{ color: 'var(--muted)' }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
      <SideNav />

      <main className="md:ml-60 pb-20 md:pb-0 min-h-dvh">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
