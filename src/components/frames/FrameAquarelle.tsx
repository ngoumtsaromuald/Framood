import '@/styles/frames/aquarelle.css';
import type { FrameProps } from '@/types/frame';

export default function FrameAquarelle({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-aquarelle active">
      <p className="aq-tag">{tag || '\u00A0'}</p>
      <p className="aq-m">{text || '\u00A0'}</p>
      <div className="aq-b" />
      <p className="aq-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
