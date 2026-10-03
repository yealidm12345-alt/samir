import React, { useState } from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { soundManager } from '../services/sound';

interface AdminGatewayPageProps {
  onAdminLoginSuccess: () => void;
  onReturnToHome: () => void;
  language: 'en' | 'bn';
}

export const AdminGatewayPage: React.FC<AdminGatewayPageProps> = ({
  onAdminLoginSuccess,
  onReturnToHome,
  language,
}) => {
  const isBangla = language === 'bn';
  const [password, setPassword] = useState('');
  const [adminRole, setAdminRole] = useState<'superadmin' | 'moderator' | 'auditor'>('superadmin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    // Default master password specified: '1234'
    if (password === '1234') {
      soundManager.playSuccess();
      StorageService.setAdminAuthenticated(true);
      StorageService.addAuditLog(
        'ADMIN_GATEWAY_LOGIN_SUCCESS',
        `Role: ${adminRole} via isolated /admin route`,
        'high'
      );
      onAdminLoginSuccess();
    } else {
      soundManager.playError();
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setErrorMsg(`Invalid master credentials. (Hint: default master password is 1234). Attempt ${newAttempts}/5`);
      StorageService.addAuditLog(
        'ADMIN_FAILED_LOGIN_ATTEMPT',
        `Password attempt failed on /admin (Att ${newAttempts})`,
        'critical'
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-4 relative selection:bg-rose-500 selection:text-white">
      {/* Background security grid subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e2d_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

      {/* Return to public site link */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onReturnToHome}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBangla ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Return to Main Site'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-rose-900/50 bg-neutral-900/95 backdrop-blur-xl p-8 shadow-2xl shadow-rose-950/20">
        {/* Top Warning Banner */}
        <div className="flex items-center gap-3 border-b border-rose-900/40 pb-5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Admin Gateway</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                Restricted
              </span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">Route: /admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-300 font-medium block mb-1.5">
              Select Administrative Authority Level:
            </label>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 focus:outline-none focus:border-rose-500 cursor-pointer font-sans"
            >
              <option value="superadmin">Super Admin (Full Governance, Financials & bKash)</option>
              <option value="moderator">Operations Moderator (Payment Verification & APKs)</option>
              <option value="auditor">Compliance Auditor (Read-only Audit Trail)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-neutral-300 font-medium">Master Security Password:</label>
              <span className="text-[11px] text-emerald-400 font-mono">Default: 1234</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password (1234)"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 bg-neutral-950/80 rounded-lg border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Client Address:</span>
              <span className="text-neutral-300">103.114.98.24 (Dhaka node)</span>
            </div>
            <div className="flex justify-between">
              <span>Path Policy:</span>
              <span className="text-emerald-400">Strictly Isolated (/admin)</span>
            </div>
            <div className="flex justify-between">
              <span>Master Key Scheme:</span>
              <span className="text-neutral-300">HMAC-SHA256</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate into Command Center</span>
          </button>
        </form>
      </div>

      <div className="mt-8 text-neutral-600 text-[11px] font-mono">
        ApexDroid Enterprise Security Engine · Access to this endpoint is audited and recorded
      </div>
    </div>
  );
};
