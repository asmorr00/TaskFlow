'use client'

import React, { useState } from 'react'
import { CheckCircle, Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { supabase } from '../lib/supabase'

interface AuthPageProps {
  onBackToLanding: () => void
  initialMode?: 'signin' | 'signup'
}

export function AuthPage({ onBackToLanding, initialMode = 'signin' }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  // Check for error in URL params (for email confirmation failures)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        // Get the current URL for the redirect
        const currentUrl = window.location.origin
        
        // Sign up with Supabase
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: currentUrl,
            data: {
              full_name: formData.name
            }
          }
        })

        if (error) {
          throw error
        }

        // Show verification message after successful signup
        setShowVerificationMessage(true)
      } else {
        // Sign in with Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          throw error
        }
      }

      // Auth success is handled by the AuthProvider's onAuthStateChange
      // No need to call onAuthSuccess() here as the auth state change will trigger app re-render
    } catch (error: any) {
      console.error('Auth error:', error)
      setError(error.message || 'An error occurred during authentication')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        throw error
      }
      // Note: The page will redirect to Google, so loading state will persist
    } catch (error: any) {
      console.error('Google auth error:', error)
      setError(error.message || 'Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] font-[Inter,system-ui,sans-serif] relative">
      {/* Back Button - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToLanding}
          className="
            inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 
            hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200
            px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                Floatier
              </span>
            </div>
            
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {mode === 'signin' 
                ? 'Sign in to your account to continue' 
                : 'Get started with Floatier today'
              }
            </p>
          </div>

        {/* Verification Message */}
        {showVerificationMessage ? (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-slate-200/60 dark:border-slate-700/50 shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Check your email
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We've sent a confirmation link to <span className="font-medium text-slate-900 dark:text-slate-100">{formData.email}</span>
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please check your inbox and click the verification link to activate your account.
                  The link will expire in 24 hours.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button
                  variant="outline"
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      const { error } = await supabase.auth.resend({
                        type: 'signup',
                        email: formData.email
                      })
                      if (error) throw error
                      // Show success message briefly
                      setError(null)
                    } catch (error: any) {
                      setError('Failed to resend email. Please try again.')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {isLoading ? 'Resending...' : 'Resend verification email'}
                </Button>
                <button
                  onClick={() => {
                    setShowVerificationMessage(false)
                    setMode('signin')
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                  }}
                  className="block w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          </div>
        ) : (
        /* Auth Card */
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-slate-200/60 dark:border-slate-700/50 shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-900 dark:text-slate-100">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900 dark:text-slate-100">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-900 dark:text-slate-100">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-900 dark:text-slate-100">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm py-2.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1E1E1E] text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="
                  relative
                  border-slate-200 dark:border-slate-600 
                  bg-white dark:bg-slate-800/50
                  hover:bg-slate-50 dark:hover:bg-slate-700/50
                  text-slate-700 dark:text-slate-200
                  transition-all duration-200
                "
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </Button>
              {/*<Button
                variant="outline"
                type="button"
                disabled={true}
                className="border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.663-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Apple
              </Button>*/}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
        )}

        {/* Terms */}
        {mode === 'signup' && (
          <p className="mt-6 text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        )}
        </div>
      </div>
    </div>
  )
}
