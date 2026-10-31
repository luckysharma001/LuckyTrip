/**
 * LuckyTrip Frontend API Client
 */

import {
  SystemConfig,
  User,
  SavedTraveller,
  TrainSchedule,
  FlightSchedule,
  HotelProperty,
  MetroCityNetwork,
  MetroRouteResult,
  BusSchedule,
  Booking,
  RefundRecord,
  SupportTicket,
  NotificationItem,
} from '../types';

const TOKEN_KEY = 'luckytrip_auth_token';

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) || 'usr_luckytrip_demo';
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // System
  getConfig: () => request<SystemConfig>('/system/config'),
  setMode: (mode: 'DEMO' | 'PRODUCTION') =>
    request<{ success: boolean; mode: 'DEMO' | 'PRODUCTION' }>('/system/mode', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    }),

  // Auth
  sendOtp: (identifier: string) =>
    request<{ success: boolean; message: string; hintOtp: string; expiresInSeconds: number }>(
      '/auth/send-otp',
      { method: 'POST', body: JSON.stringify({ identifier }) }
    ),
  verifyOtp: (identifier: string, otp: string, name?: string) =>
    request<{ success: boolean; token: string; user: User }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp, name }),
    }),
  getMe: () => request<{ user: User; savedTravellers: SavedTraveller[] }>('/auth/me'),
  updateProfile: (profile: Partial<User>) =>
    request<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
  deleteAccount: () => request<{ success: boolean; message: string }>('/auth/delete-account', { method: 'POST' }),

  // Saved Travellers
  getTravellers: () => request<SavedTraveller[]>('/travellers'),
  addTraveller: (traveller: Omit<SavedTraveller, 'id' | 'userId'>) =>
    request<SavedTraveller>('/travellers', {
      method: 'POST',
      body: JSON.stringify(traveller),
    }),
  deleteTraveller: (id: string) => request<{ success: boolean }>(`/travellers/${id}`, { method: 'DELETE' }),

  // Trains
  getTrainStations: (q?: string) =>
    request<{ code: string; name: string; city: string; state: string }[]>(`/trains/stations${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  searchTrains: (from: string, to: string, date?: string, travelClass?: string, quota?: string) => {
    const params = new URLSearchParams({ from, to });
    if (date) params.append('date', date);
    if (travelClass) params.append('travelClass', travelClass);
    if (quota) params.append('quota', quota);
    return request<{ from: string; to: string; date: string; trains: TrainSchedule[]; isDemo: boolean; disclaimer: string }>(
      `/trains/search?${params.toString()}`
    );
  },
  getTrainDetails: (id: string) => request<TrainSchedule>(`/trains/${id}`),

  // Flights
  getAirports: (q?: string) =>
    request<{ code: string; name: string; city: string; country: string; terminal: string }[]>(`/flights/airports${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  searchFlights: (from: string, to: string, date?: string, tripType?: string, cabinClass?: string) => {
    const params = new URLSearchParams({ from, to });
    if (date) params.append('date', date);
    if (tripType) params.append('tripType', tripType);
    if (cabinClass) params.append('cabinClass', cabinClass);
    return request<{ from: string; to: string; date: string; flights: FlightSchedule[]; isDemo: boolean }>(
      `/flights/search?${params.toString()}`
    );
  },

  // Hotels
  getHotelCities: () => request<string[]>('/hotels/cities'),
  searchHotels: (city?: string, checkIn?: string, checkOut?: string, guests?: number, rooms?: number) => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', String(guests));
    if (rooms) params.append('rooms', String(rooms));
    return request<{ searchCity: string; checkIn: string; checkOut: string; hotels: HotelProperty[] }>(
      `/hotels/search?${params.toString()}`
    );
  },
  getHotelDetails: (id: string) => request<HotelProperty>(`/hotels/${id}`),

  // Metro
  getMetroCities: () => request<MetroCityNetwork[]>('/metro/cities'),
  getMetroRoute: (cityId: string, from?: string, to?: string) => {
    const params = new URLSearchParams({ cityId });
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return request<MetroRouteResult>(`/metro/route?${params.toString()}`);
  },

  // Bus
  searchBuses: (from?: string, to?: string, date?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    return request<{ origin: string; destination: string; buses: BusSchedule[] }>(`/bus/search?${params.toString()}`);
  },

  // Promo
  validatePromo: (code: string, amount: number) =>
    request<{ valid: boolean; code: string; discount: number; description: string }>('/promos/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    }),

  // Bookings
  createBooking: (bookingPayload: any) =>
    request<{ success: boolean; booking: Booking; message: string }>('/bookings/create', {
      method: 'POST',
      body: JSON.stringify(bookingPayload),
    }),
  getBookings: (type?: string, status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return request<{ total: number; bookings: Booking[] }>(`/bookings?${params.toString()}`);
  },
  getBookingDetails: (id: string) =>
    request<{ booking: Booking; refund?: RefundRecord }>(`/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) =>
    request<{ success: boolean; message: string; booking: Booking; refund: RefundRecord }>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Refunds
  getRefunds: () => request<RefundRecord[]>('/refunds'),
  getRefundDetails: (bookingId: string) => request<RefundRecord>(`/refunds/${bookingId}`),

  // Premium
  subscribePremium: () =>
    request<{ success: boolean; isPremium: boolean; validUntil: string; transactionId: string; message: string }>(
      '/premium/subscribe',
      { method: 'POST' }
    ),

  // Notifications
  getNotifications: () => request<NotificationItem[]>('/notifications'),
  markNotificationRead: (id: string) => request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST' }),
  clearAllNotifications: () => request<{ success: boolean }>('/notifications/clear-all', { method: 'POST' }),

  // Support
  getSupportTickets: () => request<SupportTicket[]>('/support/tickets'),
  createSupportTicket: (data: { category: string; subject: string; message: string; priority: string }) =>
    request<SupportTicket>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  replySupportTicket: (id: string, message: string) =>
    request<{ success: boolean; ticket: SupportTicket }>(`/support/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // Admin
  getAdminStats: () =>
    request<{
      kpis: {
        totalBookings: number;
        gmvRevenue: number;
        totalUsers: number;
        activeRefunds: number;
        completedRefunds: number;
        openTickets: number;
        mode: string;
      };
      recentBookings: Booking[];
      recentAuditLogs: any[];
      systemHealth: any;
    }>('/admin/stats'),
  getAdminBookings: () => request<Booking[]>('/admin/bookings'),
  getAdminTickets: () => request<SupportTicket[]>('/admin/tickets'),
  updateTicketStatus: (id: string, status: string, replyMessage?: string) =>
    request<{ success: boolean; ticket: SupportTicket }>(`/admin/tickets/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, replyMessage }),
    }),
  processRefund: (id: string) =>
    request<{ success: boolean; refund: RefundRecord }>(`/admin/refunds/${id}/process`, {
      method: 'POST',
    }),
  getAdminAuditLogs: () => request<any[]>('/admin/audit-logs'),
};
