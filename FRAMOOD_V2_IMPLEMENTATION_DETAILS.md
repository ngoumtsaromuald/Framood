# FRAMOOD V2 — Détails d'Implémentation Stratégique (MVP & Growth)

> **Rôle de ce document :** Traduire les conseils stratégiques en tâches techniques concrètes. Ce fichier est pensé pour un développeur (ou une IA de code) afin d'implémenter rapidement et sans erreur ces 5 piliers de rétention/monétisation.

---

## 1. Moteur IA via OpenRouter (Modèles Gratuits)

**Objectif :** Générer les citations, thèmes de couleurs et choix de styles sans payer l'API Claude au début, tout en gardant une qualité acceptable. 

**Implémentation technique pour le codeur :**
1. **Endpoint :** Utiliser `https://openrouter.ai/api/v1/chat/completions`.
2. **Fallback Logic (Crucial) :** Comme les modèles gratuits peuvent de temps en temps être surchargés, créer un tableau de modèles de secours dans `src/lib/ai-generator.ts`.
3. **Le Prompt System :** Demander explicitement du JSON avec un format très strict, car les petits modèles gèrent parfois mal les sauts de lignes.

```typescript
// Exemple technique pour ai-generator.ts
const OPENROUTER_MODELS = [
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "nvidia/llama-nemotron-embed-vl-1b-v2:free",
  "google/gemma-2-9b-it:free" // ou d'autres modèles free OpenRouter
];

export async function generateMoodContent(mood: string, userInput: string) {
  // Try models iteratively until one succeeds
  for (const model of OPENROUTER_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
          "HTTP-Referer": "https://framood.com", 
          "X-Title": "Framood",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Tu es un assistant poétique. L'utilisateur te donne son humeur. Renvoie un JSON strict: { \"quote\": \"une phrase poétique courte\", \"styleId\": \"neon\", \"themeColor\": \"#f59e0b\" }. Les styles dispos sont: polaroid, neon, zen, bold, vhs, elegant, ticket, luxe." },
            { role: "user", content: `Humeur: ${mood}. Mots clés: ${userInput}` }
          ]
        })
      });
      const rawBody = await response.json();
      return JSON.parse(rawBody.choices[0].message.content);
    } catch (e) {
      console.warn(`Modèle ${model} échoué, passage au suivant...`);
    }
  }
  throw new Error("Tous les modèles gratuits ont échoué.");
}
```

---

## 2. Le "Aha! Moment" avant Inscription (Guest Mode)

**Objectif :** Réduire la friction à l'onboarding pour que l'utilisateur expérimente la magie de Framood avant de donner son email.

**Implémentation technique pour le codeur :**
1. **Désactiver la redirection forcée** sur `/auth` si non connecté. Modifier la logique de route protégée dans `App.tsx`.
2. **Utiliser Zustand (`useGuestStore.ts`) :**
   Stocker l'humeur saisie, le texte d'entrée, et le résultat généré par l'IA dans le `localStorage` de manière éphémère.
3. **Studio Access :** L'utilisateur arrive dans le `<Studio />` qui affiche la création complète. L'expérience est intacte.
4. **Trigger de Conversion :** Au moment où il clique sur le bouton **"Sauvegarder dans mon journal"** ou **"Exporter"** (dans `ExportBar.tsx`), intercepter l'action.
   Ouvrir une `<AuthModal />` (qui le basculera en authentifié puis synchronisera le `localStorage` avec la base de données Insforge via `useEntries.ts`).

---

## 3. Boucle de Croissance : Watermark Viral à l'Export

**Objectif :** Transformer chaque image exportée gratuitement en publicité pour l'appli sur les réseaux sociaux.

**Implémentation technique pour le codeur :**
1. Créer un composant `<Watermark />` (ex: "Créé avec Framood" avec un petit logo) positionné en `absolute` en bas de l'image.
2. Lier la visibilité de ce composant à l'abonnement de l'utilisateur.
3. Lors de l'utilisation de `html-to-image` pour transformer le composant React en image PNG/WebM :

