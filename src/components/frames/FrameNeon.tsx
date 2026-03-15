import '@/styles/frames/neon.css';
import type { FrameProps } from '@/types/frame';

export default function FrameNeon({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-neon active">
      <p className="ne-tag">{tag || '\u00A0'}</p>
      <p className="ne-m">{text || '\u00A0'}</p>
      <div className="ne-t" />
      <p className="ne-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
