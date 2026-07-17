import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Smartphone } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

// Place Alinma-Bank-Symbol.png inside the /public folder (not src/assets).
// Vite serves files in /public from the site root, so we reference it by
// absolute path rather than importing it as a JS module.
const logo = '/Alinma-Bank-Symbol.png'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('m.alshahri@alinma-ops.internal')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const ok = login(email, password)
      setLoading(false)
      if (ok) {
        navigate('/')
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      }
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,162,75,0.06),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="بنك الإنماء" className="h-24 w-auto mb-4 object-contain" />
          <h1 className="font-display text-2xl font-bold text-white">وضُـوح</h1>
          <p className="text-xs text-brand-accent/90 font-medium mt-1">AI-Powered Operations Intelligence Platform</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-4 w-4 text-status-success" />
            <p className="text-xs text-white/50">بوابة موظفي العمليات — بنك الإنماء</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">البريد الإلكتروني الوظيفي</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pr-10"
                  placeholder="name@alinma-ops.internal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10 pl-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-status-danger bg-status-danger/10 border border-status-danger/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/50">
                <input type="checkbox" className="rounded border-border bg-background-secondary" defaultChecked />
                تذكرني
              </label>
              <button type="button" className="text-brand-accent hover:underline">
                نسيت كلمة المرور؟
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                <>
                  تسجيل الدخول <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border-subtle">
            <p className="text-[11px] text-white/30 text-center leading-relaxed">
              بتسجيل الدخول أنت توافق على سياسة الاستخدام الداخلي لنظام{' '}
              <span className="text-white/50">وضُـوح</span>. الدخول مخصص لموظفي العمليات المصرح لهم فقط.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/customer/login')}
          className="w-full mt-4 glass-panel rounded-2xl p-4 flex items-center gap-3 hover:border-brand-accent/30 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-alinma-gold/15">
            <Smartphone className="h-4 w-4 text-alinma-gold" />
          </div>
          <span className="text-right flex-1">
            <span className="block text-sm font-medium text-white/85">محاكاة تطبيق العميل</span>
            <span className="block text-[11px] text-white/40">جرّب سيناريو الخطأ التشغيلي كعميل — محمد حماد</span>
          </span>
          <ArrowLeft className="h-4 w-4 text-white/30 rtl-flip" />
        </button>

        <p className="text-center text-[11px] text-white/25 mt-6">
          نموذج أولي — هاكاثون بنك الإنماء. لا يمثل نظاماً مصرفياً فعلياً.
        </p>
      </motion.div>
    </div>
  )
}
