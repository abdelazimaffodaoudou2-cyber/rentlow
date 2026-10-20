import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Printer,
  FileCheck2,
  Building2,
  Scale,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Lease } from '../../types';

export const LeaseContractModal: React.FC = () => {
  const {
    activeModal,
    modalData,
    closeModal,
    units,
    tenants,
    createLease
  } = useRentFlow();
  const { user } = useAuth();

  if (activeModal !== 'LEASE') return null;

  const isCreating = !modalData?.id;

  // New lease form states
  const [selectedUnitId, setSelectedUnitId] = useState(modalData?.unitId || units[0]?.id || '');
  const [selectedTenantId, setSelectedTenantId] = useState(modalData?.tenantId || tenants[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });
  const [rentAmount, setRentAmount] = useState(modalData?.rentAmount || 180000);
  const [chargesAmount, setChargesAmount] = useState(modalData?.chargesAmount || 20000);
  const [depositAmount, setDepositAmount] = useState(modalData?.depositAmount || rentAmount * 3);
  const [dueDay, setDueDay] = useState(5);

  const selectedUnit = units.find(u => u.id === selectedUnitId);
  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !selectedTenant) return;

    createLease({
      unitId: selectedUnit.id,
      unitName: selectedUnit.unitNumber,
      propertyName: selectedUnit.propertyName,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.fullName,
      startDate,
      endDate,
      rentAmount,
      chargesAmount,
      depositAmount,
      paymentDueDay: dueDay,
      status: 'ACTIF',
      termsNotes: 'Bail d’habitation soumis à la Loi n° 2021-14 du Bénin.'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#172554] uppercase tracking-wider">
              {isCreating ? 'Établir un nouveau Contrat de Bail' : 'Contrat de Bail d’Habitation Officiel'}
            </span>
            <span className="text-xs bg-orange-100 text-[#F97316] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Scale className="w-3 h-3" />
              <span>Loi n° 2021-14 Bénin</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer le contrat</span>
              </button>
            )}
            <button
              onClick={closeModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CREATE MODE: Form */}
        {isCreating ? (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Logement à louer
                </label>
                <select
                  value={selectedUnitId}
                  onChange={e => {
                    setSelectedUnitId(e.target.value);
                    const u = units.find(unit => unit.id === e.target.value);
                    if (u) {
                      setRentAmount(u.rentAmount);
                      setChargesAmount(u.chargesAmount);
                      setDepositAmount(u.rentAmount * 3);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.propertyName} — {u.unitNumber} ({u.type}) — {u.rentAmount.toLocaleString('fr-FR')} F
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Locataire
                </label>
                <select
                  value={selectedTenantId}
                  onChange={e => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.phone} · {t.profession})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Date de début du bail
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Date de fin (1 an tacite reconduction)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Loyer mensuel (FCFA)
                </label>
                <input
                  type="number"
                  value={rentAmount}
                  onChange={e => {
                    const r = Number(e.target.value);
                    setRentAmount(r);
                    setDepositAmount(r * 3);
                  }}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Charges mensuelles (FCFA)
                </label>
                <input
                  type="number"
                  value={chargesAmount}
                  onChange={e => setChargesAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Caution légale (Max 3 mois)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#F97316] focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Conformément à la <strong>Loi n° 2021-14 du Bénin</strong> portant bail d'habitation, le cautionnement ou dépôt de garantie ne peut excéder <strong>trois (3) mois de loyer</strong> hors charges.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Générer le contrat de bail</span>
              </button>
            </div>
          </form>
        ) : (
          /* VIEW MODE: Official Printable Document */
          <div className="p-8 sm:p-10 bg-white text-slate-800 space-y-6 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
            
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                RÉPUBLIQUE DU BÉNIN · MINISTÈRE DU CADRE DE VIE
              </div>
              <h1 className="text-lg font-black text-[#172554] tracking-tight uppercase mt-1">
                CONTRAT DE BAIL À USAGE D’HABITATION
              </h1>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Soumis aux dispositions de la Loi n° 2021-14 du 20 décembre 2021 portant bail d’habitation
              </p>
            </div>

            {/* Parties */}
            <div className="space-y-3">
              <div>
                <span className="font-bold text-[#172554] uppercase block">ENTRE LES SOUSSIGNÉS :</span>
                <p className="mt-1 pl-4 border-l-2 border-orange-500">
                  <strong>Monsieur / Société {user?.agencyName || user?.fullName || 'Jean-Luc Mensah'}</strong>, agissant en qualité de Bailleur / Propriétaire des lieux loués, domicilié à Cotonou, Téléphone : {user?.phone || '+229 97 12 34 56'}, ci-après dénommé <strong>« LE BAILLEUR »</strong> d’une part,
                </p>
              </div>

              <div>
                <span className="font-bold text-[#172554] uppercase block">ET :</span>
                <p className="mt-1 pl-4 border-l-2 border-blue-500">
                  <strong>{modalData.tenantName || 'Patricia Dossou'}</strong>, né(e) et titulaire de la pièce d’identité CIP/CNI valide, Téléphone : +229 96 88 77 44, ci-après dénommé(e) <strong>« LE PRENEUR »</strong> d’autre part.
                </p>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="font-bold text-[#172554] uppercase">Article 1 — Objet du contrat et désignation des lieux</h4>
                <p className="text-slate-600 mt-0.5">
                  Le Bailleur donne à bail à usage d'habitation exclusive au Preneur les locaux désignés ci-après : <strong>{modalData.unitName || 'Appartement B2'}</strong>, situé au sein de <strong>{modalData.propertyName || "Résidence L'Horizon"}</strong> à Cotonou, Haie Vive. Le Preneur déclare bien connaître les lieux pour les avoir visités.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#172554] uppercase">Article 2 — Durée et prise d'effet</h4>
                <p className="text-slate-600 mt-0.5">
                  Le présent bail est consenti et accepté pour une durée ferme de <strong>un (1) an</strong>, commençant à courir le <strong>{modalData.startDate || '01/09/2024'}</strong> pour se terminer le <strong>{modalData.endDate || '31/08/2025'}</strong>. Il sera renouvelable par tacite reconduction pour des périodes identiques.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#172554] uppercase">Article 3 — Loyer et charges locatives</h4>
                <p className="text-slate-600 mt-0.5">
                  Le loyer mensuel est fixé à la somme de <strong>{(modalData.rentAmount || 210000).toLocaleString('fr-FR')} FCFA</strong>, plus une provision sur charges de <strong>{(modalData.chargesAmount || 25000).toLocaleString('fr-FR')} FCFA</strong>, soit un montant total exigible de <strong>{((modalData.rentAmount || 210000) + (modalData.chargesAmount || 25000)).toLocaleString('fr-FR')} FCFA</strong>, payable d'avance au plus tard le <strong>{modalData.paymentDueDay || 5}</strong> de chaque mois via Kkiapay (Mobile Money) ou virement bancaire.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#172554] uppercase">Article 4 — Dépôt de garantie (Caution)</h4>
                <p className="text-slate-600 mt-0.5">
                  Conformément aux dispositions de l'article 12 de la Loi n° 2021-14, le Preneur a versé entre les mains du Bailleur la somme de <strong>{(modalData.depositAmount || 630000).toLocaleString('fr-FR')} FCFA</strong>, représentant trois (3) mois de loyer principal à titre de cautionnement.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#172554] uppercase">Article 5 — Clause résolutoire et juridiction compétente</h4>
                <p className="text-slate-600 mt-0.5">
                  À défaut de paiement d'un seul terme de loyer à son échéance exacte, et un mois après une mise en demeure restée infructueuse, le bail sera résilié de plein droit. Tout litige relatif au présent contrat relève de la compétence exclusive du Tribunal de Première Instance de Première Classe de Cotonou.
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block">Pour le Bailleur :</span>
                <span className="text-[10px] text-slate-400">Mention manuscrite « Lu et approuvé »</span>
                <div className="h-16 border-b border-dashed border-slate-400 mt-2 flex items-end pb-1 font-mono text-[11px] text-slate-600">
                  {user?.fullName || 'Jean-Luc Mensah'}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">Pour le Preneur :</span>
                <span className="text-[10px] text-slate-400">Mention manuscrite « Lu et approuvé »</span>
                <div className="h-16 border-b border-dashed border-slate-400 mt-2 flex items-end pb-1 font-mono text-[11px] text-slate-600">
                  {modalData.tenantName || 'Patricia Dossou'}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
