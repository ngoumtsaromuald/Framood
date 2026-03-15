import '@/styles/frames/retro.css';
import type { FrameProps } from '@/types/frame';

export default function FrameRetro({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-retro active">
      <p className="re-tag">{tag || '\u00A0'}</p>
      <h2 className="re-m" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
      <div className="re-d" />
      <p className="re-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
