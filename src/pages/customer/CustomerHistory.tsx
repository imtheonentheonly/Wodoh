import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpLeft, AlertTriangle, History } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { formatCurrency, formatDateTime } from '@/lib/formatters'
import EmptyState from '@/components/shared/EmptyState'

export default function CustomerHistory() {
  const navigate = useNavigate()
  const history = useCustomerStore((s) => s.history)

  return (
    <div className="px-5 pt-6 pb-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="btn-ghost p-1.5">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">سجل العمليات</h1>
      </div>

      {history.length === 0 ? (
        <EmptyState icon={History} title="لا توجد عمليات سابقة" />
      ) : (
        <div className="glass-card divide-y divide-border-subtle overflow-hidden">
          {history.map((h) => (
            <div key={h.id} className="flex items-start gap-3 px-4 py-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  h.status === 'error_detected' ? 'bg-status-danger/15' : 'bg-status-success/10'
                }`}
              >
                {h.status === 'error_detected' ? (
                  <AlertTriangle className="h-4 w-4 text-status-danger" />
                ) : (
                  <ArrowUpLeft className="h-4 w-4 text-status-success" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white/85">{h.toName}</p>
                  <p className="text-sm font-semibold text-white/85 tabular-nums shrink-0">
                    -{formatCurrency(h.amount)}
                  </p>
                </div>
                <p className="text-[11px] text-white/35 mt-0.5">{formatDateTime(h.timestamp)}</p>
                {h.note && (
                  <p className="text-xs text-status-warning bg-status-warning/10 border border-status-warning/20 rounded-lg px-2.5 py-1.5 mt-2 leading-relaxed">
                    {h.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
