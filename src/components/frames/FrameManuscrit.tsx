import '@/styles/frames/manuscrit.css';
import type { FrameProps } from '@/types/frame';

export default function FrameManuscrit({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-manuscrit active">
      <div className="ms-ruled" />
      <div className="ms-cnt">
        <p className="ms-m">{text || '\u00A0'}</p>
        <p className="ms-s">{subtext || '\u00A0'}</p>
      </div>
    </div>
  );
}
