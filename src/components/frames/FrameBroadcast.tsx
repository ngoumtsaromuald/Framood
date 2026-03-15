import '@/styles/frames/broadcast.css';
import type { FrameProps } from '@/types/frame';

export default function FrameBroadcast({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-broadcast active">
      <div className="br2-top-bar">
        <div className="dot" />
        <span className="live">BREAKING</span>
      </div>
      <div className="br2-content">
        <p className="br2-ch">CH.01 · FRAMOOD NEWS</p>
        <p className="br2-m">{text || '\u00A0'}</p>
        <div className="br2-d" />
        <p className="br2-s">{subtext || '\u00A0'}</p>
      </div>
      <div className="br2-ticker">
        <span className="br2-ticker-txt">
          DERNIÈRES NOUVELLES : {text || 'BREAKING NEWS'} · · · FRAMOOD · · ·
        </span>
      </div>
    </div>
  );
}
