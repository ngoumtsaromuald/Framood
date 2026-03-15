import '@/styles/frames/cosmos.css';
import type { FrameProps } from '@/types/frame';

const STARS = [
  { top: '8%', left: '18%', opacity: 0.8 },
  { top: '22%', left: '78%', opacity: 0.6 },
  { top: '38%', left: '8%', opacity: 0.9, size: 3 },
  { top: '14%', left: '55%', opacity: 0.5 },
  { top: '52%', left: '88%', opacity: 0.7 },
  { top: '66%', left: '28%', opacity: 0.4 },
  { top: '6%', left: '42%', opacity: 0.6, size: 3 },
  { top: '30%', left: '35%', opacity: 0.3 },
  { top: '76%', left: '60%', opacity: 0.5 },
];

export default function FrameCosmos({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-cosmos active">
      {STARS.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            opacity: s.opacity,
            width: s.size ? `${s.size}px` : undefined,
            height: s.size ? `${s.size}px` : undefined,
          }}
        />
      ))}
      <p className="co-tag">{tag || '\u00A0'}</p>
      <p className="co-m">{text || '\u00A0'}</p>
      <div className="co-st" />
      <p className="co-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
