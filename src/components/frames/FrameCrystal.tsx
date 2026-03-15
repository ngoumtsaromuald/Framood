import '@/styles/frames/crystal.css';
import type { FrameProps } from '@/types/frame';

export default function FrameCrystal({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-crystal active">
      <div className="cr2-card">
        <p className="cr2-tag">{tag || '\u00A0'}</p>
        <p className="cr2-m">{text || '\u00A0'}</p>
        <div className="cr2-t" />
        <p className="cr2-s">{subtext || '\u00A0'}</p>
      </div>
    </div>
  );
}
