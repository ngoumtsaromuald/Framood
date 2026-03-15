import '@/styles/frames/poetique.css';
import type { FrameProps } from '@/types/frame';

export default function FramePoetique({ text, subtext, tag }: FrameProps) {
  const firstWord = text ? text.split(' ')[0] : '';
  const restOfText = text ? text.split(' ').slice(1).join(' ') : '';

  return (
    <div className="sl l-poetique active">
      <p className="po-tag">{tag || '\u00A0'}</p>
      <p className="po-g">{firstWord || '\u00A0'}</p>
      <p className="po-m">{restOfText || '\u00A0'}</p>
      <div className="po-t" />
      <p className="po-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
