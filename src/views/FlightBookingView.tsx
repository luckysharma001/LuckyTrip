import React, { useState, useEffect } from 'react';
import {
  Plane,
  ArrowRightLeft,
  Luggage,
  Clock,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { api } from '../api/client';
import { FlightSchedule, FlightFare } from '../types';

interface FlightBookingViewProps {
  searchParams: { from: string; to: string; date?: string; tripType?: string; cabinClass?: string };
  onSelectFlightForBooking: (flight: FlightSchedule, selectedFare: FlightFare) => void;
}

export const FlightBookingView: React.FC<FlightBookingViewProps> = ({
  searchParams,
  onSelectFlightForBooking,
}) => {
  const [fromCode, setFromCode] = useState(searchParams.from || 'DEL');
  const [toCode, setToCode] = useState(searchParams.to || 'GOI');
  const [date, setDate] = useState(searchParams.date || '2026-11-18');
  const [flights, setFlights] = useState<FlightSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  const fetchFlights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.searchFlights(fromCode, toCode, date);
      setFlights(res.flights || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search flights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [fromCode, toCode, date]);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const filteredFlights = flights
    .filter((f) => {
      if (nonStopOnly && f.stops > 0) return false;
      if (selectedAirline !== 'all' && f.airline !== selectedAirline) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        const minA = a.fares[0]?.price || 0;
        const minB = b.fares[0]?.price || 0;
        return minA - minB;
      }
      if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      return 0;
    });

  const airlinesList = Array.from(new Set(flights.map((f) => f.airline)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Domestic & International Airfare
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  GDS SANDBOX
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                {fromCode} → {toCode}
              </h1>
              <p className="text-xs text-slate-300">
                Departure: <strong>{date}</strong> • {filteredFlights.length} Direct & Connecting Flights
              </p>
            </div>
          </div>

          {/* Quick Modifier */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 text-xs">
            <input
              type="text"
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value.toUpperCase())}
              className="bg-slate-800 text-white font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-600 w-20 text-center outline-none"
            />
            <button
              onClick={handleSwap}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={toCode}
              onChange={(e) => setToCode(e.target.value.toUpperCase())}
              className="bg-slate-800 text-white font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-600 w-20 text-center outline-none"
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

      {/* Filter and Sorting */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Airlines:
          </span>
          <button
            onClick={() => setSelectedAirline('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              selectedAirline === 'all' ? 'bg-[#0B2545] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Airlines
          </button>
          {airlinesList.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedAirline(a)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                selectedAirline === a ? 'bg-[#0B2545] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {a}
            </button>
          ))}
          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={nonStopOnly}
              onChange={(e) => setNonStopOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>Non-Stop Only</span>
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
            <option value="price">Lowest Fare</option>
            <option value="departure">Departure (Earliest)</option>
          </select>
        </div>
      </div>

      {/* Flight Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="h-12 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredFlights.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
          <Plane className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No flights found matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting airline filters or choosing another departure date.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Flight overview */}
              <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Plane className="w-6 h-6 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{flight.airline}</h3>
                    <p className="text-xs font-mono font-semibold text-slate-500">{flight.flightNumber}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <Luggage className="w-3.5 h-3.5 text-slate-400" />
                      <span>Cabin: {flight.baggage.cabin}</span>
                      <span>•</span>
                      <span>Check-In: {flight.baggage.checkIn}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule timeline */}
                <div className="flex items-center gap-6 sm:gap-10">
                  <div>
                    <p className="text-xl font-black text-slate-900">{flight.departureTime}</p>
                    <p className="text-xs font-bold text-slate-500">{flight.originCode}</p>
                  </div>

                  <div className="text-center px-4">
                    <span className="text-[10px] font-bold text-slate-400 block">{flight.duration}</span>
                    <div className="w-24 h-0.5 bg-slate-200 relative my-1">
                      <div className="w-2 h-2 rounded-full bg-sky-600 absolute -top-[3px] left-1/2 -translate-x-1/2"></div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}
                    </span>
                  </div>

                  <div>
                    <p className="text-xl font-black text-slate-900">{flight.arrivalTime}</p>
                    <p className="text-xs font-bold text-slate-500">{flight.destinationCode}</p>
                  </div>
                </div>
              </div>

              {/* Fares Matrix (Saver / Flexi / Business) */}
              <div className="p-5 bg-slate-50/70">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {flight.fares.map((fare) => (
                    <div
                      key={fare.type}
                      onClick={() => onSelectFlightForBooking(flight, fare)}
                      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-xs text-slate-900">{fare.type} Fare</span>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            {fare.seatsLeft} Seats Left
                          </span>
                        </div>
                        <ul className="space-y-1 mb-4 text-[11px] text-slate-600">
                          {fare.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="truncate">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block leading-none">Total per adult</span>
                          <span className="text-base font-black text-slate-900">₹{fare.price.toLocaleString('en-IN')}</span>
                        </div>
                        <button className="px-3.5 py-1.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold group-hover:bg-[#07192F] transition-colors flex items-center gap-1">
                          Book <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
