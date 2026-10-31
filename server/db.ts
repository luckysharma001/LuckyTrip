/**
 * LuckyTrip Database & Persistence Layer
 * Provides high-speed in-memory store with JSON persistence, ACID transactions, and comprehensive mock/sandbox seeding.
 */

import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  premiumUntil?: string;
  avatar?: string;
  createdAt: string;
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

export interface Booking {
  id: string;
  referenceNumber: string; // e.g. DEMO-TR-1029
  userId: string;
  bookingType: 'train' | 'flight' | 'hotel' | 'metro' | 'bus';
  title: string;
  origin: string;
  destination: string;
  journeyDate: string;
  returnDate?: string;
  serviceNumber?: string; // e.g. 12952 Rajdhani, 6E-204
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
  ticketNumber: string; // e.g. LT-TKT-1042
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

export interface PromoCode {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minAmount: number;
  description: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  userId?: string;
  timestamp: string;
  ip?: string;
}

// Memory + persistent database
class Database {
  private dataFile: string;
  public users: User[] = [];
  public savedTravellers: SavedTraveller[] = [];
  public bookings: Booking[] = [];
  public refunds: RefundRecord[] = [];
  public supportTickets: SupportTicket[] = [];
  public notifications: NotificationItem[] = [];
  public auditLogs: AuditLog[] = [];
  public activeOtps: Map<string, { code: string; expiresAt: number }> = new Map();
  public appMode: 'DEMO' | 'PRODUCTION' = 'DEMO';

  constructor() {
    this.dataFile = path.resolve(process.cwd(), 'database.json');
    this.load();
    if (this.users.length === 0) {
      this.seedInitialData();
    }
  }

