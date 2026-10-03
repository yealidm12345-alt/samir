import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Download, 
  Share2, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  FolderArchive, 
  Copy, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompilationResult } from '../services/apkBuilder';
import { soundManager } from '../services/sound';

interface ApkBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CompilationResult | null;
  stepMessage: string;
  progressPercent: number;
  isBuilding: boolean;
  onOpenUpgradeModal: () => void;
  language: 'en' | 'bn';
}

export const ApkBuildModal: React.FC<ApkBuildModalProps> = ({
  isOpen,
  onClose,
  result,
  stepMessage,
  progressPercent,
  isBuilding,
  onOpenUpgradeModal,
  language,
}) => {
  const isBangla = language === 'bn';
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (result && result.success && !isBuilding) {
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [result, isBuilding]);

  if (!isOpen) return null;

  const downloadApk = () => {
    if (!result?.apkBlob) return;
    soundManager.playClick();
    const url = URL.createObjectURL(result.apkBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.apkFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProjectZip = () => {
    if (!result?.projectZipBlob) return;
    soundManager.playClick();
    const url = URL.createObjectURL(result.projectZipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.projectFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyShareLink = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(`https://apexdroid.studio/dl/${result?.packageId || 'app'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isBuilding
                  ? (isBangla ? 'অ্যান্ড্রয়েড এপিকে বিল্ড পাইপলাইন' : 'Packaging Android Native APK...')
                  : (result?.success ? (isBangla ? 'এপিকে কম্পাইলেশন সম্পন্ন!' : 'Compilation Succeeded!') : 'Build Failed')}
              </h3>
              <p className="text-xs text-neutral-400">
                {isBuilding ? 'ProGuard minification & Keystore v2 signing in progress' : 'Target Architecture: arm64-v8a, armeabi-v7a, x86_64'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Building In-Progress State */}
        {isBuilding && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-neutral-800 border-t-emerald-500 animate-spin"></div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">{stepMessage}</div>
              <div className="text-xs font-mono text-neutral-400">{progressPercent}% complete</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Build Success State */}
        {!isBuilding && result?.success && (
          <div className="space-y-4">
            {/* Meta details card */}
            <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Binary File:</span>
                <span className="font-mono font-semibold text-white">{result.apkFileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Package Identifier:</span>
                <span className="font-mono text-neutral-300">{result.packageId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Simulated APK Payload:</span>
                <span className="font-mono text-emerald-400 font-bold">{result.apkSizeFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">SHA-256 Digest:</span>
                <span className="font-mono text-neutral-500 truncate max-w-[220px]" title={result.sha256Fingerprint}>
                  {result.sha256Fingerprint}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Target Platform:</span>
                <span className="text-emerald-400 font-semibold">Android 15 (API Level 35)</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={downloadApk}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isBangla ? 'ডাউনলোড APK (.apk)' : 'Download APK (.apk)'}</span>
              </button>

              <button
                onClick={downloadProjectZip}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <FolderArchive className="w-4 h-4 text-purple-400" />
                <span>{isBangla ? 'অ্যান্ড্রয়েড প্রজেক্ট (.zip)' : 'Project Source (.zip)'}</span>
              </button>
            </div>

            {/* Quick Actions (QR code & Share) */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowQr(!showQr);
                }}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showQr ? 'Hide QR Code' : 'Scan QR for Mobile'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
                </button>
              </div>
            </div>

            {/* QR Code Container */}
            {showQr && (
              <div className="p-4 bg-white rounded-xl flex flex-col items-center justify-center space-y-2">
                <div className="w-40 h-40 bg-neutral-950 p-2 rounded-lg flex items-center justify-center">
                  {/* High Density QR code SVG pattern */}
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Corners */}
                    <rect x="10" y="10" width="25" height="25" fill="#000000" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#000000" />

                    <rect x="65" y="10" width="25" height="25" fill="#000000" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#000000" />

                    <rect x="10" y="65" width="25" height="25" fill="#000000" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#000000" />

                    {/* Data grid marks */}
                    <rect x="42" y="12" width="6" height="6" fill="#000000" />
                    <rect x="52" y="12" width="6" height="6" fill="#000000" />
                    <rect x="42" y="24" width="6" height="6" fill="#000000" />
                    <rect x="12" y="42" width="6" height="6" fill="#000000" />
                    <rect x="24" y="42" width="6" height="6" fill="#000000" />
                    <rect x="40" y="40" width="20" height="20" fill="#000000" />
                    <rect x="45" y="45" width="10" height="10" fill="#ffffff" />
                    <rect x="68" y="42" width="8" height="8" fill="#000000" />
                    <rect x="80" y="52" width="8" height="8" fill="#000000" />
                    <rect x="42" y="68" width="8" height="8" fill="#000000" />
                    <rect x="54" y="76" width="8" height="8" fill="#000000" />
                    <rect x="68" y="68" width="18" height="18" fill="#000000" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-800">
                  Scan with your Android camera to download directly
                </span>
              </div>
            )}
          </div>
        )}

        {/* Build Error State */}
        {!isBuilding && result && !result.success && (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Compilation could not proceed due to syntax or validation issues:</span>
            </div>
            <ul className="space-y-1 text-xs text-neutral-300 font-mono pl-4 list-disc">
              {result.errors?.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
