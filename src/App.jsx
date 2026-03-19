import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import {
  Image, FileText, Globe, Code, Mail, Share2,
  Sparkles, Copy, Check, Loader2, Lightbulb, Shuffle,
  Zap, X, Clock, RotateCcw, ChevronDown, ChevronUp,
  Keyboard, ArrowRight, Ban, Ratio, Palette, Settings2,
  Wand2, BrainCircuit, Rocket, Star, Paperclip, Layers, LayoutGrid
} from 'lucide-react'
import { LanguageSwitcher } from './components/LanguageSwitcher.jsx'
import { useLanguage } from './contexts/LanguageContext.jsx'
import { useAuth } from './contexts/AuthContext.jsx'
import { useCredit } from './lib/auth'

const SAAS_URL = import.meta.env.VITE_SAAS_URL || 'https://saas.ced-it.be'

// ─── Configuration des types ───
const TYPES = [
  { id: 'image', label: 'Image', icon: Image, desc: 'Visuels & illustrations', color: '#a855f7' },
  { id: 'document', label: 'Document', icon: FileText, desc: 'Textes & articles', color: '#3b82f6' },
  { id: 'webpage', label: 'Page Web', icon: Globe, desc: 'Sites & landing pages', color: '#10b981' },
  { id: 'code', label: 'Code', icon: Code, desc: 'Dev & programmation', color: '#f59e0b' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'Communications', color: '#ef4444' },
  { id: 'social', label: 'Social', icon: Share2, desc: 'Réseaux sociaux', color: '#ec4899' },
]

const STYLES = [
  { id: 'professional', label: 'Professionnel', icon: '🎯' },
  { id: 'creative', label: 'Créatif', icon: '🎨' },
  { id: 'technical', label: 'Technique', icon: '⚙️' },
  { id: 'casual', label: 'Casual', icon: '💬' },
]

const LANGUAGES = [
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
]

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', desc: 'Paysage' },
  { id: '4:3', label: '4:3', desc: 'Standard' },
  { id: '1:1', label: '1:1', desc: 'Carré' },
  { id: '9:16', label: '9:16', desc: 'Portrait' },
]

/**
 * Configuration des suggestions enrichies par type de génération.
 * Chaque type contient des catégories de tags cliquables
 * permettant d'enrichir automatiquement le prompt.
 * @type {Record<string, Array<{id: string, label: string, tags: string[]}>>}
 */
const TYPE_SUGGESTIONS = {
  image: [
    {
      id: 'style',
      label: 'Styles artistiques',
      tags: [
        'Studio Ghibli', 'Cyberpunk', 'Art Nouveau', 'Pixar', 'Photoréaliste',
        'Pop Art', 'Impressionnisme', 'Tim Burton', 'Anime', 'Aquarelle',
        'Peinture à l\'huile', 'Vaporwave', 'Steampunk', 'Art Déco',
        'Surréalisme', 'Minimaliste', 'Rétro vintage', 'Isométrique 3D',
      ],
    },
    {
      id: 'lighting',
      label: 'Éclairage',
      tags: [
        'Golden Hour', 'Néon', 'Studio', 'Dramatique', 'Clair-obscur',
        'Rim Light', 'Contre-jour', 'Cinématique', 'Volumétrique', 'Naturel doux',
      ],
    },
    {
      id: 'composition',
      label: 'Composition',
      tags: [
        'Gros plan', 'Plan large', 'Vue aérienne', 'Macro', 'Symétrique',
        'Règle des tiers', 'Vue plongeante', 'Contre-plongée', 'Panoramique',
      ],
    },
    {
      id: 'mood',
      label: 'Ambiance',
      tags: [
        'Mystérieux', 'Épique', 'Mélancolique', 'Onirique', 'Futuriste',
        'Post-apocalyptique', 'Féérique', 'Dystopique', 'Serein', 'Sombre',
      ],
    },
  ],
  document: [
    {
      id: 'format',
      label: 'Format',
      tags: [
        'Article', 'Rapport', 'Guide pratique', 'Tutoriel', 'Brief créatif',
        'Livre blanc', 'Étude de cas', 'Newsletter', 'Fiche technique', 'Manifeste',
      ],
    },
    {
      id: 'tone',
      label: 'Ton',
      tags: [
        'Formel', 'Académique', 'Persuasif', 'Narratif', 'Vulgarisé',
        'Journalistique', 'Inspirant', 'Didactique', 'Satirique', 'Poétique',
      ],
    },
    {
      id: 'audience',
      label: 'Public cible',
      tags: [
        'Débutants', 'Experts', 'Grand public', 'Étudiants',
        'Professionnels', 'Décideurs', 'Investisseurs', 'Développeurs',
      ],
    },
  ],
  webpage: [
    {
      id: 'design',
      label: 'Design',
      tags: [
        'Minimaliste', 'Glassmorphism', 'Brutalist', 'Corporate', 'Dark mode',
        'Néomorphisme', 'Gradient moderne', 'One-page', 'Parallax', 'Bento Grid',
      ],
    },
    {
      id: 'sections',
      label: 'Sections',
      tags: [
        'Hero', 'Features', 'Témoignages', 'Pricing', 'FAQ',
        'Blog', 'Portfolio', 'Contact', 'Timeline', 'Statistiques',
      ],
    },
    {
      id: 'tech',
      label: 'Technologies',
      tags: [
        'HTML/CSS', 'React', 'Vue.js', 'Tailwind CSS', 'Next.js',
        'Animations GSAP', 'Three.js', 'Framer Motion', 'Bootstrap',
      ],
    },
  ],
  code: [
    {
      id: 'language',
      label: 'Langage',
      tags: [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
        'Go', 'Rust', 'PHP', 'Swift', 'Kotlin',
      ],
    },
    {
      id: 'pattern',
      label: 'Patterns & Architecture',
      tags: [
        'MVC', 'REST API', 'GraphQL', 'Microservices', 'Clean Architecture',
        'TDD', 'SOLID', 'CQRS', 'Event-driven', 'Hexagonal',
      ],
    },
    {
      id: 'framework',
      label: 'Frameworks',
      tags: [
        'React', 'Vue', 'Angular', 'Express', 'NestJS',
        'Django', 'FastAPI', 'Spring Boot', '.NET', 'Laravel',
      ],
    },
  ],
  email: [
    {
      id: 'emailType',
      label: 'Type d\'email',
      tags: [
        'Prospection', 'Relance', 'Newsletter', 'Bienvenue', 'Transactionnel',
        'Événement', 'Promotion', 'Feedback', 'Partenariat', 'Réactivation',
      ],
    },
    {
      id: 'emailTone',
      label: 'Ton',
      tags: [
        'B2B', 'B2C', 'Formel', 'Conversationnel', 'Urgence',
        'Personnalisé', 'Corporate', 'Amical', 'Exclusif',
      ],
    },
    {
      id: 'elements',
      label: 'Éléments clés',
      tags: [
        'CTA puissant', 'A/B Test', 'Objet accrocheur', 'Séquence multi-email',
        'Social proof', 'Offre limitée', 'Storytelling', 'Données chiffrées',
      ],
    },
  ],
  social: [
    {
      id: 'platform',
      label: 'Plateforme',
      tags: [
        'Twitter/X', 'LinkedIn', 'Instagram', 'TikTok',
        'Facebook', 'YouTube', 'Threads', 'Pinterest',
      ],
    },
    {
      id: 'socialFormat',
      label: 'Format',
      tags: [
        'Post', 'Thread', 'Carrousel', 'Story', 'Reel',
        'Short', 'Infographie', 'Sondage', 'Live', 'Behind the scenes',
      ],
    },
    {
      id: 'strategy',
      label: 'Stratégie',
      tags: [
        'Hook viral', 'Storytelling', 'Engagement', 'Éducatif',
        'Controverse positive', 'Tutorial', 'Avant/Après', 'Défi/Challenge',
        'Tendance', 'UGC',
      ],
    },
  ],
}

