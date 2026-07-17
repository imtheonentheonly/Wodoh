import { useState } from 'react'
import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { customers } from '@/data/mockData'
import { formatCurrency } from '@/lib/formatters'

interface LocationState {
  recipientId: string
  amount: number
  note: string
}

type Step = 'review' | 'processing' | 'success' | 'error_detected'

export default function CustomerTransferConfirm() {
  const location = useLocation()
  const navigate = useNavigate()
  const transfer = useCustomerStore((s) => s.transfer)
  const state = location.state as LocationState | undefined

  const [step, setStep] = useState<Step>('review')

  if (!state) {
    return <Navigate to="/customer/transfer" replace />
  }

  const recipient = customers.find((c) => c.id === state.recipientId)!

  async function handleConfirm() {
    setStep('processing')
    await transfer(recipient.accountNumber, recipient.fullNameAr, state.amount)
    const hadError = useCustomerStore.getState().lastTransferError
    setStep(hadError ? 'error_detected' : 'success')
  }

  return (
    <div className="px-5 pt-6 pb-6 space-y-6 animate-fade-in">
      {step === 'review' && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn-ghost p-1.5">
              <ArrowRight className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-white">مراجعة التحويل</h1>
          </div>

          <div className="glass-card p-6 text-center">
            <p className="text-xs text-white/40 mb-2">أنت على وشك تحويل</p>
            <p className="text-3xl font-bold text-white tabular-nums mb-1">{formatCurrency(state.amount)}</p>
            <p className="text-sm text-white/50">إلى {recipient.fullNameAr}</p>
          </div>

          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">المستلم</span>
              <span className="text-white/85">{recipient.fullNameAr}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">رقم الحساب</span>
              <span className="text-white/85 font-mono">{recipient.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">المبلغ</span>
              <span className="text-white/85 tabular-nums">{formatCurrency(state.amount)}</span>
            </div>
            {state.note && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">ملاحظة</span>
                <span className="text-white/85">{state.note}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm pt-3 border-t border-border-subtle">
              <span className="text-white/40">الرسوم</span>
              <span className="text-status-success">مجاناً</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            هذه العملية محمية ومشفّرة من طرف إلى طرف
          </div>

          <button onClick={handleConfirm} className="btn-primary w-full py-3.5">
            تأكيد وتحويل
          </button>
        </>
      )}

      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="h-10 w-10 text-brand-accent animate-spin mb-5" />
          <p className="text-sm text-white/70 font-medium">جاري تنفيذ التحويل...</p>
          <p className="text-xs text-white/35 mt-1.5">يرجى الانتظار، لا تغلق التطبيق</p>
        </div>
      )}

      {step === 'success' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-success/15 mb-5">
            <CheckCircle2 className="h-8 w-8 text-status-success" />
          </div>
          <p className="text-lg font-bold text-white mb-1">تم التحويل بنجاح</p>
          <p className="text-sm text-white/50 mb-8">
            تم تحويل {formatCurrency(state.amount)} إلى {recipient.fullNameAr}
          </p>
          <button onClick={() => navigate('/customer/home')} className="btn-primary w-full max-w-xs">
            العودة إلى الرئيسية
          </button>
        </div>
      )}

      {step === 'error_detected' && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-danger/15 mb-5">
            <AlertTriangle className="h-8 w-8 text-status-danger animate-pulse" />
          </div>
          <p className="text-lg font-bold text-white mb-1">تم رصد خطأ في المعالجة</p>
          <p className="text-sm text-white/50 mb-5 leading-relaxed max-w-xs">
            حدث خطأ تقني أثناء معالجة التحويل. تم تنبيه فريق العمليات تلقائياً عبر نظام{' '}
            <span className="text-white/70 font-medium">وضُـوح</span> للذكاء الاصطناعي، وجارٍ مراجعة الحالة الآن.
          </p>
          <div className="glass-card border-status-warning/25 bg-status-warning/[0.04] p-4 mb-8 w-full max-w-xs text-right">
            <p className="text-xs text-white/40 mb-1">المبلغ المطلوب</p>
            <p className="text-sm text-white/85 mb-2">{formatCurrency(state.amount)}</p>
            <p className="text-xs text-white/40 mb-1">حالة المعاملة</p>
            <p className="text-sm text-status-warning">قيد المراجعة من فريق العمليات</p>
          </div>
          <button onClick={() => navigate('/customer/home')} className="btn-secondary w-full max-w-xs">
            فهمت، العودة إلى الرئيسية
          </button>
        </div>
      )}
    </div>
  )
}
