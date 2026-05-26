const colors = {
  cyan: 'text-cyber-accent bg-cyber-accent/10 border-cyber-accent/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
  green: 'text-green-400 bg-green-500/10 border-green-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
}

export default function StatCard({ label, value, icon: Icon, color = 'cyan' }) {
  return (
    <div className="cyber-card flex items-start gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
          <Icon size={18} />
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-cyber-text">{value}</div>
        <div className="text-sm text-cyber-muted font-mono mt-0.5">{label}</div>
      </div>
    </div>
  )
}
