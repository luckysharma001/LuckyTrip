/**
 * LuckyTrip Comprehensive Travel Inventory & Routing Engine
 * Supplies realistic multi-modal data for trains, flights, hotels, metro transit, and buses.
 */

export interface TrainStation {
  code: string;
  name: string;
  city: string;
  state: string;
}

export interface TrainClassFare {
  code: '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
  name: string;
  fare: number;
  availability: string; // e.g., 'AVAILABLE - 28', 'RAC 4', 'WL 12'
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

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  terminal: string;
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
  fares: {
    type: 'Saver' | 'Flexi' | 'Business';
    price: number;
    seatsLeft: number;
    benefits: string[];
  }[];
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
  rooms: {
    id: string;
    name: string;
    capacity: string;
    bedType: string;
    price: number;
    amenities: string[];
  }[];
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

export const TRAIN_STATIONS: TrainStation[] = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'Delhi', state: 'Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir' },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam' },
];

export const TRAIN_CATALOG: TrainSchedule[] = [
  {
    id: 'tr_12952',
    trainNumber: '12952',
    trainName: 'Mumbai Central Tejas Rajdhani Express',
    originCode: 'NDLS',
    originStation: 'New Delhi',
    destinationCode: 'BCT',
    destinationStation: 'Mumbai Central',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    distanceKm: 1386,
    pantryAvailable: true,
    classes: [
      { code: '3A', name: '3 Tier AC', fare: 2280, availability: 'AVAILABLE - 34', statusType: 'available' },
      { code: '2A', name: '2 Tier AC', fare: 3180, availability: 'AVAILABLE - 16', statusType: 'available' },
      { code: '1A', name: 'First AC', fare: 4850, availability: 'AVAILABLE - 6', statusType: 'available' },
    ],
  },
  {
    id: 'tr_22436',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    originCode: 'NDLS',
    originStation: 'New Delhi',
    destinationCode: 'BSB',
    destinationStation: 'Varanasi Junction',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    runningDays: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    distanceKm: 759,
    pantryAvailable: true,
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 1750, availability: 'AVAILABLE - 88', statusType: 'available' },
      { code: 'EC', name: 'Executive Chair Car', fare: 3300, availability: 'AVAILABLE - 18', statusType: 'available' },
    ],
  },
  {
    id: 'tr_12004',
    trainNumber: '12004',
    trainName: 'Lucknow Swarna Shatabdi Express',
    originCode: 'NDLS',
    originStation: 'New Delhi',
    destinationCode: 'CNB',
    destinationStation: 'Kanpur Central',
    departureTime: '06:10',
    arrivalTime: '11:20',
    duration: '5h 10m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    distanceKm: 435,
    pantryAvailable: true,
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 980, availability: 'AVAILABLE - 52', statusType: 'available' },
      { code: 'EC', name: 'Executive Chair Car', fare: 1870, availability: 'AVAILABLE - 12', statusType: 'available' },
    ],
  },
  {
    id: 'tr_12302',
    trainNumber: '12302',
    trainName: 'Howrah Rajdhani Express (via Gaya)',
    originCode: 'NDLS',
    originStation: 'New Delhi',
    destinationCode: 'HWH',
    destinationStation: 'Howrah Junction',
    departureTime: '16:50',
    arrivalTime: '09:55',
    duration: '17h 05m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    distanceKm: 1451,
    pantryAvailable: true,
    classes: [
      { code: '3A', name: '3 Tier AC', fare: 2360, availability: 'AVAILABLE - 22', statusType: 'available' },
      { code: '2A', name: '2 Tier AC', fare: 3340, availability: 'RAC 6', statusType: 'rac' },
      { code: '1A', name: 'First AC', fare: 5120, availability: 'AVAILABLE - 4', statusType: 'available' },
    ],
  },
  {
    id: 'tr_12626',
    trainNumber: '12626',
    trainName: 'Kerala SF Express',
    originCode: 'NDLS',
    originStation: 'New Delhi',
    destinationCode: 'SBC',
    destinationStation: 'KSR Bengaluru City',
    departureTime: '20:10',
    arrivalTime: '13:45',
    duration: '41h 35m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    distanceKm: 2600,
    pantryAvailable: true,
    classes: [
      { code: 'SL', name: 'Sleeper Class', fare: 860, availability: 'WL 18', statusType: 'wl' },
      { code: '3A', name: '3 Tier AC', fare: 2240, availability: 'AVAILABLE - 14', statusType: 'available' },
      { code: '2A', name: '2 Tier AC', fare: 3260, availability: 'AVAILABLE - 7', statusType: 'available' },
    ],
  },
  {
    id: 'tr_12009',
    trainNumber: '12009',
    trainName: 'Mumbai Central - Ahmedabad Shatabdi Express',
    originCode: 'BCT',
    originStation: 'Mumbai Central',
    destinationCode: 'ADI',
    destinationStation: 'Ahmedabad Junction',
    departureTime: '06:20',
    arrivalTime: '12:45',
    duration: '6h 25m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    distanceKm: 491,
    pantryAvailable: true,
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 1120, availability: 'AVAILABLE - 64', statusType: 'available' },
      { code: 'EC', name: 'Executive Chair Car', fare: 2190, availability: 'AVAILABLE - 14', statusType: 'available' },
    ],
  },
  {
    id: 'tr_12417',
    trainNumber: '12417',
    trainName: 'Prayagraj Express',
    originCode: 'NDLS',
    originStation: 'New Delhi',
    destinationCode: 'PNBE',
    destinationStation: 'Patna Junction',
    departureTime: '22:10',
    arrivalTime: '08:20',
    duration: '10h 10m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    distanceKm: 635,
    pantryAvailable: true,
    classes: [
      { code: 'SL', name: 'Sleeper Class', fare: 480, availability: 'AVAILABLE - 110', statusType: 'available' },
      { code: '3A', name: '3 Tier AC', fare: 1290, availability: 'AVAILABLE - 42', statusType: 'available' },
      { code: '2A', name: '2 Tier AC', fare: 1850, availability: 'AVAILABLE - 12', statusType: 'available' },
      { code: '1A', name: 'First AC', fare: 3100, availability: 'AVAILABLE - 3', statusType: 'available' },
    ],
  },
  {
    id: 'tr_12675',
    trainNumber: '12675',
    trainName: 'Kovai Express',
    originCode: 'MAS',
    originStation: 'Chennai Central',
    destinationCode: 'SBC',
    destinationStation: 'KSR Bengaluru City',
    departureTime: '06:10',
    arrivalTime: '12:05',
    duration: '5h 55m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    distanceKm: 362,
    pantryAvailable: true,
    classes: [
      { code: 'CC', name: 'AC Chair Car', fare: 650, availability: 'AVAILABLE - 48', statusType: 'available' },
      { code: '2S', name: 'Second Sitting', fare: 190, availability: 'AVAILABLE - 132', statusType: 'available' } as any,
    ],
  },
];

