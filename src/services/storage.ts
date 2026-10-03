import {
  UserAccount,
  PaymentTransaction,
  AppProject,
  BuildArchiveItem,
  AdminAuditItem,
  CouponCode,
  PlatformConfig,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'apexdroid_current_user',
  ALL_USERS: 'apexdroid_all_users',
  TRANSACTIONS: 'apexdroid_transactions',
  CURRENT_PROJECT: 'apexdroid_current_project',
  BUILD_ARCHIVES: 'apexdroid_build_archives',
  AUDIT_LOGS: 'apexdroid_audit_logs',
  COUPONS: 'apexdroid_coupons',
  PLATFORM_CONFIG: 'apexdroid_platform_config',
  ADMIN_AUTH: 'apexdroid_admin_authenticated',
};

const DEFAULT_PROJECT: AppProject = {
  id: 'proj_default_01',
  name: 'Apex Messenger',
  packageId: 'com.apexdroid.messenger',
  versionName: '1.0.0',
  versionCode: 1,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Messenger</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="mobile-app">
    <header class="app-header">
      <div class="brand">
        <span class="pulse-dot"></span>
        <h2>ApexDroid Native</h2>
      </div>
      <button id="themeToggle" class="icon-btn">⚡</button>
    </header>
    
    <main class="feed">
      <div class="story-carousel">
        <div class="story-avatar add-story">+</div>
        <div class="story-avatar active">T</div>
        <div class="story-avatar active">R</div>
        <div class="story-avatar">S</div>
      </div>

      <div class="status-card">
        <div class="card-chip">LIVE RUNTIME</div>
        <h3>Hardware Acceleration</h3>
        <p>Direct Android WebView 128+ bridge active. Sensors, haptics, and camera accessible.</p>
        <div class="btn-group">
          <button id="btnVibrate" class="primary-btn">Test Haptic Vibe</button>
          <button id="btnGeo" class="secondary-btn">Check Location</button>
        </div>
      </div>

      <div class="message-list">
        <div class="msg-bubble received">
          <p>Welcome to your native Android wrapper app! 🚀</p>
          <span class="time">10:42 AM</span>
        </div>
        <div class="msg-bubble sent">
          <p>Compiled cleanly with ApexDroid Studio in <2.4s.</p>
          <span class="time">10:43 AM</span>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <div class="nav-item active">💬 Chats</div>
      <div class="nav-item">👥 Contacts</div>
      <div class="nav-item">⚙️ Settings</div>
    </footer>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  user-select: none;
}

body {
  background: #090d16;
  color: #f1f5f9;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.mobile-app {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0d1322;
  overflow: hidden;
}

