import React, { useState } from 'react';
import {
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Crown,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { PaymentModal } from '../components/PaymentModal';
import { User, Passenger, Booking } from '../types';

interface CheckoutViewProps {
  user: User | null;
  bookingData: {
    bookingType: 'train' | 'flight' | 'hotel' | 'metro' | 'bus';
    title: string;
    origin: string;
    destination: string;
    journeyDate: string;
    returnDate?: string;
    serviceNumber?: string;
    serviceName: string;
    passengers: Passenger[];
    roomDetails?: any;
    metroDetails?: any;
    baseFare: number;
    taxes: number;
  };
  onPaymentComplete: (booking: Booking) => void;
  onBack: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  user,
  bookingData,
  onPaymentComplete,
  onBack,
}) => {
  const [promoCode, setPromoCode] = useState('FIRSTTRIP');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const passengerCount = bookingData.passengers.length || 1;
  const baseTotal = bookingData.baseFare * passengerCount;
  const taxesTotal = bookingData.taxes * passengerCount;
  const convenienceFee = user?.isPremium ? 0 : 50;
  const totalPayable = Math.max(0, baseTotal + taxesTotal + convenienceFee - discount);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    try {
      const res = await api.validatePromo(promoCode.trim(), baseTotal);
      setDiscount(res.discount);
      setAppliedPromo(res.code);
    } catch (err: any) {
      setPromoError(err.message || 'Invalid promo coupon');
      setDiscount(0);
      setAppliedPromo(null);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails: { paymentId: string; method: string }) => {
    setIsPaymentModalOpen(false);
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        bookingType: bookingData.bookingType,
        title: bookingData.title,
        origin: bookingData.origin,
        destination: bookingData.destination,
        journeyDate: bookingData.journeyDate,
        returnDate: bookingData.returnDate,
        serviceNumber: bookingData.serviceNumber,
        serviceName: bookingData.serviceName,
        passengers: bookingData.passengers,
        roomDetails: bookingData.roomDetails,
        metroDetails: bookingData.metroDetails,
        pricing: {
          baseFare: baseTotal,
          taxes: taxesTotal,
          convenienceFee,
          discount,
          totalAmount: totalPayable,
        },
        paymentMethod: paymentDetails.method,
        paymentId: paymentDetails.paymentId,
      };

      const res = await api.createBooking(payload);
      onPaymentComplete(res.booking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Review & Pay</h1>
          <p className="text-xs text-slate-500">Secure 256-Bit SSL Encrypted Checkout</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itinerary & Passengers Summary */}
        <div className="lg:col-span-7 space-y-5">
          {/* Trip Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                  {bookingData.bookingType.toUpperCase()} RESERVATION
                </span>
                <h3 className="text-base font-black text-slate-900">{bookingData.title}</h3>
              </div>
              {bookingData.serviceNumber && (
                <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                  #{bookingData.serviceNumber}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">From</span>
                <p className="font-bold text-slate-900">{bookingData.origin}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">To</span>
                <p className="font-bold text-slate-900">{bookingData.destination}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Travel Date</span>
                <p className="font-bold text-slate-900">{bookingData.journeyDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Service Provider</span>
                <p className="font-bold text-slate-900">{bookingData.serviceName}</p>
              </div>
            </div>

            {/* Passenger List */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Confirmed Travellers ({bookingData.passengers.length})
              </span>
              <div className="space-y-1.5">
                {bookingData.passengers.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{p.name} ({p.age}y, {p.gender})</span>
                    <span className="font-mono text-[11px] text-slate-500">{p.berthPreference || p.seatNumber || 'Allocated at boarding'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancellation Policy summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Standard Cancellation Terms
            </p>
            <p className="text-[11px] text-slate-500">
              You can cancel this booking at any time via My Trips. Transparent provider deductions apply and remaining funds will be tracked through our real-time refund pipeline.
            </p>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Promo Code */}
        <div className="lg:col-span-5 space-y-5">
          {/* Promo code widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-sky-600" />
              Have a Promo Coupon?
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="FIRSTTRIP"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase font-bold outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isApplyingPromo}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60"
              >
                {isApplyingPromo ? 'Checking...' : 'Apply'}
              </button>
            </div>

            {appliedPromo && (
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Coupon {appliedPromo} applied! ₹{discount} saved.
              </p>
            )}

            {promoError && (
              <p className="text-xs text-red-600">{promoError}</p>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({passengerCount} Traveller{passengerCount > 1 ? 's' : ''})</span>
                <span>₹{baseTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Taxes & Regulatory Fees</span>
                <span>₹{taxesTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 items-center">
                <span className="flex items-center gap-1">
                  Convenience Fee
                  {user?.isPremium && (
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </span>
                <span>
                  {user?.isPremium ? (
                    <span className="text-emerald-600 font-bold">FREE (Waived)</span>
                  ) : (
                    `₹${convenienceFee}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400">All Taxes Included</span>
                </div>
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Launch Payment Modal Button */}
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4 text-sky-400" />
              <span>Pay ₹{totalPayable.toLocaleString('en-IN')} via Sandbox Gateway</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated Payment Gateway Sandbox • No Real Card Charged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={totalPayable}
        bookingTitle={bookingData.title}
        onSuccess={handlePaymentSuccess}
        onFailure={(err) => setErrorMsg(err)}
      />
    </div>
  );
};
