// Lightweight client-side export utilities (CSV + printable PDF-style report)
// No external PDF library dependency — uses the browser print pipeline for a
// clean, professional printable report opened in a new tab.

import type { OperationalCase } from '@/types'
import { formatCurrency, formatDateTime } from './formatters'

export function generateCasePDF(caseData: OperationalCase) {
  const win = window.open('', '_blank')
  if (!win) return

  win.document.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <title>${caseData.caseNumber} — وضُـوح</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #fff; color: #0F172A; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        .muted { color: #64748B; font-size: 12px; }
        .header { border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: #FEE2E2; color: #EF4444; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
        .card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; }
        .label { font-size: 11px; color: #64748B; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; }
        .section-title { font-size: 14px; font-weight: 700; margin: 24px 0 10px; }
        .factor { border-right: 3px solid #2563EB; padding: 8px 12px; margin-bottom: 8px; background: #F8FAFC; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        td, th { text-align: right; padding: 8px; border-bottom: 1px solid #E2E8F0; font-size: 12px; }
        .footer { margin-top: 40px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>وضُـوح — تقرير حالة تشغيلية</h1>
          <p class="muted">${caseData.caseNumber} · بنك الإنماء</p>
        </div>
        <span class="badge">${caseData.riskLevel.toUpperCase()}</span>
      </div>

      <h2>${caseData.titleAr}</h2>
      <p class="muted">العميل: ${caseData.customerName} · تاريخ الإنشاء: ${formatDateTime(caseData.createdAt)}</p>

      <div class="grid">
        <div class="card"><div class="label">المبلغ المتوقع</div><div class="value">${formatCurrency(caseData.expectedAmount)}</div></div>
        <div class="card"><div class="label">المبلغ الفعلي</div><div class="value">${formatCurrency(caseData.actualAmount)}</div></div>
        <div class="card"><div class="label">الفرق</div><div class="value">${formatCurrency(caseData.difference)}</div></div>
        <div class="card"><div class="label">تأثير رأس المال</div><div class="value">${formatCurrency(caseData.capitalImpact)}</div></div>
      </div>

      <div class="section-title">تحليل الذكاء الاصطناعي (ثقة ${caseData.aiAnalysis.confidence}%)</div>
      <p>${caseData.aiAnalysis.summary}</p>
      ${caseData.aiAnalysis.factors
        .map((f) => `<div class="factor"><strong>${f.label}</strong> (${f.weight}%)<br/><span class="muted">${f.detail}</span></div>`)
        .join('')}

      <div class="section-title">الإجراء الموصى به</div>
      <p>${caseData.aiAnalysis.recommendedAction}</p>

      <div class="section-title">الجدول الزمني</div>
      <table>
        <thead><tr><th>الوقت</th><th>الجهة</th><th>الإجراء</th></tr></thead>
        <tbody>
          ${caseData.timeline
            .map((t) => `<tr><td>${formatDateTime(t.timestamp)}</td><td>${t.actor}</td><td>${t.action}</td></tr>`)
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        نموذج أولي تجريبي — هاكاثون بنك الإنماء. تم إنشاء هذا التقرير بواسطة منصة وضُـوح لذكاء العمليات المصرفية.
        <br/>تاريخ الإصدار: ${formatDateTime(new Date().toISOString())}
      </div>
    </body>
    </html>
  `)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 400)
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
