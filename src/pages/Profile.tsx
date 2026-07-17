import { Mail, Phone, Building2, Calendar, Award, FolderKanban, CheckCircle2 } from 'lucide-react'
import { currentEmployee } from '@/data/mockData'
import { useOpsStore } from '@/store/opsStore'
import { formatDate } from '@/lib/formatters'
import PageHeader from '@/components/shared/PageHeader'
import { CaseStatusBadge } from '@/components/shared/Badge'

const roleLabels: Record<string, string> = {
  analyst: 'محلل',
  senior_analyst: 'محلل أول',
  team_lead: 'قائد فريق',
  compliance_officer: 'ضابط امتثال',
  admin: 'مسؤول نظام',
}

const deptLabels: Record<string, string> = {
  operations: 'العمليات',
  aml_compliance: 'الامتثال ومكافحة غسل الأموال',
  risk_management: 'إدارة المخاطر',
  it_security: 'أمن المعلومات',
  audit: 'التدقيق',
}

export default function Profile() {
  const cases = useOpsStore((s) => s.cases)
  const assignedCases = cases.filter((c) => c.assignedTo === currentEmployee.id)

  const resolutionRate = Math.round(
    (currentEmployee.casesResolved / (currentEmployee.casesResolved + currentEmployee.casesAssigned)) * 100
  )

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <PageHeader title="الملف الشخصي" />

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-2xl font-bold shrink-0">
            {currentEmployee.avatarInitials}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{currentEmployee.fullNameAr}</h2>
            <p className="text-sm text-white/40">{currentEmployee.fullNameEn}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="badge-info">{roleLabels[currentEmployee.role]}</span>
              <span className="badge-neutral">{deptLabels[currentEmployee.department]}</span>
              <span className="badge-success">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" /> نشط
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <FolderKanban className="h-5 w-5 text-brand-accent mb-3" />
          <p className="text-2xl font-bold">{currentEmployee.casesAssigned}</p>
          <p className="text-sm text-white/45 mt-1">حالات نشطة</p>
        </div>
        <div className="stat-card">
          <CheckCircle2 className="h-5 w-5 text-status-success mb-3" />
          <p className="text-2xl font-bold">{currentEmployee.casesResolved}</p>
          <p className="text-sm text-white/45 mt-1">حالات محلولة</p>
        </div>
        <div className="stat-card">
          <Award className="h-5 w-5 text-status-warning mb-3" />
          <p className="text-2xl font-bold">{resolutionRate}%</p>
          <p className="text-sm text-white/45 mt-1">معدل الحل</p>
        </div>
        <div className="stat-card">
          <Calendar className="h-5 w-5 text-white/40 mb-3" />
          <p className="text-2xl font-bold">{new Date().getFullYear() - new Date(currentEmployee.joinedDate).getFullYear()}</p>
          <p className="text-sm text-white/45 mt-1">سنوات الخبرة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm text-white/85 mb-4">معلومات الاتصال</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-white/30" />
              <span className="text-white/70">{currentEmployee.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-white/30" />
              <span className="text-white/70">{currentEmployee.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-white/30" />
              <span className="text-white/70">{currentEmployee.employeeId}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-white/30" />
              <span className="text-white/70">انضم في {formatDate(currentEmployee.joinedDate)}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm text-white/85 mb-4">الحالات المعينة لي</h3>
          {assignedCases.length === 0 ? (
            <p className="text-sm text-white/35">لا توجد حالات معينة حالياً</p>
          ) : (
            <div className="space-y-2.5">
              {assignedCases.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <p className="text-xs text-white/70 truncate flex-1">{c.titleAr}</p>
                  <CaseStatusBadge status={c.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
