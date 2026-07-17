import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 mb-4">
        <Icon className="h-6 w-6 text-white/30" />
      </div>
      <p className="text-sm font-semibold text-white/70">{title}</p>
      {description && <p className="text-sm text-white/40 mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
