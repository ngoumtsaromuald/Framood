import { useState } from 'react';
import { motion } from 'framer-motion';

interface IntensitySliderProps {
  onSelect: (value: number) => void;
}

const LABELS: Record<number, string> = {
  1: 'À peine',
  2: 'Léger',
  3: 'Doux',
  4: 'Modéré',
  5: 'Présent',
  6: 'Marqué',
  7: 'Fort',
  8: 'Très fort',
  9: 'Profond',
  10: 'Intense',
};

export default function IntensitySlider({ onSelect }: IntensitySliderProps) {
  const [value, setValue] = useState(5);
  const [committed, setCommitted] = useState(false);

  function handleCommit() {
    if (committed) return;
    setCommitted(true);
    onSelect(value);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-6 py-4"
    >
      <p
        className="text-md font-body text-center"
        style={{ color: 'var(--muted-2)' }}
      >
        À quel point ?
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className="intensity-slider w-full"
          aria-label="Intensité de l'émotion"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs font-body" style={{ color: 'var(--muted)' }}>
            Léger
          </span>
          <motion.span
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-display font-semibold"
            style={{ color: 'var(--gold)' }}
          >
            {value} — {LABELS[value]}
          </motion.span>
          <span className="text-xs font-body" style={{ color: 'var(--muted)' }}>
            Intense
          </span>
        </div>
      </div>
    </motion.div>
  );
}
