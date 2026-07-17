// Zustand store — Operations Dashboard state
// Central nervous system connecting: case management, live alerts,
// notifications, and the customer-transfer incident simulation.

import { create } from 'zustand'
import type {
  OperationalCase,
  Transaction,
  Notification,
  CaseComment,
  CaseTimelineEvent,
  CaseStatus,
  DashboardStats,
} from '@/types'
import {
  operationalCases as initialCases,
  transactions as initialTransactions,
  notifications as initialNotifications,
  dashboardStats as initialStats,
  currentEmployee,
} from '@/data/mockData'

interface OpsState {
  cases: OperationalCase[]
  transactions: Transaction[]
  notifications: Notification[]
  stats: DashboardStats
  liveIncidentActive: boolean
  simulationHasRun: boolean

  // derived getters
  getCaseById: (id: string) => OperationalCase | undefined
  getUnreadNotificationCount: () => number

  // actions
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  updateCaseStatus: (caseId: string, status: CaseStatus) => void
  assignCase: (caseId: string, employeeId: string, employeeName: string) => void
  addComment: (caseId: string, comment: Omit<CaseComment, 'id' | 'timestamp'>) => void
  addTimelineEvent: (caseId: string, event: Omit<CaseTimelineEvent, 'id' | 'timestamp'>) => void
  freezeCaseTransaction: (caseId: string) => void
  escalateCase: (caseId: string) => void
  resolveCase: (caseId: string) => void

