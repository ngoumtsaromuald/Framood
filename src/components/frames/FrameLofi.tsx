import '@/styles/frames/lofi.css';
import type { FrameProps } from '@/types/frame';

export default function FrameLofi({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-lofi active">
      <div className="lo-vinyl" />
      <p className="lo-tag">{tag || '\u00A0'}</p>
      <p className="lo-m">{text || '\u00A0'}</p>
      <div className="lo-t" />
      <p className="lo-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