.app-header {
  padding: 16px 20px;
  background: #11182c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1e293b;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand h2 {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #38bdf8;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}

.icon-btn {
  background: #1e293b;
  border: none;
  color: #fbbf24;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.feed {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.story-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.story-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  border: 2px solid transparent;
}

.story-avatar.active {
  border-color: #38bdf8;
  background: #0284c7;
}

.story-avatar.add-story {
  border: 2px dashed #64748b;
  color: #94a3b8;
  cursor: pointer;
}

.status-card {
  background: linear-gradient(135deg, #131d33, #0b1120);
  border: 1px solid #1e293b;
  padding: 18px;
  border-radius: 14px;
}

.card-chip {
  font-size: 10px;
  letter-spacing: 0.05em;
  color: #10b981;
  font-weight: 700;
  margin-bottom: 6px;
}

.status-card h3 {
  font-size: 16px;
  margin-bottom: 6px;
}

.status-card p {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 14px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.primary-btn {
  background: #0284c7;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.secondary-btn {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.msg-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.4;
}

.msg-bubble.received {
  align-self: flex-start;
  background: #1e293b;
  color: #f8fafc;
}

.msg-bubble.sent {
  align-self: flex-end;
  background: #0284c7;
  color: #ffffff;
}

.msg-bubble .time {
  display: block;
  font-size: 10px;
  opacity: 0.7;
  text-align: right;
  margin-top: 4px;
}

.app-footer {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: #11182c;
  border-top: 1px solid #1e293b;
}

.nav-item {
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item.active {
  color: #38bdf8;
  font-weight: 600;
}`,
  js: `// Native Android WebView Client Script
console.log('[ApexDroid Runtime] Initializing native bindings...');

const btnVibrate = document.getElementById('btnVibrate');
if (btnVibrate) {
  btnVibrate.addEventListener('click', () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
      console.log('[Haptics] Triggered hardware pulse');
      showToast('Haptic pulse fired!');
    } else {
      console.log('[Haptics] Vibration API simulated');
      showToast('Vibration simulated (Device OK)');
    }
  });
}

const btnGeo = document.getElementById('btnGeo');
if (btnGeo) {
  btnGeo.addEventListener('click', () => {
    console.log('[GPS Sensor] Requesting coarse location permissions');
    showToast('Lat: 23.8103° N, Lon: 90.4125° E');
  });
}

function showToast(text) {
  let toast = document.createElement('div');
  toast.innerText = text;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#0284c7';
  toast.style.color = '#fff';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '20px';
  toast.style.fontSize = '12px';
  toast.style.zIndex = '999';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}`,
  permissions: {
    internet: true,
    camera: true,
    storage: true,
    location: false,
    notifications: true,
    audio: false,
    biometric: false,
  },
  nativeConfig: {
    offlineCache: true,
    webviewZoom: false,
    customUserAgent: 'Mozilla/5.0 (Linux; Android 15; ApexDroid SDK 35)',
    admobBannerId: 'ca-app-pub-3940256099942544/6300978111',
    admobInterstitialId: 'ca-app-pub-3940256099942544/1033173712',
    pushNotifications: true,
    keystoreAlias: 'apexdroid_release_key',
    enableProguard: true,
  },
  lastModified: new Date().toISOString(),
};

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_me_01',
    name: 'Yealid Hasan',
    email: 'yealidm12345@gmail.com',
    role: 'user',
    plan: 'free',
    buildCredits: 1,
    maxDailyBuilds: 3,
    buildsUsedToday: 2,
    joinedAt: '2026-09-15T10:00:00Z',
    isSuspended: false,
    twoFactorEnabled: false,
    phone: '01711223344',
    referralCode: 'YEALID2026',
    referralEarnings: 450,
  },
  {
    id: 'usr_pro_02',
    name: 'Tanvir Ahmed',
    email: 'tanvir.dev@gmail.com',
    role: 'premium',
    plan: 'pro',
    buildCredits: 9999,
    maxDailyBuilds: 9999,
    buildsUsedToday: 8,
    joinedAt: '2026-08-10T12:00:00Z',
    isSuspended: false,
    twoFactorEnabled: true,
    phone: '01899887766',
    referralCode: 'TANVIR88',
    referralEarnings: 1200,
  },
  {
    id: 'usr_ent_03',
    name: 'Nafis Rahman (ByteScale Ltd)',
    email: 'nafis@bytescale.io',
    role: 'premium',
    plan: 'enterprise',
    buildCredits: 99999,
    maxDailyBuilds: 99999,
    buildsUsedToday: 42,
    joinedAt: '2026-07-04T08:30:00Z',
    isSuspended: false,
    twoFactorEnabled: true,
    phone: '01700998877',
    referralCode: 'BYTESCALE',
    referralEarnings: 3400,
  },
  {
    id: 'usr_spam_04',
    name: 'Spam Bot 99',
    email: 'bot99@tempmail.xyz',
    role: 'user',
    plan: 'free',
    buildCredits: 0,
    maxDailyBuilds: 3,
    buildsUsedToday: 3,
    joinedAt: '2026-10-01T04:12:00Z',
    isSuspended: true,
    twoFactorEnabled: false,
    referralCode: 'SPAM99',
    referralEarnings: 0,
  },
];

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'trx_bkash_901',
    userId: 'usr_me_01',
    userName: 'Yealid Hasan',
    userEmail: 'yealidm12345@gmail.com',
    gateway: 'bkash',
    senderPhone: '01711223344',
    trxId: 'BKA9872JK1',
    plan: 'pro',
    amount: 1200,
    currency: 'BDT',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'trx_nagad_902',
    userId: 'usr_pro_02',
    userName: 'Tanvir Ahmed',
    userEmail: 'tanvir.dev@gmail.com',
    gateway: 'nagad',
    senderPhone: '01899887766',
    trxId: 'NAG7741PQ9',
    plan: 'pro',
    amount: 1200,
    currency: 'BDT',
    status: 'approved',
    createdAt: '2026-10-02T14:20:00Z',
    verifiedAt: '2026-10-02T14:35:00Z',
  },
  {
    id: 'trx_bkash_903',
    userId: 'usr_ent_03',
    userName: 'Nafis Rahman',
    userEmail: 'nafis@bytescale.io',
    gateway: 'bkash',
    senderPhone: '01700998877',
    trxId: 'BKA6610ZZ2',
    plan: 'enterprise',
    amount: 3900,
    currency: 'BDT',
    status: 'approved',
    createdAt: '2026-10-01T09:10:00Z',
    verifiedAt: '2026-10-01T09:18:00Z',
  },
  {
    id: 'trx_bkash_904',
    userId: 'usr_fake_05',
    userName: 'Kazi Farhan',
    userEmail: 'kazi.farhan@gmail.com',
    gateway: 'bkash',
    senderPhone: '01911009988',
    trxId: 'BKA0000000',
    plan: 'pro',
    amount: 1200,
    currency: 'BDT',
    status: 'rejected',
    createdAt: '2026-10-02T11:00:00Z',
    verifiedAt: '2026-10-02T11:15:00Z',
    rejectionReason: 'Invalid TrxID on bKash merchant statement',
  },
  {
    id: 'trx_nagad_905',
    userId: 'usr_samir_06',
    userName: 'Samir Chowdhury',
    userEmail: 'samir.c@outlook.com',
    gateway: 'nagad',
    senderPhone: '01677334455',
    trxId: 'NAG9912KL4',
    plan: 'enterprise',
    amount: 3900,
    currency: 'BDT',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  }
];

const INITIAL_ARCHIVES: BuildArchiveItem[] = [
  {
    id: 'arch_01',
    appName: 'Apex Messenger',
    packageId: 'com.apexdroid.messenger',
    version: 'v1.0.0',
    apkSize: '29.4 MB',
    builtAt: '2026-10-03T07:15:00Z',
    status: 'success',
    architecture: 'arm64-v8a / x86_64',
  },
  {
    id: 'arch_02',
    appName: 'E-Commerce Storefront',
    packageId: 'com.store.megashop',
    version: 'v2.1.4',
    apkSize: '31.2 MB',
    builtAt: '2026-10-02T18:40:00Z',
    status: 'success',
    architecture: 'arm64-v8a',
  },
  {
    id: 'arch_03',
    appName: 'Crypto Ticker Lite',
    packageId: 'com.crypto.ticker',
    version: 'v0.9.1',
    apkSize: '28.1 MB',
    builtAt: '2026-10-01T12:05:00Z',
    status: 'success',
    architecture: 'arm64-v8a',
  },
];

const INITIAL_AUDITS: AdminAuditItem[] = [
  {
    id: 'audit_01',
    timestamp: '2026-10-03T07:30:12Z',
    adminName: 'Super Admin',
    action: 'VERIFIED_BKASH_PAYMENT',
    target: 'BKA6610ZZ2',
    ipAddress: '103.114.98.24',
    severity: 'medium',
  },
  {
    id: 'audit_02',
    timestamp: '2026-10-03T06:50:00Z',
    adminName: 'Super Admin',
    action: 'ROTATED_MASTER_KEY',
    target: 'Keystore_v3_Scheme',
    ipAddress: '103.114.98.24',
    severity: 'high',
  },
  {
    id: 'audit_03',
    timestamp: '2026-10-02T22:10:45Z',
    adminName: 'Moderator_01',
    action: 'SUSPENDED_USER',
    target: 'usr_spam_04',
    ipAddress: '118.179.88.10',
    severity: 'high',
  },
  {
    id: 'audit_04',
    timestamp: '2026-10-02T16:04:18Z',
    adminName: 'Super Admin',
    action: 'FLUSHED_SERVER_CACHE',
    target: '/tmp/apk_build_cache (4.8 GB)',
    ipAddress: '103.114.98.24',
    severity: 'low',
  }
];

const INITIAL_CONFIG: PlatformConfig = {
  title: 'ApexDroid Enterprise Studio',
  logoText: 'ApexDroid',
  freeDailyBuildLimit: 3,
  maintenanceMode: false,
  maintenanceMessage: 'ApexDroid Studio is undergoing routine kernel upgrades. We will be back online in 15 minutes.',
  emergencyLockdown: false,
  bkashNumber: '01712-345678 (Personal / Merchant)',
  nagadNumber: '01812-987654 (Personal / Merchant)',
  admobMasterEnabled: true,
  ipWhitelist: ['103.114.98.24', '127.0.0.1', '192.168.1.1'],
  maxUploadSizeMb: 50,
  malwareScannerLevel: 'strict',
  customGlobalCss: '/* Injected Global CSS */\n:root { --apex-brand-glow: #10b981; }',
  customGlobalJs: '// Injected Global Script\nconsole.log("[ApexEngine] Global scripts loaded");',
  sessionTimeoutMinutes: 30,
};

export const INITIAL_TESTIMONIALS = [
  {
    id: 'test_1',
    name: 'Sabbir Hossain',
    role: 'Lead Mobile Architect',
    company: 'TechValley Dhaka',
    text: 'ApexDroid compiled our HTML5 logistics portal into a 29MB APK with native camera and GPS in under 3 seconds. The bKash payment was approved instantly!',
    rating: 5,
    avatarText: 'SH',
  },
  {
    id: 'test_2',
    name: 'Farhana Yasmin',
    role: 'Product Designer',
    company: 'NextGen Apps',
    text: 'The multi-device mockup simulator (Pixel 8 & S24) and 12 developer tools replaced our entire testing stack. Truly enterprise-grade.',
    rating: 5,
    avatarText: 'FY',
  },
  {
    id: 'test_3',
    name: 'Abrar Chowdhury',
    role: 'Founder',
    company: 'ByteMesh Labs',
    text: 'Target SDK 35 compliance out-of-the-box with ProGuard obfuscation. We published our generated project directly to Google Play Store.',
    rating: 5,
    avatarText: 'AC',
  },
];

export const INITIAL_BLOGS = [
  {
    id: 'blog_1',
    title: 'Migrating Web Apps to Target SDK 35 (Android 15) Seamlessly',
    excerpt: 'Learn how Android 15 edge-to-edge enforcement and 16KB page sizes affect hybrid web containers.',
    date: 'Oct 02, 2026',
    readTime: '4 min read',
    tag: 'Android Architecture',
    content: 'Android 15 introduces strict runtime requirements. ApexDroid builds standard Gradle setups with compileSdk 35 and Java 17 toolchains automatically.',
  },
  {
    id: 'blog_2',
    title: 'Implementing Native Hardware Haptics with Web APIs',
    excerpt: 'How to invoke navigator.vibrate() and trigger physical sensory feedback inside native Android WebViews.',
    date: 'Sep 28, 2026',
    readTime: '3 min read',
    tag: 'Webview Bridges',
    content: 'Using our injected Android JavaScriptInterface bridge, haptic pulses trigger device vibration motors with zero latency.',
  },
  {
    id: 'blog_3',
    title: 'Automated Bytecode Obfuscation with ProGuard in 2026',
    excerpt: 'Protecting your proprietary client-side source code against decompilation and reverse-engineering.',
    date: 'Sep 20, 2026',
    readTime: '5 min read',
    tag: 'Security',
    content: 'ProGuard strips unused symbols and minifies class hierarchies, shrinking bundle size by 28% while hardening security.',
  },
];

export const INITIAL_TICKETS = [
  {
    id: 'tkt_101',
    userId: 'usr_me_01',
    userName: 'Yealid Hasan',
    subject: 'bKash TrxID verification speed question',
    message: 'Submitted BKA9872JK1 for Pro plan. How long does the admin take to approve?',
    status: 'open' as const,
    priority: 'high' as const,
    createdAt: '2026-10-03T07:20:00Z',
  },
  {
    id: 'tkt_102',
    userId: 'usr_pro_02',
    userName: 'Tanvir Ahmed',
    subject: 'AdMob Interstitial unit ID mapping',
    message: 'Where do I configure custom test AdMob IDs before generating APK?',
    status: 'resolved' as const,
    priority: 'medium' as const,
    createdAt: '2026-10-02T16:10:00Z',
    reply: 'Configured in the App Config tab under AdMob Master options.',
  },
];

export const INITIAL_SUB_ADMINS = [
  {
    id: 'adm_01',
    name: 'Master SuperAdmin',
    email: 'superadmin@apexdroid.studio',
    role: 'superadmin' as const,
    lastActive: 'Just now',
    ip: '103.114.98.24',
    twoFactor: true,
    status: 'active' as const,
  },
  {
    id: 'adm_02',
    name: 'Kawsar Mahmud (Moderator)',
    email: 'kawsar@apexdroid.studio',
    role: 'moderator' as const,
    lastActive: '2 hours ago',
    ip: '118.179.88.10',
    twoFactor: true,
    status: 'active' as const,
  },
];

const INITIAL_COUPONS: CouponCode[] = [
  {
    code: 'PRO50',
    discountPercent: 50,
    planAllowed: 'all',
    validUntil: '2026-12-31',
    usedCount: 84,
    maxUses: 500,
    isActive: true,
  },
  {
    code: 'EID2026',
    discountPercent: 30,
    planAllowed: 'pro',
    validUntil: '2026-11-15',
    usedCount: 142,
    maxUses: 200,
    isActive: true,
  },
  {
    code: 'STARTUP99',
    discountPercent: 99,
    planAllowed: 'enterprise',
    validUntil: '2026-10-31',
    usedCount: 12,
    maxUses: 20,
    isActive: true,
  }
];

export const StorageService = {
  getCurrentUser(): UserAccount {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveCurrentUser(INITIAL_USERS[0]);
    return INITIAL_USERS[0];
  },

  saveCurrentUser(user: UserAccount) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getAllUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  saveAllUsers(users: UserAccount[]) {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  },

  getTransactions(): PaymentTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  },

  saveTransactions(txs: PaymentTransaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  },

  getCurrentProject(): AppProject {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, JSON.stringify(DEFAULT_PROJECT));
    return DEFAULT_PROJECT;
  },

  saveCurrentProject(project: AppProject) {
    project.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, JSON.stringify(project));
  },

  getBuildArchives(): BuildArchiveItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUILD_ARCHIVES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.BUILD_ARCHIVES, JSON.stringify(INITIAL_ARCHIVES));
    return INITIAL_ARCHIVES;
  },

  addBuildArchive(item: BuildArchiveItem) {
    const list = this.getBuildArchives();
    const updated = [item, ...list];
    localStorage.setItem(STORAGE_KEYS.BUILD_ARCHIVES, JSON.stringify(updated));
    return updated;
  },

  getAuditLogs(): AdminAuditItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDITS));
    return INITIAL_AUDITS;
  },

  addAuditLog(action: string, target: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    const logs = this.getAuditLogs();
    const newLog: AdminAuditItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: 'Super Admin',
      action,
      target,
      ipAddress: '103.114.98.24',
      severity,
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    return updated;
  },

  getCoupons(): CouponCode[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    return INITIAL_COUPONS;
  },

  saveCoupons(coupons: CouponCode[]) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  },

  getPlatformConfig(): PlatformConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLATFORM_CONFIG);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.PLATFORM_CONFIG, JSON.stringify(INITIAL_CONFIG));
    return INITIAL_CONFIG;
  },

  savePlatformConfig(config: PlatformConfig) {
    localStorage.setItem(STORAGE_KEYS.PLATFORM_CONFIG, JSON.stringify(config));
  },

  isAdminAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuthenticated(auth: boolean) {
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },
};
