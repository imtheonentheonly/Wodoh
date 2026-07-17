import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Search, Gauge } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { amlAlerts as initialAlerts } from '@/data/mockData'
import { formatCurrency, formatRelativeTime } from '@/lib/formatters'
import { CaseStatusBadge } from '@/components/shared/Badge'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import StatCard from '@/components/shared/StatCard'
import { cn } from '@/lib/cn'
import type { CaseStatus } from '@/types'

const alertTypeLabels: Record<string, string> = {
  structuring: 'تجزئة المعاملات',
  unusual_pattern: 'نمط غير اعتيادي',
  high_risk_country: 'دولة عالية المخاطر',
  pep_match: 'تطابق شخصية سياسية',
  sanctions_screening: 'فحص العقوبات',
  velocity: 'سرعة معاملات غير اعتيادية',
}

const statusFilters: { key: CaseStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'open', label: 'مفتوحة' },
  { key: 'investigating', label: 'قيد التحقيق' },
  { key: 'resolved', label: 'محلولة' },
]

function riskTone(score: number) {
  if (score >= 75) return { label: 'حرج', color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' }
  if (score >= 50) return { label: 'مرتفع', color: 'text-status-warning', bg: 'bg-status-warning/15', border: 'border-status-warning/25' }
  return { label: 'متوسط', color: 'text-brand-accent', bg: 'bg-brand-accent/15', border: 'border-brand-accent/25' }
}

export default function AML() {
  const navigate = useNavigate()
  const stats = useOpsStore((s) => s.stats)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return initialAlerts.filter((a) => {
      const matchesQuery = !query || a.customerName.includes(query) || a.alertNumber.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  const avgRiskScore = Math.round(initialAlerts.reduce((s, a) => s + a.riskScore, 0) / (initialAlerts.length || 1))

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="مكافحة غسل الأموال" description="مراقبة وتحليل التنبيهات المتعلقة بغسل الأموال" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="إجمالي التنبيهات" value={String(initialAlerts.length)} icon={ShieldAlert} tone="warning" />
        <StatCard label="حالات مفتوحة" value={String(stats.amlCases)} icon={ShieldAlert} tone="danger" />
        <StatCard label="متوسط درجة الخطر" value={`${avgRiskScore}`} icon={Gauge} />
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث برقم التنبيه أو اسم العميل..."
            className="input-field pr-10"
          />
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                statusFilter === f.key
                  ? 'bg-brand-primary/20 text-brand-accent border-brand-accent/30'
                  : 'text-white/50 border-border hover:bg-white/5'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={ShieldAlert} title="لا توجد تنبيهات مطابقة" />
        ) : (
          <div className="divide-y divide-border-subtle">
            {filtered.map((a) => {
              const tone = riskTone(a.riskScore)
              return (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white/85">{a.customerName}</p>
                      <span className="text-xs font-mono text-white/30">{a.alertNumber}</span>
                    </div>
                    <p className="text-xs text-white/45">{a.descriptionAr}</p>
                    <p className="text-[11px] text-white/25 mt-1">
                      {alertTypeLabels[a.alertType]} · {formatRelativeTime(a.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-white/35">المبلغ</p>
                      <p className="text-sm font-medium text-white/80 tabular-nums">{formatCurrency(a.amount)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn('badge', tone.bg, tone.color, tone.border, 'border')}>{tone.label}</span>
                      <span className="text-[11px] text-white/30">{a.riskScore}/100</span>
                    </div>
                    <CaseStatusBadge status={a.status} size="sm" />
                    <button onClick={() => navigate('/cases')} className="btn-secondary py-1.5 px-3 text-xs">
                      مراجعة
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
