import React, { createContext, useContext, useState } from 'react';
import {
  Property,
  Unit,
  Tenant,
  Lease,
  RentSchedule,
  PaymentRecord,
  PaymentMethod,
  SubscriptionTier
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_LEASES,
  INITIAL_SCHEDULES,
  INITIAL_PAYMENTS
} from '../data/mockData';

export type NavigationTab = 
  | 'DASHBOARD'
  | 'PROPERTIES'
  | 'TENANTS'
  | 'SCHEDULES'
  | 'TENANT_PORTAL'
  | 'PRICING';

export type ModalType = 
  | 'PAYMENT' 
  | 'RECEIPT' 
  | 'LEASE' 
  | 'REMINDER' 
  | 'PROPERTY' 
  | 'UNIT' 
  | 'TENANT' 
  | 'KKIAPAY' 
  | 'PLAN_CHANGE';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface RentFlowContextType {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  leases: Lease[];
  schedules: RentSchedule[];
  payments: PaymentRecord[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedPropertyFilter: string;
  setSelectedPropertyFilter: (id: string) => void;
  
  // Modals
  activeModal: ModalType | null;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  
  // Toast notifications
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // CRUD actions
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  addTenant: (tenant: Omit<Tenant, 'id'>) => void;
  createLease: (leaseData: Omit<Lease, 'id'>) => void;
  recordPayment: (params: {
    scheduleId: string;
    amount: number;
    method: PaymentMethod;
    referenceTransaction: string;
    note?: string;
  }) => PaymentRecord;
  updateSubscription: (tier: SubscriptionTier) => void;
  
  // Utilities
  getUnitById: (unitId: string) => Unit | undefined;
  getTenantById: (tenantId: string) => Tenant | undefined;
  getLeaseById: (leaseId: string) => Lease | undefined;
  getScheduleById: (scheduleId: string) => RentSchedule | undefined;
}

const RentFlowContext = createContext<RentFlowContextType | undefined>(undefined);

export const RentFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [leases, setLeases] = useState<Lease[]>(INITIAL_LEASES);
  const [schedules, setSchedules] = useState<RentSchedule[]>(INITIAL_SCHEDULES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('ALL');

  // Modal system
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Toast
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const openModal = (type: ModalType, data?: any) => {
    setActiveModal(type);
    setModalData(data || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const addProperty = (newProp: Omit<Property, 'id' | 'createdAt'>) => {
    const created: Property = {
      ...newProp,
      id: `prop_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProperties(prev => [created, ...prev]);
    showToast(`La propriété "${created.name}" a été ajoutée avec succès.`);
    closeModal();
  };

  const addUnit = (newUnit: Omit<Unit, 'id'>) => {
    const created: Unit = {
      ...newUnit,
      id: `unit_${Date.now()}`
    };
    setUnits(prev => [...prev, created]);
    // update property unit count
    setProperties(prev =>
      prev.map(p =>
        p.id === created.propertyId ? { ...p, totalUnits: p.totalUnits + 1 } : p
      )
    );
    showToast(`Le logement "${created.unitNumber}" a été créé avec succès.`);
    closeModal();
  };

  const addTenant = (newTenant: Omit<Tenant, 'id'>) => {
    const created: Tenant = {
      ...newTenant,
      id: `tenant_${Date.now()}`
    };
    setTenants(prev => [created, ...prev]);

    // If unit is assigned, update unit status
    if (created.currentUnitId) {
      setUnits(prev =>
        prev.map(u =>
          u.id === created.currentUnitId
            ? {
                ...u,
                status: 'OCCUPE',
                currentTenantId: created.id,
                currentTenantName: created.fullName
              }
            : u
        )
      );
    }
    showToast(`Locataire ${created.fullName} enregistré.`);
    closeModal();
  };

  const createLease = (leaseData: Omit<Lease, 'id'>) => {
    const createdLease: Lease = {
      ...leaseData,
      id: `lease_${Date.now()}`
    };
    setLeases(prev => [createdLease, ...prev]);

    // Update unit
    setUnits(prev =>
      prev.map(u =>
        u.id === createdLease.unitId
          ? {
              ...u,
              status: 'OCCUPE',
              currentTenantId: createdLease.tenantId,
              currentTenantName: createdLease.tenantName,
              currentLeaseId: createdLease.id
            }
          : u
      )
    );

    // Create current month schedule
    const now = new Date();
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const currentMonthYear = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const dueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(createdLease.paymentDueDay).padStart(2, '0')}`;

    const newSchedule: RentSchedule = {
      id: `sched_${Date.now()}`,
      leaseId: createdLease.id,
      unitId: createdLease.unitId,
      unitName: createdLease.unitName,
      propertyName: createdLease.propertyName,
      tenantId: createdLease.tenantId,
      tenantName: createdLease.tenantName,
      tenantPhone: tenants.find(t => t.id === createdLease.tenantId)?.phone || '+229 97 00 00 00',
      monthYear: currentMonthYear,
      dueDate: dueDate,
      rentAmount: createdLease.rentAmount,
      chargesAmount: createdLease.chargesAmount,
      totalDue: createdLease.rentAmount + createdLease.chargesAmount,
      amountPaid: 0,
      balanceRemaining: createdLease.rentAmount + createdLease.chargesAmount,
      status: 'EN_ATTENTE'
    };

    setSchedules(prev => [newSchedule, ...prev]);
    showToast(`Contrat de bail créé pour ${createdLease.tenantName}.`);
    closeModal();
  };

  const recordPayment = ({
    scheduleId,
    amount,
    method,
    referenceTransaction,
    note
  }: {
    scheduleId: string;
    amount: number;
    method: PaymentMethod;
    referenceTransaction: string;
    note?: string;
  }): PaymentRecord => {
    const targetSchedule = schedules.find(s => s.id === scheduleId);
    if (!targetSchedule) {
      throw new Error('Échéance introuvable');
    }

    const receiptNum = `QUITT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      scheduleId,
      tenantId: targetSchedule.tenantId,
      tenantName: targetSchedule.tenantName,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      referenceTransaction,
      receiptNumber: receiptNum,
      note: note || `Règlement échéance ${targetSchedule.monthYear}`
    };

    // Update schedules
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === scheduleId) {
          const newAmountPaid = s.amountPaid + amount;
          const newBalance = Math.max(0, s.totalDue - newAmountPaid);
          const newStatus = newBalance === 0 ? 'PAYE' : 'PARTIEL';
          return {
            ...s,
            amountPaid: newAmountPaid,
            balanceRemaining: newBalance,
            status: newStatus,
            lastPaymentDate: newPayment.date,
            receiptNumber: receiptNum
          };
        }
        return s;
      })
    );

    // Update tenant status if paid in full
    setTenants(prev =>
      prev.map(t => {
        if (t.id === targetSchedule.tenantId) {
          return { ...t, status: 'ACTIF' };
        }
        return t;
      })
    );

    setPayments(prev => [newPayment, ...prev]);
    showToast(`Paiement de ${amount.toLocaleString('fr-FR')} FCFA validé. Quittance N° ${receiptNum} générée !`);
    return newPayment;
  };

  const updateSubscription = (tier: SubscriptionTier) => {
    showToast(`Votre formule d’abonnement a été mise à niveau vers ${tier} !`);
    closeModal();
  };

  const getUnitById = (id: string) => units.find(u => u.id === id);
  const getTenantById = (id: string) => tenants.find(t => t.id === id);
  const getLeaseById = (id: string) => leases.find(l => l.id === id);
  const getScheduleById = (id: string) => schedules.find(s => s.id === id);

  return (
    <RentFlowContext.Provider
      value={{
        properties,
        units,
        tenants,
        leases,
        schedules,
        payments,
        activeTab,
        setActiveTab,
        selectedPropertyFilter,
        setSelectedPropertyFilter,
        activeModal,
        modalData,
        openModal,
        closeModal,
        toast,
        showToast,
        addProperty,
        addUnit,
        addTenant,
        createLease,
        recordPayment,
        updateSubscription,
        getUnitById,
        getTenantById,
        getLeaseById,
        getScheduleById
      }}
    >
      {children}
    </RentFlowContext.Provider>
  );
};

export const useRentFlow = () => {
  const context = useContext(RentFlowContext);
  if (!context) {
    throw new Error('useRentFlow must be used within a RentFlowProvider');
  }
  return context;
};
