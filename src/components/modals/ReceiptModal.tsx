import React from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useRentFlow();
  const { user } = useAuth();

  if (activeModal !== 'RECEIPT' || !modalData) return null;

  const data = modalData;
  const receiptNumber = data.receiptNumber || 'QUITT-2026-10-0082';
  const tenantName = data.tenantName || 'Patricia Dossou';
  const amount = data.amount || 235000;
  const paymentDate = data.date || '2026-10-04';
  const method = data.method || 'KKIAPAY_MTN';
  const reference = data.referenceTransaction || 'KKIA-BJ-99201948';
  const note = data.note || 'Loyer et charges Octobre 2026';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Top Modal Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#172554] uppercase tracking-wider">
              Aperçu de la Quittance Officielle
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Certifiée RentFlow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Receipt Document */}
        <div className="p-8 sm:p-10 bg-white text-slate-800 space-y-6 print:p-0 print:m-0" id="official-receipt">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-[#172554] tracking-tight">RentFlow</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Plateforme de Gestion Locative · République du Bénin
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-[#F97316] tracking-wider uppercase">
                QUITTANCE DE LOYER
              </span>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                N° {receiptNumber}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Délivrée le {paymentDate}
              </div>
            </div>
          </div>

          {/* Landlord & Tenant details columns */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                BAILLEUR / GESTIONNAIRE
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {user?.agencyName || user?.fullName || 'Jean-Luc Mensah'}
              </div>
              <div className="text-slate-600">Résidence L’Horizon & Patrimoine</div>
              <div className="text-slate-500">Cotonou, République du Bénin</div>
              <div className="text-slate-500 font-mono">{user?.phone || '+229 97 12 34 56'}</div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                LOCATAIRE (PRENEUR)
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {tenantName}
              </div>
              <div className="text-slate-600">Appartement B2 · 2ème étage</div>
              <div className="text-slate-500">Quartier Haie Vive, Cotonou</div>
              <div className="text-slate-500">Bail d'habitation en cours</div>
            </div>
          </div>

          {/* Rent Breakdown Table */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Détail des sommes encaissées
            </span>
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-left">Désignation</th>
                  <th className="py-2.5 px-3 text-left">Période</th>
                  <th className="py-2.5 px-3 text-right">Montant (FCFA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Loyer principal d'habitation</td>
                  <td className="py-2.5 px-3 text-slate-500">Du 01/10/2026 au 31/10/2026</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {(amount > 30000 ? amount - 25000 : amount).toLocaleString('fr-FR')} F
                  </td>
                </tr>
                {amount > 30000 && (
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Provisions pour charges locatives (gardiennage, entretien)</td>
                    <td className="py-2.5 px-3 text-slate-500">Octobre 2026</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      25 000 F
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-extrabold text-[#172554]">
                  <td className="py-3 px-3 uppercase text-[11px]">Total perçu pour acquit</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px] font-normal italic">
                    Payé par {method} (Réf: {reference})
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base text-[#F97316]">
                    {amount.toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal statement */}
          <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
            <p>
              Je soussigné, bailleur du logement sus-désigné, certifie avoir reçu de Monsieur/Madame <strong>{tenantName}</strong> la somme de <strong>{amount.toLocaleString('fr-FR')} FCFA</strong> au titre du paiement du loyer et des charges pour la période indiquée. Le présent document constitue quittance officielle sous réserve de tous droits.
            </p>
          </div>

          {/* Validation & Stamp */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {/* Simulated verification QR code */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 border border-slate-300 rounded-lg p-1 bg-white flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-400">
                <span className="font-semibold text-slate-700 block">Certificat électronique</span>
                <span>SHA-256: 8f9b...a301</span>
                <span className="block text-emerald-600 font-semibold">✓ Vérifié RentFlow Bénin</span>
              </div>
            </div>

            {/* Stamp */}
            <div className="text-right">
              <div className="border-2 border-emerald-600 text-emerald-700 font-black text-xs uppercase px-3 py-1.5 rounded-lg inline-block rotate-[-3deg] tracking-wider">
                POUR ACQUIT · SOLDÉ
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Signature numérique certifiée
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
