import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FolderKanban, LayoutGrid, List as ListIcon } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { formatCurrency, formatRelativeTime } from '@/lib/formatters'
import { RiskBadge, CaseStatusBadge } from '@/components/shared/Badge'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { categoryConfig } from '@/lib/riskUtils'
import { cn } from '@/lib/cn'
import type { CaseStatus, RiskLevel } from '@/types'

const statusFilters: { key: CaseStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'open', label: 'مفتوحة' },
  { key: 'investigating', label: 'قيد التحقيق' },
  { key: 'escalated', label: 'مصعّدة' },
  { key: 'frozen', label: 'مجمّدة' },
  { key: 'resolved', label: 'محلولة' },
]

const riskFilters: { key: RiskLevel | 'all'; label: string }[] = [
  { key: 'all', label: 'كل المخاطر' },
  { key: 'critical', label: 'حرج' },
  { key: 'high', label: 'مرتفع' },
  { key: 'medium', label: 'متوسط' },
  { key: 'low', label: 'منخفض' },
]

export default function Cases() {
  const navigate = useNavigate()
  const cases = useOpsStore((s) => s.cases)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    return [...cases]
      .filter((c) => {
        const matchesQuery =
          !query ||
          c.titleAr.includes(query) ||
          c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
          c.customerName.includes(query)
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter
        const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter
        return matchesQuery && matchesStatus && matchesRisk
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [cases, query, statusFilter, riskFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="إدارة الحالات" description={`${filtered.length} حالة مطابقة`} />

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث برقم الحالة، العنوان، أو اسم العميل..."
              className="input-field pr-10"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setView('grid')}
              className={cn('btn-secondary px-3', view === 'grid' && 'border-brand-accent/40 text-brand-accent')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('btn-secondary px-3', view === 'list' && 'border-brand-accent/40 text-brand-accent')}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-1">
          <div className="flex-1">
            <p className="text-xs text-white/40 mb-2">الحالة</p>
            <div className="flex flex-wrap gap-2">
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
          <div className="flex-1">
            <p className="text-xs text-white/40 mb-2">مستوى الخطر</p>
            <div className="flex flex-wrap gap-2">
              {riskFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setRiskFilter(f.key)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                    riskFilter === f.key
                      ? 'bg-brand-primary/20 text-brand-accent border-brand-accent/30'
                      : 'text-white/50 border-border hover:bg-white/5'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card">
          <EmptyState icon={FolderKanban} title="لا توجد حالات مطابقة" description="جرّب تعديل عوامل التصفية" />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/cases/${c.id}`)}
              className="glass-card p-5 text-right hover:border-brand-accent/40 hover:shadow-glow transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-white/35">{c.caseNumber}</span>
                <RiskBadge level={c.riskLevel} size="sm" />
              </div>
              <p className="text-sm font-semibold text-white/90 mb-1.5 line-clamp-2 min-h-[40px]">{c.titleAr}</p>
              <p className="text-xs text-white/40 mb-4">{categoryConfig[c.category].label} · {c.customerName}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/35">التأثير المالي</span>
                <span className="text-sm font-semibold text-status-danger tabular-nums">
                  {formatCurrency(c.capitalImpact)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <CaseStatusBadge status={c.status} size="sm" />
                <span className="text-[11px] text-white/30">{formatRelativeTime(c.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-right text-xs text-white/35 border-b border-border-subtle">
                  <th className="px-5 py-3 font-medium">رقم الحالة</th>
                  <th className="px-5 py-3 font-medium">العنوان</th>
                  <th className="px-5 py-3 font-medium">العميل</th>
                  <th className="px-5 py-3 font-medium">التأثير المالي</th>
                  <th className="px-5 py-3 font-medium">الخطر</th>
                  <th className="px-5 py-3 font-medium">الحالة</th>
                  <th className="px-5 py-3 font-medium">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="table-row cursor-pointer" onClick={() => navigate(`/cases/${c.id}`)}>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/60">{c.caseNumber}</td>
                    <td className="px-5 py-3.5 text-white/85 max-w-xs truncate">{c.titleAr}</td>
                    <td className="px-5 py-3.5 text-white/60">{c.customerName}</td>
                    <td className="px-5 py-3.5 tabular-nums text-status-danger font-medium">
                      {formatCurrency(c.capitalImpact)}
                    </td>
                    <td className="px-5 py-3.5">
                      <RiskBadge level={c.riskLevel} size="sm" />
                    </td>
                    <td className="px-5 py-3.5">
                      <CaseStatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-xs">{formatRelativeTime(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
