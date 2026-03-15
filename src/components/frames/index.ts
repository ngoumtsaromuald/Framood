import '@/styles/frames/themes.css';
import type { FrameMeta, ThemeOption } from '@/types/frame';

import FrameMinimal from './FrameMinimal';
import FrameTypo from './FrameTypo';
import FrameJournal from './FrameJournal';
import FrameManuscrit from './FrameManuscrit';
import FramePolaroid from './FramePolaroid';
import FrameCinema from './FrameCinema';
import FramePoetique from './FramePoetique';
import FrameElegant from './FrameElegant';
import FrameBold from './FrameBold';
import FrameAquarelle from './FrameAquarelle';
import FrameGlitch from './FrameGlitch';
import FrameCosmos from './FrameCosmos';
import FrameVhs from './FrameVhs';
import FrameRetrowave from './FrameRetrowave';
import FrameLuxe from './FrameLuxe';
import FrameSms from './FrameSms';
import FrameNeon from './FrameNeon';
import FrameMagazine from './FrameMagazine';
import FrameBrule from './FrameBrule';
import FrameStreet from './FrameStreet';
import FrameRetro from './FrameRetro';
import FramePresse from './FramePresse';
import FrameLiquid from './FrameLiquid';
import FrameZen from './FrameZen';
import FrameBlueprint from './FrameBlueprint';
import FramePostit from './FramePostit';
import FrameGothic from './FrameGothic';
import FrameLofi from './FrameLofi';
import FrameTicket from './FrameTicket';
import FrameMiami from './FrameMiami';
import FrameEncre from './FrameEncre';
import FrameParis from './FrameParis';
import FrameBroadcast from './FrameBroadcast';
import FrameCraie from './FrameCraie';
import FrameSticker from './FrameSticker';
import FramePhilo from './FramePhilo';
import FrameTropical from './FrameTropical';
import FrameArgentique from './FrameArgentique';
import FrameMono from './FrameMono';
import FrameCrystal from './FrameCrystal';

export type { FrameMeta, ThemeOption };
export { type FrameProps } from '@/types/frame';

/** Theme gradients for the theme selector buttons */
const TH: Record<string, string> = {
  'bg-sunset':  'linear-gradient(180deg,#1a0d00,#c05000,#ffb030)',
  'bg-night':   'linear-gradient(180deg,#000308,#021030,#0a2060)',
  'bg-forest':  'linear-gradient(160deg,#010a01,#041208,#0a2808)',
  'bg-desert':  'linear-gradient(180deg,#100800,#8a4010,#e8a050)',
  'bg-ocean':   'linear-gradient(180deg,#000c18,#003050,#0060a0)',
  'bg-rose':    'linear-gradient(160deg,#0d0205,#600020,#c04060)',
  'ef-rose':    'linear-gradient(160deg,#200510,#601030)',
  'ef-lilas':   'linear-gradient(160deg,#100520,#301050)',
  'ef-ambre':   'linear-gradient(160deg,#201008,#603020)',
  'ef-bleu':    'linear-gradient(160deg,#050a20,#102050)',
  'bf-gold':    'linear-gradient(160deg,#100800,#403000)',
  'bf-red':     'linear-gradient(160deg,#100000,#400800)',
  'bf-green':   'linear-gradient(160deg,#010800,#082010)',
  'bf-blue':    'linear-gradient(160deg,#000510,#001030)',
  'nf-cyan':    'linear-gradient(160deg,#020010,#002020)',
  'nf-pink':    'linear-gradient(160deg,#100008,#300018)',
  'nf-green':   'linear-gradient(160deg,#001008,#002018)',
  'ci-space':   'linear-gradient(160deg,#020210,#050520)',
  'ci-desert':  'linear-gradient(160deg,#1a0800,#402000)',
  'lf-coral':   'linear-gradient(135deg,#1a0510,#501830)',
  'lf-ocean':   'linear-gradient(135deg,#040e20,#0a2040)',
  'lf-forest':  'linear-gradient(135deg,#020a04,#061808)',
};

