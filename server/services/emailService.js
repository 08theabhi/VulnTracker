const nodemailer = require('nodemailer')

exports.sendVulnAlert = async (userEmail, cves) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    })
    const critical = cves.filter(c => c.severity >= 9).length
    const rows = cves.slice(0, 10).map(c => {
      const label = c.severity >= 9 ? '🔴 CRITICAL' : c.severity >= 7 ? '🟠 HIGH' : '🟡 MEDIUM'
      return `<tr><td style="padding:8px;font-family:monospace;color:#00D4FF">${c.cve_id}</td><td style="padding:8px">${c.technology}</td><td style="padding:8px">${label} (${c.severity})</td></tr>`
    }).join('')
    await transporter.sendMail({
      from: `VulnTracker <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: critical > 0 ? `[VulnTracker] 🚨 ${critical} Critical CVEs Detected!` : `[VulnTracker] ⚠️ ${cves.length} Vulnerabilities Found`,
      html: `<div style="background:#0A0E17;color:#E2E8F7;padding:24px;font-family:Arial"><h2 style="color:#00D4FF">🛡️ VulnTracker Alert</h2><p>${cves.length} vulnerabilities found in your stack</p><table style="width:100%;border-collapse:collapse">${rows}</table><br><a href="${process.env.CLIENT_URL}/scan" style="background:#00D4FF;color:#0A0E17;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold">View Full Report →</a></div>`
    })
    console.log(`✅ Alert sent to ${userEmail}`)
  } catch (e) {
    console.error('Email error:', e.message)
  }
}

exports.sendSlackAlert = async (webhook, cves) => {
  if (!webhook) return
  try {
    const text = `🚨 *VulnTracker Alert*\n${cves.length} vulnerabilities found\n${cves.slice(0, 3).map(c => `• ${c.cve_id} | ${c.technology} | Score: ${c.severity}`).join('\n')}`
    await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
  } catch (e) {
    console.error('Slack error:', e.message)
  }
}