export const AIRPORTS: Airport[] = [
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi NCR', country: 'India', terminal: 'T3' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India', terminal: 'T2' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India', terminal: 'T1' },
  { code: 'GOI', name: 'Dabolim / Manohar International Airport', city: 'Goa', country: 'India', terminal: 'T1' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', terminal: 'T1' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', terminal: 'T1' },
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose International', city: 'Kolkata', country: 'India', terminal: 'T2' },
  { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India', terminal: 'T2' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India', terminal: 'T1' },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', terminal: 'T3' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', terminal: 'T3' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', terminal: 'T3' },
];

export const FLIGHT_CATALOG: FlightSchedule[] = [
  {
    id: 'fl_6e_204',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-204',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    originCode: 'DEL',
    destinationCode: 'BOM',
    departureTime: '07:15',
    arrivalTime: '09:30',
    duration: '2h 15m',
    stops: 0,
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    fares: [
      {
        type: 'Saver',
        price: 4680,
        seatsLeft: 7,
        benefits: ['Standard hand baggage 7kg', 'Check-in 15kg', 'Paid seat selection', 'Changeable with fee'],
      },
      {
        type: 'Flexi',
        price: 5490,
        seatsLeft: 12,
        benefits: ['Free standard seat', 'Complimentary sandwich & beverage', 'Zero date change fee up to 24h'],
      },
      {
        type: 'Business',
        price: 14500,
        seatsLeft: 4,
        benefits: ['IndiGo Stretch seat', 'Priority check-in & boarding', 'Hot gourmet meal', '30kg baggage'],
      },
    ],
  },
  {
    id: 'fl_ai_865',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-865',
    airlineLogo: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=80&q=80',
    originCode: 'DEL',
    destinationCode: 'BOM',
    departureTime: '10:00',
    arrivalTime: '12:15',
    duration: '2h 15m',
    stops: 0,
    baggage: { cabin: '7 kg', checkIn: '20 kg' },
    fares: [
      {
        type: 'Saver',
        price: 5120,
        seatsLeft: 9,
        benefits: ['Check-in 20kg included', 'Complimentary warm meal', 'Standard seat selection'],
      },
      {
        type: 'Flexi',
        price: 6180,
        seatsLeft: 15,
        benefits: ['Free seat selection', 'Free meal', 'Free cancellation voucher'],
      },
      {
        type: 'Business',
        price: 18500,
        seatsLeft: 6,
        benefits: ['Business Class recliner', 'Lounge access', '35kg baggage', 'Multi-course dining'],
      },
    ],
  },
  {
    id: 'fl_uk_945',
    airline: 'Vistara',
    airlineCode: 'UK',
    flightNumber: 'UK-945',
    airlineLogo: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=80&q=80',
    originCode: 'DEL',
    destinationCode: 'BLR',
    departureTime: '14:20',
    arrivalTime: '17:05',
    duration: '2h 45m',
    stops: 0,
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    fares: [
      {
        type: 'Saver',
        price: 5690,
        seatsLeft: 8,
        benefits: ['Complimentary hot meal', '15kg check-in', 'Inflight entertainment streaming'],
      },
      {
        type: 'Flexi',
        price: 6850,
        seatsLeft: 10,
        benefits: ['Premium seat', 'Chef curated meal', 'Flexible date changes'],
      },
      {
        type: 'Business',
        price: 19800,
        seatsLeft: 4,
        benefits: ['Full Business flat-bed', 'Lounge access', 'Priority baggage delivery'],
      },
    ],
  },
  {
    id: 'fl_qp_1301',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP-1301',
    airlineLogo: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=80&q=80',
    originCode: 'BOM',
    destinationCode: 'GOI',
    departureTime: '11:45',
    arrivalTime: '13:00',
    duration: '1h 15m',
    stops: 0,
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    fares: [
      {
        type: 'Saver',
        price: 2890,
        seatsLeft: 14,
        benefits: ['Comfortable ergonomic seats', 'USB charging at seat', '15kg check-in baggage'],
      },
      {
        type: 'Flexi',
        price: 3650,
        seatsLeft: 18,
        benefits: ['Cafe Akasa gourmet meal', 'Free seat selection', 'Low cancellation fee'],
      },
    ],
  },
  {
    id: 'fl_6e_552',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-552',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    originCode: 'DEL',
    destinationCode: 'GOI',
    departureTime: '09:05',
    arrivalTime: '11:40',
    duration: '2h 35m',
    stops: 0,
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    fares: [
      {
        type: 'Saver',
        price: 5400,
        seatsLeft: 11,
        benefits: ['Standard check-in 15kg', 'Cabin bag 7kg'],
      },
      {
        type: 'Flexi',
        price: 6350,
        seatsLeft: 20,
        benefits: ['Free seat', 'Sandwich combo', 'Change date anytime'],
      },
    ],
  },
  {
    id: 'fl_sg_8169',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNumber: 'SG-8169',
    airlineLogo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=80&q=80',
    originCode: 'BLR',
    destinationCode: 'DEL',
    departureTime: '18:10',
    arrivalTime: '21:00',
    duration: '2h 50m',
    stops: 0,
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    fares: [
      {
        type: 'Saver',
        price: 4999,
        seatsLeft: 6,
        benefits: ['Spicexpress standard baggage', 'On-time guarantee assurance'],
      },
      {
        type: 'Flexi',
        price: 5890,
        seatsLeft: 12,
        benefits: ['SpiceMax extra legroom seat', 'Complimentary hot beverage & cookie'],
      },
    ],
  },
];

