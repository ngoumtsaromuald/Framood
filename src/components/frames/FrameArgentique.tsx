import '@/styles/frames/argentique.css';
import type { FrameProps } from '@/types/frame';

export default function FrameArgentique({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-argentique active">
      <div className="ar-photo" />
      <div className="ar-overlay" />
      <div className="ar-grain2" />
      <div className="ar-frame" />
      <div className="ar-cnt">
        <p className="ar-roll">{tag || 'KODAK 400 · FRAME 24'}</p>
        <p className="ar-m">{text || '\u00A0'}</p>
        <p className="ar-s">{subtext || '\u00A0'}</p>
      </div>
    </div>
  );
}
