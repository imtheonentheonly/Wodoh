import { useState } from 'react'
import { Shield, Bell, Palette, Globe, Check } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/cn'

export default function Settings() {
  const [notifSettings, setNotifSettings] = useState({
    critical: true,
    warning: true,
    info: false,
    email: true,
    sms: false,
  })
  const [twoFactor, setTwoFactor] = useState(true)
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [saved, setSaved] = useState(false)

  function toggle(key: keyof typeof notifSettings) {
    setNotifSettings((s) => ({ ...s, [key]: !s[key] }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <PageHeader title="الإعدادات" description="إدارة إعدادات الأمان والإشعارات والمظهر" />

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-brand-accent" />
          <h3 className="font-semibold text-sm text-white/85">الأمان</h3>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border-subtle">
          <div>
            <p className="text-sm text-white/80">المصادقة الثنائية</p>
            <p className="text-xs text-white/35 mt-0.5">طبقة حماية إضافية عند تسجيل الدخول</p>
          </div>
          <button
            onClick={() => setTwoFactor((v) => !v)}
            className={cn('h-6 w-11 rounded-full transition-colors relative', twoFactor ? 'bg-brand-primary' : 'bg-white/10')}
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                twoFactor ? 'translate-x-[-1.375rem]' : 'translate-x-[-0.125rem]'
              )}
            />
          </button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm text-white/80">كلمة المرور</p>
            <p className="text-xs text-white/35 mt-0.5">آخر تحديث منذ 45 يوماً</p>
          </div>
          <button className="btn-secondary py-1.5 px-3 text-xs">تغيير</button>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-brand-accent" />
          <h3 className="font-semibold text-sm text-white/85">الإشعارات</h3>
        </div>
        {[
          { key: 'critical' as const, label: 'تنبيهات حرجة', desc: 'إشعارات فورية للحالات عالية الخطورة' },
          { key: 'warning' as const, label: 'تنبيهات تحذيرية', desc: 'إشعارات للحالات متوسطة الخطورة' },
          { key: 'info' as const, label: 'إشعارات عامة', desc: 'تحديثات وإعلانات النظام' },
          { key: 'email' as const, label: 'إشعارات البريد الإلكتروني', desc: 'إرسال نسخة للبريد الوظيفي' },
          { key: 'sms' as const, label: 'إشعارات الرسائل النصية', desc: 'للتنبيهات الحرجة فقط' },
        ].map((item, i, arr) => (
          <div key={item.key} className={cn('flex items-center justify-between py-3', i < arr.length - 1 && 'border-b border-border-subtle')}>
            <div>
              <p className="text-sm text-white/80">{item.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={cn('h-6 w-11 rounded-full transition-colors relative', notifSettings[item.key] ? 'bg-brand-primary' : 'bg-white/10')}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                  notifSettings[item.key] ? 'translate-x-[-1.375rem]' : 'translate-x-[-0.125rem]'
                )}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-brand-accent" />
          <h3 className="font-semibold text-sm text-white/85">المظهر</h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/80">الوضع الداكن</p>
          <span className="badge-info">مفعّل دائماً</span>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-brand-accent" />
          <h3 className="font-semibold text-sm text-white/85">اللغة</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('ar')}
            className={cn('flex-1 rounded-xl border py-2.5 text-sm font-medium', language === 'ar' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-border text-white/50')}
          >
            العربية
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={cn('flex-1 rounded-xl border py-2.5 text-sm font-medium', language === 'en' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-border text-white/50')}
          >
            English
          </button>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary w-full sm:w-auto px-8 py-3">
        {saved ? (
          <>
            <Check className="h-4 w-4" /> تم الحفظ
          </>
        ) : (
          'حفظ التغييرات'
        )}
      </button>
    </div>
  )
}
