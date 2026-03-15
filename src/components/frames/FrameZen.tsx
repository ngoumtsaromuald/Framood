import '@/styles/frames/zen.css';
import type { FrameProps } from '@/types/frame';

export default function FrameZen({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-zen active">
      <p className="zen-jp">{tag || '静けさ · Sérénité'}</p>
      <div className="zen-line" />
      <p className="zen-m">{text || '\u00A0'}</p>
      <div className="zen-l2" />
      <p className="zen-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
