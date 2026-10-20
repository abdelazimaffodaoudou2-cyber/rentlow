export type UserRole = 'PROPRIETAIRE' | 'GESTIONNAIRE' | 'LOCATAIRE';

export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  subscriptionPlan: SubscriptionTier;
  agencyName?: string;
  avatarUrl?: string;
  tenantUnitId?: string; // If role is LOCATAIRE
}

export type PropertyType = 'IMMEUBLE' | 'VILLA' | 'RESIDENCE' | 'CONCESSION';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  city: string;
  district: string;
  totalUnits: number;
  photoUrl: string;
  description: string;
  ownerId: string;
  createdAt: string;
}

export type UnitType = 'F1_STUDIO' | 'F2' | 'F3' | 'F4' | 'VILLA_COMPLETE' | 'BOUTIQUE';
export type UnitStatus = 'OCCUPE' | 'DISPONIBLE' | 'TRAVAUX';

export interface Unit {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  type: UnitType;
  rentAmount: number; // in FCFA
  chargesAmount: number; // in FCFA (eau, gardiennage, etc.)
  status: UnitStatus;
  floor: string;
  surfaceM2: number;
  description: string;
  sbeeMeterNumber?: string;
  sonebMeterNumber?: string;
  currentTenantId?: string;
  currentTenantName?: string;
  currentLeaseId?: string;
}

export interface Tenant {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  identityType: 'CIP' | 'CNI' | 'PASSPORT';
  identityNumber: string;
  profession: string;
  employer: string;
  currentUnitId?: string;
  currentPropertyName?: string;
  currentUnitNumber?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  depositMonths: number;
  depositAmount: number; // in FCFA
  entryDate: string;
  status: 'ACTIF' | 'EN_RETARD' | 'ANCIEN';
}

export interface Lease {
  id: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  rentAmount: number; // in FCFA
  chargesAmount: number; // in FCFA
  depositAmount: number; // in FCFA
  paymentDueDay: number; // e.g. 5
  status: 'ACTIF' | 'RESILIE' | 'A_RENOUVELER';
  termsNotes?: string;
}

export type PaymentMethod = 
  | 'KKIAPAY_MTN'
  | 'KKIAPAY_MOOV'
  | 'KKIAPAY_CARD'
  | 'ESPECES'
  | 'VIREMENT_BANCAIRE'
  | 'CHEQUE';

export interface PaymentRecord {
  id: string;
  scheduleId: string;
  tenantId: string;
  tenantName: string;
  amount: number; // in FCFA
  date: string;
  method: PaymentMethod;
  referenceTransaction: string;
  receiptNumber: string;
  note?: string;
}

export type ScheduleStatus = 'PAYE' | 'PARTIEL' | 'EN_ATTENTE' | 'EN_RETARD';

export interface RentSchedule {
  id: string;
  leaseId: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  monthYear: string; // e.g. "Mars 2026"
  dueDate: string; // ISO format "2026-03-05"
  rentAmount: number;
  chargesAmount: number;
  totalDue: number;
  amountPaid: number;
  balanceRemaining: number;
  status: ScheduleStatus;
  lastPaymentDate?: string;
  receiptNumber?: string;
}

export interface PlanInfo {
  tier: SubscriptionTier;
  name: string;
  maxUnits: number;
  monthlyPrice: number; // FCFA
  annualPrice: number; // FCFA
  description: string;
  isPopular?: boolean;
  features: string[];
}
