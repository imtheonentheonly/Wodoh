import { KeyRound, Check, X } from 'lucide-react'
import { employees } from '@/data/mockData'
import PageHeader from '@/components/shared/PageHeader'

const allPermissions = [
  { key: 'view_cases', label: 'عرض الحالات' },
  { key: 'assign_cases', label: 'تعيين الحالات' },
  { key: 'freeze_transactions', label: 'تجميد المعاملات' },
  { key: 'escalate_cases', label: 'تصعيد الحالات' },
  { key: 'generate_reports', label: 'إنشاء التقارير' },
  { key: 'view_aml_alerts', label: 'عرض تنبيهات AML' },
  { key: 'manage_employees', label: 'إدارة الموظفين' },
  { key: 'manage_roles', label: 'إدارة الأدوار' },
  { key: 'view_audit_trail', label: 'عرض سجل التدقيق' },
  { key: 'system_settings', label: 'إعدادات النظام' },
]

const roles = [
  { key: 'analyst', label: 'محلل', color: 'text-white/60' },
  { key: 'senior_analyst', label: 'محلل أول', color: 'text-brand-accent' },
  { key: 'team_lead', label: 'قائد فريق', color: 'text-status-success' },
  { key: 'compliance_officer', label: 'ضابط امتثال', color: 'text-status-warning' },
  { key: 'admin', label: 'مسؤول نظام', color: 'text-status-danger' },
]

export default function Roles() {
  function roleHasPermission(roleKey: string, permKey: string): boolean {
    const sample = employees.find((e) => e.role === roleKey)
    return sample ? sample.permissions.includes(permKey) : false
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="الأدوار والصلاحيات" description="مصفوفة الصلاحيات لكل دور وظيفي في النظام" />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-right text-xs text-white/35 border-b border-border-subtle">
                <th className="px-5 py-3.5 font-medium sticky right-0 bg-card">الصلاحية</th>
                {roles.map((r) => (
                  <th key={r.key} className="px-4 py-3.5 font-medium text-center">
                    <span className={r.color}>{r.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((perm) => (
                <tr key={perm.key} className="table-row">
                  <td className="px-5 py-3 text-white/75 sticky right-0 bg-card flex items-center gap-2">
                    <KeyRound className="h-3.5 w-3.5 text-white/25" />
                    {perm.label}
                  </td>
                  {roles.map((r) => (
                    <td key={r.key} className="px-4 py-3 text-center">
                      {roleHasPermission(r.key, perm.key) ? (
                        <Check className="h-4 w-4 text-status-success inline" />
                      ) : (
                        <X className="h-4 w-4 text-white/15 inline" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
