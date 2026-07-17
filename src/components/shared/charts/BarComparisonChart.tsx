import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { ChartDataPoint } from '@/types'

export default function BarComparisonChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} width={28} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} name="حالات حرجة" />
        <Bar dataKey="secondaryValue" fill="#3B82F6" radius={[6, 6, 0, 0]} name="حالات محلولة" />
      </BarChart>
    </ResponsiveContainer>
  )
}
