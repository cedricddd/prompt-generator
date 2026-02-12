import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import {
  Image, FileText, Globe, Code, Mail, Share2,
  Sparkles, Copy, Check, Loader2, Lightbulb, Shuffle,
  Zap, X, Clock, RotateCcw, ChevronDown, ChevronUp,
  Keyboard, ArrowRight, Ban, Ratio, Palette, Settings2,
  Wand2, BrainCircuit, Rocket, Star, Paperclip, Layers
} from 'lucide-react'

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
function CopyButton({ text, label = 'Copier' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copié dans le presse-papier !')
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
      {copied ? 'Copié !' : label}
    </button>
  )
}

// ─── Composant Loading (orbital enrichi) ───
function LoadingState() {
  const tips = [
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
  }, [])

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

// ─── Composant vue JSON avec coloration syntaxique ───
function JsonView({ data }) {
  const json = JSON.stringify(data, null, 2)

  const highlighted = json.replace(
    /("(?:\\.|[^"\\])*")\s*:/g,
    '<span style="color:#00d4ff">$1</span>:'
  ).replace(
    /:\s*("(?:\\.|[^"\\])*")/g,
    ': <span style="color:#10b981">$1</span>'
  )

  return (
    <div className="animated-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0, 212, 255, 0.15)' }}
          >
            <Code size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <h3 className="text-base font-bold text-white">JSON</h3>
        </div>
        <CopyButton text={json} label="Copier JSON" />
      </div>
      <pre
        className="rounded-xl p-4 text-sm leading-relaxed overflow-x-auto custom-scrollbar"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          color: 'var(--text)',
          lineHeight: '1.7',
          borderLeft: '3px solid var(--accent)',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontSize: '0.8rem',
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  )
}

