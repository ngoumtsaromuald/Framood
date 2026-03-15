import '@/styles/frames/cinema.css';
import type { FrameProps } from '@/types/frame';

export default function FrameCinema({ text, subtext, theme = 'ci-space' }: FrameProps) {
  return (
    <div className="sl l-cinema active">
      <div className="cin-top" />
      <div className={`cin-bg ${theme}`} />
      <div className="cin-txt">
        <p className="ci-m">{text || '\u00A0'}</p>
        <p className="ci-s">{subtext || 'Framood · 2026'}</p>
      </div>
      <div className="cin-bot" />
    </div>
  );
}
