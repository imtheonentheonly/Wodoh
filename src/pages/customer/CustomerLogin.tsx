import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Fingerprint, Delete, ArrowRight } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { cn } from '@/lib/cn'

// Served from /public — see Login.tsx for the same reference pattern.
const logo = '/Alinma-Bank-Symbol.png'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const login = useCustomerStore((s) => s.login)
  const customer = useCustomerStore((s) => s.customer)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleDigit(d: string) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length === 4) {
      setTimeout(() => {
        const ok = login(next)
        if (ok) {
          navigate('/customer/home')
        } else {
          setError(true)
          setShake(true)
          setTimeout(() => {
            setPin('')
            setShake(false)
          }, 500)
        }
      }, 200)
    }
  }

  function handleDelete() {
    setPin((p) => p.slice(0, -1))
    setError(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10">
      <button
        onClick={() => navigate('/login')}
        className="self-start flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70"
      >
        <ArrowRight className="h-4 w-4" /> العودة
      </button>

      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-alinma-navy/40 border border-alinma-gold/30 mb-5 p-2.5">
          <img src={logo} alt="بنك الإنماء" className="h-full w-full object-contain" />
        </div>
        <p className="text-sm text-white/40 mb-1">مرحباً بعودتك</p>
        <h1 className="text-xl font-bold text-white mb-8">{customer.fullNameAr}</h1>

        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-3 mb-4"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-4 w-4 rounded-full border-2 transition-colors',
                pin.length > i ? (error ? 'bg-status-danger border-status-danger' : 'bg-brand-accent border-brand-accent') : 'border-white/20'
              )}
            />
          ))}
        </motion.div>
        <p className="text-xs text-white/30 h-4">{error ? 'رمز مرور غير صحيح' : 'أدخل رمز المرور المكوّن من 4 أرقام'}</p>
        <p className="text-[10px] text-white/20 mt-1">تجريبي: 1234</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xl font-medium text-white/85"
            >
              {d}
            </button>
          ))}
          <button className="h-16 rounded-2xl flex items-center justify-center text-white/40">
            <Fingerprint className="h-6 w-6" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xl font-medium text-white/85"
          >
            0
          </button>
          <button onClick={handleDelete} className="h-16 rounded-2xl flex items-center justify-center text-white/40">
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
