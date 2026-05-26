export default function RiskScoreCard({ score = 100, critical = 0, high = 0, medium = 0, low = 0, total = 0 }) {
  const color = score >= 80 ? '#00FF88' : score >= 60 ? '#FFB020' : score >= 40 ? '#FF8C00' : '#FF3B5C'
  const label = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : score >= 40 ? 'Poor' : 'Critical'
  const circumference = 2 * Math.PI * 36

  return (
    <div className="cyber-card">
      <div className="text-xs font-mono text-cyber-muted uppercase tracking-widest mb-4">// Security Risk Score</div>
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="#1E2D47" strokeWidth="7" />
            <circle cx="45" cy="45" r="36" fill="none" stroke={color} strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score / 100)}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>{score}</span>
            <span className="text-xs font-mono" style={{ color }}>{label}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {[
            ['Critical', critical, 'text-red-400', 'bg-red-500'],
            ['High', high, 'text-orange-400', 'bg-orange-500'],
            ['Medium', medium, 'text-amber-400', 'bg-amber-500'],
            ['Low', low, 'text-green-400', 'bg-green-500']
          ].map(([l, v, tc, bc]) => (
            <div key={l} className="flex items-center gap-2">
              <span className={`text-xs font-mono w-14 ${tc}`}>{l}</span>
              <div className="flex-1 h-1.5 bg-cyber-border rounded-full overflow-hidden">
                <div className={`h-full ${bc} rounded-full`} style={{ width: total > 0 ? `${(v / total) * 100}%` : '0%' }} />
              </div>
              <span className="text-xs font-mono text-cyber-muted w-5 text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
