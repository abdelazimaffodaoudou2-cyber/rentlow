import React from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Home,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  MessageSquare,
  FileText,
  UserCheck,
  ChevronRight,
  Calendar,
  Layers
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    properties,
    units,
    tenants,
    schedules,
    payments,
    setActiveTab,
    openModal
  } = useRentFlow();
  const { user } = useAuth();

  // Metrics calculations
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'OCCUPE').length;
  const availableUnits = units.filter(u => u.status === 'DISPONIBLE').length;
  const maintenanceUnits = units.filter(u => u.status === 'TRAVAUX').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Financial calculations for current month (Octobre 2026)
  const currentMonthSchedules = schedules.filter(s => s.monthYear.includes('Octobre 2026'));
  const totalRentDue = currentMonthSchedules.reduce((acc, s) => acc + s.totalDue, 0);
  const totalRentCollected = currentMonthSchedules.reduce((acc, s) => acc + s.amountPaid, 0);
  const totalRentUnpaid = currentMonthSchedules.reduce((acc, s) => acc + s.balanceRemaining, 0);

  // Overdue schedules
  const overdueSchedules = schedules.filter(s => s.status === 'EN_RETARD');
  const partialSchedules = schedules.filter(s => s.status === 'PARTIEL');
  const urgentAlerts = [...overdueSchedules, ...partialSchedules];

  // Subscription quota check
  const maxQuota = user?.subscriptionPlan === 'FREE' ? 2 : user?.subscriptionPlan === 'STARTER' ? 8 : user?.subscriptionPlan === 'PRO' ? 25 : user?.subscriptionPlan === 'BUSINESS' ? 60 : 999;
  const quotaPercentage = Math.min(100, Math.round((totalUnits / maxQuota) * 100));

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome & Quota Alert Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Tableau de bord</span>
            <span aria-hidden="true">·</span>
            <span>Bénin & Afrique francophone</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#F97316]">Mois en cours : Octobre 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Bonjour, {user?.fullName}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Voici la situation financière et locative de votre patrimoine immobilier.
          </p>
        </div>

        {/* Subscription Quota pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Forfait {user?.subscriptionPlan}</span>
            <span className="tabular-nums font-mono text-[#F97316]">
              {totalUnits} / {maxQuota === 999 ? '∞' : maxQuota} logements
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#F97316] h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-[10px] text-slate-500">
              {maxQuota - totalUnits > 0 ? `${maxQuota - totalUnits} places disponibles` : 'Quota atteint'}
            </span>
            <button
              onClick={() => setActiveTab('PRICING')}
              className="text-[10px] font-bold text-[#F97316] hover:underline"
            >
              Changer d’offre
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Loyers Encaissés */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Loyers encaissés (Mois)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172554] tabular-nums font-mono">
              {totalRentCollected.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-slate-500 ml-1">FCFA</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold">
              {Math.round((totalRentCollected / (totalRentDue || 1)) * 100)}%
            </span>
            <span>sur un attendu de {totalRentDue.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        {/* Card 2: Loyers Impayés & Retards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Loyers impayés / retards
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-red-600 tabular-nums font-mono">
              {totalRentUnpaid.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-slate-500 ml-1">FCFA</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-700 font-medium">
            <span>{urgentAlerts.length} locataire(s) en attente de solde</span>
          </div>
        </div>

        {/* Card 3: Taux d'occupation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Taux d'occupation
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#172554] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#172554] tabular-nums font-mono">
              {occupancyRate}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>{occupiedUnits} occupés · {availableUnits} vacants · {maintenanceUnits} travaux</span>
          </div>
        </div>

        {/* Card 4: Patrimoine immobilier */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Biens gérés
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#172554] tabular-nums font-mono">
              {totalProperties}
            </span>
            <span className="text-xs text-slate-500 font-semibold">propriétés</span>
            <span className="text-slate-300">/</span>
            <span className="text-xl font-bold text-[#172554] tabular-nums font-mono">
              {totalUnits}
            </span>
            <span className="text-xs text-slate-500 font-semibold">lots</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Cotonou (Haie Vive, Akpakpa) & Calavi</span>
          </div>
        </div>

      </div>

      {/* Grid: Urgent Overdue Alerts & Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Urgent Overdue Reminders & Collections (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#172554] tracking-tight">
                  Échéances à suivre & Loyers en retard
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Relancez les locataires ou enregistrez directement leurs versements
                </p>
              </div>
              <button
                onClick={() => setActiveTab('SCHEDULES')}
                className="text-xs font-semibold text-[#F97316] hover:text-[#ea580c] flex items-center gap-1 transition-colors"
              >
                <span>Tout afficher</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {urgentAlerts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800">Tous les loyers du mois sont à jour !</p>
                  <p className="text-xs text-slate-500">Aucun impayé constaté pour la période.</p>
                </div>
              ) : (
                urgentAlerts.map(sched => (
                  <div key={sched.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#172554]">
                          {sched.tenantName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sched.status === 'EN_RETARD'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sched.status === 'EN_RETARD' ? 'En retard' : 'Partiellement payé'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{sched.propertyName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sched.unitName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-mono text-slate-600">{sched.tenantPhone}</span>
                      </div>
                      <div className="mt-1 text-xs">
                        <span className="text-slate-500">Reste dû : </span>
                        <span className="font-bold text-red-600 tabular-nums font-mono">
                          {sched.balanceRemaining.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-slate-400 text-[11px] ml-1">
                          (Total : {sched.totalDue.toLocaleString('fr-FR')} FCFA)
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openModal('REMINDER', sched)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors"
                        title="Relance WhatsApp ou SMS"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Relance</span>
                      </button>

                      <button
                        onClick={() => openModal('PAYMENT', sched)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Encaisser</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Échéance standard au Bénin : le 5 de chaque mois civil</span>
            <button
              onClick={() => openModal('LEASE')}
              className="font-semibold text-[#172554] hover:underline"
            >
              + Nouveau contrat de bail
            </button>
          </div>
        </div>

        {/* Right Column: Recent Payments & Properties overview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recent payments ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#172554] tracking-tight">
                  Derniers règlements reçus
                </h3>
                <p className="text-xs text-slate-500">Validations Kkiapay, banques & espèces</p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                Octobre 2026
              </span>
            </div>

            <div className="space-y-3">
              {payments.slice(0, 4).map(pay => (
                <div key={pay.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F97316] flex items-center justify-center font-bold text-xs">
                      {pay.method.includes('KKIAPAY') ? 'KP' : pay.method === 'ESPECES' ? 'ESP' : 'VIR'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172554]">{pay.tenantName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span>{pay.date}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">Reçu #{pay.receiptNumber.slice(-4)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-700 tabular-nums font-mono">
                      +{pay.amount.toLocaleString('fr-FR')} F
                    </div>
                    <button
                      onClick={() => openModal('RECEIPT', pay)}
                      className="text-[10px] text-[#F97316] font-semibold hover:underline flex items-center gap-0.5 ml-auto"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Quittance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Properties Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#172554] tracking-tight">
                Patrimoine immobilier
              </h3>
              <button
                onClick={() => setActiveTab('PROPERTIES')}
                className="text-xs font-semibold text-[#F97316] hover:underline"
              >
                Gérer les biens
              </button>
            </div>

            <div className="space-y-3">
              {properties.map(p => {
                const propUnits = units.filter(u => u.propertyId === p.id);
                const occUnits = propUnits.filter(u => u.status === 'OCCUPE').length;
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#172554]">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.district}, {p.city}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#172554] tabular-nums font-mono">
                        {occUnits}/{propUnits.length} lots
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {Math.round((occUnits / (propUnits.length || 1)) * 100)}% occupation
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
