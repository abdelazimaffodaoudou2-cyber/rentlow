import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import { useAuth } from '../../context/AuthContext';
import { X, Building2, MapPin } from 'lucide-react';
import { PropertyType } from '../../types';

export const PropertyModal: React.FC = () => {
  const { activeModal, closeModal, addProperty } = useRentFlow();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState<PropertyType>('IMMEUBLE');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [district, setDistrict] = useState('Haie Vive');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/residence_cotonou_1792509307393.jpg');

  if (activeModal !== 'PROPERTY') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    addProperty({
      name,
      type,
      address,
      city,
      district,
      totalUnits: 0,
      photoUrl,
      description: description || `Propriété moderne située à ${district}, ${city}.`,
      ownerId: user?.id || 'user_owner_1'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F97316] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                Ajouter une nouvelle propriété
              </h3>
              <p className="text-xs text-slate-500">Immeuble, villa, concession ou résidence au Bénin</p>
            </div>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Nom de la propriété / résidence
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Résidence Les Cocotiers"
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F97316]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Type de bien
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as PropertyType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              >
                <option value="IMMEUBLE">Immeuble locatif</option>
                <option value="RESIDENCE">Résidence fermée</option>
                <option value="VILLA">Grande Villa privée</option>
                <option value="CONCESSION">Concession collective</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Ville au Bénin
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              >
                <option value="Cotonou">Cotonou</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Ouidah">Ouidah</option>
                <option value="Parakou">Parakou</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Quartier
              </label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="Ex: Haie Vive, Fidjrossè, Cadjehoun..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Adresse exacte
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ex: Rue 324, Îlot 12"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Description & Prestations
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ascenseur, gardiennage 24h, groupe électrogène, forage..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F97316]"
            />
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
              Enregistrer la propriété
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
