import '@/styles/frames/magazine.css';
import type { FrameProps } from '@/types/frame';

export default function FrameMagazine({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-magazine active">
      <p className="ma-tag">{tag || '\u00A0'}</p>
      <h2 className="ma-m" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
      <div className="ma-d" />
      <p className="ma-s">{subtext || '\u00A0'}</p>
      <p className="ma-cr">Framood · Édition</p>
    </div>
  );
}