export const HOTEL_PROPERTIES: HotelProperty[] = [
  {
    id: 'ht_taj_goa',
    name: 'Taj Exotica Resort & Spa, Goa',
    city: 'Goa',
    area: 'Benaulim Beach, South Goa',
    address: 'Calwaddo, Benaulim, Salcete, Goa 403716',
    starRating: 5,
    userRating: 4.8,
    reviewCount: 3120,
    featuredImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
    ],
    pricePerNight: 16500,
    taxPercent: 18,
    amenities: ['Private Beach Access', 'Infinity Swimming Pool', 'Jiva Luxury Spa', 'Complimentary Breakfast', 'Free High-Speed WiFi', 'Golf Course', '24/7 Room Service', 'Kids Club'],
    coordinates: { lat: 15.2472, lng: 73.9248 },
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in. Non-refundable thereafter.',
    rooms: [
      {
        id: 'rm_dlx_garden',
        name: 'Deluxe Garden Villa Room',
        capacity: '2 Adults, 1 Child',
        bedType: '1 King Bed or 2 Twin Beds',
        price: 16500,
        amenities: ['Private Balcony', 'Bathtub & Rain Shower', 'Complimentary Buffet Breakfast', 'Espresso Machine'],
      },
      {
        id: 'rm_ocean_view',
        name: 'Luxury Sea-Facing Villa with Plunge Pool',
        capacity: '3 Adults',
        bedType: '1 King Bed',
        price: 26500,
        amenities: ['Direct Ocean Sunset View', 'Private Plunge Pool', 'Personal Butler Service', 'Airport Chauffeur Transfer'],
      },
    ],
  },
  {
    id: 'ht_taj_mumbai',
    name: 'The Taj Mahal Palace, Mumbai',
    city: 'Mumbai',
    area: 'Colaba, Gateway of India',
    address: 'Apollo Bunder, Colaba, Mumbai 400001',
    starRating: 5,
    userRating: 4.9,
    reviewCount: 7850,
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80',
    ],
    pricePerNight: 28000,
    taxPercent: 18,
    amenities: ['Gateway of India View', 'Heritage Palace Architecture', 'Outdoor Swimming Pool', 'Palace Fine Dining', 'Free WiFi', 'Fitness Centre', 'Valet Parking'],
    coordinates: { lat: 18.9217, lng: 72.8332 },
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in date.',
    rooms: [
      {
        id: 'rm_taj_tower',
        name: 'Tower Superior City View',
        capacity: '2 Adults',
        bedType: '1 King Bed',
        price: 28000,
        amenities: ['City Skylines', 'Marble Bathroom', 'High Speed WiFi', 'Complimentary Heritage Walk Tour'],
      },
      {
        id: 'rm_taj_palace_sea',
        name: 'Palace Luxury Room Sea View',
        capacity: '2 Adults',
        bedType: '1 Grand Four-Poster King',
        price: 42000,
        amenities: ['Arabian Sea & Gateway View', 'Palace Lounge Access', 'Evening High Tea included'],
      },
    ],
  },
  {
    id: 'ht_imperial_delhi',
    name: 'The Imperial New Delhi',
    city: 'Delhi',
    area: 'Janpath, Connaught Place',
    address: 'Janpath Lane, Connaught Place, New Delhi 110001',
    starRating: 5,
    userRating: 4.8,
    reviewCount: 4200,
    featuredImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
    ],
    pricePerNight: 14500,
    taxPercent: 18,
    amenities: ['Colonial Heritage Art', 'Temperature Controlled Pool', 'The Imperial Spa', 'Fine Dining 1911', 'Free WiFi', 'Metro Walk Distance'],
    coordinates: { lat: 28.6225, lng: 77.2185 },
    cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival.',
    rooms: [
      {
        id: 'rm_imp_heritage',
        name: 'Heritage Superior Room',
        capacity: '2 Adults',
        bedType: '1 King Bed',
        price: 14500,
        amenities: ['Victorian Decor', 'Deep Soaking Tub', 'Breakfast included', 'Daily Fruit Basket'],
      },
    ],
  },
  {
    id: 'ht_itc_bangalore',
    name: 'ITC Gardenia, a Luxury Collection Hotel',
    city: 'Bengaluru',
    area: 'Residency Road, Central Business District',
    address: '1 Residency Rd, Shanthala Nagar, Ashok Nagar, Bengaluru 560025',
    starRating: 5,
    userRating: 4.7,
    reviewCount: 3890,
    featuredImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    ],
    pricePerNight: 11500,
    taxPercent: 18,
    amenities: ['LEED Platinum Certified Green Hotel', 'Rooftop Helipad & Pool', 'Kaya Kalp Spa', 'High Speed Fibre WiFi', 'Cubbon Park View'],
    coordinates: { lat: 12.9686, lng: 77.5962 },
    cancellationPolicy: 'Free cancellation up to 24 hours prior to 14:00 check-in.',
    rooms: [
      {
        id: 'rm_gardenia_tower',
        name: 'Tower Executive King Room',
        capacity: '2 Adults',
        bedType: '1 King Bed',
        price: 11500,
        amenities: ['Pillow Menu', 'Cubbon Park Greens View', 'Round-the-clock coffee lounge'],
      },
    ],
  },
  {
    id: 'ht_rambagh_jaipur',
    name: 'Rambagh Palace, Jaipur',
    city: 'Jaipur',
    area: 'Bhawani Singh Road, Civil Lines',
    address: 'Bhawani Singh Rd, Rambagh, Jaipur 302005',
    starRating: 5,
    userRating: 4.9,
    reviewCount: 4500,
    featuredImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    ],
    pricePerNight: 35000,
    taxPercent: 18,
    amenities: ['Royal Maharaja Residence', 'Peacock Garden', 'Indoor & Outdoor Heated Pools', 'Suvarna Mahal Fine Dining', 'Free High Speed WiFi', 'Vintage Car Transfer'],
    coordinates: { lat: 26.8967, lng: 75.8087 },
    cancellationPolicy: 'Free cancellation up to 7 days before arrival date.',
    rooms: [
      {
        id: 'rm_palace_room',
        name: 'Palace Classic Heritage Suite',
        capacity: '2 Adults',
        bedType: '1 Royal King Bed',
        price: 35000,
        amenities: ['Hand-painted fresco ceilings', 'Champagne welcome', 'Private courtyard view'],
      },
    ],
  },
];

