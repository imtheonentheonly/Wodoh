import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  FolderKanban,
  AlertOctagon,
  Wallet,
  Scale,
  ShieldAlert,
  Skull,
  ArrowLeft,
  UserPlus,
  FileBarChart,
  Search,
  Zap,
} from 'lucide-react'
import { useOpsStore } from '@/store/opsStore'
import { employees, transactionVolumeChart, weeklyRiskTrendChart } from '@/data/mockData'
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/formatters'
import StatCard from '@/components/shared/StatCard'
import PageHeader from '@/components/shared/PageHeader'
import { RiskBadge, CaseStatusBadge } from '@/components/shared/Badge'
import AreaTrendChart from '@/components/shared/charts/AreaTrendChart'
import BarComparisonChart from '@/components/shared/charts/BarComparisonChart'
import EmptyState from '@/components/shared/EmptyState'

export default function Dashboard() {
  const navigate = useNavigate()
  const stats = useOpsStore((s) => s.stats)
  const cases = useOpsStore((s) => s.cases)
  const transactions = useOpsStore((s) => s.transactions)

  const recentCases = [...cases].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)
  const recentTxns = [...transactions].slice(0, 6)

  const quickActions = [
    { label: 'مراقبة المعاملات', icon: ArrowLeftRight, to: '/transactions' },
    { label: 'إدارة الحالات', icon: FolderKanban, to: '/cases' },
    { label: 'إنشاء تقرير', icon: FileBarChart, to: '/reports' },
    { label: 'تعيين موظف', icon: UserPlus, to: '/employees' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="لوحة التحكم"
        description="نظرة شاملة على العمليات المصرفية والتنبيهات الحية"
        action={
          <button onClick={() => navigate('/transactions')} className="btn-secondary">
            <Search className="h-4 w-4" /> بحث متقدم
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="معاملات اليوم"
          value={formatNumber(stats.todaysTransactions)}
          change={stats.todaysTransactionsChange}
          icon={ArrowLeftRight}
        />
        <StatCard
          label="الحالات المعلقة"
          value={formatNumber(stats.pendingCases)}
          change={stats.pendingCasesChange}
          changeLabel=""
          icon={FolderKanban}
          tone="warning"
          invertChangeColor
        />
        <StatCard
          label="تنبيهات حرجة"
          value={formatNumber(stats.criticalAlerts)}
          change={stats.criticalAlertsChange}
          changeLabel=""
          icon={AlertOctagon}
          tone="danger"
          invertChangeColor
        />
        <StatCard
          label="رصيد رأس المال"
          value={formatCurrency(stats.capitalBalance, { compact: true })}
          change={stats.capitalBalanceChange}
          icon={Wallet}
          tone="success"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="التسوية اليومية"
          value={formatCurrency(stats.dailyReconciliation)}
          icon={Scale}
          tone={stats.reconciliationStatus === 'balanced' ? 'success' : 'warning'}
        />
        <StatCard label="الفرق المالي" value={formatCurrency(stats.financialDifference)} icon={AlertOctagon} tone="danger" />
        <StatCard label="حالات غسل الأموال" value={formatNumber(stats.amlCases)} icon={ShieldAlert} tone="warning" />
        <StatCard label="حالات تمويل الإرهاب" value={formatNumber(stats.tfCases)} icon={Skull} tone="danger" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            onClick={() => navigate(qa.to)}
            className="glass-card p-4 flex flex-col items-center gap-2 hover:border-brand-accent/40 hover:shadow-glow transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors">
              <qa.icon className="h-4.5 w-4.5 text-brand-accent" />
            </div>
            <span className="text-xs font-medium text-white/70 text-center">{qa.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-white/85">حجم المعاملات اليومي</h3>
            <span className="badge-info">
              <Zap className="h-3 w-3" /> مباشر
            </span>
          </div>
          <p className="text-xs text-white/35 mb-4">توزيع المعاملات على مدار الساعات</p>
          <AreaTrendChart data={transactionVolumeChart} valueFormatter={(v) => formatNumber(v)} />
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm text-white/85 mb-1">الحالات حسب النوع</h3>
          <p className="text-xs text-white/35 mb-4">توزيع الحالات المفتوحة هذا الأسبوع</p>
          <BarComparisonChart data={weeklyRiskTrendChart} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
            <h3 className="font-semibold text-sm text-white/85">أحدث الحالات</h3>
            <button onClick={() => navigate('/cases')} className="text-xs text-brand-accent hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft className="h-3 w-3 rtl-flip" />
            </button>
          </div>
          {recentCases.length === 0 ? (
            <EmptyState icon={FolderKanban} title="لا توجد حالات حالياً" />
          ) : (
            <div className="divide-y divide-border-subtle">
              {recentCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.id}`)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-right"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/85 truncate">{c.titleAr}</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      {c.caseNumber} · {c.customerName} · {formatRelativeTime(c.createdAt)}
                    </p>
                  </div>
                  <RiskBadge level={c.riskLevel} size="sm" />
                  <CaseStatusBadge status={c.status} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
            <h3 className="font-semibold text-sm text-white/85">مهام الموظفين</h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {employees.filter((e) => e.casesAssigned > 0).map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-[11px] font-bold shrink-0">
                  {e.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{e.fullNameAr}</p>
                  <p className="text-xs text-white/35">{e.casesAssigned} حالات نشطة</p>
                </div>
                <span className="text-xs font-semibold text-status-success">{e.casesResolved}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h3 className="font-semibold text-sm text-white/85">أحدث المعاملات</h3>
          <button onClick={() => navigate('/transactions')} className="text-xs text-brand-accent hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft className="h-3 w-3 rtl-flip" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-white/35 border-b border-border-subtle">
                <th className="px-5 py-3 font-medium">المرجع</th>
                <th className="px-5 py-3 font-medium">من</th>
                <th className="px-5 py-3 font-medium">إلى</th>
                <th className="px-5 py-3 font-medium">المبلغ</th>
                <th className="px-5 py-3 font-medium">الوقت</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map((t) => (
                <tr
                  key={t.id}
                  className="table-row cursor-pointer"
                  onClick={() => navigate(`/transactions/${t.id}`)}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-white/60">{t.reference}</td>
                  <td className="px-5 py-3.5 text-white/75">{t.fromName}</td>
                  <td className="px-5 py-3.5 text-white/75">{t.toName}</td>
                  <td className={`px-5 py-3.5 font-medium tabular-nums ${t.hasDiscrepancy ? 'text-status-danger' : 'text-white/85'}`}>
                    {formatCurrency(t.processedAmount)}
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">{formatRelativeTime(t.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
