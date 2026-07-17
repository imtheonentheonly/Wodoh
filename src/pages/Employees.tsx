import { useState, useMemo } from 'react'
import { Users, Search, Mail, Phone, UserPlus } from 'lucide-react'
import { employees as initialEmployees } from '@/data/mockData'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import Modal from '@/components/shared/Modal'
import { cn } from '@/lib/cn'
import type { Department } from '@/types'

const deptLabels: Record<Department, string> = {
  operations: 'العمليات',
  aml_compliance: 'الامتثال ومكافحة غسل الأموال',
  risk_management: 'إدارة المخاطر',
  it_security: 'أمن المعلومات',
  audit: 'التدقيق',
}

const roleLabels: Record<string, string> = {
  analyst: 'محلل',
  senior_analyst: 'محلل أول',
  team_lead: 'قائد فريق',
  compliance_officer: 'ضابط امتثال',
  admin: 'مسؤول نظام',
}

export default function Employees() {
  const [query, setQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all')
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    return initialEmployees.filter((e) => {
      const matchesQuery = !query || e.fullNameAr.includes(query) || e.employeeId.toLowerCase().includes(query.toLowerCase())
      const matchesDept = deptFilter === 'all' || e.department === deptFilter
      return matchesQuery && matchesDept
    })
  }, [query, deptFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="إدارة الموظفين"
        description={`${filtered.length} موظف`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <UserPlus className="h-4 w-4" /> إضافة موظف
          </button>
        }
      />

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالاسم أو الرقم الوظيفي..."
            className="input-field pr-10"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value as Department | 'all')}
          className="input-field sm:w-56"
        >
          <option value="all">كل الأقسام</option>
          {Object.entries(deptLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card">
          <EmptyState icon={Users} title="لا يوجد موظفون مطابقون" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <div key={e.id} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-sm font-bold shrink-0">
                  {e.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 truncate">{e.fullNameAr}</p>
                  <p className="text-xs text-white/40">{roleLabels[e.role]}</p>
                </div>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full shrink-0',
                    e.status === 'active' ? 'bg-status-success' : e.status === 'on_leave' ? 'bg-status-warning' : 'bg-white/20'
                  )}
                />
              </div>
              <div className="space-y-2 text-xs text-white/45 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{e.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{e.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-xs">
                <span className="text-white/35">{deptLabels[e.department]}</span>
                <span className="text-white/70 font-medium">{e.casesAssigned} حالات نشطة</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="إضافة موظف جديد" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">الاسم الكامل</label>
            <input className="input-field" placeholder="مثال: سلطان العمري" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">البريد الإلكتروني</label>
            <input className="input-field" placeholder="name@alinma-ops.internal" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">الدور</label>
              <select className="input-field">
                {Object.entries(roleLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">القسم</label>
              <select className="input-field">
                {Object.entries(deptLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={() => setAddOpen(false)} className="btn-primary w-full">
            إضافة الموظف
          </button>
        </div>
      </Modal>
    </div>
  )
}
