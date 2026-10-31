# LuckyTrip — One App. Every Journey.

**LuckyTrip** is an independent, unified multi-modal travel platform built to simplify journey discovery, reservations, transit planning, and expense tracking under one roof.

---

## 🌟 Core Features & Modules

1. **Train Search & Booking:**
   - Station code autocomplete (NDLS, BCT, HWH, SBC, MAS, PNBE, CSMT, ADI, BSB, etc.)
   - Swap station endpoints, date selection, travel classes (1A, 2A, 3A, SL, CC, EC)
   - Quotas (General, Tatkal, Ladies, Senior Citizen)
   - Live availability status (AVAILABLE, RAC, Waitlist)
   - Demo references prefixed with `DEMO-TR-` with coach and berth assignments

2. **Flight Search & Booking:**
   - One-way and Round-trip multi-city ready architecture
   - Airport autocomplete (DEL, BOM, BLR, GOI, HYD, MAA, CCU, JAI)
   - Airlines (IndiGo, Air India, Vistara, Akasa Air, SpiceJet)
   - Fares matrix (Saver, Flexi with free meal, Business Class)
   - Non-stop and airline filtering, baggage allowances

3. **Hotel Reservations:**
   - Major travel destinations: Goa, Mumbai, Delhi, Bengaluru, Jaipur
   - Star rating, verified guest ratings, photo galleries
   - Room types (Deluxe, Executive Suite, Sea View Villa)
   - Total stay calculation, GPS coordinates, transparent cancellation policies

4. **Metro Urban Transit Planner:**
   - Supported cities: Delhi NCR (DMRC), Mumbai Metro, Bengaluru (Namma Metro)
   - Line interchange solver, estimated travel duration, and fare matrix
   - Digital single journey QR pass generator with countdown validity

5. **Intercity Bus Expansion:**
   - Premium electric & BharatBenz AC sleeper coaches
   - Routes: Delhi-Jaipur, Mumbai-Pune, Bengaluru-Chennai

6. **Unified My Trips Hub:**
   - Filter by status (Upcoming, Completed, Cancelled) and category
   - Search trips by reference number or city
   - Digital E-Ticket viewer with printable pass and QR code

7. **Cancellation & Refund Pipeline:**
   - Transparent cancellation fee calculation per provider policy
   - Real-time step-by-step refund tracking: Requested → Gateway Processing → Refund Credited
   - Unique gateway refund reference ID (e.g., `DEMO-RFND-TXN-XXXX`)

8. **LuckyTrip Premium (₹999/Year):**
   - Waives convenience fees across all bookings
   - Auto-syncs saved traveller profiles
   - Priority 24x7 in-app support queue

9. **Customer Support Desk & FAQs:**
   - Categorized searchable help topics
   - Interactive support ticket submission (Urgent/High/Normal)
   - Live conversation reply thread between traveller and operations

10. **Operations Admin Console:**
    - Real-time KPI analytics (GMV revenue, total bookings, users, open tickets)
    - All bookings inspection table
    - Staff resolution and replies on support tickets
    - Immutable security audit trail
    - One-click toggle between DEMO Mode and PRODUCTION Mode

---

## 🛠️ Technology Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend:** Node.js Express server (`server.ts`) with custom REST endpoints (`server/api.ts`)
- **Database & Persistence:** Transactional persistent store (`server/db.ts`) with file-backed JSON persistence and in-memory ACID simulation
- **Payment Sandbox:** Razorpay-style gateway simulation with UPI QR, cards, net banking, and success/failure toggles
- **Security:** DPDP Act compliance, OTP time-bound verification, zero storage of plaintext passwords or card CVVs

---

## 🚀 Commands & Development

### 1. Start Development Server
```bash
npm run dev
```
Starts full-stack Express server with Vite middleware on `http://localhost:3000`.

### 2. Run Automated Verification Tests
```bash
npm run test
```
Executes the test suite covering OTP auth, inventory search, booking, payment, cancellation, and admin APIs.

### 3. Production Build
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

---

## 🔒 Demo vs. Production Modes

- **DEMO MODE (Default):**
  - All bookings generate references prefixed with `DEMO-`
  - Payments are processed via simulated Razorpay Sandbox
  - Refunds are credited instantly for testing
- **PRODUCTION MODE:**
  - Connects to live authorized GDS, railway, and airline aggregators via environment credentials
  - The mode can be toggled in real time in the application header or the Admin Dashboard

---

## ⚖️ Independent Platform Disclaimer

LuckyTrip is an independent product concept and travel platform. LuckyTrip is not affiliated with, endorsed by, or an official application of Indian Railways, IRCTC, or government transit authorities. In Demo Sandbox mode, tickets are simulated for application demonstration and do not grant physical transit access.
