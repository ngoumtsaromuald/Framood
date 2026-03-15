import '@/styles/frames/glitch.css';
import type { FrameProps } from '@/types/frame';

export default function FrameGlitch({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-glitch active">
      <p className="gl-tag">{tag || '// système : actif'}</p>
      <p className="gl-m" data-text={text || ''}>{text || '\u00A0'}</p>
      <div className="gl-ln" />
      <p className="gl-s">{subtext || '\u00A0'}<span className="gl-cur" /></p>
    </div>
  );
}
