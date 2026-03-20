---
description: Standards de qualité de code pour le projet
inclusion: auto
priority: 4
---

# Code Quality Standards

## Activation Automatique des Skills

### Avant d'Écrire du Code
1. **brainstorming** - Si les besoins ne sont pas clairs
2. **architecture** - Pour les décisions de design
3. Skill spécifique au domaine (api-patterns, database-design, frontend-design)

### Pendant l'Écriture
1. **clean-code** - Toujours actif pour les bonnes pratiques
2. Utiliser les scripts de validation quand disponibles

### Après l'Écriture
1. **code-review-checklist** - Validation finale
2. Exécuter les tests si demandé par l'utilisateur

## Standards Spécifiques InsForge

### Structure SDK
```typescript
// ✅ BON - Créer le client une fois
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: process.env.VITE_INSFORGE_URL,
  anonKey: process.env.VITE_INSFORGE_ANON_KEY
});

// ✅ BON - Gérer les erreurs
const { data, error } = await client.db
  .from('users')
  .select('*');

if (error) {
  console.error('Error:', error);
  return;
}

// ❌ MAUVAIS - Ne pas créer plusieurs clients
// ❌ MAUVAIS - Ne pas ignorer les erreurs
```

### Database Operations
```typescript
// ✅ BON - Format array pour insert
const { data, error } = await client.db
  .from('posts')
  .insert([{ title: 'Hello', content: 'World' }]);

// ❌ MAUVAIS - Objet simple
// .insert({ title: 'Hello' })
```

### Tailwind CSS
```json
// ✅ BON - Verrouiller Tailwind 3.4
{
  "dependencies": {
    "tailwindcss": "^3.4.0"
  }
}

// ❌ MAUVAIS - Utiliser v4
// "tailwindcss": "^4.0.0"
```

## Checklist de Validation

### Avant de Commit
- [ ] Activer **clean-code** skill
- [ ] Vérifier la structure `{data, error}`
- [ ] Valider les formats d'insert (arrays)
- [ ] Confirmer Tailwind 3.4
- [ ] Exécuter les scripts de validation si disponibles
- [ ] Activer **code-review-checklist** pour audit final

### Pour les APIs
- [ ] Activer **api-patterns** skill
- [ ] Valider avec `api_validator.py`
- [ ] Documenter les endpoints
- [ ] Gérer les erreurs proprement

### Pour la Database
- [ ] Activer **database-design** skill
- [ ] Valider le schéma avec `schema_validator.py`
- [ ] Créer les migrations si nécessaire
- [ ] Indexer les colonnes fréquemment requêtées

### Pour le Frontend
- [ ] Activer **frontend-design** skill
- [ ] Consulter les données ui-ux-pro-max
- [ ] Vérifier l'accessibilité avec `accessibility_checker.py`
- [ ] Audit UX avec `ux_audit.py`

## Scripts de Validation Disponibles

Exécuter ces scripts avant de finaliser:

```bash
# API Validation
python .agent/skills/api-patterns/scripts/api_validator.py

# Schema Validation
python .agent/skills/database-design/scripts/schema_validator.py

# Accessibility Check
python .agent/skills/frontend-design/scripts/accessibility_checker.py

# UX Audit
python .agent/skills/frontend-design/scripts/ux_audit.py
```

## Règles de Performance

### React Performance
Consulter `.agent/.shared/ui-ux-pro-max/data/react-performance.csv` pour:
- Optimisations de re-render
- Lazy loading
- Code splitting
- Memoization

### Database Performance
- Utiliser les indexes appropriés
- Limiter les requêtes N+1
- Utiliser select() pour spécifier les colonnes
- Paginer les résultats

## Documentation

Activer **documentation-templates** skill pour:
- README.md
- API documentation
- Component documentation
- Inline comments
