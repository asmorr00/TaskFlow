import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/auth?error=verification-failed')
          return
        }

        if (session) {
          navigate('/')
        } else {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const errorDescription = hashParams.get('error_description')
          
          if (errorDescription) {
            navigate(`/auth?error=${encodeURIComponent(errorDescription)}`)
          } else {
            navigate('/auth')
          }
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        navigate('/auth?error=unexpected-error')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Verifying your email...</p>
      </div>
    </div>
  )
}