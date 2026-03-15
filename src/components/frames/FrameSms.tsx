import '@/styles/frames/sms.css';
import type { FrameProps } from '@/types/frame';

export default function FrameSms({ text }: FrameProps) {
  const charCount = text ? text.length : 0;

  return (
    <div className="sl l-sms active">
      <div className="sms-screen">
        <p className="sms-chars">{charCount} caractères</p>
        <p className="sms-t">{text || '\u00A0'}</p>
      </div>
      <div className="sms-btns">
        <span className="sms-btn">Option</span>
        <span className="sms-btn">Effacer</span>
      </div>
    </div>
  );
}
