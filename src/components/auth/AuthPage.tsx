import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, loginAsDemoUser } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');

  // Form states
  const [email, setEmail] = useState('jeanluc.mensah@rentflow.bj');
  const [password, setPassword] = useState('RentFlow2026!');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+229 97 12 34 56');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PROPRIETAIRE');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passStrength = getPasswordStrength(password);
  const getStrengthLabel = (score: number) => {
    if (score <= 1) return { label: 'Faible', color: 'text-red-500' };
    if (score === 2) return { label: 'Moyen', color: 'text-amber-500' };
    if (score === 3) return { label: 'Bon', color: 'text-blue-500' };
    return { label: 'Fort', color: 'text-emerald-600' };
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.error || 'Identifiants incorrects.');
      }
    } catch {
      setErrorMessage('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Veuillez accepter les conditions générales d’utilisation.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        fullName,
        email,
        phone,
        role,
        password
      });
      if (!res.success) {
        setErrorMessage(res.error || 'Erreur lors de la création du compte.');
      } else {
        setSuccessMessage('Compte créé avec succès ! Bienvenue sur RentFlow.');
      }
    } catch {
      setErrorMessage('Erreur réseau lors de l’inscription.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Veuillez renseigner votre email.');
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(`Un lien de réinitialisation sécurisé a été transmis à ${email}.`);
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] flex items-center justify-center p-0 md:p-6 lg:p-10">
      <div className="w-full max-w-6xl min-h-[720px] bg-white md:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200">
        
        {/* Left Column: Visual Banner (Exact styling from reference image) */}
        <div className="relative lg:col-span-5 bg-[#172554] text-white flex flex-col justify-between p-8 md:p-12 overflow-hidden min-h-[380px] lg:min-h-full">
          {/* Background image */}
          <img
            src="/src/assets/images/auth_banner_benin_1792509307818.jpg"
            alt="Gestionnaire immobilier RentFlow Bénin"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-55 mix-blend-luminosity brightness-95 scale-105 transition-transform duration-1000"
          />

          {/* Gradient scrim overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172554] via-[#172554]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172554]/80 via-transparent to-transparent" />

          {/* Brand header on image */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-white">RentFlow</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white">
                  Bénin & UEMOA
                </span>
              </div>
              <p className="text-xs text-slate-300">La gestion locative simplifiée</p>
            </div>
          </div>

          {/* Central Tagline */}
          <div className="relative z-10 my-auto py-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Vos locations, <br />
              <span className="text-[#F97316]">en toute sérénité</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-slate-200 leading-relaxed max-w-sm">
              Centralisez vos logements, suivez vos impayés, générez vos quittances et encaissez vos loyers en ligne en toute simplicité.
            </p>
          </div>

          {/* 3 Trust badges matching reference image */}
          <div className="relative z-10 grid grid-cols-3 gap-2 pt-6 border-t border-white/15 text-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F97316] mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Loi 2021-14</span>
              <span className="text-[10px] text-slate-300">Conforme Bénin</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F97316] mb-1.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Kkiapay</span>
              <span className="text-[10px] text-slate-300">MTN & Moov Money</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F97316] mb-1.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Quittances</span>
              <span className="text-[10px] text-slate-300">100% Automatiques</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white overflow-y-auto max-h-[92vh]">
          
          {/* Header & Logo on mobile/desktop */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#172554]">RentFlow</span>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    mode === 'LOGIN' ? 'bg-white text-[#172554] shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    mode === 'REGISTER' ? 'bg-white text-[#172554] shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inscription
                </button>
              </div>
            </div>

            {/* Title Section */}
            {mode === 'LOGIN' && (
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#172554] tracking-tight">
                  Heureux de vous revoir !
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Connectez-vous pour accéder à votre espace de gestion locative.
                </p>
              </div>
            )}

            {mode === 'REGISTER' && (
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#172554] tracking-tight">
                  Créez votre compte
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Rejoignez les propriétaires et gestionnaires modernes au Bénin.
                </p>
              </div>
            )}

            {mode === 'FORGOT' && (
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#172554] tracking-tight">
                  Réinitialiser le mot de passe
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Saisissez votre e-mail pour recevoir le lien sécurisé.
                </p>
              </div>
            )}

            {/* Alert messages */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* FORM: LOGIN */}
            {mode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('FORGOT')}
                      className="text-xs font-semibold text-[#F97316] hover:text-[#ea580c] transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      required
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#F97316] focus:ring-[#F97316] border-slate-300"
                    />
                    <span className="text-xs text-slate-600">Se souvenir de moi</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM: REGISTER */}
            {mode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Role selection tabs */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Votre profil
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'PROPRIETAIRE' as UserRole, label: 'Propriétaire' },
                      { id: 'GESTIONNAIRE' as UserRole, label: 'Gestionnaire' },
                      { id: 'LOCATAIRE' as UserRole, label: 'Locataire' }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          role === r.id
                            ? 'bg-[#172554] text-white border-[#172554] shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ex: Jean-Luc Mensah"
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Numéro de téléphone (+229 Bénin)
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+229 97 12 34 56"
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      required
                      className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password strength meter matching reference image */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Robustesse du mot de passe :</span>
                      <span className={`font-semibold ${getStrengthLabel(passStrength).color}`}>
                        {getStrengthLabel(passStrength).label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      <div className={`rounded-full transition-colors ${passStrength >= 1 ? 'bg-red-500' : 'bg-slate-200'}`} />
                      <div className={`rounded-full transition-colors ${passStrength >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                      <div className={`rounded-full transition-colors ${passStrength >= 3 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                      <div className={`rounded-full transition-colors ${passStrength >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      required
                      className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#F97316] focus:ring-[#F97316] border-slate-300"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
                    J’accepte les <span className="text-[#F97316] font-semibold hover:underline">Conditions Générales d’Utilisation</span> et la <span className="text-[#F97316] font-semibold hover:underline">Politique de Confidentialité</span> de RentFlow.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Créer mon compte</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM: FORGOT */}
            {mode === 'FORGOT' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all"
                >
                  Envoyer le lien de réinitialisation
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('LOGIN')}
                    className="text-xs font-semibold text-[#172554] hover:text-[#F97316] transition-colors"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </form>
            )}

            {/* Social Auth Separator (Exact visual from reference image) */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">
                Ou continuer avec
              </span>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => loginAsDemoUser('user_owner_1')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('user_tenant_1')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.97-12.04-14.67-6.19-9.58-10.9-20.2-14.13-31.86-3.23-11.66-4.85-22.75-4.85-33.27 0-14.42 3.65-26.68 10.95-36.78 7.3-10.1 16.5-15.25 27.6-15.46 5.11 0 10.74 1.34 16.89 4.02 6.15 2.68 10.13 4.09 11.95 4.22 1.45 0 5.48-1.42 12.09-4.26 6.61-2.84 12.18-4.08 17.71-3.72 13.06.66 23.47 5.46 31.23 14.42-11.38 6.94-16.96 16.48-16.73 28.62.24 9.68 3.86 17.77 10.86 24.27 7 6.5 15.22 10.05 24.66 10.65-2.22 6.84-5.06 13.84-8.52 21zM119.22 33.15c0-7.39 2.66-14.39 7.98-21 5.32-6.61 11.92-10.82 19.8-12.63.11 1.25.17 2.37.17 3.37 0 7.28-2.82 14.28-8.46 21-5.64 6.72-12.44 10.69-20.4 11.91-.23-1.63-.35-2.73-.35-3.32z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Logins section (Guaranteed 1-click test for reviewer) */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-[#F97316]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#172554]">
                Accès direct démo (1 clic)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemoUser('user_owner_1')}
                className="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-[#172554] group-hover:text-[#F97316]">
                  🏢 Propriétaire
                </div>
                <div className="text-[10px] text-slate-500 truncate">Jean-Luc Mensah</div>
                <div className="text-[9px] text-[#F97316] font-medium mt-0.5">14 logements · Cotonou</div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('user_manager_1')}
                className="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-[#172554] group-hover:text-[#F97316]">
                  📑 Gestionnaire
                </div>
                <div className="text-[10px] text-slate-500 truncate">Agence Littoral</div>
                <div className="text-[9px] text-[#F97316] font-medium mt-0.5">Multi-mandats · Calavi</div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('user_tenant_1')}
                className="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-[#172554] group-hover:text-[#F97316]">
                  🔑 Locataire
                </div>
                <div className="text-[10px] text-slate-500 truncate">Patricia Dossou</div>
                <div className="text-[9px] text-emerald-600 font-medium mt-0.5">Espace locataire & Kkiapay</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
