import '@/styles/frames/postit.css';
import type { FrameProps } from '@/types/frame';

export default function FramePostit({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-postit active">
      <div className="pi-fold" />
      <div className="pi-top" />
      <p className="pi-m">{text || '\u00A0'}</p>
      <div className="pi-l" />
      <p className="pi-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
