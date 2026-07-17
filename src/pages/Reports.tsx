import { useState } from 'react'
import { FileBarChart, Download, TrendingUp, TrendingDown, FileText } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { transactions as allTransactions, capitalTrendChart, casesByCategoryChart } from '@/data/mockData'
import { formatCurrency, formatDateTime } from '@/lib/formatters'
import PageHeader from '@/components/shared/PageHeader'
import AreaTrendChart from '@/components/shared/charts/AreaTrendChart'
import DonutChart from '@/components/shared/charts/DonutChart'
import { downloadCSV } from '@/lib/exportUtils'
import { categoryConfig } from '@/lib/riskUtils'

const reportTypes = [
  { id: 'daily_recon', title: 'تقرير التسوية اليومية', desc: 'ملخص مطابقة النظام الأساسي مع نظام الدفع' },
  { id: 'case_summary', title: 'ملخص الحالات', desc: 'تقرير شامل لجميع الحالات المفتوحة والمغلقة' },
  { id: 'aml_compliance', title: 'تقرير امتثال AML', desc: 'تقرير مخصص لفريق الامتثال ومكافحة غسل الأموال' },
  { id: 'financial_impact', title: 'تقرير الأثر المالي', desc: 'تحليل الأثر المالي التراكمي للحالات المرصودة' },
]

export default function Reports() {
  const cases = useOpsStore((s) => s.cases)
  const stats = useOpsStore((s) => s.stats)
  const [generating, setGenerating] = useState<string | null>(null)

  const resolvedCases = cases.filter((c) => c.status === 'resolved' || c.status === 'closed')
  const totalImpact = cases.reduce((sum, c) => sum + c.capitalImpact, 0)

  function handleGenerate(reportId: string) {
    setGenerating(reportId)
    setTimeout(() => {
      if (reportId === 'case_summary') {
        downloadCSV(
          `wodoh-case-summary-${Date.now()}.csv`,
          ['رقم الحالة', 'العنوان', 'العميل', 'الفئة', 'الخطر', 'الحالة', 'التأثير المالي', 'تاريخ الإنشاء'],
          cases.map((c) => [
            c.caseNumber,
            c.titleAr,
            c.customerName,
            categoryConfig[c.category].label,
            c.riskLevel,
            c.status,
            c.capitalImpact,
            formatDateTime(c.createdAt),
          ])
        )
      } else if (reportId === 'financial_impact') {
        downloadCSV(
          `wodoh-financial-impact-${Date.now()}.csv`,
          ['المرجع', 'من', 'إلى', 'المبلغ المطلوب', 'المبلغ المنفذ', 'الفرق'],
          allTransactions
            .filter((t) => t.hasDiscrepancy)
            .map((t) => [t.reference, t.fromName, t.toName, t.requestedAmount, t.processedAmount, t.discrepancyAmount ?? 0])
        )
      } else {
        downloadCSV(
          `wodoh-report-${reportId}-${Date.now()}.csv`,
          ['المؤشر', 'القيمة'],
          [
            ['معاملات اليوم', stats.todaysTransactions],
            ['الحالات المعلقة', stats.pendingCases],
            ['التنبيهات الحرجة', stats.criticalAlerts],
            ['رصيد رأس المال', stats.capitalBalance],
            ['الفرق المالي', stats.financialDifference],
          ]
        )
      }
      setGenerating(null)
    }, 900)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="التقارير والتحليلات" description="تقارير مصرفية احترافية جاهزة للطباعة والتصدير" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportTypes.map((r) => (
          <div key={r.id} className="glass-card p-5 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 shrink-0">
              <FileText className="h-5 w-5 text-brand-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/90 mb-1">{r.title}</p>
              <p className="text-xs text-white/40 mb-3 leading-relaxed">{r.desc}</p>
              <button
                onClick={() => handleGenerate(r.id)}
                disabled={generating === r.id}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                {generating === r.id ? (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                {generating === r.id ? 'جاري الإنشاء...' : 'إنشاء وتصدير CSV'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-semibold text-sm text-white/85 mb-1">اتجاه رأس المال (آخر 7 أيام)</h3>
          <p className="text-xs text-white/35 mb-4">التغير في رصيد رأس المال الإجمالي</p>
          <AreaTrendChart data={capitalTrendChart} color="#10B981" valueFormatter={(v) => formatCurrency(v, { compact: true })} />
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm text-white/85 mb-1">توزيع الحالات</h3>
          <p className="text-xs text-white/35 mb-2">حسب الفئة</p>
          <DonutChart data={casesByCategoryChart} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-status-danger/10 mb-4">
            <TrendingDown className="h-5 w-5 text-status-danger" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalImpact, { compact: true })}</p>
          <p className="text-sm text-white/45 mt-1">إجمالي الأثر المالي المرصود</p>
        </div>
        <div className="stat-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-status-success/10 mb-4">
            <TrendingUp className="h-5 w-5 text-status-success" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{resolvedCases.length}</p>
          <p className="text-sm text-white/45 mt-1">حالات محلولة هذا الشهر</p>
        </div>
        <div className="stat-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 mb-4">
            <FileBarChart className="h-5 w-5 text-brand-accent" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{cases.length}</p>
          <p className="text-sm text-white/45 mt-1">إجمالي الحالات المفتوحة</p>
        </div>
      </div>
    </div>
  )
}
