import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRentFlow, NavigationTab } from '../../context/RentFlowContext';
import {
  Building2,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  CreditCard,
  Plus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { activeTab, setActiveTab, openModal, units } = useRentFlow();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks: { id: NavigationTab; label: string; roles?: string[] }[] = [
    { id: 'DASHBOARD', label: 'Tableau de bord', roles: ['PROPRIETAIRE', 'GESTIONNAIRE'] },
    { id: 'PROPERTIES', label: 'Propriétés & Logements', roles: ['PROPRIETAIRE', 'GESTIONNAIRE'] },
    { id: 'TENANTS', label: 'Locataires & Baux', roles: ['PROPRIETAIRE', 'GESTIONNAIRE'] },
    { id: 'SCHEDULES', label: 'Échéances & Impayés', roles: ['PROPRIETAIRE', 'GESTIONNAIRE'] },
    { id: 'TENANT_PORTAL', label: 'Mon Espace Locataire' }, // Accessible or highlighted for tenants
    { id: 'PRICING', label: 'Forfaits & Tarifs', roles: ['PROPRIETAIRE', 'GESTIONNAIRE'] }
  ];

  const visibleLinks = navLinks.filter(
    link => !link.roles || (user && link.roles.includes(user.role))
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab(user?.role === 'LOCATAIRE' ? 'TENANT_PORTAL' : 'DASHBOARD')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#172554] whitespace-nowrap">
                RentFlow
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar">
            {visibleLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative py-5 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#F97316]'
                      : 'text-slate-600 hover:text-[#172554]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action & User profile menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick action button for owners/managers */}
            {user?.role !== 'LOCATAIRE' && (
              <button
                onClick={() => openModal('PAYMENT')}
                className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#ea580c] rounded-xl shadow-sm transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Encaisser loyer</span>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#172554] text-white flex items-center justify-center text-xs font-bold ring-2 ring-orange-500/30">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-[#172554] leading-tight truncate max-w-[120px]">
                    {user?.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {user?.role === 'PROPRIETAIRE'
                      ? 'Propriétaire'
                      : user?.role === 'GESTIONNAIRE'
                      ? 'Gestionnaire'
                      : 'Locataire'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#172554] truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-semibold bg-orange-100 text-[#F97316] px-2 py-0.5 rounded-md">
                        Forfait {user?.subscriptionPlan}
                      </span>
                      {user?.role !== 'LOCATAIRE' && (
                        <span className="text-[10px] text-slate-500">
                          {units.length} logements
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role Switcher for seamless evaluation */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1.5">
                      Changer de vue / rôle :
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          switchRole('PROPRIETAIRE');
                          setActiveTab('DASHBOARD');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                          user?.role === 'PROPRIETAIRE' ? 'bg-orange-50 text-[#F97316] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🏢 Vue Propriétaire</span>
                        {user?.role === 'PROPRIETAIRE' && <span className="text-[10px]">Actif</span>}
                      </button>

                      <button
                        onClick={() => {
                          switchRole('GESTIONNAIRE');
                          setActiveTab('DASHBOARD');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                          user?.role === 'GESTIONNAIRE' ? 'bg-orange-50 text-[#F97316] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>📑 Vue Gestionnaire</span>
                        {user?.role === 'GESTIONNAIRE' && <span className="text-[10px]">Actif</span>}
                      </button>

                      <button
                        onClick={() => {
                          switchRole('LOCATAIRE');
                          setActiveTab('TENANT_PORTAL');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                          user?.role === 'LOCATAIRE' ? 'bg-orange-50 text-[#F97316] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>🔑 Vue Espace Locataire</span>
                        {user?.role === 'LOCATAIRE' && <span className="text-[10px]">Actif</span>}
                      </button>
                    </div>
                  </div>

                  <div className="px-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab('PRICING');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#F97316]" />
                      <span>Gérer mon forfait ({user?.subscriptionPlan})</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto no-scrollbar gap-2">
          {visibleLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive ? 'bg-[#172554] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
