import '@/styles/frames/brule.css';
import type { FrameProps } from '@/types/frame';

export default function FrameBrule({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-brule active">
      <p className="br-tag">{tag || '\u00A0'}</p>
      <p className="br-m">{text || '\u00A0'}</p>
      <div className="br-t" />
      <p className="br-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
