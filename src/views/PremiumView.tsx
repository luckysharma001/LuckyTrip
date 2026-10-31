import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { api } from '../api/client';
import { User } from '../types';

interface PremiumViewProps {
  user: User | null;
  onUpgradeSuccess: (updatedUser: User) => void;
  onOpenAuth: () => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({
  user,
  onUpgradeSuccess,
  onOpenAuth,
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSubscribing(true);
    setSuccessMsg(null);
    try {
      const res = await api.subscribePremium();
      setSuccessMsg('Congratulations! LuckyTrip Premium Annual has been activated for your account.');
      onUpgradeSuccess({
        ...user,
        isPremium: true,
        premiumUntil: res.validUntil,
      });
    } catch {
      // ignore
    } finally {
      setIsSubscribing(false);
    }
  };

  const benefits = [
    {
      title: 'Zero Convenience Fees',
      desc: 'Save ₹50 to ₹250 on every train, flight, and hotel reservation made on LuckyTrip.',
      icon: Zap,
    },
    {
      title: 'Saved Travellers Auto-Sync',
      desc: 'Store up to 20 frequent co-travellers and autofill names, ages, and berth preferences with 1 click.',
      icon: CheckCircle2,
    },
    {
      title: 'Priority Support Desk',
      desc: 'Dedicated rapid turnaround support for booking changes, refund inquiries, and journey alerts.',
      icon: HelpCircle,
    },
    {
      title: 'Multi-Modal Trip Organiser',
      desc: 'Combine train, flight, hotel, and metro receipts into a single downloadable PDF expense report.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#0B2545] via-[#07192F] to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Crown className="w-96 h-96 text-amber-400" />
        </div>

        <div className="relative max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Crown className="w-4 h-4 text-amber-400" />
            LUCKYTRIP PREMIUM ANNUAL
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Elevate Every Trip for <br />
            <span className="text-amber-400">₹999 / Year</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Designed for frequent travellers. Unlock ₹0 convenience fee booking privileges,
            priority concierge assistance, and streamlined multi-passenger management.
          </p>

          {user?.isPremium ? (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-4 py-2 rounded-2xl text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Subscription (Valid until {new Date(user.premiumUntil || '').toLocaleDateString()})
              </span>
            </div>
          ) : (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubscribing ? 'Processing Activation...' : 'Activate Premium (Sandbox Test)'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Compliance Disclaimer Notice (Crucial requirement from prompt) */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-600" />
          Clear Subscription Disclaimer:
        </p>
        <p className="text-[11px] leading-relaxed text-slate-500">
          LuckyTrip Premium is an optional convenience tier. LuckyTrip does NOT claim, promise, or guarantee Tatkal railway tickets, priority access to railway inventory, or guaranteed seat availability on any government railway or airline carrier. All seat availability and travel bookings remain strictly subject to underlying carrier rules and inventory.
        </p>
      </div>
    </div>
  );
};
