
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './components/ThemeProvider'
import { TaskGrid } from './components/TaskGrid'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { SettingsPage } from './components/SettingsPage'
import { AuthProvider, useAuth } from './src/components/AuthProvider'

type AppView = 'landing' | 'auth-signin' | 'auth-signup' | 'app' | 'settings'

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [authError, setAuthError] = useState<string | null>(null)

  // Handle email confirmation callback
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check if this is an email confirmation callback
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')
      
      if (accessToken && type === 'signup') {
        // Email confirmed successfully - the AuthProvider will handle the session
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } else if (hashParams.get('error')) {
        // Handle error
        const errorDescription = hashParams.get('error_description')
        setAuthError(errorDescription || 'Email confirmation failed')
        setCurrentView('auth-signin')
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }

    handleEmailConfirmation()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#4f46e5]" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show appropriate authenticated view
  if (user) {
    if (currentView === 'settings') {
      return (
        <SettingsPage
          onBackToApp={() => setCurrentView('app')}
          onSignOut={async () => {
            await signOut()
            setCurrentView('landing')
          }}
        />
      )
    }
    
    return <TaskGrid onOpenSettings={() => setCurrentView('settings')} />
  }

  // User is not authenticated, show appropriate view
  switch (currentView) {
    case 'landing':
      return (
        <LandingPage
          onGetStarted={() => setCurrentView('auth-signup')}
          onSignIn={() => setCurrentView('auth-signin')}
        />
      )
    
    case 'auth-signin':
      return (
        <AuthPage
          onBackToLanding={() => {
            setAuthError(null)
            setCurrentView('landing')
          }}
          initialMode="signin"
        />
      )
    
    case 'auth-signup':
      return (
        <AuthPage
          onBackToLanding={() => {
            setAuthError(null)
            setCurrentView('landing')
          }}
          initialMode="signup"
        />
      )
    
    default:
      return (
        <LandingPage
          onGetStarted={() => setCurrentView('auth-signup')}
          onSignIn={() => setCurrentView('auth-signin')}
        />
      )
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}