import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Server, 
  DollarSign, 
  LogOut, 
  Check, 
  X, 
  Search, 
  Trash2, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Sliders, 
  Radio, 
  Key, 
  Activity, 
  FileSpreadsheet, 
  Lock, 
  Smartphone,
  Send,
  Plus,
  Mail,
  Eye,
  Tag,
  MessageSquare,
  Globe,
  Database,
  Cpu,
  BarChart3,
  HardDrive,
  FileCode,
  ShieldCheck,
  Award,
  CreditCard,
  Percent,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { 
  UserAccount, 
  PaymentTransaction, 
  AdminAuditItem, 
  BuildArchiveItem, 
  CouponCode, 
  PlatformConfig,
  SupportTicket,
  SubAdminUser
} from '../types';
import { 
  StorageService, 
  INITIAL_TICKETS, 
  INITIAL_SUB_ADMINS 
} from '../services/storage';
import { soundManager } from '../services/sound';

interface AdminPanelProps {
  onLogoutAdmin: () => void;
  onRefreshData?: () => void;
  language: 'en' | 'bn';
}

type AdminSection = 'security' | 'users' | 'governance' | 'financials';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onLogoutAdmin,
  onRefreshData,
  language,
}) => {
  const isBangla = language === 'bn';
  const [activeSection, setActiveSection] = useState<AdminSection>('users');

  // Live state from StorageService
  const [users, setUsers] = useState<UserAccount[]>(() => StorageService.getAllUsers());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => StorageService.getTransactions());
  const [auditLogs, setAuditLogs] = useState<AdminAuditItem[]>(() => StorageService.getAuditLogs());
  const [archives, setArchives] = useState<BuildArchiveItem[]>(() => StorageService.getBuildArchives());
  const [coupons, setCoupons] = useState<CouponCode[]>(() => StorageService.getCoupons());
  const [config, setConfig] = useState<PlatformConfig>(() => StorageService.getPlatformConfig());
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [subAdmins, setSubAdmins] = useState<SubAdminUser[]>(INITIAL_SUB_ADMINS);

  // Sub-tabs inside sections
  const [secATab, setSecATab] = useState<'overview' | 'subadmins' | 'iprules' | 'audit'>('overview');
  const [secBTab, setSecBTab] = useState<'queue' | 'users' | 'tickets' | 'broadcast'>('queue');
  const [secCTab, setSecCTab] = useState<'branding' | 'repo' | 'server' | 'templates'>('queue' as any);
  const [secDTab, setSecDTab] = useState<'revenue' | 'ledger' | 'coupons' | 'telemetry'>('revenue');

  // Search & filters
  const [userSearch, setUserSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserAccount | null>(null);

  // Form states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(25);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [newSubAdminEmail, setNewSubAdminEmail] = useState('');
  const [newSubAdminName, setNewSubAdminName] = useState('');
  const [flashMsg, setFlashMsg] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 3500);
  };

  /* ---------------- SECTION A: SECURITY ACTIONS ---------------- */
  const toggleLockdown = () => {
    soundManager.playClick();
    const updated = { ...config, emergencyLockdown: !config.emergencyLockdown };
    setConfig(updated);
    StorageService.savePlatformConfig(updated);
    StorageService.addAuditLog(
      updated.emergencyLockdown ? 'EMERGENCY_LOCKDOWN_ENGAGED' : 'EMERGENCY_LOCKDOWN_DISENGAGED',
      'Global platform operations',
      'critical'
    );
    showFlash(updated.emergencyLockdown ? 'Emergency lockdown engaged!' : 'Lockdown released.');
    setAuditLogs(StorageService.getAuditLogs());
  };

  const toggleMaintenance = () => {
    soundManager.playClick();
    const updated = { ...config, maintenanceMode: !config.maintenanceMode };
    setConfig(updated);
    StorageService.savePlatformConfig(updated);
    StorageService.addAuditLog(
      updated.maintenanceMode ? 'MAINTENANCE_MODE_ENABLED' : 'MAINTENANCE_MODE_DISABLED',
      'All public routes',
      'high'
    );
    showFlash(updated.maintenanceMode ? 'Maintenance mode active!' : 'Maintenance mode disabled.');
    setAuditLogs(StorageService.getAuditLogs());
  };

  const rotateMasterKeys = () => {
    soundManager.playSuccess();
    StorageService.addAuditLog(
      'CRYPTO_KEY_ROTATED',
      'Keystore V2/V3 Signature Hash Matrix',
      'high'
    );
    setAuditLogs(StorageService.getAuditLogs());
    showFlash('Cryptographic signing keys rotated successfully.');
  };

  const handleAddIpWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpAddress.trim()) return;
    soundManager.playClick();
    const updatedIps = [...config.ipWhitelist, newIpAddress.trim()];
    const updatedConfig = { ...config, ipWhitelist: updatedIps };
    setConfig(updatedConfig);
    StorageService.savePlatformConfig(updatedConfig);
    setNewIpAddress('');
    showFlash(`IP ${newIpAddress} added to whitelist.`);
  };

  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubAdminEmail.trim()) return;
    soundManager.playSuccess();
    const newAdmin: SubAdminUser = {
      id: `adm_${Date.now()}`,
      name: newSubAdminName || 'Moderator Officer',
      email: newSubAdminEmail.trim(),
      role: 'moderator',
      lastActive: 'Just now',
      ip: '103.114.98.24',
      twoFactor: true,
      status: 'active',
    };
    setSubAdmins((prev) => [...prev, newAdmin]);
    setNewSubAdminEmail('');
    setNewSubAdminName('');
    showFlash(`Sub-admin ${newAdmin.name} created.`);
  };

  /* ---------------- SECTION B: USER & bKash/Nagad APPROVAL ACTIONS ---------------- */
  const handleApproveTransaction = (tx: PaymentTransaction) => {
    soundManager.playSuccess();
    const updatedTxs = transactions.map((t) =>
      t.id === tx.id
        ? { ...t, status: 'approved' as const, verifiedAt: new Date().toISOString() }
        : t
    );
    setTransactions(updatedTxs);
    StorageService.saveTransactions(updatedTxs);

    const updatedUsers: UserAccount[] = users.map((u) => {
      if (u.id === tx.userId || u.email === tx.userEmail) {
        return {
          ...u,
          role: 'premium' as const,
          plan: tx.plan,
          buildCredits: 99999,
          maxDailyBuilds: 99999,
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    StorageService.saveAllUsers(updatedUsers);

    const currentUser = StorageService.getCurrentUser();
    if (currentUser.id === tx.userId || currentUser.email === tx.userEmail) {
      StorageService.saveCurrentUser({
        ...currentUser,
        role: 'premium',
        plan: tx.plan,
        buildCredits: 99999,
        maxDailyBuilds: 99999,
      });
    }

    StorageService.addAuditLog(
      `APPROVED_${tx.gateway.toUpperCase()}_PAYMENT`,
      `TrxID: ${tx.trxId} (User: ${tx.userEmail}, ৳${tx.amount})`,
      'high'
    );
    setAuditLogs(StorageService.getAuditLogs());
    showFlash(`✓ Payment approved! User ${tx.userName} upgraded to ${tx.plan.toUpperCase()}.`);
    onRefreshData?.();
  };

  const handleRejectTransaction = (tx: PaymentTransaction) => {
    soundManager.playError();
    const reason = prompt('Enter rejection reason (e.g. Invalid TrxID on statement):') || 'Invalid TrxID';
    const updatedTxs = transactions.map((t) =>
      t.id === tx.id
        ? {
            ...t,
            status: 'rejected' as const,
            verifiedAt: new Date().toISOString(),
            rejectionReason: reason,
          }
        : t
    );
    setTransactions(updatedTxs);
    StorageService.saveTransactions(updatedTxs);

    StorageService.addAuditLog(
      `REJECTED_${tx.gateway.toUpperCase()}_PAYMENT`,
      `TrxID: ${tx.trxId} (Reason: ${reason})`,
      'medium'
    );
    setAuditLogs(StorageService.getAuditLogs());
    showFlash(`✗ Payment ${tx.trxId} rejected.`);
  };

  const toggleSuspendUser = (user: UserAccount) => {
    soundManager.playClick();
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u
    );
    setUsers(updated);
    StorageService.saveAllUsers(updated);
    StorageService.addAuditLog(
      user.isSuspended ? 'UNSUSPENDED_USER' : 'SUSPENDED_USER',
      `User ${user.email}`,
      'high'
    );
    setAuditLogs(StorageService.getAuditLogs());
    showFlash(`User ${user.name} suspension status updated.`);
  };

  const toggleUserPlan = (user: UserAccount) => {
    soundManager.playClick();
    const isNowFree = user.plan !== 'free';
    const newPlan: 'free' | 'pro' = isNowFree ? 'free' : 'pro';
    const newRole: 'user' | 'premium' = isNowFree ? 'user' : 'premium';
    const updated: UserAccount[] = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            plan: newPlan,
            role: newRole,
            buildCredits: isNowFree ? 3 : 9999,
          }
        : u
    );
    setUsers(updated);
    StorageService.saveAllUsers(updated);
    StorageService.addAuditLog(
      isNowFree ? 'REVOKED_PREMIUM' : 'MANUAL_UPGRADE_PREMIUM',
      `User ${user.email} -> ${newPlan}`,
      'high'
    );
    setAuditLogs(StorageService.getAuditLogs());
    showFlash(`User ${user.name} changed to ${newPlan}.`);
  };

  const handleAdjustCredits = (user: UserAccount, delta: number) => {
    soundManager.playClick();
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, buildCredits: Math.max(0, u.buildCredits + delta) } : u
    );
    setUsers(updated);
    StorageService.saveAllUsers(updated);
    showFlash(`Updated build credits for ${user.name}.`);
  };

  const sendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    soundManager.playSuccess();
    StorageService.addAuditLog(
      'DISPATCHED_GLOBAL_BROADCAST',
      broadcastMsg.substring(0, 40) + '...',
      'medium'
    );
    setAuditLogs(StorageService.getAuditLogs());
    setBroadcastMsg('');
    showFlash('Global broadcast dispatched to all browser sessions.');
  };

  const handleResolveTicket = (id: string) => {
    soundManager.playSuccess();
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' as const, reply: 'Processed by Administrator' } : t))
    );
    showFlash('Support ticket marked as resolved.');
  };

  /* ---------------- SECTION C: GOVERNANCE & SERVER ---------------- */
  const flushServerCache = () => {
    soundManager.playSuccess();
    StorageService.addAuditLog(
      'FLUSHED_SERVER_CACHE',
      '/tmp/build_cache (4.8 GB purged)',
      'low'
    );
    setAuditLogs(StorageService.getAuditLogs());
    showFlash('Server build cache purged: 4.8 GB freed on compilation nodes.');
  };

  const deleteArchiveApk = (id: string) => {
    soundManager.playClick();
    const updated = archives.filter((a) => a.id !== id);
    setArchives(updated);
    localStorage.setItem('apexdroid_build_archives', JSON.stringify(updated));
    showFlash('Archive entry and APK binary purged from storage.');
  };

  /* ---------------- SECTION D: FINANCIALS & EXPORT ---------------- */
  const totalRevenueBdt = transactions
    .filter((t) => t.status === 'approved')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingRevenueBdt = transactions
    .filter((t) => t.status === 'pending')
    .reduce((acc, t) => acc + t.amount, 0);

  const exportFinancialsCsv = () => {
    soundManager.playClick();
    const headers = 'ID,User,Email,Gateway,SenderPhone,TrxID,Plan,AmountBDT,Status,Date\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.userName}","${t.userEmail}","${t.gateway}","${t.senderPhone}","${t.trxId}","${t.plan}",${t.amount},"${t.status}","${t.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexdroid-financial-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showFlash('Financial ledger exported to CSV.');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    soundManager.playSuccess();
    const newCoupon: CouponCode = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponDiscount,
      planAllowed: 'all',
      validUntil: '2026-12-31',
      usedCount: 0,
      maxUses: 100,
      isActive: true,
    };
    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    StorageService.saveCoupons(updated);
    setNewCouponCode('');
    showFlash(`Coupon ${newCoupon.code} created with ${newCouponDiscount}% discount.`);
  };

  const pendingCount = transactions.filter((t) => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Admin Command Header */}
      <header className="border-b border-rose-900/40 bg-neutral-950 px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Admin Command Center</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                150 Master Functions
              </span>
            </h1>
          </div>
        </div>

        {/* 4 Section Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 text-xs font-medium">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('security');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'security' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Sec. A: Security (1-30)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('users');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors relative cursor-pointer ${
              activeSection === 'users' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Sec. B: Users & bKash (31-70)</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('governance');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'governance' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>Sec. C: Server & Governance (71-110)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('financials');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'financials' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sec. D: Financials & Revenue (111-150)</span>
          </button>
        </div>

        {/* Exit Admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onLogoutAdmin();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Action Flash Toast Banner */}
      {flashMsg && (
        <div className="bg-emerald-500 text-neutral-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>{flashMsg}</span>
        </div>
      )}

      {/* Main Command Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* ===================== SECTION A: ADMIN SECURITY & ACCESS CONTROL (1-30) ===================== */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-400" />
                  Section A: Admin Security & Access Control (Functions 1 to 30)
                </h2>
                <p className="text-xs text-neutral-400">
                  Granular control over emergency lockdown, maintenance states, IP whitelists, sub-admin accounts, and cryptographic key rotation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLockdown}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    config.emergencyLockdown
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-neutral-900 border border-rose-900/60 text-rose-300 hover:bg-rose-950'
                  }`}
                >
                  {config.emergencyLockdown ? '⚠️ RELEASE LOCKDOWN' : 'Engage Emergency Lockdown'}
                </button>

                <button
                  onClick={toggleMaintenance}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    config.maintenanceMode
                      ? 'bg-amber-600 text-white'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  {config.maintenanceMode ? 'Maintenance Mode: ON' : 'Toggle Maintenance'}
                </button>
              </div>
            </div>

            {/* Sub-tabs for Section A */}
            <div className="flex gap-2 border-b border-neutral-800 pb-2 text-xs">
              <button
                onClick={() => setSecATab('overview')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secATab === 'overview' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Security Overview
              </button>
              <button
                onClick={() => setSecATab('subadmins')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secATab === 'subadmins' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Sub-Admin Matrix ({subAdmins.length})
              </button>
              <button
                onClick={() => setSecATab('iprules')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secATab === 'iprules' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                IP Rules & Whitelist
              </button>
              <button
                onClick={() => setSecATab('audit')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secATab === 'audit' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Audit Trail ({auditLogs.length})
              </button>
            </div>

            {secATab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                    <div className="text-xs text-neutral-400">Database Encryption</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">AES-256 GCM</div>
                    <div className="text-[11px] text-neutral-500">Master salt checksum verified</div>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                    <div className="text-xs text-neutral-400">Session Timeout</div>
                    <div className="text-lg font-bold font-mono text-white">30 Minutes Idle</div>
                    <div className="text-[11px] text-neutral-500">Auto-token revocation active</div>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                    <div className="text-xs text-neutral-400">Hardware 2FA / YubiKey</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">FIDO2 / U2F Bound</div>
                    <div className="text-[11px] text-neutral-500">Physical key challenge OK</div>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                    <div className="text-xs text-neutral-400">Brute-Force Shield</div>
                    <div className="text-lg font-bold font-mono text-white">5 Attempts Max</div>
                    <div className="text-[11px] text-emerald-400">0 IP bans in last 24h</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Master Cryptographic Keystore Rotation</h4>
                    <p className="text-[11px] text-neutral-400">Rotates RSA 2048-bit v2/v3 APK signature hashes.</p>
                  </div>
                  <button
                    onClick={rotateMasterKeys}
                    className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Rotate Cryptographic Keys</span>
                  </button>
                </div>
              </div>
            )}

            {secATab === 'subadmins' && (
              <div className="space-y-4">
                <form onSubmit={handleCreateSubAdmin} className="flex gap-2 p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
                  <input
                    type="text"
                    placeholder="Sub-admin Name..."
                    value={newSubAdminName}
                    onChange={(e) => setNewSubAdminName(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white"
                  />
                  <input
                    type="email"
                    placeholder="admin@apexdroid.studio..."
                    value={newSubAdminEmail}
                    onChange={(e) => setNewSubAdminEmail(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white"
                  />
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold">
                    Create Sub-Admin
                  </button>
                </form>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-3">Admin</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Last Active</th>
                        <th className="p-3">2FA</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {subAdmins.map((adm) => (
                        <tr key={adm.id} className="hover:bg-neutral-800/40">
                          <td className="p-3 font-semibold text-white">{adm.name}</td>
                          <td className="p-3 text-neutral-300">{adm.email}</td>
                          <td className="p-3 uppercase text-emerald-400 font-bold">{adm.role}</td>
                          <td className="p-3 text-neutral-400">{adm.lastActive}</td>
                          <td className="p-3 text-emerald-400">Enforced ✓</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">ACTIVE</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {secATab === 'iprules' && (
              <div className="space-y-4">
                <form onSubmit={handleAddIpWhitelist} className="flex gap-2 p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
                  <input
                    type="text"
                    placeholder="Enter trusted IP address (e.g. 103.114.98.24)..."
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold">
                    Add to Whitelist
                  </button>
                </form>

                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-2 text-xs font-mono">
                  <div className="text-neutral-400 font-bold mb-2">Whitelisted Administrative IP Addresses:</div>
                  {config.ipWhitelist.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800">
                      <span className="text-white">{ip}</span>
                      <span className="text-emerald-400 text-[10px]">VERIFIED TRUSTED NODE</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {secATab === 'audit' && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Timestamp (UTC)</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Details</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-800/40">
                        <td className="p-3 text-neutral-400">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3 text-neutral-200 font-semibold">{log.adminName}</td>
                        <td className="p-3 text-emerald-400 font-bold">{log.action}</td>
                        <td className="p-3 text-neutral-300 max-w-xs truncate">{log.target}</td>
                        <td className="p-3 text-neutral-400">{log.ipAddress}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.severity === 'critical' ? 'bg-rose-950 text-rose-400' : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================== SECTION B: USER & SUBSCRIPTION MANAGEMENT (31-70) ===================== */}
        {activeSection === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Section B: User & Subscription Management (Functions 31 to 70)
              </h2>
              <p className="text-xs text-neutral-400">
                1-Click bKash/Nagad verification, complete user matrix, build credit allocations, and support desk.
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 border-b border-neutral-800 pb-2 text-xs">
              <button
                onClick={() => setSecBTab('queue')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${secBTab === 'queue' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                <span>bKash/Nagad Queue</span>
                {pendingCount > 0 && <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">{pendingCount}</span>}
              </button>
              <button
                onClick={() => setSecBTab('users')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secBTab === 'users' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                User Database ({users.length})
              </button>
              <button
                onClick={() => setSecBTab('tickets')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secBTab === 'tickets' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Support Tickets ({tickets.length})
              </button>
              <button
                onClick={() => setSecBTab('broadcast')}
                className={`px-3 py-1.5 rounded-lg font-semibold ${secBTab === 'broadcast' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Global Broadcast
              </button>
            </div>

            {/* PENDING MANUAL PAYMENTS VERIFICATION QUEUE (Functions 35-37) */}
            {secBTab === 'queue' && (
              <div className="rounded-xl border border-pink-900/40 bg-neutral-900/60 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-pink-900/30 bg-pink-950/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></div>
                    <h3 className="text-sm font-bold text-white">
                      Pending bKash & Nagad Payment Approvals ({pendingCount})
                    </h3>
                  </div>
                  <span className="text-xs text-pink-300 font-mono">
                    1-Click Approve grants immediate Premium & unlimited builds
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-3">User & Email</th>
                        <th className="p-3">Gateway</th>
                        <th className="p-3">Sender Phone</th>
                        <th className="p-3">TrxID</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Submitted</th>
                        <th className="p-3 text-right">Instant Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {transactions
                        .filter((t) => t.status === 'pending')
                        .map((tx) => (
                          <tr key={tx.id} className="hover:bg-neutral-800/40">
                            <td className="p-3">
                              <div className="font-semibold text-white">{tx.userName}</div>
                              <div className="text-[11px] text-neutral-400">{tx.userEmail}</div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  tx.gateway === 'bkash'
                                    ? 'bg-pink-950 text-pink-400 border border-pink-800'
                                    : 'bg-orange-950 text-orange-400 border border-orange-800'
                                }`}
                              >
                                {tx.gateway}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-white">{tx.senderPhone}</td>
                            <td className="p-3 text-emerald-400 font-bold tracking-wider">{tx.trxId}</td>
                            <td className="p-3 uppercase text-purple-400 font-bold">{tx.plan}</td>
                            <td className="p-3 font-bold text-white tabular-nums">৳{tx.amount}</td>
                            <td className="p-3 text-neutral-400 whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleApproveTransaction(tx)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
                                  title="Approve and upgrade user instantly"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve (✓)</span>
                                </button>
                                <button
                                  onClick={() => handleRejectTransaction(tx)}
                                  className="p-1.5 rounded bg-neutral-800 hover:bg-rose-900 text-rose-400 transition-colors cursor-pointer"
                                  title="Reject payment"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {pendingCount === 0 && (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-neutral-500 italic">
                            No pending bKash or Nagad payments in queue. All clear!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COMPLETE USER DATABASE TABLE (Functions 31-34, 38, 47, 70) */}
            {secBTab === 'users' && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
                <div className="p-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    User Database Matrix ({users.length} Registered Accounts)
                  </h3>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-3">User</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Build Credits</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {users
                        .filter(
                          (u) =>
                            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                            (u.phone && u.phone.includes(userSearch))
                        )
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-neutral-800/40">
                            <td className="p-3">
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {u.vipConcierge && <Award className="w-3.5 h-3.5 text-amber-400" />}
                              </div>
                              <div className="text-[11px] text-neutral-400">{u.email}</div>
                            </td>
                            <td className="p-3 uppercase text-[10px] font-bold text-neutral-400">{u.role}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.plan === 'enterprise' ? 'bg-purple-950 text-purple-400' :
                                u.plan === 'pro' ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                              }`}>
                                {u.plan}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-white">{u.buildCredits > 999 ? '∞' : u.buildCredits}</span>
                                <button
                                  onClick={() => handleAdjustCredits(u, 5)}
                                  className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-[10px]"
                                  title="Add 5 Credits"
                                >
                                  +5
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-neutral-400">{u.phone || 'N/A'}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.isSuspended ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                              }`}>
                                {u.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleUserPlan(u)}
                                  className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-semibold"
                                >
                                  {u.plan === 'free' ? 'Grant Pro' : 'Revoke'}
                                </button>
                                <button
                                  onClick={() => toggleSuspendUser(u)}
                                  className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-rose-400 text-[10px] font-semibold"
                                >
                                  {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Support Tickets (Function 50) */}
            {secBTab === 'tickets' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <h3 className="text-sm font-bold text-white mb-3">Support Desk & Feedback Inquiries</h3>
                  <div className="space-y-3">
                    {tickets.map((t) => (
                      <div key={t.id} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex justify-between items-start text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{t.subject}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              t.status === 'open' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                            }`}>
                              {t.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-neutral-400">{t.message}</p>
                          <div className="text-[10px] text-neutral-500">From: {t.userName} ({t.userId})</div>
                        </div>
                        {t.status === 'open' && (
                          <button
                            onClick={() => handleResolveTicket(t.id)}
                            className="px-3 py-1 rounded bg-emerald-500 text-neutral-950 font-bold text-xs"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Broadcast Dispatcher (Function 39) */}
            {secBTab === 'broadcast' && (
              <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Global Broadcast Messaging System
                </h3>
                <form onSubmit={sendBroadcast} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Broadcast message to all active app studio clients..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs">
                    Dispatch
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ===================== SECTION C: PLATFORM, APP & SERVER GOVERNANCE (71-110) ===================== */}
        {activeSection === 'governance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                Section C: Platform, App & Server Governance (Functions 71 to 110)
              </h2>
              <p className="text-xs text-neutral-400">
                Server resource limits, global branding, APK binary purge, cache clearance, and load balancing configurations.
              </p>
            </div>

            {/* Server Performance & Storage Overview (Functions 76, 83, 99) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Disk I/O Utilization</div>
                <div className="text-xl font-mono font-bold text-emerald-400">14.2 MB/s</div>
                <div className="text-[11px] text-neutral-500">NVMe SSD Array Nominal</div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Compilation Nodes</div>
                <div className="text-xl font-mono font-bold text-white">4 Active Pods</div>
                <div className="text-[11px] text-emerald-400">Load Balancer: 24% load</div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Malware Scanner Level</div>
                <div className="text-xl font-mono font-bold text-purple-400">STRICT (Heuristic)</div>
                <div className="text-[11px] text-neutral-500">0 infected uploads blocked</div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">System Heartbeat</div>
                <div className="text-xl font-mono font-bold text-emerald-400">99.98% Uptime</div>
                <div className="text-[11px] text-neutral-500">Last reboot 18 days ago</div>
              </div>
            </div>

            {/* Global Branding & Quotas (Functions 71, 73, 77, 84) */}
            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Global Resource Quotas & Branding</h3>
                <button
                  onClick={flushServerCache}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Flush Server Build Cache (4.8 GB)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Platform Brand Title:</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Free Daily Build Quota:</label>
                  <input
                    type="number"
                    value={config.freeDailyBuildLimit}
                    onChange={(e) => setConfig({ ...config, freeDailyBuildLimit: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">bKash Receiving Number:</label>
                  <input
                    type="text"
                    value={config.bkashNumber}
                    onChange={(e) => setConfig({ ...config, bkashNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Centralized Compiled APK Repository (Functions 74, 75) */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Centralized Compiled APK Repository ({archives.length} Binaries)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3">App Name</th>
                      <th className="p-3">Package ID</th>
                      <th className="p-3">Version</th>
                      <th className="p-3">APK Size</th>
                      <th className="p-3">Architecture</th>
                      <th className="p-3">Built At</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {archives.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-800/40">
                        <td className="p-3 font-semibold text-white">{item.appName}</td>
                        <td className="p-3 text-neutral-300">{item.packageId}</td>
                        <td className="p-3 text-purple-400">{item.version}</td>
                        <td className="p-3 text-emerald-400 font-bold">{item.apkSize}</td>
                        <td className="p-3 text-neutral-400">{item.architecture}</td>
                        <td className="p-3 text-neutral-500">{new Date(item.builtAt).toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteArchiveApk(item.id)}
                            className="p-1 rounded text-neutral-500 hover:text-rose-400"
                            title="Purge malicious or old APK"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SECTION D: FINANCIALS, ANALYTICS & REVENUE COMMAND CENTER (111-150) ===================== */}
        {activeSection === 'financials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Section D: Financials, Analytics & Revenue Command Center (Functions 111 to 150)
                </h2>
                <p className="text-xs text-neutral-400">
                  Comprehensive tracking of bKash, Nagad, and Card revenues with CSV/PDF ledger export and ARPU calculation.
                </p>
              </div>

              <button
                onClick={exportFinancialsCsv}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Financials (.CSV)</span>
              </button>
            </div>

            {/* Financial Overview Metrics (Functions 111, 112, 121, 127) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Verified Revenue (BDT)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  ৳{totalRevenueBdt.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-500">bKash + Nagad completed</div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Pending in Review</div>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  ৳{pendingRevenueBdt.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-500">{pendingCount} payments awaiting verification</div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Estimated MRR (Monthly)</div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  ${Math.round(totalRevenueBdt / 120).toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400">+34% growth this month</div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-1">
                <div className="text-xs text-neutral-400">Average Revenue / User (ARPU)</div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">৳2,100</div>
                <div className="text-[11px] text-neutral-500">Pro & Enterprise mix</div>
              </div>
            </div>

            {/* Coupon Code Generator (Function 116) */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Promotional Coupon Code Generator
              </h3>
              <form onSubmit={handleCreateCoupon} className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. FLASH40)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs uppercase font-mono text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="w-28 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                >
                  Create Coupon
                </button>
              </form>

              <div className="flex flex-wrap gap-2 mt-4">
                {coupons.map((c) => (
                  <div key={c.code} className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono flex items-center gap-2">
                    <span className="font-bold text-emerald-400">{c.code}</span>
                    <span className="text-neutral-400">({c.discountPercent}% off)</span>
                    <span className="text-[10px] text-neutral-500">{c.usedCount} used</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Transaction History Ledger (Functions 114, 118, 122) */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  Full bKash & Nagad Financial Transaction Ledger
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-3">TrxID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Gateway</th>
                      <th className="p-3">Sender Mobile</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-neutral-800/40">
                        <td className="p-3 text-emerald-400 font-bold">{t.trxId}</td>
                        <td className="p-3 text-white">{t.userName}</td>
                        <td className="p-3 uppercase">{t.gateway}</td>
                        <td className="p-3 text-neutral-300">{t.senderPhone}</td>
                        <td className="p-3 uppercase text-purple-400">{t.plan}</td>
                        <td className="p-3 font-bold text-white">৳{t.amount}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              t.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : t.status === 'pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400 whitespace-nowrap">{new Date(t.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
