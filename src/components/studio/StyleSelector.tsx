import { useRef } from 'react';
import { Lock } from 'lucide-react';
import { FRAMES } from '@/components/frames';
import type { FrameMeta } from '@/types/frame';
import '@/styles/frames/studio.css';

interface StyleSelectorProps {
  selectedId: string;
  onSelect: (frame: FrameMeta) => void;
  onProClick: () => void;
}

export default function StyleSelector({ selectedId, onSelect, onProClick }: StyleSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="style-selector-wrap">
      <div className="style-hscroll" ref={scrollRef}>
        {FRAMES.map((frame) => {
          const isActive = frame.id === selectedId;
          const isLocked = frame.isPro;

          return (
            <div
              key={frame.id}
              className={[
                'style-chip',
                isActive && 'active',
                isLocked && 'locked',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (isLocked) {
                  onProClick();
                } else {
                  onSelect(frame);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isLocked) onProClick();
                  else onSelect(frame);
                }
              }}
            >
              {frame.label}
              {isLocked && (
                <Lock
                  size={10}
                  style={{
                    marginLeft: 4,
                    verticalAlign: 'middle',
                    color: 'var(--gold)',
                  }}
                  aria-label="Pro"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
