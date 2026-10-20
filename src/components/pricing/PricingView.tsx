import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRentFlow } from '../../context/RentFlowContext';
import { SUBSCRIPTION_PLANS } from '../../data/mockData';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Building2,
  Zap,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { SubscriptionTier } from '../../types';

export const PricingView: React.FC = () => {
  const { user, updateSubscriptionPlan } = useAuth();
  const { units, showToast } = useRentFlow();

  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');

  const handleSelectPlan = (tier: SubscriptionTier) => {
    updateSubscriptionPlan(tier);
    showToast(`Votre compte a été configuré avec le forfait ${tier} avec succès !`);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-[#F97316] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Modèle SaaS Évolutif</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
          Des forfaits adaptés au nombre de vos logements
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Commencez gratuitement jusqu’à 2 logements, puis passez à une formule supérieure à mesure que votre patrimoine s’agrandit au Bénin et en Afrique de l’Ouest.
        </p>

        {/* Billing cycle toggle */}
        <div className="mt-8 inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              billingCycle === 'MONTHLY'
                ? 'bg-white text-[#172554] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paiement Mensuel
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('ANNUAL')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              billingCycle === 'ANNUAL'
                ? 'bg-[#172554] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Paiement Annuel</span>
            <span className="bg-[#F97316] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              2 mois offerts 🎉
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {SUBSCRIPTION_PLANS.map(plan => {
          const isCurrent = user?.subscriptionPlan === plan.tier;
          const price = billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.tier}
              className={`relative bg-white rounded-2xl border flex flex-col justify-between transition-all ${
                plan.isPopular
                  ? 'border-[#F97316] ring-2 ring-orange-500/20 shadow-xl lg:-translate-y-2'
                  : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  Le plus populaire
                </div>
              )}

              <div className="p-6">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Forfait
                </div>
                <h3 className="text-xl font-extrabold text-[#172554] mt-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 min-h-[36px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Capacity badge */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs font-bold text-[#172554]">
                    {plan.maxUnits >= 999 ? 'Plus de 60 logements' : `Jusqu'à ${plan.maxUnits} logements`}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-6 mb-6">
                  {plan.tier === 'FREE' ? (
                    <div>
                      <span className="text-3xl font-extrabold text-[#172554] tracking-tight">
                        0 FCFA
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">Gratuit pour toujours</span>
                    </div>
                  ) : plan.tier === 'ENTERPRISE' ? (
                    <div>
                      <span className="text-2xl font-extrabold text-[#172554] tracking-tight">
                        Sur devis
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">Selon la taille du parc</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#172554] tabular-nums font-mono">
                          {price.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-xs font-bold text-slate-500">FCFA</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {billingCycle === 'ANNUAL' ? '/ an (facturé annuellement)' : '/ mois'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-5">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.tier)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : plan.isPopular
                      ? 'bg-[#F97316] hover:bg-[#ea580c] text-white shadow-md shadow-orange-500/20'
                      : 'bg-[#172554] hover:bg-[#1e3a8a] text-white'
                  }`}
                >
                  {isCurrent ? (
                    <span>Forfait actif</span>
                  ) : (
                    <>
                      <span>Choisir ce forfait</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trust & FAQ footer info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#172554] text-center mb-6">
          Questions fréquentes sur les forfaits RentFlow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-[#172554] mb-1.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F97316]" />
              <span>Comment fonctionne le forfait gratuit ?</span>
            </h4>
            <p className="leading-relaxed">
              Le forfait FREE vous permet de gérer jusqu’à 2 logements sans aucune limite de temps ni carte bancaire requise. Vous pouvez migrer vers un forfait supérieur en 1 clic.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#172554] mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#F97316]" />
              <span>Quels sont les moyens de paiement acceptés ?</span>
            </h4>
            <p className="leading-relaxed">
              Vous pouvez régler vos abonnements ainsi que vos loyers via Kkiapay en utilisant MTN Mobile Money, Moov Money Bénin, ou par Carte Bancaire Visa / Mastercard.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#172554] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>Puis-je changer ou annuler mon forfait ?</span>
            </h4>
            <p className="leading-relaxed">
              Oui, vous pouvez ajuster votre formule selon l’évolution de votre parc immobilier à tout moment depuis votre tableau de bord.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
