import { useCallback, useEffect, useState } from 'react'

const CACHE_KEY = 'futuro-lab-fx-brl-v1'
const CACHE_MS = 6 * 60 * 60 * 1000

interface FxCache {
  rates: Record<string, number>
  updatedAt: string
  fetchedAt: number
  source: string
}

export interface FxState {
  rates: Record<string, number>
  updatedAt?: string
  source?: string
  loading: boolean
  error?: string
  refresh: () => Promise<void>
}

function readCache(): FxCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as FxCache
    if (!parsed.rates || !parsed.fetchedAt) return null
    return parsed
  } catch {
    return null
  }
}

function saveCache(data: FxCache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch { /* storage can be unavailable */ }
}

async function fetchOpenErApi(): Promise<FxCache> {
  const response = await fetch('https://open.er-api.com/v6/latest/BRL')
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json() as {
    result?: string
    time_last_update_utc?: string
    rates?: Record<string, number>
  }
  if (json.result !== 'success' || !json.rates) throw new Error('Resposta de câmbio inválida')
  return {
    rates: { ...json.rates, BRL: 1 },
    updatedAt: json.time_last_update_utc ?? new Date().toISOString(),
    fetchedAt: Date.now(),
    source: 'ExchangeRate-API (open.er-api.com)'
  }
}

async function fetchFrankfurter(): Promise<FxCache> {
  const response = await fetch('https://api.frankfurter.dev/v1/latest?base=BRL')
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json() as { date?: string; rates?: Record<string, number> }
  if (!json.rates) throw new Error('Resposta de câmbio inválida')
  return {
    rates: { ...json.rates, BRL: 1 },
    updatedAt: json.date ?? new Date().toISOString(),
    fetchedAt: Date.now(),
    source: 'Frankfurter (dados de bancos centrais)'
  }
}

async function fetchRates(): Promise<FxCache> {
  try {
    return await fetchOpenErApi()
  } catch {
    return fetchFrankfurter()
  }
}

export function useFxRates(): FxState {
  const cached = typeof window === 'undefined' ? null : readCache()
  const [rates, setRates] = useState<Record<string, number>>(cached?.rates ?? { BRL: 1 })
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(cached?.updatedAt)
  const [source, setSource] = useState<string | undefined>(cached?.source)
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | undefined>()

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const fresh = await fetchRates()
      saveCache(fresh)
      setRates(fresh.rates)
      setUpdatedAt(fresh.updatedAt)
      setSource(fresh.source)
    } catch {
      setError('Não foi possível atualizar o câmbio agora. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cache = readCache()
    if (!cache || Date.now() - cache.fetchedAt > CACHE_MS) void refresh()
  }, [refresh])

  return { rates, updatedAt, source, loading, error, refresh }
}
