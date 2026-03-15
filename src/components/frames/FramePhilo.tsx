import '@/styles/frames/philo.css';
import type { FrameProps } from '@/types/frame';

export default function FramePhilo({ text, subtext }: FrameProps) {
  const firstLetter = text ? text.charAt(0) : '';
  const restOfText = text ? text.slice(1) : '';

  return (
    <div className="sl l-philo active">
      <p className="ph-drop">{firstLetter || '\u00A0'}</p>
      <p className="ph-m">{restOfText || '\u00A0'}</p>
      <div className="ph-d" />
      <p className="ph-attr">{subtext || '\u00A0'}</p>
    </div>
  );
}
