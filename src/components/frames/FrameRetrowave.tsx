import '@/styles/frames/retrowave.css';
import type { FrameProps } from '@/types/frame';

export default function FrameRetrowave({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-retrowave active">
      <div className="rw-sun" />
      <div className="rw-grid-h" />
      <div className="rw-cnt">
        <p className="rw-m">{text || '\u00A0'}</p>
        <p className="rw-s">{subtext || '\u00A0'}</p>
      </div>
    </div>
  );
}
