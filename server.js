import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── Serve frontend build ───
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, 'dist')));


// Claude client (si clé disponible)
let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// ─── System prompt expert en prompt engineering ───
const SYSTEM_PROMPT = `Tu es un expert mondial en prompt engineering. Ta mission est de transformer des idées simples en prompts ultra-détaillés et optimisés.

RÈGLES CRITIQUES:
- Génère TOUJOURS un prompt exploitable immédiatement
- Sois EXTRÊMEMENT spécifique et détaillé
- Adapte le vocabulaire technique au type de génération
- Inclus des détails que l'utilisateur n'aurait pas pensé à ajouter
- Le prompt doit maximiser la qualité du résultat final

Tu dois TOUJOURS répondre en JSON valide avec cette structure:
{
  "prompt": "le prompt optimisé complet",
  "tips": ["conseil 1", "conseil 2", "conseil 3"],
  "variations": ["variation 1 du prompt", "variation 2 du prompt"]
}`;

// ─── Instructions spécialisées par type ───
const TYPE_INSTRUCTIONS = {
  image: `TYPE: GÉNÉRATION D'IMAGE
Inclus dans le prompt:
- Style artistique précis (photoréaliste, digital art, aquarelle, 3D render, cinématique...)
- Composition et cadrage (plan large, gros plan, vue aérienne, perspective...)
- Éclairage détaillé (golden hour, néon, studio, naturel, dramatique, rim light...)
- Palette de couleurs dominante
- Ambiance et atmosphère (mystérieux, joyeux, épique, mélancolique...)
- Détails de texture et matériaux
- Résolution et ratio (16:9, 1:1, portrait...)
- Mots-clés de qualité: "highly detailed, 8k, professional, masterpiece"
- Négatifs implicites à éviter`,

  document: `TYPE: DOCUMENT / TEXTE
Inclus dans le prompt:
- Structure complète (introduction, sections, conclusion)
- Ton et registre (formel, conversationnel, académique, persuasif...)
- Public cible précis
- Longueur approximative
- Format (article, rapport, guide, tutoriel, brief...)
- Points clés à couvrir obligatoirement
- Style d'écriture (concis, narratif, technique, vulgarisé...)
- Call-to-action si pertinent
- Sources ou références à inclure`,

  webpage: `TYPE: PAGE WEB / SITE INTERNET
Inclus dans le prompt:
- Layout et structure (hero, features, testimonials, CTA, footer...)
- Stack technique recommandé
- Style visuel (minimaliste, glassmorphism, brutalist, corporate...)
- Responsive design (mobile-first, breakpoints)
- Animations et micro-interactions
- Typographie (font families, hiérarchie)
- Palette de couleurs avec codes hex
- Accessibilité (WCAG)
- SEO (meta tags, structure sémantique)
- Performances (lazy loading, optimisation images)`,

  code: `TYPE: DÉVELOPPEMENT / CODE
Inclus dans le prompt:
- Langage et framework précis avec versions
- Architecture et design patterns
- Structure des fichiers/dossiers
- Gestion d'erreurs et edge cases
- Types/interfaces si TypeScript
- Tests unitaires et d'intégration
- Documentation inline
- Sécurité (validation, sanitisation)
- Performance et optimisation
- Dépendances recommandées`,

  email: `TYPE: EMAIL / COMMUNICATION
Inclus dans le prompt:
- Objet d'email accrocheur (plusieurs options)
- Structure: accroche → corps → CTA → signature
- Ton adapté au contexte (B2B, B2C, interne, formel...)
- Personnalisation (variables dynamiques)
- Longueur optimale
- Call-to-action clair et unique
- Timing d'envoi recommandé
- A/B testing suggestions
- Conformité (RGPD, désabonnement)`,

  social: `TYPE: RÉSEAUX SOCIAUX
Inclus dans le prompt:
- Plateforme cible (Twitter/X, LinkedIn, Instagram, TikTok...)
- Format optimal pour la plateforme
- Hook/accroche en première ligne
- Hashtags stratégiques (mix populaires + niche)
- Call-to-action engageant
- Ton et voix de marque
- Longueur optimale par plateforme
- Meilleur moment de publication
- Stratégie d'engagement (questions, polls, débats)
- Viralité: émotions, controverses positives, storytelling`
};

const STYLE_INSTRUCTIONS = {
  professional: "STYLE: Professionnel, corporate, élégant. Vocabulaire soutenu, structure claire, ton autoritaire mais accessible.",
  creative: "STYLE: Créatif, original, audacieux. Métaphores, storytelling, approche non-conventionnelle, surprise.",
  technical: "STYLE: Technique, précis, détaillé. Jargon spécialisé, spécifications exactes, approche méthodique.",
  casual: "STYLE: Décontracté, conversationnel, accessible. Ton amical, exemples du quotidien, humour léger."
};

