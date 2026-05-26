export default function SeverityBadge({ score }) {
  const [label, cls] = score >= 9
    ? ['CRITICAL', 'severity-critical']
    : score >= 7 ? ['HIGH', 'severity-high']
    : score >= 4 ? ['MEDIUM', 'severity-medium']
    : ['LOW', 'severity-low']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label} {score?.toFixed(1)}
    </span>
  )
}
