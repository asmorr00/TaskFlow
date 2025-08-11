
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './components/ThemeProvider'
import { TaskGrid } from './components/TaskGrid'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { AuthProvider, useAuth } from './src/components/AuthProvider'

type AppView = 'landing' | 'auth-signin' | 'auth-signup' | 'app'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>('landing')

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

  // If user is authenticated, show main app
  if (user) {
    return <TaskGrid />
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
          onBackToLanding={() => setCurrentView('landing')}
          initialMode="signin"
        />
      )
    
    case 'auth-signup':
      return (
        <AuthPage
          onBackToLanding={() => setCurrentView('landing')}
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