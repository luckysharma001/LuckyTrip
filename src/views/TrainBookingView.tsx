import React, { useState, useEffect } from 'react';
import {
  Train,
  ArrowRightLeft,
  Calendar,
  Filter,
  ArrowUpDown,
  Clock,
  MapPin,
  Utensils,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { api } from '../api/client';
import { TrainSchedule, TrainClassFare } from '../types';

interface TrainBookingViewProps {
  searchParams: { from: string; to: string; date?: string; travelClass?: string; quota?: string };
  onSelectTrainForBooking: (train: TrainSchedule, selectedClass: TrainClassFare) => void;
}

export const TrainBookingView: React.FC<TrainBookingViewProps> = ({
  searchParams,
  onSelectTrainForBooking,
}) => {
  const [fromCode, setFromCode] = useState(searchParams.from || 'NDLS');
  const [toCode, setToCode] = useState(searchParams.to || 'BCT');
  const [date, setDate] = useState(searchParams.date || '2026-11-08');
  const [trains, setTrains] = useState<TrainSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [filterAcOnly, setFilterAcOnly] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'duration' | 'fare' | 'departure'>('departure');

  const fetchTrains = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.searchTrains(fromCode, toCode, date);
      setTrains(res.trains || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch train schedules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [fromCode, toCode, date]);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Filtered & sorted trains
  const filteredTrains = trains
    .filter((train) => {
      if (filterAcOnly) {
        const hasAc = train.classes.some((c) => ['1A', '2A', '3A', 'CC', 'EC'].includes(c.code));
        if (!hasAc) return false;
      }
      if (filterAvailableOnly) {
        const hasAvbl = train.classes.some((c) => c.statusType === 'available');
        if (!hasAvbl) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      if (sortBy === 'duration') {
        return parseInt(a.duration) - parseInt(b.duration);
      }
      if (sortBy === 'fare') {
        const minA = Math.min(...a.classes.map((c) => c.fare));
        const minB = Math.min(...b.classes.map((c) => c.fare));
        return minA - minB;
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Railway Booking Engine
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  SANDBOX TIMETABLE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                {fromCode} → {toCode}
              </h1>
              <p className="text-xs text-slate-300">
                Journey Date: <strong>{date}</strong> • {filteredTrains.length} Trains Running
              </p>
            </div>
          </div>

          {/* Quick Route Modifier */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 text-xs">
            <input
              type="text"
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value.toUpperCase())}
              className="bg-slate-800 text-white font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-600 w-24 text-center outline-none focus:border-sky-400"
              placeholder="NDLS"
            />
            <button
              onClick={handleSwap}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Swap"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={toCode}
              onChange={(e) => setToCode(e.target.value.toUpperCase())}
              className="bg-slate-800 text-white font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-600 w-24 text-center outline-none focus:border-sky-400"
              placeholder="BCT"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-800 text-white font-medium px-3 py-1.5 rounded-xl border border-slate-600 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Independent Notice */}
      <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>
            <strong>Independent Booking Architecture:</strong> LuckyTrip connects via standard railway sandbox specifications. Confirmations will generate verified demo reference numbers (e.g., DEMO-TR-XXXX).
          </span>
        </div>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filters:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="checkbox"
              checked={filterAcOnly}
              onChange={(e) => setFilterAcOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>AC Coaches Only</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="checkbox"
              checked={filterAvailableOnly}
              onChange={(e) => setFilterAvailableOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>Confirmed Seats Only</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-bold text-slate-700">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 outline-none"
          >
            <option value="departure">Departure Time (Earliest)</option>
            <option value="duration">Travel Duration (Fastest)</option>
            <option value="fare">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Train List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/3"></div>
              <div className="h-10 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredTrains.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
          <Train className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No trains found for selected criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your station codes or removing filters to view all scheduled services.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Train Header Info */}
              <div className="p-5 sm:p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                        #{train.trainNumber}
                      </span>
                      <h3 className="text-base font-black text-slate-900">{train.trainName}</h3>
                      {train.pantryAvailable && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Utensils className="w-3 h-3 text-emerald-600" />
                          Pantry Car
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <span>Runs On:</span>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <span
                          key={day}
                          className={`font-semibold px-1 rounded ${
                            train.runningDays.includes(day) ? 'text-sky-700 bg-sky-50' : 'text-slate-300'
                          }`}
                        >
                          {day[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timings & Duration */}
                  <div className="flex items-center gap-6 sm:gap-10">
                    <div>
                      <p className="text-lg font-black text-slate-900">{train.departureTime}</p>
                      <p className="text-xs text-slate-500 font-semibold">{train.originStation}</p>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{train.originCode}</span>
                    </div>

                    <div className="text-center px-2">
                      <span className="text-[10px] font-bold text-slate-400 block">{train.duration}</span>
                      <div className="w-20 h-0.5 bg-slate-200 relative my-1">
                        <div className="w-2 h-2 rounded-full bg-sky-600 absolute -top-[3px] left-1/2 -translate-x-1/2"></div>
                      </div>
                      <span className="text-[10px] text-slate-400">{train.distanceKm} km</span>
                    </div>

                    <div>
                      <p className="text-lg font-black text-slate-900">{train.arrivalTime}</p>
                      <p className="text-xs text-slate-500 font-semibold">{train.destinationStation}</p>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{train.destinationCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class Cards & Live Availability */}
              <div className="p-4 sm:p-5 bg-slate-50/70">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {train.classes.map((cls) => {
                    const isAvbl = cls.statusType === 'available';
                    return (
                      <div
                        key={cls.code}
                        onClick={() => onSelectTrainForBooking(train, cls)}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{cls.name}</span>
                          <span className="font-mono text-[10px] font-bold text-slate-400">({cls.code})</span>
                        </div>

                        <div className="my-2">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md inline-block ${
                              isAvbl
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {cls.availability}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">₹{cls.fare}</span>
                          <span className="text-[11px] font-bold text-sky-700 group-hover:translate-x-0.5 transition-transform flex items-center">
                            Book <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
