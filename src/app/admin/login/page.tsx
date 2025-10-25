'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  // Check if user is already authenticated and redirect if so
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // Get the current session instead of just the user
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session check error:', error)
          setCheckingAuth(false)
          return
        }
        
        // Only redirect if we have a valid session
        if (session && session.user) {
          router.push('/admin/dashboard')
          return
        }
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              router.push('/admin/dashboard')
            }
          }
        )
        
        // Cleanup subscription on unmount
        return () => {
          subscription?.unsubscribe()
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#360e1d' }}>
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Force a full page reload to ensure auth state is properly updated
        window.location.href = '/admin/dashboard'
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#360e1d' }}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <motion.h1 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6"
            >
              Admin Access
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-lg sm:text-xl text-white/90 leading-relaxed"
            >
              Sign in to access the FYCI admin dashboard and manage your content.
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="max-w-md w-full"
          >
            <motion.form
              variants={itemVariants}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              {/* Email Field */}
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 pl-12 bg-transparent border-b-2 border-white text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors duration-200 text-base"
                    style={{ borderBottomColor: 'white' }}
                  />
                  <div className="absolute left-0 top-3">
                    <Mail size={16} className="text-white/60" />
                  </div>
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pl-12 bg-transparent border-b-2 border-white text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors duration-200 text-base"
                    style={{ borderBottomColor: 'white' }}
                  />
                  <div className="absolute left-0 top-3">
                    <Lock size={16} className="text-white/60" />
                  </div>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-300 text-sm text-center bg-red-500/20 px-4 py-3 rounded-lg border border-red-400/30"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#360e1d' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  <LogIn size={16} />
                </button>
              </motion.div>
            </motion.form>

            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-white/70 text-sm mt-6 leading-relaxed text-center"
            >
              By signing in, you agree to access the FYCI admin dashboard securely.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
