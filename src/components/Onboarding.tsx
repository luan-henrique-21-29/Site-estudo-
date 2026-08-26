import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { countries } from '../data/countries'
import { useAppState } from '../hooks/useAppState'

const goals = ['Inglês', 'Programação', 'Investimentos', 'Morar fora', 'Organização', 'Todos']
const englishLevels = ['Nunca estudei', 'Básico', 'Intermediário', 'Avançado', 'Não sei']
const programmingLevels = ['Nunca programei', 'Iniciante', 'Já sei o básico', 'Intermediário']
const financialGoals = ['Organizar dinheiro', 'Criar reserva', 'Aprender investimentos', 'Juntar dinheiro para morar fora', 'Aprender renda fixa', 'Aprender ações e ETFs']

export function Onboarding() {
  const { data, completeOnboarding } = useAppState()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('Todos')
  const [minutes, setMinutes] = useState(20)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [countryQuery, setCountryQuery] = useState('')
  const [englishLevel, setEnglishLevel] = useState('Não sei')
  const [programmingLevel, setProgrammingLevel] = useState('Nunca programei')
  const [financialGoal, setFinancialGoal] = useState('Aprender investimentos')
  const visibleCountries = useMemo(() => countries.filter(c => c.name.toLowerCase().includes(countryQuery.toLowerCase())).slice(0, 20), [countryQuery])
  if (data.onboardingDone) return null

  const toggleCountry = (id: string) => setSelectedCountries(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])
  const finish = () => completeOnboarding(name || 'Estudante', {
    mainGoal: goal,
    sessionMinutes: minutes,
    countries: selectedCountries,
    englishLevel,
    programmingLevel,
    financialGoal
  })

  return <div className="onboarding-backdrop">
    <section className="onboarding-card glass-panel onboarding-wizard" aria-label="Configuração inicial">
      <div className="onboarding-progress" aria-label={`Etapa ${step + 1} de 4`}><span style={{ width: `${(step + 1) * 25}%` }} /></div>
      <div className="eyebrow"><Sparkles size={16}/> Bem-vindo ao Futuro Lab • {step + 1}/4</div>

      {step === 0 && <div className="wizard-step">
        <h1>Monte seu espaço de estudo.</h1>
        <p>Escolha o básico agora. Tudo pode ser alterado depois no seu perfil.</p>
        <label>Como quer ser chamado?<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" /></label>
        <div className="field-group"><span>Objetivo principal</span><div className="chip-row">{goals.map(x => <button type="button" key={x} onClick={() => setGoal(x)} className={goal === x ? 'chip selected' : 'chip'}>{x}</button>)}</div></div>
        <div className="field-group"><span>Tempo preferido por sessão</span><div className="chip-row">{[5, 10, 20, 30, 45, 60].map(x => <button type="button" key={x} onClick={() => setMinutes(x)} className={minutes === x ? 'chip selected' : 'chip'}>{x} min</button>)}</div></div>
      </div>}

      {step === 1 && <div className="wizard-step">
        <h1>Quais países chamam sua atenção?</h1>
        <p>Escolha quantos quiser. Isso ajuda o dashboard e a área de países a priorizarem o que interessa.</p>
        <input value={countryQuery} onChange={e => setCountryQuery(e.target.value)} placeholder="Buscar país..." aria-label="Buscar país no onboarding" />
        <div className="onboarding-country-grid">{visibleCountries.map(c => <button type="button" key={c.id} className={selectedCountries.includes(c.id) ? 'country-choice selected' : 'country-choice'} onClick={() => toggleCountry(c.id)}><span>{c.flag}</span><strong>{c.name}</strong></button>)}</div>
        <small>{selectedCountries.length} país(es) selecionado(s).</small>
      </div>}

      {step === 2 && <div className="wizard-step">
        <h1>Qual é seu ponto de partida?</h1>
        <div className="field-group"><span>Nível de inglês</span><div className="chip-row">{englishLevels.map(x => <button type="button" key={x} onClick={() => setEnglishLevel(x)} className={englishLevel === x ? 'chip selected' : 'chip'}>{x}</button>)}</div></div>
        <div className="field-group"><span>Nível de programação</span><div className="chip-row">{programmingLevels.map(x => <button type="button" key={x} onClick={() => setProgrammingLevel(x)} className={programmingLevel === x ? 'chip selected' : 'chip'}>{x}</button>)}</div></div>
      </div>}

      {step === 3 && <div className="wizard-step">
        <h1>E com dinheiro, qual é a prioridade?</h1>
        <div className="onboarding-option-list">{financialGoals.map(x => <button type="button" key={x} className={financialGoal === x ? 'selected' : ''} onClick={() => setFinancialGoal(x)}><span>{financialGoal === x ? '●' : '○'}</span>{x}</button>)}</div>
        <div className="onboarding-summary"><strong>Seu começo</strong><span>{goal} • {minutes} min por sessão</span><span>Inglês: {englishLevel} • Programação: {programmingLevel}</span><span>{selectedCountries.length ? `${selectedCountries.length} país(es) priorizado(s)` : 'Você pode escolher países depois'}</span></div>
      </div>}

      <div className="wizard-actions">
        {step > 0 ? <button className="secondary-button" type="button" onClick={() => setStep(v => v - 1)}><ArrowLeft size={18}/> Voltar</button> : <span />}
        {step < 3 ? <button className="primary-button" type="button" onClick={() => setStep(v => v + 1)}>Continuar <ArrowRight size={18}/></button> : <button className="primary-button" type="button" onClick={finish}>Entrar no Futuro Lab <ArrowRight size={18}/></button>}
      </div>
      <small>Local-first: essas preferências ficam no seu navegador e podem ser exportadas no backup.</small>
    </section>
  </div>
}
