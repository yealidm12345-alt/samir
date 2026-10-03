import React, { useState } from 'react';
import { 
  Smartphone, 
  Terminal, 
  Volume2, 
  VolumeX, 
  User, 
  Sparkles, 
  CreditCard, 
  Layers, 
  HelpCircle, 
  Eye, 
  Search, 
  Lock, 
  BookOpen, 
  Palette, 
  X,
  ChevronRight
} from 'lucide-react';
import { UserAccount, ThemeAccent } from '../types';
import { soundManager } from '../services/sound';

interface NavbarProps {
  currentUser: UserAccount;
  language: 'en' | 'bn';
  onLanguageChange: (lang: 'en' | 'bn') => void;
  currency: 'USD' | 'BDT' | 'EUR';
  onCurrencyChange: (curr: 'USD' | 'BDT' | 'EUR') => void;
  activeTab: 'studio' | 'tools' | 'templates' | 'pricing' | 'docs';
  onTabChange: (tab: 'studio' | 'tools' | 'templates' | 'pricing' | 'docs') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenAuthModal: () => void;
  onOpenUpgradeModal: () => void;
  onOpenBlogModal: () => void;
  themeAccent: ThemeAccent;
  onThemeAccentChange: (accent: ThemeAccent) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  highContrast,
  onToggleHighContrast,
  onOpenAuthModal,
  onOpenUpgradeModal,
  onOpenBlogModal,
  themeAccent,
  onThemeAccentChange,
}) => {
  const isBangla = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const searchSuggestions = [
    { title: 'Compile & Build Android APK', tab: 'studio' as const, hint: 'Target SDK 35' },
    { title: 'JSON Formatter & Validator', tab: 'tools' as const, hint: 'Developer Tool' },
    { title: 'bKash & Nagad Payment Plans', tab: 'pricing' as const, hint: 'Upgrade Pro' },
    { title: 'E-Commerce Storefront Template', tab: 'templates' as const, hint: 'Starter' },
    { title: 'Regex Tester & Match Simulator', tab: 'tools' as const, hint: 'Developer Tool' },
    { title: 'Android Runtime Permissions Guide', tab: 'docs' as const, hint: 'Documentation' },
  ];

  const filteredSuggestions = searchSuggestions.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-4 lg:px-8 py-2.5">
      {/* Top micro status bar with SSL & Breadcrumb */}
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-neutral-400 pb-2 mb-2 border-b border-neutral-900">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">ApexDroid</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-400 capitalize">{activeTab}</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-emerald-400 font-bold">Native Runtime</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-400">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400 text-[10px]">GDPR & ISO-27001 Ready</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('studio');
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            ApexDroid <span className="text-emerald-400 font-semibold text-xs tracking-widest uppercase">Studio</span>
          </span>
        </button>

        {/* Global Search Bar (Feature #6) */}
        <div className="relative hidden xl:block w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder={isBangla ? 'টুলস বা ফিচার খুঁজুন...' : 'Search studio, tools, docs...'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          {showSearchDropdown && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
              {filteredSuggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.tab);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="p-2 rounded-lg hover:bg-neutral-800 cursor-pointer flex justify-between items-center text-xs"
                >
                  <span className="text-white font-medium">{item.title}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{item.hint}</span>
                </div>
              ))}
              {filteredSuggestions.length === 0 && (
                <div className="p-2 text-xs text-neutral-500 italic">No matching feature</div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium text-neutral-400">
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('studio');
            }}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'studio' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            {isBangla ? 'স্টুডিও বিল্ডার' : 'Studio'}
          </button>
          
          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('tools');
            }}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'tools' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            {isBangla ? 'ডেভ টুলস' : 'Dev Tools'}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('templates');
            }}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'templates' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            {isBangla ? 'টেমপ্লেট' : 'Templates'}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('pricing');
            }}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'pricing' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            {isBangla ? 'মূল্য ও পেমেন্ট' : 'Pricing'}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onTabChange('docs');
            }}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'docs' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            {isBangla ? 'ডক্স' : 'Docs'}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenBlogModal();
            }}
            className="transition-colors hover:text-white py-1 flex items-center gap-1 text-neutral-300"
            title="Developer Blog & Guides"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isBangla ? 'ব্লগ' : 'Blog'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions & utilities */}
        <div className="flex items-center gap-2">
          {/* Builds quota counter */}
          <div 
            onClick={() => {
              soundManager.playClick();
              onOpenUpgradeModal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-mono cursor-pointer hover:border-neutral-700 transition-colors"
            title="Daily APK compile credits"
          >
            <span className="text-neutral-500">Builds:</span>
            <span className={`font-semibold tabular-nums ${currentUser.plan === 'free' && currentUser.buildCredits <= 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentUser.plan !== 'free' ? 'Unlimited' : `${currentUser.buildCredits}/${currentUser.maxDailyBuilds} Left`}
            </span>
          </div>

          {/* Theme Color Switcher (Feature #13) */}
          <div className="relative">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowThemePicker(!showThemePicker);
              }}
              className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              title="Theme Color Accent"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            {showThemePicker && (
              <div className="absolute right-0 mt-2 bg-neutral-900 border border-neutral-800 p-2 rounded-xl shadow-xl flex gap-1.5 z-50">
                {(['emerald', 'cyan', 'violet', 'rose', 'amber'] as const).map((accent) => (
                  <button
                    key={accent}
                    onClick={() => {
                      soundManager.playClick();
                      onThemeAccentChange(accent);
                      setShowThemePicker(false);
                    }}
                    className={`w-5 h-5 rounded-full border-2 ${
                      themeAccent === accent ? 'border-white scale-110' : 'border-transparent'
                    } ${
                      accent === 'emerald' ? 'bg-emerald-500' :
                      accent === 'cyan' ? 'bg-cyan-500' :
                      accent === 'violet' ? 'bg-purple-500' :
                      accent === 'rose' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <select
            value={currency}
            aria-label="Select currency"
            onChange={(e) => {
              soundManager.playClick();
              onCurrencyChange(e.target.value as any);
            }}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-md px-1.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="BDT">৳ BDT</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>

          {/* Language Switcher */}
          <button
            onClick={() => {
              soundManager.playClick();
              onLanguageChange(isBangla ? 'en' : 'bn');
            }}
            className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            title="Toggle Language"
          >
            {isBangla ? 'EN' : 'বাং'}
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              soundEnabled ? 'border-neutral-800 bg-neutral-900 text-emerald-400' : 'border-neutral-800 bg-neutral-900 text-neutral-500'
            }`}
            title={soundEnabled ? 'Mute Interface Sounds' : 'Enable Interface Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* User Profile trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAuthModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 text-neutral-950 font-semibold text-xs hover:bg-emerald-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[80px] sm:max-w-none">{currentUser.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
