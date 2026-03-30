import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function sendRejectionEmail({ to, fullName, resendApiKey }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#fff1f2;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff1f2;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
            <tr>
              <td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:40px 40px 32px;text-align:center;">
                <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                  <span style="font-size:32px;">📋</span>
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
                <div style="background:#fff1f2;border:2px solid #fecdd3;border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;">
                  <p style="color:#b91c1c;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Registration Status</p>
                  <p style="color:#dc2626;font-size:22px;font-weight:900;margin:0;">❌ Not Approved</p>
                </div>
                <h2 style="color:#111827;margin:0 0 12px;font-size:22px;font-weight:800;">
                  Hello, ${fullName}
                </h2>
                <p style="color:#6b7280;margin:0 0 20px;font-size:15px;line-height:1.6;">
                  We regret to inform you that your alumni registration for the <strong>Peter Harvard INT'L School Alumni Portal</strong> has not been approved at this time.
                </p>
                <p style="color:#6b7280;margin:0 0 28px;font-size:15px;line-height:1.6;">
                  This may be due to incomplete information, unverifiable details, or other administrative reasons.
                </p>
                <div style="background:#fff1f2;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
                  <p style="color:#374151;font-size:14px;font-weight:600;margin:0 0 8px;">Think this was a mistake?</p>
                  <p style="color:#6b7280;font-size:13px;margin:0;line-height:1.6;">
                    If you believe your registration was rejected in error, you are welcome to <strong>register again</strong> with updated information, or contact us directly for clarification.
                  </p>
                </div>
                <p style="color:#374151;font-size:14px;font-weight:600;margin:0 0 12px;">Contact us:</p>
                <p style="color:#9ca3af;font-size:13px;margin:0;line-height:2;">
                  📧 <a href="mailto:anointedthedeveloper@gmail.com" style="color:#dc2626;text-decoration:none;">anointedthedeveloper@gmail.com</a><br/>
                  📞 <a href="tel:+2348033570685" style="color:#dc2626;text-decoration:none;">+234 803 357 0685</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#fff1f2;border-top:2px solid #fecdd3;padding:20px 40px;text-align:center;">
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
      subject: 'Update on Your Alumni Registration',
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
      .from('alumni').select('id, full_name, email, phone, graduation_year, current_occupation, bio, avatar_url').eq('id', alumniId).single()
    if (fetchError || !alumni) throw new Error('Alumni not found')

    // Archive to rejected_alumni before deleting
    await supabaseAdmin.from('rejected_alumni').insert([{
      original_id: alumni.id,
      full_name: alumni.full_name,
      email: alumni.email,
      phone: alumni.phone,
      graduation_year: alumni.graduation_year,
      current_occupation: alumni.current_occupation,
      bio: alumni.bio,
      avatar_url: alumni.avatar_url,
    }])

    // Delete from alumni so they can re-register
    await supabaseAdmin.from('alumni').delete().eq('id', alumniId)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        await sendRejectionEmail({ to: alumni.email, fullName: alumni.full_name, resendApiKey })
      } catch (emailErr) {
        console.error('Rejection email failed (non-fatal):', emailErr.message)
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
