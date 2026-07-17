import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { ChartDataPoint } from '@/types'

export default function AreaTrendChart({
  data,
  color = '#3B82F6',
  valueFormatter,
}: {
  data: ChartDataPoint[]
  color?: string
  valueFormatter?: (v: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="rgba(255,255,255,0.3)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
          width={valueFormatter ? 56 : 32}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
          formatter={(v: number) => [valueFormatter ? valueFormatter(v) : v, 'القيمة']}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#areaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
