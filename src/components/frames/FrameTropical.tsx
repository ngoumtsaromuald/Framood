import '@/styles/frames/tropical.css';
import type { FrameProps } from '@/types/frame';

export default function FrameTropical({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-tropical active">
      <p className="tr-tag">{tag || '\u00A0'}</p>
      <p className="tr-m">{text || '\u00A0'}</p>
      <div className="tr-t" />
      <p className="tr-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
