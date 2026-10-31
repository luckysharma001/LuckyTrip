import React, { useState, useEffect } from 'react';
import {
  TramFront as Subway,
  ArrowRightLeft,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { api } from '../api/client';
import { MetroCityNetwork, MetroRouteResult } from '../types';

interface MetroTransitViewProps {
  onBookMetroPass: (routeResult: MetroRouteResult, tokens: number) => void;
}

export const MetroTransitView: React.FC<MetroTransitViewProps> = ({ onBookMetroPass }) => {
  const [cities, setCities] = useState<MetroCityNetwork[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('delhi');
  const [fromStation, setFromStation] = useState('Rajiv Chowk');
  const [toStation, setToStation] = useState('Botanical Garden');
  const [tokens, setTokens] = useState(1);
  const [routeResult, setRouteResult] = useState<MetroRouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getMetroCities().then((res) => {
      setCities(res || []);
    });
  }, []);

  const calculateRoute = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMetroRoute(selectedCityId, fromStation, toStation);
      setRouteResult(res);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [selectedCityId, fromStation, toStation]);

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const activeCity = cities.find((c) => c.cityId === selectedCityId) || cities[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Subway className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Urban Rail Transit
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                TRANSIT PLANNER & PASS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">City Metro Route & Smart Pass</h1>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Plan interchange stations, calculate fares, and generate digital single journey QR passes.
        </p>
      </div>

      {/* Network Selector & Stations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-700">Select City:</span>
          {['delhi', 'mumbai', 'bangalore'].map((cityId) => (
            <button
              key={cityId}
              type="button"
              onClick={() => {
                setSelectedCityId(cityId);
                if (cityId === 'delhi') {
                  setFromStation('Rajiv Chowk');
                  setToStation('Botanical Garden');
                } else if (cityId === 'mumbai') {
                  setFromStation('Versova');
                  setToStation('Ghatkopar');
                } else {
                  setFromStation('Nadaprabhu Kempegowda Stn (Majestic)');
                  setToStation('MG Road');
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                selectedCityId === cityId
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cityId === 'delhi' ? 'Delhi NCR' : cityId === 'mumbai' ? 'Mumbai' : 'Bengaluru'}
            </button>
          ))}
        </div>

        {/* Stations Input */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Origin Station</span>
            <input
              type="text"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
            />
          </div>

          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Destination Station</span>
            <input
              type="text"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
            />
          </div>
        </div>
      </div>

      {/* Calculated Route Plan & QR Token Generator */}
      {routeResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Fastest Corridor</span>
              <h3 className="text-xl font-black text-slate-900">
                {routeResult.fromStation} → {routeResult.toStation}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {routeResult.city} Transit Network • High Frequency
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Time</span>
                <span className="text-lg font-black text-slate-900 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-sky-600" />
                  {routeResult.estimatedMinutes} mins
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Standard Fare</span>
                <span className="text-2xl font-black text-emerald-600">₹{routeResult.fare}</span>
              </div>
            </div>
          </div>

          {/* Route Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Journey Navigation Steps & Interchange
            </h4>
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {routeResult.journeySteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pass Generator Action Box */}
          <div className="p-5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-2 rounded-xl border border-sky-200 shadow-xs flex items-center justify-center flex-shrink-0">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Generate Digital Metro QR Token</h4>
                <p className="text-xs text-slate-600">
                  Total for {tokens} token(s): <strong>₹{routeResult.fare * tokens}</strong> • Valid for 180 mins
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTokens(Math.max(1, tokens - 1))}
                  className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700"
                >
                  -
                </button>
                <span>{tokens}</span>
                <button
                  type="button"
                  onClick={() => setTokens(tokens + 1)}
                  className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onBookMetroPass(routeResult, tokens)}
                className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Book QR Pass</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              {routeResult.disclaimer} Digital tokens generated here simulate the complete AFC contactless gate pass experience.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
