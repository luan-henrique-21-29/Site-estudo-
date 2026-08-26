import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { cloudConfigured, supabase } from '../lib/supabase'

type AuthResult = { ok: true; message?: string } | { ok: false; message: string }

interface AuthContextValue {
  configured: boolean
  loading: boolean
  user: User | null
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  sendMagicLink: (email: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(cloudConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    configured: cloudConfigured,
    loading,
    user,
    signIn: async (email, password) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      return error ? { ok: false, message: error.message } : { ok: true }
    },
    signUp: async (email, password) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password })
      if (error) return { ok: false, message: error.message }
      if (!data.session) return { ok: true, message: 'Conta criada. Confira seu e-mail para confirmar o cadastro.' }
      return { ok: true, message: 'Conta criada e conectada.' }
    },
    sendMagicLink: async (email) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const redirectTo = `${window.location.origin}${window.location.pathname}`
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo } })
      return error ? { ok: false, message: error.message } : { ok: true, message: 'Link de acesso enviado por e-mail.' }
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut()
    }
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
