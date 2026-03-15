import '@/styles/frames/vhs.css';
import type { FrameProps } from '@/types/frame';

export default function FrameVhs({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-vhs active">
      <div className="vhs-bg" />
      <div className="vhs-scan" />
      <div className="vhs-noise" />
      <div className="vhs-noise2" />
      <div className="vhs-cnt">
        <div className="vhs-rec">
          <div className="dot" />
          <span>REC</span>
        </div>
        <p className="vhs-m">{text || '\u00A0'}</p>
        <p className="vhs-tc">{subtext || '00:00:00:00 · CAM-01'}</p>
      </div>
    </div>
  );
}
