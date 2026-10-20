import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import {
  X,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PaymentMethod } from '../../types';

export const KkiapayModal: React.FC = () => {
  const {
    activeModal,
    modalData,
    closeModal,
    recordPayment,
    openModal
  } = useRentFlow();

  if (activeModal !== 'KKIAPAY' || !modalData) return null;

  const schedule = modalData;
  const amountToPay = schedule.balanceRemaining || schedule.totalDue;

  const [provider, setProvider] = useState<'MTN' | 'MOOV' | 'CARD'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('97 45 12 30');
  const [step, setStep] = useState<'INPUT' | 'PENDING_USSD' | 'SUCCESS'>('INPUT');
  const [createdPayment, setCreatedPayment] = useState<any>(null);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PENDING_USSD');

    // Simulate USSD prompt confirmation after 2.5 seconds
    setTimeout(() => {
      const pMethod: PaymentMethod = provider === 'MTN' ? 'KKIAPAY_MTN' : provider === 'MOOV' ? 'KKIAPAY_MOOV' : 'KKIAPAY_CARD';
      const ref = `KKIA-BJ-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const pay = recordPayment({
        scheduleId: schedule.id,
        amount: amountToPay,
        method: pMethod,
        referenceTransaction: ref,
        note: `Paiement en ligne Kkiapay (${provider}) - Bénin`
      });

      setCreatedPayment(pay);
      setStep('SUCCESS');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Kkiapay Header */}
        <div className="bg-[#172554] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
              K
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wide">KKIAPAY</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase">
                  Bénin 229
                </span>
              </div>
              <p className="text-[10px] text-slate-300">Paiement sécurisé par agrégateur certifié</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {step === 'INPUT' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Règlement de loyer : {schedule.monthYear}
                </span>
                <div className="text-3xl font-extrabold text-[#172554] tabular-nums font-mono mt-1">
                  {amountToPay.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {schedule.propertyName} · {schedule.unitName}
                </p>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Choisissez votre moyen de paiement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('MTN')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      provider === 'MTN'
                        ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-yellow-400 text-slate-900 font-black text-xs flex items-center justify-center">
                      M
                    </div>
                    <span className="text-xs font-bold text-slate-900">MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('MOOV')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      provider === 'MOOV'
                        ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      M
                    </div>
                    <span className="text-xs font-bold text-slate-900">Moov Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('CARD')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      provider === 'CARD'
                        ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Carte Visa</span>
                  </button>
                </div>
              </div>

              {/* Phone or card input */}
              {provider !== 'CARD' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Numéro de téléphone {provider === 'MTN' ? 'MTN' : 'Moov'} Bénin
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 font-bold text-xs">
                      +229
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="97 00 00 00"
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Un prompt de validation s'affichera directement sur votre téléphone.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Numéro de carte bancaire
                  </label>
                  <input
                    type="text"
                    defaultValue="4000 1234 5678 9010"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      placeholder="MM/AA"
                    />
                    <input
                      type="password"
                      defaultValue="123"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      placeholder="CVV"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Payer {amountToPay.toLocaleString('fr-FR')} FCFA</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cryptage SSL 256 bits · Agréé Banque Centrale BCEAO</span>
              </div>
            </form>
          )}

          {step === 'PENDING_USSD' && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <Smartphone className="w-7 h-7 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#172554]">
                  En attente de votre validation mobile...
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Veuillez vérifier votre téléphone (+229 {phoneNumber}) et saisir votre code secret {provider === 'MTN' ? 'MTN MoMo' : 'Moov Money'} pour autoriser le paiement de <strong>{amountToPay.toLocaleString('fr-FR')} FCFA</strong>.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 font-mono">
                Transaction en cours sur le réseau {provider === 'MTN' ? 'MTN Bénin' : 'Moov Bénin'}...
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">
                  Paiement réussi avec succès !
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Votre loyer de <strong>{amountToPay.toLocaleString('fr-FR')} FCFA</strong> a été validé.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-left space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Réf. Kkiapay :</span>
                  <span className="font-bold text-slate-900">{createdPayment?.referenceTransaction || 'KKIA-BJ-99201948'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">N° Quittance :</span>
                  <span className="font-bold text-emerald-700">{createdPayment?.receiptNumber || 'QUITT-2026-OCT'}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    if (createdPayment) {
                      openModal('RECEIPT', createdPayment);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Télécharger ma quittance PDF
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
