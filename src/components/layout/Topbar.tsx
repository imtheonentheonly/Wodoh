import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import MobileNav from './MobileNav'
import { useOpsStore } from '@/store/opsStore'
import { useAuthStore } from '@/store/authStore'
import { currentEmployee } from '@/data/mockData'
import { formatRelativeTime } from '@/lib/formatters'
import { notificationSeverityConfig } from '@/lib/riskUtils'
import { cn } from '@/lib/cn'

export default function Topbar() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifications = useOpsStore((s) => s.notifications)
  const unreadCount = useOpsStore((s) => s.getUnreadNotificationCount())
  const markRead = useOpsStore((s) => s.markNotificationRead)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/transactions?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-background/80 backdrop-blur-xl px-4 lg:px-8 py-4">
      <MobileNav />

      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث عن معاملة، حالة، أو عميل..."
          className="input-field pr-10"
        />
      </form>

      <button onClick={() => setSearchOpen(true)} className="md:hidden btn-ghost p-2 mr-auto" aria-label="بحث">
        <Search className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 mr-auto md:mr-0">
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v)
              setProfileOpen(false)
            }}
            className="btn-ghost p-2 relative"
            aria-label="الإشعارات"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-danger px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-80 sm:w-96 glass-card z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                    <p className="font-semibold text-sm">الإشعارات</p>
                    <button
                      onClick={() => {
                        useOpsStore.getState().markAllNotificationsRead()
                      }}
                      className="text-xs text-brand-accent hover:underline"
                    >
                      تعليم الكل كمقروء
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 && (
                      <p className="p-6 text-center text-sm text-white/40">لا توجد إشعارات</p>
                    )}
                    {notifications.slice(0, 8).map((n) => {
                      const conf = notificationSeverityConfig[n.severity]
                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            markRead(n.id)
                            if (n.linkedCaseId) navigate(`/cases/${n.linkedCaseId}`)
                            setNotifOpen(false)
                          }}
                          className={cn(
                            'w-full text-right flex gap-3 px-4 py-3 border-b border-border-subtle/50 hover:bg-white/[0.03] transition-colors',
                            !n.read && 'bg-white/[0.02]'
                          )}
                        >
                          <span className={cn('mt-1 h-2 w-2 rounded-full shrink-0', conf.bg, !n.read && conf.color.replace('text-', 'bg-'))} />
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-white/90 truncate">{n.titleAr}</span>
                            <span className="block text-xs text-white/40 mt-0.5 line-clamp-2">{n.messageAr}</span>
                            <span className="block text-[11px] text-white/25 mt-1">{formatRelativeTime(n.timestamp)}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => {
                      navigate('/notifications')
                      setNotifOpen(false)
                    }}
                    className="w-full py-2.5 text-center text-xs font-medium text-brand-accent hover:bg-white/[0.03] transition-colors"
                  >
                    عرض جميع الإشعارات
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((v) => !v)
              setNotifOpen(false)
            }}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-xs font-bold">
              {currentEmployee.avatarInitials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-white/85">{currentEmployee.fullNameAr}</span>
            <ChevronDown className="hidden sm:block h-4 w-4 text-white/40" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-56 glass-card z-50 overflow-hidden p-1.5"
                >
                  <p className="px-3 py-2 text-xs text-white/40 border-b border-border-subtle mb-1">
                    {currentEmployee.email}
                  </p>
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                  >
                    <UserCircle className="h-4 w-4" /> الملف الشخصي
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setProfileOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                  >
                    <Settings className="h-4 w-4" /> الإعدادات
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-status-danger hover:bg-status-danger/10"
                  >
                    <LogOut className="h-4 w-4" /> تسجيل الخروج
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 md:hidden"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Search className="absolute mr-3.5 h-4 w-4 text-white/30" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث..."
                className="input-field pr-10"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost px-3 py-2.5">
                إلغاء
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