function th(cls: string, label: string): ThemeOption {
  return { cls, label, gradient: TH[cls] || '#111' };
}

/** The complete registry of 40 frame styles */
export const FRAMES: FrameMeta[] = [
  // ── GRATUIT (10 styles) ──
  { id: 'minimal',    label: '◻️ Minimal',    isPro: false, moods: ['paix','gratitude'],           component: FrameMinimal,    hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'typo',       label: '🖤 Typo',       isPro: false, moods: ['energie','anxiete'],           component: FrameTypo,       hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'journal',    label: '📓 Journal',    isPro: false, moods: ['melancholie','nostalgie'],      component: FrameJournal,    hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'manuscrit',  label: '🖊️ Manuscrit',  isPro: false, moods: ['melancholie','paix'],           component: FrameManuscrit,  hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'polaroid',   label: '📷 Polaroid',   isPro: false, moods: ['nostalgie','amour'],            component: FramePolaroid,   hasPhoto: true,  hasThemes: true,
    themes: [th('bg-sunset','Coucher'),th('bg-night','Nuit'),th('bg-forest','Forêt'),th('bg-desert','Désert'),th('bg-ocean','Océan'),th('bg-rose','Rose')],
    noGrain: false, noVignette: false },
  { id: 'cinema',     label: '🎬 Cinéma',     isPro: false, moods: ['melancholie','amour'],          component: FrameCinema,     hasPhoto: false, hasThemes: true,
    themes: [th('ci-space','Espace'),th('ci-desert','Désert')],
    noGrain: false, noVignette: false },
  { id: 'poetique',   label: '🌸 Poétique',   isPro: false, moods: ['amour','melancholie'],          component: FramePoetique,   hasPhoto: false, hasThemes: true,
    themes: [th('ef-rose','Rose'),th('ef-lilas','Lilas'),th('ef-ambre','Ambre'),th('ef-bleu','Bleu')],
    noGrain: false, noVignette: false },
  { id: 'elegant',    label: '✨ Élégant',    isPro: false, moods: ['amour','gratitude'],            component: FrameElegant,    hasPhoto: false, hasThemes: true,
    themes: [th('ef-rose','Rose'),th('ef-lilas','Lilas'),th('ef-ambre','Ambre'),th('ef-bleu','Bleu')],
    noGrain: false, noVignette: false },
  { id: 'bold',       label: '💪 Bold',       isPro: false, moods: ['energie','colere'],             component: FrameBold,       hasPhoto: false, hasThemes: true,
    themes: [th('bf-gold','Or'),th('bf-red','Rouge'),th('bf-green','Vert'),th('bf-blue','Bleu')],
    noGrain: false, noVignette: false },
  { id: 'aquarelle',  label: '🎨 Aquarelle',  isPro: false, moods: ['paix','amour'],                component: FrameAquarelle,  hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },

  // ── PRO (30 styles) ──
  { id: 'glitch',     label: '⚡ Glitch',     isPro: true,  moods: ['anxiete','energie','colere'],   component: FrameGlitch,     hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'cosmos',     label: '🌌 Cosmos',     isPro: true,  moods: ['melancholie','anxiete'],        component: FrameCosmos,     hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'vhs',        label: '📼 VHS',        isPro: true,  moods: ['nostalgie'],                    component: FrameVhs,        hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'retrowave',  label: '🌆 Retrowave',  isPro: true,  moods: ['energie','nostalgie'],          component: FrameRetrowave,  hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'luxe',       label: '👑 Luxe',       isPro: true,  moods: ['gratitude','amour'],            component: FrameLuxe,       hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'sms',        label: '📱 SMS',        isPro: true,  moods: ['anxiete','energie'],            component: FrameSms,        hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'neon',       label: '🌃 Néon',       isPro: true,  moods: ['energie','colere'],             component: FrameNeon,       hasPhoto: false, hasThemes: true,
    themes: [th('nf-cyan','Cyan'),th('nf-pink','Rose'),th('nf-green','Vert')],
    noGrain: false, noVignette: false },
  { id: 'magazine',   label: '📰 Magazine',   isPro: true,  moods: ['energie'],                      component: FrameMagazine,   hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'brule',      label: '🔥 Brûlé',     isPro: true,  moods: ['colere','nostalgie'],           component: FrameBrule,      hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'street',     label: '🎤 Street',     isPro: true,  moods: ['energie','colere'],             component: FrameStreet,     hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'retro',      label: '🌻 Rétro 70s',  isPro: true,  moods: ['nostalgie','energie'],          component: FrameRetro,      hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'presse',     label: '📋 Presse',     isPro: true,  moods: ['energie','anxiete'],            component: FramePresse,     hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'liquid',     label: '🌊 Dégradé',    isPro: true,  moods: ['amour','paix'],                 component: FrameLiquid,     hasPhoto: false, hasThemes: true,
    themes: [th('lf-coral','Corail'),th('lf-ocean','Océan'),th('lf-forest','Forêt')],
    noGrain: false, noVignette: false },
  { id: 'zen',        label: '🍃 Zen',        isPro: true,  moods: ['paix','gratitude'],             component: FrameZen,        hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'blueprint',  label: '📐 Blueprint',  isPro: true,  moods: ['anxiete','energie'],            component: FrameBlueprint,  hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'postit',     label: '📌 Post-it',    isPro: true,  moods: ['energie','gratitude'],          component: FramePostit,     hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'gothic',     label: '🖤 Gothique',   isPro: true,  moods: ['colere','melancholie'],         component: FrameGothic,     hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'lofi',       label: '🎵 Lo-fi',      isPro: true,  moods: ['melancholie','amour'],          component: FrameLofi,       hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'ticket',     label: '🧾 Ticket',     isPro: true,  moods: ['anxiete','nostalgie'],          component: FrameTicket,     hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'miami',      label: '🌴 Miami',      isPro: true,  moods: ['energie','amour'],              component: FrameMiami,      hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'encre',      label: '🖋️ Encre',      isPro: true,  moods: ['gratitude','paix'],             component: FrameEncre,      hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'paris',      label: '🗼 Paris',      isPro: true,  moods: ['amour','nostalgie'],            component: FrameParis,      hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'broadcast',  label: '📡 Breaking',   isPro: true,  moods: ['colere','energie'],             component: FrameBroadcast,  hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'craie',      label: '🖍️ Craie',      isPro: true,  moods: ['melancholie','paix'],           component: FrameCraie,      hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'sticker',    label: '⭐ Sticker',    isPro: true,  moods: ['energie','gratitude'],          component: FrameSticker,    hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'philo',      label: '📚 Philosophie', isPro: true,  moods: ['gratitude','paix'],             component: FramePhilo,      hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'tropical',   label: '🌿 Tropical',   isPro: true,  moods: ['paix','energie'],               component: FrameTropical,   hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'argentique', label: '📸 Argentique', isPro: true,  moods: ['nostalgie','melancholie'],      component: FrameArgentique, hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'mono',       label: '⬛ Monochrome', isPro: true,  moods: ['anxiete','colere'],             component: FrameMono,       hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'crystal',    label: '💎 Cristal',    isPro: true,  moods: ['gratitude','amour'],            component: FrameCrystal,    hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
];

/** Get frames compatible with a mood */
export function getFramesForMood(moodId: string, isPro: boolean): FrameMeta[] {
  return FRAMES.filter(f =>
    f.moods.includes(moodId) && (isPro || !f.isPro)
  );
}

/** Get the default recommended frame for a mood */
export function getDefaultFrame(moodId: string, isPro: boolean): FrameMeta {
  const compatible = getFramesForMood(moodId, isPro);
  // FRAMES[0] is always defined since we have 40 statically-defined entries
  return compatible[0] ?? FRAMES[0]!;
}
