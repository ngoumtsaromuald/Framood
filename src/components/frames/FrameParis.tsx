import '@/styles/frames/paris.css';
import type { FrameProps } from '@/types/frame';

export default function FrameParis({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-paris active">
      <div className="pa-tour" />
      <p className="pa-tag">{tag || '\u00A0'}</p>
      <p className="pa-m">{text || '\u00A0'}</p>
      <div className="pa-t" />
      <p className="pa-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
