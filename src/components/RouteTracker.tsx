import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'

const ignored = ['/account', '/settings', '/search', '/progress', '/favorites']

export function RouteTracker() {
  const location = useLocation()
  const { setLastVisitedPath } = useAppState()

  useEffect(() => {
    if (ignored.some(path => location.pathname.startsWith(path))) return
    const path = `${location.pathname}${location.search}`
    const lessonId = location.pathname.startsWith('/lesson/') ? location.pathname.split('/')[2] : undefined
    setLastVisitedPath(path, lessonId)
  }, [location.pathname, location.search, setLastVisitedPath])

  return null
}
