import React, { useState, useEffect } from 'react';
import {
  Building2,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Wifi,
  Waves,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { HotelProperty, HotelRoom } from '../types';

interface HotelBookingViewProps {
  searchParams: { city?: string; checkIn?: string; checkOut?: string; guests?: number; rooms?: number };
  onSelectHotelRoom: (hotel: HotelProperty, room: HotelRoom, nights: number) => void;
}

export const HotelBookingView: React.FC<HotelBookingViewProps> = ({
  searchParams,
  onSelectHotelRoom,
}) => {
  const [city, setCity] = useState(searchParams.city || 'Goa');
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || '2026-11-20');
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || '2026-11-24');
  const [hotels, setHotels] = useState<HotelProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHotelDetail, setSelectedHotelDetail] = useState<HotelProperty | null>(null);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)));

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const res = await api.searchHotels(city, checkIn, checkOut);
      setHotels(res.hotels || []);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [city, checkIn, checkOut]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 shadow-xl border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Hotel Reservations & Stays
              </span>
              <h1 className="text-xl sm:text-2xl font-black">Hotels in {city}</h1>
              <p className="text-xs text-slate-300">
                {checkIn} → {checkOut} ({nights} Night{nights > 1 ? 's' : ''}) • {hotels.length} Verified Properties
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-700 text-xs">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl border border-slate-600 outline-none"
            >
              <option value="Goa">Goa</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Jaipur">Jaipur</option>
            </select>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-slate-800 text-white font-medium px-3 py-1.5 rounded-xl border border-slate-600 outline-none"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-slate-800 text-white font-medium px-3 py-1.5 rounded-xl border border-slate-600 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hotel Listings */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 animate-pulse h-64"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel) => {
            const totalPrice = hotel.pricePerNight * nights;
            const taxes = Math.round(totalPrice * (hotel.taxPercent / 100));

            return (
              <div
                key={hotel.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Hotel Image Gallery */}
                <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={hotel.featuredImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{hotel.starRating} Star Luxury</span>
                  </div>
                </div>

                {/* Hotel Details & Room Picker */}
                <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h2 className="text-xl font-black text-slate-900">{hotel.name}</h2>
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-200 text-xs font-bold w-fit">
                        <span>{hotel.userRating} / 5</span>
                        <span className="text-[10px] text-emerald-600">({hotel.reviewCount} verified ratings)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                      <span>{hotel.area} • {hotel.address}</span>
                    </p>

                    {/* Amenities pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.amenities.slice(0, 5).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {hotel.cancellationPolicy}
                    </p>
                  </div>

                  {/* Room Selection Matrix */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Available Room Categories
                    </h3>
                    <div className="space-y-2">
                      {hotel.rooms.map((room) => {
                        const roomTotal = room.price * nights;
                        return (
                          <div
                            key={room.id}
                            className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-500 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                          >
                            <div>
                              <p className="font-extrabold text-xs text-slate-900">{room.name}</p>
                              <p className="text-[11px] text-slate-500">{room.bedType} • {room.capacity}</p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-base font-black text-slate-900">
                                  ₹{room.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400 block leading-tight">
                                  per night (₹{roomTotal.toLocaleString('en-IN')} for {nights} nights)
                                </span>
                              </div>

                              <button
                                onClick={() => onSelectHotelRoom(hotel, room, nights)}
                                className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                              >
                                Reserve <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
