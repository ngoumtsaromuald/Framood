import { useRef, useCallback } from 'react';
import PhoneFrame from '@/components/studio/PhoneFrame';
import StyleSelector from '@/components/studio/StyleSelector';
import ExportBar from '@/components/studio/ExportBar';
import PaywallModal from '@/components/subscription/PaywallModal';
import { FRAMES } from '@/components/frames';
import type { FrameMeta, ThemeOption } from '@/types/frame';
import { useStudioStore } from '@/store/useStudioStore';
import { useState } from 'react';

export default function Studio() {
  const [showPaywall, setShowPaywall] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Read from store
  const selectedFrameId = useStudioStore((s) => s.selectedFrameId);
  const selectedTheme = useStudioStore((s) => s.selectedTheme);
  const text = useStudioStore((s) => s.text);
  const subtext = useStudioStore((s) => s.subtext);
  const tag = useStudioStore((s) => s.tag);

  // Actions
  const setFrame = useStudioStore((s) => s.setFrame);
  const setText = useStudioStore((s) => s.setText);
  const setSubtext = useStudioStore((s) => s.setSubtext);
  const setTag = useStudioStore((s) => s.setTag);

  const selectedFrame = FRAMES.find((f) => f.id === selectedFrameId) ?? FRAMES[0]!;

  const handleSelectFrame = useCallback((frame: FrameMeta) => {
    setFrame(frame.id, frame.themes?.[0]?.cls);
  }, [setFrame]);

  const handleProClick = useCallback(() => {
    setShowPaywall(true);
  }, []);

  const handleThemeSelect = useCallback((cls: string) => {
    setFrame(selectedFrameId, cls);
  }, [setFrame, selectedFrameId]);

  return (
    <div className="px-4 py-6 md:px-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Preview */}
        <div className="flex flex-col items-center gap-3">
          <div ref={exportRef}>
            <PhoneFrame
              frameId={selectedFrameId}
              theme={selectedTheme}
              text={text || selectedFrame.label}
              subtext={subtext}
              tag={tag}
            />
          </div>
          <p
            className="text-center"
            style={{
              fontSize: '9px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            ✦ Aperçu temps réel
          </p>
        </div>

        {/* Style selector */}
        <div>
          <span
            className="block mb-2 px-4"
            style={{
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Style ({FRAMES.length})
          </span>
          <StyleSelector
            selectedId={selectedFrameId}
            onSelect={handleSelectFrame}
            onProClick={handleProClick}
          />
        </div>

        {/* Theme selector (if applicable) */}
        {selectedFrame.hasThemes && selectedFrame.themes && (
          <div>
            <span
              className="block mb-2 px-4"
              style={{
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Ambiance
            </span>
            <div className="theme-hscroll">
              {selectedFrame.themes.map((t: ThemeOption) => (
                <div
                  key={t.cls}
                  className={`theme-btn${selectedTheme === t.cls ? ' active' : ''}`}
                  style={{ background: t.gradient }}
                  onClick={() => handleThemeSelect(t.cls)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleThemeSelect(t.cls);
                    }
                  }}
                >
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text inputs */}
        <div>
          <span
            className="block mb-2 px-4"
            style={{
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Textes
          </span>
          <div
            className="flex flex-col gap-3 mx-4 p-3 rounded-xl"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="studio-text"
                style={{
                  fontSize: '9px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Citation
              </label>
              <textarea
                id="studio-text"
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ton texte principal..."
                className="font-body text-md"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  color: 'var(--cream)',
                  outline: 'none',
                  width: '100%',
                  resize: 'none',
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="studio-sub"
                style={{
                  fontSize: '9px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Sous-texte
              </label>
              <input
                id="studio-sub"
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                placeholder="Sous-texte..."
                className="font-body text-md"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  color: 'var(--cream)',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="studio-tag"
                style={{
                  fontSize: '9px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Tag
              </label>
              <input
                id="studio-tag"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag..."
                className="font-body text-md"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '9px',
                  padding: '10px 12px',
                  color: 'var(--cream)',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export bar */}
      <ExportBar exportRef={exportRef} />

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
