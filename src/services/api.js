import { supabase } from './supabase'

// Helper — gets current session access token and passes it as Authorization header
async function invokeWithAuth(fnName, body = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  return supabase.functions.invoke(fnName, {
    body,
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {},
  })
}

export const alumniService = {
  async register(data) {
    return supabase.from('alumni').insert([{ ...data, status: 'pending' }])
  },

  async getAll({ search = '', year = '' } = {}) {
    let query = supabase
      .from('alumni')
      .select('*')
      .eq('status', 'approved')
      .order('full_name')
    if (search) query = query.ilike('full_name', `%${search}%`)
    if (year) query = query.eq('graduation_year', year)
    return query
  },

  async getPending() {
    return supabase.from('alumni')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
  },

  async approve(alumniId) {
    return invokeWithAuth('approve-alumni', { alumniId })
  },

  async reject(id) {
    return supabase.from('alumni').update({ status: 'rejected' }).eq('id', id)
  },

  async setFeatured(id, featured) {
    return supabase.from('alumni').update({ featured }).eq('id', id)
  },

  async getFeatured() {
    return supabase.from('alumni')
      .select('*')
      .eq('status', 'approved')
      .eq('featured', true)
  },
}

export const eventsService = {
  async getAll() {
    return supabase.from('events').select('*').order('event_date', { ascending: false })
  },

  async create(data) {
    const { data: result, error } = await supabase.from('events').insert([data]).select().single()
    return { data: result, error }
  },

  async delete(id) {
    return supabase.from('events').delete().eq('id', id)
  },
}

export const adminService = {
  async createAdmin(email, password) {
    return invokeWithAuth('create-admin', { email, password })
  },

  async listAdmins() {
    return invokeWithAuth('list-admins')
  },

  async removeAdmin(userId) {
    return invokeWithAuth('remove-admin', { userId })
  },
}
