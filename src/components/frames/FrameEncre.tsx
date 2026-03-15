import '@/styles/frames/encre.css';
import type { FrameProps } from '@/types/frame';

export default function FrameEncre({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-encre active">
      <div className="en-stroke" />
      <p className="en-m">{text || '\u00A0'}</p>
      <div className="en-seal">墨</div>
      <p className="en-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
