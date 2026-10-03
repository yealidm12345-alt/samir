import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Keyboard, 
  Smartphone, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Terminal,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { soundManager } from '../services/sound';

interface DocsViewProps {
  language: 'en' | 'bn';
}

export const DocsView: React.FC<DocsViewProps> = ({ language }) => {
  const isBangla = language === 'bn';
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: isBangla ? 'ওয়েব কোড থেকে APK কিভাবে প্যাকেজ হয়?' : 'How does ApexDroid package web code into native Android APKs?',
      a: isBangla
        ? 'ApexDroid ব্রাউজার সাইড বাইটকোড ইঞ্জিন ব্যবহার করে। এটি স্বয়ংক্রিয়ভাবে AndroidManifest.xml, MainActivity.kt ওয়েবভিউ র্যাপার, ক্রিপ্টোগ্রাফিক কি-স্টোর সিগনেচার এবং প্রোগার্ড মিনিফিকেশন সম্পন্ন করে সরাসরি ডাউনলোডযোগ্য .apk বাইনারি তৈরি করে।'
        : 'ApexDroid compiles your HTML5, CSS, and JS into an optimized native WebView Android application container with full hardware acceleration, sensor bridges, and cryptographic RSA 2048 signing.',
    },
    {
      q: isBangla ? 'বিকাশ ও নগদে পেমেন্ট করলে কতক্ষণে এক্টিভেশন হয়?' : 'What is the activation timeframe for bKash & Nagad payments?',
      a: isBangla
        ? 'পেমেন্ট সাবমিট করার পর ট্রানজেকশন আইডি (TrxID) আমাদের অ্যাডমিন ভেরিফিকেশন কিউতে জমা হয়। অ্যাডমিন স্টেটমেন্ট চেক করে ৫-১৫ মিনিটের মধ্যে অনুমোদন প্রদান করলে সাথে সাথে আনলিমিটেড বিল্ড সক্রিয় হয়ে যায়।'
        : 'Manual payments enter the pending admin verification queue. Once verified by the operator against the merchant statement, unlimited build credits are activated immediately.',
    },
    {
      q: isBangla ? 'আমি কি এই APK গুগল প্লে স্টোরে আপলোড করতে পারব?' : 'Can I upload the generated APK to the Google Play Console?',
      a: isBangla
        ? 'হ্যাঁ! প্রজেক্টে জেনারেট হওয়া Android Studio .zip ফাইলটি যেকোনো আধুনিক অ্যান্ড্রয়েড স্টুডিওতে ইমপোর্ট করে সরাসরি Google Play Store-এর জন্য AAB (Android App Bundle) রিলিজ তৈরি করা যায়।'
        : 'Yes. In addition to the direct installable .apk, you can download the full Android Studio project ZIP containing complete Gradle scripts and signed assets ready for Play Console publishing.',
    },
    {
      q: isBangla ? 'অ্যাডমিন প্যানেল কিভাবে ওপেন করতে হয়?' : 'How is the administrative panel accessed?',
      a: isBangla
        ? 'অ্যাডমিন প্যানেলটি মূল ওয়েবসাইট থেকে সম্পূর্ণ পৃথক। এটি শুধুমাত্র ডোমেইনের ঠিকানার শেষে /admin লিখে এন্টার দিলেই ওপেন হয় (যেমন: yourdomain.com/admin)। অন্য কোনোভাবে এটি অ্যাক্সেস করা সম্ভব নয়।'
        : 'The administrative command center is strictly separated from the public domain and opens exclusively by appending /admin to the domain name (e.g. yourdomain.com/admin). It cannot be accessed through any on-screen button or link.',
    },
  ];

  const shortcuts = [
    { key: 'Ctrl + B', action: isBangla ? 'APK কম্পাইল শুরু করুন' : 'Trigger APK Build' },
    { key: 'Ctrl + S', action: isBangla ? 'প্রজেক্ট কোড সংরক্ষণ' : 'Save Project State' },
    { key: 'Esc', action: isBangla ? 'মডাল বা ড্রয়ার বন্ধ করুন' : 'Close Active Modal' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          {isBangla ? 'ডকুমেন্টেশন ও ডেভেলপমেন্ট গাইডলাইন' : 'Documentation & Developer Reference'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {isBangla
            ? 'অ্যান্ড্রয়েড নেটিভ রানটাইম ব্রিজ, পারমিশন হ্যান্ডলিং এবং প্লে স্টোর পাবলিশিং গাইড।'
            : 'Comprehensive developer guides for Android hardware APIs, runtime bridges, and distribution.'}
        </p>
      </div>

      {/* Code Snippets Guide */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Native Android Bridge API Specification
        </h3>
        <p className="text-xs text-neutral-400">
          The following native JavaScript interfaces are pre-injected into the Android WebView client:
        </p>
        <pre className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`// 1. Trigger Native Hardware Haptic Pulse
window.AndroidBridge.vibratePhone(150); // duration in milliseconds

// 2. Display Native Android System Toast
window.AndroidBridge.showToast("Saved to offline database!");

// 3. Native File Picker (Camera & Storage)
// Simply use standard HTML5 file inputs:
<input type="file" accept="image/*" capture="environment">`}
        </pre>
      </div>

      {/* Keyboard Shortcuts Cheat-sheet */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-amber-400" />
          {isBangla ? 'কিবোর্ড শর্টকাট তালিকা' : 'Keyboard Shortcuts Cheat-Sheet'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-300">{sc.action}</span>
              <kbd className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-emerald-400 font-mono text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable FAQ Accordion */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          {isBangla ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)' : 'Frequently Asked Questions'}
        </h3>

        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden"
            >
              <button
                onClick={() => {
                  soundManager.playClick();
                  setOpenFaq(isOpen ? null : idx);
                }}
                className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs text-white hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {isOpen && (
                <div className="p-4 pt-0 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