// ─── Composant Résultat ───
function ResultSection({ result }) {
  const [viewMode, setViewMode] = useState('formatted')

  if (!result) return null

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toggle formatted / JSON */}
      <div className="flex items-center justify-end">
        <div
          className="flex items-center rounded-xl p-1"
          style={{ background: 'var(--secondary)', border: '1px solid rgba(0, 212, 255, 0.08)' }}
        >
          <button
            onClick={() => setViewMode('formatted')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer"
            style={{
              background: viewMode === 'formatted' ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
              color: viewMode === 'formatted' ? 'var(--accent)' : 'var(--text-muted)',
              border: viewMode === 'formatted' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent',
            }}
          >
            <Sparkles size={12} />
            Formaté
          </button>
          <button
            onClick={() => setViewMode('json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer"
            style={{
              background: viewMode === 'json' ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
              color: viewMode === 'json' ? 'var(--accent)' : 'var(--text-muted)',
              border: viewMode === 'json' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent',
            }}
          >
            <Code size={12} />
            JSON
          </button>
        </div>
      </div>

      {viewMode === 'json' ? (
        <JsonView data={result} />
      ) : (
        <>
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
                <h3 className="text-base font-bold text-white">Prompt Optimisé</h3>
              </div>
              <CopyButton text={result.prompt} />
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
                <h3 className="text-base font-bold text-white">Conseils</h3>
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
                <h3 className="text-base font-bold text-white">Variations</h3>
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
                        Variation {i + 1}
                      </span>
                      <CopyButton text={variation} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                      {variation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Composant Historique ───
function HistoryPanel({ history, onSelect, onClear }) {
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
        Historique récent ({history.length})
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
                {TYPES.find(t => t.id === item.type)?.label}
              </span>
            </button>
          ))}
          <button
            onClick={onClear}
            className="text-xs transition-colors duration-200 cursor-pointer hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Effacer l'historique
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
function SuggestionPanel({ type, selectedTags, onToggleTag, onClearTags }) {
  const [open, setOpen] = useState(false)
  const categories = TYPE_SUGGESTIONS[type]
  if (!categories) return null

  const typeColor = TYPES.find(t => t.id === type)?.color || 'var(--accent)'

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setOpen(!open)}
        className="w-full section-label mb-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Wand2 size={14} />
        Enrichir le prompt
        {selectedTags.length > 0 && (
          <span className="badge-pill" style={{ fontSize: '0.65rem' }}>
            {selectedTags.length}
          </span>
        )}
        <span className="flex items-center gap-2 ml-auto">
          {selectedTags.length > 0 && (
            <span
              onClick={(e) => { e.stopPropagation(); onClearTags() }}
              className="text-xs cursor-pointer transition-colors duration-200 hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              Effacer
            </span>
          )}
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>
      {open && <div className="glass-card p-4 space-y-3 animate-fade-in-scale">
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
      </div>}
    </div>
  )
}

// ─── État vide enrichi ───
function EmptyState() {
  const features = [
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
        Prêt à créer
      </h3>
      <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
        Décrivez votre idée et laissez l'IA transformer vos mots en un prompt parfaitement optimisé
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
          Décrivez
        </span>
        <ArrowRight size={12} style={{ color: 'var(--accent)', opacity: 0.4 }} />
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>2</span>
          Configurez
        </span>
        <ArrowRight size={12} style={{ color: 'var(--accent)', opacity: 0.4 }} />
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>3</span>
          Générez
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="badge-pill">
          <Keyboard size={11} />
          Ctrl + Enter
        </span>
        <span className="badge-pill">
          <Zap size={11} />
          Instantané
        </span>
      </div>
    </div>
  )
}

// ─── App principale ───
export default function App() {
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

  // Panneaux repliables
  const [showAdvanced, setShowAdvanced] = useState(false)

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
        ? prev.filter(t => t !== tag)
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

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error('Entrez une idée ou des mots-clés')
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
      toast.success('Prompt généré avec succès !')
    } catch (err) {
      toast.error('Erreur lors de la génération. Vérifiez que le serveur est lancé.')
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

      {/* ─── Header compact ─── */}
      <header className="relative pt-4 pb-3 text-center" style={{ zIndex: 1 }}>
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img
              src="/logo-ced-it.png"
              alt="Ced-IT"
              className="h-30 animate-float object-contain"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.4))',
              }}
            />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight gradient-text">
              Prompt Generator
            </h1>
            {generationCount > 0 && (
              <div className="badge-pill">
                <Rocket size={10} />
                {generationCount}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs shimmer-text font-medium">
              Transformez vos idées en prompts optimisés
            </span>
            <span className="badge-pill" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
              <Keyboard size={9} />
              Ctrl+Enter
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-16 pb-10" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 lg:gap-6">

          {/* ─── Colonne gauche : Formulaire ─── */}
          <div className="space-y-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">

            {/* Textarea */}
            <div className="animate-fade-in">
              <div className="section-label mb-2">
                <Sparkles size={14} />
                Votre idée
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
                  placeholder="Décrivez votre idée en quelques mots..."
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
                        Effacer
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
                />
              </div>
            </div>

            {/* Type selector */}
            <div className="animate-fade-in-delay">
              <div className="section-label mb-2">
                <Zap size={14} />
                Type de génération
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TYPES.map(({ id, label, icon: Icon, desc, color }) => (
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
              />
            </div>

            {/* Style + Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-delay-2">
              {/* Style */}
              <div>
                <div className="section-label mb-2">
                  Style
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(({ id, label, icon }) => (
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
                  Langue du prompt
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
                    Fichiers attachés
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Le prompt inclura l'analyse de fichiers joints
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
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full section-label mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Settings2 size={14} />
                  Options avancées
                  <span className="ml-auto">
                    {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </span>
                </button>
                {showAdvanced && <div className="space-y-4 animate-fade-in-scale">

                  {/* Ratio d'image */}
                  <div>
                    <label
                      className="flex items-center gap-2 text-xs font-medium mb-2.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Ratio size={13} />
                      Ratio d'image
                    </label>
                    <div className="flex gap-2">
                      {ASPECT_RATIOS.map(({ id, label, desc }) => (
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
                      Nombre de variantes
                    </label>
                    <div className="flex gap-2">
                      {IMAGE_VARIANTS.map(({ id, label, desc }) => (
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
                      Mots-clés négatifs (à exclure)
                    </label>
                    <input
                      type="text"
                      value={negativeKeywords}
                      onChange={(e) => setNegativeKeywords(e.target.value)}
                      placeholder="Ex: flou, texte, déformé, mains mal dessinées..."
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
                      Style ou artiste de référence
                    </label>
                    <input
                      type="text"
                      value={artistReference}
                      onChange={(e) => setArtistReference(e.target.value)}
                      placeholder="Ex: Studio Ghibli, impressionnisme, Van Gogh..."
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
                </div>}
              </div>
            )}

            {/* Generate button (enrichi avec ripple) */}
            <button
              ref={btnRef}
              onClick={(e) => {
                createRipple(e)
                handleGenerate()
              }}
              disabled={loading || !keywords.trim()}
              className="btn-ripple group w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading ? 'var(--secondary)' : 'linear-gradient(135deg, var(--accent), #0066ff)',
                color: loading ? 'var(--text-muted)' : 'white',
                border: 'none',
                boxShadow: !loading && keywords.trim() ? '0 0 25px rgba(0, 212, 255, 0.3), 0 0 50px rgba(0, 102, 255, 0.15)' : 'none',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                if (!loading && keywords.trim()) e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 212, 255, 0.5), 0 0 70px rgba(0, 102, 255, 0.25)'
              }}
              onMouseLeave={(e) => {
                if (!loading && keywords.trim()) e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 212, 255, 0.3), 0 0 50px rgba(0, 102, 255, 0.15)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="group-hover:animate-spin" />
                  Générer le prompt
                </>
              )}
            </button>
          </div>

          {/* ─── Colonne droite : Résultats ─── */}
          <div className="lg:min-h-[calc(100vh-140px)]">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar">
              {loading && <LoadingState />}
              {!loading && result && <ResultSection result={result} />}
              {!loading && !result && <EmptyState />}
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
