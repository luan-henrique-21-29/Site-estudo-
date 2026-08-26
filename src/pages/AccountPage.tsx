import { useState } from 'react'
import { Cloud, CloudOff, Github, KeyRound, LogIn, LogOut, Mail, RefreshCw, ShieldCheck, Trash2, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppState } from '../hooks/useAppState'

function formatDate(iso?: string) {
  if (!iso) return 'Ainda não sincronizado'
  return new Date(iso).toLocaleString('pt-BR')
}

export function AccountPage() {
  const { configured, loading, user, recoveryMode, signIn, signUp, sendMagicLink, sendPasswordReset, signInWithProvider, updatePassword, updateEmail, deleteAccount, signOut } = useAuth()
  const { syncStatus, lastSyncAt, syncNow, data, migrationNeeded, migrationRemoteExists, resolveMigration } = useAppState()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const run = async (fn: () => Promise<{ ok: boolean; message?: string }>) => {
    setBusy(true)
    const result = await fn()
    setBusy(false)
    setMessage(result.message ?? (result.ok ? 'Tudo certo.' : 'Não foi possível concluir.'))
  }

  const submit = async () => {
    if (!email.trim() || password.length < 6) return setMessage('Digite um e-mail válido e uma senha com pelo menos 6 caracteres.')
    await run(() => mode === 'login' ? signIn(email, password) : signUp(email, password))
  }

  const statusText = syncStatus === 'synced' ? '☁️ Sincronizado' : syncStatus === 'pending' ? '⏳ Salvando…' : syncStatus === 'connecting' ? '⏳ Sincronizando…' : syncStatus === 'offline' ? '📴 Offline — salvo neste aparelho' : syncStatus === 'paused' ? '⏸️ Sincronização pausada' : syncStatus === 'migration' ? '☁️ Aguardando sua escolha' : syncStatus === 'error' ? '⚠️ Falha ao sincronizar' : '💾 Salvo localmente'

  if (loading) return <div className="page"><div className="empty glass-panel">Carregando sua conta…</div></div>

  return <div className="page account-page">
    <section className="page-header glass-panel">
      <div className="mega-icon">👤</div>
      <div><span className="eyebrow">Conta e sincronização</span><h1>Seu estudo acompanha você.</h1><p>Sem conta, tudo continua salvo no aparelho. Com conta, seu progresso pode ser restaurado no celular, computador, tablet ou notebook.</p></div>
    </section>

    {!configured && <section className="glass-panel content-panel account-warning">
      <CloudOff size={30}/><div><h2>A nuvem ainda precisa das chaves públicas do Supabase.</h2><p>O site continua totalmente utilizável no modo local. Para ativar login entre dispositivos, configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>, rode <code>supabase/schema.sql</code> e publique a função opcional de exclusão de conta.</p></div>
    </section>}

    {configured && !user && <section className="glass-panel account-card">
      <div className="segmented"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Entrar</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Criar conta</button></div>
      <h2>{mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}</h2>
      <p>Use a mesma conta em outro dispositivo para recuperar o que você estudou.</p>
      <label>E-mail<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></label>
      <label>Senha<input type="password" autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="mínimo 6 caracteres"/></label>
      <button className="primary-button wide" disabled={busy} onClick={submit}>{mode==='login'?<LogIn size={18}/>:<UserPlus size={18}/>} {busy?'Aguarde…':mode==='login'?'Entrar':'Criar conta'}</button>
      <div className="account-social-grid"><button className="secondary-button" disabled={busy} onClick={()=>void run(()=>signInWithProvider('google'))}><Mail size={18}/> Google</button><button className="secondary-button" disabled={busy} onClick={()=>void run(()=>signInWithProvider('github'))}><Github size={18}/> GitHub</button></div>
      <button className="secondary-button wide" disabled={busy} onClick={()=>email.trim()?void run(()=>sendMagicLink(email)):setMessage('Digite seu e-mail primeiro.')}>Receber link mágico por e-mail</button>
      {mode==='login'&&<button className="text-button wide" disabled={busy} onClick={()=>email.trim()?void run(()=>sendPasswordReset(email)):setMessage('Digite seu e-mail primeiro.')}>Esqueci minha senha</button>}
      {message && <p className="account-message" role="status">{message}</p>}
    </section>}

    {configured && user && <>
      {migrationNeeded && <section className="glass-panel content-panel migration-card">
        <span className="eyebrow">Primeira sincronização</span><h2>Encontramos progresso neste dispositivo.</h2><p>Escolha o que fazer antes de enviar qualquer coisa. Nada será apagado automaticamente.</p>
        <div className="button-row"><button className="primary-button" onClick={()=>void resolveMigration('sync')}>☁️ Sincronizar meu progresso</button>{migrationRemoteExists&&<button className="secondary-button" onClick={()=>void resolveMigration('cloud')}>Usar dados da nuvem</button>}<button className="secondary-button" onClick={()=>void resolveMigration('separate')}>Manter separado</button></div>
      </section>}

      {recoveryMode && <section className="glass-panel content-panel"><span className="eyebrow">Recuperação de senha</span><h2>Crie sua nova senha</h2><label>Nova senha<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="mínimo 8 caracteres"/></label><button className="primary-button" disabled={busy} onClick={()=>void run(()=>updatePassword(newPassword))}><KeyRound size={18}/> Atualizar senha</button></section>}

      <div className="account-grid">
        <section className="glass-panel content-panel">
          <span className="eyebrow">Conectado</span><h2>{user.email}</h2><p>O progresso local continua sendo salvo mesmo se a internet cair.</p>
          <div className="sync-status"><Cloud size={20}/><div><strong>{statusText}</strong><small>Última sincronização: {formatDate(lastSyncAt)}</small></div></div>
          <div className="button-row"><button className="primary-button" onClick={()=>void syncNow()}><RefreshCw size={18}/> Sincronizar agora</button><button className="secondary-button" onClick={()=>void signOut()}><LogOut size={18}/> Sair</button></div>
        </section>
        <section className="glass-panel content-panel">
          <span className="eyebrow">Retomar</span><h2>Onde você parou</h2><p><strong>Última página:</strong> <code>{data.resumePoint.path || '/'}</code></p><p><strong>Última aula:</strong> {data.resumePoint.lessonId ?? data.lastLessonId ?? 'Ainda nenhuma aula aberta'}</p><p><strong>Posição:</strong> {Math.round(data.resumePoint.scrollY)} px {data.resumePoint.sectionId ? `• ${data.resumePoint.sectionId}` : ''}</p><a className="primary-button" href={`#${data.resumePoint.path || '/'}`}>Continuar de onde parei</a>
        </section>
      </div>

      <section className="glass-panel content-panel security-panel">
        <div className="section-heading"><div><span className="eyebrow">Segurança</span><h2>E-mail, senha e conta</h2></div><ShieldCheck/></div>
        <div className="split-grid"><div><label>Novo e-mail<input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="novo@email.com"/></label><button className="secondary-button" disabled={busy||!newEmail.trim()} onClick={()=>void run(()=>updateEmail(newEmail))}>Trocar e-mail</button></div><div><label>Nova senha<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="mínimo 8 caracteres"/></label><button className="secondary-button" disabled={busy||newPassword.length<8} onClick={()=>void run(()=>updatePassword(newPassword))}>Trocar senha</button></div></div>
        <hr/><h3>Excluir conta</h3><p>Isso remove a conta do Supabase. Exige a Edge Function <code>delete-account</code> publicada; a chave administrativa fica somente no servidor.</p><button className="danger-button" onClick={()=>confirm('Excluir sua conta da nuvem? Faça um backup antes. Essa ação é permanente.')&&void run(deleteAccount)}><Trash2 size={18}/> Excluir conta</button>
      </section>
    </>}

    <section className="glass-panel content-panel account-privacy">
      <h2>Como o salvamento funciona</h2>
      <ol><li>Alterações são salvas primeiro neste aparelho.</li><li>Com login, a nuvem recebe as mudanças depois de alguns instantes.</li><li>Ao entrar em outro aparelho, os dados são mesclados por item para evitar perder progresso diferente feito em dois lugares.</li><li>Se ficar offline, você continua estudando e a sincronização tenta novamente quando a conexão voltar.</li></ol>
      <Link className="text-link" to="/privacy">Ver detalhes de privacidade e dados →</Link>
    </section>
  </div>
}
