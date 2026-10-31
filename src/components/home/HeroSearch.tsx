import React, { useState } from 'react';
import {
  Train,
  Plane,
  Building2,
  TramFront as Subway,
  Bus,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { TravelTab } from '../../types';

interface HeroSearchProps {
  currentTab: TravelTab;
  onTabChange: (tab: TravelTab) => void;
  onExecuteSearch: (tab: TravelTab, searchParams: any) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentTab,
  onTabChange,
  onExecuteSearch,
}) => {
  // Train search state
  const [trainFrom, setTrainFrom] = useState('NDLS - New Delhi');
  const [trainTo, setTrainTo] = useState('BCT - Mumbai Central');
  const [trainDate, setTrainDate] = useState('2026-11-08');
  const [trainClass, setTrainClass] = useState('All Classes');
  const [trainQuota, setTrainQuota] = useState('General');

  // Flight search state
  const [flightType, setFlightType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [flightFrom, setFlightFrom] = useState('DEL - New Delhi (T3)');
  const [flightTo, setFlightTo] = useState('GOI - Goa Dabolim');
  const [flightDepDate, setFlightDepDate] = useState('2026-11-18');
  const [flightRetDate, setFlightRetDate] = useState('2026-11-23');
  const [flightCabin, setFlightCabin] = useState('Economy');
  const [flightPassengers, setFlightPassengers] = useState(1);

  // Hotel search state
  const [hotelCity, setHotelCity] = useState('Goa');
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-11-20');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-11-24');
  const [hotelGuests, setHotelGuests] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);

  // Metro search state
  const [metroCity, setMetroCity] = useState('delhi');
  const [metroFrom, setMetroFrom] = useState('Rajiv Chowk (Yellow/Blue Line)');
  const [metroTo, setMetroTo] = useState('Botanical Garden (Magenta Line)');

  // Bus search state
  const [busFrom, setBusFrom] = useState('Delhi (Kashmere Gate)');
  const [busTo, setBusTo] = useState('Jaipur (Sindhi Camp)');
  const [busDate, setBusDate] = useState('2026-11-10');

  // Handlers for swapping endpoints
  const handleSwapTrain = () => {
    const temp = trainFrom;
    setTrainFrom(trainTo);
    setTrainTo(temp);
  };

  const handleSwapFlight = () => {
    const temp = flightFrom;
    setFlightFrom(flightTo);
    setFlightTo(temp);
  };

  const handleSwapBus = () => {
    const temp = busFrom;
    setBusFrom(busTo);
    setBusTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTab === 'train') {
      const fromCode = trainFrom.split(' - ')[0] || 'NDLS';
      const toCode = trainTo.split(' - ')[0] || 'BCT';
      onExecuteSearch('train', { from: fromCode, to: toCode, date: trainDate, travelClass: trainClass, quota: trainQuota });
    } else if (currentTab === 'flight') {
      const fromCode = flightFrom.split(' - ')[0] || 'DEL';
      const toCode = flightTo.split(' - ')[0] || 'GOI';
      onExecuteSearch('flight', {
        from: fromCode,
        to: toCode,
        date: flightDepDate,
        returnDate: flightType === 'roundtrip' ? flightRetDate : undefined,
        tripType: flightType,
        cabinClass: flightCabin,
        passengers: flightPassengers,
      });
    } else if (currentTab === 'hotel') {
      onExecuteSearch('hotel', {
        city: hotelCity,
        checkIn: hotelCheckIn,
        checkOut: hotelCheckOut,
        guests: hotelGuests,
        rooms: hotelRooms,
      });
    } else if (currentTab === 'metro') {
      onExecuteSearch('metro', {
        cityId: metroCity,
        from: metroFrom.split(' (')[0],
        to: metroTo.split(' (')[0],
      });
    } else if (currentTab === 'bus') {
      onExecuteSearch('bus', {
        from: busFrom.split(' (')[0],
        to: busTo.split(' (')[0],
        date: busDate,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 sm:-mt-20 relative z-20 px-3 sm:px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden backdrop-blur-md">
        {/* Category Tabs */}
        <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50/90 p-1.5 sm:p-2 gap-1">
          {[
            { id: 'train', label: 'Trains', sub: 'IRCTC Sandbox', icon: Train },
            { id: 'flight', label: 'Flights', sub: 'Domestic & Intl', icon: Plane },
            { id: 'hotel', label: 'Hotels', sub: 'Resorts & Stays', icon: Building2 },
            { id: 'metro', label: 'Metro', sub: 'Transit Planner', icon: Subway },
            { id: 'bus', label: 'Buses', sub: 'Intercity AC', icon: Bus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id as TravelTab)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-2 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#0B2545] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <div className="text-center sm:text-left">
                  <span className="block text-xs sm:text-sm font-bold leading-tight">{tab.label}</span>
                  <span
                    className={`hidden md:block text-[10px] leading-none ${
                      isActive ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    {tab.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Search Forms based on tab */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-5">
          {/* 1. TRAIN SEARCH FIELDS */}
          {currentTab === 'train' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* From Station */}
                <div className="md:col-span-5 relative bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-sky-500 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">From Station</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Train className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <select
                      value={trainFrom}
                      onChange={(e) => setTrainFrom(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="NDLS - New Delhi">NDLS — New Delhi (Northern Rly)</option>
                      <option value="BCT - Mumbai Central">BCT — Mumbai Central</option>
                      <option value="CSMT - Mumbai CSMT">CSMT — Mumbai Chhatrapati Shivaji</option>
                      <option value="HWH - Howrah Junction">HWH — Howrah / Kolkata</option>
                      <option value="SBC - KSR Bengaluru">SBC — KSR Bengaluru City</option>
                      <option value="MAS - Chennai Central">MAS — Chennai Central</option>
                      <option value="PNBE - Patna Junction">PNBE — Patna Junction</option>
                      <option value="ADI - Ahmedabad Junction">ADI — Ahmedabad Junction</option>
                      <option value="BSB - Varanasi Junction">BSB — Varanasi Junction</option>
                    </select>
                  </div>
                </div>

                {/* Swap button */}
                <div className="md:col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwapTrain}
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-colors border border-slate-200 shadow-xs"
                    title="Swap Stations"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* To Station */}
                <div className="md:col-span-5 relative bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-sky-500 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">To Station</span>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <select
                      value={trainTo}
                      onChange={(e) => setTrainTo(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="BCT - Mumbai Central">BCT — Mumbai Central</option>
                      <option value="NDLS - New Delhi">NDLS — New Delhi</option>
                      <option value="HWH - Howrah Junction">HWH — Howrah / Kolkata</option>
                      <option value="SBC - KSR Bengaluru">SBC — KSR Bengaluru City</option>
                      <option value="MAS - Chennai Central">MAS — Chennai Central</option>
                      <option value="PNBE - Patna Junction">PNBE — Patna Junction</option>
                      <option value="ADI - Ahmedabad Junction">ADI — Ahmedabad Junction</option>
                      <option value="BSB - Varanasi Junction">BSB — Varanasi Junction</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date, Class & Quota */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Journey Date</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <input
                      type="date"
                      value={trainDate}
                      onChange={(e) => setTrainDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Travel Class</span>
                  <select
                    value={trainClass}
                    onChange={(e) => setTrainClass(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                  >
                    <option value="All Classes">All Classes (3A, 2A, 1A, SL, CC)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="1A">AC First Class (1A)</option>
                    <option value="CC">AC Chair Car (CC)</option>
                    <option value="SL">Sleeper (SL)</option>
                  </select>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Booking Quota</span>
                  <select
                    value={trainQuota}
                    onChange={(e) => setTrainQuota(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                  >
                    <option value="General">General Quota (GN)</option>
                    <option value="Tatkal">Tatkal Quota (TQ)</option>
                    <option value="Ladies">Ladies Quota (LD)</option>
                    <option value="Senior Citizen">Senior Citizen (SS)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. FLIGHT SEARCH FIELDS */}
          {currentTab === 'flight' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="flightType"
                    checked={flightType === 'oneway'}
                    onChange={() => setFlightType('oneway')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span>One-Way</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="flightType"
                    checked={flightType === 'roundtrip'}
                    onChange={() => setFlightType('roundtrip')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span>Round-Trip</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-sky-500 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">From Airport</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Plane className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <select
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="DEL - New Delhi (T3)">DEL — New Delhi (Indira Gandhi T3)</option>
                      <option value="BOM - Mumbai (T2)">BOM — Mumbai (Chhatrapati Shivaji T2)</option>
                      <option value="BLR - Bengaluru (T1)">BLR — Bengaluru (Kempegowda)</option>
                      <option value="GOI - Goa Dabolim">GOI — Goa (Dabolim / MOPA)</option>
                      <option value="HYD - Hyderabad">HYD — Hyderabad (Rajiv Gandhi)</option>
                      <option value="MAA - Chennai">MAA — Chennai International</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwapFlight}
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-colors border border-slate-200 shadow-xs"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-sky-500 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Destination Airport</span>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <select
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="GOI - Goa Dabolim">GOI — Goa (Dabolim / MOPA)</option>
                      <option value="BOM - Mumbai (T2)">BOM — Mumbai (Chhatrapati Shivaji)</option>
                      <option value="DEL - New Delhi (T3)">DEL — New Delhi (Indira Gandhi)</option>
                      <option value="BLR - Bengaluru (T1)">BLR — Bengaluru (Kempegowda)</option>
                      <option value="HYD - Hyderabad">HYD — Hyderabad (Rajiv Gandhi)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Departure Date</span>
                  <input
                    type="date"
                    value={flightDepDate}
                    onChange={(e) => setFlightDepDate(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                  />
                </div>

                {flightType === 'roundtrip' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Return Date</span>
                    <input
                      type="date"
                      value={flightRetDate}
                      onChange={(e) => setFlightRetDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                    />
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Travellers</span>
                  <select
                    value={flightPassengers}
                    onChange={(e) => setFlightPassengers(Number(e.target.value))}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                  >
                    <option value={1}>1 Traveller</option>
                    <option value={2}>2 Travellers</option>
                    <option value={3}>3 Travellers</option>
                    <option value={4}>4 Travellers</option>
                  </select>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Cabin Class</span>
                  <select
                    value={flightCabin}
                    onChange={(e) => setFlightCabin(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. HOTEL SEARCH FIELDS */}
          {currentTab === 'hotel' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">City / Destination</span>
                <select
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
                >
                  <option value="Goa">Goa (Beaches & Resorts)</option>
                  <option value="Mumbai">Mumbai (South & Suburbs)</option>
                  <option value="Delhi">Delhi NCR (Heritage & Luxury)</option>
                  <option value="Bengaluru">Bengaluru (Business & Gardens)</option>
                  <option value="Jaipur">Jaipur (Royal Palaces)</option>
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Check-In</span>
                <input
                  type="date"
                  value={hotelCheckIn}
                  onChange={(e) => setHotelCheckIn(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Check-Out</span>
                <input
                  type="date"
                  value={hotelCheckOut}
                  onChange={(e) => setHotelCheckOut(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Rooms & Guests</span>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {hotelRooms} Room, {hotelGuests} Guests
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4. METRO TRANSIT SEARCH FIELDS */}
          {currentTab === 'metro' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Select City Network</span>
                <select
                  value={metroCity}
                  onChange={(e) => setMetroCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
                >
                  <option value="delhi">Delhi NCR (DMRC Lines)</option>
                  <option value="mumbai">Mumbai Metro (MMOPL)</option>
                  <option value="bangalore">Bengaluru (Namma Metro)</option>
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Source Station</span>
                <input
                  type="text"
                  value={metroFrom}
                  onChange={(e) => setMetroFrom(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Destination Station</span>
                <input
                  type="text"
                  value={metroTo}
                  onChange={(e) => setMetroTo(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>
            </div>
          )}

          {/* 5. BUS SEARCH FIELDS */}
          {currentTab === 'bus' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">From City</span>
                <input
                  type="text"
                  value={busFrom}
                  onChange={(e) => setBusFrom(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">To City</span>
                <input
                  type="text"
                  value={busTo}
                  onChange={(e) => setBusTo(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Journey Date</span>
                <input
                  type="date"
                  value={busDate}
                  onChange={(e) => setBusDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none mt-1"
                />
              </div>
            </div>
          )}

          {/* Submit Search CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Instant seat verification • Zero cancellation guarantee with Premium</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0B2545] hover:bg-[#07192F] text-white text-sm font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>
                Search {currentTab === 'train' ? 'Trains' : currentTab === 'flight' ? 'Flights' : currentTab === 'hotel' ? 'Hotels' : currentTab === 'metro' ? 'Metro Route' : 'Buses'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
