import type { WageSource } from './wages'

const overrides: Record<string, WageSource> = {
  espanha: {
    label: 'BOE — Real Decreto 126/2026 (SMI 2026)',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815'
  }
}

export function wageSource(countryId: string, fallback: WageSource): WageSource {
  return overrides[countryId] ?? fallback
}
