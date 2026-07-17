import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bell, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { formatRelativeTime } from '@/lib/formatters'
import EmptyState from '@/components/shared/EmptyState'

export default function CustomerNotifications() {
  const navigate = useNavigate()
  const history = useCustomerStore((s) => s.history)
  const errorTxns = history.filter((h) => h.status === 'error_detected')

  const notifs = [
    ...errorTxns.map((h) => ({
      id: h.id,
      icon: AlertTriangle,
      tone: 'danger' as const,
      title: 'تم رصد خطأ في معالجة تحويلك',
      message: `يقوم فريق العمليات بمراجعة التحويل إلى ${h.toName} حالياً.`,
      timestamp: h.timestamp,
    })),
    {
      id: 'welcome',
      icon: CheckCircle2,
      tone: 'success' as const,
      title: 'مرحباً بك في تطبيق بنك الإنماء',
      message: 'حسابك جاهز للاستخدام. استمتع بتجربة مصرفية آمنة وسلسة.',
      timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ]

  return (
    <div className="px-5 pt-6 pb-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="btn-ghost p-1.5">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">الإشعارات</h1>
      </div>

      {notifs.length === 0 ? (
        <EmptyState icon={Bell} title="لا توجد إشعارات" />
      ) : (
        <div className="glass-card divide-y divide-border-subtle overflow-hidden">
          {notifs.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-4 py-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  n.tone === 'danger' ? 'bg-status-danger/15' : 'bg-status-success/10'
                }`}
              >
                <n.icon className={`h-4 w-4 ${n.tone === 'danger' ? 'text-status-danger' : 'text-status-success'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/85">{n.title}</p>
                <p className="text-xs text-white/45 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-[11px] text-white/25 mt-1.5">{formatRelativeTime(n.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
