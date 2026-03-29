import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Small delay to ensure the page has started transitioning
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    return () => clearTimeout(timeout)
  }, [pathname])
  return null
}
