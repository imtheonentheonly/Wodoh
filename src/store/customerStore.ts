// Zustand store — Customer Mobile Banking Simulation
// Represents Mohammed Hamad's fictional mobile banking session.

import { create } from 'zustand'
import { customers } from '@/data/mockData'
import { useOpsStore } from './opsStore'

interface CustomerTxnRecord {
  id: string
  toName: string
  toAccount: string
  amount: number
  timestamp: string
  status: 'processing' | 'completed' | 'error_detected'
  note?: string
}

interface CustomerState {
  isAuthenticated: boolean
  pin: string
  balance: number
  customer: (typeof customers)[number]
  history: CustomerTxnRecord[]
  isTransferring: boolean
  lastTransferError: boolean

  login: (pin: string) => boolean
  logout: () => void
  transfer: (toAccount: string, toName: string, amount: number) => Promise<void>
  clearErrorFlag: () => void
}

const mohammed = customers.find((c) => c.id === 'cust-001')!

export const useCustomerStore = create<CustomerState>((set, get) => ({
  isAuthenticated: false,
  pin: '1234',
  balance: mohammed.balance,
  customer: mohammed,
  history: [
    {
      id: 'ch-1',
      toName: 'فاتورة الجوال',
      toAccount: 'MERCHANT-STC',
      amount: 210,
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'completed',
    },
    {
      id: 'ch-2',
      toName: 'عبدالله سعد',
      toAccount: '4881045521',
      amount: 15000,
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
      status: 'completed',
    },
  ],
  isTransferring: false,
  lastTransferError: false,

  login: (pin: string) => {
    if (pin === get().pin) {
      set({ isAuthenticated: true })
      return true
    }
    return false
  },

  logout: () => set({ isAuthenticated: false }),

  // Simulates the requested SAR 100,000 transfer that the core
  // banking system erroneously duplicates to SAR 200,000.
  transfer: async (toAccount: string, toName: string, amount: number) => {
    set({ isTransferring: true })

    await new Promise((resolve) => setTimeout(resolve, 1800))

    const isIncidentScenario = amount === 100000 && toAccount === '4881033218'
    const actualDebit = isIncidentScenario ? 200000 : amount

    const record: CustomerTxnRecord = {
      id: `ch-${Date.now()}`,
      toName,
      toAccount,
      amount,
      timestamp: new Date().toISOString(),
      status: isIncidentScenario ? 'error_detected' : 'completed',
      note: isIncidentScenario
        ? 'تنبيه: تم رصد فرق في المبلغ المحول من قبل نظام وضُـوح للذكاء الاصطناعي. جاري المراجعة من قبل فريق العمليات.'
        : undefined,
    }

    set((state) => ({
      balance: state.balance - actualDebit,
      history: [record, ...state.history],
      isTransferring: false,
      lastTransferError: isIncidentScenario,
    }))

    if (isIncidentScenario) {
      useOpsStore.getState().runDuplicatePaymentSimulation()
    }
  },

  clearErrorFlag: () => set({ lastTransferError: false }),
}))
