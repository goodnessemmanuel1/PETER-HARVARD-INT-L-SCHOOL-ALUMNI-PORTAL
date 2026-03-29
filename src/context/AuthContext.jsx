import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const checkAdmin = (u) => u?.user_metadata?.role === 'admin'

  const loadAvatar = async (u) => {
    if (!u) { setAvatarUrl(null); return }
    if (u.user_metadata?.avatar_url) {
      setAvatarUrl(u.user_metadata.avatar_url)
      return
    }
    const { data } = await supabase
      .from('alumni')
      .select('avatar_url')
      .eq('auth_user_id', u.id)
      .single()
    setAvatarUrl(data?.avatar_url || null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      setIsAdmin(checkAdmin(u))
      loadAvatar(u)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setIsAdmin(checkAdmin(u))
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        loadAvatar(u)
      }
      // Ensure loading is cleared on any auth event in case getSession was slow
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  const updatePassword = (newPassword) =>
    supabase.auth.updateUser({ password: newPassword })

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

  // Called after avatar upload so Navbar updates immediately
  const refreshAvatar = (url) => setAvatarUrl(url)

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, avatarUrl, signIn, signOut, updatePassword, resetPassword, refreshAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