export const METRO_NETWORKS: MetroCityNetwork[] = [
  {
    cityId: 'delhi',
    cityName: 'Delhi NCR (DMRC)',
    lines: [
      {
        lineName: 'Yellow Line (Samaypur Badli - Millennium City Centre)',
        color: '#EAB308',
        stations: ['Samaypur Badli', 'Azadpur', 'Kashmere Gate', 'Chandni Chowk', 'New Delhi', 'Rajiv Chowk', 'Central Secretariat', 'INA', 'Hauz Khas', 'MG Road', 'Millennium City Centre Gurugram'],
      },
      {
        lineName: 'Blue Line (Dwarka Sec 21 - Noida Electronic City)',
        color: '#2563EB',
        stations: ['Dwarka Sector 21', 'Janakpuri West', 'Rajouri Garden', 'Karol Bagh', 'Rajiv Chowk', 'Mandi House', 'Akshardham', 'Mayur Vihar 1', 'Botanical Garden', 'Noida City Centre', 'Noida Electronic City'],
      },
      {
        lineName: 'Magenta Line (Janakpuri West - Botanical Garden)',
        color: '#DB2777',
        stations: ['Janakpuri West', 'Terminal 1 IGI Airport', 'Hauz Khas', 'Kalkaji Mandir', 'Okhla Bird Sanctuary', 'Botanical Garden'],
      },
      {
        lineName: 'Airport Express Line (New Delhi - Yashobhoomi Dwarka)',
        color: '#EA580C',
        stations: ['New Delhi Railway Station Metro', 'Shivaji Stadium', 'Dhaula Kuan', 'Delhi Aerocity', 'IGI Airport T3', 'Dwarka Sector 21', 'Yashobhoomi Dwarka Sector 25'],
      },
    ],
    interchanges: [
      { station: 'Rajiv Chowk', lines: ['Yellow Line', 'Blue Line'] },
      { station: 'Kashmere Gate', lines: ['Red Line', 'Yellow Line', 'Violet Line'] },
      { station: 'Hauz Khas', lines: ['Yellow Line', 'Magenta Line'] },
      { station: 'Botanical Garden', lines: ['Blue Line', 'Magenta Line'] },
      { station: 'New Delhi', lines: ['Yellow Line', 'Airport Express Line'] },
    ],
  },
  {
    cityId: 'mumbai',
    cityName: 'Mumbai Metro (Maha Mumbai Metro / MMOPL)',
    lines: [
      {
        lineName: 'Line 1 (Versova - Andheri - Ghatkopar)',
        color: '#0284C7',
        stations: ['Versova', 'DN Nagar', 'Azad Nagar', 'Andheri West', 'Western Express Highway', 'Chakala (J.B. Nagar)', 'Airport Road', 'Marol Naka', 'Saki Naka', 'Asalpha', 'Jagruti Nagar', 'Ghatkopar'],
      },
      {
        lineName: 'Line 2A (Dahisar East - Andheri West)',
        color: '#EAB308',
        stations: ['Dahisar East', 'Kandivali West', 'Malad West', 'Oshiwara', 'Andheri West (DN Nagar Interchange)'],
      },
      {
        lineName: 'Line 7 (Dahisar East - Gundavali)',
        color: '#DC2626',
        stations: ['Dahisar East', 'Borivali East', 'Kurar', 'Goregaon East', 'Gundavali (Andheri East Interchange)'],
      },
    ],
    interchanges: [
      { station: 'DN Nagar / Andheri West', lines: ['Line 1', 'Line 2A'] },
      { station: 'Gundavali / WEH', lines: ['Line 1', 'Line 7'] },
      { station: 'Andheri', lines: ['Line 1', 'Western Railway Suburban'] },
      { station: 'Ghatkopar', lines: ['Line 1', 'Central Railway Suburban'] },
    ],
  },
  {
    cityId: 'bangalore',
    cityName: 'Bengaluru (Namma Metro)',
    lines: [
      {
        lineName: 'Purple Line (Challaghatta - Whitefield)',
        color: '#9333EA',
        stations: ['Challaghatta', 'Kengeri', 'Vijayanagar', 'Nadaprabhu Kempegowda Stn (Majestic)', 'Vidhana Soudha', 'MG Road', 'Indiranagar', 'Baiyappanahalli', 'KR Puram', 'Whitefield (Kadugodi)'],
      },
      {
        lineName: 'Green Line (Nagasandra - Silk Institute)',
        color: '#16A34A',
        stations: ['Nagasandra', 'Yeshwanthpur', 'Sandal Soap Factory', 'Nadaprabhu Kempegowda Stn (Majestic)', 'National College', 'Lalbagh', 'Jayanagar', 'Yelachenahalli', 'Silk Institute'],
      },
    ],
    interchanges: [
      { station: 'Nadaprabhu Kempegowda Stn (Majestic)', lines: ['Purple Line', 'Green Line'] },
      { station: 'MG Road', lines: ['Purple Line', 'Pink Line (Upcoming)'] },
    ],
  },
];

