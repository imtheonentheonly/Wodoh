import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  X,
  LayoutDashboard,
  BrainCircuit,
  Bell,
  ArrowLeftRight,
  ShieldAlert,
  Skull,
  FolderKanban,
  FileBarChart,
  ScrollText,
  UserCircle,
  Users,
  KeyRound,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/cn'

// Served from /public — see Login.tsx for the same reference pattern.
const logo = '/Alinma-Bank-Symbol.png'

const items = [
  { to: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/ai-dashboard', label: 'لوحة الذكاء الاصطناعي', icon: BrainCircuit },
  { to: '/notifications', label: 'الإشعارات', icon: Bell },
  { to: '/transactions', label: 'مراقبة المعاملات', icon: ArrowLeftRight },
  { to: '/aml', label: 'مكافحة غسل الأموال', icon: ShieldAlert },
  { to: '/tf', label: 'تمويل الإرهاب', icon: Skull },
  { to: '/cases', label: 'إدارة الحالات', icon: FolderKanban },
  { to: '/reports', label: 'التقارير', icon: FileBarChart },
  { to: '/audit-trail', label: 'سجل التدقيق', icon: ScrollText },
  { to: '/profile', label: 'الملف الشخصي', icon: UserCircle },
  { to: '/employees', label: 'إدارة الموظفين', icon: Users },
  { to: '/roles', label: 'الأدوار والصلاحيات', icon: KeyRound },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
  { to: '/help', label: 'مركز المساعدة', icon: HelpCircle },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} className="btn-ghost p-2" aria-label="فتح القائمة">
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-background-secondary border-l border-border-subtle overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 p-1">
                    <img src={logo} alt="بنك الإنماء" className="h-full w-full object-contain" />
                  </div>
                  <span className="font-display text-base font-bold">وضُـوح</span>
                </div>
                <button onClick={() => setOpen(false)} className="btn-ghost p-2" aria-label="إغلاق القائمة">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => cn(isActive ? 'sidebar-link-active' : 'sidebar-link')}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
