import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { X, UserPlus, Phone, Shield } from 'lucide-react';

export const TenantModal: React.FC = () => {
  const { activeModal, closeModal, units, addTenant } = useRentFlow();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+229 ');
  const [email, setEmail] = useState('');
  const [identityType, setIdentityType] = useState<'CIP' | 'CNI' | 'PASSPORT'>('CIP');
  const [identityNumber, setIdentityNumber] = useState('');
  const [profession, setProfession] = useState('');
  const [employer, setEmployer] = useState('');
  const [unitId, setUnitId] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+229 ');
  const [depositAmount, setDepositAmount] = useState(360000);

  if (activeModal !== 'TENANT') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const assignedUnit = units.find(u => u.id === unitId);

    addTenant({
      fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      identityType,
      identityNumber: identityNumber || `CIP-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}`,
      profession: profession || 'Profession libérale',
      employer: employer || 'Secteur privé Cotonou',
      currentUnitId: assignedUnit?.id,
      currentPropertyName: assignedUnit?.propertyName,
      currentUnitNumber: assignedUnit?.unitNumber,
      emergencyContactName: emergencyContactName || 'Parent proche',
      emergencyContactPhone: emergencyContactPhone || '+229 97 00 00 00',
      depositMonths: 3,
      depositAmount: depositAmount,
      entryDate: new Date().toISOString().split('T')[0],
      status: 'ACTIF'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F97316] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                Enregistrer un nouveau locataire
              </h3>
              <p className="text-xs text-slate-500">Fiche d'identité et contact d'urgence</p>
            </div>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Nom complet du locataire
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ex: Koffi Adebayo"
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Téléphone (+229 Bénin)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+229 97 00 00 00"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Adresse e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="locataire@email.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Type de pièce
              </label>
              <select
                value={identityType}
                onChange={e => setIdentityType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              >
                <option value="CIP">CIP (Certificat d'Identité Personnelle)</option>
                <option value="CNI">CNI (Carte Nationale d'Identité)</option>
                <option value="PASSPORT">Passeport biométrique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Numéro de la pièce
              </label>
              <input
                type="text"
                value={identityNumber}
                onChange={e => setIdentityNumber(e.target.value)}
                placeholder="Ex: CIP-0021-99812-2024"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Profession
              </label>
              <input
                type="text"
                value={profession}
                onChange={e => setProfession(e.target.value)}
                placeholder="Ex: Comptable, Commerçant..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Employeur / Entreprise
              </label>
              <input
                type="text"
                value={employer}
                onChange={e => setEmployer(e.target.value)}
                placeholder="Ex: Société / Indépendant"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Assigner immédiatement un logement disponible (facultatif)
            </label>
            <select
              value={unitId}
              onChange={e => setUnitId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
            >
              <option value="">-- Assigner plus tard --</option>
              {units.filter(u => u.status === 'DISPONIBLE').map(u => (
                <option key={u.id} value={u.id}>
                  {u.propertyName} — {u.unitNumber} ({u.type} · {u.rentAmount.toLocaleString('fr-FR')} F)
                </option>
              ))}
            </select>
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
              className="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Créer le locataire
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
