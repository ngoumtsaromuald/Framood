import '@/styles/frames/liquid.css';
import type { FrameProps } from '@/types/frame';

export default function FrameLiquid({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-liquid active">
      <p className="li-tag">{tag || '\u00A0'}</p>
      <p className="li-m" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
      <div className="li-w" />
      <p className="li-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
