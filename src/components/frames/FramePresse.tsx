import '@/styles/frames/presse.css';
import type { FrameProps } from '@/types/frame';

export default function FramePresse({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-presse active">
      <div className="pr-h">
        <span className="pr-j">La Pensée</span>
        <span className="pr-dt">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
      </div>
      <p className="pr-k">{tag || '\u00A0'}</p>
      <h2 className="pr-m" dangerouslySetInnerHTML={{ __html: text || '\u00A0' }} />
      <div className="pr-d" />
      <p className="pr-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
