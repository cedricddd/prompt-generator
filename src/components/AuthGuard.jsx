import React, { useState, useEffect } from 'react'
import { checkAppAccess, redirectToSso } from '../lib/auth'

const SAAS_URL = import.meta.env.VITE_SAAS_URL || 'https://saas.ced-it.be'
const APP_SLUG = import.meta.env.VITE_APP_SLUG || 'prompt-generator'

/**
 * AuthGuard — Protège l'application avec vérification d'accès SaaS.
 *
 * - Vérifie le token JWT à chaque chargement
 * - Affiche une bannière trial si l'accès est de type "trial"
 * - Redirige vers le SaaS si non autorisé
 */
export default function AuthGuard({ children }) {
  const [authState, setAuthState] = useState('loading')
  const [accessInfo, setAccessInfo] = useState(null)
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(false)

  useEffect(() => {
    checkAppAccess().then((result) => {
      if (result.status === 'authorized') {
        setAuthState('authorized')
        setAccessInfo(result)
      } else {
        setAuthState('unauthorized')
      }
    })
  }, [])

  if (authState === 'loading') {
    return <LoadingScreen />
  }

  if (authState === 'unauthorized') {
    return <UnauthorizedScreen />
  }

  const showTrialBanner = accessInfo?.accessType === 'trial' && !trialBannerDismissed

  return (
    <>
      {showTrialBanner && (
        <TrialBanner
          expiresAt={accessInfo.trialExpiresAt}
          onDismiss={() => setTrialBannerDismissed(true)}
        />
      )}
      <div style={showTrialBanner ? { paddingTop: '40px' } : undefined}>
        {children}
      </div>
    </>
  )
}

function LoadingScreen() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1628' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '4px solid rgba(0,212,255,0.2)',
          borderTop: '4px solid #00d4ff',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Vérification de l'accès…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function UnauthorizedScreen() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1628', padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '360px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Accès requis</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Connectez-vous ou démarrez votre essai gratuit de 24h pour utiliser le générateur de prompts.
          </p>
        </div>
        <button
          onClick={redirectToSso}
          style={{ width: '100%', padding: '12px 24px', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: 500, fontSize: '14px', cursor: 'pointer', background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)' }}
        >
          Se connecter via Ced-IT
        </button>
        <a href={`${SAAS_URL}/apps/${APP_SLUG}`} style={{ color: '#00d4ff', fontSize: '14px', textDecoration: 'none' }}>
          Voir les offres →
        </a>
      </div>
    </div>
  )
}

function TrialBanner({ expiresAt, onDismiss }) {
  const [hoursLeft, setHoursLeft] = useState(null)

  useEffect(() => {
    if (!expiresAt) return
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      setHoursLeft(diff > 0 ? Math.ceil(diff / (1000 * 60 * 60)) : 0)
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px', fontSize: '13px',
      background: 'linear-gradient(135deg, rgba(0,212,255,0.13) 0%, rgba(0,102,255,0.13) 100%)',
      borderBottom: '1px solid rgba(0,212,255,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <span>
          Essai gratuit —{' '}
          <span style={{ color: '#fff', fontWeight: 500 }}>
            {hoursLeft !== null ? `${hoursLeft}h restante${hoursLeft > 1 ? 's' : ''}` : '…'}
          </span>
        </span>
        <a href={`${SAAS_URL}/apps/${APP_SLUG}`} style={{ color: '#00d4ff', textDecoration: 'none', marginLeft: '8px' }}>
          Passer à l'abonnement →
        </a>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }} aria-label="Fermer">✕</button>
    </div>
  )
}
