// Core domain types for Wodoh (وضُـوح)
// AI-Powered Operations Intelligence Platform — Bank Alinma Hackathon Prototype

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type CaseStatus = 'open' | 'investigating' | 'escalated' | 'resolved' | 'closed' | 'frozen'
export type CaseCategory =
  | 'duplicate_payment'
  | 'operational_error'
  | 'reconciliation_mismatch'
  | 'aml'
  | 'terrorist_financing'
  | 'suspicious_transaction'
  | 'system_error'

export type TransactionStatus = 'completed' | 'pending' | 'flagged' | 'reversed' | 'frozen' | 'failed'
export type TransactionType = 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'reconciliation'
export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success'
export type EmployeeRole = 'analyst' | 'senior_analyst' | 'team_lead' | 'compliance_officer' | 'admin'
export type Department = 'operations' | 'aml_compliance' | 'risk_management' | 'it_security' | 'audit'

export interface Customer {
  id: string
  fullNameAr: string
  fullNameEn: string
  accountNumber: string
  iban: string
  balance: number
  accountType: 'individual' | 'business'
  riskProfile: RiskLevel
  kycStatus: 'verified' | 'pending' | 'flagged'
  joinedDate: string
  phone: string
  nationalId: string
  branch: string
}

export interface Transaction {
  id: string
  reference: string
  type: TransactionType
  status: TransactionStatus
  fromAccount: string
  fromName: string
  toAccount: string
  toName: string
  requestedAmount: number
  processedAmount: number
  currency: 'SAR'
  timestamp: string
  channel: 'mobile' | 'internet_banking' | 'branch' | 'atm' | 'core_system'
  hasDiscrepancy: boolean
  discrepancyAmount?: number
  linkedCaseId?: string
  branch: string
  description: string
}

export interface AIExplanationFactor {
  label: string
  detail: string
  weight: number
}

export interface AIAnalysis {
  riskLevel: RiskLevel
  confidence: number
  detectionType: CaseCategory
  summary: string
  factors: AIExplanationFactor[]
  recommendedAction: string
  modelVersion: string
  analyzedAt: string
}

export interface CaseTimelineEvent {
  id: string
  timestamp: string
  actor: string
  actorType: 'system' | 'ai' | 'employee'
  action: string
  detail: string
}

export interface CaseComment {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  timestamp: string
  content: string
  isInternal: boolean
}

export interface CaseAttachment {
  id: string
  name: string
  type: 'pdf' | 'xlsx' | 'image' | 'log'
  size: string
  uploadedBy: string
  uploadedAt: string
}

export interface OperationalCase {
  id: string
  caseNumber: string
  title: string
  titleAr: string
  category: CaseCategory
  status: CaseStatus
  riskLevel: RiskLevel
  createdAt: string
  updatedAt: string
  assignedTo?: string
  assignedToName?: string
  customerId: string
  customerName: string
  transactionId: string
  expectedAmount: number
  actualAmount: number
  difference: number
  capitalImpact: number
  aiAnalysis: AIAnalysis
  timeline: CaseTimelineEvent[]
  comments: CaseComment[]
  attachments: CaseAttachment[]
  relatedTransactionIds: string[]
  complianceNotes: string
  operationsNotes: string
  recoveryRecommendation: string
  priority: 1 | 2 | 3 | 4 | 5
  slaDeadline: string
}

export interface AMLAlert {
  id: string
  alertNumber: string
  customerId: string
  customerName: string
  alertType: 'structuring' | 'unusual_pattern' | 'high_risk_country' | 'pep_match' | 'sanctions_screening' | 'velocity'
  riskScore: number
  status: CaseStatus
  createdAt: string
  amount: number
  description: string
  descriptionAr: string
}

export interface TFAlert {
  id: string
  alertNumber: string
  customerId: string
  customerName: string
  matchType: 'watchlist' | 'sanctions_list' | 'behavioral_pattern' | 'network_analysis'
  matchConfidence: number
  status: CaseStatus
  createdAt: string
  amount: number
  description: string
  descriptionAr: string
}

export interface Notification {
  id: string
  severity: NotificationSeverity
  title: string
  titleAr: string
  message: string
  messageAr: string
  timestamp: string
  read: boolean
  linkedCaseId?: string
  category: CaseCategory | 'general'
}

export interface Employee {
  id: string
  fullNameAr: string
  fullNameEn: string
  employeeId: string
  email: string
  role: EmployeeRole
  department: Department
  avatarInitials: string
  status: 'active' | 'inactive' | 'on_leave'
  casesAssigned: number
  casesResolved: number
  joinedDate: string
  phone: string
  permissions: string[]
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actorName: string
  actorId: string
  action: string
  actionAr: string
  targetType: 'case' | 'transaction' | 'employee' | 'settings' | 'report'
  targetId: string
  ipAddress: string
  details: string
}

export interface DashboardStats {
  todaysTransactions: number
  todaysTransactionsChange: number
  pendingCases: number
  pendingCasesChange: number
  criticalAlerts: number
  criticalAlertsChange: number
  capitalBalance: number
  capitalBalanceChange: number
  dailyReconciliation: number
  reconciliationStatus: 'balanced' | 'discrepancy'
  financialDifference: number
  amlCases: number
  tfCases: number
}

export interface ChartDataPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface CustomerSession {
  customerId: string
  isAuthenticated: boolean
}
