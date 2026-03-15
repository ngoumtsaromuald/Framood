import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Images, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const tabs = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/studio', icon: Sparkles, label: 'Studio' },
  { to: '/gallery', icon: Images, label: 'Galerie' },
  { to: '/settings', icon: User, label: 'Moi' },
] as const;

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors duration-normal',
                isActive
                  ? 'text-[var(--gold)]'
                  : 'text-[var(--muted)] hover:text-[var(--muted-2)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} aria-label={label} />
                <span
                  className={cn(
                    'text-xs font-body',
                    isActive && 'font-medium'
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)]" style={{ background: 'var(--card)' }} />
    </nav>
  );
}