  // the core simulation: customer requests 100k, system sends 200k
  runDuplicatePaymentSimulation: () => void
  dismissLiveIncidentBanner: () => void
}

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export const useOpsStore = create<OpsState>((set, get) => ({
  cases: initialCases,
  transactions: initialTransactions,
  notifications: initialNotifications,
  stats: initialStats,
  liveIncidentActive: false,
  simulationHasRun: false,

  getCaseById: (id) => get().cases.find((c) => c.id === id),

  getUnreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  updateCaseStatus: (caseId, status) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    })),

  assignCase: (caseId, employeeId, employeeName) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              assignedTo: employeeId,
              assignedToName: employeeName,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: genId('evt'),
                  timestamp: new Date().toISOString(),
                  actor: currentEmployee.fullNameAr,
                  actorType: 'employee',
                  action: 'تعيين الحالة',
                  detail: `تم تعيين الحالة إلى ${employeeName}.`,
                },
              ],
            }
          : c
      ),
    })),

  addComment: (caseId, comment) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              comments: [
                ...c.comments,
                { ...comment, id: genId('cmt'), timestamp: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    })),

  addTimelineEvent: (caseId, event) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              timeline: [
                ...c.timeline,
                { ...event, id: genId('evt'), timestamp: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    })),

  freezeCaseTransaction: (caseId) => {
    const targetCase = get().cases.find((c) => c.id === caseId)
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'frozen' as CaseStatus,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: genId('evt'),
                  timestamp: new Date().toISOString(),
                  actor: currentEmployee.fullNameAr,
                  actorType: 'employee',
                  action: 'تجميد المعاملة',
                  detail: 'تم تجميد المبلغ الفائض بانتظار المراجعة والاسترداد.',
                },
              ],
            }
          : c
      ),
      transactions: state.transactions.map((t) =>
        targetCase && t.id === targetCase.transactionId ? { ...t, status: 'frozen' } : t
      ),
    }))
  },

  escalateCase: (caseId) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'escalated' as CaseStatus,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: genId('evt'),
                  timestamp: new Date().toISOString(),
                  actor: currentEmployee.fullNameAr,
                  actorType: 'employee',
                  action: 'تصعيد الحالة',
                  detail: 'تم تصعيد الحالة إلى فريق الامتثال لمزيد من المراجعة.',
                },
              ],
            }
          : c
      ),
    })),

  resolveCase: (caseId) =>
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'resolved' as CaseStatus,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: genId('evt'),
                  timestamp: new Date().toISOString(),
                  actor: currentEmployee.fullNameAr,
                  actorType: 'employee',
                  action: 'إغلاق الحالة',
                  detail: 'تم حل الحالة واسترداد الفرق بالكامل.',
                },
              ],
            }
          : c
      ),
      stats: {
        ...state.stats,
        pendingCases: Math.max(0, state.stats.pendingCases - 1),
      },
    })),

  // ============================================================
  // THE LIVE SIMULATION
  // Called from the Customer Simulation app when Mohammed Hamad
  // "transfers" SAR 100,000 and the system duplicates it to 200,000.
  // Pushes a live transaction + case + notification into the
  // Operations Dashboard in real time.
  // ============================================================
  runDuplicatePaymentSimulation: () => {
    if (get().simulationHasRun) {
      set({ liveIncidentActive: true })
      return
    }

    const now = new Date().toISOString()
    const txnId = 'txn-live-921'
    const caseId = 'case-live-145'

    const newTransaction: Transaction = {
      id: txnId,
      reference: 'TRX-2026-0709-LIVE921',
      type: 'transfer',
      status: 'flagged',
      fromAccount: '4881029934',
      fromName: 'محمد حماد',
      toAccount: '4881033218',
      toName: 'أحمد فهد',
      requestedAmount: 100000,
      processedAmount: 200000,
      currency: 'SAR',
      timestamp: now,
      channel: 'mobile',
      hasDiscrepancy: true,
      discrepancyAmount: 100000,
      linkedCaseId: caseId,
      branch: 'فرع العليا - الرياض',
      description: 'تحويل داخلي بين الحسابات - خطأ نظام مضاعفة المبلغ (محاكاة حية)',
    }

    const newCase: OperationalCase = {
      id: caseId,
      caseNumber: 'CASE-2026-000146',
      title: 'LIVE: Duplicate Payment — System Multiplication Error',
      titleAr: 'مباشر: دفعة مضاعفة — خطأ نظام في مضاعفة المبلغ',
      category: 'duplicate_payment',
      status: 'open',
      riskLevel: 'critical',
      createdAt: now,
      updatedAt: now,
      customerId: 'cust-001',
      customerName: 'محمد حماد',
      transactionId: txnId,
      expectedAmount: 100000,
      actualAmount: 200000,
      difference: 100000,
      capitalImpact: 100000,
      aiAnalysis: {
        riskLevel: 'critical',
        confidence: 98,
        detectionType: 'duplicate_payment',
        summary:
          'رصد الذكاء الاصطناعي تحويلاً مضاعفاً غير مطابق للمبلغ المعتمد من العميل، حيث تم تحويل ضعف المبلغ المطلوب نتيجة خطأ تقني في نظام المعالجة الأساسي.',
        factors: [
          {
            label: 'عدم تطابق المبلغ',
            detail: 'المبلغ المعالج (200,000 ر.س) يساوي بالضبط ضعف المبلغ المعتمد (100,000 ر.س).',
            weight: 40,
          },
          {
            label: 'توقيت المعالجة',
            detail: 'تم تنفيذ عمليتين متطابقتين خلال أقل من 400 مللي ثانية من نفس معرف الجلسة.',
            weight: 25,
          },
          {
            label: 'أثر رأس المال',
            detail: 'الفرق البالغ 100,000 ر.س يتجاوز عتبة التسوية اليومية المسموح بها للفرع.',
            weight: 20,
          },
          {
            label: 'سجل العميل',
            detail: 'العميل يحمل تصنيف مخاطر منخفض وسجل معاملات نظيف.',
            weight: 15,
          },
        ],
        recommendedAction: 'تجميد المبلغ الفائض فوراً، والتحقق اليدوي، ثم استرداد الفرق إلى حساب البنك المركزي.',
        modelVersion: 'Wodoh-AI v2.3.1',
        analyzedAt: now,
      },
      timeline: [
        {
          id: genId('evt'),
          timestamp: now,
          actor: 'نظام التحويلات الأساسي',
          actorType: 'system',
          action: 'بدء المعاملة',
          detail: 'استلام طلب تحويل بمبلغ 100,000 ر.س من العميل محمد حماد عبر تطبيق الجوال.',
        },
        {
          id: genId('evt'),
          timestamp: now,
          actor: 'نظام التحويلات الأساسي',
          actorType: 'system',
          action: 'خطأ في المعالجة',
          detail: 'تكرار استدعاء أمر التحويل — تم تنفيذ العملية مرتين بقيمة 200,000 ر.س.',
        },
        {
          id: genId('evt'),
          timestamp: now,
          actor: 'Wodoh AI Engine',
          actorType: 'ai',
          action: 'رصد الحالة الشاذة وإنشاء تنبيه حرج',
          detail: 'تم رصد فرق بمقدار 100,000 ر.س بمستوى ثقة 98%، وفتح حالة تلقائياً.',
        },
      ],
      comments: [],
      attachments: [
        {
          id: genId('att'),
          name: 'transaction_log_live921.log',
          type: 'log',
          size: '76 KB',
          uploadedBy: 'Wodoh AI Engine',
          uploadedAt: now,
        },
      ],
      relatedTransactionIds: [txnId],
      complianceNotes: '',
      operationsNotes: '',
      recoveryRecommendation:
        'تجميد الفرق الفائض (100,000 ر.س) من حساب المستلم أحمد فهد، والتحقق من موافقة العميل الأصلية، ثم إعادة المبلغ إلى حساب التسوية.',
      priority: 1,
      slaDeadline: new Date(Date.now() + 2 * 3600000).toISOString(),
    }

    const newNotification: Notification = {
      id: genId('notif'),
      severity: 'critical',
      title: 'Critical: Live Duplicate Payment Detected',
      titleAr: 'تنبيه حرج مباشر: رصد دفعة مضاعفة',
      message: `System error caused a SAR 100,000 excess transfer from Mohammed Hamad's account.`,
      messageAr: 'خطأ نظام مباشر تسبب في تحويل زائد بمبلغ 100,000 ر.س من حساب محمد حماد.',
      timestamp: now,
      read: false,
      linkedCaseId: caseId,
      category: 'duplicate_payment',
    }

    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
      cases: [newCase, ...state.cases],
      notifications: [newNotification, ...state.notifications],
      liveIncidentActive: true,
      simulationHasRun: true,
      stats: {
        ...state.stats,
        pendingCases: state.stats.pendingCases + 1,
        criticalAlerts: state.stats.criticalAlerts + 1,
        financialDifference: state.stats.financialDifference + 100000,
      },
    }))
  },

  dismissLiveIncidentBanner: () => set({ liveIncidentActive: false }),
}))
