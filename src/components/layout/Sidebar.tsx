import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BrainCircuit,
  Bell,
  ArrowLeftRight,
  ShieldAlert,
  Skull,
  FolderKanban,
  FileBarChart,
  ScrollText,
  UserCircle,
  Users,
  KeyRound,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useOpsStore } from '@/store/opsStore'

// Served from /public — see Login.tsx for the same reference pattern.
const logo = '/Alinma-Bank-Symbol.png'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  badge?: number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export default function Sidebar() {
  const criticalAlerts = useOpsStore((s) => s.stats.criticalAlerts)
  const pendingCases = useOpsStore((s) => s.stats.pendingCases)
  const amlCases = useOpsStore((s) => s.stats.amlCases)
  const tfCases = useOpsStore((s) => s.stats.tfCases)

  const groups: NavGroup[] = [
    {
      title: 'نظرة عامة',
      items: [
        { to: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
        { to: '/ai-dashboard', label: 'لوحة الذكاء الاصطناعي', icon: BrainCircuit },
        { to: '/notifications', label: 'الإشعارات', icon: Bell, badge: criticalAlerts },
      ],
    },
    {
      title: 'المراقبة',
      items: [
        { to: '/transactions', label: 'مراقبة المعاملات', icon: ArrowLeftRight },
        { to: '/aml', label: 'مكافحة غسل الأموال', icon: ShieldAlert, badge: amlCases },
        { to: '/tf', label: 'تمويل الإرهاب', icon: Skull, badge: tfCases },
      ],
    },
    {
      title: 'إدارة الحالات',
      items: [
        { to: '/cases', label: 'إدارة الحالات', icon: FolderKanban, badge: pendingCases },
        { to: '/reports', label: 'التقارير', icon: FileBarChart },
        { to: '/audit-trail', label: 'سجل التدقيق', icon: ScrollText },
      ],
    },
    {
      title: 'الإدارة',
      items: [
        { to: '/profile', label: 'الملف الشخصي', icon: UserCircle },
        { to: '/employees', label: 'إدارة الموظفين', icon: Users },
        { to: '/roles', label: 'الأدوار والصلاحيات', icon: KeyRound },
      ],
    },
    {
      title: 'النظام',
      items: [
        { to: '/settings', label: 'الإعدادات', icon: Settings },
        { to: '/help', label: 'مركز المساعدة', icon: HelpCircle },
      ],
    },
  ]

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-l border-border-subtle bg-background-secondary/60 backdrop-blur-xl sticky top-0">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border-subtle">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 shadow-glow p-1.5">
          <img src={logo} alt="بنك الإنماء" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold tracking-tight">وضُـوح</span>
          <span className="text-[11px] text-white/40 font-medium">Wodoh Operations</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => cn(isActive ? 'sidebar-link-active' : 'sidebar-link')}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {!!item.badge && item.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-status-danger px-1.5 text-[11px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle">
        <div className="glass-panel rounded-2xl p-3.5 flex items-center gap-2">
          <div className="live-dot" />
          <p className="text-xs text-white/50 leading-snug">
            نموذج أولي — هاكاثون <span className="text-white/70 font-medium">بنك الإنماء</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
