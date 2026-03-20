---
description: Guide principal pour le développement avec InsForge
inclusion: auto
priority: 1
---

# InsForge Development Steering

## Workflow de Développement

### 1. Nouveau Projet InsForge
Quand l'utilisateur demande de créer un nouveau projet InsForge:
1. Utiliser l'outil MCP `mcp_insforge_download_template` avec le framework approprié (react/nextjs)
2. Activer le skill **app-builder** pour la structure du projet
3. Activer le skill **architecture** pour les décisions architecturales
4. Utiliser `mcp_insforge_get_backend_metadata` pour récupérer les métadonnées

### 2. Authentification
Quand l'utilisateur travaille sur l'authentification:
1. Activer le skill **api-patterns** (section auth)
2. Utiliser `mcp_insforge_fetch_docs` avec `"auth-components-react"` ou `"auth-components-nextjs"` selon le framework
3. Pour des flows custom, utiliser `"auth-sdk-typescript"`

### 3. Base de Données
Quand l'utilisateur travaille sur la base de données:
1. Activer le skill **database-design** pour la conception du schéma
2. Utiliser `mcp_insforge_get_table_schema` pour inspecter les tables existantes
3. Utiliser `mcp_insforge_run_raw_sql` pour les migrations
4. Utiliser `mcp_insforge_fetch_sdk_docs` avec feature="db" et language="typescript"

### 4. Frontend/UI
Quand l'utilisateur travaille sur l'interface:
1. Activer le skill **frontend-design** pour les décisions UX/UI
2. Utiliser les données de `.agent/.shared/ui-ux-pro-max/data/` pour:
   - `colors.csv` - Systèmes de couleurs
   - `typography.csv` - Typographie
   - `icons.csv` - Icônes
   - `styles.csv` - Styles et composants
3. **IMPORTANT**: Toujours utiliser Tailwind CSS 3.4 (pas v4)

### 5. Storage & Files
Quand l'utilisateur travaille sur le stockage de fichiers:
1. Utiliser `mcp_insforge_create_bucket` pour créer des buckets
2. Utiliser `mcp_insforge_fetch_sdk_docs` avec feature="storage"
3. Stocker les URLs dans la base de données, pas les fichiers

### 6. Serverless Functions
Quand l'utilisateur crée des fonctions:
1. Écrire le code dans un fichier local d'abord
2. Utiliser `mcp_insforge_create_function` avec le chemin du fichier
3. Utiliser `mcp_insforge_fetch_sdk_docs` avec feature="functions"

### 7. AI Integration
Quand l'utilisateur intègre l'IA:
1. Utiliser `mcp_insforge_fetch_sdk_docs` avec feature="ai"
2. API compatible OpenAI pour chat et génération d'images

### 8. Real-time Features
Quand l'utilisateur ajoute du temps réel:
1. Utiliser `mcp_insforge_fetch_docs` avec "real-time"
2. WebSocket pub/sub pour database + client events

## Règles Importantes

- **SDK vs MCP**: SDK pour la logique applicative, MCP pour l'infrastructure
- **Documentation**: TOUJOURS fetch la doc avant d'écrire du code InsForge
- **Structure de retour**: Toutes les opérations SDK retournent `{data, error}`
- **Database inserts**: Toujours utiliser le format array `[{...}]`
- **Tailwind**: Verrouiller à la version 3.4 dans package.json

## Skills à Activer par Contexte

| Contexte | Skills à Activer |
|----------|------------------|
| Architecture globale | architecture, clean-code |
| API/Backend | api-patterns, database-design |
| Frontend/UI | frontend-design |
| Base de données | database-design |
| Revue de code | code-review-checklist, clean-code |
| Déploiement | deployment-procedures |
| Documentation | documentation-templates |
