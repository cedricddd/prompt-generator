import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { checkAppAccess, getStoredToken, useCredit } from './lib/auth'
import { Toaster, toast } from 'react-hot-toast'
import {
  Image, FileText, Globe, Code, Mail, Share2,
  Sparkles, Copy, Check, Loader2, Lightbulb, Shuffle,
  Zap, X, Clock, RotateCcw,
  Keyboard, ArrowRight, Ban, Ratio, Palette, Settings2,
  Wand2, BrainCircuit, Rocket, Star, Paperclip, Layers, LayoutGrid
} from 'lucide-react'
import { useLanguage } from './contexts/LanguageContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'

// ─── Configuration des types (labels depuis i18n) ───
const TYPES_CONFIG = [
  { id: 'image', icon: Image, color: '#a855f7' },
  { id: 'document', icon: FileText, color: '#3b82f6' },
  { id: 'webpage', icon: Globe, color: '#10b981' },
  { id: 'code', icon: Code, color: '#f59e0b' },
  { id: 'email', icon: Mail, color: '#ef4444' },
  { id: 'social', icon: Share2, color: '#ec4899' },
]

const STYLES_CONFIG = [
  { id: 'professional', icon: '🎯' },
  { id: 'creative', icon: '🎨' },
  { id: 'technical', icon: '⚙️' },
  { id: 'casual', icon: '💬' },
]

const LANGUAGES = [
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
]

const ASPECT_RATIOS_CONFIG = [
  { id: '16:9', label: '16:9' },
  { id: '4:3', label: '4:3' },
  { id: '1:1', label: '1:1' },
  { id: '9:16', label: '9:16' },
]

