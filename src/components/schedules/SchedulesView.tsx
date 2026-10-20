import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import {
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowDownToLine,
  Smartphone
} from 'lucide-react';
import { RentSchedule } from '../../types';

export const SchedulesView: React.FC = () => {
  const {
    schedules,
    openModal
  } = useRentFlow();

  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAYE' | 'PARTIEL' | 'EN_RETARD' | 'EN_ATTENTE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Months available
  const availableMonths = Array.from(new Set(schedules.map(s => s.monthYear)));

  const filteredSchedules = schedules.filter(s => {
    const matchesMonth = selectedMonth === 'ALL' || s.monthYear === selectedMonth;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesSearch =
      s.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesStatus && matchesSearch;
  });

  const totalDueFiltered = filteredSchedules.reduce((acc, s) => acc + s.totalDue, 0);
  const totalPaidFiltered = filteredSchedules.reduce((acc, s) => acc + s.amountPaid, 0);
  const totalRemainingFiltered = filteredSchedules.reduce((acc, s) => acc + s.balanceRemaining, 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Gestion financière</span>
            <span aria-hidden="true">·</span>
            <span>Échéancier des loyers</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#F97316]">Paiements & Quittances</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Échéances & Loyers Impayés
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Suivi des encaissements mensuels, calcul automatique des reliquats et émission des quittances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('PAYMENT')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            <CreditCard className="w-4 h-4" />
            <span>+ Enregistrer un encaissement</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total des loyers appelés
          </span>
          <div className="mt-2 text-2xl font-extrabold text-[#172554] tabular-nums font-mono">
            {totalDueFiltered.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {filteredSchedules.length} échéance(s) listée(s)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Total encaissé
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700 tabular-nums font-mono">
            {totalPaidFiltered.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {Math.round((totalPaidFiltered / (totalDueFiltered || 1)) * 100)}% de recouvrement
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Montant restant dû / Impayés
          </span>
          <div className="mt-2 text-2xl font-extrabold text-red-600 tabular-nums font-mono">
            {totalRemainingFiltered.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
          </div>
          <span className="text-[11px] text-red-500 font-medium mt-1 block">
            À relancer ou recouvrer
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filter Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Month selector */}
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#F97316]"
            >
              <option value="ALL">Tous les mois</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Status pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'PAYE', label: 'Soldés' },
                { id: 'PARTIEL', label: 'Partiels' },
                { id: 'EN_RETARD', label: 'En retard' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#172554] font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher locataire, bien..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F97316] w-60"
            />
          </div>
        </div>

        {/* Schedules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Période</th>
                <th className="py-3.5 px-4">Locataire</th>
                <th className="py-3.5 px-4">Logement & Propriété</th>
                <th className="py-3.5 px-4">Date d'échéance</th>
                <th className="py-3.5 px-4 text-right">Montant dû</th>
                <th className="py-3.5 px-4 text-right">Payé</th>
                <th className="py-3.5 px-4 text-right">Reste dû</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-sm">
                    Aucune échéance ne correspond à cette sélection.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map(sched => (
                  <tr key={sched.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-3.5 px-4 font-bold text-[#172554]">
                      {sched.monthYear}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{sched.tenantName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{sched.tenantPhone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{sched.unitName}</div>
                      <div className="text-[11px] text-slate-500">{sched.propertyName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {sched.dueDate}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#172554] tabular-nums font-mono">
                      {sched.totalDue.toLocaleString('fr-FR')} F
                      <span className="block text-[10px] text-slate-400 font-normal">
                        ({sched.rentAmount.toLocaleString('fr-FR')} F + {sched.chargesAmount.toLocaleString('fr-FR')} F)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700 tabular-nums font-mono">
                      {sched.amountPaid.toLocaleString('fr-FR')} F
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold tabular-nums font-mono">
                      <span className={sched.balanceRemaining > 0 ? 'text-red-600' : 'text-slate-400'}>
                        {sched.balanceRemaining.toLocaleString('fr-FR')} F
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sched.status === 'PAYE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : sched.status === 'PARTIEL'
                          ? 'bg-amber-50 text-amber-700'
                          : sched.status === 'EN_RETARD'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {sched.status === 'PAYE' && <CheckCircle2 className="w-3 h-3" />}
                        {sched.status === 'PARTIEL' && <Clock className="w-3 h-3" />}
                        {sched.status === 'EN_RETARD' && <AlertTriangle className="w-3 h-3" />}
                        <span>
                          {sched.status === 'PAYE'
                            ? 'Soldé'
                            : sched.status === 'PARTIEL'
                            ? 'Partiel'
                            : sched.status === 'EN_RETARD'
                            ? 'En retard'
                            : 'En attente'}
                        </span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* If overdue or partial: WhatsApp Reminder button */}
                        {sched.balanceRemaining > 0 && (
                          <button
                            onClick={() => openModal('REMINDER', sched)}
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Relancer par WhatsApp ou SMS"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}

                        {/* If balance remains: Payment button */}
                        {sched.balanceRemaining > 0 && (
                          <button
                            onClick={() => openModal('PAYMENT', sched)}
                            className="px-2.5 py-1 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                          >
                            Encaisser
                          </button>
                        )}

                        {/* If paid or partial: Print receipt */}
                        {sched.amountPaid > 0 && (
                          <button
                            onClick={() => openModal('RECEIPT', {
                              receiptNumber: sched.receiptNumber || 'QUITT-2026-OCT',
                              tenantName: sched.tenantName,
                              amount: sched.amountPaid,
                              date: sched.lastPaymentDate || '2026-10-04',
                              method: 'KKIAPAY_MTN',
                              note: `Loyer ${sched.monthYear} - ${sched.propertyName} (${sched.unitName})`,
                              referenceTransaction: 'KKIA-BJ-99201948'
                            })}
                            className="p-1.5 text-slate-600 hover:text-[#172554] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Consulter la quittance"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
