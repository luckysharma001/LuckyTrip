import React from 'react';
import { X, CheckCircle2, Printer, Download, Share2, Calendar, MapPin, Users, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onViewMyTrips: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onViewMyTrips,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Booking Confirmed
              </span>
              <h3 className="text-xl font-black">Ready for Departure!</h3>
              <p className="text-xs text-emerald-100">
                Booking Ref: <span className="font-mono font-bold text-white tracking-wider">{booking.referenceNumber}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Printable Ticket Slip */}
        <div className="p-6 space-y-6 printable-ticket">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-dashed border-slate-300 gap-3">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Service</span>
              <h4 className="text-base font-bold text-slate-900">{booking.serviceName}</h4>
              {booking.serviceNumber && (
                <p className="text-xs font-mono font-semibold text-sky-700">#{booking.serviceNumber}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  CONFIRMED (PAID)
                </div>
              </div>
              {/* QR Code Pass */}
              <div className="w-16 h-16 bg-slate-50 p-1.5 rounded-lg border border-slate-300 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Route & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Origin & Destination</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{booking.origin}</p>
              <div className="my-1 border-l-2 border-slate-300 pl-2 text-[11px] text-slate-500">to</div>
              <p className="text-xs font-bold text-slate-900">{booking.destination}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Travel Date</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">{booking.journeyDate}</p>
              {booking.returnDate && (
                <p className="text-xs text-slate-500 mt-1">Return: {booking.returnDate}</p>
              )}
              {booking.roomDetails && (
                <div className="mt-2 text-xs text-slate-600">
                  <p>Room: <strong>{booking.roomDetails.roomType}</strong></p>
                  <p>Stay: <strong>{booking.roomDetails.nights} Nights</strong> ({booking.roomDetails.guests} Guests)</p>
                </div>
              )}
            </div>
          </div>

          {/* Passengers & Seat Allocation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Passenger Details & Seat Assignments
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {booking.passengers.length} Traveller(s)
              </span>
            </div>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {booking.passengers.map((p, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="text-slate-500 ml-2">({p.age} yrs, {p.gender})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.coachNumber && (
                      <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                        Coach {p.coachNumber}
                      </span>
                    )}
                    {p.seatNumber && (
                      <span className="bg-sky-50 text-sky-800 font-mono font-bold px-2 py-0.5 rounded text-[11px] border border-sky-200">
                        Seat {p.seatNumber}
                      </span>
                    )}
                    {p.berthPreference && (
                      <span className="text-slate-500 text-[11px]">[{p.berthPreference}]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Fare & Tariffs</span>
              <span>₹{booking.pricing.baseFare.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & GST</span>
              <span>₹{booking.pricing.taxes.toLocaleString('en-IN')}</span>
            </div>
            {booking.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span>-₹{booking.pricing.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Convenience Fee</span>
              <span>{booking.pricing.convenienceFee === 0 ? 'FREE (Premium Perk)' : `₹${booking.pricing.convenienceFee}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>Total Paid ({booking.paymentMethod})</span>
              <span className="text-emerald-600 font-mono">₹{booking.pricing.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Sandbox note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Demo Mode Notice:</strong> This e-ticket and reference code ({booking.referenceNumber}) were generated inside LuckyTrip's test sandbox. You can cancel this trip at any time from My Trips to test our real-time refund tracking pipeline.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Print / Save Ticket
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onViewMyTrips}
                className="py-2.5 px-5 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                Go to My Trips
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
