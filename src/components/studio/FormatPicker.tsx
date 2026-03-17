import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, Square, Image } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import type { ExportFormat } from '@/types/frame';

interface FormatPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMATS: Array<{
  id: ExportFormat;
  label: string;
  description: string;
  icon: typeof Smartphone;
}> = [
  { id: 'story', label: 'Story', description: '1080 × 1920 (9:16)', icon: Smartphone },
  { id: 'wallpaper', label: 'Fond d\'écran', description: '1080 × 1920 (9:16)', icon: Image },
  { id: 'square', label: 'Carré', description: '1080 × 1080 (1:1)', icon: Square },
  { id: 'desktop', label: 'Desktop', description: '1920 × 1080 (16:9)', icon: Monitor },
];

export default function FormatPicker({ isOpen, onClose }: FormatPickerProps) {
  const exportFormat = useStudioStore((s) => s.exportFormat);
  const setExportFormat = useStudioStore((s) => s.setExportFormat);

  function handleSelect(format: ExportFormat) {
    setExportFormat(format);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl px-4 pb-8 pt-3"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderBottom: 'none',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center mb-4">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: 'var(--border)' }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h3
                className="font-display text-lg"
                style={{ color: 'var(--cream)' }}
              >
                Format d'export
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)' }}
                aria-label="Fermer"
              >
                <X size={18} style={{ color: 'var(--muted)' }} />
              </button>
            </div>

            {/* Format options */}
            <div className="flex flex-col gap-2">
              {FORMATS.map((f) => {
                const isSelected = exportFormat === f.id;
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleSelect(f.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                    style={{
                      background: isSelected
                        ? 'var(--gold-dim)'
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'var(--border-gold)' : 'var(--border)'}`,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: isSelected ? 'var(--gold)' : 'var(--muted)',
                      }}
                    />
                    <div className="flex-1">
                      <p
                        className="text-md font-body"
                        style={{
                          color: isSelected ? 'var(--gold)' : 'var(--cream)',
                        }}
                      >
                        {f.label}
                      </p>
                      <p
                        className="text-xs font-body"
                        style={{ color: 'var(--muted)' }}
                      >
                        {f.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--gold)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
