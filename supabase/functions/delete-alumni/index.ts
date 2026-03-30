import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    )

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) throw new Error('Unauthorized')

    const { alumniId } = await req.json()
    if (!alumniId) throw new Error('alumniId is required')

    // Get alumni record to find auth_user_id
    const { data: alumni, error: fetchError } = await supabaseAdmin
      .from('alumni')
      .select('id, auth_user_id, full_name')
      .eq('id', alumniId)
      .single()

    if (fetchError || !alumni) throw new Error('Alumni not found')

    // Delete from alumni table
    const { error: deleteError } = await supabaseAdmin
      .from('alumni')
      .delete()
      .eq('id', alumniId)

    if (deleteError) throw deleteError

    // Also delete auth user if exists
    if (alumni.auth_user_id) {
      await supabaseAdmin.auth.admin.deleteUser(alumni.auth_user_id)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
