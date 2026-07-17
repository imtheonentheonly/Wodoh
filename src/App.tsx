import { Routes, Route, Navigate } from 'react-router-dom'

import Splash from '@/pages/Splash'
import Login from '@/pages/Login'
import AppLayout from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import AIDashboard from '@/pages/AIDashboard'
import Notifications from '@/pages/Notifications'
import Transactions from '@/pages/Transactions'
import TransactionDetails from '@/pages/TransactionDetails'
import AML from '@/pages/AML'
import TF from '@/pages/TF'
import Cases from '@/pages/Cases'
import CaseDetails from '@/pages/CaseDetails'
import Reports from '@/pages/Reports'
import AuditTrail from '@/pages/AuditTrail'
import Profile from '@/pages/Profile'
import Employees from '@/pages/Employees'
import Roles from '@/pages/Roles'
import SettingsPage from '@/pages/Settings'
import Help from '@/pages/Help'
import NotFound from '@/pages/NotFound'

import CustomerLayout from '@/components/customer/CustomerLayout'
import CustomerLogin from '@/pages/customer/CustomerLogin'
import CustomerHome from '@/pages/customer/CustomerHome'
import CustomerTransfer from '@/pages/customer/CustomerTransfer'
import CustomerTransferConfirm from '@/pages/customer/CustomerTransferConfirm'
import CustomerHistory from '@/pages/customer/CustomerHistory'
import CustomerNotifications from '@/pages/customer/CustomerNotifications'
import CustomerProfile from '@/pages/customer/CustomerProfile'

export default function App() {
  return (
    <Routes>
      {/* Boot flow */}
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />

      {/* Internal Operations Platform */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ai-dashboard" element={<AIDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionDetails />} />
        <Route path="/aml" element={<AML />} />
        <Route path="/tf" element={<TF />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<CaseDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/audit-trail" element={<AuditTrail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Customer Mobile Banking Simulation */}
      <Route element={<CustomerLayout />}>
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/customer/transfer" element={<CustomerTransfer />} />
        <Route path="/customer/transfer/confirm" element={<CustomerTransferConfirm />} />
        <Route path="/customer/history" element={<CustomerHistory />} />
        <Route path="/customer/notifications" element={<CustomerNotifications />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
