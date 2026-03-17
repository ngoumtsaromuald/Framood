import { useAuthStore } from '@/store/useAuthStore';
import CheckIn from '@/components/checkin/CheckIn';

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

        {/* Check-in flow */}
        <CheckIn />
      </div>
    </div>
  );
}
