import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ScrollToTop from './components/ScrollToTop'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import Register from './pages/Register'
import Directory from './pages/Directory'
import Events from './pages/Events'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import AlumniProfile from './pages/AlumniProfile'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminApprovals from './pages/admin/AdminApprovals'
import AdminAlumni from './pages/admin/AdminAlumni'
import AdminEvents from './pages/admin/AdminEvents'
import AdminManage from './pages/admin/AdminManage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/events" element={<Events />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/alumni/:id" element={<AlumniProfile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="alumni" element={<AdminAlumni />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="manage" element={<AdminManage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
