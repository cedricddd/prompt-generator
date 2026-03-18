import { useState, useRef, useEffect } from 'react'
import { Check, Globe2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const languages = [
  { code: 'fr', label: 'Français',   flag: '🇫🇷', nativeName: 'FR' },
  { code: 'en', label: 'English',    flag: '🇬🇧', nativeName: 'EN' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', nativeName: 'NL' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪', nativeName: 'DE' },
  { code: 'es', label: 'Español',    flag: '🇪🇸', nativeName: 'ES' },
  { code: 'hi', label: 'हिन्दी',      flag: '🇮🇳', nativeName: 'HI' },
]

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = languages.find(l => l.code === locale) ?? languages[0]

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bouton trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Changer de langue"
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer"
        style={{
          border: open
            ? '1px solid rgba(0,212,255,0.5)'
            : '1px solid rgba(255,255,255,0.06)',
          background: open
            ? 'rgba(0,212,255,0.1)'
            : 'rgba(255,255,255,0.04)',
          color: open ? 'var(--accent)' : 'var(--text-muted)',
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
            e.currentTarget.style.background = 'rgba(0,212,255,0.05)'
            e.currentTarget.style.color = 'var(--accent)'
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = 'var(--text-muted)'
          }
        }}
      >
        {/* Globe violet — identique au SaaS */}
        <Globe2
          size={16}
          style={{
            color: '#a78bfa',
            filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.9))',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{current.flag}</span>
        <span
          className="hidden sm:inline font-bold tracking-wider"
          style={{ fontSize: '0.65rem' }}
        >
          {current.nativeName}
        </span>
        {/* Chevron */}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            opacity: 0.6,
          }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '208px',
            borderRadius: '16px',
            border: '1px solid rgba(0,212,255,0.12)',
            background: 'var(--secondary)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            zIndex: 100,
            animation: 'fadeInDown 0.15s ease',
          }}
        >
          {/* Header */}
          <div style={{ padding: '8px 16px 6px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
            <p style={{
              fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--text-muted)', margin: 0,
            }}>
              {t.langSwitcher.label}
            </p>
          </div>

          {/* Liste des langues */}
          <div style={{ padding: '4px 0' }}>
            {languages.map(lang => {
              const isActive = locale === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => { setLocale(lang.code); setOpen(false) }}
                  className="w-full flex items-center gap-3 text-sm transition-colors duration-150 cursor-pointer"
                  style={{
                    padding: '10px 16px',
                    background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    border: 'none',
                    textAlign: 'left',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1, flexShrink: 0, width: '28px', textAlign: 'center' }}>
                    {lang.flag}
                  </span>
                  <span style={{ flex: 1 }}>{lang.label}</span>
                  {isActive && <Check size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} strokeWidth={2.5} />}
                </button>
              )
            })}
          </div>

          {/* Ligne accent bas */}
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.2), transparent)' }} />
        </div>
      )}
    </div>
  )
}
