import React, { useState, useEffect } from 'react';
import {
  Briefcase as Suitcase,
  Train,
  Plane,
  Building2,
  TramFront as Subway,
  Bus,
  Search,
  Filter,
  Calendar,
  MapPin,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Printer,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../api/client';
import { Booking } from '../types';

interface MyTripsViewProps {
  onOpenBookingDetails: (bookingId: string) => void;
  onOpenRefundTrack: (bookingId: string) => void;
  onNavigateSearch: (tab: string) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  onOpenBookingDetails,
  onOpenRefundTrack,
  onNavigateSearch,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusTab, setStatusTab] = useState<'all' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookings(typeFilter, statusTab, searchQuery);
      setBookings(res.bookings || []);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusTab, typeFilter, searchQuery]);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'train':
        return <Train className="w-4 h-4 text-sky-600" />;
      case 'flight':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'hotel':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'metro':
        return <Subway className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bus className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Suitcase className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Unified Travel Hub
              </span>
              <h1 className="text-xl sm:text-3xl font-black">My Trips & Journeys</h1>
              <p className="text-xs text-slate-300">
                Manage upcoming itineraries, review past travels, and track cancellation refunds.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateSearch('train')}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition-colors flex items-center gap-2 shadow-md w-fit"
          >
            <span>Book New Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'All Trips' },
              { id: 'CONFIRMED', label: 'Upcoming' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'CANCELLED', label: 'Cancelled' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setStatusTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusTab === t.id ? 'bg-[#0B2545] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, station..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Travel Category Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Filter Type:</span>
          {['all', 'train', 'flight', 'hotel', 'metro', 'bus'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-lg font-semibold uppercase text-[11px] transition-colors ${
                typeFilter === type
                  ? 'bg-sky-50 text-sky-800 border border-sky-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 animate-pulse h-36"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
          <Suitcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No journeys found in this section</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book your next train, flight, hotel, or metro pass and track all documents here.
          </p>
          <button
            onClick={() => onNavigateSearch('train')}
            className="px-6 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const isCompleted = booking.status === 'COMPLETED';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-lg transition-all p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-100">
                      {getCategoryIcon(booking.bookingType)}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {booking.referenceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : isCompleted
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.isDemo && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Sandbox
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">{booking.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {booking.origin} → {booking.destination}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>{booking.journeyDate}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span>{booking.passengers.length} Traveller(s)</span>
                    </div>
                    <span>•</span>
                    <div className="font-semibold text-slate-900">
                      Paid: ₹{booking.pricing.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {isCancelled ? (
                    <button
                      onClick={() => onOpenRefundTrack(booking.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                      Track Refund
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenBookingDetails(booking.id)}
                      className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View E-Ticket & Actions
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
