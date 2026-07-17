import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Brain,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  Snowflake,
  UserPlus,
  ArrowUpCircle,
  CheckCircle2,
  Download,
  AlertTriangle,
  Bot,
  User,
  Server,
  Send,
} from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { employees, currentEmployee } from '@/data/mockData'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/formatters'
import { RiskBadge, CaseStatusBadge } from '@/components/shared/Badge'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import { categoryConfig } from '@/lib/riskUtils'
import { generateCasePDF } from '@/lib/exportUtils'

const actorIcon = { system: Server, ai: Bot, employee: User }

export default function CaseDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cases = useOpsStore((s) => s.cases)
  const caseData = cases.find((c) => c.id === id)

  const freezeTransaction = useOpsStore((s) => s.freezeCaseTransaction)
  const escalateCase = useOpsStore((s) => s.escalateCase)
  const resolveCase = useOpsStore((s) => s.resolveCase)
  const assignCase = useOpsStore((s) => s.assignCase)
  const addComment = useOpsStore((s) => s.addComment)

  const [tab, setTab] = useState<'overview' | 'timeline' | 'comments' | 'attachments'>('overview')
  const [assignOpen, setAssignOpen] = useState(false)
  const [freezeConfirmOpen, setFreezeConfirmOpen] = useState(false)
  const [escalateConfirmOpen, setEscalateConfirmOpen] = useState(false)
  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false)
  const [commentText, setCommentText] = useState('')

  if (!caseData) {
    return (
      <div className="glass-card">
        <EmptyState
          icon={AlertTriangle}
          title="الحالة غير موجودة"
          action={
            <button onClick={() => navigate('/cases')} className="btn-primary">
              العودة إلى الحالات
            </button>
          }
        />
      </div>
    )
  }

  const tabs = [
    { key: 'overview' as const, label: 'نظرة عامة', icon: FileText },
    { key: 'timeline' as const, label: 'الجدول الزمني', icon: Clock, count: caseData.timeline.length },
    { key: 'comments' as const, label: 'التعليقات', icon: MessageSquare, count: caseData.comments.length },
    { key: 'attachments' as const, label: 'المرفقات', icon: Paperclip, count: caseData.attachments.length },
  ]

  function handleAddComment() {
    if (!commentText.trim()) return
    addComment(caseData!.id, {
      authorId: currentEmployee.id,
      authorName: currentEmployee.fullNameAr,
      authorRole: 'محلل أول',
      content: commentText.trim(),
      isInternal: true,
    })
    setCommentText('')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <button onClick={() => navigate('/cases')} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 w-fit">
        <ArrowRight className="h-4 w-4" /> العودة إلى الحالات
      </button>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-mono text-white/35 mb-1.5">{caseData.caseNumber}</p>
            <h1 className="text-xl font-bold text-white mb-2">{caseData.titleAr}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge level={caseData.riskLevel} />
              <CaseStatusBadge status={caseData.status} />
              <span className="badge-neutral">{categoryConfig[caseData.category].label}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button onClick={() => setAssignOpen(true)} className="btn-secondary py-2 px-3 text-xs">
              <UserPlus className="h-3.5 w-3.5" /> تعيين
            </button>
            <button onClick={() => setEscalateConfirmOpen(true)} className="btn-secondary py-2 px-3 text-xs">
              <ArrowUpCircle className="h-3.5 w-3.5" /> تصعيد
            </button>
            <button onClick={() => setFreezeConfirmOpen(true)} className="btn-danger py-2 px-3 text-xs">
              <Snowflake className="h-3.5 w-3.5" /> تجميد
            </button>
            <button onClick={() => generateCasePDF(caseData)} className="btn-secondary py-2 px-3 text-xs">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-border-subtle">
          <div>
            <p className="text-xs text-white/35 mb-1">المبلغ المتوقع</p>
            <p className="text-sm font-semibold text-white/85 tabular-nums">{formatCurrency(caseData.expectedAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-white/35 mb-1">المبلغ الفعلي</p>
            <p className="text-sm font-semibold text-status-danger tabular-nums">{formatCurrency(caseData.actualAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-white/35 mb-1">الفرق</p>
            <p className="text-sm font-semibold text-status-warning tabular-nums">{formatCurrency(caseData.difference)}</p>
          </div>
          <div>
            <p className="text-xs text-white/35 mb-1">تأثير رأس المال</p>
            <p className="text-sm font-semibold text-white/85 tabular-nums">{formatCurrency(caseData.capitalImpact)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border-subtle overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 shrink-0 transition-colors ${
              tab === t.key ? 'border-brand-accent text-white' : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="rounded-full bg-white/8 px-1.5 text-[10px]">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-brand-accent" />
                <h3 className="font-semibold text-sm text-white/85">تحليل الذكاء الاصطناعي</h3>
                <span className="badge-info mr-auto">ثقة {caseData.aiAnalysis.confidence}%</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">{caseData.aiAnalysis.summary}</p>
              <div className="space-y-2.5">
                {caseData.aiAnalysis.factors.map((f) => (
                  <div key={f.label} className="rounded-xl border border-border-subtle p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-white/80">{f.label}</p>
                      <span className="text-[11px] text-brand-accent font-medium">{f.weight}%</span>
                    </div>
                    <p className="text-xs text-white/45 leading-relaxed">{f.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-white/35 mb-1.5">الإجراء الموصى به</p>
                <p className="text-sm text-white/70">{caseData.aiAnalysis.recommendedAction}</p>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm text-white/85 mb-2">توصية الاسترداد</h3>
              <p className="text-sm text-white/60 leading-relaxed">{caseData.recoveryRecommendation}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm text-white/85 mb-3">معلومات الحالة</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/35">العميل</span>
                  <span className="text-white/80">{caseData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">المسؤول</span>
                  <span className="text-white/80">{caseData.assignedToName ?? 'غير معيّن'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">الأولوية</span>
                  <span className="text-white/80">P{caseData.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">تاريخ الإنشاء</span>
                  <span className="text-white/80">{formatDateTime(caseData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">آخر تحديث</span>
                  <span className="text-white/80">{formatRelativeTime(caseData.updatedAt)}</span>
                </div>
              </div>
              <button onClick={() => setResolveConfirmOpen(true)} className="btn-primary w-full mt-4 py-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4" /> إغلاق الحالة كمحلولة
              </button>
            </div>

            {(caseData.complianceNotes || caseData.operationsNotes) && (
              <div className="glass-card p-5 space-y-3">
                {caseData.operationsNotes && (
                  <div>
                    <p className="text-xs text-white/35 mb-1">ملاحظات العمليات</p>
                    <p className="text-sm text-white/70">{caseData.operationsNotes}</p>
                  </div>
                )}
                {caseData.complianceNotes && (
                  <div>
                    <p className="text-xs text-white/35 mb-1">ملاحظات الامتثال</p>
                    <p className="text-sm text-white/70">{caseData.complianceNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'timeline' && (
        <div className="glass-card p-5">
          {caseData.timeline.length === 0 ? (
            <EmptyState icon={Clock} title="لا توجد أحداث بعد" />
          ) : (
            <div className="space-y-0">
              {caseData.timeline.map((evt, i) => {
                const Icon = actorIcon[evt.actorType]
                return (
                  <div key={evt.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          evt.actorType === 'ai'
                            ? 'bg-brand-accent/15'
                            : evt.actorType === 'system'
                            ? 'bg-white/8'
                            : 'bg-status-success/15'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            evt.actorType === 'ai'
                              ? 'text-brand-accent'
                              : evt.actorType === 'system'
                              ? 'text-white/50'
                              : 'text-status-success'
                          }`}
                        />
                      </div>
                      {i < caseData.timeline.length - 1 && <div className="w-px flex-1 bg-border-subtle my-1" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white/85">{evt.action}</p>
                        <span className="text-[11px] text-white/25">{formatRelativeTime(evt.timestamp)}</span>
                      </div>
                      <p className="text-xs text-white/45 mb-1">{evt.actor}</p>
                      <p className="text-sm text-white/55 leading-relaxed">{evt.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'comments' && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex gap-2.5">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="أضف تعليقاً داخلياً..."
              className="input-field"
            />
            <button onClick={handleAddComment} className="btn-primary px-4 shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </div>
          {caseData.comments.length === 0 ? (
            <EmptyState icon={MessageSquare} title="لا توجد تعليقات بعد" />
          ) : (
            <div className="space-y-3">
              {caseData.comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-border-subtle p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/15 text-[10px] font-bold text-brand-accent">
                      {c.authorName[0]}
                    </div>
                    <p className="text-xs font-medium text-white/80">{c.authorName}</p>
                    <span className="text-[11px] text-white/25">{c.authorRole}</span>
                    <span className="text-[11px] text-white/25 mr-auto">{formatRelativeTime(c.timestamp)}</span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'attachments' && (
        <div className="glass-card p-5">
          {caseData.attachments.length === 0 ? (
            <EmptyState icon={Paperclip} title="لا توجد مرفقات" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.attachments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border-subtle p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0">
                    <FileText className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{a.name}</p>
                    <p className="text-[11px] text-white/35">
                      {a.size} · {a.uploadedBy} · {formatRelativeTime(a.uploadedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={assignOpen} onClose={() => setAssignOpen(false)} title="تعيين الحالة" size="sm">
        <div className="space-y-2">
          {employees.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                assignCase(caseData.id, e.id, e.fullNameAr)
                setAssignOpen(false)
              }}
              className="w-full flex items-center gap-3 rounded-xl border border-border-subtle p-3 hover:bg-white/5 text-right"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/15 text-xs font-bold text-brand-accent shrink-0">
                {e.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85">{e.fullNameAr}</p>
                <p className="text-[11px] text-white/35">{e.casesAssigned} حالات نشطة</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={freezeConfirmOpen}
        onClose={() => setFreezeConfirmOpen(false)}
        onConfirm={() => freezeTransaction(caseData.id)}
        title="تجميد المعاملة"
        description="سيتم تجميد المبلغ الفائض فوراً ومنع أي عمليات سحب إضافية على الحساب المرتبط حتى انتهاء المراجعة."
        confirmLabel="تجميد الآن"
      />
      <ConfirmDialog
        open={escalateConfirmOpen}
        onClose={() => setEscalateConfirmOpen(false)}
        onConfirm={() => escalateCase(caseData.id)}
        title="تصعيد الحالة"
        description="سيتم تصعيد هذه الحالة إلى فريق الامتثال لمزيد من المراجعة والتحقيق."
        confirmLabel="تصعيد"
        danger={false}
      />
      <ConfirmDialog
        open={resolveConfirmOpen}
        onClose={() => setResolveConfirmOpen(false)}
        onConfirm={() => resolveCase(caseData.id)}
        title="إغلاق الحالة"
        description="سيتم وضع علامة على هذه الحالة كمحلولة بالكامل. تأكد من إتمام جميع إجراءات الاسترداد اللازمة."
        confirmLabel="إغلاق كمحلولة"
        danger={false}
      />
    </div>
  )
}
