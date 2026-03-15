import '@/styles/frames/miami.css';
import type { FrameProps } from '@/types/frame';

export default function FrameMiami({ text, subtext, tag }: FrameProps) {
  const words = text ? text.split('\n') : ['', ''];
  const line1 = words[0] || text || '';
  const line2 = words[1] || '';

  return (
    <div className="sl l-miami active">
      <div className="mi2-grid" />
      <p className="mi2-tag">{tag || '\u00A0'}</p>
      <p className="mi2-m">{line1 || '\u00A0'}</p>
      <p className="mi2-a">{line2 || '\u00A0'}</p>
      <div className="mi2-t" />
      <p className="mi2-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
