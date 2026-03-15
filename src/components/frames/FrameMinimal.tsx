import '@/styles/frames/minimal.css';
import type { FrameProps } from '@/types/frame';

export default function FrameMinimal({ text }: FrameProps) {
  return (
    <div className="sl l-minimal active">
      <p className="mi-l">{text || '\u00A0'}</p>
      <div className="mi-dot" />
    </div>
  );
}
