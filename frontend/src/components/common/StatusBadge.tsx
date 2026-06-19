import { clsx } from 'clsx'

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    queued: { color: 'bg-neutral-800 text-neutral-300', label: 'Queued' },
    running: { color: 'bg-primary/10 text-primary', label: 'Running' },
    completed: { color: 'bg-neutral-600/10 text-neutral-300', label: 'Completed' },
    failed: { color: 'bg-neutral-800/50 text-neutral-300', label: 'Failed' },
    cancelled: { color: 'bg-neutral-600/10 text-neutral-300', label: 'Cancelled' },
    partial: { color: 'bg-neutral-600/10 text-neutral-300', label: 'Partial' },
  }
  const c = config[status] || { color: 'bg-neutral-800 text-neutral-300', label: status }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium',
        c.color
      )}
    >
      {status === 'running' && (
        <span className="w-1.5 h-1.5 bg-primary rounded-lg mr-1.5 animate-pulse" />
      )}
      {c.label}
    </span>
  )
}