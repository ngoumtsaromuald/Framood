import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function Settings() {
  const { user, signOut } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      addToast('info', 'Déconnecté');
    } catch {
      addToast('error', 'Erreur de déconnexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1
          className="font-display text-3xl font-semibold"
          style={{ color: 'var(--cream)' }}
        >
          Mon Profil
        </h1>

        {/* User info card */}
        <div
          className="flex items-center gap-4 p-4 rounded-lg"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--gold-dim)' }}
          >
            <User size={24} style={{ color: 'var(--gold)' }} />
          </div>
          <div className="min-w-0">
            <p
              className="text-md font-body font-medium truncate"
              style={{ color: 'var(--cream)' }}
            >
              {user?.name || 'Utilisateur'}
            </p>
            <p
              className="text-sm font-body truncate"
              style={{ color: 'var(--muted)' }}
            >
              {user?.email}
            </p>
          </div>
        </div>

        {/* Plan section */}
        <div
          className="p-4 rounded-lg space-y-2"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <p className="text-sm font-body" style={{ color: 'var(--muted-2)' }}>
            Plan actuel
          </p>
          <div className="flex items-center justify-between">
            <span
              className="text-md font-body font-medium"
              style={{ color: 'var(--gold)' }}
            >
              Gratuit
            </span>
            <Button variant="secondary" size="sm" disabled>
              Passer Pro — bientôt
            </Button>
          </div>
        </div>

        {/* Sign out */}
        <Button
          variant="ghost"
          fullWidth
          loading={loading}
          onClick={handleSignOut}
          icon={<LogOut size={18} />}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
