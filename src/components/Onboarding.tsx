import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAppState } from '../hooks/useAppState'

export function Onboarding() {
  const { data, setOnboarding } = useAppState()
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('Todos')
  const [minutes, setMinutes] = useState('20')
  if (data.onboardingDone) return null
  return <div className="onboarding-backdrop">
    <section className="onboarding-card glass-panel">
      <div className="eyebrow"><Sparkles size={16}/> Bem-vindo ao Futuro Lab</div>
      <h1>Monte seu espaço de estudo.</h1>
      <p>Escolha só o básico agora. Tudo pode ser mudado depois.</p>
      <label>Como quer ser chamado?<input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" /></label>
      <div className="field-group"><span>Objetivo principal</span><div className="chip-row">{['Inglês','Programação','Investimentos','Morar fora','Todos'].map(x=><button key={x} onClick={()=>setGoal(x)} className={goal===x?'chip selected':'chip'}>{x}</button>)}</div></div>
      <div className="field-group"><span>Tempo preferido por sessão</span><div className="chip-row">{['5','10','20','30','45','60'].map(x=><button key={x} onClick={()=>setMinutes(x)} className={minutes===x?'chip selected':'chip'}>{x} min</button>)}</div></div>
      <button className="primary-button wide" onClick={()=>setOnboarding(name || 'Estudante')}>Começar <ArrowRight size={18}/></button>
      <small>Preferências iniciais: {goal} • {minutes} min. O site salva tudo no seu navegador.</small>
    </section>
  </div>
}
