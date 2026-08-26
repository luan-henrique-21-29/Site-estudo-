import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Provider, User } from '@supabase/supabase-js'
import { cloudConfigured, supabase } from '../lib/supabase'

type AuthResult = { ok: true; message?: string } | { ok: false; message: string }

interface AuthContextValue {
  configured: boolean
  loading: boolean
  user: User | null
  recoveryMode: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  sendMagicLink: (email: string) => Promise<AuthResult>
  sendPasswordReset: (email: string) => Promise<AuthResult>
  signInWithProvider: (provider: 'google' | 'github') => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  updateEmail: (email: string) => Promise<AuthResult>
  deleteAccount: () => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const redirectUrl = () => `${window.location.origin}${window.location.pathname}`

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(cloudConfigured)
  const [recoveryMode, setRecoveryMode] = useState(false)

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
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true)
      if (event === 'SIGNED_OUT') setRecoveryMode(false)
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
    recoveryMode,
    signIn: async (email, password) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      return error ? { ok: false, message: error.message } : { ok: true, message: 'Conta conectada.' }
    },
    signUp: async (email, password) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirectUrl() } })
      if (error) return { ok: false, message: error.message }
      if (!data.session) return { ok: true, message: 'Conta criada. Confira seu e-mail para confirmar o cadastro.' }
      return { ok: true, message: 'Conta criada e conectada.' }
    },
    sendMagicLink: async (email) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectUrl() } })
      return error ? { ok: false, message: error.message } : { ok: true, message: 'Link de acesso enviado por e-mail.' }
    },
    sendPasswordReset: async (email) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectUrl() })
      return error ? { ok: false, message: error.message } : { ok: true, message: 'Enviamos um link para redefinir sua senha.' }
    },
    signInWithProvider: async (provider) => {
      if (!supabase) return { ok: false, message: 'Sincronização em nuvem ainda não foi configurada neste deploy.' }
      const { error } = await supabase.auth.signInWithOAuth({ provider: provider as Provider, options: { redirectTo: redirectUrl() } })
      return error ? { ok: false, message: error.message } : { ok: true, message: `Abrindo login com ${provider === 'google' ? 'Google' : 'GitHub'}…` }
    },
    updatePassword: async (password) => {
      if (!supabase) return { ok: false, message: 'Nuvem não configurada.' }
      if (password.length < 8) return { ok: false, message: 'Use uma senha com pelo menos 8 caracteres.' }
      const { error } = await supabase.auth.updateUser({ password })
      if (!error) setRecoveryMode(false)
      return error ? { ok: false, message: error.message } : { ok: true, message: 'Senha atualizada.' }
    },
    updateEmail: async (email) => {
      if (!supabase) return { ok: false, message: 'Nuvem não configurada.' }
      const { error } = await supabase.auth.updateUser({ email: email.trim() })
      return error ? { ok: false, message: error.message } : { ok: true, message: 'Pedido de troca de e-mail enviado. Confirme pelo e-mail quando solicitado.' }
    },
    deleteAccount: async () => {
      if (!supabase) return { ok: false, message: 'Nuvem não configurada.' }
      const { error } = await supabase.functions.invoke('delete-account', { body: { confirm: true } })
      if (error) return { ok: false, message: 'Não foi possível excluir a conta. Verifique se a função delete-account foi publicada no Supabase.' }
      await supabase.auth.signOut()
      return { ok: true, message: 'Conta excluída.' }
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut()
    }
  }), [loading, recoveryMode, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
