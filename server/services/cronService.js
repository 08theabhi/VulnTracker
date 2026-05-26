const cron = require('node-cron')
const supabase = require('../config/supabase')
const { scanUserStack } = require('./nvdService')
const { sendVulnAlert } = require('./emailService')

const runDailyScan = async () => {
  console.log('⏰ Daily scan started:', new Date().toISOString())
  try {
    const { data: users } = await supabase.from('users').select('id, email')
    for (const user of users || []) {
      try {
        const { data: stacks } = await supabase.from('user_stacks').select('*').eq('user_id', user.id)
        if (!stacks?.length) continue
        const cves = await scanUserStack(stacks)
        if (cves.length === 0) continue
        await supabase.from('cve_alerts').delete().eq('user_id', user.id)
        await supabase.from('cve_alerts').insert(cves.map(c => ({ ...c, user_id: user.id, is_read: false })))
        const critical = cves.filter(c => c.severity >= 9).length
        const high = cves.filter(c => c.severity >= 7 && c.severity < 9).length
        const medium = cves.filter(c => c.severity >= 4 && c.severity < 7).length
        const low = cves.filter(c => c.severity < 4).length
        await supabase.from('scan_history').insert({
          user_id: user.id, total_cves: cves.length,
          critical_count: critical, high_count: high, medium_count: medium, low_count: low,
          risk_score: Math.max(0, 100 - critical * 20 - high * 10 - medium * 5)
        })
        const serious = cves.filter(c => c.severity >= 7)
        if (serious.length > 0) await sendVulnAlert(user.email, serious)
        await new Promise(r => setTimeout(r, 2000))
      } catch (e) { console.error('User scan error:', e.message) }
    }
    console.log('✅ Daily scan complete')
  } catch (e) { console.error('Daily scan failed:', e) }
}

const startCronJob = () => {
  cron.schedule('0 8 * * *', runDailyScan, { timezone: 'UTC' })
  console.log('⏰ Daily scan scheduled (8AM UTC)')
}

module.exports = { startCronJob, runDailyScan }
