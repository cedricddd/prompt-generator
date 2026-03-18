export const en = {
  header: {
    tagline: "Transform your ideas into optimized prompts",
  },
  types: {
    image: { label: 'Image', desc: 'Visuals & illustrations' },
    document: { label: 'Document', desc: 'Texts & articles' },
    webpage: { label: 'Webpage', desc: 'Sites & landing pages' },
    code: { label: 'Code', desc: 'Dev & programming' },
    email: { label: 'Email', desc: 'Communications' },
    social: { label: 'Social', desc: 'Social media' },
  },
  styles: {
    professional: 'Professional',
    creative: 'Creative',
    technical: 'Technical',
    casual: 'Casual',
  },
  aspectRatios: {
    '16:9': 'Landscape',
    '4:3': 'Standard',
    '1:1': 'Square',
    '9:16': 'Portrait',
  },
  imageVariants: {
    1: 'Unique',
    2: 'Duo',
    3: 'Triple',
    4: 'Quadruple',
  },
  form: {
    yourIdea: 'Your idea',
    ideaPlaceholder: 'Describe your idea in a few words...',
    clear: 'Clear',
    generationType: 'Generation type',
    style: 'Style',
    promptLanguage: 'Prompt language',
    attachments: 'Attached files',
    attachmentsDesc: "The prompt will include analysis of attached files",
    advancedOptions: 'Advanced options',
    aspectRatio: "Aspect ratio",
    variantCount: 'Number of variants',
    negativeKeywords: 'Negative keywords (to exclude)',
    negativeKeywordsPlaceholder: 'Ex: blurry, text, deformed, badly drawn hands...',
    artistReference: 'Style or reference artist',
    artistReferencePlaceholder: 'Ex: Studio Ghibli, impressionism, Van Gogh...',
    generate: 'Generate prompt',
    generating: 'Generating...',
  },
  copy: {
    copy: 'Copy',
    copied: 'Copied!',
    copyJson: 'Copy JSON',
    clipboard: 'Copied to clipboard!',
  },
  loading: {
    tips: [
      'Analyzing your idea...',
      'Optimizing the prompt...',
      'Generating variations...',
      'Adding technical details...',
      'Polishing the result...',
    ],
  },
  result: {
    formatted: 'Formatted',
    optimizedPrompt: 'Optimized Prompt',
    tips: 'Tips',
    variations: 'Variations',
    variation: 'Variation',
  },
  history: {
    recent: 'Recent history',
    clear: 'Clear history',
  },
  suggestions: {
    enrich: 'Enrich prompt',
    clear: 'Clear',
  },
  emptyState: {
    badge: 'Generative AI',
    title: 'Ready to create',
    subtitle: "Describe your idea and let AI transform your words into a perfectly optimized prompt",
    features: {
      images: { label: 'AI Images', desc: 'Midjourney, DALL-E, Stable Diffusion' },
      code: { label: 'Code', desc: 'Clean architecture and best practices' },
      webpages: { label: 'Webpages', desc: 'Landing pages and modern sites' },
      documents: { label: 'Documents', desc: 'Articles, reports and content' },
    },
    steps: { describe: 'Describe', configure: 'Configure', generate: 'Generate' },
    instant: 'Instant',
  },
  credits: { buy: 'Buy →', credit: 'credit', credits: 'credits', sessionSuffix: 'generated this session' },
  toasts: {
    noKeywords: 'Enter an idea or keywords',
    success: 'Prompt generated successfully!',
    error: 'Generation error. Check that the server is running.',
  },
  langSwitcher: { label: 'Language / Langue' },
  typeSuggestions: {
    image: [
      {
        id: 'style', label: 'Artistic styles',
        tags: ['Studio Ghibli', 'Cyberpunk', 'Art Nouveau', 'Pixar', 'Photorealistic', 'Pop Art', 'Impressionism', 'Tim Burton', 'Anime', 'Watercolor', 'Oil painting', 'Vaporwave', 'Steampunk', 'Art Deco', 'Surrealism', 'Minimalist', 'Retro vintage', 'Isometric 3D'],
      },
      {
        id: 'lighting', label: 'Lighting',
        tags: ['Golden Hour', 'Neon', 'Studio', 'Dramatic', 'Chiaroscuro', 'Rim Light', 'Backlight', 'Cinematic', 'Volumetric', 'Soft natural'],
      },
      {
        id: 'composition', label: 'Composition',
        tags: ['Close-up', 'Wide shot', 'Aerial view', 'Macro', 'Symmetrical', 'Rule of thirds', "Bird's eye view", 'Low angle shot', 'Panoramic'],
      },
      {
        id: 'mood', label: 'Mood',
        tags: ['Mysterious', 'Epic', 'Melancholic', 'Dreamlike', 'Futuristic', 'Post-apocalyptic', 'Fairy-tale', 'Dystopian', 'Serene', 'Dark'],
      },
    ],
    document: [
      {
        id: 'format', label: 'Format',
        tags: ['Article', 'Report', 'Practical guide', 'Tutorial', 'Creative brief', 'White paper', 'Case study', 'Newsletter', 'Technical sheet', 'Manifesto'],
      },
      {
        id: 'tone', label: 'Tone',
        tags: ['Formal', 'Academic', 'Persuasive', 'Narrative', 'Simplified', 'Journalistic', 'Inspiring', 'Educational', 'Satirical', 'Poetic'],
      },
      {
        id: 'audience', label: 'Target audience',
        tags: ['Beginners', 'Experts', 'General public', 'Students', 'Professionals', 'Decision-makers', 'Investors', 'Developers'],
      },
    ],
    webpage: [
      {
        id: 'design', label: 'Design',
        tags: ['Minimalist', 'Glassmorphism', 'Brutalist', 'Corporate', 'Dark mode', 'Neumorphism', 'Modern gradient', 'One-page', 'Parallax', 'Bento Grid'],
      },
      {
        id: 'sections', label: 'Sections',
        tags: ['Hero', 'Features', 'Testimonials', 'Pricing', 'FAQ', 'Blog', 'Portfolio', 'Contact', 'Timeline', 'Statistics'],
      },
      {
        id: 'tech', label: 'Technologies',
        tags: ['HTML/CSS', 'React', 'Vue.js', 'Tailwind CSS', 'Next.js', 'GSAP animations', 'Three.js', 'Framer Motion', 'Bootstrap'],
      },
    ],
    code: [
      {
        id: 'language', label: 'Language',
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
        id: 'emailType', label: 'Email type',
        tags: ['Prospecting', 'Follow-up', 'Newsletter', 'Welcome', 'Transactional', 'Event', 'Promotion', 'Feedback', 'Partnership', 'Reactivation'],
      },
      {
        id: 'emailTone', label: 'Tone',
        tags: ['B2B', 'B2C', 'Formal', 'Conversational', 'Urgency', 'Personalized', 'Corporate', 'Friendly', 'Exclusive'],
      },
      {
        id: 'elements', label: 'Key elements',
        tags: ['Strong CTA', 'A/B Test', 'Catchy subject', 'Multi-email sequence', 'Social proof', 'Limited offer', 'Storytelling', 'Data-driven'],
      },
    ],
    social: [
      {
        id: 'platform', label: 'Platform',
        tags: ['Twitter/X', 'LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'YouTube', 'Threads', 'Pinterest'],
      },
      {
        id: 'socialFormat', label: 'Format',
        tags: ['Post', 'Thread', 'Carousel', 'Story', 'Reel', 'Short', 'Infographic', 'Poll', 'Live', 'Behind the scenes'],
      },
      {
        id: 'strategy', label: 'Strategy',
        tags: ['Viral hook', 'Storytelling', 'Engagement', 'Educational', 'Positive controversy', 'Tutorial', 'Before/After', 'Challenge', 'Trending', 'UGC'],
      },
    ],
  },
}
