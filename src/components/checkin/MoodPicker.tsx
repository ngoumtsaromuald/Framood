import { motion } from 'framer-motion';
import { EMOTIONS, MOOD_CATEGORIES, type MoodCategory } from '@/types/emotion';

interface MoodPickerProps {
  onSelect: (mood: MoodCategory) => void;
}

export default function MoodPicker({ onSelect }: MoodPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {MOOD_CATEGORIES.map((mood, i) => {
        const config = EMOTIONS[mood];
        return (
          <motion.button
            key={mood}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl cursor-pointer transition-colors"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
            }}
            onClick={() => onSelect(mood)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = config.accent;
              (e.currentTarget as HTMLElement).style.background = `${config.accent}15`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.background = 'var(--card)';
            }}
          >
            <span className="text-2xl" role="img" aria-label={config.label}>
              {config.emoji}
            </span>
            <span
              className="text-xs font-body"
              style={{ color: 'var(--cream)', letterSpacing: '0.03em' }}
            >
              {config.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
