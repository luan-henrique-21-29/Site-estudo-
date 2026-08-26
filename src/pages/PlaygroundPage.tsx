import { useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw, Save, Sparkles } from 'lucide-react'

const STORAGE_KEY = 'futuro-lab-playground-v1'

const starter = {
  html: `<main class="card">
  <p class="eyebrow">Meu primeiro projeto</p>
  <h1>Olá, mundo! 👋</h1>
  <p id="message">Edite o código e aperte Executar.</p>
  <button id="action">Clique aqui</button>
</main>`,
  css: `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #0b1020;
  color: #f6f7fb;
}
.card {
  width: min(560px, 90%);
  padding: 32px;
  border-radius: 24px;
  background: #151d33;
  box-shadow: 0 24px 70px #0007;
}
.eyebrow { color: #6aa8ff; font-weight: 800; }
button {
  border: 0;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #6d5dfc, #6aa8ff);
  cursor: pointer;
}`,
  js: `const button = document.querySelector('#action');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = 'Funcionou! Você executou JavaScript 🎉';
});`
}

type CodeState = typeof starter

function readSaved(): CodeState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as Partial<CodeState>
    return { html: parsed.html ?? starter.html, css: parsed.css ?? starter.css, js: parsed.js ?? starter.js }
  } catch {
    return starter
  }
}

function makeDocument(code: CodeState) {
  const safeCss = code.css.replace(/<\/style/gi, '<\\/style')
  const safeJs = code.js.replace(/<\/script/gi, '<\\/script')
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${safeCss}</style></head><body>${code.html}<script>window.addEventListener('error',e=>{document.body.insertAdjacentHTML('beforeend','<pre style="white-space:pre-wrap;padding:12px;color:#ff8a8a">Erro: '+String(e.message).replace(/[<>&]/g,'')+'</pre>')});${safeJs}<\/script></body></html>`
}

export function PlaygroundPage(){
  const initial = useMemo(readSaved, [])
  const [html,setHtml]=useState(initial.html)
  const [css,setCss]=useState(initial.css)
  const [js,setJs]=useState(initial.js)
  const [srcDoc,setSrcDoc]=useState(()=>makeDocument(initial))
  const [saved,setSaved]=useState(false)

  const run=()=>setSrcDoc(makeDocument({html,css,js}))
  const reset=()=>{setHtml(starter.html);setCss(starter.css);setJs(starter.js);setSrcDoc(makeDocument(starter));localStorage.removeItem(STORAGE_KEY);setSaved(false)}
  const save=()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify({html,css,js}));setSaved(true)}

  useEffect(()=>{setSaved(false)},[html,css,js])

  return <div className="page playground-page">
    <section className="page-header glass-panel"><div className="mega-icon">🧑‍💻</div><div><span className="eyebrow">Programação na prática</span><h1>Playground de código</h1><p>Escreva HTML, CSS e JavaScript e veja o resultado no próprio site. Seu rascunho pode ficar salvo somente neste navegador.</p></div></section>

    <section className="playground-toolbar glass-panel">
      <div><strong>Laboratório</strong><small>O preview roda em um iframe isolado para reduzir riscos.</small></div>
      <div className="button-row"><button className="primary-button" onClick={run}><Play size={17}/> Executar</button><button className="secondary-button" onClick={save}><Save size={17}/> {saved?'Salvo':'Salvar'}</button><button className="secondary-button" onClick={reset}><RotateCcw size={17}/> Resetar</button></div>
    </section>

    <section className="editor-grid">
      <label className="code-panel glass-panel"><span><b>HTML</b><small>estrutura</small></span><textarea spellCheck={false} value={html} onChange={e=>setHtml(e.target.value)} aria-label="Editor HTML"/></label>
      <label className="code-panel glass-panel"><span><b>CSS</b><small>visual</small></span><textarea spellCheck={false} value={css} onChange={e=>setCss(e.target.value)} aria-label="Editor CSS"/></label>
      <label className="code-panel glass-panel"><span><b>JavaScript</b><small>comportamento</small></span><textarea spellCheck={false} value={js} onChange={e=>setJs(e.target.value)} aria-label="Editor JavaScript"/></label>
    </section>

    <section className="preview-panel glass-panel"><div className="preview-head"><div><Sparkles size={17}/><strong>Preview</strong></div><span>Resultado ao clicar em Executar</span></div><iframe title="Preview do código" sandbox="allow-scripts" srcDoc={srcDoc}/></section>

    <section className="split-grid"><article className="glass-panel content-panel"><h2>💡 Como estudar aqui</h2><ol><li>Mude uma coisa pequena.</li><li>Tente prever o que vai acontecer.</li><li>Aperte <strong>Executar</strong>.</li><li>Se quebrar, compare o erro com a última mudança.</li></ol></article><article className="glass-panel content-panel"><h2>🎯 Desafios rápidos</h2><p>Troque o título, crie outro botão, mude o tamanho do card e faça o JavaScript alterar uma cor ou adicionar um novo elemento.</p><small>Quebrar o código aqui faz parte do estudo. O botão Resetar traz o exemplo inicial de volta.</small></article></section>
  </div>
}
