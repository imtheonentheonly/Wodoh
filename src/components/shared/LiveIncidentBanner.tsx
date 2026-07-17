import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowUpLeft, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOpsStore } from '@/store/opsStore'

export default function LiveIncidentBanner() {
  const navigate = useNavigate()
  const liveIncidentActive = useOpsStore((s) => s.liveIncidentActive)
  const dismiss = useOpsStore((s) => s.dismissLiveIncidentBanner)
  const cases = useOpsStore((s) => s.cases)
  const liveCase = cases.find((c) => c.id === 'case-live-145')

  return (
    <AnimatePresence>
      {liveIncidentActive && liveCase && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-status-danger/30 bg-status-danger/10"
        >
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 shrink-0">
              <span className="live-dot" />
              <AlertTriangle className="h-4 w-4 text-status-danger" />
            </div>
            <p className="text-sm text-white/90 flex-1 min-w-0">
              <span className="font-semibold text-status-danger">تنبيه مباشر:</span> تم رصد دفعة مضاعفة بمبلغ 100,000
              ر.س من حساب محمد حماد — بمستوى ثقة 98%.
            </p>
            <button
              onClick={() => navigate(`/cases/${liveCase.id}`)}
              className="btn-danger py-1.5 px-3 text-xs shrink-0"
            >
              فتح الحالة <ArrowUpLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={dismiss} className="btn-ghost p-1.5 shrink-0" aria-label="إغلاق">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
