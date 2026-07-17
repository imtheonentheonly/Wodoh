import { useNavigate } from 'react-router-dom'
import { BrainCircuit, Gauge, TrendingUp, Zap, Activity, ArrowLeft, Cpu, Sparkles } from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { casesByCategoryChart } from '@/data/mockData'
import { formatCurrency, formatRelativeTime } from '@/lib/formatters'
import PageHeader from '@/components/shared/PageHeader'
import { RiskBadge } from '@/components/shared/Badge'
import DonutChart from '@/components/shared/charts/DonutChart'
import EmptyState from '@/components/shared/EmptyState'
import { categoryConfig } from '@/lib/riskUtils'

export default function AIDashboard() {
  const navigate = useNavigate()
  const cases = useOpsStore((s) => s.cases)

  const sortedByConfidence = [...cases].sort((a, b) => b.aiAnalysis.confidence - a.aiAnalysis.confidence)
  const avgConfidence = Math.round(cases.reduce((sum, c) => sum + c.aiAnalysis.confidence, 0) / (cases.length || 1))
  const criticalDetections = cases.filter((c) => c.riskLevel === 'critical').length
  const totalCapitalFlagged = cases.reduce((sum, c) => sum + c.capitalImpact, 0)

  const modelMetrics = [
    { label: 'دقة النموذج', value: '96.8%', icon: Gauge, tone: 'success' as const },
    { label: 'متوسط الثقة', value: `${avgConfidence}%`, icon: TrendingUp, tone: 'default' as const },
    { label: 'زمن الاستجابة', value: '340ms', icon: Zap, tone: 'default' as const },
    { label: 'حالات تم رصدها اليوم', value: `${cases.length}`, icon: Activity, tone: 'warning' as const },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="لوحة الذكاء الاصطناعي"
        description="رؤى النموذج ومستويات الثقة في اكتشاف الحالات الشاذة"
        action={
          <span className="badge-info">
            <Cpu className="h-3.5 w-3.5" /> Wodoh-AI v2.3.1
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map((m) => (
          <div key={m.label} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  m.tone === 'success' ? 'bg-status-success/10' : m.tone === 'warning' ? 'bg-status-warning/10' : 'bg-brand-accent/10'
                }`}
              >
                <m.icon
                  className={`h-5 w-5 ${
                    m.tone === 'success' ? 'text-status-success' : m.tone === 'warning' ? 'text-status-warning' : 'text-brand-accent'
                  }`}
                />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{m.value}</p>
            <p className="text-sm text-white/45 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-brand-accent" />
              <h3 className="font-semibold text-sm text-white/85">أحدث عمليات الرصد</h3>
            </div>
            <span className="badge-danger">
              <span className="live-dot !relative !inline-flex" /> {criticalDetections} حرجة
            </span>
          </div>
          {sortedByConfidence.length === 0 ? (
            <EmptyState icon={BrainCircuit} title="لا توجد عمليات رصد" />
          ) : (
            <div className="divide-y divide-border-subtle">
              {sortedByConfidence.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.id}`)}
                  className="w-full text-right px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/85">{c.titleAr}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        {categoryConfig[c.category].label} · {c.customerName} · {formatRelativeTime(c.createdAt)}
                      </p>
                    </div>
                    <RiskBadge level={c.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-2.5">{c.aiAnalysis.summary}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent"
                        style={{ width: `${c.aiAnalysis.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-brand-accent tabular-nums shrink-0">
                      ثقة {c.aiAnalysis.confidence}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm text-white/85 mb-1">توزيع أنواع الحالات</h3>
          <p className="text-xs text-white/35 mb-2">تصنيف الرصد الذكي حسب الفئة</p>
          <DonutChart data={casesByCategoryChart} />
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-brand-accent" />
          <h3 className="font-semibold text-sm text-white/85">الأثر المالي الإجمالي المرصود</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="text-xs text-white/40 mb-1">إجمالي المبالغ المتأثرة</p>
            <p className="text-xl font-bold text-status-danger tabular-nums">{formatCurrency(totalCapitalFlagged)}</p>
          </div>
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="text-xs text-white/40 mb-1">حالات بثقة أعلى من 90%</p>
            <p className="text-xl font-bold text-white tabular-nums">
              {cases.filter((c) => c.aiAnalysis.confidence >= 90).length}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="text-xs text-white/40 mb-1">متوسط زمن الاكتشاف</p>
            <p className="text-xl font-bold text-white tabular-nums">2.1 ثانية</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 flex items-start gap-3 border-status-warning/20 bg-status-warning/[0.03]">
        <ArrowLeft className="h-4 w-4 text-status-warning mt-0.5 shrink-0 rtl-flip" />
        <p className="text-xs text-white/50 leading-relaxed">
          نتائج الذكاء الاصطناعي هنا هي أداة مساعدة لدعم قرار الموظف، وليست قراراً نهائياً. جميع الحالات ذات المخاطر
          الحرجة تتطلب مراجعة وتأكيداً يدوياً قبل اتخاذ أي إجراء على حساب العميل.
        </p>
      </div>
    </div>
  )
}
