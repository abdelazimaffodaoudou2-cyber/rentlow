import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  MessageSquare,
  Copy,
  ExternalLink,
  Check,
  Send,
  Smartphone
} from 'lucide-react';

export const ReminderModal: React.FC = () => {
  const { activeModal, modalData, closeModal, showToast } = useRentFlow();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'REMINDER' || !modalData) return null;

  const tenantName = modalData.tenantName || 'Marc Kpovi';
  const tenantPhone = modalData.tenantPhone || '+229 97 45 12 30';
  const rawPhone = tenantPhone.replace(/[^0-9]/g, '');
  const monthYear = modalData.monthYear || 'Octobre 2026';
  const amount = modalData.balanceRemaining || modalData.totalDue || 200000;
  const unitName = modalData.unitName || 'Appartement A1';
  const propertyName = modalData.propertyName || "Résidence L'Horizon";
  const landlordName = user?.fullName || 'Jean-Luc Mensah';

  const defaultMessage = `Bonjour ${tenantName}, sauf erreur de notre part, le loyer du mois de ${monthYear} pour votre logement (${unitName} - ${propertyName}) présente un solde restant dû de ${amount.toLocaleString('fr-FR')} FCFA. Nous vous prions de bien vouloir régulariser votre situation via Kkiapay (Mobile Money MTN / Moov) ou virement bancaire. Restant à votre écoute, bien cordialement. — ${landlordName} (RentFlow)`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    showToast('Message de relance copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppOpen = () => {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${rawPhone}?text=${encoded}`;
    window.open(url, '_blank');
    showToast('Lien WhatsApp ouvert !');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Relance Loyer (WhatsApp & SMS)
              </h3>
              <p className="text-xs text-emerald-200">
                Message courtois et professionnel prérempli
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500">Destinataire :</span>
              <span className="font-bold text-[#172554] ml-1.5">{tenantName}</span>
            </div>
            <div className="font-mono text-emerald-700 font-bold">
              {tenantPhone}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Texte du message de rappel
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
              Tonalité du rappel :
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setMessage(`Bonjour ${tenantName}, petit rappel amical concernant l’échéance de votre loyer de ${monthYear} (${amount.toLocaleString('fr-FR')} FCFA). Merci de nous transmettre le reçu dès que possible. Belle journée ! — ${landlordName}`)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                🌱 1er rappel amical
              </button>

              <button
                type="button"
                onClick={() => setMessage(`URGENT : Monsieur/Madame ${tenantName}, le loyer du mois de ${monthYear} accuse un retard de paiement pour le lot ${unitName} (${amount.toLocaleString('fr-FR')} FCFA). Merci de régulariser sans délai afin d’éviter l’application des pénalités contractuelles. — ${landlordName}`)}
                className="p-2 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-800 text-left font-medium"
              >
                ⚠️ Rappel formel de retard
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleWhatsAppOpen}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir dans WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
