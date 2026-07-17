// Risk / status / category presentation logic for Wodoh (وضُـوح)

import type { RiskLevel, CaseStatus, CaseCategory, TransactionStatus, NotificationSeverity } from '@/types'

export const riskLevelConfig: Record<RiskLevel, { label: string; labelEn: string; color: string; bg: string; border: string }> = {
  critical: { label: 'حرج', labelEn: 'Critical', color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' },
  high: { label: 'مرتفع', labelEn: 'High', color: 'text-status-warning', bg: 'bg-status-warning/15', border: 'border-status-warning/25' },
  medium: { label: 'متوسط', labelEn: 'Medium', color: 'text-brand-accent', bg: 'bg-brand-accent/15', border: 'border-brand-accent/25' },
  low: { label: 'منخفض', labelEn: 'Low', color: 'text-status-success', bg: 'bg-status-success/15', border: 'border-status-success/25' },
}

export const caseStatusConfig: Record<CaseStatus, { label: string; labelEn: string; color: string; bg: string; border: string }> = {
  open: { label: 'مفتوحة', labelEn: 'Open', color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' },
  investigating: { label: 'قيد التحقيق', labelEn: 'Investigating', color: 'text-status-warning', bg: 'bg-status-warning/15', border: 'border-status-warning/25' },
  escalated: { label: 'مصعّدة', labelEn: 'Escalated', color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' },
  resolved: { label: 'محلولة', labelEn: 'Resolved', color: 'text-status-success', bg: 'bg-status-success/15', border: 'border-status-success/25' },
  closed: { label: 'مغلقة', labelEn: 'Closed', color: 'text-white/50', bg: 'bg-white/8', border: 'border-white/10' },
  frozen: { label: 'مجمّدة', labelEn: 'Frozen', color: 'text-brand-accent', bg: 'bg-brand-accent/15', border: 'border-brand-accent/25' },
}

export const transactionStatusConfig: Record<TransactionStatus, { label: string; labelEn: string; color: string; bg: string; border: string }> = {
  completed: { label: 'مكتملة', labelEn: 'Completed', color: 'text-status-success', bg: 'bg-status-success/15', border: 'border-status-success/25' },
  pending: { label: 'معلقة', labelEn: 'Pending', color: 'text-status-warning', bg: 'bg-status-warning/15', border: 'border-status-warning/25' },
  flagged: { label: 'مرصودة', labelEn: 'Flagged', color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' },
  reversed: { label: 'معكوسة', labelEn: 'Reversed', color: 'text-white/50', bg: 'bg-white/8', border: 'border-white/10' },
  frozen: { label: 'مجمّدة', labelEn: 'Frozen', color: 'text-brand-accent', bg: 'bg-brand-accent/15', border: 'border-brand-accent/25' },
  failed: { label: 'فاشلة', labelEn: 'Failed', color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' },
}

export const categoryConfig: Record<CaseCategory, { label: string; labelEn: string }> = {
  duplicate_payment: { label: 'دفعة مضاعفة', labelEn: 'Duplicate Payment' },
  operational_error: { label: 'خطأ تشغيلي', labelEn: 'Operational Error' },
  reconciliation_mismatch: { label: 'فرق تسوية', labelEn: 'Reconciliation Mismatch' },
  aml: { label: 'غسل أموال', labelEn: 'AML' },
  terrorist_financing: { label: 'تمويل إرهاب', labelEn: 'Terrorist Financing' },
  suspicious_transaction: { label: 'معاملة مشبوهة', labelEn: 'Suspicious Transaction' },
  system_error: { label: 'خطأ نظام', labelEn: 'System Error' },
}

export const notificationSeverityConfig: Record<NotificationSeverity, { color: string; bg: string; border: string }> = {
  critical: { color: 'text-status-danger', bg: 'bg-status-danger/15', border: 'border-status-danger/25' },
  warning: { color: 'text-status-warning', bg: 'bg-status-warning/15', border: 'border-status-warning/25' },
  info: { color: 'text-brand-accent', bg: 'bg-brand-accent/15', border: 'border-brand-accent/25' },
  success: { color: 'text-status-success', bg: 'bg-status-success/15', border: 'border-status-success/25' },
}

export function riskScoreToLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 35) return 'medium'
  return 'low'
}
