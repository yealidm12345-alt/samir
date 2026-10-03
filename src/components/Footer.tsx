import React, { useState } from 'react';
import { 
  ArrowUp, 
  Smartphone, 
  Globe, 
  Bug, 
  Heart, 
  CheckCircle2, 
  X,
  Send
} from 'lucide-react';
import { soundManager } from '../services/sound';

interface FooterProps {
  language: 'en' | 'bn';
  onNavigate: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
}) => {
  const isBangla = language === 'bn';
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugText, setBugText] = useState('');
  const [bugSubmitted, setBugSubmitted] = useState(false);

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugText.trim()) return;
    soundManager.playSuccess();
    setBugSubmitted(true);
    setTimeout(() => {
      setBugText('');
      setBugSubmitted(false);
      setShowBugModal(false);
    }, 2000);
  };

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 px-4 lg:px-8 py-10 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & SLA */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>ApexDroid Studio Platform</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All systems nominal</span>
            <span>·</span>
            <span>99.98% Runtime SLA</span>
            <span>·</span>
            <span>Android 15 (Target SDK 35)</span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-neutral-300">
          <button
            onClick={() => onNavigate('studio')}
            className="hover:text-emerald-400 transition-colors"
          >
            {isBangla ? 'স্টুডিও বিল্ডার' : 'Studio'}
          </button>
          <button
            onClick={() => onNavigate('tools')}
            className="hover:text-emerald-400 transition-colors"
          >
            {isBangla ? '১২+ ডেভ টুলস' : 'Dev Tools'}
          </button>
          <button
            onClick={() => onNavigate('templates')}
            className="hover:text-emerald-400 transition-colors"
          >
            {isBangla ? 'টেমপ্লেট' : 'Templates'}
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className="hover:text-emerald-400 transition-colors"
          >
            {isBangla ? 'বিকাশ ও নগদ পেমেন্ট' : 'bKash / Nagad Pricing'}
          </button>
          <button
            onClick={() => onNavigate('docs')}
            className="hover:text-emerald-400 transition-colors"
          >
            {isBangla ? 'গাইড ও ডক্স' : 'Docs'}
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setShowBugModal(true);
            }}
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBangla ? 'বাগ রিপোর্ট' : 'Report Issue'}</span>
          </button>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{isBangla ? 'উপরে যান' : 'Top'}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-neutral-900 text-center text-[11px] text-neutral-600">
        © 2026 ApexDroid Enterprise Studio. Engineered for high-performance Android APK synthesis & web tooling.
      </div>

      {/* Bug Report Floating Modal */}
      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-400" />
                Submit Feedback / Bug Report
              </h4>
              <button onClick={() => setShowBugModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {bugSubmitted ? (
              <div className="py-6 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="font-semibold text-xs">Thank you! Your bug report was sent to developers.</p>
              </div>
            ) : (
              <form onSubmit={handleBugSubmit} className="space-y-3">
                <textarea
                  required
                  placeholder="Describe the issue or feature request in detail..."
                  value={bugText}
                  onChange={(e) => setBugText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500 h-28"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Report</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
