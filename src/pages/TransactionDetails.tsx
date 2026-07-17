import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  AlertTriangle,
  Building2,
  Clock,
  Hash,
  Smartphone,
  FolderKanban,
  Snowflake,
} from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { formatCurrency, formatDateTime, maskAccountNumber } from '@/lib/formatters'
import { TransactionStatusBadge } from '@/components/shared/Badge'
import EmptyState from '@/components/shared/EmptyState'

const channelLabels: Record<string, string> = {
  mobile: 'تطبيق الجوال',
  internet_banking: 'الخدمات المصرفية عبر الإنترنت',
  branch: 'الفرع',
  atm: 'صراف آلي',
  core_system: 'النظام الأساسي',
}

export default function TransactionDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const transactions = useOpsStore((s) => s.transactions)
  const transaction = transactions.find((t) => t.id === id)

  if (!transaction) {
    return (
      <div className="glass-card">
        <EmptyState
          icon={AlertTriangle}
          title="المعاملة غير موجودة"
          description="لم يتم العثور على المعاملة المطلوبة"
          action={
            <button onClick={() => navigate('/transactions')} className="btn-primary">
              العودة إلى المعاملات
            </button>
          }
        />
      </div>
    )
  }

  const infoRows = [
    { label: 'رقم المرجع', value: transaction.reference, icon: Hash },
    { label: 'القناة', value: channelLabels[transaction.channel], icon: Smartphone },
    { label: 'الفرع', value: transaction.branch, icon: Building2 },
    { label: 'التوقيت', value: formatDateTime(transaction.timestamp), icon: Clock },
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <button onClick={() => navigate('/transactions')} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 w-fit">
        <ArrowRight className="h-4 w-4" /> العودة إلى المعاملات
      </button>

      {transaction.hasDiscrepancy && (
        <div className="glass-card border-status-danger/30 bg-status-danger/[0.04] p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-status-danger shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-status-danger">تم رصد فرق في هذه المعاملة</p>
            <p className="text-sm text-white/60 mt-1">
              الفرق بين المبلغ المعتمد والمبلغ المنفذ يبلغ{' '}
              <span className="font-semibold text-white">{formatCurrency(transaction.discrepancyAmount ?? 0)}</span>.
              تم فتح حالة تحقيق مرتبطة تلقائياً بواسطة الذكاء الاصطناعي.
            </p>
          </div>
          {transaction.linkedCaseId && (
            <button onClick={() => navigate(`/cases/${transaction.linkedCaseId}`)} className="btn-danger shrink-0 py-2 px-3 text-xs">
              <FolderKanban className="h-3.5 w-3.5" /> فتح الحالة
            </button>
          )}
        </div>
      )}

      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-white/40 mb-1">المبلغ المنفذ</p>
            <p className={`text-3xl font-bold tabular-nums ${transaction.hasDiscrepancy ? 'text-status-danger' : 'text-white'}`}>
              {formatCurrency(transaction.processedAmount)}
            </p>
            {transaction.hasDiscrepancy && (
              <p className="text-xs text-white/40 mt-1">
                المبلغ المطلوب: <span className="line-through">{formatCurrency(transaction.requestedAmount)}</span>
              </p>
            )}
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-5 border-y border-border-subtle">
          <div>
            <p className="text-xs text-white/40 mb-1.5">من الحساب</p>
            <p className="text-sm font-medium text-white/85">{transaction.fromName}</p>
            <p className="text-xs font-mono text-white/40 mt-0.5">{maskAccountNumber(transaction.fromAccount)}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1.5">إلى الحساب</p>
            <p className="text-sm font-medium text-white/85">{transaction.toName}</p>
            <p className="text-xs font-mono text-white/40 mt-0.5">{maskAccountNumber(transaction.toAccount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 shrink-0">
                <row.icon className="h-4 w-4 text-white/40" />
              </div>
              <div>
                <p className="text-xs text-white/35">{row.label}</p>
                <p className="text-sm text-white/80">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-border-subtle">
          <p className="text-xs text-white/40 mb-1.5">الوصف</p>
          <p className="text-sm text-white/70">{transaction.description}</p>
        </div>

        {transaction.status !== 'frozen' && transaction.status !== 'reversed' && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {transaction.linkedCaseId && (
              <button onClick={() => navigate(`/cases/${transaction.linkedCaseId}`)} className="btn-primary">
                <FolderKanban className="h-4 w-4" /> فتح حالة التحقيق
              </button>
            )}
            {transaction.hasDiscrepancy && (
              <button className="btn-secondary">
                <Snowflake className="h-4 w-4" /> تجميد المبلغ الزائد
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
