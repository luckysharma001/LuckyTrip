/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';

// Views
import { HomeView } from './views/HomeView';
import { TrainBookingView } from './views/TrainBookingView';
import { FlightBookingView } from './views/FlightBookingView';
import { HotelBookingView } from './views/HotelBookingView';
import { MetroTransitView } from './views/MetroTransitView';
import { BusServicesView } from './views/BusServicesView';
import { PassengerDetailsView } from './views/PassengerDetailsView';
import { CheckoutView } from './views/CheckoutView';
import { MyTripsView } from './views/MyTripsView';
import { BookingDetailsView } from './views/BookingDetailsView';
import { RefundTrackerView } from './views/RefundTrackerView';
import { PremiumView } from './views/PremiumView';
import { SupportView } from './views/SupportView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { LegalViews } from './views/LegalViews';

import { api, clearStoredToken } from './api/client';
import { User, Booking, NotificationItem, TravelTab, TrainSchedule, TrainClassFare, FlightSchedule, FlightFare, HotelProperty, HotelRoom, MetroRouteResult, BusSchedule, Passenger } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Active bookings list
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  // Search parameters for deep links
  const [trainSearchParams, setTrainSearchParams] = useState<any>({ from: 'NDLS', to: 'BCT' });
  const [flightSearchParams, setFlightSearchParams] = useState<any>({ from: 'DEL', to: 'GOI' });
  const [hotelSearchParams, setHotelSearchParams] = useState<any>({ city: 'Goa' });
  const [busSearchParams, setBusSearchParams] = useState<any>({ from: 'Delhi', to: 'Jaipur' });

  // Booking Checkout Flow State
  const [tripSummaryForPassengers, setTripSummaryForPassengers] = useState<any>(null);
  const [bookingCheckoutData, setBookingCheckoutData] = useState<any>(null);

  // Detail views state
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [activeRefundBookingId, setActiveRefundBookingId] = useState<string | undefined>(undefined);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Initialize System, User & Notifications
  const initialize = async () => {
    try {
      const config = await api.getConfig();
      setIsDemoMode(config.isDemo);
      if (config.activeUser) {
        setUser(config.activeUser);
      }

      // Fetch user's bookings & notifications
      const bookingsRes = await api.getBookings();
      setRecentBookings(bookingsRes.bookings || []);

      const notifsRes = await api.getNotifications();
      setNotifications(notifsRes || []);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleToggleDemoMode = async () => {
    const nextMode = isDemoMode ? 'PRODUCTION' : 'DEMO';
    try {
      const res = await api.setMode(nextMode);
      setIsDemoMode(res.mode === 'DEMO');
      // refresh config
      initialize();
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setUser(null);
    setCurrentTab('home');
  };

  const handleSearchExecute = (tab: TravelTab, params: any) => {
    if (tab === 'train') {
      setTrainSearchParams(params);
      setCurrentTab('train');
    } else if (tab === 'flight') {
      setFlightSearchParams(params);
      setCurrentTab('flight');
    } else if (tab === 'hotel') {
      setHotelSearchParams(params);
      setCurrentTab('hotel');
    } else if (tab === 'metro') {
      setCurrentTab('metro');
    } else if (tab === 'bus') {
      setBusSearchParams(params);
      setCurrentTab('bus');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Train Selection
  const handleSelectTrain = (train: TrainSchedule, selectedClass: TrainClassFare) => {
    setTripSummaryForPassengers({
      type: 'train',
      title: `${train.trainName} (${selectedClass.name})`,
      route: `${train.originStation} → ${train.destinationStation}`,
      date: trainSearchParams.date || '2026-11-08',
      serviceNumber: train.trainNumber,
      baseFarePerPassenger: selectedClass.fare,
      taxesPerPassenger: Math.round(selectedClass.fare * 0.05),
      rawPayload: {
        bookingType: 'train',
        title: `${train.trainName} (${selectedClass.name})`,
        origin: `${train.originStation} (${train.originCode})`,
        destination: `${train.destinationStation} (${train.destinationCode})`,
        journeyDate: trainSearchParams.date || '2026-11-08',
        serviceNumber: train.trainNumber,
        serviceName: train.trainName,
        baseFare: selectedClass.fare,
        taxes: Math.round(selectedClass.fare * 0.05),
      },
    });
    setCurrentTab('passenger-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Flight Selection
  const handleSelectFlight = (flight: FlightSchedule, selectedFare: FlightFare) => {
    setTripSummaryForPassengers({
      type: 'flight',
      title: `${flight.airline} ${flight.flightNumber} (${selectedFare.type})`,
      route: `${flight.originCode} → ${flight.destinationCode}`,
      date: flightSearchParams.date || '2026-11-18',
      serviceNumber: flight.flightNumber,
      baseFarePerPassenger: selectedFare.price,
      taxesPerPassenger: Math.round(selectedFare.price * 0.12),
      rawPayload: {
        bookingType: 'flight',
        title: `${flight.airline} ${flight.flightNumber} (${selectedFare.type})`,
        origin: flight.originCode,
        destination: flight.destinationCode,
        journeyDate: flightSearchParams.date || '2026-11-18',
        serviceNumber: flight.flightNumber,
        serviceName: flight.airline,
        baseFare: selectedFare.price,
        taxes: Math.round(selectedFare.price * 0.12),
      },
    });
    setCurrentTab('passenger-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Hotel Room Selection
  const handleSelectHotelRoom = (hotel: HotelProperty, room: HotelRoom, nights: number) => {
    const totalRoomPrice = room.price * nights;
    const taxes = Math.round(totalRoomPrice * 0.18);
    setTripSummaryForPassengers({
      type: 'hotel',
      title: `${hotel.name} — ${room.name}`,
      route: `${hotel.city} (${nights} Nights)`,
      date: hotelSearchParams.checkIn || '2026-11-20',
      baseFarePerPassenger: totalRoomPrice,
      taxesPerPassenger: taxes,
      rawPayload: {
        bookingType: 'hotel',
        title: `${hotel.name} (${room.name})`,
        origin: hotel.city,
        destination: hotel.area,
        journeyDate: hotelSearchParams.checkIn || '2026-11-20',
        serviceName: hotel.name,
        roomDetails: {
          hotelName: hotel.name,
          roomType: room.name,
          nights,
          guests: hotelSearchParams.guests || 2,
          checkIn: hotelSearchParams.checkIn || '2026-11-20',
          checkOut: hotelSearchParams.checkOut || '2026-11-24',
          address: hotel.address,
        },
        baseFare: totalRoomPrice,
        taxes,
      },
    });
    setCurrentTab('passenger-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Metro Pass Selection
  const handleBookMetroPass = (routeResult: MetroRouteResult, tokens: number) => {
    const totalFare = routeResult.fare * tokens;
    setBookingCheckoutData({
      bookingType: 'metro',
      title: `${routeResult.city} Metro QR Pass`,
      origin: routeResult.fromStation,
      destination: routeResult.toStation,
      journeyDate: new Date().toISOString().split('T')[0],
      serviceName: `${routeResult.city} Rapid Transit`,
      passengers: [{ name: user?.name || 'Lucky Sharma', age: 28, gender: 'male' }],
      metroDetails: {
        city: routeResult.city,
        fromStation: routeResult.fromStation,
        toStation: routeResult.toStation,
        interchanges: routeResult.interchanges,
        tokenCount: tokens,
        qrCodeString: routeResult.qrSample,
        validityMinutes: routeResult.validityMinutes,
      },
      baseFare: totalFare,
      taxes: 0,
    });
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Bus Selection
  const handleSelectBus = (bus: BusSchedule) => {
    setTripSummaryForPassengers({
      type: 'bus',
      title: `${bus.operator} (${bus.busType})`,
      route: `${bus.origin} → ${bus.destination}`,
      date: busSearchParams.date || '2026-11-10',
      baseFarePerPassenger: bus.fare,
      taxesPerPassenger: Math.round(bus.fare * 0.05),
      rawPayload: {
        bookingType: 'bus',
        title: `${bus.operator} (${bus.busType})`,
        origin: bus.origin,
        destination: bus.destination,
        journeyDate: busSearchParams.date || '2026-11-10',
        serviceName: bus.operator,
        baseFare: bus.fare,
        taxes: Math.round(bus.fare * 0.05),
      },
    });
    setCurrentTab('passenger-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for passenger details to checkout
  const handleProceedToCheckout = (data: { passengers: Passenger[] }) => {
    if (!tripSummaryForPassengers) return;
    setBookingCheckoutData({
      ...tripSummaryForPassengers.rawPayload,
      passengers: data.passengers,
    });
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Payment completed
  const handlePaymentCompleted = (booking: Booking) => {
    setConfirmedBooking(booking);
    setRecentBookings([booking, ...recentBookings]);
    setCurrentTab('trips');
    // Refresh notifications
    api.getNotifications().then((res) => setNotifications(res || []));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            currentTab="train"
            onTabChange={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExecuteSearch={handleSearchExecute}
            onNavigate={(view) => {
              setCurrentTab(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            user={user}
            recentBookings={recentBookings}
          />
        )}

        {currentTab === 'train' && (
          <TrainBookingView
            searchParams={trainSearchParams}
            onSelectTrainForBooking={handleSelectTrain}
          />
        )}

        {currentTab === 'flight' && (
          <FlightBookingView
            searchParams={flightSearchParams}
            onSelectFlightForBooking={handleSelectFlight}
          />
        )}

        {currentTab === 'hotel' && (
          <HotelBookingView
            searchParams={hotelSearchParams}
            onSelectHotelRoom={handleSelectHotelRoom}
          />
        )}

        {currentTab === 'metro' && (
          <MetroTransitView onBookMetroPass={handleBookMetroPass} />
        )}

        {currentTab === 'bus' && (
          <BusServicesView
            searchParams={busSearchParams}
            onSelectBusForBooking={handleSelectBus}
          />
        )}

        {currentTab === 'passenger-form' && tripSummaryForPassengers && (
          <PassengerDetailsView
            user={user}
            tripSummary={tripSummaryForPassengers}
            onProceedToCheckout={handleProceedToCheckout}
            onBack={() => setCurrentTab(tripSummaryForPassengers.type)}
          />
        )}

        {currentTab === 'checkout' && bookingCheckoutData && (
          <CheckoutView
            user={user}
            bookingData={bookingCheckoutData}
            onPaymentComplete={handlePaymentCompleted}
            onBack={() => setCurrentTab('passenger-form')}
          />
        )}

        {currentTab === 'trips' && (
          <MyTripsView
            onOpenBookingDetails={(id) => {
              setActiveBookingId(id);
              setCurrentTab('booking-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRefundTrack={(id) => {
              setActiveRefundBookingId(id);
              setCurrentTab('refunds');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateSearch={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'booking-details' && activeBookingId && (
          <BookingDetailsView
            bookingId={activeBookingId}
            onBack={() => setCurrentTab('trips')}
            onOpenRefundTrack={(id) => {
              setActiveRefundBookingId(id);
              setCurrentTab('refunds');
            }}
            onOpenSupport={() => setCurrentTab('support')}
          />
        )}

        {currentTab === 'refunds' && (
          <RefundTrackerView
            bookingId={activeRefundBookingId}
            onBack={() => setCurrentTab('trips')}
            onOpenSupport={() => setCurrentTab('support')}
          />
        )}

        {currentTab === 'premium' && (
          <PremiumView
            user={user}
            onUpgradeSuccess={(upUser) => setUser(upUser)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'support' && (
          <SupportView user={user} onOpenAuth={() => setIsAuthModalOpen(true)} />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onLogout={handleLogout}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            user={user}
            onOpenBookingDetails={(id) => {
              setActiveBookingId(id);
              setCurrentTab('booking-details');
            }}
            isDemoMode={isDemoMode}
            onToggleDemoMode={handleToggleDemoMode}
          />
        )}

        {['about', 'privacy', 'terms', 'contact'].includes(currentTab) && (
          <LegalViews
            page={currentTab as any}
            onBack={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentTab(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          initialize();
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }}
        onClearAll={async () => {
          await api.clearAllNotifications();
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
        }}
        onNavigate={(url) => {
          if (url.includes('trips')) setCurrentTab('trips');
          else if (url.includes('refunds')) setCurrentTab('refunds');
          else if (url.includes('premium')) setCurrentTab('premium');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <BookingConfirmationModal
        isOpen={confirmedBooking !== null}
        onClose={() => setConfirmedBooking(null)}
        booking={confirmedBooking}
        onViewMyTrips={() => {
          setConfirmedBooking(null);
          setCurrentTab('trips');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
