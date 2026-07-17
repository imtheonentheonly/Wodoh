import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Filter } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { formatRelativeTime } from '@/lib/formatters'
import { notificationSeverityConfig } from '@/lib/riskUtils'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { cn } from '@/lib/cn'
import type { NotificationSeverity } from '@/types'

const filters: { key: NotificationSeverity | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'critical', label: 'حرجة' },
  { key: 'warning', label: 'تحذير' },
  { key: 'info', label: 'معلومات' },
  { key: 'success', label: 'إيجابي' },
]

export default function Notifications() {
  const navigate = useNavigate()
  const notifications = useOpsStore((s) => s.notifications)
  const markRead = useOpsStore((s) => s.markNotificationRead)
  const markAllRead = useOpsStore((s) => s.markAllNotificationsRead)
  const [activeFilter, setActiveFilter] = useState<NotificationSeverity | 'all'>('all')

  const filtered = notifications.filter((n) => activeFilter === 'all' || n.severity === activeFilter)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="الإشعارات"
        description="جميع التنبيهات والإشعارات الحية من نظام وضُـوح"
        action={
          <button onClick={markAllRead} className="btn-secondary">
            <CheckCheck className="h-4 w-4" /> تعليم الكل كمقروء
          </button>
        }
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-white/30 shrink-0" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border',
              activeFilter === f.key
                ? 'bg-brand-primary/20 text-brand-accent border-brand-accent/30'
                : 'bg-transparent text-white/50 border-border hover:bg-white/5'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Bell} title="لا توجد إشعارات" description="لا توجد إشعارات ضمن هذا التصنيف حالياً" />
        ) : (
          <div className="divide-y divide-border-subtle">
            {filtered.map((n) => {
              const conf = notificationSeverityConfig[n.severity]
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead(n.id)
                    if (n.linkedCaseId) navigate(`/cases/${n.linkedCaseId}`)
                  }}
                  className={cn(
                    'w-full text-right flex gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors',
                    !n.read && 'bg-white/[0.015]'
                  )}
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', conf.bg)}>
                    <Bell className={cn('h-4 w-4', conf.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white/90">{n.titleAr}</p>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0" />}
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">{n.messageAr}</p>
                    <p className="text-xs text-white/25 mt-1.5">{formatRelativeTime(n.timestamp)}</p>
                  </div>
                  <span className={cn('badge shrink-0 h-fit', conf.bg, conf.color, conf.border, 'border')}>
                    {n.severity === 'critical' ? 'حرج' : n.severity === 'warning' ? 'تحذير' : n.severity === 'info' ? 'معلومات' : 'إيجابي'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
