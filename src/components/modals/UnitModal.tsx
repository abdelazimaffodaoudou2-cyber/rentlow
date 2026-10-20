import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { X, Home, Zap, Droplets } from 'lucide-react';
import { UnitType, UnitStatus } from '../../types';

export const UnitModal: React.FC = () => {
  const { activeModal, closeModal, properties, addUnit } = useRentFlow();

  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [unitNumber, setUnitNumber] = useState('');
  const [type, setType] = useState<UnitType>('F2');
  const [floor, setFloor] = useState('1er étage');
  const [surfaceM2, setSurfaceM2] = useState(65);
  const [rentAmount, setRentAmount] = useState(120000);
  const [chargesAmount, setChargesAmount] = useState(15000);
  const [status, setStatus] = useState<UnitStatus>('DISPONIBLE');
  const [description, setDescription] = useState('');
  const [sbeeMeterNumber, setSbeeMeterNumber] = useState('');
  const [sonebMeterNumber, setSonebMeterNumber] = useState('');

  if (activeModal !== 'UNIT') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber) return;

    const targetProp = properties.find(p => p.id === propertyId) || properties[0];

    addUnit({
      propertyId: targetProp?.id || 'prop_1',
      propertyName: targetProp?.name || "Résidence L'Horizon",
      unitNumber,
      type,
      rentAmount,
      chargesAmount,
      status,
      floor,
      surfaceM2,
      description: description || `Logement ${type} au ${floor}.`,
      sbeeMeterNumber: sbeeMeterNumber || undefined,
      sonebMeterNumber: sonebMeterNumber || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F97316] flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                Ajouter un logement / lot
              </h3>
              <p className="text-xs text-slate-500">Appartement, studio, villa ou local commercial</p>
            </div>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Propriété d'appartenance
            </label>
            <select
              value={propertyId}
              onChange={e => setPropertyId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.district})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Numéro / Nom du lot
              </label>
              <input
                type="text"
                value={unitNumber}
                onChange={e => setUnitNumber(e.target.value)}
                placeholder="Ex: Appartement C1"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Type de logement
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as UnitType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              >
                <option value="F1_STUDIO">F1 / Studio</option>
                <option value="F2">F2 (1 chambre salon)</option>
                <option value="F3">F3 (2 chambres salon)</option>
                <option value="F4">F4 (3 chambres salon)</option>
                <option value="VILLA_COMPLETE">Villa complète</option>
                <option value="BOUTIQUE">Boutique / Local commercial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Étage / Niveau
              </label>
              <input
                type="text"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                placeholder="Ex: 2ème étage"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Surface habitable (m²)
              </label>
              <input
                type="number"
                value={surfaceM2}
                onChange={e => setSurfaceM2(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Loyer mensuel (FCFA)
              </label>
              <input
                type="number"
                value={rentAmount}
                onChange={e => setRentAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-[#172554] focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Charges prévues (FCFA)
              </label>
              <input
                type="number"
                value={chargesAmount}
                onChange={e => setChargesAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                N° Compteur SBEE (Élec)
              </label>
              <input
                type="text"
                value={sbeeMeterNumber}
                onChange={e => setSbeeMeterNumber(e.target.value)}
                placeholder="Ex: SBEE-CTN-12345"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                N° Compteur SONEB (Eau)
              </label>
              <input
                type="text"
                value={sonebMeterNumber}
                onChange={e => setSonebMeterNumber(e.target.value)}
                placeholder="Ex: SONEB-67890"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
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
              Créer le logement
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
