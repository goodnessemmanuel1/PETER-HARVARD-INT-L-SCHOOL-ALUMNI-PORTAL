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
    const isAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
    if (!isAdmin) throw new Error('Forbidden: admin only')

    const { userId } = await req.json()
    if (!userId) throw new Error('userId is required')

    // Prevent removing yourself
    if (userId === user.id) throw new Error('Cannot remove your own admin role')

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'alumni' },
    })
    if (error) throw error

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
