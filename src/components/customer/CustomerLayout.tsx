import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Home, ArrowLeftRight, History, User, Bell } from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/customer/home', label: 'الرئيسية', icon: Home },
  { to: '/customer/transfer', label: 'تحويل', icon: ArrowLeftRight },
  { to: '/customer/history', label: 'السجل', icon: History },
  { to: '/customer/notifications', label: 'الإشعارات', icon: Bell },
  { to: '/customer/profile', label: 'حسابي', icon: User },
]

export default function CustomerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useCustomerStore((s) => s.isAuthenticated)

  if (!isAuthenticated && location.pathname !== '/customer/login') {
    return <Navigate to="/customer/login" replace />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <div className="flex-1 max-w-md mx-auto w-full pb-24">
        <Outlet />
      </div>

      {isAuthenticated && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-background-secondary/90 backdrop-blur-xl border-t border-border-subtle">
          <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2.5">
            {navItems.map((item) => {
              const active = location.pathname === item.to
              return (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]',
                    active ? 'text-brand-accent' : 'text-white/40'
                  )}
                >
                  <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
