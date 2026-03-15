import '@/styles/frames/mono.css';
import type { FrameProps } from '@/types/frame';

export default function FrameMono({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-mono active">
      <div className="mo-accent" />
      <div className="mo-cnt">
        <p className="mo-num">{tag || 'No. 001'}</p>
        <p className="mo-m" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
        <div className="mo-t" />
        <p className="mo-s">{subtext || '\u00A0'}</p>
      </div>
    </div>
  );
}
