import { useState, useMemo } from 'react'
import { Skull, Search, AlertTriangle } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { tfAlerts as initialAlerts } from '@/data/mockData'
import { formatCurrency, formatRelativeTime } from '@/lib/formatters'
import { CaseStatusBadge } from '@/components/shared/Badge'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import StatCard from '@/components/shared/StatCard'

const matchTypeLabels: Record<string, string> = {
  watchlist: 'قائمة مراقبة',
  sanctions_list: 'قائمة عقوبات',
  behavioral_pattern: 'نمط سلوكي',
  network_analysis: 'تحليل شبكي',
}

export default function TF() {
  const stats = useOpsStore((s) => s.stats)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return initialAlerts.filter((a) => !query || a.customerName.includes(query) || a.alertNumber.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="تمويل الإرهاب" description="مراقبة التطابقات المحتملة مع قوائم مكافحة تمويل الإرهاب" />

      <div className="glass-card p-4 flex items-start gap-3 border-status-danger/20 bg-status-danger/[0.03]">
        <AlertTriangle className="h-4 w-4 text-status-danger mt-0.5 shrink-0" />
        <p className="text-xs text-white/50 leading-relaxed">
          هذا القسم حساس للغاية. جميع التطابقات تتطلب مراجعة يدوية إلزامية من ضابط الامتثال قبل اتخاذ أي إجراء على
          حساب العميل. البيانات المعروضة هنا وهمية بالكامل لأغراض العرض التوضيحي.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="إجمالي التطابقات" value={String(initialAlerts.length)} icon={Skull} tone="danger" />
        <StatCard label="حالات نشطة" value={String(stats.tfCases)} icon={Skull} tone="danger" />
        <StatCard label="بانتظار المراجعة" value={String(initialAlerts.filter((a) => a.status === 'open').length)} icon={AlertTriangle} tone="warning" />
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث برقم التنبيه أو اسم العميل..."
            className="input-field pr-10"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Skull} title="لا توجد تطابقات مرصودة" description="لا توجد نتائج مطابقة لبحثك الحالي" />
        ) : (
          <div className="divide-y divide-border-subtle">
            {filtered.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white/85">{a.customerName}</p>
                    <span className="text-xs font-mono text-white/30">{a.alertNumber}</span>
                  </div>
                  <p className="text-xs text-white/45">{a.descriptionAr}</p>
                  <p className="text-[11px] text-white/25 mt-1">
                    {matchTypeLabels[a.matchType]} · {formatRelativeTime(a.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-white/35">المبلغ</p>
                    <p className="text-sm font-medium text-white/80 tabular-nums">{formatCurrency(a.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/35">نسبة التطابق</p>
                    <p className="text-sm font-medium text-status-warning">{a.matchConfidence}%</p>
                  </div>
                  <CaseStatusBadge status={a.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
