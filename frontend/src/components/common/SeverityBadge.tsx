import { clsx } from 'clsx'

const severityColors: Record<string, string> = {
  critical: 'bg-neutral-800/50 text-neutral-300 border-red-700',
  high: 'bg-neutral-600/10 text-neutral-300 border-orange-700',
  medium: 'bg-neutral-600/10 text-neutral-300 border-amber-700',
  low: 'bg-primary/10 text-primary border-primary',
  info: 'bg-neutral-800 text-neutral-300 border-neutral-600',
}

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border',
        severityColors[severity.toLowerCase()] || severityColors.info
      )}
    >
      {severity.toUpperCase()}
    </span>
  )
}