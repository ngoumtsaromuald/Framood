import '@/styles/frames/craie.css';
import type { FrameProps } from '@/types/frame';

export default function FrameCraie({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-craie active">
      <p className="cr-tag">{tag || '\u00A0'}</p>
      <p className="cr-m">{text || '\u00A0'}</p>
      <div className="cr-underline" />
      <p className="cr-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
