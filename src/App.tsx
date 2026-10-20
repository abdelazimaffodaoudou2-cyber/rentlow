import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RentFlowProvider, useRentFlow } from './context/RentFlowContext';
import { AuthPage } from './components/auth/AuthPage';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PropertiesView } from './components/properties/PropertiesView';
import { TenantsView } from './components/tenants/TenantsView';
import { SchedulesView } from './components/schedules/SchedulesView';
import { TenantPortalView } from './components/tenant-portal/TenantPortalView';
import { PricingView } from './components/pricing/PricingView';

// Modals
import { PaymentModal } from './components/modals/PaymentModal';
import { KkiapayModal } from './components/modals/KkiapayModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { LeaseContractModal } from './components/modals/LeaseContractModal';
import { ReminderModal } from './components/modals/ReminderModal';
import { PropertyModal } from './components/modals/PropertyModal';
import { UnitModal } from './components/modals/UnitModal';
import { TenantModal } from './components/modals/TenantModal';

import { CheckCircle2, AlertCircle, Info, Building2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { activeTab, toast } = useRentFlow();

  // Enforce mandatory authentication before entering platform
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-between text-slate-800">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex-1">
        {activeTab === 'DASHBOARD' && <DashboardView />}
        {activeTab === 'PROPERTIES' && <PropertiesView />}
        {activeTab === 'TENANTS' && <TenantsView />}
        {activeTab === 'SCHEDULES' && <SchedulesView />}
        {activeTab === 'TENANT_PORTAL' && <TenantPortalView />}
        {activeTab === 'PRICING' && <PricingView />}
      </main>

      {/* Global Modals */}
      <PaymentModal />
      <KkiapayModal />
      <ReceiptModal />
      <LeaseContractModal />
      <ReminderModal />
      <PropertyModal />
      <UnitModal />
      <TenantModal />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#172554] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#F97316] shrink-0" />}
          <div className="text-xs leading-snug">{toast.message}</div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#F97316] flex items-center justify-center text-white">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[#172554]">RentFlow Bénin</span>
            <span aria-hidden="true">·</span>
            <span>La gestion locative simplifiée</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Conforme Loi n° 2021-14 sur le bail d'habitation au Bénin</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Paiements Kkiapay certifiés</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 RentFlow SaaS</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RentFlowProvider>
        <MainAppContent />
      </RentFlowProvider>
    </AuthProvider>
  );
}
