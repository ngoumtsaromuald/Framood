import { Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1
            className="font-display text-3xl font-semibold"
            style={{ color: 'var(--cream)' }}
          >
            Bonjour{user?.name ? `, ${user.name}` : ''} 👋
          </h1>
          <p className="text-md font-body" style={{ color: 'var(--muted-2)' }}>
            Comment te sens-tu aujourd'hui ?
          </p>
        </div>

        {/* Placeholder for Check-in (Phase 3) */}
        <div
          className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed"
          style={{
            borderColor: 'var(--border-gold)',
            background: 'var(--gold-dim)',
          }}
        >
          <Sparkles size={32} style={{ color: 'var(--gold)' }} />
          <p className="mt-3 text-md font-body" style={{ color: 'var(--gold)' }}>
            Check-in à venir
          </p>
          <p className="text-sm font-body" style={{ color: 'var(--muted)' }}>
            Phase 3
          </p>
        </div>
      </div>
    </div>
  );
}
