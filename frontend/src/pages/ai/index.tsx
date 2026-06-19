import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { insightApi, resultApi } from '@/services/api'
import { SeverityBadge, Skeleton, ErrorBoundary } from '@/components/common'
import type { AggregatedStats } from '@/types'

function RiskScoreGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 70) return 'text-neutral-300'
    if (s >= 40) return 'text-neutral-300'
    return 'text-neutral-300'
  }

  const getLabel = (s: number) => {
    if (s >= 70) return 'High Risk'
    if (s >= 40) return 'Medium Risk'
    return 'Low Risk'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="2.8" />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeDasharray={`${score}, 100`}
            className={getColor(score)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getColor(score)}`}>{Math.round(score)}</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${getColor(score)}`}>{getLabel(score)}</span>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="bg-neutral-800/50 rounded-lg p-4">
      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || 'text-neutral-50'}`}>{value}</p>
    </div>
  )
}

function VsSeverityChart({ stats }: { stats: AggregatedStats }) {
  const severities = [
    { key: 'critical', label: 'Critical', color: 'bg-neutral-700' },
    { key: 'high', label: 'High', color: 'bg-neutral-600' },
    { key: 'medium', label: 'Medium', color: 'bg-neutral-600' },
    { key: 'low', label: 'Low', color: 'bg-primary' },
    { key: 'info', label: 'Info', color: 'bg-neutral-500' },
  ]

  const maxVal = Math.max(
    ...severities.map((s) => stats.vulnerabilities_by_severity[s.key] || 0),
    1
  )

  return (
    <div className="space-y-2">
      {severities.map((s) => {
        const val = stats.vulnerabilities_by_severity[s.key] || 0
        const pct = (val / maxVal) * 100
        return (
          <div key={s.key}>
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>{s.label}</span>
              <span>{val}</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-lg overflow-hidden">
              <div className={`h-full ${s.color} rounded-lg transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AIAnalysisPage() {
  const { scanId } = useParams<{ scanId: string }>()
  const [jobId, setJobId] = useState(scanId || '')
  const [inputJobId, setInputJobId] = useState(scanId || '')

  // Auto-load when scanId is in URL
  useEffect(() => {
    if (scanId && scanId !== jobId) {
      setJobId(scanId)
      setInputJobId(scanId)
    }
  }, [scanId])

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['ai-summary', jobId],
    queryFn: () => insightApi.executiveSummary(jobId),
    enabled: !!jobId,
    retry: false,
  })

  const { data: riskScore } = useQuery({
    queryKey: ['ai-risk-score', jobId],
    queryFn: () => insightApi.riskScore(jobId),
    enabled: !!jobId,
    retry: false,
  })

  const { data: insights } = useQuery({
    queryKey: ['ai-insights', jobId],
    queryFn: () => insightApi.list(jobId, { page_size: 50 }),
    enabled: !!jobId,
  })

  const { data: stats } = useQuery({
    queryKey: ['result-stats', jobId],
    queryFn: () => resultApi.getStats(jobId),
    enabled: !!jobId,
    retry: false,
  })

  const { data: attackVectors } = useQuery({
    queryKey: ['ai-vectors', jobId],
    queryFn: () => insightApi.attackVectors(jobId),
    enabled: !!jobId,
    retry: false,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-light text-neutral-50">AI Analysis</h1>
          <p className="text-neutral-400 text-sm mt-1">Automated intelligence and risk assessment</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputJobId}
          onChange={(e) => setInputJobId(e.target.value)}
          placeholder="Enter scan job ID..."
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 w-80"
        />
        <button
          onClick={() => setJobId(inputJobId)}
          className="px-4 py-2 bg-primary text-sidebar-bg hover:bg-primary/90 rounded-lg text-sm"
        >
          Load Analysis
        </button>
      </div>

      {!jobId ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-lg">Enter a scan job ID to view AI analysis</p>
        </div>
      ) : (
        <ErrorBoundary><div className="space-y-6">
          {/* Risk Score + Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 flex items-center justify-center">
              {riskScore ? (
                <RiskScoreGauge score={(riskScore as any)?.overall_score || 0} />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton variant="circular" width={128} height={128} />
                  <Skeleton variant="text" width={80} height={16} />
                </div>
              )}
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats ? (
                <>
                  <StatCard label="Subdomains" value={stats?.total_subdomains || 0} color="text-primary" />
                  <StatCard label="Live Hosts" value={stats?.live_subdomains || 0} color="text-neutral-300" />
                  <StatCard label="Endpoints" value={stats?.total_endpoints || 0} color="text-neutral-300" />
                  <StatCard label="Vulnerabilities" value={stats?.total_vulnerabilities || 0} color="text-neutral-300" />
                  <StatCard label="Critical" value={stats?.vulnerabilities_by_severity?.critical || 0} color="text-neutral-300" />
                  <StatCard label="High" value={stats?.vulnerabilities_by_severity?.high || 0} color="text-neutral-300" />
                </>
              ) : (
                <>
                  {['Subdomains', 'Live Hosts', 'Endpoints', 'Vulnerabilities', 'Critical', 'High'].map((label) => (
                    <div key={label} className="bg-neutral-800/50 rounded-lg p-4">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
                      <Skeleton variant="text" width={60} height={28} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Vulnerabilities by Severity */}
          {stats && (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-50 mb-4">Vulnerabilities by Severity</h2>
              <VsSeverityChart stats={stats} />
            </div>
          )}

          {/* Executive Summary */}
          {summaryLoading ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-50 mb-4">Executive Summary</h2>
              <div className="space-y-3">
                <Skeleton variant="text" count={4} />
              </div>
            </div>
          ) : summary ? (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-50 mb-4">Executive Summary</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {(summary as any).content || summary.summary || 'No summary available'}
                </p>
              </div>
            </div>
          ) : null}

          {/* Prioritized Recommendations / Attack Vectors */}
          {attackVectors && Array.isArray(attackVectors) && attackVectors.length > 0 && (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-50 mb-4">Prioritized Recommendations</h2>
              <div className="space-y-3">
                {attackVectors.map((v: any) => (
                  <div key={v.id} className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-neutral-50">{v.title}</h3>
                      <SeverityBadge severity={v.priority} />
                    </div>
                    <p className="text-sm text-neutral-400 line-clamp-2">{v.summary}</p>
                    {v.affected_assets && v.affected_assets.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {v.affected_assets.slice(0, 5).map((asset: string) => (
                          <span key={asset} className="px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-300">
                            {asset}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Insights */}
          {insights?.items && insights.items.length > 0 && (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-50 mb-4">All AI Insights ({insights.total})</h2>
              <div className="space-y-2">
                {insights.items.map((insight) => (
                  <div key={insight.id} className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-neutral-500 uppercase">{insight.type}</span>
                      <SeverityBadge severity={insight.priority} />
                      {insight.is_actionable && (
                        <span className="text-xs text-primary">Actionable</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-50">{insight.title}</p>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{insight.summary || insight.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </ErrorBoundary>
      )}
    </div>
  )
}