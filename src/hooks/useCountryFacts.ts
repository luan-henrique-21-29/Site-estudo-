import { useEffect, useState } from 'react'
import { countryIso } from '../data/countryIso'

export interface CountryFacts {
  iso2:string
  population?:number
  areaKm2?:number
  timezones:string[]
  latlng?:[number,number]
  mapsUrl?:string
  flagSvg?:string
  source:string
  updatedAt:string
}

const CACHE_KEY='futuro-lab-country-facts-v1'
const MAX_AGE=7*24*60*60*1000
function readCache():Record<string,CountryFacts>{try{return JSON.parse(localStorage.getItem(CACHE_KEY)??'{}') as Record<string,CountryFacts>}catch{return {}}}
function saveCache(cache:Record<string,CountryFacts>){try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache))}catch{}}

export function useCountryFacts(countryId?:string){
  const iso=countryId?countryIso[countryId]:undefined
  const cached=countryId?readCache()[countryId]:undefined
  const [facts,setFacts]=useState<CountryFacts|undefined>(cached)
  const [loading,setLoading]=useState(Boolean(iso&&!cached))
  const [error,setError]=useState<string|undefined>()
  useEffect(()=>{
    if(!countryId||!iso)return
    const existing=readCache()[countryId]
    if(existing&&Date.now()-new Date(existing.updatedAt).getTime()<MAX_AGE){setFacts(existing);setLoading(false);return}
    const controller=new AbortController();setLoading(true);setError(undefined)
    fetch(`https://restcountries.com/v3.1/alpha/${iso}?fields=population,area,timezones,latlng,maps,flags`,{signal:controller.signal})
      .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()})
      .then(raw=>{const row=Array.isArray(raw)?raw[0]:raw;const next:CountryFacts={iso2:iso,population:typeof row.population==='number'?row.population:undefined,areaKm2:typeof row.area==='number'?row.area:undefined,timezones:Array.isArray(row.timezones)?row.timezones:[],latlng:Array.isArray(row.latlng)&&row.latlng.length>=2?[Number(row.latlng[0]),Number(row.latlng[1])]:undefined,mapsUrl:row.maps?.googleMaps,flagSvg:row.flags?.svg,source:'REST Countries — dados gerais agregados',updatedAt:new Date().toISOString()};const cache=readCache();cache[countryId]=next;saveCache(cache);setFacts(next)})
      .catch(e=>{if(e?.name!=='AbortError')setError('Não foi possível atualizar os dados gerais agora. Usando o que estiver salvo.')})
      .finally(()=>setLoading(false))
    return()=>controller.abort()
  },[countryId,iso])
  return {facts,loading,error}
}
