import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Globe2, 
  ArrowRight, 
  Timer, 
  CheckCircle2, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { soundManager } from '../services/sound';

interface HeroStatsProps {
  language: 'en' | 'bn';
  onGetStarted: () => void;
  onExploreTools: () => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  language,
  onGetStarted,
  onExploreTools,
}) => {
  const isBangla = language === 'bn';
  const [assetSizeKb, setAssetSizeKb] = useState(450);
  const [includeAdmob, setIncludeAdmob] = useState(true);
  const [includeProguard, setIncludeProguard] = useState(true);

  // Dynamic build time calculator
  const estimatedSeconds = ((assetSizeKb / 1000) * 0.8 + (includeAdmob ? 0.6 : 0.2) + (includeProguard ? 0.9 : 0.3) + 0.8).toFixed(1);

  return (
    <div className="relative border-b border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-neutral-950 px-4 lg:px-8 py-10 lg:py-16">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Dynamic Announcement Ticker */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-semibold tracking-wide uppercase text-[10px]">
              {isBangla ? 'নতুন আপডেট' : 'System Update'}
            </span>
            <span className="text-neutral-500">|</span>
            <span className="truncate max-w-[280px] sm:max-w-md">
              {isBangla 
                ? 'টার্গেট SDK ৩৫ সাপোর্ট (Android 15), ProGuard মিনিকনফিগারেশন ও বিকাশ/নগদ ইনস্ট্যান্ট ভেরিফিকেশন'
                : 'Android 15 Target SDK 35 support, ProGuard bytecode engine & bKash/Nagad instant approval flow'}
            </span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            {isBangla ? (
              <>ওয়েব অ্যাপ থেকে সরাসরি <span className="text-emerald-400">অ্যান্ড্রয়েড এপিকে (APK)</span> বিল্ডার</>
            ) : (
              <>Enterprise Native <span className="text-emerald-400">Android APK Compiler</span> & Web Studio</>
            )}
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed [text-wrap:balance]">
            {isBangla
              ? 'এইচটিএমএল, সিএসএস এবং জাভাস্ক্রিপ্ট কোড থেকে সম্পূর্ণ নেটিভ প্যাকেজড অ্যান্ড্রয়েড APK তৈরী করুন। সাথে লাইভ স্যান্ডবক্স মোবাইল প্রিভিউ, ১২+ ডেভ টুলস এবং অ্যাডমিন কন্ট্রোল।'
              : 'Transform HTML5, CSS, and modern JS into standalone Android APK packages with native hardware acceleration, sensor hooks, ProGuard obfuscation, and zero cloud lock-in.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <button
              onClick={() => {
                soundManager.playClick();
                onGetStarted();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isBangla ? 'স্টুডিও কোড এডিটর শুরু করুন' : 'Launch Studio Builder'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onExploreTools();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-sm hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{isBangla ? 'ডেভেলপার টুলস হাব (১২টি)' : 'Open Dev Tools Hub'}</span>
            </button>
          </div>
        </div>

        {/* Live Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBangla ? 'মোট এপিকে কম্পাইল' : 'Total APKs Compiled'}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">1,284,910+</div>
            <div className="text-[11px] text-neutral-500">{isBangla ? 'সারাবিশ্বে ব্যবহৃত' : 'Across 140+ countries'}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBangla ? 'গড় বিল্ড সময়' : 'Avg Build Latency'}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">&lt; 2.4s</div>
            <div className="text-[11px] text-emerald-400 font-medium">{isBangla ? 'রিয়েল-টাইম প্যাকেজিং' : 'Client-side bytecode'}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{isBangla ? 'নেটিভ রানটাইম স্থায়িত্ব' : 'Native Sandbox SLA'}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">99.98%</div>
            <div className="text-[11px] text-neutral-500">{isBangla ? 'প্লে কনসোল রেডি' : 'Google Play compliant'}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
              <Globe2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{isBangla ? 'টার্গেট ওএস ভার্সন' : 'Target OS Support'}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">API 24 - 35</div>
            <div className="text-[11px] text-neutral-500">{isBangla ? 'অ্যান্ড্রয়েড ৭ থেকে ১৫' : 'Android 7.0 up to 15'}</div>
          </div>
        </div>

        {/* Interactive Build Time Calculator Widget (Item #37) */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isBangla ? 'ইন্টারেক্টিভ বিল্ড টাইম ক্যালকুলেটর' : 'Interactive APK Build Time Calculator'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isBangla ? 'আপনার ওয়েব প্রোজেক্টের সাইজ অনুযায়ী বিল্ড সময় অনুমান করুন' : 'Simulate compile latency based on asset payload and security layers'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs text-neutral-500 block">{isBangla ? 'আনুমানিক সময়' : 'Est. Pipeline Time'}</span>
                <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">~{estimatedSeconds}s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-800/80 text-xs">
            <div>
              <label className="text-neutral-400 mb-1 flex justify-between">
                <span>{isBangla ? 'ওয়েব ফাইল সাইজ:' : 'Web Assets Size:'}</span>
                <span className="font-mono text-white">{assetSizeKb} KB</span>
              </label>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={assetSizeKb}
                onChange={(e) => setAssetSizeKb(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAdmob}
                  onChange={(e) => setIncludeAdmob(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-emerald-500 accent-emerald-500"
                />
                <span>AdMob SDK Hooks</span>
              </label>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProguard}
                  onChange={(e) => setIncludeProguard(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-emerald-500 accent-emerald-500"
                />
                <span>ProGuard Obfuscation</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
