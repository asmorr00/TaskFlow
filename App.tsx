
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './components/ThemeProvider'
import { TaskGrid } from './components/TaskGrid'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { SettingsPage } from './components/SettingsPage'
import { FloatierSidebar } from './components/FloatierSidebar'
import { AuthProvider, useAuth } from './src/components/AuthProvider'

type AppView = 'landing' | 'auth-signin' | 'auth-signup' | 'app' | 'settings'
type AppSection = 'dashboard' | 'tasks' | 'timeline' | 'projects' | 'team' | 'analytics'

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [currentSection, setCurrentSection] = useState<AppSection>('tasks')

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
        // Handle error - AuthPage will display it
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
    
    // Show app with sidebar
    return (
      <FloatierSidebar
        currentSection={currentSection}
        onSectionChange={(section) => {
          setCurrentSection(section as AppSection)
          setCurrentView('app')
        }}
        onOpenSettings={() => setCurrentView('settings')}
        onSignOut={async () => {
          await signOut()
          setCurrentView('landing')
        }}
        defaultOpen={true}
      >
        {currentSection === 'tasks' && <TaskGrid />}
        {currentSection === 'dashboard' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
          </div>
        )}
        {currentSection === 'timeline' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
            <p className="text-gray-600 mt-2">View your project timeline</p>
          </div>
        )}
        {currentSection === 'projects' && (
          <div className="p-6">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Projects</h1>
          </div>
        )}
        {currentSection === 'team' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-600 mt-2">Collaborate with your team</p>
          </div>
        )}
        {currentSection === 'analytics' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">View project analytics</p>
          </div>
        )}
      </FloatierSidebar>
    )
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