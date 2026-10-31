import React, { useState, useEffect } from 'react';
import {
  Bus,
  ArrowRightLeft,
  Clock,
  Star,
  ShieldCheck,
  Zap,
  Wifi,
  ChevronRight,
} from 'lucide-react';
import { api } from '../api/client';
import { BusSchedule } from '../types';

interface BusServicesViewProps {
  searchParams: { from?: string; to?: string; date?: string };
  onSelectBusForBooking: (bus: BusSchedule) => void;
}

export const BusServicesView: React.FC<BusServicesViewProps> = ({
  searchParams,
  onSelectBusForBooking,
}) => {
  const [fromCity, setFromCity] = useState(searchParams.from || 'Delhi');
  const [toCity, setToCity] = useState(searchParams.to || 'Jaipur');
  const [date, setDate] = useState(searchParams.date || '2026-11-10');
  const [buses, setBuses] = useState<BusSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.searchBuses(fromCity, toCity, date).then((res) => {
      setBuses(res.buses || []);
      setIsLoading(false);
    });
  }, [fromCity, toCity, date]);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Intercity AC & Electric Buses
              </span>
              <h1 className="text-xl sm:text-2xl font-black">{fromCity} → {toCity}</h1>
              <p className="text-xs text-slate-300">
                Departure: <strong>{date}</strong> • {buses.length} Premium Sleeper & Volvo Coaches
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 text-xs">
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl border border-slate-600 w-24 text-center outline-none"
            />
            <button onClick={handleSwap} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl border border-slate-600 w-24 text-center outline-none"
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

      {/* Bus Schedules */}
      <div className="space-y-4">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-black text-slate-900">{bus.operator}</h3>
                <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-[11px] font-bold border border-amber-200">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {bus.rating}
                </span>
                <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">
                  {bus.busType}
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                {bus.origin} → {bus.destination}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {bus.amenities.map((amenity, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-10">
              <div>
                <p className="text-lg font-black text-slate-900">{bus.departureTime}</p>
                <p className="text-xs text-slate-400">Boarding</p>
              </div>

              <div className="text-center px-2">
                <span className="text-[10px] font-bold text-slate-400 block">{bus.duration}</span>
                <div className="w-20 h-0.5 bg-slate-200 relative my-1">
                  <div className="w-2 h-2 rounded-full bg-sky-600 absolute -top-[3px] left-1/2 -translate-x-1/2"></div>
                </div>
              </div>

              <div>
                <p className="text-lg font-black text-slate-900">{bus.arrivalTime}</p>
                <p className="text-xs text-slate-400">Drop-off</p>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="text-left lg:text-right">
                <span className="text-xl font-black text-slate-900">₹{bus.fare}</span>
                <span className="text-[10px] text-emerald-600 font-bold block">{bus.seatsAvailable} Seats Left</span>
              </div>

              <button
                onClick={() => onSelectBusForBooking(bus)}
                className="px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1"
              >
                Select Seats <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
