import '@/styles/frames/gothic.css';
import type { FrameProps } from '@/types/frame';

export default function FrameGothic({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-gothic active">
      <div className="go-border" />
      <div className="go-corner go-tl" />
      <div className="go-corner go-tr" />
      <div className="go-corner go-bl" />
      <div className="go-corner go-br" />
      <p className="go-tag">{tag || '\u00A0'}</p>
      <p className="go-m">{text || '\u00A0'}</p>
      <p className="go-sym">⸸</p>
      <p className="go-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