// ─── Templates fallback (sans API) ───
const FALLBACK_TEMPLATES = {
  image: {
    prompt: (kw, style) => `Create a ${style === 'creative' ? 'stunning and artistic' : 'professional high-quality'} ${kw}. Style: ultra-detailed digital artwork with cinematic lighting, rich color palette, dramatic composition. Shot in 8K resolution, photorealistic textures, volumetric lighting, depth of field. Trending on ArtStation, masterpiece quality. Aspect ratio 16:9.`,
    tips: [
      "Ajoutez des mots-clés négatifs pour exclure ce que vous ne voulez pas",
      "Précisez le ratio d'image souhaité (16:9, 1:1, 9:16)",
      "Mentionnez un artiste ou style de référence pour guider l'esthétique"
    ],
    variations: (kw) => [
      `Hyperrealistic photograph of ${kw}, shot on Canon EOS R5, 85mm lens, f/1.4, golden hour lighting, shallow depth of field, National Geographic quality, 8K UHD`,
      `Minimalist vector illustration of ${kw}, clean lines, flat design, limited color palette of 4 colors, modern geometric shapes, suitable for large format printing`
    ]
  },
  document: {
    prompt: (kw, style) => `Rédige un document ${style === 'professional' ? 'professionnel et structuré' : 'engageant et accessible'} sur le thème: "${kw}". Structure: 1) Introduction captivante avec contexte et enjeux, 2) Développement en 3-4 sections avec sous-titres clairs, exemples concrets et données chiffrées, 3) Conclusion avec synthèse et recommandations actionables. Ton: ${style === 'technical' ? 'technique et précis' : 'clair et persuasif'}. Longueur: 1500-2000 mots. Public: professionnels du secteur.`,
    tips: [
      "Précisez votre public cible pour adapter le vocabulaire",
      "Ajoutez des données chiffrées pour renforcer la crédibilité",
      "Incluez des exemples concrets et cas pratiques"
    ],
    variations: (kw) => [
      `Crée un guide pratique étape par étape sur "${kw}" avec des checklists, des encadrés "À retenir", des exemples avant/après, et une FAQ des questions les plus fréquentes. Format: guide actionable de 2000 mots.`,
      `Rédige un article d'opinion argumenté sur "${kw}" avec une thèse forte, 5 arguments étayés par des sources, des contre-arguments anticipés, et une conclusion percutante. Style: éditorial engagé.`
    ]
  },
  webpage: {
    prompt: (kw, style) => `Crée une page web moderne et responsive pour "${kw}". Structure: Hero section avec titre impactant + CTA principal, Section features avec icônes et descriptions, Section témoignages/social proof, Section pricing si pertinent, FAQ, Footer avec liens et réseaux sociaux. Design: ${style === 'creative' ? 'glassmorphism avec gradients et animations' : 'clean et professionnel avec beaucoup d\'espace blanc'}. Stack: HTML5 + Tailwind CSS + JavaScript vanilla. Mobile-first, animations au scroll, dark mode support. Typographie: Inter pour le texte, font display pour les titres.`,
    tips: [
      "Priorisez le mobile-first pour un meilleur responsive",
      "Ajoutez des micro-interactions pour améliorer l'UX",
      "Optimisez les images avec lazy loading et formats WebP"
    ],
    variations: (kw) => [
      `Crée un one-page parallax pour "${kw}" avec navigation sticky, sections plein écran, animations GSAP au scroll, compteurs animés, formulaire de contact, intégration Google Maps. Design: minimaliste luxueux noir/blanc/or.`,
      `Crée un dashboard/app web pour "${kw}" avec sidebar navigation, cards de statistiques, graphiques interactifs, tableau de données filtrable, mode sombre/clair. Stack: React + Tailwind + Recharts.`
    ]
  },
  code: {
    prompt: (kw, style) => `Développe ${kw} avec les bonnes pratiques suivantes: Architecture clean avec séparation des responsabilités, Gestion d'erreurs complète avec try/catch et messages explicites, Validation des inputs, Types TypeScript si applicable, Commentaires JSDoc sur les fonctions publiques, Tests unitaires pour les cas nominaux et edge cases, Code DRY et SOLID, Nommage explicite des variables et fonctions. ${style === 'technical' ? 'Optimise pour la performance et la scalabilité.' : 'Privilégie la lisibilité et la maintenabilité.'}`,
    tips: [
      "Ajoutez des tests unitaires pour chaque fonction critique",
      "Utilisez TypeScript pour une meilleure maintenabilité",
      "Documentez les décisions d'architecture importantes"
    ],
    variations: (kw) => [
      `Crée ${kw} en suivant le pattern TDD: 1) Écrire les tests d'abord, 2) Implémenter le code minimal pour les faire passer, 3) Refactorer. Inclure: tests unitaires, tests d'intégration, mocks pour les dépendances externes.`,
      `Développe ${kw} avec une architecture hexagonale: ports et adapters, injection de dépendances, domain-driven design. Inclure un README avec diagramme d'architecture et instructions de setup.`
    ]
  },
  email: {
    prompt: (kw, style) => `Rédige un email ${style === 'professional' ? 'professionnel' : 'engageant'} concernant: "${kw}". Objet: [3 propositions d'objets accrocheurs]. Structure: Accroche personnalisée (1 ligne), Contexte bref (2-3 lignes), Proposition de valeur claire, Preuve sociale ou donnée chiffrée, Call-to-action unique et clair, Signature professionnelle. Ton: ${style === 'casual' ? 'amical et direct' : 'professionnel mais humain'}. Longueur: max 150 mots pour le corps.`,
    tips: [
      "L'objet doit faire moins de 50 caractères pour être lu en entier sur mobile",
      "Un seul CTA par email pour maximiser les conversions",
      "Personnalisez avec le prénom du destinataire"
    ],
    variations: (kw) => [
      `Email de relance concernant "${kw}": Objet court et intrigant, rappel discret du premier contact, nouvelle valeur ajoutée, CTA différent du premier email. Ton: bienveillant, pas insistant. PS: avec un bonus ou une deadline.`,
      `Email séquence de 3 pour "${kw}": Email 1: Introduction et valeur, Email 2: Social proof et cas pratique, Email 3: Urgence et offre finale. Chaque email avec objet, corps et CTA optimisés.`
    ]
  },
  social: {
    prompt: (kw, style) => `Crée un post pour les réseaux sociaux sur: "${kw}". Hook: première ligne ultra-accrocheuse (question, statistique choc, ou déclaration audacieuse). Corps: développement en 3-5 points avec emojis stratégiques, storytelling et valeur actionable. CTA: question engageante ou appel à l'action. Hashtags: 5 hashtags mix (2 populaires + 2 niche + 1 branded). ${style === 'creative' ? 'Approche: storytelling personnel, ton authentique.' : 'Approche: expertise et autorité, données factuelles.'}`,
    tips: [
      "La première ligne détermine 80% de l'engagement",
      "Postez aux heures de pic d'activité de votre audience",
      "Répondez aux commentaires dans les 30 premières minutes"
    ],
    variations: (kw) => [
      `Thread Twitter/X de 5 tweets sur "${kw}": Tweet 1: hook viral + promesse, Tweets 2-4: contenu actionable avec exemples, Tweet 5: résumé + CTA retweet. Format: phrases courtes, emojis bullet points, chiffres ronds.`,
      `Post LinkedIn storytelling sur "${kw}": Début: anecdote personnelle ou échec, Milieu: leçon apprise et framework, Fin: conseil actionable + question d'engagement. Format: une phrase par ligne, max 1300 caractères.`
    ]
  }
};

