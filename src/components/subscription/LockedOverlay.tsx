import { Lock } from 'lucide-react';

interface LockedOverlayProps {
  onClick: () => void;
}

export default function LockedOverlay({ onClick }: LockedOverlayProps) {
  return (
    <button
      onClick={onClick}
      className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-transparent border-none"
      aria-label="Style Pro — Débloquer"
      type="button"
    >
      <div
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(2px)', opacity: 0.5 }}
      />
      <Lock size={16} style={{ color: 'var(--gold)' }} className="relative z-20" />
    </button>
  );
}
