import '@/styles/frames/street.css';
import type { FrameProps } from '@/types/frame';

export default function FrameStreet({ text, subtext, tag }: FrameProps) {
  const words = text ? text.split('\n') : ['', ''];
  const word1 = words[0] || text || '';
  const word2 = words[1] || '';

  return (
    <div className="sl l-street active">
      <p className="st-tag">{tag || '\u00A0'}</p>
      <p className="st-m">{word1 || '\u00A0'}</p>
      <p className="st-a">{word2 || '\u00A0'}</p>
      <div className="st-l" />
      <p className="st-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
