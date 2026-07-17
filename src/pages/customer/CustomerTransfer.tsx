import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, User, Wallet, ChevronDown } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { customers } from '@/data/mockData'
import { formatCurrency } from '@/lib/formatters'

const recipients = customers.filter((c) => c.id !== 'cust-001')

export default function CustomerTransfer() {
  const navigate = useNavigate()
  const balance = useCustomerStore((s) => s.balance)
  const [recipientId, setRecipientId] = useState(recipients[0].id)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [error, setError] = useState('')

  const recipient = recipients.find((r) => r.id === recipientId)!

  function handleContinue() {
    const numAmount = Number(amount)
    if (!amount || numAmount <= 0) {
      setError('يرجى إدخال مبلغ صحيح')
      return
    }
    if (numAmount > balance) {
      setError('الرصيد غير كافٍ لإتمام هذا التحويل')
      return
    }
    setError('')
    navigate('/customer/transfer/confirm', {
      state: { recipientId, amount: numAmount, note },
    })
  }

  return (
    <div className="px-5 pt-6 pb-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="btn-ghost p-1.5">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">تحويل أموال</h1>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">إلى</label>
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="w-full glass-card p-4 flex items-center gap-3 text-right"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/10 shrink-0">
            <User className="h-4.5 w-4.5 text-brand-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/90">{recipient.fullNameAr}</p>
            <p className="text-xs text-white/35 font-mono">{recipient.accountNumber}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-white/30" />
        </button>

        {pickerOpen && (
          <div className="mt-2 glass-card divide-y divide-border-subtle overflow-hidden">
            {recipients.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRecipientId(r.id)
                  setPickerOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-white/[0.03]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-bold shrink-0">
                  {r.fullNameAr[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/85">{r.fullNameAr}</p>
                  <p className="text-[11px] text-white/35 font-mono">{r.accountNumber}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">المبلغ</label>
        <div className="glass-card p-4 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError('')
            }}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/20"
          />
          <span className="text-sm text-white/40">ر.س</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Wallet className="h-3.5 w-3.5 text-white/30" />
          <p className="text-xs text-white/35">الرصيد المتاح: {formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[100000, 5000, 1000, 500].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(String(v))}
            className="flex-1 rounded-xl border border-border py-2 text-xs font-medium text-white/60 hover:bg-white/5"
          >
            {formatCurrency(v, { compact: true })}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">ملاحظة (اختياري)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="سبب التحويل..."
          className="input-field"
        />
      </div>

      {error && (
        <p className="text-xs text-status-danger bg-status-danger/10 border border-status-danger/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button onClick={handleContinue} className="btn-primary w-full py-3.5">
        متابعة
      </button>

      <p className="text-[10px] text-white/25 text-center leading-relaxed">
        تلميح للعرض التوضيحي: حوّل <span className="text-white/50">100,000 ر.س</span> إلى{' '}
        <span className="text-white/50">أحمد فهد</span> لمحاكاة خطأ النظام التشغيلي.
      </p>
    </div>
  )
}
