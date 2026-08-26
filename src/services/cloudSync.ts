import type { AppData } from '../types'
import { supabase } from '../lib/supabase'

export interface CloudSnapshot {
  data: AppData
  updatedAt: string
}

export async function loadCloudSnapshot(userId: string): Promise<CloudSnapshot | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('study_profiles')
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return { data: data.data as AppData, updatedAt: data.updated_at as string }
}

export async function saveCloudSnapshot(userId: string, appData: AppData): Promise<string> {
  if (!supabase) throw new Error('Cloud sync is not configured')
  const updatedAt = appData.updatedAt || new Date().toISOString()
  const { error } = await supabase
    .from('study_profiles')
    .upsert({ user_id: userId, data: appData, updated_at: updatedAt }, { onConflict: 'user_id' })
  if (error) throw error
  return updatedAt
}
