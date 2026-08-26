import { useState } from 'react'
import { Cloud, CloudOff, LogIn, LogOut, RefreshCw, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAppState } from '../hooks/useAppState'

function formatDate(iso?: string) {
  if (!iso) return 'Ainda não sincronizado'
  return new Date(iso).toLocaleString('pt-BR')
}

export function AccountPage() {
  const { configured, loading, user, signIn, signUp, sendMagicLink, signOut } = useAuth()
  const { syncStatus, lastSyncAt, syncNow, data } = useAppState()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!email.trim() || password.length < 6) {
      setMessage('Digite um e-mail válido e uma senha com pelo menos 6 caracteres.')
      return
    }
    setBusy(true)
    const result = mode === 'login' ? await signIn(email, password) : await signUp(email, password)
    setBusy(false)
    setMessage(result.message ?? (result.ok ? 'Tudo certo.' : 'Não foi possível entrar.'))
  }

  const magic = async () => {
    if (!email.trim()) return setMessage('Digite seu e-mail primeiro.')
    setBusy(true)
    const result = await sendMagicLink(email)
    setBusy(false)
    setMessage(result.message ?? '')
  }

  if (loading) return <div className="page"><div className="empty glass-panel">Carregando sua conta…</div></div>

  return <div className="page account-page">
    <section className="page-header glass-panel">
      <div className="mega-icon">👤</div>
      <div><span className="eyebrow">Conta e sincronização</span><h1>Continue exatamente de onde parou.</h1><p>Sem conta, tudo continua salvo neste navegador. Com conta, progresso, anotações, preferências e última página podem acompanhar você em outros dispositivos.</p></div>
    </section>

    {!configured && <section className="glass-panel content-panel account-warning">
      <CloudOff size={30}/><div><h2>Login pronto, mas a nuvem ainda precisa ser ativada no deploy.</h2><p>O código de login e sincronização já está preparado. Para funcionar entre dispositivos, configure as duas variáveis do Supabase descritas no README e execute o arquivo <code>supabase/schema.sql</code>.</p><p>Até lá, o modo local continua funcionando normalmente.</p></div>
    </section>}

    {configured && !user && <section className="glass-panel account-card">
      <div className="segmented"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Entrar</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Criar conta</button></div>
      <h2>{mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}</h2>
      <p>Use a mesma conta no celular, computador ou outro dispositivo para carregar seus dados.</p>
      <label>E-mail<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></label>
      <label>Senha<input type="password" autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="mínimo 6 caracteres"/></label>
      <button className="primary-button wide" disabled={busy} onClick={submit}>{mode==='login'?<LogIn size={18}/>:<UserPlus size={18}/>} {busy?'Aguarde…':mode==='login'?'Entrar':'Criar conta'}</button>
      <button className="secondary-button wide" disabled={busy} onClick={magic}>Receber link de acesso por e-mail</button>
      {message && <p className="account-message">{message}</p>}
    </section>}

    {configured && user && <div className="account-grid">
      <section className="glass-panel content-panel">
        <span className="eyebrow">Conectado</span><h2>{user.email}</h2><p>Se entrar com este mesmo e-mail em outro dispositivo, o Futuro Lab baixa os dados mais recentes e continua sincronizando.</p>
        <div className="sync-status"><Cloud size={20}/><div><strong>{syncStatus==='synced'?'Tudo salvo na nuvem':syncStatus==='pending'?'Salvando alterações…':syncStatus==='connecting'?'Sincronizando…':syncStatus==='error'?'Erro ao sincronizar':'Salvo localmente'}</strong><small>Última sincronização: {formatDate(lastSyncAt)}</small></div></div>
        <div className="button-row"><button className="primary-button" onClick={()=>void syncNow()}><RefreshCw size={18}/> Sincronizar agora</button><button className="secondary-button" onClick={()=>void signOut()}><LogOut size={18}/> Sair</button></div>
      </section>
      <section className="glass-panel content-panel">
        <span className="eyebrow">Retomar</span><h2>Onde você parou</h2><p><strong>Última página:</strong> <code>{data.lastVisitedPath || '/'}</code></p><p><strong>Última aula:</strong> {data.lastLessonId ?? 'Ainda nenhuma aula aberta'}</p><a className="primary-button" href={`#${data.lastVisitedPath || '/'}`}>Continuar de onde parei</a>
      </section>
    </div>}

    <section className="glass-panel content-panel account-privacy">
      <h2>Como o salvamento funciona</h2>
      <ol><li>Alterações são salvas imediatamente no navegador.</li><li>Quando há login, as mudanças são enviadas para a conta após alguns instantes.</li><li>Ao abrir em outro dispositivo, o site compara as versões e carrega a mais recente.</li><li>Quando a internet volta ou a aba recebe foco, a sincronização é conferida novamente.</li></ol>
    </section>
  </div>
}
