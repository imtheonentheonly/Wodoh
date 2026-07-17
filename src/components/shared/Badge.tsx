import type { RiskLevel, CaseStatus, TransactionStatus } from '@/types'
import { riskLevelConfig, caseStatusConfig, transactionStatusConfig } from '@/lib/riskUtils'
import { cn } from '@/lib/cn'

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const c = riskLevelConfig[level]
  return (
    <span
      className={cn(
        'badge',
        c.bg,
        c.color,
        c.border,
        'border',
        size === 'sm' && 'px-2 py-0.5 text-[11px]'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.color.replace('text-', 'bg-'))} />
      {c.label}
    </span>
  )
}

export function CaseStatusBadge({ status, size = 'md' }: { status: CaseStatus; size?: 'sm' | 'md' }) {
  const c = caseStatusConfig[status]
  return (
    <span className={cn('badge', c.bg, c.color, c.border, 'border', size === 'sm' && 'px-2 py-0.5 text-[11px]')}>
      {c.label}
    </span>
  )
}

export function TransactionStatusBadge({ status, size = 'md' }: { status: TransactionStatus; size?: 'sm' | 'md' }) {
  const c = transactionStatusConfig[status]
  return (
    <span className={cn('badge', c.bg, c.color, c.border, 'border', size === 'sm' && 'px-2 py-0.5 text-[11px]')}>
      {c.label}
    </span>
  )
}
