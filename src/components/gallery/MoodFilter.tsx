import { cn } from '@/lib/cn';
import { EMOTIONS, MOOD_CATEGORIES, MoodCategory } from '@/types/emotion';

interface MoodFilterProps {
  selectedMood: MoodCategory | null;
  onSelect: (mood: MoodCategory | null) => void;
}

export function MoodFilter({ selectedMood, onSelect }: MoodFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
          selectedMood === null
            ? "bg-[var(--gold)] text-[#0A0600] border-transparent"
            : "border-[var(--border)] text-[var(--muted-2)] hover:text-[var(--cream)]"
        )}
      >
        Tout
      </button>

      {MOOD_CATEGORIES.map((mood) => {
        const config = EMOTIONS[mood];
        const isSelected = selectedMood === mood;

        return (
          <button
            key={mood}
            onClick={() => onSelect(mood)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-2",
              isSelected
                ? "border-transparent text-[#0A0600]"
                : "border-[var(--border)] text-[var(--muted-2)] hover:text-[var(--cream)] hover:border-[var(--muted)]"
            )}
            style={{
              backgroundColor: isSelected ? config.accent : 'transparent',
            }}
          >
            <span>{config.emoji}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
