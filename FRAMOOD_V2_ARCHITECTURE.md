# FRAMOOD V2 — Plan d'Architecture & Migration Complète
> **Rôle de ce document :** Plan d'exécution pour le codeur. Chaque décision est tranchée. Chaque ambiguïté est résolue.  
> **Stack cible :** React 18 + TypeScript + Vite 5 + Tailwind v3 + Insforge + PWA  
> **Principe :** On migre le meilleur du prototype HTML (40 styles, design system, API Claude) vers une architecture moderne, persistante, et rémunérable.

---

## Table des Matières

1. [Décisions d'Architecture](#1-décisions-darchitecture)
2. [Structure du Projet](#2-structure-du-projet)
3. [Design System](#3-design-system)
4. [Base de Données](#4-base-de-données-insforge)
5. [Roadmap par Phase](#5-roadmap-par-phase)
6. [Modèle de Monétisation](#6-modèle-de-monétisation)
7. [Configuration PWA & Desktop](#7-configuration-pwa--desktop)
8. [Règles de Code](#8-règles-de-code)

---

# 1. Décisions d'Architecture

## 1.1 Stack Technique — Décisions Tranchées

| Couche | Choix | Raison |
|--------|-------|--------|
| **Framework** | React 18 + TypeScript | TypeScript obligatoire sur un projet qui va grossir — évite 80% des bugs runtime |
| **Build** | Vite 5 | Déjà dans le projet précédent, HMR ultra-rapide |
| **Styling** | Tailwind CSS v3 + CSS Variables | Tailwind pour la vélocité, CSS Variables pour le design system émotionnel |
| **Animations** | Framer Motion | Déjà maîtrisé, API simple, performant sur mobile |
| **Icônes** | Lucide React | Cohérent, moderne, tree-shakeable — aucune icône emoji en dur |
| **State global** | Zustand | Plus simple que Redux, plus puissant que Context pour ce use-case |
| **State serveur** | TanStack Query v5 | Cache intelligent, sync auto, loading/error states gérés |
| **Routing** | React Router v6 | Standard, bien documenté |
| **Backend** | Insforge BaaS | Déjà configuré avec RLS PostgreSQL |
| **Paiement** | Stripe | Standard, webhooks fiables, dashboard clair |
| **Export image** | html-to-image | Déjà utilisé dans le prototype, remplace html2canvas |
| **Effets Pro** | Canvas 2D API | Pour grain, vignette, bokeh — jamais feTurbulence CSS (trop lent) |
| **PWA** | vite-plugin-pwa | Zéro config, Service Worker automatique |
| **Push Notifs** | Web Push API + Service Worker | Natif PWA, pas de SDK tiers |

## 1.2 La Décision Clé : Comment Migrer les 40 Styles

Le prototype a 40 styles HTML/CSS brillants. Voici comment les intégrer dans React **sans les réécrire** :

```
Chaque style HTML devient un composant React <StyleXxx />
Chaque composant reçoit les mêmes props : { text, subtext, tag, theme, textColor }
Le CSS existant est copié tel quel dans un fichier styles/frames/[nom].css
```

**Les 40 styles sont répartis en 2 catégories :**

| Catégorie | Styles | Accès |
|-----------|--------|-------|
| **Libre (Gratuit)** | Minimal, Typo, Journal, Manuscrit, Polaroid, Cinéma, Poétique, Élégant, Bold, Aquarelle | ✅ Tous les utilisateurs |
| **Premium** | Les 30 styles restants (Glitch, Cosmos, VHS, Retrowave, Luxe, etc.) | 🔒 Abonnés Pro |

## 1.3 L'Ajout Majeur : Le Moteur IA

Ce qui manquait dans le prototype — et qui justifie l'abonnement :

```
Utilisateur entre son humeur (3 secondes)
         ↓
Claude API génère automatiquement :
  - Le texte de la création (citation / pensée / mot)
  - Sélectionne le meilleur style parmi les compatibles
  - Choisit le thème de couleur optimal
         ↓
Image générée, prête à exporter
```

L'utilisateur garde toujours la main pour modifier — mais la génération automatique est le cœur du produit.

---

# 2. Structure du Projet

```
framood/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker (généré par vite-plugin-pwa)
│   └── icons/                 # Icônes PWA (72, 96, 128, 144, 152, 192, 384, 512px)
│
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Router principal
│   │
│   ├── lib/                   # ← MOTEURS PURS (zéro React)
│   │   ├── emotion-engine.ts  # Mappage humeur → style → thème
│   │   ├── ai-generator.ts    # Appel Claude API (migré depuis prototype)
│   │   ├── export-engine.ts   # Export PNG/WebM + effets Canvas
│   │   ├── film-grain.ts      # Effets Pro Canvas (grain, vignette, bokeh)
│   │   ├── streak-engine.ts   # Logique streak (calculs purs)
│   │   ├── conversion.ts      # Déclencheurs freemium → Pro
│   │   └── dates.ts           # Helpers date (via date-fns)
│   │
│   ├── store/                 # ← ÉTAT GLOBAL (Zustand)
│   │   ├── useAuthStore.ts    # Utilisateur connecté + plan (free/pro)
│   │   ├── useStudioStore.ts  # État du Studio (humeur, style, texte courant)
│   │   └── useStreakStore.ts  # Streak local (optimistic update)
│   │
│   ├── hooks/                 # ← HOOKS CUSTOM
│   │   ├── useEntries.ts      # TanStack Query : CRUD mood_entries
│   │   ├── useStreak.ts       # Streak sync Insforge
│   │   ├── useSubscription.ts # Plan actuel + actions Stripe
│   │   ├── usePulse.ts        # Pouls du Monde (Realtime)
│   │   └── useExport.ts       # Export avec état loading/error
│   │
│   ├── components/
│   │   ├── ui/                # ← COMPOSANTS ATOMS (réutilisables)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── BottomSheet.tsx  # Mobile-first — remplace les modals sur < 768px
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx     # Layout principal PWA (nav bottom mobile, nav side desktop)
│   │   │   ├── BottomNav.tsx    # Navigation mobile (4 onglets)
│   │   │   ├── SideNav.tsx      # Navigation desktop (sidebar)
│   │   │   └── PageTransition.tsx  # Transitions Framer Motion entre pages
│   │   │
│   │   ├── checkin/
│   │   │   ├── CheckIn.tsx      # Interface check-in (une question, < 8 secondes)
│   │   │   ├── MoodPicker.tsx   # Sélecteur d'humeur (8 humeurs + chips)
│   │   │   ├── IntensitySlider.tsx
│   │   │   └── QuickWords.tsx   # Input mot rapide
│   │   │
│   │   ├── studio/
│   │   │   ├── Studio.tsx       # Conteneur principal du Studio
│   │   │   ├── PhoneFrame.tsx   # Le cadre téléphone (migré depuis prototype)
│   │   │   ├── StyleSelector.tsx # Carrousel de styles (Free + Pro locked)
│   │   │   ├── ThemeSelector.tsx # Sélecteur de thème de couleur
│   │   │   ├── ExportBar.tsx    # Barre d'export fixe en bas
│   │   │   └── FormatPicker.tsx # Story / Wallpaper / Carré / Desktop
│   │   │
│   │   ├── frames/              # ← LES 40 STYLES (composants React)
│   │   │   ├── FramePolaroid.tsx
│   │   │   ├── FrameTypo.tsx
│   │   │   ├── FrameElegant.tsx
│   │   │   ├── FrameBold.tsx
│   │   │   ├── FrameCinema.tsx
│   │   │   ├── FrameNeon.tsx
│   │   │   ├── FrameJournal.tsx
│   │   │   ├── FrameGlitch.tsx
│   │   │   ├── FrameCosmos.tsx
│   │   │   ├── ... (40 total)
│   │   │   └── index.ts         # Export centralisé + registry
│   │   │
│   │   ├── gallery/
│   │   │   ├── Gallery.tsx      # Galerie principale
│   │   │   ├── HeatMap.tsx      # Bande de chaleur émotionnelle
│   │   │   ├── EntryCard.tsx    # Card d'une entrée (avec lock si gratuit)
│   │   │   ├── EntryDetail.tsx  # Vue plein écran d'une entrée
│   │   │   └── MoodFilter.tsx   # Filtre par humeur
│   │   │
│   │   ├── streak/
│   │   │   ├── StreakWidget.tsx    # Widget streak sur Home
│   │   │   └── StreakMilestone.tsx # Animation milestone (3j, 7j, 30j...)
│   │   │
│   │   ├── insights/
│   │   │   ├── InsightsPage.tsx
│   │   │   ├── WeeklyInsight.tsx
│   │   │   └── WrappedGenerator.tsx  # Wrapped mensuel/annuel
│   │   │
│   │   ├── pulse/
│   │   │   └── MoodPulse.tsx    # Pouls du Monde
│   │   │
│   │   └── subscription/
│   │       ├── PaywallModal.tsx    # Modal de conversion freemium → Pro
│   │       ├── PricingPage.tsx
│   │       └── LockedOverlay.tsx   # Overlay sur les styles/features Pro
│   │
│   ├── pages/                  # ← PAGES (= routes)
│   │   ├── Home.tsx            # Écran principal : Check-in + Streak
│   │   ├── Studio.tsx          # Studio de création
│   │   ├── Gallery.tsx         # Galerie + Timeline
│   │   ├── Insights.tsx        # Insights + Wrapped
│   │   ├── Pulse.tsx           # Pouls du Monde
│   │   ├── Settings.tsx        # Paramètres + compte
│   │   ├── Pricing.tsx         # Page tarifaire
│   │   ├── Auth.tsx            # Login / Register (OTP)
│   │   └── Onboarding.tsx      # 3 écrans d'onboarding (première visite)
│   │
│   ├── styles/
│   │   ├── globals.css         # Reset + variables CSS globales
│   │   ├── emotions.css        # Tokens CSS par humeur (source de vérité)
│   │   └── frames/             # CSS des 40 styles (migré depuis prototype)
│   │       ├── polaroid.css
│   │       ├── typo.css
│   │       └── ...
│   │
│   └── types/
│       ├── database.ts         # Types Insforge (générés depuis schema)
│       ├── emotion.ts          # Types humeurs, styles, configs
│       └── subscription.ts     # Types plans, statuts
│
├── .env.local                  # Variables d'env (jamais commit)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# 3. Design System

## 3.1 Palette de Couleurs (depuis le prototype)

```css
/* src/styles/globals.css */
:root {
  /* ── Palette de base (identique au prototype) ── */
  --gold:        #C8A050;
  --gold-light:  #E8C878;
  --gold-dark:   #8A6020;
  --gold-dim:    rgba(200, 160, 80, 0.15);

  --bg:          #0A0906;
  --card:        #131109;
  --card-2:      #181510;
  --border:      rgba(255, 255, 255, 0.07);
  --border-gold: rgba(200, 160, 80, 0.25);

  --cream:       #F0E8D0;
  --muted:       rgba(240, 232, 208, 0.38);
  --muted-2:     rgba(240, 232, 208, 0.55);

  /* ── Sémantique ── */
  --success:     #50C070;
  --warning:     #E8A020;
  --error:       #E05040;
  --info:        #5080E0;

  /* ── Espacements (8pt grid) ── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── Rayons ── */
  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  20px;
  --radius-xl:  28px;
  --radius-pill: 999px;

  /* ── Typographie ── */
  --font-display: 'Cormorant Garamond', serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'Space Mono', monospace;

  /* ── Ombres ── */
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:  0 8px 24px rgba(0,0,0,0.6);
  --shadow-lg:  0 20px 48px rgba(0,0,0,0.8);
  --shadow-gold: 0 0 24px rgba(200,160,80,0.15);

  /* ── Transitions ── */
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow:   400ms ease;
}
```

## 3.2 Tokens Émotionnels (source de vérité)

```css
/* src/styles/emotions.css */
/* Chaque humeur = un univers visuel complet */

[data-emotion="melancholie"] {
  --em-bg:             #1a2744;
  --em-bg-2:           #3d5a80;
  --em-text:           #e8eaf6;
  --em-accent:         #90a4ae;
  --em-font:           'Playfair Display', serif;
  --em-weight:         400;
  --em-spacing:        0.02em;
  --em-transform:      none;
  --em-grain:          0.45;
  --em-vignette:       0.70;
  --em-light-leak:     0;
  --em-styles:         'cosmos,aquarelle,manuscrit,poetique,cinema'; /* styles compatibles */
}
[data-emotion="energie"] {
  --em-bg:             #f59e0b;
  --em-bg-2:           #dc2626;
  --em-text:           #1c1917;
  --em-accent:         #fbbf24;
  --em-font:           'Inter', sans-serif;
  --em-weight:         900;
  --em-spacing:        -0.02em;
  --em-transform:      uppercase;
  --em-grain:          0.05;
  --em-vignette:       0.10;
  --em-light-leak:     0;
  --em-styles:         'bold,neon,retrowave,street,glitch';
}
[data-emotion="paix"] {
  --em-bg:             #d1fae5;
  --em-bg-2:           #6ee7b7;
  --em-text:           #064e3b;
  --em-accent:         #a7f3d0;
  --em-font:           'Cormorant Garamond', serif;
  --em-weight:         300;
  --em-spacing:        0.08em;
  --em-transform:      none;
  --em-grain:          0.15;
  --em-vignette:       0.20;
  --em-light-leak:     0;
  --em-styles:         'zen,minimal,aquarelle,tropical,journal';
}
[data-emotion="colere"] {
  --em-bg:             #1c0a0a;
  --em-bg-2:           #7f1d1d;
  --em-text:           #fef2f2;
  --em-accent:         #dc2626;
  --em-font:           'Oswald', sans-serif;
  --em-weight:         700;
  --em-spacing:        0.01em;
  --em-transform:      uppercase;
  --em-grain:          0.60;
  --em-vignette:       0.80;
  --em-light-leak:     0;
  --em-styles:         'gothic,glitch,bold,street,broadcast';
}
[data-emotion="nostalgie"] {
  --em-bg:             #78350f;
  --em-bg-2:           #b45309;
  --em-text:           #fef3c7;
  --em-accent:         #fcd34d;
  --em-font:           'Lora', serif;
  --em-weight:         400;
  --em-spacing:        0.04em;
  --em-transform:      none;
  --em-grain:          0.55;
  --em-vignette:       0.60;
  --em-light-leak:     1;
  --em-styles:         'polaroid,argentique,vhs,retro,journal';
}
[data-emotion="amour"] {
  --em-bg:             #4c0519;
  --em-bg-2:           #9f1239;
  --em-text:           #fff1f2;
  --em-accent:         #fb7185;
  --em-font:           'Nunito', sans-serif;
  --em-weight:         300;
  --em-spacing:        0.03em;
  --em-transform:      none;
  --em-grain:          0.10;
  --em-vignette:       0.35;
  --em-light-leak:     0;
  --em-styles:         'elegant,poetique,paris,lofi,liquid';
}
[data-emotion="anxiete"] {
  --em-bg:             #0f2027;
  --em-bg-2:           #203a43;
  --em-text:           #e2e8f0;
  --em-accent:         #64748b;
  --em-font:           'Space Mono', monospace;
  --em-weight:         400;
  --em-spacing:        0em;
  --em-transform:      none;
  --em-grain:          0.70;
  --em-vignette:       0.50;
  --em-light-leak:     0;
  --em-styles:         'blueprint,glitch,sms,ticket,mono';
}
[data-emotion="gratitude"] {
  --em-bg:             #1c1403;
  --em-bg-2:           #713f12;
  --em-text:           #fefce8;
  --em-accent:         #facc15;
  --em-font:           'Crimson Text', serif;
  --em-weight:         400;
  --em-spacing:        0.05em;
  --em-transform:      none;
  --em-grain:          0.20;
  --em-vignette:       0.25;
  --em-light-leak:     0;
  --em-styles:         'luxe,philo,encre,crystal,minimal';
}
```

## 3.3 Typographie

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      // Échelle typographique (toutes les tailles en rem)
      fontSize: {
        'xs':   ['0.688rem', { lineHeight: '1.4', letterSpacing: '0.03em' }],  // 11px
        'sm':   ['0.75rem',  { lineHeight: '1.5' }],                           // 12px
        'base': ['0.875rem', { lineHeight: '1.6' }],                           // 14px
        'md':   ['1rem',     { lineHeight: '1.5' }],                           // 16px ← min mobile
        'lg':   ['1.125rem', { lineHeight: '1.4' }],                           // 18px
        'xl':   ['1.25rem',  { lineHeight: '1.3' }],                           // 20px
        '2xl':  ['1.5rem',   { lineHeight: '1.25' }],                          // 24px
        '3xl':  ['2rem',     { lineHeight: '1.15' }],                          // 32px
        '4xl':  ['2.5rem',   { lineHeight: '1.1' }],                           // 40px
        'hero': ['clamp(3rem, 8vw, 5.75rem)', { lineHeight: '1.0' }],         // responsive
      },
    }
  }
}
```

## 3.4 Google Fonts à Charger

```html
<!-- index.html — uniquement les fonts nécessaires, display=swap obligatoire -->
<link href="https://fonts.googleapis.com/css2?
  family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400;1,600
  &family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300
  &family=Bebas+Neue
  &family=Playfair+Display:ital,wght@0,700;0,900;1,400
  &family=Space+Mono:wght@400;700
  &family=Oswald:wght@400;700
  &family=Lora:ital,wght@0,400;0,700;1,400
  &family=Nunito:wght@300;400;600
  &family=Crimson+Text:ital,wght@0,400;0,600;1,400
  &family=Caveat:wght@600;700
  &family=Ephesis
  &family=Italiana
  &display=swap" rel="stylesheet">
```

## 3.5 Composants UI Core

### Button

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size:    'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?:    React.ReactNode;  // Lucide icon
  fullWidth?: boolean;
}
```

Variants :
- `primary` → fond gold `#C8A050`, texte `#0A0600`, hover `#E8C878`
- `secondary` → bordure gold 1px, fond transparent, texte gold
- `ghost` → fond `rgba(255,255,255,0.04)`, bordure `var(--border)`
- `danger` → fond `#E05040`, texte blanc

### BottomSheet (mobile-first)

Remplace les modals sur mobile. S'ouvre par le bas, drag pour fermer. Utilisé pour : StyleSelector, FormatPicker, PaywallModal sur mobile.

### Toast

```typescript
// 3 niveaux : success (vert), info (gold), error (rouge)
// Position : bottom-center sur mobile, top-right sur desktop
// Auto-dismiss : 3 secondes
// Icône Lucide obligatoire
```

---

# 4. Base de Données Insforge

## 4.1 Tables

### `mood_entries` (principale)
```sql
CREATE TABLE mood_entries (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Check-in
  mood_category     VARCHAR(20) NOT NULL,  -- 'melancholie'|'energie'|'paix'|'colere'|'nostalgie'|'amour'|'anxiete'|'gratitude'
  mood_text         TEXT,                  -- texte libre ou généré par IA
  intensity_score   SMALLINT    CHECK (intensity_score BETWEEN 0 AND 10),

  -- Studio
  style_id          VARCHAR(30) NOT NULL,  -- 'polaroid', 'cosmos', etc.
  style_config      JSONB       DEFAULT '{}', -- { theme, textColor, subtext, tag, ... }
  image_url         TEXT,                  -- URL Insforge Storage de l'image exportée
  export_format     VARCHAR(20) DEFAULT 'story',

  -- Social
  is_shared_globally BOOLEAN    DEFAULT false,

  -- Génération IA
  ai_generated      BOOLEAN     DEFAULT false,
  ai_prompt         TEXT        -- prompt utilisateur si génération IA
);

-- Index
CREATE INDEX idx_mood_entries_user_date ON mood_entries (user_id, created_at DESC);
CREATE INDEX idx_mood_entries_mood      ON mood_entries (user_id, mood_category);
CREATE INDEX idx_mood_entries_shared    ON mood_entries (is_shared_globally, created_at DESC);

-- RLS
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entries_own" ON mood_entries USING (user_id = auth.uid());
```

### `user_streaks`
```sql
CREATE TABLE user_streaks (
  user_id             UUID  PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak      INT   NOT NULL DEFAULT 0,
  longest_streak      INT   NOT NULL DEFAULT 0,
  last_checkin_date   DATE,
  total_entries       INT   NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks_own" ON user_streaks USING (user_id = auth.uid());
```

### `subscriptions`
```sql
CREATE TABLE subscriptions (
  user_id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                 VARCHAR(20) NOT NULL DEFAULT 'free'
                         CHECK (plan IN ('free', 'pro', 'pro_annual')),
  status               VARCHAR(20) NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  stripe_customer_id   TEXT,
  stripe_sub_id        TEXT,
  current_period_end   TIMESTAMPTZ,
  trial_end            TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sub_own" ON subscriptions USING (user_id = auth.uid());
```

### `global_mood_pulse`
```sql
CREATE TABLE global_mood_pulse (
  mood_category VARCHAR(20) PRIMARY KEY,
  count_active  INT NOT NULL DEFAULT 0,   -- 60 dernières minutes
  count_today   INT NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed
INSERT INTO global_mood_pulse (mood_category) VALUES
  ('melancholie'),('energie'),('paix'),('colere'),
  ('nostalgie'),('amour'),('anxiete'),('gratitude');

-- Lecture publique, écriture authentifiée uniquement
ALTER TABLE global_mood_pulse ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pulse_read"  ON global_mood_pulse FOR SELECT USING (true);
CREATE POLICY "pulse_write" ON global_mood_pulse FOR UPDATE
  USING (auth.role() = 'authenticated');
```

### `user_profiles` (complément auth.users)
```sql
CREATE TABLE user_profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,
  onboarded       BOOLEAN     DEFAULT false,  -- a vu l'onboarding
  notifications_enabled BOOLEAN DEFAULT false,
  notification_hour INT,                       -- heure habituelle (0-23, détectée auto)
  signup_date     DATE        DEFAULT CURRENT_DATE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON user_profiles USING (id = auth.uid());
```

## 4.2 Fonctions SQL

```sql
-- Reset du count_active toutes les 60 minutes (cron job Insforge)
CREATE OR REPLACE FUNCTION reset_pulse_active()
RETURNS void LANGUAGE sql AS $$
  UPDATE global_mood_pulse
  SET count_active = 0, updated_at = NOW()
  WHERE updated_at < NOW() - INTERVAL '60 minutes';
$$;

-- Reset du count_today à minuit UTC (cron job Insforge)
CREATE OR REPLACE FUNCTION reset_pulse_daily()
RETURNS void LANGUAGE sql AS $$
  UPDATE global_mood_pulse SET count_today = 0, updated_at = NOW();
$$;

-- Mise à jour du streak après check-in
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_last DATE;
  v_current INT;
  v_longest INT;
BEGIN
  SELECT last_checkin_date, current_streak, longest_streak
  INTO v_last, v_current, v_longest
  FROM user_streaks WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_checkin_date, total_entries)
    VALUES (p_user_id, 1, 1, CURRENT_DATE, 1);
    RETURN;
  END IF;

  -- Déjà fait aujourd'hui → juste incrémenter total
  IF v_last = CURRENT_DATE THEN
    UPDATE user_streaks SET total_entries = total_entries + 1 WHERE user_id = p_user_id;
    RETURN;
  END IF;

  -- Hier → streak maintenu
  IF v_last = CURRENT_DATE - 1 THEN
    v_current := v_current + 1;
  ELSE
    -- Streak cassé
    v_current := 1;
  END IF;

  UPDATE user_streaks SET
    current_streak    = v_current,
    longest_streak    = GREATEST(v_longest, v_current),
    last_checkin_date = CURRENT_DATE,
    total_entries     = total_entries + 1,
    updated_at        = NOW()
  WHERE user_id = p_user_id;
END;
$$;
```

---

# 5. Roadmap par Phase

> **Règle absolue :** Chaque phase doit être validée par ses Acceptance Criteria avant de démarrer la suivante.

---

## Phase 0 — Setup (2–3 jours)

**Objectif :** Projet initialisé, toutes les dépendances installées, connexion Insforge fonctionnelle.

### Installation

```bash
npm create vite@latest framood -- --template react-ts
cd framood
npm install

# Core
npm install react-router-dom @tanstack/react-query zustand framer-motion

# UI
npm install tailwindcss @tailwindcss/forms autoprefixer postcss
npm install lucide-react
npm install clsx tailwind-merge  # utilitaires classnames

# Insforge
npm install @insforge/sdk @insforge/react

# Export
npm install html-to-image date-fns

# PWA
npm install -D vite-plugin-pwa workbox-window

# Paiement
npm install @stripe/stripe-js

# Fonts (self-hosted via fontsource — pas de Google Fonts en prod)
npm install @fontsource/cormorant-garamond @fontsource/dm-sans
npm install @fontsource/playfair-display @fontsource/space-mono
npm install @fontsource/oswald @fontsource/lora @fontsource/nunito
npm install @fontsource/bebas-neue @fontsource/caveat
```

### Configuration Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'fonts/*.woff2'],
      manifest: {
        name: 'Framood',
        short_name: 'Framood',
        description: 'Ton humeur, encadrée.',
        theme_color: '#0A0906',
        background_color: '#0A0906',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,woff2}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/fonts\./,
          handler: 'CacheFirst',
          options: { cacheName: 'fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } }
        }],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### Variables d'Environnement

```bash
# .env.local (JAMAIS commit)
VITE_INSFORGE_URL=https://xxx.insforge.com
VITE_INSFORGE_ANON_KEY=xxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_ANTHROPIC_KEY=sk-ant-xxx  # ⚠️ Voir note sécurité ci-dessous
```

> ⚠️ **Note sécurité clé Claude :** La clé Anthropic ne doit PAS être exposée en frontend en production. Deux options : (a) passer par une Edge Function Insforge qui proxy l'appel, (b) utiliser l'API Claude via un backend serverless. En développement, la clé côté client est acceptable temporairement.

### Acceptance Criteria Phase 0
- [ ] `npm run dev` démarre sans erreur
- [ ] `npm run build` produit un bundle sans erreur
- [ ] Connexion Insforge fonctionnelle (test : lecture d'une table vide)
- [ ] PWA installable sur iPhone (bouton "Ajouter à l'écran d'accueil" visible)
- [ ] Lighthouse PWA Score ≥ 90

---

## Phase 1 — Authentification & Navigation (3–4 jours)

**Objectif :** L'utilisateur peut créer un compte, se connecter, et naviguer entre les pages.

### Routes

```typescript
// src/App.tsx
const router = createBrowserRouter([
  { path: '/auth',        element: <Auth /> },
  { path: '/onboarding',  element: <Onboarding /> },
  {
    path: '/',
    element: <AppShell />,  // layout avec nav
    children: [
      { index: true,        element: <Home /> },
      { path: 'studio',     element: <StudioPage /> },
      { path: 'gallery',    element: <GalleryPage /> },
      { path: 'insights',   element: <InsightsPage /> },
      { path: 'pulse',      element: <PulsePage /> },
      { path: 'settings',   element: <Settings /> },
      { path: 'pricing',    element: <Pricing /> },
    ],
  },
]);
```

### Navigation Mobile (Bottom Nav)

4 onglets, icônes Lucide, label court :

| Onglet | Icône Lucide | Route |
|--------|-------------|-------|
| Accueil | `Home` | `/` |
| Studio | `Sparkles` | `/studio` |
| Galerie | `Images` | `/gallery` |
| Moi | `User` | `/settings` |

### Navigation Desktop (Sidebar)

Sidebar fixe 240px gauche, logo en haut, navigation verticale, plan actuel en bas.

### Acceptance Criteria Phase 1
- [ ] Inscription avec email OTP fonctionne
- [ ] Connexion avec email OTP fonctionne
- [ ] Déconnexion fonctionne
- [ ] Onboarding de 3 écrans s'affiche à la première connexion, jamais après
- [ ] Navigation mobile : 4 onglets, page active correctement highlightée
- [ ] Navigation desktop : sidebar visible sur ≥ 768px, cachée sur mobile
- [ ] Redirections : `/` redirige vers `/auth` si non connecté
- [ ] Transitions de page fluides (Framer Motion, aucun flash blanc)

---

## Phase 2 — Migration des 40 Styles (4–5 jours)

**Objectif :** Les 40 styles du prototype HTML fonctionnent comme composants React identiques visuellement.

### Pattern de Composant Frame

```typescript
// src/components/frames/FramePolaroid.tsx
interface FrameProps {
  text:      string;      // texte principal
  subtext?:  string;      // texte secondaire
  tag?:      string;      // tag/rubrique
  theme?:    string;      // classe CSS thème ('bg-sunset', etc.)
  textColor?:'light'|'dark';
  photoUrl?: string;      // pour les styles qui acceptent une photo
  rotation?: number;      // pour Polaroid
}

export function FramePolaroid({ text, subtext, tag, theme = 'bg-sunset', rotation = -3, photoUrl }: FrameProps) {
  // JSX identique au HTML du prototype, CSS importé depuis styles/frames/polaroid.css
}
```

### Registry Central

```typescript
// src/components/frames/index.ts
import type { ComponentType } from 'react';

export interface FrameMeta {
  id:        string;
  label:     string;
  component: ComponentType<FrameProps>;
  isPro:     boolean;
  moods:     string[];    // humeurs compatibles
  hasPhoto:  boolean;
  hasThemes: boolean;
  themes?:   { cls: string; label: string }[];
  noGrain:   boolean;
  noVignette:boolean;
}

export const FRAMES: FrameMeta[] = [
  // ── GRATUIT (10 styles) ──────────────────────────────
  { id: 'minimal',    label: '◻️ Minimal',    isPro: false, moods: ['paix','gratitude'],           component: FrameMinimal,    hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'typo',       label: '🖤 Typo',       isPro: false, moods: ['energie','anxiete'],           component: FrameTypo,       hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'journal',    label: '📓 Journal',    isPro: false, moods: ['melancholie','nostalgie'],      component: FrameJournal,    hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'manuscrit',  label: '🖊️ Manuscrit',  isPro: false, moods: ['melancholie','paix'],           component: FrameManuscrit,  hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },
  { id: 'polaroid',   label: '📷 Polaroid',   isPro: false, moods: ['nostalgie','amour'],            component: FramePolaroid,   hasPhoto: true,  hasThemes: true,  noGrain: false, noVignette: false },
  { id: 'cinema',     label: '🎬 Cinéma',     isPro: false, moods: ['melancholie','amour'],          component: FrameCinema,     hasPhoto: false, hasThemes: true,  noGrain: false, noVignette: false },
  { id: 'poetique',   label: '🌸 Poétique',   isPro: false, moods: ['amour','melancholie'],          component: FramePoetique,   hasPhoto: false, hasThemes: true,  noGrain: false, noVignette: false },
  { id: 'elegant',    label: '✨ Élégant',    isPro: false, moods: ['amour','gratitude'],            component: FrameElegant,    hasPhoto: false, hasThemes: true,  noGrain: false, noVignette: false },
  { id: 'bold',       label: '💪 Bold',       isPro: false, moods: ['energie','colere'],             component: FrameBold,       hasPhoto: false, hasThemes: true,  noGrain: false, noVignette: false },
  { id: 'aquarelle',  label: '🎨 Aquarelle',  isPro: false, moods: ['paix','amour'],                component: FrameAquarelle,  hasPhoto: false, hasThemes: false, noGrain: true,  noVignette: true  },

  // ── PRO (30 styles) ──────────────────────────────────
  { id: 'glitch',     label: '⚡ Glitch',     isPro: true,  moods: ['anxiete','energie','colere'],   component: FrameGlitch,     hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'cosmos',     label: '🌌 Cosmos',     isPro: true,  moods: ['melancholie','anxiete'],        component: FrameCosmos,     hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'vhs',        label: '📼 VHS',        isPro: true,  moods: ['nostalgie'],                    component: FrameVhs,        hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'retrowave',  label: '🌆 Retrowave',  isPro: true,  moods: ['energie','nostalgie'],          component: FrameRetrowave,  hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  { id: 'luxe',       label: '👑 Luxe',       isPro: true,  moods: ['gratitude','amour'],            component: FrameLuxe,       hasPhoto: false, hasThemes: false, noGrain: false, noVignette: false },
  // ... (25 autres styles Pro)
];

// Helper : styles disponibles pour une humeur
export function getFramesForMood(moodId: string, isPro: boolean): FrameMeta[] {
  return FRAMES.filter(f =>
    f.moods.includes(moodId) && (isPro || !f.isPro)
  );
}

// Helper : style recommandé automatiquement pour une humeur
export function getDefaultFrame(moodId: string, isPro: boolean): FrameMeta {
  const compatible = getFramesForMood(moodId, isPro);
  return compatible[0] ?? FRAMES[0];
}
```

### Acceptance Criteria Phase 2
- [ ] Les 40 styles s'affichent visuellement identiques au prototype HTML (comparaison côte à côte)
- [ ] Le StyleSelector affiche les styles gratuits normalement et les styles Pro avec un overlay cadenas
- [ ] Cliquer sur un style Pro déclenche le PaywallModal
- [ ] Le PhoneFrame a les mêmes dimensions et ombres que le prototype (188×384px, border-radius 34px)
- [ ] Aucun style ne crashe avec un texte vide (fallback gracieux)

---

## Phase 3 — Check-in & Génération IA (4–5 jours)

**Objectif :** Le flux principal fonctionne — check-in → génération IA → Studio → Export.

### Flux Complet

```
Home (StreakWidget visible)
    ↓ tap "Nouveau check-in"
CheckIn (une question contextuelle)
    ↓ réponse (< 8 secondes)
    ↓ appel Claude API (génération texte + sélection style)
Studio (image générée automatiquement)
    ↓ optionnel : modifier style, texte, thème
    ↓ tap "Exporter"
FormatPicker (Story / Wallpaper / Carré)
    ↓ export Canvas + effets Pro
    ↓ navigator.share() ou clipboard
Entrée sauvegardée en DB (mood_entries)
streak mis à jour (update_streak())
global_mood_pulse incrémenté si partagé
```

### Le Prompt Claude Optimisé

```typescript
// src/lib/ai-generator.ts

const SYSTEM_PROMPT = `Tu es le moteur créatif de Framood, une app de création visuelle émotionnelle.

L'utilisateur vient de décrire son humeur. Tu dois générer :
1. Un texte principal court et percutant (max 12 mots) — c'est ce qui sera affiché en grand
2. Un texte secondaire optionnel (max 20 mots) — sous-titre ou contexte
3. Un tag court (max 2 mots) — catégorisation poétique

Règles absolues :
- Jamais de guillemets dans le texte principal
- Jamais de hashtags
- Jamais de ponctuation excessive
- Toujours en accord avec l'émotion décrite — ne pas édulcorer
- Les textes doivent avoir de l'impact visuel (mots forts, rythme)

Réponds UNIQUEMENT en JSON, sans markdown, sans explications :
{
  "main_text": "...",
  "sub_text": "...",
  "tag": "...",
  "suggested_mood": "melancholie|energie|paix|colere|nostalgie|amour|anxiete|gratitude",
  "suggested_style": "polaroid|typo|elegant|...",
  "confidence": 0.0-1.0
}`;
```

### Acceptance Criteria Phase 3
- [ ] Ouverture app → image générée ≤ 8 secondes (iPhone 12 Chrome, réseau 4G)
- [ ] La génération Claude retourne du JSON valide 100% du temps (test avec 20 humeurs différentes)
- [ ] En cas d'erreur Claude, un fallback est proposé (texte de l'utilisateur brut dans un style minimal)
- [ ] L'export Story fait 1080×1920px à pixelRatio 3 minimum
- [ ] Le bouton de partage fonctionne sur iOS Safari + Android Chrome
- [ ] Le watermark "Framood" est présent sur 100% des exports
- [ ] Chaque check-in crée une entrée en DB et met à jour le streak
- [ ] Le StreakWidget sur Home reflète le streak réel immédiatement après check-in

---

## Phase 4 — Galerie & Mémoire (4–5 jours)

**Objectif :** La galerie chronologique avec bande de chaleur est fonctionnelle. L'utilisateur commence à ressentir l'attachement à son historique.

### Acceptance Criteria Phase 4
- [ ] La galerie charge les 20 premières entrées en < 1.5 secondes
- [ ] La pagination (infinite scroll) charge les suivantes automatiquement
- [ ] La bande de chaleur affiche la bonne couleur pour chaque jour avec données
- [ ] Les jours sans entrée affichent une couleur neutre `var(--border)`
- [ ] Tap sur une entrée → vue plein écran → re-export disponible
- [ ] Filtre par humeur fonctionne en temps réel (sans rechargement)
- [ ] Les entrées > 7 jours sont flouées (css `filter: blur(6px)`) pour les non-Pro
- [ ] Les données verrouillées SONT présentes en DB (vérification via Insforge dashboard)

---

## Phase 5 — Streak, Notifications & Rétention (3–4 jours)

**Objectif :** Les mécaniques de rétention quotidienne sont actives.

### Acceptance Criteria Phase 5
- [ ] Le streak s'incrémente correctement (test : check-in 3 jours consécutifs)
- [ ] Le streak ne se casse pas si check-in à 23:58 puis 00:02 (jours distincts ≡ maintenu)
- [ ] Le streak se remet à 1 correctement si 2 jours de pause
- [ ] L'animation milestone (3j, 7j, 30j) se déclenche au bon moment
- [ ] Les Web Push Notifications s'envoient sur PWA installée (iOS + Android)
- [ ] La notification est envoyée à l'heure habituelle d'utilisation (±15min), jamais à heure fixe
- [ ] Le badge streak est visible sur l'icône PWA (badging API)

---

## Phase 6 — Monétisation Stripe (4–5 jours)

**Objectif :** Le modèle freemium est actif, les paiements fonctionnent, la conversion suit le calendrier précis.

### Déclencheurs de Conversion

```typescript
// src/lib/conversion.ts
export const CONVERSION_TRIGGERS: Record<number, Record<string, ConversionPrompt>> = {
  7: {
    gallery_locked: {
      title: "Ta mémoire grandit.",
      message: "Tu as déjà créé tes premiers souvenirs. Passe en Pro pour les garder pour toujours.",
      cta: "Garder ma mémoire",
      urgency: 'low',
    }
  },
  14: {
    pro_style_attempt: {
      title: "Ce style est Pro.",
      message: "Débloque les 30 styles premium et crée des images qui se démarquent vraiment.",
      cta: "Essayer Pro — 7 jours offerts",
      urgency: 'medium',
    }
  },
  30: {
    pre_archive_warning: {
      title: "Ton historique s'archive dans 7 jours.",
      message: "30 jours de toi. Passe en Pro pour les conserver indéfiniment.",
      cta: "Conserver mon historique",
      urgency: 'high',
    }
  },
  37: {
    archive_active: {
      title: "Tes souvenirs t'attendent.",
      message: "Déverrouille 30 jours de créations et accès illimité à partir de maintenant.",
      cta: "Déverrouiller — 4,99€/mois",
      urgency: 'critical',
    }
  },
};
```

### Acceptance Criteria Phase 6
- [ ] Paiement Stripe en sandbox avec carte test `4242 4242 4242 4242` fonctionne
- [ ] Après paiement : `subscriptions.plan = 'pro'` immédiatement en DB (webhook Stripe)
- [ ] Après paiement : les styles Pro se déverrouillent sans rechargement
- [ ] Après paiement : les images verrouillées redeviennent accessibles sans rechargement
- [ ] Les 4 messages de conversion s'affichent aux bons moments (J7, J14, J30, J37)
- [ ] La période d'essai de 7 jours fonctionne (accès Pro → retour gratuit à J8 si non payé)
- [ ] L'annulation depuis les paramètres fonctionne (Stripe Customer Portal)

---

## Phase 7 — Insights, Wrapped & Pouls (5–6 jours)

**Objectif :** Les features de rétention long terme et de viralité sont actives.

### Wrapped Mensuel

Généré automatiquement le 1er de chaque mois si ≥ 15 entrées le mois précédent.

Contenu :
- Grille de miniatures des créations du mois
- Couleur dominante du mois (moyenne des `--em-accent` des humeurs)
- Humeur la plus fréquente
- Mot le plus utilisé (NLP simple côté client)
- Streak maximum atteint ce mois

### Pouls du Monde

```typescript
// src/hooks/usePulse.ts
// Subscribe à global_mood_pulse via Insforge Realtime
// Fallback polling toutes les 60s si Realtime indisponible
// Données : { moodCategory, countActive, countToday }
```

### Acceptance Criteria Phase 7
- [ ] Le Wrapped Mensuel se génère correctement (test avec données mock de 30 jours)
- [ ] Le Wrapped est exportable en image Story via le même bouton de partage
- [ ] Les Insights hebdomadaires apparaissent correctement après 7 jours de données
- [ ] Le Pouls du Monde affiche des données en ≤ 2 secondes au chargement
- [ ] Les cercles animés sont proportionnels aux counts réels
- [ ] La contribution au Pouls se déclenche correctement lors d'un check-in avec `is_shared_globally = true`

---

# 6. Modèle de Monétisation

## 6.1 Plans

| Feature | Gratuit | Pro — 4,99€/mois | Pro Annuel — 39,99€/an |
|---------|---------|-----------------|----------------------|
| Check-in quotidien | ✅ Illimité | ✅ Illimité | ✅ Illimité |
| Génération IA | ✅ 3/jour | ✅ Illimité | ✅ Illimité |
| Styles disponibles | 10 styles | 40 styles | 40 styles |
| Export résolution | Standard | 4K tous formats | 4K tous formats |
| Effets Pro (grain, vignette) | ❌ | ✅ | ✅ |
| Historique | 7 jours | Illimité | Illimité |
| Galerie + Bande de chaleur | ❌ | ✅ | ✅ |
| Insights émotionnels | ❌ | ✅ | ✅ |
| Wrapped mensuel/annuel | ❌ | ✅ | ✅ |
| Pouls du Monde | Lecture seule | Contribution | Contribution |
| Badge Pro sur profil | ❌ | ✅ | ✅ + badge Annuel |

## 6.2 Limitations Clés

La limite à 3 générations IA/jour (gratuit) est le déclencheur de conversion le plus efficace. C'est le cœur du produit — quand l'utilisateur aime ce que Claude génère, 3 fois c'est frustrant rapidement.

## 6.3 Croissance Organique

Chaque export contient le watermark `Framood` — c'est le principal canal d'acquisition. Pour maximiser son impact :

- Le watermark doit être **visible mais élégant** : typographie du design system, `opacity: 0.45`, jamais un logo générique
- Ajouter sous le watermark : `framood.app` en micro-texte (6px, opacity 30%)
- Format watermark : `Framood` + séparateur `—` + nom du style (ex: `Framood — Cosmos`)

---

# 7. Configuration PWA & Desktop

## 7.1 PWA Mobile

```json
// public/manifest.json
{
  "name": "Framood",
  "short_name": "Framood",
  "description": "Ton humeur, encadrée.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#0A0906",
  "background_color": "#0A0906",
  "categories": ["lifestyle", "productivity"],
  "screenshots": [
    { "src": "screenshots/mobile-1.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ],
  "icons": [
    { "src": "icons/icon-72.png",   "sizes": "72x72",   "type": "image/png" },
    { "src": "icons/icon-96.png",   "sizes": "96x96",   "type": "image/png" },
    { "src": "icons/icon-128.png",  "sizes": "128x128", "type": "image/png" },
    { "src": "icons/icon-192.png",  "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png",  "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "shortcuts": [
    {
      "name": "Nouveau check-in",
      "url": "/studio?checkin=true",
      "icons": [{ "src": "icons/shortcut-checkin.png", "sizes": "96x96" }]
    }
  ]
}
```

**Icône PWA :** Fond `#0A0906`, lettre `F` en Cormorant Garamond, couleur `#C8A050`. Design simple, reconnaissable à 48px.

## 7.2 Meta Tags iOS

```html
<!-- index.html — obligatoire pour le comportement PWA sur iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Framood">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<link rel="apple-touch-startup-image" href="/splash/splash-1170x2532.png">
```

## 7.3 Différences Desktop vs Mobile

| Élément | Mobile (< 768px) | Desktop (≥ 768px) |
|---------|-----------------|-------------------|
| Navigation | Bottom Nav (4 onglets) | Sidebar fixe 240px |
| Studio | Plein écran | Colonne centrale 480px + sidebar droite |
| Modals | Bottom Sheet (drag to close) | Modal centré avec overlay |
| Export | 1 tap → navigator.share | Bouton téléchargement + clipboard |
| PhoneFrame | 188×384px (tel quel) | 240×490px (légèrement plus grand) |
| Galerie | Grille 2 colonnes | Grille 4-5 colonnes |

---

# 8. Règles de Code

Ces règles sont non-négociables. Toute déviation doit être discutée.

## 8.1 TypeScript

```typescript
// ✅ TOUJOURS typer les props de composant
interface Props {
  mood: MoodCategory;  // jamais 'string' seul pour une valeur contrainte
  isPro: boolean;
}

// ✅ TOUJOURS typer les retours de fonctions utilitaires
function getFramesForMood(moodId: MoodCategory, isPro: boolean): FrameMeta[] { ... }

// ❌ JAMAIS utiliser 'any'
// ❌ JAMAIS ignorer une erreur TypeScript avec @ts-ignore sans commentaire explicatif
```

## 8.2 Composants

```typescript
// ✅ Un fichier = un composant = une responsabilité
// ✅ Les composants ne font PAS d'appels Insforge directement → utiliser les hooks
// ✅ Les hooks ne contiennent PAS de JSX → séparation stricte logique/rendu
// ❌ JAMAIS de logique métier dans App.tsx
// ❌ JAMAIS de valeurs de couleur en dur dans les composants → toujours var(--gold), etc.
// ❌ JAMAIS de styles inline sauf pour les valeurs dynamiques (ex: width calculé en JS)
```

## 8.3 Données

```typescript
// ✅ Toutes les queries Insforge passent par TanStack Query (cache, loading, error)
// ✅ Optimistic updates pour le streak et les likes (UX fluide)
// ✅ Les données utilisateur ne sont JAMAIS supprimées côté DB — uniquement verrouillées en UI
// ❌ JAMAIS appeler Insforge directement dans un composant (toujours via hook)
// ❌ JAMAIS stocker des données sensibles dans localStorage (sessionStorage pour les données temporaires)
```

## 8.4 Performance

```typescript
// ✅ React.memo sur les composants Frame (ils ne changent que si leurs props changent)
// ✅ useMemo pour le calcul de la bande de chaleur (coûteux si 365 entrées)
// ✅ Lazy loading des routes avec React.lazy + Suspense
// ✅ Les images exportées sont générées en WebWorker si > 2MP
// ❌ JAMAIS de useEffect pour la logique qui peut être dans un event handler
// ❌ JAMAIS charger les 40 styles CSS en même temps → importer uniquement le style actif
```

## 8.5 Accessibilité

```typescript
// ✅ Toutes les images ont un aria-label ou alt
// ✅ Tous les boutons ont un texte accessible (aria-label si icône seule)
// ✅ Focus visible sur tous les éléments interactifs (outline gold)
// ✅ Taille de police minimum 16px sur mobile (jamais moins)
// ✅ Contraste minimum WCAG AA (4.5:1) pour les textes de contenu
```

---

## Checklist Finale Avant Mise en Production

- [ ] Lighthouse Performance ≥ 90 sur mobile (vrai appareil)
- [ ] Lighthouse PWA Score = 100
- [ ] Les 40 styles testés sur iOS Safari et Android Chrome
- [ ] Export testé sur iPhone 13+, Samsung Galaxy A-series
- [ ] Paiement Stripe testé en mode LIVE avec vraie carte 4,99€
- [ ] RLS Insforge vérifié : impossible de lire les données d'un autre utilisateur
- [ ] Clé Claude API proxifiée via Edge Function (jamais exposée en frontend prod)
- [ ] Les images verrouillées restent en DB (jamais supprimées)
- [ ] Watermark présent sur 100% des exports
- [ ] Web Push Notifications testées sur PWA installée (pas dans navigateur)
- [ ] Variable d'env `.env.local` absente du repository git

---

*Framood V2 — Plan d'Architecture Complet — Confidentiel*  
*Ce document est la référence unique. En cas de doute : "Est-ce que ça réduit la friction ou est-ce que ça ajoute de la mémoire ?" — si non aux deux, la feature n'a pas sa place.*
