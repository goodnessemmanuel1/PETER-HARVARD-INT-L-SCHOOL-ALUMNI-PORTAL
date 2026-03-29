import { supabase } from './supabase'

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
    return supabase.from('alumni').select('*').eq('status', 'pending').order('created_at', { ascending: false })
  },

  async updateStatus(id, status) {
    return supabase.from('alumni').update({ status }).eq('id', id)
  },

  async setFeatured(id, featured) {
    return supabase.from('alumni').update({ featured }).eq('id', id)
  },

  async getFeatured() {
    return supabase.from('alumni').select('*').eq('status', 'approved').eq('featured', true)
  },
}

export const eventsService = {
  async getAll() {
    return supabase.from('events').select('*').order('event_date', { ascending: false })
  },

  async create(data) {
    return supabase.from('events').insert([data])
  },

  async delete(id) {
    return supabase.from('events').delete().eq('id', id)
  },
}
