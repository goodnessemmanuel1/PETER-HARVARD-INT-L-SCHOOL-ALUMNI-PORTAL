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

    // Verify caller is admin
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) throw new Error('Unauthorized')
    if (user.user_metadata?.role !== 'admin') throw new Error('Forbidden: admin only')

    const { alumniId } = await req.json()
    if (!alumniId) throw new Error('alumniId is required')

    // Get alumni record including pending_password
    const { data: alumni, error: fetchError } = await supabaseAdmin
      .from('alumni')
      .select('*')
      .eq('id', alumniId)
      .single()

    if (fetchError || !alumni) throw new Error('Alumni not found')

    // Use their own password if set, otherwise generate one
    const password = alumni.pending_password ||
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + '!2'

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: alumni.email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'alumni',
        alumni_id: alumniId,
        full_name: alumni.full_name,
      },
    })

    if (authError) throw authError

    // Update alumni: approved, store auth_user_id, clear pending_password
    await supabaseAdmin
      .from('alumni')
      .update({ 
        status: 'approved', 
        auth_user_id: authData.user.id,
        pending_password: null,
      })
      .eq('id', alumniId)

    // Send welcome email via Supabase invite
    const siteUrl = Deno.env.get('SITE_URL') || 'https://peter-harvard-int-l-school-alumni-p.vercel.app'
    await supabaseAdmin.auth.admin.inviteUserByEmail(alumni.email, {
      redirectTo: `${siteUrl}/login`,
      data: { full_name: alumni.full_name },
    })

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
