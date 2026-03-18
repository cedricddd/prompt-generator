export const fr = {
  header: {
    tagline: "Transformez vos idées en prompts optimisés",
  },
  types: {
    image: { label: 'Image', desc: 'Visuels & illustrations' },
    document: { label: 'Document', desc: 'Textes & articles' },
    webpage: { label: 'Page Web', desc: 'Sites & landing pages' },
    code: { label: 'Code', desc: 'Dev & programmation' },
    email: { label: 'Email', desc: 'Communications' },
    social: { label: 'Social', desc: 'Réseaux sociaux' },
  },
  styles: {
    professional: 'Professionnel',
    creative: 'Créatif',
    technical: 'Technique',
    casual: 'Casual',
  },
  aspectRatios: {
    '16:9': 'Paysage',
    '4:3': 'Standard',
    '1:1': 'Carré',
    '9:16': 'Portrait',
  },
  imageVariants: {
    1: 'Unique',
    2: 'Duo',
    3: 'Triple',
    4: 'Quadruple',
  },
  form: {
    yourIdea: 'Votre idée',
    ideaPlaceholder: 'Décrivez votre idée en quelques mots...',
    clear: 'Effacer',
    generationType: 'Type de génération',
    style: 'Style',
    promptLanguage: 'Langue du prompt',
    attachments: 'Fichiers attachés',
    attachmentsDesc: "Le prompt inclura l'analyse de fichiers joints",
    advancedOptions: 'Options avancées',
    aspectRatio: "Ratio d'image",
    variantCount: 'Nombre de variantes',
    negativeKeywords: 'Mots-clés négatifs (à exclure)',
    negativeKeywordsPlaceholder: 'Ex: flou, texte, déformé, mains mal dessinées...',
    artistReference: 'Style ou artiste de référence',
    artistReferencePlaceholder: 'Ex: Studio Ghibli, impressionnisme, Van Gogh...',
    generate: 'Générer le prompt',
    generating: 'Génération en cours...',
  },
  copy: {
    copy: 'Copier',
    copied: 'Copié !',
    copyJson: 'Copier JSON',
    clipboard: 'Copié dans le presse-papier !',
  },
  loading: {
    tips: [
      'Analyse de votre idée...',
      'Optimisation du prompt...',
      'Génération des variations...',
      'Ajout des détails techniques...',
      'Peaufinage du résultat...',
    ],
  },
  result: {
    formatted: 'Formaté',
    optimizedPrompt: 'Prompt Optimisé',
    tips: 'Conseils',
    variations: 'Variations',
    variation: 'Variation',
  },
  history: {
    recent: 'Historique récent',
    clear: "Effacer l'historique",
  },
  suggestions: {
    enrich: 'Enrichir le prompt',
    clear: 'Effacer',
  },
  emptyState: {
    badge: 'IA Générative',
    title: 'Prêt à créer',
    subtitle: "Décrivez votre idée et laissez l'IA transformer vos mots en un prompt parfaitement optimisé",
    features: {
      images: { label: 'Images IA', desc: 'Midjourney, DALL-E, Stable Diffusion' },
      code: { label: 'Code', desc: 'Architecture clean et bonnes pratiques' },
      webpages: { label: 'Pages Web', desc: 'Landing pages et sites modernes' },
      documents: { label: 'Documents', desc: 'Articles, rapports et contenus' },
    },
    steps: { describe: 'Décrivez', configure: 'Configurez', generate: 'Générez' },
    instant: 'Instantané',
  },
  credits: { buy: 'Acheter →', credit: 'crédit', credits: 'crédits', sessionSuffix: 'créé(s) cette session' },
  toasts: {
    noKeywords: 'Entrez une idée ou des mots-clés',
    success: 'Prompt généré avec succès !',
    error: 'Erreur lors de la génération. Vérifiez que le serveur est lancé.',
  },
  langSwitcher: { label: 'Langue / Language' },
  typeSuggestions: {
    image: [
      {
        id: 'style', label: 'Styles artistiques',
        tags: ['Studio Ghibli', 'Cyberpunk', 'Art Nouveau', 'Pixar', 'Photoréaliste', 'Pop Art', 'Impressionnisme', 'Tim Burton', 'Anime', 'Aquarelle', "Peinture à l'huile", 'Vaporwave', 'Steampunk', 'Art Déco', 'Surréalisme', 'Minimaliste', 'Rétro vintage', 'Isométrique 3D'],
      },
      {
        id: 'lighting', label: 'Éclairage',
        tags: ['Golden Hour', 'Néon', 'Studio', 'Dramatique', 'Clair-obscur', 'Rim Light', 'Contre-jour', 'Cinématique', 'Volumétrique', 'Naturel doux'],
      },
      {
        id: 'composition', label: 'Composition',
        tags: ['Gros plan', 'Plan large', 'Vue aérienne', 'Macro', 'Symétrique', 'Règle des tiers', 'Vue plongeante', 'Contre-plongée', 'Panoramique'],
      },
      {
        id: 'mood', label: 'Ambiance',
        tags: ['Mystérieux', 'Épique', 'Mélancolique', 'Onirique', 'Futuriste', 'Post-apocalyptique', 'Féérique', 'Dystopique', 'Serein', 'Sombre'],
      },
    ],
    document: [
      {
        id: 'format', label: 'Format',
        tags: ['Article', 'Rapport', 'Guide pratique', 'Tutoriel', 'Brief créatif', 'Livre blanc', 'Étude de cas', 'Newsletter', 'Fiche technique', 'Manifeste'],
      },
      {
        id: 'tone', label: 'Ton',
        tags: ['Formel', 'Académique', 'Persuasif', 'Narratif', 'Vulgarisé', 'Journalistique', 'Inspirant', 'Didactique', 'Satirique', 'Poétique'],
      },
      {
        id: 'audience', label: 'Public cible',
        tags: ['Débutants', 'Experts', 'Grand public', 'Étudiants', 'Professionnels', 'Décideurs', 'Investisseurs', 'Développeurs'],
      },
    ],
    webpage: [
      {
        id: 'design', label: 'Design',
        tags: ['Minimaliste', 'Glassmorphism', 'Brutalist', 'Corporate', 'Dark mode', 'Néomorphisme', 'Gradient moderne', 'One-page', 'Parallax', 'Bento Grid'],
      },
      {
        id: 'sections', label: 'Sections',
        tags: ['Hero', 'Features', 'Témoignages', 'Pricing', 'FAQ', 'Blog', 'Portfolio', 'Contact', 'Timeline', 'Statistiques'],
      },
      {
        id: 'tech', label: 'Technologies',
        tags: ['HTML/CSS', 'React', 'Vue.js', 'Tailwind CSS', 'Next.js', 'Animations GSAP', 'Three.js', 'Framer Motion', 'Bootstrap'],
      },
    ],
    code: [
      {
        id: 'language', label: 'Langage',
        tags: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin'],
      },
      {
        id: 'pattern', label: 'Patterns & Architecture',
        tags: ['MVC', 'REST API', 'GraphQL', 'Microservices', 'Clean Architecture', 'TDD', 'SOLID', 'CQRS', 'Event-driven', 'Hexagonal'],
      },
      {
        id: 'framework', label: 'Frameworks',
        tags: ['React', 'Vue', 'Angular', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot', '.NET', 'Laravel'],
      },
    ],
    email: [
      {
        id: 'emailType', label: "Type d'email",
        tags: ['Prospection', 'Relance', 'Newsletter', 'Bienvenue', 'Transactionnel', 'Événement', 'Promotion', 'Feedback', 'Partenariat', 'Réactivation'],
      },
      {
        id: 'emailTone', label: 'Ton',
        tags: ['B2B', 'B2C', 'Formel', 'Conversationnel', 'Urgence', 'Personnalisé', 'Corporate', 'Amical', 'Exclusif'],
      },
      {
        id: 'elements', label: 'Éléments clés',
        tags: ['CTA puissant', 'A/B Test', 'Objet accrocheur', 'Séquence multi-email', 'Social proof', 'Offre limitée', 'Storytelling', 'Données chiffrées'],
      },
    ],
    social: [
      {
        id: 'platform', label: 'Plateforme',
        tags: ['Twitter/X', 'LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'YouTube', 'Threads', 'Pinterest'],
      },
      {
        id: 'socialFormat', label: 'Format',
        tags: ['Post', 'Thread', 'Carrousel', 'Story', 'Reel', 'Short', 'Infographie', 'Sondage', 'Live', 'Behind the scenes'],
      },
      {
        id: 'strategy', label: 'Stratégie',
        tags: ['Hook viral', 'Storytelling', 'Engagement', 'Éducatif', 'Controverse positive', 'Tutorial', 'Avant/Après', 'Défi/Challenge', 'Tendance', 'UGC'],
      },
    ],
  },
}
