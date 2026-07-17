import { type LucideIcon, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  value: string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'danger'
  invertChangeColor?: boolean
}

const toneStyles = {
  default: { icon: 'text-brand-accent', bg: 'bg-brand-accent/10' },
  success: { icon: 'text-status-success', bg: 'bg-status-success/10' },
  warning: { icon: 'text-status-warning', bg: 'bg-status-warning/10' },
  danger: { icon: 'text-status-danger', bg: 'bg-status-danger/10' },
}

export default function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  tone = 'default',
  invertChangeColor = false,
}: StatCardProps) {
  const styles = toneStyles[tone]
  const isPositive = (change ?? 0) >= 0
  const showGood = invertChangeColor ? !isPositive : isPositive

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', styles.bg)}>
          <Icon className={cn('h-5 w-5', styles.icon)} />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-1',
              showGood ? 'text-status-success bg-status-success/10' : 'text-status-danger bg-status-danger/10'
            )}
          >
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(change)}
            {changeLabel ?? '%'}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="text-sm text-white/45 mt-1">{label}</p>
    </div>
  )
}
