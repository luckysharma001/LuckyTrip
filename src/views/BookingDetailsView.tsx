import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  XCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  QrCode,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { Booking, RefundRecord } from '../types';

interface BookingDetailsViewProps {
  bookingId: string;
  onBack: () => void;
  onOpenRefundTrack: (bookingId: string) => void;
  onOpenSupport: () => void;
}

export const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({
  bookingId,
  onBack,
  onOpenRefundTrack,
  onOpenSupport,
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [refund, setRefund] = useState<RefundRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cancellation modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of travel plan');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookingDetails(bookingId);
      setBooking(res.booking);
      if (res.refund) setRefund(res.refund);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [bookingId]);

  if (isLoading || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500">
        Loading journey details...
      </div>
    );
  }

  // Calculate estimated cancellation charges
  let estimatedFee = 180;
  if (booking.bookingType === 'flight') {
    estimatedFee = Math.round(booking.pricing.totalAmount * 0.25);
  } else if (booking.bookingType === 'hotel' || booking.bookingType === 'metro') {
    estimatedFee = 0;
  }
  const estimatedRefund = Math.max(0, booking.pricing.totalAmount - estimatedFee);

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await api.cancelBooking(booking.id, cancelReason);
      setBooking(res.booking);
      setRefund(res.refund);
      setIsCancelModalOpen(false);
    } catch (err: any) {
      setCancelError(err.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print E-Ticket</span>
          </button>
          <button
            onClick={onOpenSupport}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Trip Support</span>
          </button>
        </div>
      </div>

      {/* Booking Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-dashed border-slate-300 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black bg-[#0B2545] text-white px-3 py-1 rounded-xl">
                {booking.referenceNumber}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  booking.status === 'CANCELLED'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-2">{booking.title}</h2>
            <p className="text-xs text-slate-500">
              Provider: <strong>{booking.serviceName}</strong>
              {booking.serviceNumber && ` • Train/Flight #${booking.serviceNumber}`}
            </p>
          </div>

          <div className="w-20 h-20 bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-16 h-16 text-slate-800" />
          </div>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-bold block">Origin & Destination</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{booking.origin}</p>
            <p className="text-slate-400 my-0.5">to</p>
            <p className="font-bold text-slate-900 text-sm">{booking.destination}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold block">Journey Date</span>
            <p className="font-black text-slate-900 text-sm mt-0.5">{booking.journeyDate}</p>
            <p className="text-slate-500 mt-2">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
            <p className="text-slate-500">Payment ID: <span className="font-mono">{booking.paymentId}</span></p>
          </div>
        </div>

        {/* Passengers */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-600" />
            Passengers & Seat Allocation
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {booking.passengers.map((p, idx) => (
              <div key={idx} className="p-3.5 bg-white flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{p.name}</span>
                  <span className="text-slate-500 ml-2">({p.age}y, {p.gender})</span>
                </div>
                <div className="flex items-center gap-2">
                  {p.coachNumber && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                      Coach {p.coachNumber}
                    </span>
                  )}
                  {p.seatNumber && (
                    <span className="bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded font-mono font-bold text-sky-800">
                      Seat {p.seatNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fare Details */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Base Fare</span>
            <span>₹{booking.pricing.baseFare.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Taxes & GST</span>
            <span>₹{booking.pricing.taxes.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Convenience Fee</span>
            <span>{booking.pricing.convenienceFee === 0 ? 'FREE' : `₹${booking.pricing.convenienceFee}`}</span>
          </div>
          {booking.pricing.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount</span>
              <span>-₹{booking.pricing.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
            <span>Total Paid ({booking.paymentMethod})</span>
            <span className="font-mono text-emerald-600">₹{booking.pricing.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Panel: Cancellation or Refund Tracker */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {booking.status === 'CANCELLED' ? (
            <div className="w-full flex items-center justify-between bg-red-50 p-4 rounded-2xl border border-red-200">
              <div>
                <p className="text-xs font-black text-red-900">Trip Cancelled on {new Date(booking.cancellationDate || '').toLocaleDateString()}</p>
                <p className="text-[11px] text-red-700">Refund of ₹{booking.refundAmount} issued to {booking.paymentMethod}</p>
              </div>
              <button
                onClick={() => onOpenRefundTrack(booking.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Track Refund Status
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span>Need to make changes? You can cancel and receive an instant refund according to provider rules.</span>
              </div>
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Booking</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="text-base font-black text-slate-900">Confirm Booking Cancellation</h3>
                <p className="text-xs text-slate-500">Reference: {booking.referenceNumber}</p>
              </div>
            </div>

            {cancelError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">{cancelError}</p>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Original Booking Amount</span>
                <span>₹{booking.pricing.totalAmount}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Applicable Cancellation Charge</span>
                <span>-₹{estimatedFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Net Refund to be Processed</span>
                <span className="text-emerald-600 font-mono">₹{estimatedRefund}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Change of travel plan">Change of travel plan</option>
                <option value="Emergency or medical issue">Emergency or medical issue</option>
                <option value="Duplicate booking made">Duplicate booking made</option>
                <option value="Booked another travel mode">Booked another travel mode</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
