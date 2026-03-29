import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import Register from './pages/Register'
import Directory from './pages/Directory'
import Events from './pages/Events'
import Login from './pages/Login'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminApprovals from './pages/admin/AdminApprovals'
import AdminAlumni from './pages/admin/AdminAlumni'
import AdminEvents from './pages/admin/AdminEvents'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/events" element={<Events />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="alumni" element={<AdminAlumni />} />
              <Route path="events" element={<AdminEvents />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
