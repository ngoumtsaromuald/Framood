import { Images } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="px-6 py-8 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1
          className="font-display text-3xl font-semibold"
          style={{ color: 'var(--cream)' }}
        >
          Galerie
        </h1>

        <div
          className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--card)',
          }}
        >
          <Images size={32} style={{ color: 'var(--muted)' }} />
          <p className="mt-3 text-md font-body" style={{ color: 'var(--muted-2)' }}>
            Galerie émotionnelle à venir
          </p>
          <p className="text-sm font-body" style={{ color: 'var(--muted)' }}>
            Phase 4
          </p>
        </div>
      </div>
    </div>
  );
}
