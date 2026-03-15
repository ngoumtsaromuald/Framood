import '@/styles/frames/elegant.css';
import type { FrameProps } from '@/types/frame';

export default function FrameElegant({ text, subtext, tag }: FrameProps) {
  const firstWord = text ? text.split(' ')[0] : '';
  const restOfText = text ? text.split(' ').slice(1).join(' ') : '';

  return (
    <div className="sl l-elegant active">
      <p className="el-tag">{tag || '\u00A0'}</p>
      <p className="el-g">{firstWord || '\u00A0'}</p>
      <p className="el-m">{restOfText || '\u00A0'}</p>
      <div className="el-t" />
      <p className="el-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
