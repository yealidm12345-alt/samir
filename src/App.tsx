import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { StudioEditor } from './components/StudioEditor';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ApkBuildModal } from './components/ApkBuildModal';
import { DevToolsSuite } from './components/DevToolsSuite';
import { TemplatesView } from './components/TemplatesView';
import { PricingPaymentModal } from './components/PricingPaymentModal';
import { AdminGatewayPage } from './components/AdminGatewayPage';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { DocsView } from './components/DocsView';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Footer } from './components/Footer';
import { TestimonialSlider } from './components/TestimonialSlider';
import { BlogTutorialsModal } from './components/BlogTutorialsModal';

import { UserAccount, AppProject, PaymentTransaction, BuildArchiveItem, ThemeAccent } from './types';
import { StorageService } from './services/storage';
import { ApkBuilderService, CompilationResult } from './services/apkBuilder';
import { soundManager } from './services/sound';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path === '/admin/' ||
    path.startsWith('/admin') ||
    path.includes('admin-secure-panel-auth') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.includes('admin-secure-panel-auth')
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => StorageService.getCurrentUser());
  const [project, setProject] = useState<AppProject>(() => StorageService.getCurrentProject());
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [currency, setCurrency] = useState<'BDT' | 'USD' | 'EUR'>('BDT');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [themeAccent, setThemeAccent] = useState<ThemeAccent>('emerald');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => StorageService.isAdminAuthenticated());
  
  // Route state: separated completely for /admin or /admin-secure-panel-auth
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);

  // Main Site Navigation Tabs
  const [activeTab, setActiveTab] = useState<'studio' | 'tools' | 'templates' | 'pricing' | 'docs'>('studio');

  // Modals for main site
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Compilation state
  const [isCompiling, setIsCompiling] = useState(false);
  const [buildStepMsg, setBuildStepMsg] = useState('');
  const [buildProgress, setBuildProgress] = useState(0);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);

  // Console Logs
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'log' | 'warn' | 'error'; message: string; timestamp: string }>>([
    { type: 'log', message: 'ApexDroid Studio v3.8.4 initialized', timestamp: new Date().toLocaleTimeString() },
    { type: 'log', message: 'Target SDK 35 (Android 15) Ready', timestamp: new Date().toLocaleTimeString() },
  ]);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Listen to popstate and hashchange events for dedicated /admin URL routing
  useEffect(() => {
    const handleUrlChange = () => {
      const onAdmin = checkIsAdminRoute();
      setIsAdminRoute(onAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Keyboard shortcut (Ctrl+B) only for main site builder
  useEffect(() => {
    if (isAdminRoute) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleTriggerCompile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminRoute, project, currentUser]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  const handleConsoleLog = (type: 'log' | 'warn' | 'error', message: string) => {
    setConsoleLogs((prev) => [
      { type, message, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 49),
    ]);
  };

  // Primary APK Compilation Action
  const handleTriggerCompile = async () => {
    if (currentUser.plan === 'free' && currentUser.buildCredits <= 0) {
      soundManager.playError();
      triggerToast('Daily free build quota reached (0 remaining). Please upgrade to Pro for unlimited builds.');
      setShowPaymentModal(true);
      return;
    }

    setIsCompiling(true);
    setShowBuildModal(true);
    setBuildProgress(5);
    setBuildStepMsg('Starting compilation pipeline...');

    try {
      const result = await ApkBuilderService.buildApk(project, (step, progress) => {
        setBuildStepMsg(step);
        setBuildProgress(progress);
      });

      setCompilationResult(result);

      if (result.success) {
        if (currentUser.plan === 'free') {
          const updatedUser: UserAccount = {
            ...currentUser,
            buildCredits: Math.max(0, currentUser.buildCredits - 1),
            buildsUsedToday: currentUser.buildsUsedToday + 1,
          };
          setCurrentUser(updatedUser);
          StorageService.saveCurrentUser(updatedUser);
        }

        const archiveItem: BuildArchiveItem = {
          id: `arch_${Date.now()}`,
          appName: project.name,
          packageId: project.packageId,
          version: `v${project.versionName}`,
          apkSize: result.apkSizeFormatted,
          builtAt: new Date().toISOString(),
          status: 'success',
          architecture: 'arm64-v8a / x86_64',
        };
        StorageService.addBuildArchive(archiveItem);

        handleConsoleLog('log', `[BuildEngine] Generated ${result.apkFileName} successfully`);
      } else {
        soundManager.playError();
        handleConsoleLog('error', `[BuildEngine] Compilation failed: ${result.errors?.join(', ')}`);
      }
    } catch (err: any) {
      soundManager.playError();
      handleConsoleLog('error', `[BuildEngine] Unexpected error: ${err.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  // Export Android Project Source ZIP
  const handleExportProjectZip = async () => {
    soundManager.playClick();
    triggerToast('Generating Android Studio source ZIP package...');
    try {
      const result = await ApkBuilderService.buildApk(project);
      if (result.projectZipBlob) {
        const url = URL.createObjectURL(result.projectZipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.projectFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        triggerToast('Downloaded Android Studio Project (.zip)');
      }
    } catch {
      triggerToast('Failed to package zip');
    }
  };

  const handlePaymentSubmitted = (tx: PaymentTransaction) => {
    triggerToast(
      language === 'bn'
        ? `পেমেন্ট সাবমিট হয়েছে (TrxID: ${tx.trxId})! অ্যাডমিন ভেরিফিকেশন সম্পন্ন হলে আনলিমিটেড বিল্ড চালু হবে।`
        : `Payment submitted (${tx.trxId})! Pending admin verification for unlimited build activation.`
    );
  };

  const handleRefreshData = () => {
    setCurrentUser(StorageService.getCurrentUser());
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  /* =================================================================================
     DEDICATED SEPARATE /admin & /admin-secure-panel-auth VIEWPORT
     Opens ONLY when /admin is appended to the domain name.
     Cannot be accessed from any link or button on the main platform.
     ================================================================================= */
  if (isAdminRoute) {
    if (!isAdminLoggedIn) {
      return (
        <AdminGatewayPage
          onAdminLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            triggerToast('Welcome to ApexDroid Admin Command Center!');
          }}
          onReturnToHome={navigateToHome}
          language={language}
        />
      );
    }

    return (
      <AdminPanel
        onLogoutAdmin={() => {
          StorageService.setAdminAuthenticated(false);
          setIsAdminLoggedIn(false);
          navigateToHome();
        }}
        onRefreshData={handleRefreshData}
        language={language}
      />
    );
  }

  /* =================================================================================
     MAIN DOMAIN PLATFORM VIEWPORT (without /admin)
     Zero admin links, buttons, or indicators anywhere in this interface.
     ================================================================================= */
  return (
    <div className={`min-h-screen flex flex-col bg-neutral-950 text-neutral-100 ${highContrast ? 'contrast-125' : ''}`}>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-neutral-900 border border-emerald-500/50 shadow-2xl text-xs font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation Bar (NO admin button) */}
      <Navbar
        currentUser={currentUser}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenUpgradeModal={() => setShowPaymentModal(true)}
        onOpenBlogModal={() => setShowBlogModal(true)}
        themeAccent={themeAccent}
        onThemeAccentChange={setThemeAccent}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col">
        {/* Tab 1: Studio Builder (Core Workspace) */}
        {activeTab === 'studio' && (
          <div className="flex-1 flex flex-col">
            <HeroStats
              language={language}
              onGetStarted={() => {
                const el = document.getElementById('studio-canvas');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreTools={() => setActiveTab('tools')}
            />

            {/* Split Screen Workspace Canvas */}
            <div id="studio-canvas" className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1 flex flex-col space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* Left side: Code Editor & Settings */}
                <div className="lg:col-span-7 flex flex-col min-h-[560px]">
                  <StudioEditor
                    project={project}
                    onChangeProject={(updated) => {
                      setProject(updated);
                      StorageService.saveCurrentProject(updated);
                    }}
                    onCompileApk={handleTriggerCompile}
                    onExportProjectZip={handleExportProjectZip}
                    consoleLogs={consoleLogs}
                    onClearConsole={() => setConsoleLogs([])}
                    language={language}
                    buildCredits={currentUser.buildCredits}
                    isCompiling={isCompiling}
                  />
                </div>

                {/* Right side: Interactive Mobile Phone Mockup Frame */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <PhoneSimulator
                    project={project}
                    onConsoleLog={handleConsoleLog}
                    isFullscreen={isFullscreenPreview}
                    onToggleFullscreen={() => setIsFullscreenPreview(!isFullscreenPreview)}
                    language={language}
                  />
                </div>
              </div>

              {/* Creator Testimonial Slider (Feature #11) */}
              <div className="pt-6 border-t border-neutral-800">
                <TestimonialSlider language={language} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Advanced Developer Tools Suite */}
        {activeTab === 'tools' && <DevToolsSuite language={language} />}

        {/* Tab 3: Starter App Templates */}
        {activeTab === 'templates' && (
          <TemplatesView
            language={language}
            onSelectTemplate={(tpl) => {
              const updated = { ...project, ...tpl };
              setProject(updated);
              StorageService.saveCurrentProject(updated);
              setActiveTab('studio');
              triggerToast(`Loaded template: ${tpl.name}! Ready to test & compile.`);
            }}
          />
        )}

        {/* Tab 4: Pricing & bKash/Nagad Gateway */}
        {activeTab === 'pricing' && (
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold text-white">
                {language === 'bn' ? 'স্বচ্ছ ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান' : 'Simple, Transparent Enterprise Pricing'}
              </h2>
              <p className="text-sm text-neutral-400 mt-2">
                {language === 'bn'
                  ? 'বিকাশ ও নগদে পেমেন্ট করে সাথে সাথে আনলিমিটেড APK কম্পাইল ও প্রোগার্ড মিনিফিকেশন উপভোগ করুন।'
                  : 'Start with 3 free builds daily or upgrade to unlimited native compilations via bKash, Nagad, or Card.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase">Starter</span>
                  <div className="text-3xl font-bold text-white mt-1">৳0 <span className="text-xs text-neutral-500 font-normal">/ forever</span></div>
                  <p className="text-xs text-neutral-400 mt-2">Perfect for hobby developers experimenting with Android WebView.</p>
                  <ul className="mt-6 space-y-2 text-xs text-neutral-300">
                    <li>✓ 3 Free APK Compilations / Day</li>
                    <li>✓ Standard Android Manifest</li>
                    <li>✓ Real-time Phone Sandbox Simulator</li>
                    <li className="text-neutral-500">✗ ProGuard Bytecode Obfuscation</li>
                    <li className="text-neutral-500">✗ Custom Keystore Signing</li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 text-white font-semibold text-xs hover:bg-neutral-700 cursor-pointer"
                >
                  Current Free Tier
                </button>
              </div>

              {/* Pro Developer */}
              <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-500/5 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
                <div className="absolute -top-3 right-6 bg-emerald-500 text-neutral-950 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                  Most Popular
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">Pro Developer</span>
                  <div className="text-3xl font-bold text-white mt-1">৳1,200 <span className="text-xs text-neutral-400 font-normal">($12/mo)</span></div>
                  <p className="text-xs text-neutral-400 mt-2">Unlimited APK compilation with full ProGuard obfuscation & AdMob.</p>
                  <ul className="mt-6 space-y-2 text-xs text-neutral-200">
                    <li className="font-semibold text-emerald-400">✓ Unlimited APK Builds</li>
                    <li>✓ ProGuard Bytecode Obfuscation</li>
                    <li>✓ AdMob Banner & Interstitial IDs</li>
                    <li>✓ Custom Keystore RSA-2048 Signing</li>
                    <li>✓ bKash & Nagad Instant Receipt</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer transition-colors"
                >
                  Upgrade via bKash / Nagad
                </button>
              </div>

              {/* Enterprise Studio */}
              <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase">Enterprise Studio</span>
                  <div className="text-3xl font-bold text-white mt-1">৳3,900 <span className="text-xs text-neutral-400 font-normal">($39/mo)</span></div>
                  <p className="text-xs text-neutral-400 mt-2">For digital agencies and studios delivering production apps to clients.</p>
                  <ul className="mt-6 space-y-2 text-xs text-neutral-300">
                    <li>✓ Everything in Pro Developer</li>
                    <li>✓ White-label Splash & App Branding</li>
                    <li>✓ Priority Node Compilation Queue</li>
                    <li>✓ Google Play Store AAB Bundle Export</li>
                    <li>✓ 24/7 Dedicated Developer Hotline</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 text-white font-semibold text-xs hover:bg-neutral-700 cursor-pointer"
                >
                  Get Enterprise Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Documentation & References */}
        {activeTab === 'docs' && <DocsView language={language} />}
      </main>

      {/* Floating Live Chat Widget */}
      <LiveChatWidget language={language} />

      {/* Public Footer (NO admin button) */}
      <Footer
        language={language}
        onNavigate={setActiveTab}
      />

      {/* Compilation Result Modal */}
      <ApkBuildModal
        isOpen={showBuildModal}
        onClose={() => setShowBuildModal(false)}
        result={compilationResult}
        stepMessage={buildStepMsg}
        progressPercent={buildProgress}
        isBuilding={isCompiling}
        onOpenUpgradeModal={() => {
          setShowBuildModal(false);
          setShowPaymentModal(true);
        }}
        language={language}
      />

      {/* bKash & Nagad Payment Modal */}
      <PricingPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        currentUser={currentUser}
        currency={currency}
        language={language}
        onPaymentSubmitted={handlePaymentSubmitted}
      />

      {/* User Profile / Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        language={language}
      />

      {/* Developer Blog & Tutorials Modal (Feature #12) */}
      <BlogTutorialsModal
        isOpen={showBlogModal}
        onClose={() => setShowBlogModal(false)}
        language={language}
      />
    </div>
  );
}
