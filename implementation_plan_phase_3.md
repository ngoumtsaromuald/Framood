# Phase 3 — Check-in & Génération IA

Le flux principal de Framood : check-in émotionnel → génération IA → Studio → Export image. Basé sur les specs exactes de `FRAMOOD_V2_ARCHITECTURE.md` §Phase 3 et le prototype `ai_generator.html`.

## Proposed Changes

### Moteurs purs (`src/lib/`) — Zéro dépendance React

---

#### [NEW] [emotion-engine.ts](file:///d:/WORKS/Framood/src/lib/emotion-engine.ts)

Mappage `MoodCategory` → configuration complète :
- Réexporte `EMOTIONS` depuis `@/types/emotion.ts` pour un accès centralisé
- `getRecommendedStyles(mood, isPro)` → retourne les styles triés par pertinence
- `buildPromptContext(mood, intensity)` → retourne le contexte émotionnel pour le prompt Claude
- Utilise les `compatibleStyles` déjà définis dans `EMOTIONS`

---

#### [NEW] [ai-generator.ts](file:///d:/WORKS/Framood/src/lib/ai-generator.ts)

Migré depuis le prototype `ai_generator.html`, adapté à l'architecture :
- Prompt système conforme à l'architecture (max 12 mots texte principal, max 20 mots sous-titre, tag 2 mots, JSON strict)
- `generateContent(moodDescription, mood, intensity)` → `Promise<AIGeneratedContent>`
- Appel via `VITE_ANTHROPIC_KEY` en dev (fetch direct vers `api.anthropic.com`)
- Parsing JSON robuste avec strip des markdown fences
- **Fallback** : si erreur API → retourne le texte brut de l'utilisateur dans un style `minimal` + mood auto-détecté
- Type retour : `{ main_text, sub_text, tag, suggested_mood, suggested_style, confidence }`

---

#### [NEW] [export-engine.ts](file:///d:/WORKS/Framood/src/lib/export-engine.ts)

Export PNG via `html-to-image` + post-traitement Canvas :
- `exportToPng(element, format)` → `Promise<Blob>`
- Formats : `story` (1080×1920), `wallpaper` (1080×1920), `square` (1080×1080), `desktop` (1920×1080)
- Après capture : applique grain + vignette via Canvas si activés
- Watermark Canvas : "Framood" en Cormorant Garamond, 1.1% largeur, opacité 0.45, #FFFFFF, bas-droite
- `shareImage(blob, filename)` : `navigator.share()` → `clipboard.write()` → download fallback
- `downloadImage(blob, filename)` : anchor download

---

#### [NEW] [film-grain.ts](file:///d:/WORKS/Framood/src/lib/film-grain.ts)

Effets Canvas 2D (appliqués après export, pas en CSS) :
- `applyGrain(ctx, width, height, intensity)` → bruit aléatoire pixel par pixel
- `applyVignette(ctx, width, height, intensity)` → gradient radial noir

---

### Store Zustand (`src/store/`)

---

#### [NEW] [useStudioStore.ts](file:///d:/WORKS/Framood/src/store/useStudioStore.ts)

État global du Studio partagé entre CheckIn → Studio :
```typescript
interface StudioState {
  // Check-in
  selectedMood: MoodCategory | null;
  intensity: number;           // 0-10
  moodDescription: string;

  // AI content
  aiContent: AIGeneratedContent | null;
  isGenerating: boolean;
  generationError: string | null;

  // Studio
  selectedFrameId: string;
  selectedTheme: string;
  text: string;
  subtext: string;
  tag: string;
  exportFormat: ExportFormat;

  // Actions
  setMood: (mood: MoodCategory) => void;
  setIntensity: (n: number) => void;
  setMoodDescription: (desc: string) => void;
  generateAIContent: () => Promise<void>;
  applyAIContent: (content: AIGeneratedContent) => void;
  setFrame: (id: string, theme?: string) => void;
  setText: (text: string) => void;
  setSubtext: (sub: string) => void;
  setTag: (tag: string) => void;
  setExportFormat: (f: ExportFormat) => void;
  reset: () => void;
}
```

---

### Composants Check-in (`src/components/checkin/`)

---

#### [NEW] [MoodPicker.tsx](file:///d:/WORKS/Framood/src/components/checkin/MoodPicker.tsx)

Grid des 8 humeurs, chacune avec emoji + label depuis `EMOTIONS`.
- Tap → appelle `onSelect(mood)` immédiatement (pas de bouton valider)
- Animation Framer Motion au tap (scale + gold border apparition)
- Responsive : 4 colonnes sur mobile, 4 sur desktop

---

#### [NEW] [IntensitySlider.tsx](file:///d:/WORKS/Framood/src/components/checkin/IntensitySlider.tsx)

Slider 1-10 avec émojis min/max.
- Change déclenche `onSelect(value)` au relâchement
- Labels discrets "Léger" (1) → "Intense" (10)
- Styled avec les variables CSS gold

