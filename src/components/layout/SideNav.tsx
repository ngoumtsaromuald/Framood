import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Images, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/studio', icon: Sparkles, label: 'Studio' },
  { to: '/gallery', icon: Images, label: 'Galerie' },
  { to: '/settings', icon: User, label: 'Mon Profil' },
] as const;

export default function SideNav() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Toast will handle errors in a future iteration
    }
  };

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-50"
      style={{
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6">
        <h1
          className="font-display text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--gold)' }}
        >
          Framood
        </h1>
        <p
          className="text-xs font-body mt-0.5"
          style={{ color: 'var(--muted)' }}
        >
          Ton humeur, encadrée.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-md font-body transition-all duration-normal',
                isActive
                  ? 'bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'text-[var(--muted-2)] hover:text-[var(--cream)] hover:bg-white/[0.04]'
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div
        className="px-4 py-4 space-y-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {/* Plan badge */}
        <div
          className="px-3 py-2 rounded-md text-sm font-body"
          style={{
            background: 'var(--gold-dim)',
            color: 'var(--gold)',
          }}
        >
          Plan Gratuit
        </div>

        {/* User info + sign out */}
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-body truncate max-w-[140px]"
            style={{ color: 'var(--muted-2)' }}
          >
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-md hover:bg-white/[0.04] transition-colors"
            style={{ color: 'var(--muted)' }}
            aria-label="Se déconnecter"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
