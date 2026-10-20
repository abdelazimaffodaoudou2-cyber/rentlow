import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRentFlow } from '../../context/RentFlowContext';
import {
  Home,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Send,
  Zap,
  Droplets,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';

export const TenantPortalView: React.FC = () => {
  const { user } = useAuth();
  const {
    units,
    leases,
    schedules,
    payments,
    openModal,
    showToast
  } = useRentFlow();

  // Find tenant data based on current logged in user or default to Patricia Dossou
  const tenantEmail = user?.email || 'patricia.dossou@gmail.com';
  const tenantName = user?.fullName || 'Patricia Dossou';

  // Identify tenant unit and lease
  const tenantUnit = units.find(u => u.id === 'unit_102') || units[1];
  const tenantLease = leases.find(l => l.unitId === tenantUnit.id) || leases[1];
  const tenantSchedules = schedules.filter(s => s.unitId === tenantUnit.id);
  const currentSchedule = tenantSchedules.find(s => s.monthYear.includes('Octobre 2026')) || tenantSchedules[0];

  // Incident report form state
  const [incidentSubject, setIncidentSubject] = useState('');
  const [incidentMessage, setIncidentMessage] = useState('');
  const [incidentSent, setIncidentSent] = useState(false);

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentSubject || !incidentMessage) return;
    setIncidentSent(true);
    showToast('Votre message a bien été transmis au gestionnaire de la résidence.');
    setTimeout(() => {
      setIncidentSubject('');
      setIncidentMessage('');
      setIncidentSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner for Tenant */}
      <div className="bg-gradient-to-r from-[#172554] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-[#F97316] border border-orange-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Espace Locataire RentFlow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenue, {tenantName}
          </h1>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed">
            Consultez votre bail, téléchargez vos quittances de loyer officielles et réglez vos échéances en ligne par MTN Mobile Money, Moov Money ou Carte Bancaire.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Building className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Main Grid: Rent Status & Apartment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Rent Due Card & Kkiapay Online Payment CTA (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Current Month Rent Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Échéance en cours
                </span>
                <h2 className="text-xl font-bold text-[#172554] tracking-tight">
                  {currentSchedule?.monthYear || 'Octobre 2026'}
                </h2>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                currentSchedule?.status === 'PAYE'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {currentSchedule?.status === 'PAYE' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                <span>{currentSchedule?.status === 'PAYE' ? 'Loyer soldé' : 'En attente de paiement'}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <span className="text-xs text-slate-500">Loyer mensuel</span>
                <div className="text-lg font-bold text-[#172554] tabular-nums font-mono mt-0.5">
                  {tenantUnit.rentAmount.toLocaleString('fr-FR')} F
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Charges locatives</span>
                <div className="text-lg font-bold text-slate-700 tabular-nums font-mono mt-0.5">
                  +{tenantUnit.chargesAmount.toLocaleString('fr-FR')} F
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Reste à payer</span>
                <div className="text-xl font-extrabold text-[#F97316] tabular-nums font-mono mt-0.5">
                  {currentSchedule?.balanceRemaining.toLocaleString('fr-FR')} F
                </div>
              </div>
            </div>

            {/* Online Payment Call-to-Action (Kkiapay) */}
            {currentSchedule?.balanceRemaining && currentSchedule.balanceRemaining > 0 ? (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#F97316]" />
                    <span className="text-sm font-bold text-[#172554]">
                      Payer en ligne via Kkiapay
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    MTN Mobile Money, Moov Money ou Carte bancaire (0% frais de retard)
                  </p>
                </div>
                <button
                  onClick={() => openModal('KKIAPAY', currentSchedule)}
                  className="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0"
                >
                  Payer {currentSchedule.balanceRemaining.toLocaleString('fr-FR')} FCFA
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-emerald-900">
                      Vous êtes à jour de vos loyers !
                    </span>
                    <p className="text-xs text-emerald-700">
                      Votre quittance pour {currentSchedule?.monthYear} est disponible.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModal('RECEIPT', {
                    receiptNumber: currentSchedule?.receiptNumber || 'QUITT-2026-10-0082',
                    tenantName,
                    amount: currentSchedule?.amountPaid || 235000,
                    date: currentSchedule?.lastPaymentDate || '2026-10-04',
                    method: 'KKIAPAY_MTN',
                    note: `Loyer ${currentSchedule?.monthYear} - ${tenantUnit.propertyName} (${tenantUnit.unitNumber})`,
                    referenceTransaction: 'KKIA-BJ-99201948'
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Quittance PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Previous Receipts List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-[#172554] tracking-tight mb-4">
              Historique de vos quittances de loyer
            </h3>

            <div className="space-y-3">
              {tenantSchedules.map(sched => (
                <div key={sched.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#172554]">
                      <FileText className="w-4 h-4 text-[#F97316]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172554]">{sched.monthYear}</div>
                      <div className="text-[11px] text-slate-500">
                        {sched.amountPaid > 0 ? `Payé le ${sched.lastPaymentDate || '04/10/2026'}` : 'En attente'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 tabular-nums font-mono">
                      {sched.totalDue.toLocaleString('fr-FR')} FCFA
                    </span>
                    <button
                      onClick={() => openModal('RECEIPT', {
                        receiptNumber: sched.receiptNumber || 'QUITT-2026-001',
                        tenantName,
                        amount: sched.totalDue,
                        date: sched.lastPaymentDate || '2026-10-04',
                        method: 'KKIAPAY_MTN',
                        note: `Loyer ${sched.monthYear} - ${tenantUnit.propertyName} (${tenantUnit.unitNumber})`,
                        referenceTransaction: 'KKIA-BJ-99201948'
                      })}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#172554] hover:bg-white rounded-lg border border-slate-200 transition-colors"
                    >
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Lease Details & Landlord Contact (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Apartment Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-[#172554] tracking-tight mb-4">
              Votre logement
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Résidence</span>
                <span className="font-bold text-[#172554]">{tenantUnit.propertyName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Lot & Étage</span>
                <span className="font-bold text-[#172554]">{tenantUnit.unitNumber} ({tenantUnit.floor})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Type de bien</span>
                <span className="font-bold text-[#172554]">{tenantUnit.type} · {tenantUnit.surfaceM2} m²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Compteur SBEE (Électricité)</span>
                <span className="font-mono text-slate-800 font-semibold">{tenantUnit.sbeeMeterNumber || 'SBEE-CTN-88413'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Compteur SONEB (Eau)</span>
                <span className="font-mono text-slate-800 font-semibold">{tenantUnit.sonebMeterNumber || 'SONEB-99322'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Bail contractuel</span>
                <button
                  onClick={() => openModal('LEASE', tenantLease)}
                  className="font-bold text-[#F97316] hover:underline"
                >
                  Consulter mon contrat de bail
                </button>
              </div>
            </div>
          </div>

          {/* Contact & Incident declaration form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-[#172554] tracking-tight mb-1">
              Contacter le gestionnaire
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Signalez un problème technique (plomberie, serrurerie, etc.) ou posez une question.
            </p>

            {incidentSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Message transmis avec succès ! Le gestionnaire vous recontactera rapidement.</span>
              </div>
            ) : (
              <form onSubmit={handleIncidentSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Objet de la demande
                  </label>
                  <input
                    type="text"
                    value={incidentSubject}
                    onChange={e => setIncidentSubject(e.target.value)}
                    placeholder="Ex: Problème de climatiseur / Fuite d'eau"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Description détaillée
                  </label>
                  <textarea
                    rows={3}
                    value={incidentMessage}
                    onChange={e => setIncidentMessage(e.target.value)}
                    placeholder="Précisez la pièce et les détails de l'incident..."
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer au gestionnaire</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
