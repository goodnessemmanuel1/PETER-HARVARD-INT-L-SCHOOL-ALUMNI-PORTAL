import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/Loader'
import PageTransition from '../components/PageTransition'

export default function PublicLayout() {
  const { loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader message="Loading portal..." />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
