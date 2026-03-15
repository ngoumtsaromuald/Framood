import '@/styles/frames/sticker.css';
import type { FrameProps } from '@/types/frame';

export default function FrameSticker({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-sticker active">
      <div className="sk-bord" />
      <p className="sk-stars">{tag || '⭐⭐⭐'}</p>
      <p className="sk-m">{text || '\u00A0'}</p>
      <p className="sk-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
