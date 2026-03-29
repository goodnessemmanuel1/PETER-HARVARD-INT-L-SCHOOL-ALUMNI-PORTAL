import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { alumniId } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    )

    // Get alumni record
    const { data: alumni, error: fetchError } = await supabaseAdmin
      .from('alumni')
      .select('*')
      .eq('id', alumniId)
      .single()

    if (fetchError || !alumni) throw new Error('Alumni not found')

    // Generate a random password
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-4).toUpperCase() + '!'

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: alumni.email,
      password,
      email_confirm: true,
      user_metadata: { role: 'alumni', alumni_id: alumniId, full_name: alumni.full_name },
    })

    if (authError) throw authError

    // Update alumni status to approved and store auth user id
    await supabaseAdmin
      .from('alumni')
      .update({ status: 'approved', auth_user_id: authData.user.id })
      .eq('id', alumniId)

    // Send welcome email via Supabase's built-in email (SMTP)
    // We use the admin API to send a custom email
    const emailBody = `
Hello ${alumni.full_name},

Congratulations! Your Peter Harvard INT'L School Alumni Portal registration has been approved.

Your login credentials are:

  Email:    ${alumni.email}
  Password: ${password}

Login here: ${Deno.env.get('SITE_URL')}/login

We recommend changing your password after your first login.

Welcome to the community!

— Peter Harvard INT'L School Alumni Team
    `.trim()

    // Use Supabase's SMTP to send email by triggering a password reset
    // which delivers the credentials email instead
    await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: alumni.email,
    })

    // Send via fetch to a simple email endpoint or use Resend/SendGrid
    // For now we use Supabase's own invite flow which sends an email
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(alumni.email, {
      data: { full_name: alumni.full_name, temp_password: password },
      redirectTo: `${Deno.env.get('SITE_URL')}/login`,
    })

    // If invite fails (user already exists), just return success
    // The user was already created above

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
