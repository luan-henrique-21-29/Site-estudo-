import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Code2, Lightbulb, Play, RotateCcw, XCircle } from 'lucide-react'
import { codeChallenges } from '../data/codeChallenges'

function key(id:string){return `futuro-lab-challenge:${id}`}

export function ProgrammingPracticePage(){
  const [challengeId,setChallengeId]=useState(codeChallenges[0].id)
  const challenge=useMemo(()=>codeChallenges.find(c=>c.id===challengeId)??codeChallenges[0],[challengeId])
  const [code,setCode]=useState(()=>localStorage.getItem(key(codeChallenges[0].id))??codeChallenges[0].starter)
  const [results,setResults]=useState<{label:string;pass:boolean}[]|null>(null)
  const [hint,setHint]=useState(-1)
  const [showSolution,setShowSolution]=useState(false)
  useEffect(()=>{setCode(localStorage.getItem(key(challenge.id))??challenge.starter);setResults(null);setHint(-1);setShowSolution(false)},[challenge.id])
  useEffect(()=>{localStorage.setItem(key(challenge.id),code)},[challenge.id,code])
  const run=()=>setResults(challenge.checks.map(check=>({label:check.label,pass:check.pattern.test(code)})))
  const passed=results?.every(x=>x.pass)??false
  const reset=()=>{setCode(challenge.starter);localStorage.removeItem(key(challenge.id));setResults(null);setHint(-1);setShowSolution(false)}
  return <div className="page practice-page"><section className="page-header glass-panel"><Code2 className="mega-icon-svg"/><div><span className="eyebrow">Exercícios automáticos</span><h1>Laboratório de desafios</h1><p>Escreva a resposta, rode os testes e receba pistas graduais. A verificação é local e não executa código perigoso.</p></div></section><div className="practice-layout"><aside className="practice-list glass-panel">{codeChallenges.map((c,i)=><button key={c.id} className={challenge.id===c.id?'active':''} onClick={()=>setChallengeId(c.id)}><span>{i+1}</span><div><strong>{c.title}</strong><small>{c.language} • {c.level}</small></div></button>)}</aside><section className="practice-editor glass-panel"><div className="practice-head"><div><span className="pill">{challenge.language} • {challenge.level}</span><h2>{challenge.title}</h2><p>{challenge.instruction}</p></div><button className="secondary-button" onClick={reset}><RotateCcw size={16}/> Resetar</button></div><textarea className="challenge-code" spellCheck={false} value={code} onChange={e=>{setCode(e.target.value);setResults(null)}} aria-label={`Resposta do desafio ${challenge.title}`}/><div className="button-row"><button className="primary-button" onClick={run}><Play size={17}/> Rodar testes</button><button className="secondary-button" onClick={()=>setHint(h=>Math.min(challenge.hints.length-1,h+1))}><Lightbulb size={17}/> {hint<0?'Dica':hint<challenge.hints.length-1?'Mais uma dica':'Última dica'}</button><button className="secondary-button" onClick={()=>setShowSolution(v=>!v)}>{showSolution?'Esconder solução':'Ver solução'}</button></div>{hint>=0&&<div className="tip-box"><strong>💡 Dica {hint+1}</strong><p>{challenge.hints[hint]}</p></div>}{results&&<div className={passed?'challenge-results passed':'challenge-results'}><h3>{passed?'✅ Passou!':'Ainda não passou em tudo'}</h3>{results.map(result=><div key={result.label}>{result.pass?<CheckCircle2/>:<XCircle/>}<span>{result.label}</span></div>)}</div>}{showSolution&&<div className="solution-box"><strong>Solução de referência</strong><pre><code>{challenge.solution}</code></pre><small>Compare a ideia, não só copie. Pode existir mais de uma solução correta.</small></div>}</section></div></div>
}
