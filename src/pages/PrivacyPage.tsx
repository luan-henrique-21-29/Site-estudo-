import { Download, ShieldCheck, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { exportData } from '../lib/storage'
import { useAuth } from '../hooks/useAuth'

export function PrivacyPage(){
  const { data, resetData } = useAppState()
  const { configured, user } = useAuth()
  return <div className="page"><section className="page-header glass-panel"><ShieldCheck className="mega-icon-svg"/><div><span className="eyebrow">Privacidade</span><h1>Seus dados, sem mistério.</h1><p>O Futuro Lab funciona local-first: estudar não depende de conta nem de conexão.</p></div></section>
    <div className="split-grid"><section className="glass-panel content-panel"><h2>💾 O que fica neste aparelho</h2><p>Progresso, notas, metas, configurações, flashcards, quizzes, cadernos, planejamento financeiro, projetos e a posição onde você parou são salvos no armazenamento do navegador.</p><p>Se você limpar os dados do navegador sem backup e sem sincronização, esses dados locais podem ser perdidos.</p></section><section className="glass-panel content-panel"><h2>☁️ O que vai para a nuvem</h2><p>{configured&&user?'Você está conectado. O mesmo conjunto de dados de estudo pode ser sincronizado na sua linha protegida no Supabase.':'No momento, seus dados continuam apenas neste aparelho até você ativar e entrar em uma conta.'}</p><p>A aplicação não precisa enviar suas anotações para serviços de publicidade ou rastreamento para funcionar.</p></section></div>
    <section className="glass-panel content-panel"><h2>Segurança da conta</h2><ul><li>O frontend usa somente URL pública e anon key do Supabase.</li><li>Row Level Security limita leitura e escrita à linha do próprio usuário.</li><li>A service role não deve existir no frontend.</li><li>A exclusão de usuário é feita por uma função de servidor separada.</li></ul></section>
    <section className="glass-panel content-panel"><h2>Controle dos seus dados</h2><div className="button-row"><button className="secondary-button" onClick={()=>exportData(data)}><Download size={18}/> Baixar meu backup</button><button className="danger-button" onClick={()=>confirm('Apagar todos os dados locais deste navegador? Faça backup se quiser guardar o progresso.')&&resetData()}><Trash2 size={18}/> Apagar dados locais</button><Link className="secondary-button" to="/account">Gerenciar conta</Link></div></section>
  </div>
}
