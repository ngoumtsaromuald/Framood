import { useState, useCallback } from 'react';
import PhoneFrame from '@/components/studio/PhoneFrame';
import StyleSelector from '@/components/studio/StyleSelector';
import PaywallModal from '@/components/subscription/PaywallModal';
import { FRAMES } from '@/components/frames';
import type { FrameMeta, ThemeOption } from '@/types/frame';

export default function Studio() {
  const [selectedFrame, setSelectedFrame] = useState<FrameMeta>(FRAMES[0]!);
  const [selectedTheme, setSelectedTheme] = useState<string>(
    FRAMES[0]!.themes?.[0]?.cls ?? '',
  );
  const [text, setText] = useState('');
  const [subtext, setSubtext] = useState('');
  const [tag, setTag] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSelectFrame = useCallback((frame: FrameMeta) => {
    setSelectedFrame(frame);
    setSelectedTheme(frame.themes?.[0]?.cls ?? '');
  }, []);

  const handleProClick = useCallback(() => {
    setShowPaywall(true);
  }, []);

  return (
    <div className="px-4 py-6 md:px-8 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Preview */}
        <div className="flex flex-col items-center gap-3">
          <PhoneFrame
            frameId={selectedFrame.id}
            theme={selectedTheme}
            text={text || selectedFrame.label}
            subtext={subtext}
            tag={tag}
          />
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
            selectedId={selectedFrame.id}
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
                  onClick={() => setSelectedTheme(t.cls)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTheme(t.cls);
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

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
