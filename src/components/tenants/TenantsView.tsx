import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import {
  Users,
  UserPlus,
  FileCheck2,
  Phone,
  Mail,
  Shield,
  Briefcase,
  FileText,
  Search,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Tenant, Lease } from '../../types';

export const TenantsView: React.FC = () => {
  const {
    tenants,
    leases,
    openModal
  } = useRentFlow();

  const [activeTab, setActiveTab] = useState<'TENANTS' | 'LEASES'>('TENANTS');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = tenants.filter(t =>
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery) ||
    (t.currentPropertyName && t.currentPropertyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLeases = leases.filter(l =>
    l.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.unitName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Gestion administrative</span>
            <span aria-hidden="true">·</span>
            <span>{tenants.length} locataires</span>
            <span aria-hidden="true">·</span>
            <span>{leases.length} baux actifs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Locataires & Contrats de Bail
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Répertoire des occupants, pièces d’identité, cautions et conformité juridique (Loi 2021-14 Bénin).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('TENANT')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#F97316]" />
            <span>+ Nouveau locataire</span>
          </button>

          <button
            onClick={() => openModal('LEASE')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>+ Établir un bail</span>
          </button>
        </div>
      </div>

      {/* Toggle View: Locataires vs Baux */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('TENANTS')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'TENANTS'
                  ? 'bg-white text-[#172554] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fiches Locataires ({tenants.length})
            </button>
            <button
              onClick={() => setActiveTab('LEASES')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'LEASES'
                  ? 'bg-white text-[#172554] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contrats de Bail ({leases.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F97316] w-64"
            />
          </div>
        </div>

        {/* TAB 1: TENANTS TABLE */}
        {activeTab === 'TENANTS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Locataire</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Pièce d'identité</th>
                  <th className="py-3.5 px-4">Profession & Employeur</th>
                  <th className="py-3.5 px-4">Logement occupé</th>
                  <th className="py-3.5 px-4 text-right">Caution versée</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                      Aucun locataire trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#172554] text-sm">{tenant.fullName}</div>
                        <div className="text-[11px] text-slate-400">Entrée : {tenant.entryDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono text-slate-800">
                          <Phone className="w-3 h-3 text-[#F97316]" />
                          <span>{tenant.phone}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {tenant.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-slate-700">
                          <Shield className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-bold">{tenant.identityType}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {tenant.identityNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{tenant.profession}</div>
                        <div className="text-[11px] text-slate-400">{tenant.employer}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {tenant.currentUnitNumber ? (
                          <div>
                            <div className="font-bold text-[#172554]">{tenant.currentUnitNumber}</div>
                            <div className="text-[11px] text-slate-500">{tenant.currentPropertyName}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Non assigné</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums font-mono">
                        {tenant.depositAmount.toLocaleString('fr-FR')} F
                        <span className="block text-[10px] text-slate-400 font-normal">
                          ({tenant.depositMonths} mois)
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tenant.status === 'ACTIF'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {tenant.status === 'ACTIF' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>{tenant.status === 'ACTIF' ? 'À jour' : 'En retard'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openModal('REMINDER', {
                            tenantName: tenant.fullName,
                            tenantPhone: tenant.phone,
                            balanceRemaining: 150000,
                            monthYear: 'Octobre 2026',
                            propertyName: tenant.currentPropertyName,
                            unitName: tenant.currentUnitNumber
                          })}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                          title="Message WhatsApp de contact"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>Contacter</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: LEASES TABLE */}
        {activeTab === 'LEASES' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">N° Bail</th>
                  <th className="py-3.5 px-4">Locataire</th>
                  <th className="py-3.5 px-4">Logement & Propriété</th>
                  <th className="py-3.5 px-4">Période du bail</th>
                  <th className="py-3.5 px-4 text-right">Loyer + Charges</th>
                  <th className="py-3.5 px-4">Échéance</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeases.map(lease => (
                  <tr key={lease.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-3.5 px-4 font-mono font-bold text-[#172554]">
                      #{lease.id.toUpperCase()}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {lease.tenantName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{lease.unitName}</div>
                      <div className="text-[11px] text-slate-500">{lease.propertyName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{lease.startDate} au {lease.endDate}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">Bail d'habitation 1 an renouvelable</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#172554] tabular-nums font-mono">
                      {(lease.rentAmount + lease.chargesAmount).toLocaleString('fr-FR')} F
                      <span className="block text-[10px] text-slate-400 font-normal">
                        ({lease.rentAmount.toLocaleString('fr-FR')} F + {lease.chargesAmount.toLocaleString('fr-FR')} F charges)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      Le {lease.paymentDueDay} du mois
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {lease.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openModal('LEASE', lease)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#172554] hover:text-white text-slate-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Imprimer contrat</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
