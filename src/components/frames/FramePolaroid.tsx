import '@/styles/frames/polaroid.css';
import type { FrameProps } from '@/types/frame';

export default function FramePolaroid({ text, subtext, tag, photoUrl, rotation = -3 }: FrameProps) {
  return (
    <div className="sl l-polaroid active">
      <div className="pol-frame" style={{ transform: `rotate(${rotation}deg)` }}>
        <div className="scotch" />
        <div className="pol-photo">
          {photoUrl ? (
            <img className="pol-img" src={photoUrl} alt="" style={{ display: 'block' }} />
          ) : (
            <div className="pol-ph">📷</div>
          )}
        </div>
        <p className="pol-cap">{tag || '\u00A0'}</p>
      </div>
      <div className="pol-txt">
        <p className="pol-main">{text || '\u00A0'}</p>
        <p className="pol-sub">{subtext || '\u00A0'}</p>
      </div>
    </div>
  );
}
