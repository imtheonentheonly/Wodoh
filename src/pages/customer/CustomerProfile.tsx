import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Phone, MapPin, CreditCard, LogOut, ChevronLeft, Lock, Bell, Globe } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { maskAccountNumber } from '@/lib/formatters'

export default function CustomerProfile() {
  const navigate = useNavigate()
  const customer = useCustomerStore((s) => s.customer)
  const logout = useCustomerStore((s) => s.logout)

  const infoRows = [
    { label: 'رقم الحساب', value: customer.accountNumber, icon: CreditCard },
    { label: 'الآيبان', value: maskAccountNumber(customer.iban), icon: CreditCard },
    { label: 'الجوال', value: customer.phone, icon: Phone },
    { label: 'الفرع', value: customer.branch, icon: MapPin },
  ]

  const settingsRows = [
    { label: 'الأمان وكلمة المرور', icon: Lock },
    { label: 'إعدادات الإشعارات', icon: Bell },
    { label: 'اللغة', icon: Globe },
  ]

  return (
    <div className="px-5 pt-6 pb-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="btn-ghost p-1.5">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">حسابي</h1>
      </div>

      <div className="glass-card p-6 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-lg font-bold mb-3">
          {customer.fullNameAr[0]}
        </div>
        <p className="text-base font-bold text-white">{customer.fullNameAr}</p>
        <p className="text-xs text-white/35 mt-0.5">{customer.fullNameEn}</p>
        <span className="badge-success mt-3">
          <ShieldCheck className="h-3 w-3" /> هوية موثقة
        </span>
      </div>

      <div className="glass-card divide-y divide-border-subtle overflow-hidden">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 px-4 py-3.5">
            <row.icon className="h-4 w-4 text-white/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/35">{row.label}</p>
              <p className="text-sm text-white/80 font-mono">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card divide-y divide-border-subtle overflow-hidden">
        {settingsRows.map((row) => (
          <button key={row.label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02]">
            <row.icon className="h-4 w-4 text-white/30 shrink-0" />
            <span className="flex-1 text-right text-sm text-white/80">{row.label}</span>
            <ChevronLeft className="h-4 w-4 text-white/20" />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-status-danger/25 bg-status-danger/10 py-3 text-sm font-medium text-status-danger"
      >
        <LogOut className="h-4 w-4" /> تسجيل الخروج
      </button>

      <p className="text-[10px] text-white/20 text-center">وضُـوح — محاكاة تطبيق العميل. بيانات وهمية بالكامل.</p>
    </div>
  )
}
