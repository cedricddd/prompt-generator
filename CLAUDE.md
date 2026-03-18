# Claude - Prompt Generator (Ced-IT)

## Identite et Role
Assistant IA specialise pour le projet **Prompt Generator** de Ced-IT. Application React + Express qui transforme des idees en prompts optimises via Claude API.

## Langue et Communication
- **Langue**: Francais (toujours)
- **Style**: Concis, technique, sans emojis (sauf demande)
- **Format**: Markdown, liens cliquables `[fichier.ts:42](chemin/fichier.ts#L42)`

## Architecture du Projet

### Stack
- **Frontend**: React 19 + Vite 7 + Tailwind CSS v4
- **Backend**: Express 5 + Claude API (@anthropic-ai/sdk)
- **UI**: lucide-react (icones), react-hot-toast (notifications)
- **Theme**: Ced-IT (cyan/bleu fonce)

### Structure
```
prompt-generator/
├── src/
│   ├── App.jsx          # Application principale (composants + logique)
│   ├── main.jsx         # Point d'entree React
│   └── index.css        # Styles Tailwind + animations custom
├── server.js            # API Express (port 3001) + Claude API + fallback templates
├── index.html           # HTML racine (Inter font, meta SEO)
├── vite.config.js       # Vite + React + Tailwind + proxy API
├── package.json         # Scripts: dev, server, build
├── .env.example         # Template pour cle API Anthropic
└── dist/                # Build de production
```

### Scripts NPM
- `npm run dev` - Frontend Vite (port 5173, proxy /api → 3001)
- `npm run server` - Backend Express (port 3001)
- `npm run start` - Les deux en parallele
- `npm run build` - Build production

### Configuration
- Copier `.env.example` → `.env` avec `ANTHROPIC_API_KEY=sk-ant-...`
- Sans cle API: mode fallback avec templates pre-definis
- Proxy Vite: `/api` → `http://localhost:3001`

## Theme Ced-IT

### Palette de Couleurs
```css
--primary: #0a1628;      /* Fond principal */
--secondary: #0d1f35;    /* Fond secondaire */
--accent: #00d4ff;       /* Cyan electrique */
--accent-gradient: linear-gradient(135deg, #00d4ff 0%, #0066ff 100%);
--text: #e2e8f0;         /* Texte principal */
--text-muted: #64748b;   /* Texte attenue */
```

### Typographie
- **Principale**: Inter (400, 500, 600, 700, 900)
- **Code**: Monospace systeme

## Composants Principaux (App.jsx)
- `FloatingParticles` - Particules d'arriere-plan animees
- `CopyButton` - Bouton copier avec feedback toast
- `LoadingState` - Animation orbitale pendant generation
- `ResultSection` - Affichage prompt + tips + variations
- `HistoryPanel` - Historique localStorage (10 derniers)
- `SuggestionPanel` - Tags d'enrichissement par type
- `EmptyState` - Etat vide avec guide utilisateur
- `App` - Orchestrateur principal

## API Backend (server.js)
- `POST /api/generate` - Generation de prompt (Claude API ou fallback)
- `GET /api/health` - Health check (status + mode)
- **Modele**: claude-sonnet-4-5-20250514
- **Types supportes**: image, document, webpage, code, email, social
- **Styles**: professional, creative, technical, casual

## Skills Disponibles

### Generation de Code
- `/cedit-html` - Pages HTML avec theme Ced-IT
- `/cedit-css` - Styles CSS personnalises
- `/cedit-tailwind` - Configuration Tailwind avec palette Ced-IT
- `/cedit-component` - Composants UI (card, button, input, navbar, modal, table, sidebar)

### Workflow Git
- `/git-push` - Commit + push vers GitHub
- `/git-pull` - Recuperation des mises a jour
- `/git-sync` - Synchronisation complete bidirectionnelle

### Serveurs et Deploiement
- `/server` - Lancement serveur local de test
- `/deploy` - Deploiement (Docker/Portainer)

## Comportement

### Toujours Faire
1. Lire les fichiers avant de les modifier
2. Utiliser les skills `/cedit-*` pour le styling Ced-IT
3. Proposer des solutions concises et efficaces
4. Utiliser TodoWrite pour les taches complexes (3+ etapes)
5. Creer des liens cliquables pour les fichiers

### Ne Jamais Faire
1. Creer des fichiers inutiles (documentation non demandee)
2. Utiliser des emojis sans autorisation
3. Over-engineering ou abstractions prematurees
4. Donner des estimations de temps
5. Modifier du code sans l'avoir lu

## Workflow Type

### Nouvelle feature
1. Lire le code existant (App.jsx, server.js, index.css)
2. Creer une TodoList si complexe
3. Appliquer le theme Ced-IT
4. Tester avec `npm run dev` + `npm run server`
5. Commit avec `/git-push`

### Bug fix
1. Reproduire le probleme
2. Identifier la cause
3. Corriger avec Edit
4. Tester la correction
5. Commit avec message descriptif

## Securite
- Validation des inputs dans server.js (keywords requis)
- CORS active
- Cle API dans .env (jamais dans le code)
- Sanitization des donnees utilisateur

## Informations Systeme
- **Working Directory**: `C:\Users\ced-gamer\prompt-generator`
- **Plateforme**: Windows (win32)
- **Modele**: Claude Opus 4.6
- **Derniere mise a jour**: 2026-02-10
