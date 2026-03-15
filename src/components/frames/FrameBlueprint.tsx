import '@/styles/frames/blueprint.css';
import type { FrameProps } from '@/types/frame';

export default function FrameBlueprint({ text, subtext, tag }: FrameProps) {
  return (
    <div className="sl l-blueprint active">
      <div className="bp-grid" />
      <p className="bp-tag">{tag || '// SPEC_001'}</p>
      <p className="bp-m">{text || '\u00A0'}</p>
      <div className="bp-d" />
      <p className="bp-s">{subtext || '\u00A0'}</p>
    </div>
  );
}
