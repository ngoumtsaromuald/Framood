import '@/styles/frames/luxe.css';
import type { FrameProps } from '@/types/frame';

export default function FrameLuxe({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-luxe active">
      <p className="lx-maison">{tag || 'Maison Framood'}</p>
      <div className="lx-logo" />
      <p className="lx-m">{text || '\u00A0'}</p>
      <div className="lx-sep"><span>✦</span></div>
      <p className="lx-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
