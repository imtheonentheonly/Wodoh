import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowUpLeft, ArrowDownLeft, Send, Receipt, PiggyBank, Bell, Building2 } from 'lucide-react'
import { useState } from 'react'
import { useCustomerStore } from '@/store/customerStore'
import { useOpsStore } from '@/store/opsStore'
import { formatCurrency, formatDateTime, maskAccountNumber } from '@/lib/formatters'

export default function CustomerHome() {
  const navigate = useNavigate()
  const customer = useCustomerStore((s) => s.customer)
  const balance = useCustomerStore((s) => s.balance)
  const history = useCustomerStore((s) => s.history)
  const notifications = useOpsStore((s) => s.notifications)
  const [hideBalance, setHideBalance] = useState(false)

  const customerNotifCount = notifications.filter((n) => !n.read && n.category === 'duplicate_payment').length

  const quickActions = [
    { label: 'تحويل', icon: Send, action: () => navigate('/customer/transfer') },
    { label: 'الفواتير', icon: Receipt, action: () => navigate('/customer/history') },
    { label: 'الادخار', icon: PiggyBank, action: () => navigate('/customer/history') },
  ]

  return (
    <div className="px-5 pt-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">مرحباً بك</p>
          <h1 className="text-lg font-bold text-white">{customer.fullNameAr}</h1>
        </div>
        <button onClick={() => navigate('/customer/notifications')} className="relative btn-ghost p-2.5 rounded-full bg-white/5">
          <Bell className="h-5 w-5" />
          {customerNotifCount > 0 && (
            <span className="absolute top-1 left-1 h-2.5 w-2.5 rounded-full bg-status-danger" />
          )}
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-alinma-navy via-[#0F1F4A] to-brand-primary/60 p-6 relative overflow-hidden shadow-card">
        <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-alinma-gold/10 blur-2xl" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-alinma-gold" />
            <span className="text-xs text-white/60 font-medium">بنك الإنماء</span>
          </div>
          <span className="text-[10px] text-white/40 tracking-wider">•••• {customer.accountNumber.slice(-4)}</span>
        </div>
        <p className="text-xs text-white/50 mb-1">الرصيد المتاح</p>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-3xl font-bold text-white tabular-nums">
            {hideBalance ? '••••••' : formatCurrency(balance)}
          </p>
          <button onClick={() => setHideBalance((v) => !v)} className="text-white/40 hover:text-white/70">
            {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[11px] text-white/30 font-mono">{maskAccountNumber(customer.iban)}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            onClick={qa.action}
            className="glass-card p-4 flex flex-col items-center gap-2 hover:border-brand-accent/30 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
              <qa.icon className="h-4.5 w-4.5 text-brand-accent" />
            </div>
            <span className="text-xs font-medium text-white/70">{qa.label}</span>
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/85">آخر العمليات</h3>
          <button onClick={() => navigate('/customer/history')} className="text-xs text-brand-accent">
            عرض الكل
          </button>
        </div>
        <div className="glass-card divide-y divide-border-subtle overflow-hidden">
          {history.slice(0, 4).map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-3.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  h.status === 'error_detected' ? 'bg-status-danger/15' : 'bg-status-success/10'
                }`}
              >
                {h.status === 'error_detected' ? (
                  <ArrowUpLeft className="h-4 w-4 text-status-danger" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-status-success" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85 truncate">{h.toName}</p>
                <p className="text-[11px] text-white/35">{formatDateTime(h.timestamp)}</p>
              </div>
              <p className="text-sm font-medium text-white/85 tabular-nums shrink-0">-{formatCurrency(h.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