const IMAGE_VARIANTS = [
  { id: 1, label: '1', desc: 'Unique' },
  { id: 2, label: '2', desc: 'Duo' },
  { id: 3, label: '3', desc: 'Triple' },
  { id: 4, label: '4', desc: 'Quadruple' },
]

const MAX_CHARS = 500

// ─── Hook: Historique localStorage ───
function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prompt-history') || '[]')
    } catch {
      return []
    }
  })

  const addToHistory = useCallback((entry) => {
    setHistory(prev => {
      const updated = [{ ...entry, timestamp: Date.now() }, ...prev].slice(0, 10)
      localStorage.setItem('prompt-history', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('prompt-history')
  }, [])

  return { history, addToHistory, clearHistory }
}

// ─── Particules flottantes (background vivant) ───
function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle particle-glow"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `particleDrift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Composant CopyButton ───
function CopyButton({ text, label, t }) {
  const [copied, setCopied] = useState(false)
  const copyLabel = label ?? (t ? t.copy.copy : 'Copier')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(t ? t.copy.clipboard : 'Copié dans le presse-papier !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer hover:scale-105"
      style={{
        background: copied ? 'var(--success)' : 'rgba(0, 212, 255, 0.1)',
        color: copied ? 'white' : 'var(--accent)',
        border: `1px solid ${copied ? 'var(--success)' : 'rgba(0, 212, 255, 0.2)'}`,
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? (t ? t.copy.copied : 'Copié !') : copyLabel}
    </button>
  )
}

// ─── Composant Loading (orbital enrichi) ───
function LoadingState({ t }) {
  const tips = t ? t.loading.tips : [
    'Analyse de votre idée...',
    'Optimisation du prompt...',
    'Génération des variations...',
    'Ajout des détails techniques...',
    'Peaufinage du résultat...',
  ]
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [tips.length])

  return (
    <div className="flex flex-col items-center gap-6 py-16 animate-fade-in">
      {/* Orbital animation */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Pulse rings */}
        <div className="pulse-ring w-24 h-24" style={{ top: 0, left: 0 }} />
        <div className="pulse-ring w-24 h-24" style={{ top: 0, left: 0 }} />
        <div className="pulse-ring w-24 h-24" style={{ top: 0, left: 0 }} />

        {/* Centre */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center breath"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #0066ff)',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
          }}
        >
          <BrainCircuit size={26} className="text-white" />
        </div>

        {/* Orbiting dots */}
        <div
          className="orbital-dot w-3 h-3"
          style={{
            top: '50%', left: '50%',
            marginTop: '-6px', marginLeft: '-6px',
            background: 'var(--accent)',
            boxShadow: '0 0 8px rgba(0, 212, 255, 0.6)',
          }}
        />
        <div
          className="orbital-dot-reverse w-2 h-2"
          style={{
            top: '50%', left: '50%',
            marginTop: '-4px', marginLeft: '-4px',
            background: '#0066ff',
            boxShadow: '0 0 8px rgba(0, 102, 255, 0.6)',
          }}
        />
      </div>

      {/* Texte animé */}
      <div className="text-center space-y-3">
        <p
          className="text-sm font-semibold transition-all duration-500"
          style={{ color: 'var(--accent)' }}
          key={tipIndex}
        >
          {tips[tipIndex]}
        </p>

        {/* Progress shimmer bar */}
        <div
          className="w-48 h-1 mx-auto rounded-full overflow-hidden"
          style={{ background: 'rgba(0, 212, 255, 0.1)' }}
        >
          <div className="shimmer-loading h-full rounded-full" style={{ width: '100%' }} />
        </div>

        <span className="flex justify-center gap-1.5 mt-2">
          <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        </span>
      </div>
    </div>
  )
}

// ─── Composant Résultat ───
function ResultSection({ result, t }) {
  if (!result) return null

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Prompt principal */}
      <div className="animated-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0, 212, 255, 0.15)' }}
            >
              <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-base font-bold text-white">{t ? t.result.optimizedPrompt : 'Prompt Optimisé'}</h3>
          </div>
          <CopyButton text={result.prompt} t={t} />
        </div>
        <div
          className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            color: 'var(--text)',
            lineHeight: '1.8',
            borderLeft: '3px solid var(--accent)',
          }}
        >
          {result.prompt}
        </div>
      </div>

      {/* Tips */}
      {result.tips && result.tips.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-delay">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245, 158, 11, 0.15)' }}
            >
              <Lightbulb size={16} style={{ color: 'var(--warning)' }} />
            </div>
            <h3 className="text-base font-bold text-white">{t ? t.result.tips : 'Conseils'}</h3>
          </div>
          <ul className="space-y-3">
            {result.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm rounded-lg p-3 transition-all duration-300 hover:translate-x-1"
                style={{ color: 'var(--text)', background: 'rgba(0, 0, 0, 0.15)' }}
              >
                <ArrowRight
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--warning)' }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Variations */}
      {result.variations && result.variations.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-delay-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0, 212, 255, 0.15)' }}
            >
              <Shuffle size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-base font-bold text-white">{t ? t.result.variations : 'Variations'}</h3>
          </div>
          <div className="space-y-3">
            {result.variations.map((variation, i) => (
              <div
                key={i}
                className="rounded-xl p-4 transition-all duration-300 hover:translate-x-1"
                style={{
                  background: 'var(--secondary)',
                  border: '1px solid rgba(0, 212, 255, 0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-pill">
                    {t ? t.result.variation : 'Variation'} {i + 1}
                  </span>
                  <CopyButton text={variation} t={t} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  {variation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Composant Historique ───
function HistoryPanel({ history, onSelect, onClear, t, types }) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-medium transition-all duration-300 cursor-pointer hover:opacity-80"
        style={{ color: 'var(--text-muted)' }}
      >
        <Clock size={13} />
        {t ? t.history.recent : 'Historique récent'} ({history.length})
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2 animate-fade-in-scale">
          {history.slice(0, 5).map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-xl text-xs transition-all duration-300 cursor-pointer flex items-center gap-3 group"
              style={{
                background: 'var(--secondary)',
                border: '1px solid rgba(0, 212, 255, 0.06)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)'
                e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.06)'
                e.currentTarget.style.background = 'var(--secondary)'
              }}
            >
              <RotateCcw size={12} className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
              <span className="truncate flex-1">{item.keywords}</span>
              <span className="shrink-0 opacity-40" style={{ color: 'var(--text-muted)' }}>
                {(types || TYPES).find(tp => tp.id === item.type)?.label}
              </span>
            </button>
          ))}
          <button
            onClick={onClear}
            className="text-xs transition-colors duration-200 cursor-pointer hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            {t ? t.history.clear : "Effacer l'historique"}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Panneau de suggestions par type ───
/**
 * Affiche des catégories de tags cliquables pour enrichir le prompt.
 * Les tags sont spécifiques au type de génération sélectionné.
 * @param {Object} props
 * @param {string} props.type - Type de génération actuel
 * @param {string[]} props.selectedTags - Tags actuellement sélectionnés
 * @param {(tag: string) => void} props.onToggleTag - Callback de toggle d'un tag
 * @param {() => void} props.onClearTags - Callback pour tout désélectionner
 */
function SuggestionPanel({ type, selectedTags, onToggleTag, onClearTags, t, types }) {
  const categories = t ? t.typeSuggestions[type] : TYPE_SUGGESTIONS[type]
  if (!categories) return null

  const typeColor = (types || TYPES).find(tp => tp.id === type)?.color || 'var(--accent)'

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="section-label mb-2">
        <Wand2 size={14} />
        {t ? t.suggestions.enrich : 'Enrichir le prompt'}
        {selectedTags.length > 0 && (
          <span className="flex items-center gap-2 ml-auto">
            <span className="badge-pill" style={{ fontSize: '0.65rem' }}>
              {selectedTags.length} sélectionné{selectedTags.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={onClearTags}
              className="text-xs cursor-pointer transition-colors duration-200 hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {t ? t.suggestions.clear : 'Effacer'}
            </button>
          </span>
        )}
      </div>
      <div className="glass-card p-4 space-y-3">
        {categories.map((category) => (
          <div key={category.id}>
            <span
              className="text-xs font-medium mb-1.5 block uppercase tracking-wider"
              style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}
            >
              {category.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {category.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => onToggleTag(tag)}
                    className="suggestion-tag"
                    style={{
                      background: isSelected ? `${typeColor}20` : 'rgba(0, 212, 255, 0.04)',
                      color: isSelected ? typeColor : 'var(--text-muted)',
                      border: `1px solid ${isSelected ? `${typeColor}40` : 'rgba(0, 212, 255, 0.06)'}`,
                      boxShadow: isSelected ? `0 0 8px ${typeColor}15` : 'none',
                    }}
                  >
                    {isSelected && <span className="suggestion-check">&#10003;</span>}
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── État vide enrichi ───
function EmptyState({ t }) {
  const features = t ? [
    { icon: Image, label: t.emptyState.features.images.label, desc: t.emptyState.features.images.desc, color: '#a855f7' },
    { icon: Code, label: t.emptyState.features.code.label, desc: t.emptyState.features.code.desc, color: '#f59e0b' },
    { icon: Globe, label: t.emptyState.features.webpages.label, desc: t.emptyState.features.webpages.desc, color: '#10b981' },
    { icon: FileText, label: t.emptyState.features.documents.label, desc: t.emptyState.features.documents.desc, color: '#3b82f6' },
  ] : [
    { icon: Image, label: 'Images IA', desc: 'Midjourney, DALL-E, Stable Diffusion', color: '#a855f7' },
    { icon: Code, label: 'Code', desc: 'Architecture clean et bonnes pratiques', color: '#f59e0b' },
    { icon: Globe, label: 'Pages Web', desc: 'Landing pages et sites modernes', color: '#10b981' },
    { icon: FileText, label: 'Documents', desc: 'Articles, rapports et contenus', color: '#3b82f6' },
  ]

  return (
    <div className="glass-card p-8 text-center animate-fade-in relative overflow-hidden">
      {/* Scan line subtle */}
      <div className="scan-line" />

      {/* Icônes flottantes décoratives */}
      <div className="relative w-24 h-24 mx-auto mb-5">
        {/* Blob morphing background */}
        <div
          className="absolute inset-0 morph-blob"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            transform: 'scale(1.5)',
          }}
        />

        {/* Icône principale */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center breath"
            style={{
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.15)',
              width: '72px',
              height: '72px',
            }}
          >
            <Wand2 size={30} style={{ color: 'var(--accent)', opacity: 0.6 }} />
          </div>
        </div>

        {/* Petites icônes orbitales */}
        <div className="float-icon-1 absolute -top-2 -right-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
            <Star size={14} style={{ color: '#a855f7', opacity: 0.7 }} />
          </div>
        </div>
        <div className="float-icon-2 absolute -bottom-1 -left-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 212, 255, 0.15)' }}>
            <Sparkles size={12} style={{ color: 'var(--accent)', opacity: 0.7 }} />
          </div>
        </div>
        <div className="float-icon-3 absolute top-0 -left-4">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <Rocket size={10} style={{ color: '#10b981', opacity: 0.7 }} />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 text-white">
        {t ? t.emptyState.title : 'Prêt à créer'}
      </h3>
      <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
        {t ? t.emptyState.subtitle : "Décrivez votre idée et laissez l'IA transformer vos mots en un prompt parfaitement optimisé"}
      </p>

      {/* Gradient separator */}
      <div className="gradient-line w-24 mx-auto my-5" />

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-left">
        {features.map(({ icon: Icon, label, desc, color }) => (
          <div
            key={label}
            className="rounded-xl p-3 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 212, 255, 0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon size={12} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-white">{label}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>1</span>
          {t ? t.emptyState.steps.describe : 'Décrivez'}
        </span>
        <ArrowRight size={12} style={{ color: 'var(--accent)', opacity: 0.4 }} />
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>2</span>
          {t ? t.emptyState.steps.configure : 'Configurez'}
        </span>
        <ArrowRight size={12} style={{ color: 'var(--accent)', opacity: 0.4 }} />
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>3</span>
          {t ? t.emptyState.steps.generate : 'Générez'}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="badge-pill">
          <Keyboard size={11} />
          Ctrl + Enter
        </span>
        <span className="badge-pill">
          <Zap size={11} />
          {t ? t.emptyState.instant : 'Instantané'}
        </span>
      </div>
    </div>
  )
}

// ─── App principale ───
export default function App() {
  const { t, locale } = useLanguage()
  const { token, creditsRemaining, setCreditsRemaining, accessType } = useAuth() ?? {}

  const TYPES_I18N = [
    { id: 'image', label: t.types.image.label, icon: Image, desc: t.types.image.desc, color: '#a855f7' },
    { id: 'document', label: t.types.document.label, icon: FileText, desc: t.types.document.desc, color: '#3b82f6' },
    { id: 'webpage', label: t.types.webpage.label, icon: Globe, desc: t.types.webpage.desc, color: '#10b981' },
    { id: 'code', label: t.types.code.label, icon: Code, desc: t.types.code.desc, color: '#f59e0b' },
    { id: 'email', label: t.types.email.label, icon: Mail, desc: t.types.email.desc, color: '#ef4444' },
    { id: 'social', label: t.types.social.label, icon: Share2, desc: t.types.social.desc, color: '#ec4899' },
  ]

  const STYLES_I18N = [
    { id: 'professional', label: t.styles.professional, icon: '🎯' },
    { id: 'creative', label: t.styles.creative, icon: '🎨' },
    { id: 'technical', label: t.styles.technical, icon: '⚙️' },
    { id: 'casual', label: t.styles.casual, icon: '💬' },
  ]

  const ASPECT_RATIOS_I18N = [
    { id: '16:9', label: '16:9', desc: t.aspectRatios['16:9'] },
    { id: '4:3', label: '4:3', desc: t.aspectRatios['4:3'] },
    { id: '1:1', label: '1:1', desc: t.aspectRatios['1:1'] },
    { id: '9:16', label: '9:16', desc: t.aspectRatios['9:16'] },
  ]

  const IMAGE_VARIANTS_I18N = [
    { id: 1, label: '1', desc: t.imageVariants[1] },
    { id: 2, label: '2', desc: t.imageVariants[2] },
    { id: 3, label: '3', desc: t.imageVariants[3] },
    { id: 4, label: '4', desc: t.imageVariants[4] },
  ]

  const [keywords, setKeywords] = useState('')
  const [type, setType] = useState('image')
  const [style, setStyle] = useState('professional')
  const [language, setLanguage] = useState('fr')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [generationCount, setGenerationCount] = useState(() => {
    try { return parseInt(localStorage.getItem('gen-count') || '0') } catch { return 0 }
  })
  const { history, addToHistory, clearHistory } = useHistory()
  const btnRef = useRef(null)

  // Option fichiers attachés
  const [hasAttachments, setHasAttachments] = useState(false)

  // Options avancées (image)
  const [negativeKeywords, setNegativeKeywords] = useState('')
  const [aspectRatio, setAspectRatio] = useState('')
  const [artistReference, setArtistReference] = useState('')
  const [imageVariants, setImageVariants] = useState(1)

  // Tags d'enrichissement (par type)
  const [selectedTags, setSelectedTags] = useState([])

  /**
   * Toggle un tag dans la sélection.
   * Ajoute le tag s'il n'est pas sélectionné, le retire sinon.
   * @param {string} tag - Le tag à toggler
   */
  const handleToggleTag = useCallback((tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(existingTag => existingTag !== tag)
        : [...prev, tag]
    )
  }, [])

  /** Réinitialise tous les tags sélectionnés */
  const handleClearTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  // Ripple effect sur le bouton
  const createRipple = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'ripple-effect'
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }

  // Crédits épuisés = accessType "credits" ET solde = 0
  const hasNoCredits = accessType === 'credits' && creditsRemaining !== null && creditsRemaining <= 0

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error(t.toasts.noKeywords)
      return
    }

    if (hasNoCredits) {
      toast.error('Vos crédits sont épuisés. Achetez un pack pour continuer.')
      setTimeout(() => { window.location.href = `${SAAS_URL}/apps/prompt-generator?reason=credits_exhausted` }, 1500)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const payload = { keywords: keywords.trim(), type, style, language, hasAttachments }

      // Ajout des tags d'enrichissement sélectionnés
      if (selectedTags.length > 0) {
        payload.enrichmentTags = selectedTags
      }

      if (type === 'image') {
        if (negativeKeywords.trim()) payload.negativeKeywords = negativeKeywords.trim()
        if (aspectRatio) payload.aspectRatio = aspectRatio
        if (artistReference.trim()) payload.artistReference = artistReference.trim()
        if (imageVariants > 1) payload.imageVariants = imageVariants
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Erreur serveur')

      const data = await res.json()
      setResult(data)

      const newCount = generationCount + 1
      setGenerationCount(newCount)
      localStorage.setItem('gen-count', String(newCount))

      addToHistory({
        keywords: keywords.trim(), type, style, language, hasAttachments,
        selectedTags,
        negativeKeywords: negativeKeywords.trim(),
        aspectRatio,
        artistReference: artistReference.trim(),
        imageVariants,
      })
      toast.success(t.toasts.success)

      // Déduire 1 crédit après une génération réussie
      if (accessType === 'credits' && token) {
        const creditResult = await useCredit(token)
        if (creditResult === 'no_credits') {
          setCreditsRemaining(0)
          toast.error('Vos crédits sont épuisés. Achetez un pack pour continuer.', { duration: 5000 })
        } else if (creditResult?.creditsRemaining !== undefined) {
          setCreditsRemaining(creditResult.creditsRemaining)
        }
      }
    } catch (err) {
      toast.error(t.toasts.error)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate()
    }
  }

  const handleSelectHistory = (item) => {
    setKeywords(item.keywords)
    setType(item.type)
    setStyle(item.style)
    setLanguage(item.language)
    setHasAttachments(item.hasAttachments || false)
    setNegativeKeywords(item.negativeKeywords || '')
    setAspectRatio(item.aspectRatio || '')
    setArtistReference(item.artistReference || '')
    setImageVariants(item.imageVariants || 1)
    setSelectedTags(item.selectedTags || [])
  }

  const charCount = keywords.length
  const charPercent = (charCount / MAX_CHARS) * 100

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--primary)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '12px',
          },
        }}
      />

      {/* ─── Aurora background ─── */}
      <div className="aurora-bg" />

      {/* ─── Particules flottantes ─── */}
      <FloatingParticles />

      {/* ─── Header enrichi ─── */}
      <header className="relative pt-6 pb-5 text-center" style={{ zIndex: 50 }}>
        {/* Boutons haut droite */}
        <div className="absolute top-4 right-4 sm:right-6 flex items-center gap-2" style={{ zIndex: 10 }}>
          <LanguageSwitcher />
          <a
            href={SAAS_URL}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 no-underline"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
              e.currentTarget.style.background = 'rgba(0,212,255,0.05)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline font-bold tracking-wider" style={{ fontSize: '0.65rem' }}>SaaS</span>
          </a>
        </div>
        <div className="animate-fade-in">
          {/* Compteur de générations + crédits restants */}
          <div className="flex justify-center gap-2 mb-3 animate-fade-in-scale flex-wrap">
            {generationCount > 0 && (
              <div className="badge-pill">
                <Rocket size={11} />
                {generationCount} prompt{generationCount > 1 ? 's' : ''} généré{generationCount > 1 ? 's' : ''}
              </div>
            )}
            {accessType === 'credits' && creditsRemaining !== null && (
              <div className="badge-pill" style={{
                background: creditsRemaining <= 1 ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.08)',
                borderColor: creditsRemaining <= 1 ? 'rgba(239,68,68,0.3)' : 'rgba(0,212,255,0.15)',
                color: creditsRemaining <= 1 ? '#f87171' : 'var(--accent)',
              }}>
                <Sparkles size={11} />
                {creditsRemaining} crédit{creditsRemaining !== 1 ? 's' : ''} restant{creditsRemaining !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center animate-float"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #0066ff)',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 102, 255, 0.2)',
              }}
            >
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight gradient-text">
                Prompt Generator
              </h1>
            </div>
          </div>
          <p className="text-sm max-w-lg mx-auto shimmer-text font-medium">
            {t.header.tagline}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="badge-pill">
              <Keyboard size={11} />
              Ctrl + Enter
            </span>
            <span className="badge-pill">
              <BrainCircuit size={11} />
              Propulsé par IA
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-16 pb-10" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8">

          {/* ─── Colonne gauche : Formulaire ─── */}
          <div className="space-y-5">

            {/* Textarea */}
            <div className="animate-fade-in">
              <div className="section-label mb-2">
                <Sparkles size={14} />
                {t.form.yourIdea}
              </div>
              <div
                className="relative rounded-2xl transition-all duration-300"
                style={{
                  background: 'var(--secondary)',
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                }}
              >
                <textarea
                  value={keywords}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setKeywords(e.target.value)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={t.form.ideaPlaceholder}
                  rows={4}
                  className="w-full rounded-2xl p-5 pb-10 text-base resize-none transition-all duration-300 outline-none"
                  style={{
                    background: 'transparent',
                    color: 'var(--text)',
                    border: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.parentElement.style.borderColor = 'var(--accent)'
                    e.target.parentElement.style.boxShadow = 'var(--glow)'
                  }}
                  onBlur={(e) => {
                    e.target.parentElement.style.borderColor = 'rgba(0, 212, 255, 0.15)'
                    e.target.parentElement.style.boxShadow = 'none'
                  }}
                />
                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 pb-3">
                  <div className="flex items-center gap-3">
                    {keywords.length > 0 && (
                      <button
                        onClick={() => setKeywords('')}
                        className="flex items-center gap-1 text-xs cursor-pointer transition-colors duration-200 hover:opacity-80"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <X size={12} />
                        {t.form.clear}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-16 h-1 rounded-full overflow-hidden"
                      style={{ background: 'rgba(0, 212, 255, 0.1)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${charPercent}%`,
                          background: charPercent > 90 ? 'var(--danger)' : charPercent > 70 ? 'var(--warning)' : 'var(--accent)',
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-mono"
                      style={{
                        color: charPercent > 90 ? 'var(--danger)' : 'var(--text-muted)',
                      }}
                    >
                      {charCount}/{MAX_CHARS}
                    </span>
                  </div>
                </div>
              </div>

              {/* Historique */}
              <div className="mt-3">
                <HistoryPanel
                  history={history}
                  onSelect={handleSelectHistory}
                  onClear={clearHistory}
                  t={t}
                  types={TYPES_I18N}
                />
              </div>
            </div>

            {/* Type selector */}
            <div className="animate-fade-in-delay">
              <div className="section-label mb-2">
                <Zap size={14} />
                {t.form.generationType}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TYPES_I18N.map(({ id, label, icon: Icon, desc, color }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (id !== type) setSelectedTags([])
                      setType(id)
                    }}
                    className="group relative flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300 cursor-pointer text-left overflow-hidden"
                    style={{
                      background: type === id ? 'var(--secondary)' : 'transparent',
                      border: `1px solid ${type === id ? color : 'rgba(0, 212, 255, 0.08)'}`,
                      boxShadow: type === id ? `0 0 20px ${color}30` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (type !== id) {
                        e.currentTarget.style.borderColor = `${color}50`
                        e.currentTarget.style.background = 'var(--surface-hover)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (type !== id) {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.08)'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {type === id && (
                      <div
                        className="absolute top-0 left-0 w-1 h-full rounded-r"
                        style={{ background: color }}
                      />
                    )}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        background: type === id ? `${color}20` : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <Icon
                        size={18}
                        style={{ color: type === id ? color : 'var(--text-muted)' }}
                        className="transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <span
                        className="block text-sm font-semibold transition-colors duration-300"
                        style={{ color: type === id ? 'white' : 'var(--text)' }}
                      >
                        {label}
                      </span>
                      <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Panneau de suggestions enrichies */}
            <div className="animate-fade-in-delay">
              <SuggestionPanel
                type={type}
                selectedTags={selectedTags}
                onToggleTag={handleToggleTag}
                onClearTags={handleClearTags}
                t={t}
                types={TYPES_I18N}
              />
            </div>

            {/* Style + Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-delay-2">
              {/* Style */}
              <div>
                <div className="section-label mb-2">
                  {t.form.style}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES_I18N.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => setStyle(id)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
                      style={{
                        background: style === id ? 'linear-gradient(135deg, var(--accent), #0099cc)' : 'var(--secondary)',
                        color: style === id ? 'var(--primary)' : 'var(--text)',
                        border: `1px solid ${style === id ? 'var(--accent)' : 'rgba(0, 212, 255, 0.08)'}`,
                        boxShadow: style === id ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (style !== id) e.currentTarget.style.background = 'var(--surface-hover)'
                      }}
                      onMouseLeave={(e) => {
                        if (style !== id) e.currentTarget.style.background = 'var(--secondary)'
                      }}
                    >
                      <span>{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <div className="section-label mb-2">
                  {t.form.promptLanguage}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(({ id, label, flag }) => (
                    <button
                      key={id}
                      onClick={() => setLanguage(id)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
                      style={{
                        background: language === id ? 'linear-gradient(135deg, var(--accent), #0099cc)' : 'var(--secondary)',
                        color: language === id ? 'var(--primary)' : 'var(--text)',
                        border: `1px solid ${language === id ? 'var(--accent)' : 'rgba(0, 212, 255, 0.08)'}`,
                        boxShadow: language === id ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (language !== id) e.currentTarget.style.background = 'var(--surface-hover)'
                      }}
                      onMouseLeave={(e) => {
                        if (language !== id) e.currentTarget.style.background = 'var(--secondary)'
                      }}
                    >
                      <span className="text-lg">{flag}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Toggle fichiers attachés ─── */}
            <div className="animate-fade-in-delay-2">
              <button
                onClick={() => setHasAttachments(!hasAttachments)}
                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: hasAttachments ? 'rgba(0, 212, 255, 0.08)' : 'var(--secondary)',
                  border: `1px solid ${hasAttachments ? 'var(--accent)' : 'rgba(0, 212, 255, 0.08)'}`,
                  boxShadow: hasAttachments ? '0 0 20px rgba(0, 212, 255, 0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!hasAttachments) {
                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)'
                    e.currentTarget.style.background = 'var(--surface-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasAttachments) {
                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.08)'
                    e.currentTarget.style.background = 'var(--secondary)'
                  }
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{
                    background: hasAttachments ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <Paperclip
                    size={18}
                    style={{ color: hasAttachments ? 'var(--accent)' : 'var(--text-muted)' }}
                    className="transition-colors duration-300"
                  />
                </div>
                <div className="flex-1 text-left">
                  <span
                    className="block text-sm font-semibold transition-colors duration-300"
                    style={{ color: hasAttachments ? 'white' : 'var(--text)' }}
                  >
                    {t.form.attachments}
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {t.form.attachmentsDesc}
                  </span>
                </div>
                {/* Toggle switch */}
                <div
                  className="w-11 h-6 rounded-full relative transition-all duration-300 shrink-0"
                  style={{
                    background: hasAttachments ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: hasAttachments ? '0 0 10px rgba(0, 212, 255, 0.3)' : 'none',
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                    style={{
                      left: hasAttachments ? '22px' : '2px',
                      background: hasAttachments ? 'white' : 'var(--text-muted)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </div>
              </button>
            </div>

            {/* ─── Options avancées (Image) ─── */}
            {type === 'image' && (
              <div className="animate-fade-in">
                <div className="section-label mb-2">
                  <Settings2 size={14} />
                  {t.form.advancedOptions}
                </div>
                <div className="space-y-4">

                  {/* Ratio d'image */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-xs font-medium mb-2.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Ratio size={13} />
                      {t.form.aspectRatio}
                    </label>
                    <div className="flex gap-2">
                      {ASPECT_RATIOS_I18N.map(({ id, label, desc }) => (
                        <button
                          key={id}
                          onClick={() => setAspectRatio(aspectRatio === id ? '' : id)}
                          className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-center transition-all duration-300 cursor-pointer"
                          style={{
                            background: aspectRatio === id ? 'rgba(0, 212, 255, 0.15)' : 'var(--secondary)',
                            border: `1px solid ${aspectRatio === id ? 'var(--accent)' : 'rgba(0, 212, 255, 0.08)'}`,
                            boxShadow: aspectRatio === id ? '0 0 12px rgba(0, 212, 255, 0.15)' : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (aspectRatio !== id) e.currentTarget.style.background = 'var(--surface-hover)'
                          }}
                          onMouseLeave={(e) => {
                            if (aspectRatio !== id) e.currentTarget.style.background = 'var(--secondary)'
                          }}
                        >
                          <span
                            className="font-mono text-sm font-bold"
                            style={{ color: aspectRatio === id ? 'var(--accent)' : 'var(--text)' }}
                          >
                            {label}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nombre de variantes */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-xs font-medium mb-2.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Layers size={13} />
                      {t.form.variantCount}
                    </label>
                    <div className="flex gap-2">
                      {IMAGE_VARIANTS_I18N.map(({ id, label, desc }) => (
                        <button
                          key={id}
                          onClick={() => setImageVariants(id)}
                          className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-center transition-all duration-300 cursor-pointer"
                          style={{
                            background: imageVariants === id ? 'rgba(0, 212, 255, 0.15)' : 'var(--secondary)',
                            border: `1px solid ${imageVariants === id ? 'var(--accent)' : 'rgba(0, 212, 255, 0.08)'}`,
                            boxShadow: imageVariants === id ? '0 0 12px rgba(0, 212, 255, 0.15)' : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (imageVariants !== id) e.currentTarget.style.background = 'var(--surface-hover)'
                          }}
                          onMouseLeave={(e) => {
                            if (imageVariants !== id) e.currentTarget.style.background = 'var(--secondary)'
                          }}
                        >
                          <span
                            className="font-mono text-sm font-bold"
                            style={{ color: imageVariants === id ? 'var(--accent)' : 'var(--text)' }}
                          >
                            {label}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mots-clés négatifs */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-xs font-medium mb-2.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Ban size={13} />
                      {t.form.negativeKeywords}
                    </label>
                    <input
                      type="text"
                      value={negativeKeywords}
                      onChange={(e) => setNegativeKeywords(e.target.value)}
                      placeholder={t.form.negativeKeywordsPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                      style={{
                        background: 'var(--secondary)',
                        color: 'var(--text)',
                        border: '1px solid rgba(0, 212, 255, 0.08)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)'
                        e.target.style.boxShadow = 'var(--glow)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 212, 255, 0.08)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  {/* Style / Artiste de référence */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-xs font-medium mb-2.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Palette size={13} />
                      {t.form.artistReference}
                    </label>
                    <input
                      type="text"
                      value={artistReference}
                      onChange={(e) => setArtistReference(e.target.value)}
                      placeholder={t.form.artistReferencePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                      style={{
                        background: 'var(--secondary)',
                        color: 'var(--text)',
                        border: '1px solid rgba(0, 212, 255, 0.08)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)'
                        e.target.style.boxShadow = 'var(--glow)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 212, 255, 0.08)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ─── Colonne droite : Résultats ─── */}
          <div className="lg:min-h-[calc(100vh-140px)]">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar">
              {loading && <LoadingState t={t} />}
              {!loading && result && <ResultSection result={result} t={t} />}
              {!loading && !result && (
                <>
                  <EmptyState t={t} />
                  {/* Generate button */}
                  <button
                    ref={btnRef}
                    onClick={(e) => {
                      createRipple(e)
                      handleGenerate()
                    }}
                    disabled={!keywords.trim() || hasNoCredits}
                    className="btn-ripple group w-full py-6 rounded-2xl text-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-10"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent), #0066ff)',
                      color: 'white',
                      border: 'none',
                      boxShadow: keywords.trim() ? '0 0 30px rgba(0, 212, 255, 0.35), 0 0 60px rgba(0, 102, 255, 0.2)' : 'none',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={(e) => {
                      if (keywords.trim()) e.currentTarget.style.boxShadow = '0 0 45px rgba(0, 212, 255, 0.55), 0 0 90px rgba(0, 102, 255, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      if (keywords.trim()) e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.35), 0 0 60px rgba(0, 102, 255, 0.2)'
                    }}
                  >
                    <Sparkles size={26} className="group-hover:animate-spin" />
                    {t.form.generate}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ─── Footer enrichi ─── */}
      <footer
        className="footer-glow relative text-center py-5 text-xs"
        style={{ color: 'var(--text-muted)', zIndex: 1 }}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--accent), #0066ff)',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
            }}
          >
            <Zap size={10} className="text-white" />
          </div>
          <span className="font-medium">
            Ced-IT &copy; {new Date().getFullYear()}
          </span>
          <span style={{ color: 'rgba(0, 212, 255, 0.3)' }}>|</span>
          <span>Prompt Generator</span>
          {generationCount > 0 && (
            <>
              <span style={{ color: 'rgba(0, 212, 255, 0.3)' }}>|</span>
              <span style={{ opacity: 0.6 }}>
                {generationCount} prompt{generationCount > 1 ? 's' : ''} créé{generationCount > 1 ? 's' : ''} avec cette session
              </span>
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