```tsx
// Dans src/components/studio/Studio.tsx ou ExportBar.tsx
const { subscriptionPlan } = useSubscription(); // 'free' | 'pro'
const [isExporting, setIsExporting] = useState(false);

const handleExport = async () => {
  setIsExporting(true); // Ce state peut rendre le watermark visible juste pour le rendu
  const element = document.getElementById('frame-render-zone');
  
  // Attendre une frame (setTimeout 0) pour s'assurer que le DOM met à jour l'opacité du Watermark
  setTimeout(async () => {
    const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 2 });
    downloadImage(dataUrl);
    setIsExporting(false); // On cache à nouveau le watermark sur l'UI vivante
  }, 50);
};

// Dans le JSX du cadre :
<div id="frame-render-zone" className="relative">
   <FrameContent />
   {(subscriptionPlan === 'free' && isExporting) && (
      <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono">
         Créé avec Framood
      </div>
   )}
</div>
```

---

## 4. Phase 2 — Audit des 40 Styles & Configuration du Paywall

> ✅ **Migration terminée.** Les 40 styles du Prototype (`Prototype/app_v4_40styles.html`) ont déjà été migrés vers des composants React dans `src/components/frames/`. 

**Objectif de cette phase :** S'assurer que les 40 styles sont utilisables en production, et configurer lesquels sont gratuits (Free) ou verrouillés derrière l'abonnement (Pro).

---

### 4.1 Audit des Styles (QA Visuelle)

Avant de mettre l'app en production, chaque style doit être vérifié. Le codeur doit lancer le dev server et tester chaque frame dans le Studio pour détecter des problèmes.

**Checklist de vérification pour CHAQUE style :**
- [ ] Texte principal (`text`) s'affiche correctement (pas tronqué)
- [ ] Sous-texte (`subtext`) et tag (`tag`) s'affichent correctement si renseignés
- [ ] Le rendu est correct au format **Story** (9:16) ET **Carré** (1:1)
- [ ] L'export PNG via `exportToPng()` est propre (pas de flou, pas de crop)
- [ ] Les thèmes de couleurs (`theme`) changent bien l'apparence

Les bugs détectés doivent être corrigés style par style dans `src/components/frames/Frame[Nom].tsx`.

---

### 4.2 Configuration du Paywall dans `index.ts`

Le fichier `src/components/frames/index.ts` contient le registre de tous les frames. Chaque frame a une propriété `isPro: boolean` qui détermine si il est verrouillé ou non pour les utilisateurs gratuits.

**Répartition recommandée :**

| Accès | Styles (10) |
|-------|-------------|
| ✅ **Gratuit** | Minimal, Typo, Journal, Manuscrit, Polaroid, Cinema, Poetique, Elegant, Bold, Zen |
| 🔒 **Pro** | Tous les 30 autres (Glitch, Cosmos, VHS, Retrowave, Luxe, Ticket, Neon, etc.) |

Le codeur doit mettre à jour `index.ts` pour que chaque style dans le tableau ait `isPro: false` ou `isPro: true` selon ce tableau.

Le composant `<StyleSelector />` lira cette propriété pour afficher le cadenas sur les styles Pro et déclencher `onProClick()` (qui ouvre la `<PaywallModal />`).

---



## 5. Le "Pouls du Monde" (Global Mood Pulse)

**Objectif :** Créer une connexion émotionnelle mondiale en temps réel, juste après la saisie.

**Implémentation technique pour le codeur :**
1. **La Base de Données :** Utiliser la table `global_mood_pulse` déjà prévue dans `FRAMOOD_V2_ARCHITECTURE.md`.
2. **Le Déclencheur :** Dès qu'une nouvelle entrée (`mood_entries`) est insérée, augmenter le compteur coté serveur.
3. **L'UI Post-CheckIn :** Dans le flux utilisateur, après la sélection de l'humeur, afficher pendant 3 secondes un overlay ou mini-dashboard : 

```tsx
// src/components/pulse/QuickPulseFeedback.tsx
const QuickPulseFeedback = ({ currentMood }) => {
  // S'abonner aux changements temps réel Insforge (Supabase / Postgres Realtime)
  const { pulseData } = useRealtimePulse(); 
  const count = pulseData.find(p => p.mood_category === currentMood)?.count_today || 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="text-gray-400">
        Vous n'êtes pas seul(e).
      </p>
      <p className="text-xl text-white">
        <span className="text-[var(--gold)] font-bold">{count + 1}</span> personnes 
        se sentent <span className="capitalize">{currentMood}</span> avec vous aujourd'hui.
      </p>
    </motion.div>
  );
};
```
4. **WebSocket (Realtime) :** Mettre en place la souscription WebSocket avec le SDK Insforge pour voir les nombres s'animer en direct si un autre utilisateur fait la même action au même moment (effet social). Rien de plus puissant pour valider la décision du visiteur.
