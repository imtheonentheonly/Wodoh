import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <Compass className="h-12 w-12 text-white/20 mb-5" />
      <h1 className="text-2xl font-bold text-white mb-2">404 — الصفحة غير موجودة</h1>
      <p className="text-sm text-white/40 mb-6 max-w-sm">
        الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
      </p>
      <button onClick={() => navigate('/')} className="btn-primary">
        العودة إلى لوحة التحكم
      </button>
    </div>
  )
}
