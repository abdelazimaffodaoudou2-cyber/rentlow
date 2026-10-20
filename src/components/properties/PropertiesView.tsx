import React, { useState } from 'react';
import { useRentFlow } from '../../context/RentFlowContext';
import {
  Building2,
  Plus,
  Home,
  MapPin,
  CheckCircle,
  Clock,
  Wrench,
  Search,
  Filter,
  User,
  Zap,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { Property, Unit } from '../../types';

export const PropertiesView: React.FC = () => {
  const {
    properties,
    units,
    openModal,
    selectedPropertyFilter,
    setSelectedPropertyFilter
  } = useRentFlow();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OCCUPE' | 'DISPONIBLE' | 'TRAVAUX'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered properties
  const displayedProperties = selectedPropertyFilter === 'ALL'
    ? properties
    : properties.filter(p => p.id === selectedPropertyFilter);

  // Filtered units
  const filteredUnits = units.filter(u => {
    const matchesProp = selectedPropertyFilter === 'ALL' || u.propertyId === selectedPropertyFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch =
      u.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.currentTenantName && u.currentTenantName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProp && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Patrimoine & Logements</span>
            <span aria-hidden="true">·</span>
            <span>{properties.length} propriétés</span>
            <span aria-hidden="true">·</span>
            <span>{units.length} lots au total</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Propriétés & Logements
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Gérez vos immeubles, résidences, villas et l’ensemble de vos lots locatifs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('PROPERTY')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <Building2 className="w-4 h-4 text-[#F97316]" />
            <span>+ Ajouter propriété</span>
          </button>

          <button
            onClick={() => openModal('UNIT')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ajouter un logement</span>
          </button>
        </div>
      </div>

      {/* Properties Cards Carousel / Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#172554] tracking-tight">
            Vos ensembles immobiliers
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPropertyFilter('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedPropertyFilter === 'ALL'
                  ? 'bg-[#172554] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Toutes les propriétés
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map(prop => {
            const propUnits = units.filter(u => u.propertyId === prop.id);
            const occupied = propUnits.filter(u => u.status === 'OCCUPE').length;
            const isSelected = selectedPropertyFilter === prop.id;

            return (
              <div
                key={prop.id}
                onClick={() => setSelectedPropertyFilter(isSelected ? 'ALL' : prop.id)}
                className={`bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#F97316] ring-2 ring-orange-500/30 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={prop.photoUrl}
                    alt={prop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#172554]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                    {prop.type}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#172554] text-xs font-bold px-2.5 py-1 rounded-lg tabular-nums font-mono shadow-sm">
                    {occupied}/{propUnits.length} occupés
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-[#172554] leading-snug">
                    {prop.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                    <span className="truncate">{prop.address}, {prop.district} ({prop.city})</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {prop.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Revenu potentiel :
                    </span>
                    <span className="font-extrabold text-[#172554] tabular-nums font-mono">
                      {propUnits.reduce((acc, u) => acc + u.rentAmount, 0).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Units Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filters Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#172554] tracking-tight">
              Liste détaillée des logements & lots
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivi individuel par numéro de porte, loyer, charges et compteurs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Chercher un lot ou locataire..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F97316] w-56"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'OCCUPE', label: 'Occupés' },
                { id: 'DISPONIBLE', label: 'Disponibles' },
                { id: 'TRAVAUX', label: 'Travaux' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#172554] font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Units Grid / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Logement / Lot</th>
                <th className="py-3.5 px-4">Propriété</th>
                <th className="py-3.5 px-4">Type & Surface</th>
                <th className="py-3.5 px-4 text-right">Loyer mensuel</th>
                <th className="py-3.5 px-4 text-right">Charges</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Locataire actuel</th>
                <th className="py-3.5 px-4">Compteurs SBEE / SONEB</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-sm">
                    Aucun logement ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredUnits.map(unit => (
                  <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-3.5 px-4 font-bold text-[#172554]">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#F97316] shrink-0" />
                        <span>{unit.unitNumber}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{unit.floor}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {unit.propertyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{unit.type}</span>
                      <span className="text-slate-400 text-[11px] ml-1">({unit.surfaceM2} m²)</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#172554] tabular-nums font-mono">
                      {unit.rentAmount.toLocaleString('fr-FR')} F
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 tabular-nums font-mono">
                      +{unit.chargesAmount.toLocaleString('fr-FR')} F
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        unit.status === 'OCCUPE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : unit.status === 'DISPONIBLE'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {unit.status === 'OCCUPE' && <CheckCircle className="w-3 h-3" />}
                        {unit.status === 'DISPONIBLE' && <Clock className="w-3 h-3" />}
                        {unit.status === 'TRAVAUX' && <Wrench className="w-3 h-3" />}
                        <span>{unit.status === 'OCCUPE' ? 'Occupé' : unit.status === 'DISPONIBLE' ? 'Disponible' : 'Travaux'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {unit.currentTenantName ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{unit.currentTenantName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Aucun locataire</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[10px] text-slate-500">
                        {unit.sbeeMeterNumber && (
                          <div className="flex items-center gap-1 font-mono">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>{unit.sbeeMeterNumber}</span>
                          </div>
                        )}
                        {unit.sonebMeterNumber && (
                          <div className="flex items-center gap-1 font-mono">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <span>{unit.sonebMeterNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {unit.status === 'DISPONIBLE' ? (
                        <button
                          onClick={() => openModal('LEASE', { unitId: unit.id, unitName: unit.unitNumber, propertyName: unit.propertyName, rentAmount: unit.rentAmount, chargesAmount: unit.chargesAmount })}
                          className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#F97316] font-bold rounded-lg text-xs transition-colors"
                        >
                          Louer
                        </button>
                      ) : (
                        <button
                          onClick={() => openModal('LEASE', { unitId: unit.id, unitName: unit.unitNumber, propertyName: unit.propertyName })}
                          className="text-slate-500 hover:text-[#172554] font-medium text-xs hover:underline"
                        >
                          Voir bail
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
