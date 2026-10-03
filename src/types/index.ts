export type Role = 'user' | 'premium' | 'superadmin' | 'moderator' | 'auditor';
export type ThemeAccent = 'emerald' | 'cyan' | 'violet' | 'rose' | 'amber';

export interface ProjectFile {
  id: string;
  name: string;
  type: 'html' | 'css' | 'js' | 'json' | 'xml';
  content: string;
  isSystem?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: 'free' | 'pro' | 'enterprise';
  buildCredits: number;
  maxDailyBuilds: number;
  buildsUsedToday: number;
  joinedAt: string;
  isSuspended: boolean;
  twoFactorEnabled: boolean;
  phone?: string;
  referralCode: string;
  referralEarnings: number;
  vipConcierge?: boolean;
  warningStrikes?: number;
  tags?: string[];
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  gateway: 'bkash' | 'nagad' | 'card';
  senderPhone: string;
  trxId: string;
  plan: 'pro' | 'enterprise';
  amount: number;
  currency: 'BDT' | 'USD';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface AppProject {
  id: string;
  name: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  html: string;
  css: string;
  js: string;
  iconUrl?: string;
  splashUrl?: string;
  files?: ProjectFile[];
  permissions: {
    internet: boolean;
    camera: boolean;
    storage: boolean;
    location: boolean;
    notifications: boolean;
    audio: boolean;
    biometric: boolean;
  };
  nativeConfig: {
    offlineCache: boolean;
    webviewZoom: boolean;
    customUserAgent: string;
    admobBannerId: string;
    admobInterstitialId: string;
    pushNotifications: boolean;
    keystoreAlias: string;
    enableProguard: boolean;
  };
  lastModified: string;
}

export interface BuildArchiveItem {
  id: string;
  appName: string;
  packageId: string;
  version: string;
  apkSize: string;
  builtAt: string;
  downloadUrl?: string;
  status: 'success' | 'failed' | 'building';
  architecture: string;
}

export interface AdminAuditItem {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CouponCode {
  code: string;
  discountPercent: number;
  planAllowed: 'all' | 'pro' | 'enterprise';
  validUntil: string;
  usedCount: number;
  maxUses: number;
  isActive: boolean;
}

export interface PlatformConfig {
  title: string;
  logoText: string;
  freeDailyBuildLimit: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  emergencyLockdown: boolean;
  bkashNumber: string;
  nagadNumber: string;
  admobMasterEnabled: boolean;
  ipWhitelist: string[];
  maxUploadSizeMb: number;
  malwareScannerLevel: 'standard' | 'strict' | 'paranoid';
  customGlobalCss: string;
  customGlobalJs: string;
  sessionTimeoutMinutes: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarText: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  reply?: string;
}

export interface SubAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'moderator' | 'auditor';
  lastActive: string;
  ip: string;
  twoFactor: boolean;
  status: 'active' | 'suspended';
}

