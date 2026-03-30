import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function sendApprovalEmail({ to, fullName, email, password, loginUrl, resendApiKey }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
            <tr>
              <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:40px 40px 32px;text-align:center;">
                <div style="width:80px;height:80px;background:#ffffff;border-radius:50%;display:inline-block;margin-bottom:16px;overflow:hidden;">
                  <img src="https://peterharvardalumni.vercel.app/assets/phislogo.png" alt="PHIS Logo" width="80" height="80" style="width:80px;height:80px;object-fit:contain;border-radius:50%;" />
                </div>
                <h1 style="color:#ffffff;margin:0 0 8px;font-size:26px;font-weight:900;letter-spacing:-0.5px;">
                  Peter Harvard INT'L School
                </h1>
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">
                  Alumni Portal
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;">
                  <p style="color:#15803d;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Registration Status</p>
                  <p style="color:#16a34a;font-size:22px;font-weight:900;margin:0;">✅ Approved</p>
                </div>
                <h2 style="color:#111827;margin:0 0 12px;font-size:22px;font-weight:800;">
                  Welcome, ${fullName}! 🎉
                </h2>
                <p style="color:#6b7280;margin:0 0 28px;font-size:15px;line-height:1.6;">
                  Your alumni registration has been <strong style="color:#16a34a;">approved</strong>. You are now officially part of the Peter Harvard INT'L School Alumni community.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:24px;">
                      <p style="color:#374151;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">
                        Your Login Credentials
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                            <span style="color:#6b7280;font-size:13px;font-weight:600;">Email</span>
                          </td>
                          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                            <span style="color:#111827;font-size:14px;font-weight:700;">${email}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;">
                            <span style="color:#6b7280;font-size:13px;font-weight:600;">Password</span>
                          </td>
                          <td style="padding:8px 0;text-align:right;">
                            <span style="color:#16a34a;font-size:15px;font-weight:800;font-family:monospace;background:#f0fdf4;padding:4px 10px;border-radius:6px;">${password}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <p style="color:#6b7280;font-size:13px;margin:0 0 24px;line-height:1.6;">
                  ⚠️ For your security, please <strong>change your password</strong> after your first login via your profile settings.
                </p>
                <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                  <tr>
                    <td style="background:#16a34a;border-radius:10px;">
                      <a href="${loginUrl}" style="display:inline-block;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;">
                        Login to Your Account →
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="color:#9ca3af;font-size:13px;margin:0;line-height:1.6;">
                  If you have any issues logging in, feel free to reach out:<br/>
                  📧 <a href="mailto:anointedthedeveloper@gmail.com" style="color:#16a34a;">anointedthedeveloper@gmail.com</a><br/>
                  📞 <a href="tel:+2348033570685" style="color:#16a34a;">+234 803 357 0685</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f0fdf4;border-top:2px solid #bbf7d0;padding:20px 40px;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} Peter Harvard INT'L School Alumni Portal ·
                  <a href="https://anobyte.online" style="color:#6b7280;text-decoration:none;">Powered by Anobyte</a>
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Peter Harvard Alumni Portal <noreply@anobyte.online>',
      to: [to],
      subject: '✅ Your Alumni Registration Has Been Approved!',
      html,
    }),
  })
  if (!res.ok) throw new Error(`Email send failed: ${await res.text()}`)
  return res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders })

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

    const { data: alumni, error: fetchError } = await supabaseAdmin
      .from('alumni').select('*').eq('id', alumniId).single()
    if (fetchError || !alumni) throw new Error('Alumni not found')

    const password = alumni.pending_password ||
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + '!2'

    // If auth user already exists for this email, delete it first to avoid 409
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existing = existingUsers?.users?.find(u => u.email === alumni.email)
    if (existing) await supabaseAdmin.auth.admin.deleteUser(existing.id)

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: alumni.email,
      password,
      email_confirm: true,
      user_metadata: { role: 'alumni', alumni_id: alumniId, full_name: alumni.full_name },
    })
    if (authError) throw authError

    await supabaseAdmin
      .from('alumni')
      .update({ status: 'approved', auth_user_id: authData.user.id, pending_password: null })
      .eq('id', alumniId)

    const siteUrl = Deno.env.get('SITE_URL') || 'https://peterharvardalumni.vercel.app'
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        await sendApprovalEmail({
          to: alumni.email, fullName: alumni.full_name,
          email: alumni.email, password,
          loginUrl: `${siteUrl}/login`, resendApiKey,
        })
      } catch (emailErr) {
        console.error('Approval email failed (non-fatal):', emailErr.message)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
