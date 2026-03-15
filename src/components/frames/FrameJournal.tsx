import '@/styles/frames/journal.css';
import type { FrameProps } from '@/types/frame';

export default function FrameJournal({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-journal active">
      <p className="jo-date">{tag || '\u00A0'}</p>
      <p className="jo-m">{text || '\u00A0'}</p>
      <div className="jo-l" />
      <p className="jo-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