export const BUS_CATALOG: BusSchedule[] = [
  {
    id: 'bus_del_jai_1',
    operator: 'IntrCity SmartBus',
    busType: 'AC Sleeper 2+1 (BharatBenz)',
    origin: 'New Delhi (Kashmere Gate / Dhaula Kuan)',
    destination: 'Jaipur (Sindhi Camp / 200 Ft Bypass)',
    departureTime: '23:00',
    arrivalTime: '04:45',
    duration: '5h 45m',
    fare: 680,
    seatsAvailable: 14,
    rating: 4.7,
    amenities: ['WiFi Onboard', 'Clean Bedding', 'Live GPS Tracking', 'Personal Charging Plug', 'Water Bottle'],
  },
  {
    id: 'bus_del_jai_2',
    operator: 'Zingbus Electric Intercity',
    busType: 'Premium Volvo 9600 Multi-Axle AC Sleeper',
    origin: 'Delhi (Majnu Ka Tilla / Karol Bagh)',
    destination: 'Jaipur (Narayan Singh Circle)',
    departureTime: '06:30',
    arrivalTime: '11:45',
    duration: '5h 15m',
    fare: 750,
    seatsAvailable: 22,
    rating: 4.6,
    amenities: ['100% Electric Green Travel', 'Air Suspension', 'Reading Lights', 'Emergency SOS Button'],
  },
  {
    id: 'bus_bom_pune_1',
    operator: 'Shivneri MSRTC AC Volvo',
    busType: 'Volvo AC Semi-Sleeper B8R',
    origin: 'Mumbai (Dadar Asiad / Vashi Highway)',
    destination: 'Pune (Swargate / Shivaji Nagar)',
    departureTime: '07:00',
    arrivalTime: '10:30',
    duration: '3h 30m',
    fare: 490,
    seatsAvailable: 28,
    rating: 4.5,
    amenities: ['Expressway Non-Stop Corridor', 'Reclining Comfort Seats', 'Speed Governors', 'AC Climate Control'],
  },
  {
    id: 'bus_blr_maa_1',
    operator: 'KPN Travels',
    busType: 'Scania Multi-Axle AC Sleeper (2+1)',
    origin: 'Bengaluru (Madiwala / Electronic City)',
    destination: 'Chennai (Koyambedu CMBT / Guindy)',
    departureTime: '22:30',
    arrivalTime: '05:30',
    duration: '7h 00m',
    fare: 890,
    seatsAvailable: 11,
    rating: 4.4,
    amenities: ['Individual LCD screen', 'Blanket & Pillow', 'GPS fleet monitoring', 'USB Fast Charger'],
  },
];
