import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Filter, Download, ArrowLeftRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { formatCurrency, formatDateTime } from '@/lib/formatters'
import { TransactionStatusBadge } from '@/components/shared/Badge'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { cn } from '@/lib/cn'
import type { TransactionStatus, TransactionType } from '@/types'

const statusFilters: { key: TransactionStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'flagged', label: 'مرصودة' },
  { key: 'completed', label: 'مكتملة' },
  { key: 'pending', label: 'معلقة' },
  { key: 'frozen', label: 'مجمّدة' },
  { key: 'reversed', label: 'معكوسة' },
]

const typeFilters: { key: TransactionType | 'all'; label: string }[] = [
  { key: 'all', label: 'كل الأنواع' },
  { key: 'transfer', label: 'تحويل' },
  { key: 'deposit', label: 'إيداع' },
  { key: 'withdrawal', label: 'سحب' },
  { key: 'payment', label: 'دفع' },
  { key: 'reconciliation', label: 'تسوية' },
]

const PAGE_SIZE = 8

export default function Transactions() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const transactions = useOpsStore((s) => s.transactions)

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [discrepancyOnly, setDiscrepancyOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQuery =
        !query ||
        t.reference.toLowerCase().includes(query.toLowerCase()) ||
        t.fromName.includes(query) ||
        t.toName.includes(query) ||
        t.fromAccount.includes(query) ||
        t.toAccount.includes(query)
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      const matchesType = typeFilter === 'all' || t.type === typeFilter
      const matchesDiscrepancy = !discrepancyOnly || t.hasDiscrepancy
      return matchesQuery && matchesStatus && matchesType && matchesDiscrepancy
    })
  }, [transactions, query, statusFilter, typeFilter, discrepancyOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function exportCSV() {
    const headers = ['المرجع', 'من', 'إلى', 'المبلغ المطلوب', 'المبلغ المنفذ', 'الحالة', 'الوقت']
    const rows = filtered.map((t) => [
      t.reference,
      t.fromName,
      t.toName,
      t.requestedAmount,
      t.processedAmount,
      t.status,
      formatDateTime(t.timestamp),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wodoh-transactions-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="مراقبة المعاملات"
        description={`${filtered.length} معاملة مطابقة للبحث`}
        action={
          <button onClick={exportCSV} className="btn-secondary">
            <Download className="h-4 w-4" /> تصدير CSV
          </button>
        }
      />

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="بحث بالمرجع، اسم العميل، أو رقم الحساب..."
              className="input-field pr-10"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button onClick={() => setFiltersOpen((v) => !v)} className="btn-secondary sm:w-auto">
            <Filter className="h-4 w-4" /> الفلاتر
          </button>
          <label className="flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-white/70 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={discrepancyOnly}
              onChange={(e) => {
                setDiscrepancyOnly(e.target.checked)
                setPage(1)
              }}
              className="rounded border-border bg-background-secondary"
            />
            الفروقات فقط
          </label>
        </div>

        {filtersOpen && (
          <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-border-subtle">
            <div className="flex-1">
              <p className="text-xs text-white/40 mb-2">الحالة</p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setStatusFilter(f.key)
                      setPage(1)
                    }}
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
              <p className="text-xs text-white/40 mb-2">النوع</p>
              <div className="flex flex-wrap gap-2">
                {typeFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setTypeFilter(f.key)
                      setPage(1)
                    }}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                      typeFilter === f.key
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
        )}
      </div>

      <div className="glass-card overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState icon={ArrowLeftRight} title="لا توجد معاملات مطابقة" description="جرّب تعديل عوامل التصفية أو مصطلح البحث" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-right text-xs text-white/35 border-b border-border-subtle">
                    <th className="px-5 py-3 font-medium">المرجع</th>
                    <th className="px-5 py-3 font-medium">من</th>
                    <th className="px-5 py-3 font-medium">إلى</th>
                    <th className="px-5 py-3 font-medium">المطلوب</th>
                    <th className="px-5 py-3 font-medium">المنفذ</th>
                    <th className="px-5 py-3 font-medium">الحالة</th>
                    <th className="px-5 py-3 font-medium">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((t) => (
                    <tr key={t.id} className="table-row cursor-pointer" onClick={() => navigate(`/transactions/${t.id}`)}>
                      <td className="px-5 py-3.5 font-mono text-xs text-white/60">{t.reference}</td>
                      <td className="px-5 py-3.5 text-white/75">{t.fromName}</td>
                      <td className="px-5 py-3.5 text-white/75">{t.toName}</td>
                      <td className="px-5 py-3.5 tabular-nums text-white/60">{formatCurrency(t.requestedAmount)}</td>
                      <td
                        className={cn(
                          'px-5 py-3.5 font-medium tabular-nums',
                          t.hasDiscrepancy ? 'text-status-danger' : 'text-white/85'
                        )}
                      >
                        {formatCurrency(t.processedAmount)}
                        {t.hasDiscrepancy && <span className="block text-[10px] text-status-danger/70">فرق مرصود</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <TransactionStatusBadge status={t.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-white/40 text-xs">{formatDateTime(t.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-subtle">
              <p className="text-xs text-white/35">
                صفحة {page} من {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-ghost p-1.5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-ghost p-1.5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
