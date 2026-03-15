import '@/styles/frames/bold.css';
import type { FrameProps } from '@/types/frame';

export default function FrameBold({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-bold active">
      <p className="bo-tag">{tag || '\u00A0'}</p>
      <p className="bo-m" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
      <div className="bo-t" />
      <p className="bo-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
