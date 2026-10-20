import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { PaymentMethod, RentSchedule } from '../../types';
import {
  X,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    activeModal,
    modalData,
    closeModal,
    schedules,
    recordPayment,
    openModal
  } = useRentFlow();

  if (activeModal !== 'PAYMENT') return null;

  // Selected schedule
  const initialScheduleId = modalData?.id || (schedules.find(s => s.balanceRemaining > 0)?.id || schedules[0]?.id);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(initialScheduleId);

  const currentSchedule = schedules.find(s => s.id === selectedScheduleId);

  const [amount, setAmount] = useState<number>(currentSchedule?.balanceRemaining || currentSchedule?.totalDue || 150000);
  const [method, setMethod] = useState<PaymentMethod>('KKIAPAY_MTN');
  const [refTransaction, setRefTransaction] = useState<string>(`MAN-${Date.now().toString().slice(-6)}`);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSchedule || amount <= 0) return;

    setLoading(true);
    setTimeout(() => {
      const payment = recordPayment({
        scheduleId: currentSchedule.id,
        amount,
        method,
        referenceTransaction: refTransaction,
        note: note || `Règlement loyer ${currentSchedule.monthYear}`
      });
      setLoading(false);
      closeModal();
      // Optionally open receipt
      openModal('RECEIPT', payment);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F97316] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                Enregistrer un encaissement de loyer
              </h3>
              <p className="text-xs text-slate-500">
                Génération immédiate de la quittance officielle
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Select schedule */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Échéance concernée
            </label>
            <select
              value={selectedScheduleId}
              onChange={e => {
                setSelectedScheduleId(e.target.value);
                const s = schedules.find(sched => sched.id === e.target.value);
                if (s) setAmount(s.balanceRemaining || s.totalDue);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
            >
              {schedules.map(sched => (
                <option key={sched.id} value={sched.id}>
                  {sched.monthYear} — {sched.tenantName} ({sched.unitName}, {sched.propertyName}) — Reste: {sched.balanceRemaining.toLocaleString('fr-FR')} F
                </option>
              ))}
            </select>
          </div>

          {currentSchedule && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Total attendu :</span>
                <span className="font-bold text-[#172554] tabular-nums font-mono">{currentSchedule.totalDue.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Déjà réglé :</span>
                <span className="font-bold text-emerald-700 tabular-nums font-mono">{currentSchedule.amountPaid.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Reste dû :</span>
                <span className="text-red-600 tabular-nums font-mono">{currentSchedule.balanceRemaining.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          )}

          {/* Amount to pay */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Montant versé (FCFA)
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min={1000}
              max={currentSchedule ? currentSchedule.balanceRemaining || currentSchedule.totalDue : 10000000}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#172554] font-mono focus:outline-none focus:border-[#F97316]"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Mode de paiement
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'KKIAPAY_MTN', label: 'MTN Mobile Money' },
                { id: 'KKIAPAY_MOOV', label: 'Moov Money Bénin' },
                { id: 'VIREMENT_BANCAIRE', label: 'Virement bancaire (BOA/Eco)' },
                { id: 'ESPECES', label: 'Espèces / Main propre' },
                { id: 'KKIAPAY_CARD', label: 'Carte Bancaire (UEMOA)' },
                { id: 'CHEQUE', label: 'Chèque certifié' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as PaymentMethod)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    method === m.id
                      ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reference and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Réf. Transaction / Reçu
              </label>
              <input
                type="text"
                value={refTransaction}
                onChange={e => setRefTransaction(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Note facultative
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ex: Reçu en main propre"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider l'encaissement</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
