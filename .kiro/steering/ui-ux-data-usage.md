---
description: Guide d'utilisation des données UI/UX Pro Max
inclusion: auto
fileMatchPattern: "*.tsx|*.jsx|*.css|*.scss"
priority: 3
---

# UI/UX Pro Max Data Usage

## Données Disponibles

Le dossier `.agent/.shared/ui-ux-pro-max/data/` contient des ressources précieuses:

### Design System
- **colors.csv** - Palettes de couleurs, systèmes de couleurs
- **typography.csv** - Systèmes typographiques, hiérarchies
- **icons.csv** - Bibliothèques d'icônes, usage
- **styles.csv** - Styles de composants, patterns UI

### Content & Patterns
- **landing.csv** - Patterns pour landing pages
- **products.csv** - Patterns pour pages produits
- **charts.csv** - Visualisations de données
- **prompts.csv** - Prompts pour génération de contenu

### Guidelines
- **ui-reasoning.csv** - Raisonnement UI/UX
- **ux-guidelines.csv** - Guidelines UX
- **web-interface.csv** - Patterns d'interfaces web
- **react-performance.csv** - Optimisation React

## Quand Utiliser Ces Données

### Création de Composants UI
1. Consulter `styles.csv` pour les patterns de composants
2. Utiliser `colors.csv` pour le système de couleurs
3. Référencer `typography.csv` pour la hiérarchie typographique
4. Choisir les icônes depuis `icons.csv`

### Landing Pages
1. Consulter `landing.csv` pour les sections et layouts
2. Utiliser `web-interface.csv` pour les patterns d'interaction
3. Appliquer `ux-guidelines.csv` pour l'expérience utilisateur

### Dashboards & Data Viz
1. Référencer `charts.csv` pour les types de graphiques
2. Utiliser `ui-reasoning.csv` pour les décisions de présentation

### Optimisation Performance
1. Consulter `react-performance.csv` pour les optimisations React
2. Appliquer les best practices de performance

## Scripts Python Disponibles

### core.py
Fonctions de base pour manipuler les données CSV

### design_system.py
Génération de design systems à partir des données

### search.py
Recherche dans les données CSV par mots-clés

## Workflow Recommandé

### 1. Nouveau Composant
```
1. Activer skill frontend-design
2. Utiliser search.py pour trouver des patterns similaires
3. Consulter les CSV pertinents
4. Implémenter avec Tailwind CSS 3.4
```

### 2. Nouvelle Page
```
1. Consulter landing.csv ou web-interface.csv
2. Activer frontend-design skill
3. Utiliser colors.csv et typography.csv
4. Implémenter la structure
```

### 3. Optimisation
```
1. Consulter react-performance.csv
2. Appliquer les optimisations
3. Valider avec accessibility_checker.py
```

## Intégration avec InsForge

Quand tu utilises ces données avec InsForge:
- Stocker les préférences de design dans la base de données
- Utiliser le storage pour les assets (images, fonts)
- Implémenter les thèmes avec les variables CSS
- **Toujours utiliser Tailwind CSS 3.4**

## Exemple d'Utilisation

```javascript
// Consulter colors.csv pour le système de couleurs
const theme = {
  primary: 'blue-600',
  secondary: 'purple-500',
  // ... basé sur colors.csv
};

// Consulter typography.csv pour la hiérarchie
const typography = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  // ... basé sur typography.csv
};
```