---

#### [NEW] [QuickWords.tsx](file:///d:/WORKS/Framood/src/components/checkin/QuickWords.tsx)

Input texte + suggestions rapides (chips) contextuelles par humeur.
- Textarea avec placeholder dynamique selon le mood sélectionné
- Chips de suggestions (3-5) basées sur le mood courant
- Soumission avec Enter ou tap sur chip
- Auto-focus à l'apparition

---

#### [NEW] [CheckIn.tsx](file:///d:/WORKS/Framood/src/components/checkin/CheckIn.tsx)

Orchestrateur du check-in en 3 étapes séquentielles :
1. `MoodPicker` — sélection humeur → auto-avance
2. `IntensitySlider` — intensité → auto-avance
3. `QuickWords` — mots descriptifs → soumission → déclenche AI + navigation `/studio`

- **Une question visible à la fois** (AnimatePresence de Framer Motion)
- Chronomètre interne pour mesurer le temps total
- Pendant la génération IA : Spinner + texte "Framood crée ton image…"
- Si erreur AI : fallback silencieux (texte brut + style auto) + toast info

---

### Composants Studio (`src/components/studio/`)

---

#### [NEW] [ExportBar.tsx](file:///d:/WORKS/Framood/src/components/studio/ExportBar.tsx)

Barre fixe en bas du Studio :
- Bouton principal "Exporter" (gold, Lucide `Download`)
- Bouton "Partager" (ghost, Lucide `Share2`)
- Bouton format (pill avec icône actuelle) → ouvre FormatPicker
- États loading pendant export

---

#### [NEW] [FormatPicker.tsx](file:///d:/WORKS/Framood/src/components/studio/FormatPicker.tsx)

BottomSheet/modal de sélection du format d'export :
- Story (9:16) — défaut
- Wallpaper (9:16)
- Carré (1:1)
- Desktop (16:9)
- Icones + labels, sélection radio, tap = ferme + applique

---

### Pages

---

#### [MODIFY] [Home.tsx](file:///d:/WORKS/Framood/src/pages/Home.tsx)

Remplacer le placeholder Phase 3 par le composant `<CheckIn />` réel. Le salut ("Bonjour…") reste, le check-in s'intègre en dessous.

---

#### [MODIFY] [Studio.tsx](file:///d:/WORKS/Framood/src/pages/Studio.tsx)

Refactoring majeur :
- Migrer de l'état local (`useState`) vers `useStudioStore` (Zustand)
- Afficher le contenu AI quand il vient du check-in (texte, style, thème pré-remplis)
- Ajouter `<ExportBar />` en bas de page
- L'utilisateur peut toujours modifier manuellement style/texte/thème après la génération
- Ref sur le `PhoneFrame` pour l'export via `html-to-image`

---

### Types

---

#### [MODIFY] [frame.ts](file:///d:/WORKS/Framood/src/types/frame.ts)

Ajouter `ExportFormat` type :
```typescript
export type ExportFormat = 'story' | 'wallpaper' | 'square' | 'desktop';
```

---

#### [NEW] [ai.ts](file:///d:/WORKS/Framood/src/types/ai.ts)

Types pour le retour AI :
```typescript
export interface AIGeneratedContent {
  main_text: string;
  sub_text: string;
  tag: string;
  suggested_mood: MoodCategory;
  suggested_style: string;
  confidence: number;
}
```

---

## Verification Plan

### Build automatique
```bash
npm run build
```
Doit passer sans erreur TypeScript ni warnings bloquants.

### Test navigateur (manuel)
1. Ouvrir `http://localhost:5173/` (connecté)
2. Sur Home, vérifier que les 8 humeurs s'affichent dans le MoodPicker
3. Taper une humeur → l'écran avance au slider d'intensité
4. Régler l'intensité → l'écran avance à QuickWords
5. Taper un mot ou sélectionner un chip → la génération AI se lance (spinner visible)
6. Redirection automatique vers `/studio` avec texte + style pré-remplis
7. Vérifier que le PhoneFrame affiche le bon style et texte
8. Modifier le texte manuellement → le PhoneFrame se met à jour en temps réel
9. Cliquer Exporter → vérifier que le PNG se télécharge (1080×1920px)
10. Vérifier que le watermark "Framood" est visible en bas-droite de l'image exportée

### Test fallback API
1. Mettre une clé API invalide dans `.env.local` (`VITE_ANTHROPIC_KEY=invalid`)
2. Faire un check-in complet
3. Vérifier qu'un toast d'info apparaît ("Mode manuel activé")
4. Vérifier que le Studio s'ouvre avec le texte brut saisi et un style par défaut (pas d'écran blanc)

### Test partage
1. Exporter une image, cliquer "Partager"
2. Sur mobile : `navigator.share()` doit s'ouvrir
3. Sur desktop : le PNG doit être copié dans le presse-papier
4. Si les deux échouent : téléchargement direct du fichier
