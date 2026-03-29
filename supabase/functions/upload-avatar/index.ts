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

    // Verify caller is authenticated
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) throw new Error('Unauthorized')

    // Get file from multipart form data
    const formData = await req.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'avatars'

    if (!file) throw new Error('No file provided')

    const ext = file.name.split('.').pop().toLowerCase()
    const path = `${folder}/${user.id}-${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()

    const { error: upErr } = await supabaseAdmin.storage
      .from('profiles')
      .upload(path, arrayBuffer, { contentType: file.type, upsert: true })

    if (upErr) throw upErr

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('profiles')
      .getPublicUrl(path)

    return new Response(JSON.stringify({ publicUrl }), {
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
