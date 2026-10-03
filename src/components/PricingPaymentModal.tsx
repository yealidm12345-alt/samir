import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  AlertCircle,
  HelpCircle,
  Copy
} from 'lucide-react';
import { UserAccount, PaymentTransaction, PlatformConfig } from '../types';
import { StorageService } from '../services/storage';
import { soundManager } from '../services/sound';

interface PricingPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  currency: 'USD' | 'BDT' | 'EUR';
  language: 'en' | 'bn';
  onPaymentSubmitted: (tx: PaymentTransaction) => void;
}

export const PricingPaymentModal: React.FC<PricingPaymentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currency,
  language,
  onPaymentSubmitted,
}) => {
  const isBangla = language === 'bn';
  const config = StorageService.getPlatformConfig();

  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro');
  const [gateway, setGateway] = useState<'bkash' | 'nagad'>('bkash');
  const [senderPhone, setSenderPhone] = useState(currentUser.phone || '');
  const [trxId, setTrxId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const basePriceBdt = selectedPlan === 'pro' ? 1200 : 3900;
  const basePriceUsd = selectedPlan === 'pro' ? 12 : 39;

  const finalPriceBdt = Math.round(basePriceBdt * (1 - discountApplied / 100));
  const finalPriceUsd = Math.round(basePriceUsd * (1 - discountApplied / 100));

  const applyCoupon = () => {
    soundManager.playClick();
    const coupons = StorageService.getCoupons();
    const match = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
    );
    if (match) {
      soundManager.playSuccess();
      setDiscountApplied(match.discountPercent);
      setErrorMsg('');
    } else {
      soundManager.playError();
      setErrorMsg('Invalid or expired coupon code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim()) {
      setErrorMsg('Please enter your sender mobile number');
      return;
    }
    if (!trxId.trim() || trxId.length < 6) {
      setErrorMsg('Please enter a valid TrxID (minimum 6 characters)');
      return;
    }

    setIsSubmitting(true);
    soundManager.playClick();

    setTimeout(() => {
      const newTx: PaymentTransaction = {
        id: `trx_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        gateway,
        senderPhone: senderPhone.trim(),
        trxId: trxId.trim().toUpperCase(),
        plan: selectedPlan,
        amount: finalPriceBdt,
        currency: 'BDT',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const existing = StorageService.getTransactions();
      StorageService.saveTransactions([newTx, ...existing]);

      // Add to admin audit log
      StorageService.addAuditLog(
        `PAYMENT_SUBMITTED_${gateway.toUpperCase()}`,
        `User ${currentUser.email} submitted ${newTx.trxId} for ${selectedPlan}`,
        'medium'
      );

      soundManager.playSuccess();
      setIsSubmitting(false);
      onPaymentSubmitted(newTx);
      onClose();
    }, 600);
  };

  const targetNumber = gateway === 'bkash' ? config.bkashNumber : config.nagadNumber;

  const copyTargetNumber = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(targetNumber.split(' ')[0]);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isBangla ? 'প্রিমিয়াম সাবস্ক্রিপশন ও পেমেন্ট গেটওয়ে' : 'Upgrade to Unlimited Builds & Pro Features'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isBangla ? 'বিকাশ ও নগদ ইনস্ট্যান্ট ম্যানুয়াল ভেরিফিকেশন' : 'Instant bKash, Nagad & Card payment gateway'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Plan Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Pro Plan */}
          <div
            onClick={() => {
              soundManager.playClick();
              setSelectedPlan('pro');
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedPlan === 'pro'
                ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pro Developer</span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {currency === 'BDT' ? `৳1,200` : `$12`}
                  <span className="text-xs font-normal text-neutral-400"> / month</span>
                </div>
              </div>
              {selectedPlan === 'pro' && <Check className="w-5 h-5 text-emerald-400" />}
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-neutral-300">
              <li className="flex items-center gap-1.5">✓ Unlimited APK Compilations</li>
              <li className="flex items-center gap-1.5">✓ ProGuard Code Obfuscation</li>
              <li className="flex items-center gap-1.5">✓ AdMob Banner & Interstitial IDs</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div
            onClick={() => {
              soundManager.playClick();
              setSelectedPlan('enterprise');
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedPlan === 'enterprise'
                ? 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Enterprise Studio</span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {currency === 'BDT' ? `৳3,900` : `$39`}
                  <span className="text-xs font-normal text-neutral-400"> / month</span>
                </div>
              </div>
              {selectedPlan === 'enterprise' && <Check className="w-5 h-5 text-purple-400" />}
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-neutral-300">
              <li className="flex items-center gap-1.5">✓ Everything in Pro</li>
              <li className="flex items-center gap-1.5">✓ White-label Keystore Signing</li>
              <li className="flex items-center gap-1.5">✓ Priority Compile Queues</li>
            </ul>
          </div>
        </div>

        {/* Payment Gateway Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gateway Switcher */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-2">
              {isBangla ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Method:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setGateway('bkash');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                  gateway === 'bkash'
                    ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                }`}
              >
                <span>bKash (বিকাশ)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setGateway('nagad');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                  gateway === 'nagad'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                }`}
              >
                <span>Nagad (নগদ)</span>
              </button>
            </div>
          </div>

          {/* Payment Instructions Box */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="font-semibold text-white">
                {gateway === 'bkash' ? 'bKash Send Money / Payment:' : 'Nagad Send Money / Payment:'}
              </span>
              <button
                type="button"
                onClick={copyTargetNumber}
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNumber ? 'Copied' : 'Copy Number'}</span>
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400 tracking-wide">
              {targetNumber}
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              {isBangla
                ? `উপরের নম্বরে ৳${finalPriceBdt} টাকা 'Send Money' অথবা 'Payment' করুন। এরপর আপনার প্রেরক নম্বর এবং প্রাপ্ত TrxID নিচে জমা দিন।`
                : `Send BDT ৳${finalPriceBdt} to the account above, copy the TrxID from your SMS/app, and submit below for verification.`}
            </p>
          </div>

          {/* Coupon Code Section */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={isBangla ? 'কুপন কোড (যেমন: PRO50)' : 'Coupon Code (e.g. PRO50)'}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs uppercase font-mono text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold"
            >
              Apply
            </button>
          </div>

          {discountApplied > 0 && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Coupon Applied: {discountApplied}% Off! New Total: ৳{finalPriceBdt}</span>
            </div>
          )}

          {/* Form Inputs: Sender Phone & TrxID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                {isBangla ? 'আপনার প্রেরক মোবাইল নম্বর:' : 'Your Sender Mobile Number:'}
              </label>
              <input
                type="text"
                required
                placeholder="017XXXXXXXX"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                {isBangla ? 'ট্রানজেকশন আইডি (TrxID):' : 'Transaction ID (TrxID):'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BKA88392KL"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 flex items-center gap-1.5 p-2 rounded bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting
              ? (isBangla ? 'জমা দেওয়া হচ্ছে...' : 'Submitting for review...')
              : (isBangla ? `পেমেন্ট সম্পন্ন করুন (৳${finalPriceBdt})` : `Submit Payment Verification (৳${finalPriceBdt})`)}
          </button>
        </form>
      </div>
    </div>
  );
};
