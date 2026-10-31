import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Clock, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

interface LegalViewProps {
  page: 'about' | 'privacy' | 'terms' | 'contact';
  onBack: () => void;
}

export const LegalViews: React.FC<LegalViewProps> = ({ page, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={onBack}
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* ABOUT LUCKYTRIP */}
      {page === 'about' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#0B2545]">Lucky<span className="text-sky-500">Trip</span></span>
            <span className="text-xs text-slate-400">• One App. Every Journey.</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">About LuckyTrip</h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            LuckyTrip is an independent, next-generation travel booking and transit management platform.
            Our mission is simple: bring trains, domestic flights, verified hotel stays, and city metro
            route planning into a cohesive, lightning-fast application with transparent pricing and instant
            cancellation tracking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-extrabold text-xs text-slate-900 mb-1">Multi-Modal Transit</h3>
              <p className="text-[11px] text-slate-500">
                Seamlessly chain intercity train travel with city metro transfers and airport connections.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-extrabold text-xs text-slate-900 mb-1">Financial Integrity</h3>
              <p className="text-[11px] text-slate-500">
                End-to-end refund tracking with clear provider deductions and automated settlement updates.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-extrabold text-xs text-slate-900 mb-1">Independent Integrity</h3>
              <p className="text-[11px] text-slate-500">
                Transparent distinction between testing sandboxes and production partner carrier integrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {page === 'privacy' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed">
          <h1 className="text-2xl font-black text-slate-900">Privacy Policy & Data Security</h1>
          <p className="text-[11px] text-slate-400">Effective Date: October 2026</p>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">1. Data Minimization & Collection</h2>
            <p>
              LuckyTrip collects only the personal information strictly necessary to process your travel
              reservations: passenger names, age, gender, contact phone number, and email address for digital
              ticket delivery. We never store credit card numbers, CVVs, or bank login credentials on our servers.
            </p>

            <h2 className="text-sm font-bold text-slate-900">2. DPDP Act Compliance & Right to Erasure</h2>
            <p>
              In accordance with Digital Personal Data Protection laws, users retain complete authority to view,
              update, export, or permanently delete their saved traveller profiles and account sessions via the
              User Profile settings panel.
            </p>

            <h2 className="text-sm font-bold text-slate-900">3. OTP Authentication Security</h2>
            <p>
              Authentication is handled through time-bound One-Time Passwords (OTPs) with expiration windows.
              Plaintext passwords are never collected or stored.
            </p>
          </div>
        </div>
      )}

      {/* TERMS AND CONDITIONS */}
      {page === 'terms' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed">
          <h1 className="text-2xl font-black text-slate-900">Terms & Conditions of Service</h1>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
            <strong className="block mb-1">Independent Platform Notice:</strong>
            LuckyTrip is an independent travel discovery platform. In Demo Sandbox mode, all booking references
            (prefixed with DEMO-) are simulated for user interface demonstration and do not grant physical transit
            boarding rights. Real-world bookings require authorized carrier API configurations.
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">1. Booking & Inventory Disclaimer</h2>
            <p>
              Fares, schedules, seat numbers, and coach allocations are subject to carrier provider rules.
              LuckyTrip does not guarantee Tatkal railway inventory or unreleased carrier seats.
            </p>

            <h2 className="text-sm font-bold text-slate-900">2. Cancellation & Refunds</h2>
            <p>
              Cancellations requested through LuckyTrip are processed pursuant to the carrier's stated tariff
              policies. Applicable convenience fees or non-refundable quotas will be deducted transparently
              prior to refund issuance.
            </p>

            <h2 className="text-sm font-bold text-slate-900">3. LuckyTrip Premium Membership</h2>
            <p>
              The ₹999/year LuckyTrip Premium subscription is an optional fee waiver and priority support tier.
              It does not influence railway waitlist prioritization or airline flight schedules.
            </p>
          </div>
        </div>
      )}

      {/* CONTACT SUPPORT */}
      {page === 'contact' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <h1 className="text-2xl font-black text-slate-900">Contact LuckyTrip Concierge</h1>
          <p className="text-xs text-slate-500">
            Have questions about a journey or need help with a refund? Reach out to our 24x7 desk.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Mail className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-xs text-slate-900">Email Support Desk</h3>
              <p className="text-xs text-slate-500">support@luckytrip.internal</p>
              <span className="text-[10px] text-emerald-600 font-bold block">Average reply within 15 mins</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-xs text-slate-900">Traveller Helpline (Sandbox)</h3>
              <p className="text-xs text-slate-500">+91 1800-LUCKY-TRIP (Toll Free)</p>
              <span className="text-[10px] text-slate-400 block">Available 24x7 all days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
