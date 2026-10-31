export type TravelTab = 'train' | 'flight' | 'hotel' | 'metro' | 'bus';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  premiumUntil?: string;
  avatar?: string;
}

export interface SavedTraveller {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  berthPreference: string;
  idType: string;
  idNumber: string;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  berthPreference?: string;
  seatNumber?: string;
  coachNumber?: string;
  cabinClass?: string;
}

export interface TrainClassFare {
  code: '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
  name: string;
  fare: number;
  availability: string;
  statusType: 'available' | 'rac' | 'wl';
}

export interface TrainSchedule {
  id: string;
  trainNumber: string;
  trainName: string;
  originCode: string;
  originStation: string;
  destinationCode: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  classes: TrainClassFare[];
  pantryAvailable: boolean;
  distanceKm: number;
}

export interface FlightFare {
  type: 'Saver' | 'Flexi' | 'Business';
  price: number;
  seatsLeft: number;
  benefits: string[];
}

export interface FlightSchedule {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  airlineLogo: string;
  originCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopDetails?: string;
  baggage: {
    cabin: string;
    checkIn: string;
  };
  fares: FlightFare[];
}

export interface HotelRoom {
  id: string;
  name: string;
  capacity: string;
  bedType: string;
  price: number;
  amenities: string[];
}

export interface HotelProperty {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  starRating: number;
  userRating: number;
  reviewCount: number;
  featuredImage: string;
  galleryImages: string[];
  pricePerNight: number;
  taxPercent: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  cancellationPolicy: string;
  rooms: HotelRoom[];
}

export interface MetroCityNetwork {
  cityId: string;
  cityName: string;
  lines: {
    lineName: string;
    color: string;
    stations: string[];
  }[];
  interchanges: {
    station: string;
    lines: string[];
  }[];
}

export interface MetroRouteResult {
  city: string;
  fromStation: string;
  toStation: string;
  totalStops: number;
  estimatedMinutes: number;
  fare: number;
  interchanges: string[];
  journeySteps: string[];
  qrSample: string;
  validityMinutes: number;
  disclaimer: string;
}

export interface BusSchedule {
  id: string;
  operator: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  seatsAvailable: number;
  rating: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  referenceNumber: string;
  userId: string;
  bookingType: 'train' | 'flight' | 'hotel' | 'metro' | 'bus';
  title: string;
  origin: string;
  destination: string;
  journeyDate: string;
  returnDate?: string;
  serviceNumber?: string;
  serviceName: string;
  passengers: Passenger[];
  roomDetails?: {
    hotelName: string;
    roomType: string;
    nights: number;
    guests: number;
    checkIn: string;
    checkOut: string;
    address: string;
  };
  metroDetails?: {
    city: string;
    fromStation: string;
    toStation: string;
    interchanges: string[];
    tokenCount: number;
    qrCodeString: string;
    validityMinutes: number;
  };
  pricing: {
    baseFare: number;
    taxes: number;
    convenienceFee: number;
    discount: number;
    totalAmount: number;
  };
  status: 'CONFIRMED' | 'CANCELLATION_REQUESTED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'PENDING';
  paymentMethod: string;
  paymentId: string;
  cancellationDate?: string;
  cancellationReason?: string;
  refundAmount?: number;
  cancellationFee?: number;
  createdAt: string;
  isDemo: boolean;
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  bookingRef: string;
  userId: string;
  requestedAmount: number;
  cancellationCharge: number;
  netRefund: number;
  refundMethod: string;
  status: 'REFUND_INITIATED' | 'REFUND_PROCESSING' | 'REFUND_COMPLETED' | 'REFUND_FAILED';
  initiatedAt: string;
  completedAt?: string;
  gatewayRefundId: string;
  isDemo: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'Train' | 'Flight' | 'Hotel' | 'Metro' | 'Payment' | 'Refund' | 'General';
  subject: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'refund' | 'journey' | 'promo';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SystemConfig {
  appName: string;
  tagline: string;
  mode: 'DEMO' | 'PRODUCTION';
  isDemo: boolean;
  version: string;
  activeUser: User | null;
  capabilities: Record<string, { status: string; provider: string }>;
}
