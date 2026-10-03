import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Key, 
  Share2, 
  Download, 
  LogOut, 
  Check, 
  Copy,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';
import { StorageService } from '../services/storage';
import { soundManager } from '../services/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
  language: 'en' | 'bn';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  language,
}) => {
  const isBangla = language === 'bn';
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [apiKey, setApiKey] = useState('apex_live_sec_99a81bc24d7f');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const toggle2FA = () => {
    soundManager.playClick();
    const updated = { ...currentUser, twoFactorEnabled: !currentUser.twoFactorEnabled };
    onUpdateUser(updated);
    StorageService.saveCurrentUser(updated);
  };

  const copyReferral = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(`https://apexdroid.studio/?ref=${currentUser.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const copyApiKey = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const exportUserData = () => {
    soundManager.playSuccess();
    const blob = new Blob([JSON.stringify(currentUser, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-account-${currentUser.id}-gdpr-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const switchPersona = (plan: 'free' | 'pro' | 'enterprise') => {
    soundManager.playSuccess();
    const updated: UserAccount = {
      ...currentUser,
      plan,
      role: plan === 'free' ? 'user' : 'premium',
      buildCredits: plan === 'free' ? 1 : 99999,
      maxDailyBuilds: plan === 'free' ? 3 : 99999,
    };
    onUpdateUser(updated);
    StorageService.saveCurrentUser(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-neutral-400">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Details */}
        <div className="space-y-4 text-xs">
          {/* Plan badge & persona switcher */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Active Membership Plan:</span>
              <span className="font-bold text-emerald-400 uppercase font-mono tracking-wider">
                {currentUser.plan} Plan
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Daily Compile Quota:</span>
              <span className="font-mono text-white">
                {currentUser.plan !== 'free' ? 'Unlimited' : `${currentUser.buildCredits} / ${currentUser.maxDailyBuilds} Builds Left`}
              </span>
            </div>

            {/* Quick Demo Persona Switcher */}
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">Test Account Persona:</span>
              <div className="flex gap-1.5">
                {(['free', 'pro', 'enterprise'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => switchPersona(p)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                      currentUser.plan === p
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Referral System */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Referral Code & Earnings:</span>
              <span className="font-mono text-emerald-400 font-bold">
                ৳{currentUser.referralEarnings} BDT Earned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://apexdroid.studio/?ref=${currentUser.referralCode}`}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 font-mono text-[11px] text-neutral-300"
              />
              <button
                onClick={copyReferral}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-[11px]"
              >
                {copiedReferral ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* 2FA & API Key */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <div className="text-neutral-400">Two-Factor Authentication:</div>
              <button
                onClick={toggle2FA}
                className={`mt-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                  currentUser.twoFactorEnabled ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {currentUser.twoFactorEnabled ? 'Enabled ✓' : 'Disabled'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <div className="text-neutral-400">GDPR Compliance:</div>
              <button
                onClick={exportUserData}
                className="mt-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-semibold flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