// ─── Route principale ───
app.post('/api/generate', async (req, res) => {
  try {
    const { keywords, type = 'image', style = 'professional', language = 'fr', hasAttachments = false, negativeKeywords, aspectRatio, artistReference, imageVariants, enrichmentTags } = req.body;

    if (!keywords || keywords.trim().length === 0) {
      return res.status(400).json({ error: 'Les mots-clés sont requis' });
    }

    const langInstruction = language === 'fr'
      ? 'IMPORTANT: Génère le prompt ET toutes les réponses en FRANÇAIS.'
      : 'IMPORTANT: Generate the prompt AND all responses in ENGLISH.';

    // Tags d'enrichissement sélectionnés par l'utilisateur
    let enrichmentSection = '';
    if (Array.isArray(enrichmentTags) && enrichmentTags.length > 0) {
      enrichmentSection = `\n\nMOTS-CLÉS D'ENRICHISSEMENT (sélectionnés par l'utilisateur, à intégrer impérativement dans le prompt): ${enrichmentTags.join(', ')}`;
    }

    // Options avancées (image)
    let advancedOptions = '';
    if (type === 'image') {
      const parts = [];
      if (negativeKeywords) parts.push(`MOTS-CLÉS NÉGATIFS (à exclure absolument): ${negativeKeywords}`);
      if (aspectRatio) parts.push(`RATIO D'IMAGE IMPOSÉ: ${aspectRatio}`);
      if (artistReference) parts.push(`STYLE/ARTISTE DE RÉFÉRENCE: ${artistReference} - Adapte le prompt pour refléter ce style visuel`);
      if (imageVariants && imageVariants > 1) parts.push(`NOMBRE DE VARIANTES: Génère ${imageVariants} versions différentes du prompt, chacune avec une approche visuelle distincte (angle, ambiance, palette, composition)`);
      if (parts.length > 0) advancedOptions = '\n\nOPTIONS AVANCÉES:\n' + parts.join('\n');
    }

    // Instruction fichiers attachés
    const attachmentInstruction = hasAttachments
      ? `\n\nFICHIERS ATTACHÉS: L'utilisateur va joindre des fichiers à analyser avec ce prompt. Le prompt DOIT inclure des instructions claires pour:
- Analyser en détail le contenu des fichiers fournis
- Extraire les informations pertinentes des documents/images/fichiers joints
- Baser la réponse sur le contenu réel des fichiers attachés
- Mentionner explicitement que des fichiers sont fournis et doivent être pris en compte`
      : '';

    // Mode API Claude
    if (anthropic) {
      const userMessage = `${TYPE_INSTRUCTIONS[type] || TYPE_INSTRUCTIONS.image}

${STYLE_INSTRUCTIONS[style] || STYLE_INSTRUCTIONS.professional}

${langInstruction}${enrichmentSection}${advancedOptions}${attachmentInstruction}

IDÉE DE L'UTILISATEUR: "${keywords}"

Génère un prompt ultra-optimisé pour cette idée. Réponds UNIQUEMENT en JSON valide.`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: userMessage }
        ],
        system: SYSTEM_PROMPT
      });

      const content = message.content[0].text;

      // Parser le JSON de la réponse
      let parsed;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        parsed = {
          prompt: content,
          tips: ['Vérifiez le résultat et ajustez selon vos besoins'],
          variations: []
        };
      }

      return res.json(parsed);
    }

    // Mode fallback (sans API)
    const template = FALLBACK_TEMPLATES[type] || FALLBACK_TEMPLATES.image;
    let prompt = template.prompt(keywords, style);

    // Enrichir le prompt fallback avec les tags d'enrichissement
    if (Array.isArray(enrichmentTags) && enrichmentTags.length > 0) {
      prompt += ` Key elements: ${enrichmentTags.join(', ')}.`;
    }

    // Enrichir le prompt fallback avec les options avancées
    if (type === 'image') {
      if (aspectRatio) prompt += ` Aspect ratio ${aspectRatio}.`;
      if (artistReference) prompt += ` Style inspired by ${artistReference}.`;
      if (negativeKeywords) prompt += ` Negative prompt: ${negativeKeywords}.`;
      if (imageVariants && imageVariants > 1) prompt += ` Generate ${imageVariants} distinct visual variations.`;
    }

    // Ajouter instruction fichiers attachés en fallback
    if (hasAttachments) {
      prompt += ` Analyse attentivement les fichiers joints ci-dessous et base ta réponse sur leur contenu. Extrais les informations clés de chaque document/image fourni.`;
    }

    const result = {
      prompt,
      tips: template.tips,
      variations: template.variations(keywords)
    };

    return res.json(result);

  } catch (error) {
    console.error('Erreur génération:', error.message);

    // Fallback en cas d'erreur API
    const { keywords: kw, type: tp = 'image', style: st = 'professional', hasAttachments: ha = false, negativeKeywords: nk, aspectRatio: ar, artistReference: aref, imageVariants: iv, enrichmentTags: etags } = req.body;
    const template = FALLBACK_TEMPLATES[tp] || FALLBACK_TEMPLATES.image;
    let fallbackPrompt = template.prompt(kw, st);

    if (Array.isArray(etags) && etags.length > 0) {
      fallbackPrompt += ` Key elements: ${etags.join(', ')}.`;
    }

    if (tp === 'image') {
      if (ar) fallbackPrompt += ` Aspect ratio ${ar}.`;
      if (aref) fallbackPrompt += ` Style inspired by ${aref}.`;
      if (nk) fallbackPrompt += ` Negative prompt: ${nk}.`;
      if (iv && iv > 1) fallbackPrompt += ` Generate ${iv} distinct visual variations.`;
    }

    if (ha) {
      fallbackPrompt += ` Analyse attentivement les fichiers joints ci-dessous et base ta réponse sur leur contenu. Extrais les informations clés de chaque document/image fourni.`;
    }

    return res.json({
      prompt: fallbackPrompt,
      tips: [...template.tips, '⚠️ Généré en mode hors-ligne (templates)'],
      variations: template.variations(kw)
    });
  }
});

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: anthropic ? 'api' : 'template',
    timestamp: new Date().toISOString()
  });
});

// ─── Fallback SPA ───
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n⚡ Prompt Generator API running on port ${PORT}`);
  console.log(`📡 Mode: ${anthropic ? 'Claude API' : 'Templates (no API key)'}`);
  console.log(`🔗 http://localhost:${PORT}/api/health\n`);
});