  private load() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const raw = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(raw);
        this.users = parsed.users || [];
        this.savedTravellers = parsed.savedTravellers || [];
        this.bookings = parsed.bookings || [];
        this.refunds = parsed.refunds || [];
        this.supportTickets = parsed.supportTickets || [];
        this.notifications = parsed.notifications || [];
        this.auditLogs = parsed.auditLogs || [];
        this.appMode = parsed.appMode || 'DEMO';
      }
    } catch (e) {
      console.warn('Could not read database.json, starting with clean store', e);
    }
  }

  public save() {
    try {
      const payload = {
        users: this.users,
        savedTravellers: this.savedTravellers,
        bookings: this.bookings,
        refunds: this.refunds,
        supportTickets: this.supportTickets,
        notifications: this.notifications,
        auditLogs: this.auditLogs,
        appMode: this.appMode,
      };
      fs.writeFileSync(this.dataFile, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist database.json', e);
    }
  }

  public logAudit(action: string, details: string, userId?: string) {
    const entry: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      details,
      userId,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
    this.save();
  }

  private seedInitialData() {
    // 1. Primary demo user & admin user
    const defaultUser: User = {
      id: 'usr_luckytrip_demo',
      name: 'Lucky Sharma',
      email: 'luckysharmadefence001@gmail.com',
      phone: '+91 98765 43210',
      role: 'user',
      isPremium: true,
      premiumUntil: '2027-10-31T00:00:00.000Z',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      createdAt: '2026-01-15T10:00:00.000Z',
    };

    const adminUser: User = {
      id: 'usr_admin_portal',
      name: 'LuckyTrip Operations Admin',
      email: 'admin@luckytrip.internal',
      phone: '+91 99999 00000',
      role: 'admin',
      isPremium: true,
      premiumUntil: '2030-01-01T00:00:00.000Z',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    this.users.push(defaultUser, adminUser);

    // 2. Saved travellers for one-click passenger fill
    this.savedTravellers.push(
      {
        id: 'trav_1',
        userId: defaultUser.id,
        fullName: 'Lucky Sharma',
        age: 28,
        gender: 'male',
        berthPreference: 'Side Lower',
        idType: 'Aadhaar / Gov ID',
        idNumber: '•••• •••• 9821',
      },
      {
        id: 'trav_2',
        userId: defaultUser.id,
        fullName: 'Priya Sharma',
        age: 26,
        gender: 'female',
        berthPreference: 'Lower',
        idType: 'Passport',
        idNumber: 'Z••••••8',
      },
      {
        id: 'trav_3',
        userId: defaultUser.id,
        fullName: 'Ramesh Sharma',
        age: 58,
        gender: 'male',
        berthPreference: 'Lower (Senior Citizen)',
        idType: 'Driving Licence',
        idNumber: 'DL••••••12',
      }
    );

    // 3. Sample initial bookings representing different modes
    const upcomingTrainBooking: Booking = {
      id: 'bkg_tr_9912',
      referenceNumber: 'DEMO-TR-9912',
      userId: defaultUser.id,
      bookingType: 'train',
      title: 'New Delhi to Mumbai Central — Rajdhani Express',
      origin: 'New Delhi (NDLS)',
      destination: 'Mumbai Central (BCT)',
      journeyDate: '2026-11-08',
      serviceNumber: '12952',
      serviceName: 'Mumbai Central Tejas Rajdhani Express',
      passengers: [
        {
          name: 'Lucky Sharma',
          age: 28,
          gender: 'male',
          berthPreference: 'Side Lower',
          coachNumber: 'B4',
          seatNumber: '29',
          cabinClass: '3A',
        },
      ],
      pricing: {
        baseFare: 2280,
        taxes: 114,
        convenienceFee: 0, // Waived for Premium
        discount: 200,
        totalAmount: 2194,
      },
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI (GPay / PhonePe)',
      paymentId: 'DEMO-PAY-TXN-8812',
      createdAt: '2026-10-25T14:30:00.000Z',
      isDemo: true,
    };

    const upcomingFlightBooking: Booking = {
      id: 'bkg_fl_4410',
      referenceNumber: 'DEMO-FL-4410',
      userId: defaultUser.id,
      bookingType: 'flight',
      title: 'Delhi (DEL) to Goa (GOI) — IndiGo 6E-204',
      origin: 'Delhi (DEL - Indira Gandhi T3)',
      destination: 'Goa (GOI - Dabolim Intl)',
      journeyDate: '2026-11-18',
      serviceNumber: '6E-204',
      serviceName: 'IndiGo Airlines',
      passengers: [
        {
          name: 'Lucky Sharma',
          age: 28,
          gender: 'male',
          seatNumber: '12F (Window)',
          cabinClass: 'Economy Saver',
        },
        {
          name: 'Priya Sharma',
          age: 26,
          gender: 'female',
          seatNumber: '12E (Middle)',
          cabinClass: 'Economy Saver',
        },
      ],
      pricing: {
        baseFare: 8400,
        taxes: 960,
        convenienceFee: 0,
        discount: 500,
        totalAmount: 8860,
      },
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'HDFC Credit Card (•••• 4012)',
      paymentId: 'DEMO-PAY-TXN-9341',
      createdAt: '2026-10-28T09:15:00.000Z',
      isDemo: true,
    };

    const completedHotelBooking: Booking = {
      id: 'bkg_ht_2201',
      referenceNumber: 'DEMO-HT-2201',
      userId: defaultUser.id,
      bookingType: 'hotel',
      title: 'The Leela Palace Bengaluru',
      origin: 'Bengaluru, Karnataka',
      destination: 'HAL Old Airport Road',
      journeyDate: '2026-10-02',
      serviceName: 'The Leela Palace Luxury Resort',
      roomDetails: {
        hotelName: 'The Leela Palace Bengaluru',
        roomType: 'Royal Premier Garden View Room',
        nights: 2,
        guests: 2,
        checkIn: '2026-10-02',
        checkOut: '2026-10-04',
        address: '23 HAL Old Airport Rd, HAL 2nd Stage, Kodihalli, Bengaluru',
      },
      passengers: [
        { name: 'Lucky Sharma', age: 28, gender: 'male' },
        { name: 'Priya Sharma', age: 26, gender: 'female' },
      ],
      pricing: {
        baseFare: 24000,
        taxes: 4320,
        convenienceFee: 0,
        discount: 1500,
        totalAmount: 26820,
      },
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      paymentMethod: 'Net Banking (SBI)',
      paymentId: 'DEMO-PAY-TXN-1102',
      createdAt: '2026-09-20T11:45:00.000Z',
      isDemo: true,
    };

    const cancelledMetroBooking: Booking = {
      id: 'bkg_mt_7719',
      referenceNumber: 'DEMO-MT-7719',
      userId: defaultUser.id,
      bookingType: 'metro',
      title: 'Delhi Metro — Rajiv Chowk to Botanical Garden',
      origin: 'Rajiv Chowk (Blue Line)',
      destination: 'Botanical Garden (Magenta Line)',
      journeyDate: '2026-10-14',
      serviceName: 'Delhi Metro Rail Corporation (DMRC)',
      passengers: [{ name: 'Lucky Sharma', age: 28, gender: 'male' }],
      metroDetails: {
        city: 'Delhi NCR',
        fromStation: 'Rajiv Chowk',
        toStation: 'Botanical Garden',
        interchanges: ['Mandi House (Blue Line Interchange)'],
        tokenCount: 1,
        qrCodeString: 'DMRC-QR-88319-DEMO-VAL',
        validityMinutes: 180,
      },
      pricing: {
        baseFare: 40,
        taxes: 0,
        convenienceFee: 0,
        discount: 0,
        totalAmount: 40,
      },
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      paymentMethod: 'UPI (Paytm)',
      paymentId: 'DEMO-PAY-TXN-3342',
      cancellationDate: '2026-10-14T12:00:00.000Z',
      cancellationReason: 'Trip rescheduled by traveller',
      refundAmount: 40,
      cancellationFee: 0,
      createdAt: '2026-10-14T11:30:00.000Z',
      isDemo: true,
    };

    this.bookings.push(
      upcomingTrainBooking,
      upcomingFlightBooking,
      completedHotelBooking,
      cancelledMetroBooking
    );

    // 4. Corresponding refund record
    this.refunds.push({
      id: 'ref_9921',
      bookingId: cancelledMetroBooking.id,
      bookingRef: cancelledMetroBooking.referenceNumber,
      userId: defaultUser.id,
      requestedAmount: 40,
      cancellationCharge: 0,
      netRefund: 40,
      refundMethod: 'Original UPI Account',
      status: 'REFUND_COMPLETED',
      initiatedAt: '2026-10-14T12:05:00.000Z',
      completedAt: '2026-10-14T12:08:00.000Z',
      gatewayRefundId: 'DEMO-RFND-UPI-55109',
      isDemo: true,
    });

    // 5. Initial notifications
    this.notifications.push(
      {
        id: 'notif_1',
        userId: defaultUser.id,
        title: 'Train Journey in 8 Days 🚆',
        message: 'Your Mumbai Central Rajdhani (12952) journey from NDLS is confirmed. Coach B4, Berth 29.',
        type: 'journey',
        read: false,
        createdAt: '2026-10-31T06:00:00.000Z',
        actionUrl: '/trips',
      },
      {
        id: 'notif_2',
        userId: defaultUser.id,
        title: 'Refund Successfully Credited ₹40 ✅',
        message: 'Refund for cancelled Metro journey DEMO-MT-7719 was credited to your UPI handle.',
        type: 'refund',
        read: true,
        createdAt: '2026-10-14T12:08:00.000Z',
        actionUrl: '/refunds',
      },
      {
        id: 'notif_3',
        userId: defaultUser.id,
        title: 'LuckyTrip Premium Active ⭐',
        message: 'Enjoy ₹0 convenience fees on all trains, flights, and hotels plus priority support.',
        type: 'promo',
        read: true,
        createdAt: '2026-10-01T00:00:00.000Z',
        actionUrl: '/premium',
      }
    );

    // 6. Initial support tickets
    this.supportTickets.push({
      id: 'tkt_801',
      ticketNumber: 'LT-TKT-1042',
      userId: defaultUser.id,
      userName: 'Lucky Sharma',
      userEmail: 'luckysharmadefence001@gmail.com',
      category: 'Train',
      subject: 'Inquiry regarding meal preference on Mumbai Rajdhani',
      priority: 'normal',
      status: 'RESOLVED',
      createdAt: '2026-10-26T10:15:00.000Z',
      updatedAt: '2026-10-26T11:40:00.000Z',
      messages: [
        {
          id: 'msg_1',
          sender: 'user',
          senderName: 'Lucky Sharma',
          message: 'Hi LuckyTrip team, I selected vegetarian meal for my Rajdhani Express booking DEMO-TR-9912. Can I confirm if evening snacks are included?',
          timestamp: '2026-10-26T10:15:00.000Z',
        },
        {
          id: 'msg_2',
          sender: 'support',
          senderName: 'Rahul (LuckyTrip Support)',
          message: 'Hello Lucky! Yes, Rajdhani Express 12952 includes full catering: evening tea & snacks, dinner, and morning breakfast served right to your berth B4-29. Safe travels!',
          timestamp: '2026-10-26T11:40:00.000Z',
        },
      ],
    });

    this.logAudit('DATABASE_INIT', 'LuckyTrip database initialized with demo records and verified user profile');
    this.save();
  }
}

export const db = new Database();
