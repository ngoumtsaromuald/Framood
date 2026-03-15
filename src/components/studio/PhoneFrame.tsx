import { useMemo } from 'react';
import { FRAMES } from '@/components/frames';
import type { FrameProps } from '@/types/frame';

interface PhoneFrameProps {
  frameId: string;
  theme?: string;
  text: string;
  subtext?: string;
  tag?: string;
  photoUrl?: string;
  rotation?: number;
}

/** Base CSS class for the frame layers */
const SL_BASE = `
  .sl {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    flex-direction: column;
  }
  .sl.active {
    display: flex;
  }
`;

export default function PhoneFrame({
  frameId,
  theme,
  text,
  subtext,
  tag,
  photoUrl,
  rotation,
}: PhoneFrameProps) {
  const frameMeta = useMemo(
    () => FRAMES.find((f) => f.id === frameId) ?? FRAMES[0]!,
    [frameId],
  );

  const FrameComponent = frameMeta.component;
  const activeTheme = theme ?? frameMeta.themes?.[0]?.cls ?? '';

  const screenClasses = [
    'frame-screen',
    !frameMeta.noGrain && 'grain',
    !frameMeta.noVignette && 'vignette',
    activeTheme,
  ]
    .filter(Boolean)
    .join(' ');

  const frameProps: FrameProps = {
    text,
    subtext,
    tag,
    theme: activeTheme,
    photoUrl,
    rotation,
  };

  return (
    <div className="phone-frame-container">
      <style>{SL_BASE}</style>
      {/* Phone hardware shell */}
      <div className="phone-shell">
        {/* Side buttons */}
        <div className="phone-btn-right" />
        <div className="phone-btn-left" />
        {/* Screen */}
        <div className={screenClasses}>
          <FrameComponent {...frameProps} />
        </div>
      </div>
    </div>
  );
}
