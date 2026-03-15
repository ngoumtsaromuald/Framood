import '@/styles/frames/ticket.css';
import type { FrameProps } from '@/types/frame';

const BARCODE = [
  { w: 2, h: 28 }, { w: 1, h: 22 }, { w: 3, h: 28 }, { w: 1, h: 20 },
  { w: 2, h: 28 }, { w: 1, h: 25 }, { w: 3, h: 28 }, { w: 2, h: 22 },
  { w: 1, h: 28 }, { w: 2, h: 18 }, { w: 3, h: 28 }, { w: 1, h: 24 },
];

export default function FrameTicket({ text, subtext }: FrameProps) {
  return (
    <div className="sl l-ticket active">
      <div className="tk-top">
        <span className="tk-shop">FRAMOOD®</span>
        <span className="tk-date">{new Date().toLocaleDateString('fr-FR')}</span>
      </div>
      <p className="tk-m">{text || '\u00A0'}</p>
      <div className="tk-sep"><span>— — — — —</span></div>
      <p className="tk-s">{subtext || '\u00A0'}</p>
      <div className="tk-barcode">
        {BARCODE.map((b, i) => (
          <div key={i} className="b" style={{ width: `${b.w}px`, height: `${b.h}px` }} />
        ))}
      </div>
    </div>
  );
}
