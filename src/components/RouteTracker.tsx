import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'

const ignored = ['/account', '/settings', '/search', '/progress', '/favorites', '/privacy']

function currentSection() {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-resume-section]')]
  let active: HTMLElement | undefined
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 180) active = section
  }
  return active?.dataset.resumeSection
}

export function RouteTracker() {
  const location = useLocation()
  const { data, setLastVisitedPath, setResumePoint } = useAppState()
  const restoredPath = useRef<string>()
  const timer = useRef<number>()
  const path = `${location.pathname}${location.search}`
  const lessonId = location.pathname.startsWith('/lesson/') ? location.pathname.split('/')[2] : undefined
  const ignoredPath = ignored.some(item => location.pathname.startsWith(item))

  useEffect(() => {
    if (ignoredPath) return
    setLastVisitedPath(path, lessonId)
    if (data.resumePoint.path === path && data.resumePoint.scrollY > 0 && restoredPath.current !== path) {
      restoredPath.current = path
      window.setTimeout(() => window.scrollTo({ top: data.resumePoint.scrollY, behavior: 'auto' }), 80)
    } else if (data.resumePoint.path !== path) {
      restoredPath.current = undefined
      setResumePoint({ path, lessonId, scrollY: 0 })
    }
  // Restoring must happen only when the route changes; data updates while scrolling should not restart it.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  useEffect(() => {
    if (ignoredPath) return
    const save = () => setResumePoint({ path, lessonId, scrollY: Math.max(0, window.scrollY), sectionId: currentSection() })
    const onScroll = () => {
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(save, 450)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('beforeunload', save)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', save)
      if (timer.current) window.clearTimeout(timer.current)
      save()
    }
  }, [ignoredPath, lessonId, path, setResumePoint])

  return null
}
