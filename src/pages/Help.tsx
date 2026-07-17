import { useState } from 'react'
import { HelpCircle, ChevronDown, Mail, MessageCircle, BookOpen } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/cn'

const faqs = [
  {
    q: 'كيف يعمل نظام كشف الدفعات المضاعفة؟',
    a: 'يقارن الذكاء الاصطناعي في وضُـوح بين المبلغ المعتمد من العميل والمبلغ الفعلي المنفذ من النظام الأساسي في الوقت الحقيقي. عند اكتشاف فرق، يتم فتح حالة تلقائياً مع تحليل مفصل لأسباب الانحراف.',
  },
  {
    q: 'ما الفرق بين تجميد المعاملة وتصعيد الحالة؟',
    a: 'تجميد المعاملة يمنع أي حركة إضافية على المبلغ المتأثر فوراً، بينما تصعيد الحالة ينقلها إلى فريق الامتثال لمراجعة أعمق دون بالضرورة تجميد الأموال.',
  },
  {
    q: 'كيف يتم احتساب درجة الثقة في تحليل الذكاء الاصطناعي؟',
    a: 'يتم احتساب الثقة بناءً على مجموعة من العوامل الموزونة مثل عدم تطابق المبلغ، توقيت المعالجة، سجل العميل، وأثر رأس المال، والتي تظهر تفصيلياً داخل كل حالة.',
  },
  {
    q: 'هل يمكنني تصدير التقارير؟',
    a: 'نعم، يمكن تصدير تقارير الحالات والمعاملات بصيغة CSV من صفحة التقارير، كما يمكن إنشاء تقرير PDF قابل للطباعة من داخل صفحة تفاصيل أي حالة.',
  },
]

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <PageHeader title="مركز المساعدة" description="إجابات على الأسئلة الشائعة حول منصة وضُـوح" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <BookOpen className="h-6 w-6 text-brand-accent mx-auto mb-2.5" />
          <p className="text-sm font-medium text-white/85">دليل الاستخدام</p>
          <p className="text-xs text-white/35 mt-1">شرح تفصيلي لجميع الوحدات</p>
        </div>
        <div className="glass-card p-5 text-center">
          <MessageCircle className="h-6 w-6 text-status-success mx-auto mb-2.5" />
          <p className="text-sm font-medium text-white/85">الدردشة المباشرة</p>
          <p className="text-xs text-white/35 mt-1">تواصل مع فريق الدعم التقني</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Mail className="h-6 w-6 text-status-warning mx-auto mb-2.5" />
          <p className="text-sm font-medium text-white/85">راسلنا</p>
          <p className="text-xs text-white/35 mt-1">ops-support@alinma-ops.internal</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h3 className="font-semibold text-sm text-white/85">الأسئلة الشائعة</h3>
        </div>
        <div className="divide-y divide-border-subtle">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-right hover:bg-white/[0.02]"
              >
                <span className="text-sm font-medium text-white/85">{faq.q}</span>
                <ChevronDown className={cn('h-4 w-4 text-white/30 shrink-0 transition-transform', openIndex === i && 'rotate-180')} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 flex items-start gap-3">
        <HelpCircle className="h-4 w-4 text-brand-accent mt-0.5 shrink-0" />
        <p className="text-xs text-white/45 leading-relaxed">
          هذا نموذج أولي تجريبي تم تطويره لأغراض هاكاثون بنك الإنماء. لأي استفسارات تتعلق بالمسابقة، يرجى التواصل مع
          فريق تنظيم الهاكاثون.
        </p>
      </div>
    </div>
  )
}