const IMAGE_VARIANTS_CONFIG = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: 4, label: '4' },
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
function CopyButton({ text, label, size = 'sm' }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const isLg = size === 'lg'
  const displayLabel = label ?? t.copy.copy

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(t.copy.clipboard)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer hover:scale-105 ${
        isLg ? 'px-6 py-3 text-base' : 'px-3 py-1.5 rounded-lg text-xs font-medium'
      }`}
      style={{
        background: copied
          ? 'var(--success)'
          : isLg
            ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.18) 0%, rgba(0, 102, 255, 0.18) 100%)'
            : 'rgba(0, 212, 255, 0.1)',
        color: copied ? 'white' : 'var(--accent)',
        border: `1px solid ${copied ? 'var(--success)' : isLg ? 'rgba(0, 212, 255, 0.35)' : 'rgba(0, 212, 255, 0.2)'}`,
        boxShadow: !copied && isLg ? '0 0 18px rgba(0, 212, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.05)' : undefined,
      }}
    >
      {copied ? <Check size={isLg ? 18 : 13} /> : <Copy size={isLg ? 18 : 13} />}
      {copied ? t.copy.copied : displayLabel}
    </button>
  )
}

// ─── Composant Loading (orbital enrichi) ───
function LoadingState() {
  const { t } = useLanguage()
  const tips = t.loading.tips
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

// ─── Composant vue JSON avec coloration syntaxique ───
function JsonView({ data }) {
  const { t } = useLanguage()
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
        <CopyButton text={json} label={t.copy.copyJson} />
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
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState('formatted')

  if (!result) return null

  return (
    <div className="animate-fade-in">
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
            {t.result.formatted}
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
                <h3 className="text-base font-bold text-white">{t.result.optimizedPrompt}</h3>
              </div>
              <CopyButton text={result.prompt} size="lg" />
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
            <div className="glass-card p-6 animate-fade-in-delay" style={{ marginTop: '2rem' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(245, 158, 11, 0.15)' }}
                >
                  <Lightbulb size={16} style={{ color: 'var(--warning)' }} />
                </div>
                <h3 className="text-base font-bold text-white">{t.result.tips}</h3>
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
            <div className="glass-card p-6 animate-fade-in-delay-2" style={{ marginTop: '2rem' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0, 212, 255, 0.15)' }}
                >
                  <Shuffle size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-base font-bold text-white">{t.result.variations}</h3>
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
                        {t.result.variation} {i + 1}
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
  const { t } = useLanguage()
  if (history.length === 0) return null

  return (
    <div className="animate-fade-in">
      <div
        className="flex items-center gap-2 text-xs font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        <Clock size={13} />
        {t.history.recent} ({history.length})
      </div>

      <div className="mt-3 space-y-2">
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
                {t.types[item.type]?.label}
              </span>
            </button>
          ))}
          <button
            onClick={onClear}
            className="text-xs transition-colors duration-200 cursor-pointer hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            {t.history.clear}
          </button>
        </div>
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
const CATEGORY_PALETTE = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#00d4ff', '#f97316']

function SuggestionPanel({ type, selectedTags, onToggleTag, onClearTags }) {
  const { t } = useLanguage()
  const categories = t.typeSuggestions[type]
  if (!categories) return null

  return (
    <div className="animate-fade-in">
      <div className="w-full section-label mb-2">
        <Wand2 size={14} />
        {t.suggestions.enrich}
        {selectedTags.length > 0 && (
          <span className="badge-pill" style={{ fontSize: '0.65rem' }}>
            {selectedTags.length}
          </span>
        )}
        {selectedTags.length > 0 && (
          <span
            onClick={onClearTags}
            className="text-xs cursor-pointer transition-colors duration-200 hover:underline ml-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            {t.suggestions.clear}
          </span>
        )}
      </div>
      <div className="glass-card p-4 space-y-3">
        {categories.map((category, catIndex) => {
          const catColor = CATEGORY_PALETTE[catIndex % CATEGORY_PALETTE.length]
          return (
            <div key={category.id}>
              <span
                className="text-xs font-semibold mb-1.5 block uppercase tracking-wider"
                style={{ color: catColor, fontSize: '0.65rem', opacity: 0.85 }}
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
                        background: isSelected ? `${catColor}22` : `${catColor}0a`,
                        color: isSelected ? catColor : `${catColor}b3`,
                        border: `1px solid ${isSelected ? `${catColor}50` : `${catColor}22`}`,
                        boxShadow: isSelected ? `0 0 8px ${catColor}20` : 'none',
                      }}
                    >
                      {isSelected && <span className="suggestion-check">&#10003;</span>}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── État vide enrichi ───
function EmptyState() {
  const { t } = useLanguage()
  const features = [
    { icon: Image, label: t.emptyState.features.images.label, desc: t.emptyState.features.images.desc, color: '#a855f7' },
    { icon: Code, label: t.emptyState.features.code.label, desc: t.emptyState.features.code.desc, color: '#f59e0b' },
    { icon: Globe, label: t.emptyState.features.webpages.label, desc: t.emptyState.features.webpages.desc, color: '#10b981' },
    { icon: FileText, label: t.emptyState.features.documents.label, desc: t.emptyState.features.documents.desc, color: '#3b82f6' },
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

      {/* Titre décroché */}
      <div className="gradient-line w-12 mx-auto mt-4 mb-6" />
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3"
        style={{
          background: 'rgba(0, 212, 255, 0.08)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          color: 'var(--accent)',
        }}
      >
        <Sparkles size={10} />
        {t.emptyState.badge}
      </div>
      <h3
        className="text-3xl font-black mb-3 tracking-tight"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.35))',
        }}
      >
        {t.emptyState.title}
      </h3>
      <p className="text-sm leading-relaxed max-w-sm mx-auto mb-2" style={{ color: 'var(--text-muted)' }}>
        {t.emptyState.subtitle}
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
          {t.emptyState.steps.describe}
        </span>
        <ArrowRight size={12} style={{ color: 'var(--accent)', opacity: 0.4 }} />
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>2</span>
          {t.emptyState.steps.configure}
        </span>
        <ArrowRight size={12} style={{ color: 'var(--accent)', opacity: 0.4 }} />
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.05)' }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>3</span>
          {t.emptyState.steps.generate}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="badge-pill">
          <Keyboard size={11} />
          Ctrl + Enter
        </span>
        <span className="badge-pill">
          <Zap size={11} />
          {t.emptyState.instant}
        </span>
      </div>
    </div>
  )
}

// ─── App principale ───
export default function App() {
  const { t } = useLanguage()

  const TYPES = TYPES_CONFIG.map(cfg => ({
    ...cfg,
    label: t.types[cfg.id].label,
    desc: t.types[cfg.id].desc,
  }))
  const STYLES = STYLES_CONFIG.map(cfg => ({ ...cfg, label: t.styles[cfg.id] }))
  const ASPECT_RATIOS = ASPECT_RATIOS_CONFIG.map(cfg => ({ ...cfg, desc: t.aspectRatios[cfg.id] }))
  const IMAGE_VARIANTS = IMAGE_VARIANTS_CONFIG.map(cfg => ({ ...cfg, desc: t.imageVariants[cfg.id] }))

  const [keywords, setKeywords] = useState('')
  const [type, setType] = useState('image')
  const [style, setStyle] = useState('professional')
  const [language, setLanguage] = useState('fr')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [generationCount, setGenerationCount] = useState(() => {
    try { return parseInt(localStorage.getItem('gen-count') || '0') } catch { return 0 }
  })
  const [creditsRemaining, setCreditsRemaining] = useState(null)
  const [isUnlimited, setIsUnlimited] = useState(true) // défaut: on assume illimité jusqu'à vérification
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

  // ─── Auth + solde crédits ───
  useEffect(() => {
    checkAppAccess().then((access) => {
      if (access.status === 'authorized') {
        if (access.creditsRemaining !== null) {
          setCreditsRemaining(access.creditsRemaining)
          setIsUnlimited(false)
        } else {
          setIsUnlimited(true)
        }
      }
    })
  }, [])

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
      toast.error(t.toasts.noKeywords)
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

      // Déduire 1 crédit après génération réussie (comptes à crédits uniquement)
      const token = getStoredToken()
      if (token && !isUnlimited) {
        const credit = await useCredit(token)
        if (credit === 'no_credits') {
          window.location.href = 'https://saas.ced-it.be/dashboard/credits'
          return
        }
        if (credit?.creditsRemaining !== undefined) {
          setCreditsRemaining(credit.creditsRemaining)
        }
      }

      addToHistory({
        keywords: keywords.trim(), type, style, language, hasAttachments,
        selectedTags,
        negativeKeywords: negativeKeywords.trim(),
        aspectRatio,
        artistReference: artistReference.trim(),
        imageVariants,
      })
      toast.success(t.toasts.success)
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

      {/* ─── Barre dégradée arc-en-ciel ─── */}
      <div className="rainbow-bar" />

      {/* ─── Aurora background ─── */}
      <div className="aurora-bg" />

      {/* ─── Particules flottantes ─── */}
      <FloatingParticles />

      {/* ─── Header compact ─── */}
      <header className="relative pt-6 pb-3 px-4 text-center" style={{ zIndex: 10 }}>
        <div className="absolute right-4 top-4 flex items-center gap-2" style={{ zIndex: 1 }}>
          <LanguageSwitcher />
          <a
            href="https://saas.ced-it.be/dashboard"
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:brightness-125"
            style={{
              border: '1px solid rgba(0, 212, 255, 0.5)',
              color: 'var(--accent)',
              background: 'rgba(0, 212, 255, 0.05)',
              textDecoration: 'none',
              letterSpacing: '0.03em',
            }}
          >
            <LayoutGrid size={14} />
            SaaS
          </a>
        </div>
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img
              src="/logo-ced-it.png"
              alt="Ced-IT"
              className="h-12 sm:h-16 md:h-24 animate-float object-contain"
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
          {/* ─── Strip colorée des types ─── */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {TYPES.map(({ id, label, icon: Icon, color }) => (
              <span
                key={id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: `${color}18`,
                  color: color,
                  border: `1px solid ${color}45`,
                }}
              >
                <Icon size={11} />
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="text-xs shimmer-text font-medium">
              {t.header.tagline}
            </span>
            <span className="badge-pill" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
              <Keyboard size={9} />
              Ctrl+Enter
            </span>
            {creditsRemaining !== null && (
              <span
                className="badge-pill"
                style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.5rem',
                  background: creditsRemaining === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.1)',
                  border: creditsRemaining === 0 ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(0,212,255,0.3)',
                  color: creditsRemaining === 0 ? '#ef4444' : 'var(--accent)',
                }}
              >
                ✦ {creditsRemaining} {creditsRemaining !== 1 ? t.credits.credits : t.credits.credit}
                {creditsRemaining === 0 && (
                  <a
                    href="https://saas.ced-it.be/dashboard/credits"
                    style={{ marginLeft: '0.3rem', textDecoration: 'underline' }}
                  >
                    {t.credits.buy}
                  </a>
                )}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-16 pb-10" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14">

          {/* ─── Colonne gauche : Formulaire ─── */}
          <div className="space-y-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">

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
                {TYPES.map(({ id, label, icon: Icon, desc, color }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (id !== type) setSelectedTags([])
                      setType(id)
                    }}
                    className="group relative flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300 cursor-pointer text-left overflow-hidden"
                    style={{
                      background: type === id ? 'var(--secondary)' : `${color}0d`,
                      border: `1px solid ${type === id ? color : `${color}30`}`,
                      boxShadow: type === id ? `0 0 20px ${color}30` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (type !== id) {
                        e.currentTarget.style.borderColor = `${color}60`
                        e.currentTarget.style.background = `${color}1a`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (type !== id) {
                        e.currentTarget.style.borderColor = `${color}30`
                        e.currentTarget.style.background = `${color}0d`
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
                        background: type === id ? `${color}20` : `${color}15`,
                      }}
                    >
                      <Icon
                        size={18}
                        style={{ color: type === id ? color : `${color}cc` }}
                        className="transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <span
                        className="block text-sm font-semibold transition-colors duration-300"
                        style={{ color: type === id ? 'white' : `${color}ee` }}
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
                  {t.form.style}
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
                <div className="w-full section-label mb-2">
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
                      {t.form.variantCount}
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
                  {t.form.generating}
                </>
              ) : (
                <>
                  <Sparkles size={18} className="group-hover:animate-spin" />
                  {t.form.generate}
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
{generationCount} prompt{generationCount > 1 ? 's' : ''} {t.credits.sessionSuffix}
              </span>
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
