import React from 'react';
import {
  Train,
  Plane,
  Building2,
  TramFront as Subway,
  Bus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Compass,
  CheckCircle2,
  Crown,
  Briefcase as Suitcase,
  HelpCircle,
  Star,
  MapPin,
} from 'lucide-react';
import { HeroSearch } from '../components/home/HeroSearch';
import { TravelTab, User, Booking } from '../types';

interface HomeViewProps {
  currentTab: TravelTab;
  onTabChange: (tab: TravelTab) => void;
  onExecuteSearch: (tab: TravelTab, searchParams: any) => void;
  onNavigate: (view: string) => void;
  user: User | null;
  recentBookings: Booking[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentTab,
  onTabChange,
  onExecuteSearch,
  onNavigate,
  user,
  recentBookings,
}) => {
  const popularRoutes = [
    {
      type: 'train',
      title: 'Delhi → Mumbai',
      service: '12952 Tejas Rajdhani Express',
      time: '15h 40m',
      fare: '₹2,280',
      tag: 'Fastest Train',
      from: 'NDLS',
      to: 'BCT',
      icon: Train,
    },
    {
      type: 'train',
      title: 'Delhi → Varanasi',
      service: '22436 Vande Bharat Express',
      time: '8h 00m',
      fare: '₹1,750',
      tag: 'High Demand',
      from: 'NDLS',
      to: 'BSB',
      icon: Train,
    },
    {
      type: 'flight',
      title: 'Delhi → Goa',
      service: 'IndiGo & Air India Direct',
      time: '2h 35m',
      fare: '₹4,680',
      tag: 'Direct Flights',
      from: 'DEL',
      to: 'GOI',
      icon: Plane,
    },
    {
      type: 'hotel',
      title: 'Goa Beachfront',
      service: 'Taj Exotica Resort & Spa',
      time: '5 Star Luxury',
      fare: '₹16,500/nt',
      tag: 'Private Beach',
      city: 'Goa',
      icon: Building2,
    },
  ];

  const offers = [
    {
      code: 'FIRSTTRIP',
      discount: '15% OFF',
      title: 'Welcome Travellers',
      description: 'Get 15% instant discount up to ₹350 on your first train or flight booking.',
      badge: 'NEW USERS',
      color: 'from-sky-600 to-blue-700',
    },
    {
      code: 'LUCKY2026',
      discount: 'FLAT ₹500',
      title: 'Luxury Stays & Flights',
      description: 'Save ₹500 on all resort bookings and business class flight tickets.',
      badge: 'LIMITED TIME',
      color: 'from-indigo-600 to-navy-900',
    },
    {
      code: 'METROPASS',
      discount: 'FLAT ₹20',
      title: 'Daily Metro Commutes',
      description: 'Instant rebate on single journey and round-trip QR metro tokens.',
      badge: 'DAILY TRANSIT',
      color: 'from-teal-600 to-emerald-700',
    },
  ];

  const destinations = [
    {
      name: 'Goa',
      state: 'Coastal Paradise',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      startingFare: '₹2,890',
      tab: 'flight' as TravelTab,
      from: 'BOM',
      to: 'GOI',
    },
    {
      name: 'Jaipur',
      state: 'The Pink City',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80',
      startingFare: '₹680',
      tab: 'train' as TravelTab,
      from: 'NDLS',
      to: 'JP',
    },
    {
      name: 'Bengaluru',
      state: 'Silicon Garden',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
      startingFare: '₹1,250',
      tab: 'flight' as TravelTab,
      from: 'DEL',
      to: 'BLR',
    },
    {
      name: 'Varanasi',
      state: 'Spiritual Capital',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
      startingFare: '₹1,750',
      tab: 'train' as TravelTab,
      from: 'NDLS',
      to: 'BSB',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative bg-[#0B2545] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient flourishes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Unified Multi-Modal Travel Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            One App. <span className="text-sky-400">Every Journey.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Book trains with live berth status, compare domestic flights, reserve luxury hotels,
            and plan city metro transfers with zero friction.
          </p>
        </div>
      </div>

      {/* Hero Search Box (Floating overlap) */}
      <HeroSearch
        currentTab={currentTab}
        onTabChange={onTabChange}
        onExecuteSearch={onExecuteSearch}
      />

      {/* Recent Trips Shortcut Banner if user has trips */}
      {recentBookings.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                <Suitcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                  Active Travel Manager
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  You have {recentBookings.length} booking(s) on file
                </h3>
                <p className="text-xs text-slate-600">
                  Latest: {recentBookings[0].title} • {recentBookings[0].referenceNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('trips')}
                className="px-5 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Open My Trips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Routes Quick Booker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Trending Connections
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Popular High-Frequency Routes</h2>
          </div>
          <button
            onClick={() => onTabChange('train')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, idx) => {
            const Icon = route.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (route.type === 'train') {
                    onExecuteSearch('train', { from: route.from, to: route.to });
                  } else if (route.type === 'flight') {
                    onExecuteSearch('flight', { from: route.from, to: route.to });
                  } else if (route.type === 'hotel') {
                    onExecuteSearch('hotel', { city: route.city });
                  }
                }}
                className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all cursor-pointer relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-[#0B2545] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {route.tag}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mb-1">{route.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{route.service}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{route.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block leading-none">Starting from</span>
                    <span className="font-black text-sky-700 text-sm">{route.fare}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Travel Offers & Coupons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Exclusive Discounts
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Verified Travel Coupons</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 text-white bg-gradient-to-br ${offer.color} shadow-lg relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {offer.badge}
                </span>
                <span className="font-mono text-sm font-black text-amber-300">{offer.discount}</span>
              </div>
              <h3 className="font-extrabold text-base mb-1">{offer.title}</h3>
              <p className="text-xs text-slate-100/90 leading-relaxed mb-4">{offer.description}</p>
              <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                <span className="font-mono font-bold bg-white text-slate-900 px-3 py-1 rounded-lg text-xs">
                  {offer.code}
                </span>
                <span className="text-[11px] text-slate-200">Tap to apply at checkout</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LuckyTrip Premium Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#07192F] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Crown className="w-80 h-80 text-amber-400" />
          </div>

          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <Crown className="w-4 h-4 text-amber-400" />
              LUCKYTRIP PREMIUM ANNUAL • ₹999/YEAR
            </div>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Zero Convenience Fees. <br />
              <span className="text-sky-400">Total Travel Freedom.</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Save hundreds on every train, flight, and hotel booking with ₹0 booking charges,
              priority customer support desk, and instant traveller auto-sync.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>₹0 Convenience fee on all journeys</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Personalized multi-modal dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Saved travellers 1-click autofill</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Priority 24x7 in-app support ticketing</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onNavigate('premium')}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <span>{user?.isPremium ? 'View Premium Benefits' : 'Upgrade for ₹999/yr'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destination Explorer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Destinations to Explore
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Featured Getaways</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (dest.tab === 'train') {
                  onExecuteSearch('train', { from: dest.from, to: dest.to });
                } else {
                  onExecuteSearch('flight', { from: dest.from, to: dest.to });
                }
              }}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-slate-900 h-64"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] text-sky-300 font-medium block">{dest.state}</span>
                <h3 className="text-lg font-black">{dest.name}</h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-xs">
                  <span className="text-slate-300">From {dest.startingFare}</span>
                  <span className="text-sky-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Book Trip <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
