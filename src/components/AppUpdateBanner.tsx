import { useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'

export function AppUpdateBanner(){
 const [registration,setRegistration]=useState<ServiceWorkerRegistration|null>(null); const [visible,setVisible]=useState(false)
 useEffect(()=>{if(!('serviceWorker'in navigator)||!import.meta.env.PROD)return;let mounted=true;navigator.serviceWorker.ready.then(reg=>{if(!mounted)return;setRegistration(reg);if(reg.waiting)setVisible(true);const onUpdate=()=>{const worker=reg.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)setVisible(true)})};reg.addEventListener('updatefound',onUpdate)});const onController=()=>window.location.reload();navigator.serviceWorker.addEventListener('controllerchange',onController);return()=>{mounted=false;navigator.serviceWorker.removeEventListener('controllerchange',onController)}},[])
 const update=()=>{if(!registration?.waiting)return;registration.waiting.postMessage({type:'SKIP_WAITING'})}
 if(!visible)return null
 return <aside className="app-update-banner" role="status"><div><strong>Nova versão disponível</strong><span>Atualize para receber melhorias sem perder seu progresso salvo.</span></div><button className="primary-button" onClick={update}><RefreshCw size={16}/> Atualizar</button><button className="icon-button" onClick={()=>setVisible(false)} aria-label="Fechar"><X size={16}/></button></aside>
}
