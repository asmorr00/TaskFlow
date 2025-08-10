
import { useState } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { TaskGrid } from './components/TaskGrid'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'

type AppView = 'landing' | 'auth' | 'app'

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleGetStarted = () => {
    setAuthMode('signup')
    setCurrentView('auth')
  }

  const handleSignIn = () => {
    setAuthMode('signin')
    setCurrentView('auth')
  }

  const handleAuthSuccess = () => {
    setCurrentView('app')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={handleGetStarted}
            onSignIn={handleSignIn}
          />
        )
      case 'auth':
        return (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onBackToLanding={handleBackToLanding}
            initialMode={authMode}
          />
        )
      case 'app':
        return <TaskGrid />
      default:
        return (
          <LandingPage 
            onGetStarted={handleGetStarted}
            onSignIn={handleSignIn}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {renderCurrentView()}
      </ThemeProvider>
    </ErrorBoundary>
  )
}