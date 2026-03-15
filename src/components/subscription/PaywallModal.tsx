import { X, Crown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES = [
  '30 styles exclusifs',
  'Effets Pro (grain, vignette, bokeh)',
  'Export HD sans watermark',
  'Galerie illimitée',
  'Insights & Wrapped',
];

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border-gold)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"
              aria-label="Fermer"
              type="button"
            >
              <X size={20} style={{ color: 'var(--muted)' }} />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: 'var(--gold-dim)' }}
              >
                <Crown size={24} style={{ color: 'var(--gold)' }} />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: 'var(--cream)' }}>
                Passe à Framood Pro
              </h2>
              <p className="text-md font-body" style={{ color: 'var(--muted-2)' }}>
                Débloque tout le potentiel créatif
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check size={16} style={{ color: 'var(--gold)' }} />
                  <span className="text-md font-body" style={{ color: 'var(--cream)' }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className="w-full py-3 rounded-xl border-none cursor-pointer font-body text-md font-medium tracking-wide"
              style={{
                background: 'var(--gold)',
                color: '#0a0600',
              }}
              type="button"
            >
              Débloquer Pro — 4,99€/mois
            </button>

            <p
              className="text-center mt-3 text-sm font-body"
              style={{ color: 'var(--muted)' }}
            >
              Annulable à tout moment
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
