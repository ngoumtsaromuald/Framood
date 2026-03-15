import '@/styles/frames/typo.css';
import type { FrameProps } from '@/types/frame';

export default function FrameTypo({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-typo active">
      <p className="ty-num">{tag || '\u00A0'}</p>
      <h2 className="ty-q" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
      <div className="ty-d" />
      <p className="ty-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
