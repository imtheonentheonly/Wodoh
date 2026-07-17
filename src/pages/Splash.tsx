import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Served from /public — see Login.tsx for the same reference pattern.
const logo = '/Alinma-Bank-Symbol.png'

export default function Splash() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 4
      })
    }, 45)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => navigate('/login'), 400)
      return () => clearTimeout(t)
    }
  }, [progress, navigate])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 24px rgba(59,130,246,0)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 mb-6 p-3"
        >
          <img src={logo} alt="بنك الإنماء" className="h-full w-full object-contain" />
        </motion.div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">وضُـوح</h1>
        <p className="text-sm sm:text-base text-white/50 font-medium mb-1">Wodoh</p>
        <p className="text-xs sm:text-sm text-brand-accent/90 font-medium tracking-wide mb-10">
          AI-Powered Operations Intelligence Platform
        </p>

        <div className="w-56 sm:w-64 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-white/30 mt-3 tracking-wide">جاري تحميل بيئة العمليات الآمنة...</p>
      </motion.div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="h-1.5 w-1.5 rounded-full bg-alinma-gold" />
          بنك الإنماء — Bank Alinma
        </div>
        <p className="text-[10px] text-white/20">نموذج أولي تجريبي لأغراض الهاكاثون — ليس نظاماً تشغيلياً فعلياً</p>
      </div>
    </div>
  )
}
