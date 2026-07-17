// Shared formatting utilities for Wodoh (وضُـوح)

export function formatCurrency(amount: number, options?: { compact?: boolean; showSign?: boolean }): string {
  const sign = options?.showSign && amount > 0 ? '+' : ''
  if (options?.compact) {
    const abs = Math.abs(amount)
    if (abs >= 1_000_000) {
      return `${sign}${(amount / 1_000_000).toFixed(2)}M ر.س`
    }
    if (abs >= 1_000) {
      return `${sign}${(amount / 1_000).toFixed(1)}K ر.س`
    }
  }
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)} ر.س`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'الآن'
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`
  if (diffHr < 24) return `منذ ${diffHr} ساعة`
  if (diffDay < 30) return `منذ ${diffDay} يوم`
  return formatDate(iso)
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber
  return `••••${accountNumber.slice(-4)}`
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2)
  return `${parts[0][0]}${parts[1][0]}`
}
