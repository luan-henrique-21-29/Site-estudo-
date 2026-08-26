import { Link } from 'react-router-dom'

const groups = [
  { title:'📚 Estudos', items:[['🧠','Revisar','/review'],['🃏','Flashcards','/flashcards'],['✅','Quizzes','/quizzes'],['🇬🇧','Laboratório de inglês','/english-lab'],['📓','Caderno','/notebook']] },
  { title:'🌍 Futuro', items:[['🌎','Países','/countries'],['🏙️','Cidades','/cities'],['💸','Salários','/salaries'],['💼','Carreiras','/careers'],['🎯','Metas','/future'],['💰','Planejamento financeiro','/finance']] },
  { title:'🛠️ Ferramentas', items:[['🧮','Calculadoras','/tools'],['💻','Playground','/playground'],['🗺️','Comparar países','/compare-countries'],['🏙️','Comparar cidades','/compare-cities'],['🧭','Roadmap de programação','/programming-roadmap'],['🧰','Portfólio','/portfolio']] },
  { title:'👤 Conta e organização', items:[['📊','Progresso','/progress'],['⭐','Favoritos','/favorites'],['🔎','Buscar','/search'],['👤','Conta e sincronização','/account'],['🎨','Personalização','/settings'],['🛡️','Privacidade','/privacy']] }
] as const

export function MorePage(){
  return <div className="page"><section className="page-header glass-panel"><div className="mega-icon">☰</div><div><span className="eyebrow">Tudo organizado</span><h1>Mais</h1><p>As ferramentas continuam aqui, mas sem lotar a tela principal.</p></div></section><div className="more-hub-grid">{groups.map(group=><section className="glass-panel content-panel" key={group.title}><h2>{group.title}</h2><div className="more-link-grid">{group.items.map(([icon,label,path])=><Link key={path} to={path}><span>{icon}</span><strong>{label}</strong><small>Abrir →</small></Link>)}</div></section>)}</div></div>
}
