import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/Loader'

export default function PublicLayout() {
  const { loading } = useAuth()

  if (loading) return <PageLoader message="Loading portal..." />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
