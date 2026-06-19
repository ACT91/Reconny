import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'

interface LogEntry {
  id?: string
  stage?: string
  level: string
  message: string
  timestamp?: string
  details?: Record<string, unknown>
}

interface LiveLogsViewerProps {
  logs: LogEntry[]
  maxHeight?: string
  filter?: string
}

export function LiveLogsViewer({ logs, maxHeight = '400px', filter }: LiveLogsViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  const filtered = filter
    ? logs.filter((l) => l.level === filter || l.stage?.includes(filter) || l.message.toLowerCase().includes(filter.toLowerCase()))
    : logs

  const levelColors: Record<string, string> = {
    debug: 'text-neutral-500',
    info: 'text-primary',
    warning: 'text-neutral-300',
    error: 'text-neutral-300',
    critical: 'text-neutral-300 font-bold',
  }

  return (
    <div
      className="bg-black/60 rounded-lg overflow-y-auto font-mono text-xs leading-relaxed p-4"
      style={{ maxHeight }}
    >
      {filtered.length === 0 && (
        <div className="text-neutral-500 text-center py-8">No logs yet</div>
      )}
      {filtered.map((log, i) => (
        <div key={log.id || i} className="flex gap-2 py-0.5">
          <span className="text-neutral-600 shrink-0">
            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}
          </span>
          {log.stage && (
            <span className="text-neutral-300 shrink-0">[{log.stage}]</span>
          )}
          <span className={clsx('shrink-0', levelColors[log.level] || 'text-neutral-400')}>
            {log.level.toUpperCase()}
          </span>
          <span className="text-neutral-200 break-all">{log.message}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}