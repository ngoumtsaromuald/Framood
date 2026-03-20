# Phase 4 — Galerie & Mémoire

## Goal
Implémenter la galerie chronologique avec défilement infini, le filtre par humeur, la bande de chaleur (heatmap), et la vue détaillée des entrées, tout en respectant les limites du plan Gratuit (floutage après 7 jours).

## User Review Required
Aucune décision bloquante. La stack utilise `@tanstack/react-query` pour le cache et `@insforge/sdk` pour l'accès DB. 

## Proposed Changes

### Composants Galerie
#### [NEW] [GalleryGrid.tsx](file:///d:/AI/Framood/Framood/src/components/gallery/GalleryGrid.tsx)
- Grille responsive (2 cols mobile, 4-5 desktop).
- Intégration de `React Intersection Observer` pour l'infinite scroll.
- Rend les `<EntryCard />`.

#### [NEW] [EntryCard.tsx](file:///d:/AI/Framood/Framood/src/components/gallery/EntryCard.tsx)
- Miniature de l'image exportée ou rendu CSS allégé si pas d'image.
- Applique `filter: blur(6px)` et une icône 🔒 si l'entrée a plus de 7 jours et que l'utilisateur n'est pas Pro.
- Déclenche l'ouverture de `EntryDetail` au tap (si déverrouillé) ou `PaywallModal` (si verrouillé).

#### [NEW] [EntryDetail.tsx](file:///d:/AI/Framood/Framood/src/components/gallery/EntryDetail.tsx)
- Vue plein écran d'une entrée avec Framer Motion.
- Permet de re-télécharger / partager l'image.

#### [NEW] [HeatMap.tsx](file:///d:/AI/Framood/Framood/src/components/gallery/HeatMap.tsx)
- Bande horizontale affichant les X derniers jours.
- Chaque jour prend la couleur dominante de l'humeur enregistrée ce jour-là (ou gris neutre si vide).

#### [NEW] [MoodFilter.tsx](file:///d:/AI/Framood/Framood/src/components/gallery/MoodFilter.tsx)
- Sélecteur de filtres (chips) par humeur qui actualise la requête.

### Hooks & Data Fetching
#### [NEW] [useEntries.ts](file:///d:/AI/Framood/Framood/src/hooks/useEntries.ts)
- Utilise `useInfiniteQuery` de `@tanstack/react-query`.
- Fetch par lots de 20 depuis la table `mood_entries` via `@insforge/sdk`.
- Paramètre factultatif : filtre par humeur.

### Pages
#### [MODIFY] [Gallery.tsx](file:///d:/AI/Framood/Framood/src/pages/Gallery.tsx)
- Remplace le placeholder par la composition réelle : `<HeatMap />`, `<MoodFilter />`, `<GalleryGrid />`.
- Gère l'état local du filtre et de l'entrée sélectionnée.

## Verification Plan

### Test du navigateur (manuel)
1. **Lancer le serveur de dev** : `npm run dev` et ouvrir l'app.
2. **Chargement initial** : Naviguer vers l'onglet "Galerie". Vérifier que les entrées récentes s'affichent correctement. Si la base est au début, créer quelques check-ins pour peupler la galerie.
3. **Infinite Scroll** : Faire défiler vers le bas et s'assurer que les entrées suivantes se chargent de manière fluide sans à-coups majeurs (vérifier l'appel réseau ou un mock).
4. **Filtre par humeur** : Cliquer sur une chip d'humeur. La galerie doit se mettre à jour pour n'afficher que les entrées correspondantes.
5. **Verrouillage Pro (Test Freemium)** : S'assurer que le plan de l'utilisateur est "free". Vérifier que toute entrée générée il y a plus de 7 jours (simuler en modifiant la date en DB ou un mock interne) apparaît floutée avec un cadenas. Cliquer dessus doit ouvrir/déclencher l'avertissement de plan Pro.
6. **Détail & Re-export** : Cliquer sur une image récente valide (déverrouillée) pour ouvrir `EntryDetail` en plein écran. Essayer de cliquer sur partager/télécharger.
7. **HeatMap** : La bande de chaleur doit montrer les derniers jours avec les couleurs correctes.
