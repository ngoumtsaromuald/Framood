---
description: Orchestration intelligente des skills selon le contexte
inclusion: auto
priority: 2
---

# Skill Orchestration Strategy

## Activation Automatique des Skills

### Détection de Contexte

Analyser la demande de l'utilisateur et activer automatiquement les skills pertinents:

#### Mots-clés → Skills

**Architecture & Design**
- "architecture", "pattern", "structure", "design system" → `architecture`
- "clean code", "refactor", "best practices" → `clean-code`
- "review", "audit", "quality" → `code-review-checklist`

**Backend & API**
- "api", "endpoint", "rest", "graphql", "trpc" → `api-patterns`
- "database", "schema", "migration", "sql" → `database-design`
- "auth", "login", "register", "oauth" → `api-patterns` (auth section)

**Frontend & UX**
- "ui", "ux", "design", "interface", "component" → `frontend-design`
- "color", "typography", "animation", "motion" → `frontend-design`
- "accessibility", "a11y", "wcag" → `frontend-design`

**Game Development**
- "game", "2d", "3d", "unity", "godot" → `game-development`
- "sprite", "animation", "physics" → `game-development/2d-games`
- "3d model", "shader", "lighting" → `game-development/3d-games`

**DevOps & Deployment**
- "deploy", "ci/cd", "docker", "kubernetes" → `deployment-procedures`
- "bash", "script", "linux", "shell" → `bash-linux`

**Documentation**
- "readme", "docs", "documentation", "comment" → `documentation-templates`

## Combinaisons de Skills Recommandées

### Nouveau Feature Complet
```
1. brainstorming (clarifier les besoins)
2. architecture (décisions de design)
3. database-design (si données persistantes)
4. api-patterns (si API nécessaire)
5. frontend-design (si UI nécessaire)
6. clean-code (pendant l'implémentation)
7. code-review-checklist (validation finale)
```

### Refactoring
```
1. code-review-checklist (audit initial)
2. architecture (identifier les patterns)
3. clean-code (appliquer les bonnes pratiques)
```

### Bug Fix
```
1. code-review-checklist (analyser le problème)
2. clean-code (corriger proprement)
```

### Nouvelle API
```
1. api-patterns (choisir le style)
2. database-design (schéma si nécessaire)
3. clean-code (implémentation)
4. documentation-templates (documenter)
```

### Nouvelle UI
```
1. frontend-design (décisions UX/UI)
2. Utiliser ui-ux-pro-max data (colors, typography, icons)
3. clean-code (implémentation)
```

## Scripts Python Disponibles

Utiliser les scripts Python des skills quand approprié:

### API Patterns
- `.agent/skills/api-patterns/scripts/api_validator.py` - Valider les APIs

### Database Design
- `.agent/skills/database-design/scripts/schema_validator.py` - Valider les schémas

### Frontend Design
- `.agent/skills/frontend-design/scripts/accessibility_checker.py` - Vérifier l'accessibilité
- `.agent/skills/frontend-design/scripts/ux_audit.py` - Audit UX

### UI-UX Pro Max
- `.agent/.shared/ui-ux-pro-max/scripts/core.py` - Fonctions core
- `.agent/.shared/ui-ux-pro-max/scripts/design_system.py` - Design system
- `.agent/.shared/ui-ux-pro-max/scripts/search.py` - Recherche dans les données

## Règles d'Activation

1. **Proactif**: Activer les skills AVANT d'écrire du code, pas après
2. **Minimal**: N'activer que les skills nécessaires pour la tâche
3. **Séquentiel**: Activer dans l'ordre logique (design → implémentation → validation)
4. **Documentation**: Toujours fetch la doc InsForge avant d'utiliser le SDK
5. **Validation**: Utiliser les scripts Python pour valider quand disponibles
