import { useState, useMemo } from 'react'
import { ScrollText, Search, Download } from 'lucide-react'
import { auditLog } from '@/data/mockData'
import { formatDateTime } from '@/lib/formatters'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { downloadCSV } from '@/lib/exportUtils'

const targetTypeLabels: Record<string, string> = {
  case: 'حالة',
  transaction: 'معاملة',
  employee: 'موظف',
  settings: 'إعدادات',
  report: 'تقرير',
}

export default function AuditTrail() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return auditLog.filter(
      (a) =>
        !query ||
        a.actorName.includes(query) ||
        a.actionAr.includes(query) ||
        a.targetId.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  function handleExport() {
    downloadCSV(
      `wodoh-audit-trail-${Date.now()}.csv`,
      ['الوقت', 'المستخدم', 'الإجراء', 'النوع', 'المعرف', 'عنوان IP', 'التفاصيل'],
      filtered.map((a) => [
        formatDateTime(a.timestamp),
        a.actorName,
        a.actionAr,
        targetTypeLabels[a.targetType],
        a.targetId,
        a.ipAddress,
        a.details,
      ])
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="سجل التدقيق"
        description="سجل كامل لجميع الإجراءات المنفذة على النظام"
        action={
          <button onClick={handleExport} className="btn-secondary">
            <Download className="h-4 w-4" /> تصدير السجل
          </button>
        }
      />

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالمستخدم، الإجراء، أو المعرف..."
            className="input-field pr-10"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={ScrollText} title="لا توجد سجلات مطابقة" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-right text-xs text-white/35 border-b border-border-subtle">
                  <th className="px-5 py-3 font-medium">الوقت</th>
                  <th className="px-5 py-3 font-medium">المستخدم</th>
                  <th className="px-5 py-3 font-medium">الإجراء</th>
                  <th className="px-5 py-3 font-medium">النوع</th>
                  <th className="px-5 py-3 font-medium">المعرف</th>
                  <th className="px-5 py-3 font-medium">عنوان IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="table-row">
                    <td className="px-5 py-3.5 text-white/50 text-xs">{formatDateTime(a.timestamp)}</td>
                    <td className="px-5 py-3.5 text-white/80">{a.actorName}</td>
                    <td className="px-5 py-3.5 text-white/70">{a.actionAr}</td>
                    <td className="px-5 py-3.5">
                      <span className="badge-neutral">{targetTypeLabels[a.targetType]}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/40">{a.targetId}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/30">{a.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
