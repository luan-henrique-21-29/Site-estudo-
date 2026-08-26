import { useMemo, useState } from 'react'
import { Save, Sparkles, UserRound } from 'lucide-react'
import { countries } from '../data/countries'
import { achievements, studyMetrics } from '../lib/metrics'
import { useAppState } from '../hooks/useAppState'

export function ProfilePage(){
  const {data,updateProfile}=useAppState()
  const [name,setName]=useState(data.displayName)
  const [mainGoal,setMainGoal]=useState(data.preferences.mainGoal)
  const [sessionMinutes,setSessionMinutes]=useState(data.preferences.sessionMinutes)
  const [englishLevel,setEnglishLevel]=useState(data.preferences.englishLevel)
  const [programmingLevel,setProgrammingLevel]=useState(data.preferences.programmingLevel)
  const [financialGoal,setFinancialGoal]=useState(data.preferences.financialGoal)
  const [selectedCountries,setSelectedCountries]=useState<string[]>(data.preferences.countries)
  const [saved,setSaved]=useState(false)
  const metrics=useMemo(()=>studyMetrics(data),[data])
  const badges=useMemo(()=>achievements(data),[data])
  const toggle=(id:string)=>setSelectedCountries(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
  const save=()=>{updateProfile(name,{mainGoal,sessionMinutes,englishLevel,programmingLevel,financialGoal,countries:selectedCountries});setSaved(true);setTimeout(()=>setSaved(false),1800)}
  return <div className="page profile-page">
    <section className="page-header glass-panel"><UserRound className="mega-icon-svg"/><div><span className="eyebrow">Meu perfil</span><h1>{data.displayName || 'Estudante'}</h1><p>Seu ponto de partida, prioridades e evolução. Nada aqui bloqueia conteúdo.</p></div></section>
    <section className="profile-level glass-panel"><div className="profile-avatar">{(data.displayName||'E').slice(0,1).toUpperCase()}</div><div className="profile-level-copy"><span className="eyebrow">Nível {metrics.level}</span><h2>{metrics.xp.toLocaleString('pt-BR')} XP</h2><div className="progress-line"><span style={{width:`${Math.min(100,metrics.nextLevelXp?metrics.xp/metrics.nextLevelXp*100:0)}%`}}/></div><small>{metrics.completedCount} aulas • {metrics.streak} dias de sequência • {data.studyMinutes} minutos registrados</small></div></section>

    <div className="split-grid"><section className="glass-panel content-panel"><h2>Identidade e rotina</h2><label>Nome exibido<input value={name} onChange={e=>setName(e.target.value)} placeholder="Como quer ser chamado"/></label><label>Objetivo principal<select value={mainGoal} onChange={e=>setMainGoal(e.target.value)}>{['Inglês','Programação','Investimentos','Morar fora','Organização','Todos'].map(x=><option key={x}>{x}</option>)}</select></label><label>Tempo preferido<select value={sessionMinutes} onChange={e=>setSessionMinutes(Number(e.target.value))}>{[5,10,20,30,45,60].map(x=><option value={x} key={x}>{x} minutos</option>)}</select></label><label>Nível de inglês<select value={englishLevel} onChange={e=>setEnglishLevel(e.target.value)}>{['Nunca estudei','Básico','Intermediário','Avançado','Não sei'].map(x=><option key={x}>{x}</option>)}</select></label><label>Nível de programação<select value={programmingLevel} onChange={e=>setProgrammingLevel(e.target.value)}>{['Nunca programei','Iniciante','Já sei o básico','Intermediário'].map(x=><option key={x}>{x}</option>)}</select></label><label>Objetivo financeiro<select value={financialGoal} onChange={e=>setFinancialGoal(e.target.value)}>{['Organizar dinheiro','Criar reserva','Aprender investimentos','Juntar dinheiro para morar fora','Aprender renda fixa','Aprender ações e ETFs'].map(x=><option key={x}>{x}</option>)}</select></label><button className="primary-button" onClick={save}><Save size={17}/>{saved?'Salvo!':'Salvar perfil'}</button></section>

    <section className="glass-panel content-panel"><h2>Países que quero acompanhar</h2><p>Esses países podem aparecer primeiro nas sugestões e comparadores.</p><div className="profile-country-list">{countries.map(c=><button type="button" key={c.id} className={selectedCountries.includes(c.id)?'country-choice selected':'country-choice'} onClick={()=>toggle(c.id)}><span>{c.flag}</span><strong>{c.name}</strong></button>)}</div></section></div>

    <section className="glass-panel content-panel"><div className="section-heading"><div><span className="eyebrow"><Sparkles size={15}/> Conquistas</span><h2>Marcos sem virar joguinho</h2></div><strong>{badges.filter(x=>x.unlocked).length}/{badges.length}</strong></div><div className="achievement-grid">{badges.map(a=><article key={a.id} className={a.unlocked?'achievement unlocked':'achievement'}><span>{a.icon}</span><div><strong>{a.title}</strong><small>{a.description}</small></div></article>)}</div></section>
  </div>
}
