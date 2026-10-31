import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  CreditCard,
  Users,
  RotateCcw,
  MessageSquare,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  ToggleLeft,
  ToggleRight,
  Database,
  Lock,
} from 'lucide-react';
import { api } from '../api/client';
import { Booking, SupportTicket, RefundRecord, User } from '../types';

interface AdminViewProps {
  user: User | null;
  onOpenBookingDetails: (bookingId: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  onOpenBookingDetails,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'kpis' | 'bookings' | 'tickets' | 'audit'>('kpis');
  const [isLoading, setIsLoading] = useState(true);

  // Ticket reply modal
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await api.getAdminStats();
      setStats(statsRes);
      const bookingsRes = await api.getAdminBookings();
      setAllBookings(bookingsRes || []);
      const ticketsRes = await api.getAdminTickets();
      setAllTickets(ticketsRes || []);
      const logsRes = await api.getAdminAuditLogs();
      setAuditLogs(logsRes || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleAdminTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;

    try {
      const res = await api.updateTicketStatus(activeTicket.id, newStatus, adminReply);
      setAllTickets(allTickets.map((t) => (t.id === res.ticket.id ? res.ticket : t)));
      setActiveTicket(null);
      setAdminReply('');
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title Card */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                LuckyTrip Operations Console
              </span>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                ADMIN ACCESS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">System Administration & Audit</h1>
            <p className="text-xs text-slate-300">
              Real-time transaction tracking, refund settlement oversight, and customer tickets.
            </p>
          </div>
        </div>

        {/* Operating Mode Switcher */}
        <button
          onClick={onToggleDemoMode}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-colors flex items-center gap-2 ${
            isDemoMode
              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          <span>Mode: {isDemoMode ? 'SANDBOX DEMO' : 'LIVE PRODUCTION'}</span>
          {isDemoMode ? <ToggleLeft className="w-5 h-5 text-amber-300" /> : <ToggleRight className="w-5 h-5 text-emerald-300" />}
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gross Bookings GMV</span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              ₹{stats.kpis.gmvRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {stats.kpis.totalBookings} Total Reservations
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Registered Travellers</span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{stats.kpis.totalUsers}</p>
            <span className="text-[11px] text-sky-600 font-semibold mt-1 block">Active Profiles</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Refunds Settled</span>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">{stats.kpis.completedRefunds}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Instant Reversals</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Open Tickets</span>
            <p className="text-2xl font-black text-amber-600 mt-1 font-mono">{stats.kpis.openTickets}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting Staff Reply</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex gap-1 text-xs font-bold">
        {[
          { id: 'kpis', label: 'Service Health & Overview' },
          { id: 'bookings', label: `All Bookings (${allBookings.length})` },
          { id: 'tickets', label: `Support Tickets (${allTickets.length})` },
          { id: 'audit', label: `Security Audit Trail (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab.id ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Health Overview */}
      {activeTab === 'kpis' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              API Provider & Service Health
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Railway Booking Engine</span>
                <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {stats.systemHealth.trainEngine}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Flight GDS Aggregator</span>
                <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {stats.systemHealth.flightGds}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Hospitality CRS Stays</span>
                <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {stats.systemHealth.hotelCrs}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Razorpay Payment Gateway</span>
                <span className="text-sky-700 bg-sky-50 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                  {stats.systemHealth.razorpayGateway}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-sky-600" />
              Database Architecture
            </h3>
            <div className="text-xs text-slate-600 space-y-2">
              <p>LuckyTrip operates with ACID compliant transactional storage in Node.js / Express.</p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                <div>• User & Identity Tables</div>
                <div>• Bookings & Multi-Passenger Items</div>
                <div>• Payment Transactions & Gateway Signatures</div>
                <div>• Cancellations & Automated Refund Triggers</div>
                <div>• Support Ticket Messaging Queues</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. All Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Route / Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-slate-900">{b.referenceNumber}</td>
                    <td className="p-4 uppercase font-bold text-sky-700">{b.bookingType}</td>
                    <td className="p-4 font-bold max-w-xs truncate">{b.title}</td>
                    <td className="p-4 text-slate-500">{b.journeyDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'CANCELLED' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold font-mono">₹{b.pricing.totalAmount}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onOpenBookingDetails(b.id)}
                        className="text-sky-600 hover:text-sky-900 font-bold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Support Tickets Management */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allTickets.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{t.ticketNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{t.subject}</h4>
                <p className="text-[11px] text-slate-500">
                  User: {t.userName} ({t.userEmail}) • Category: {t.category}
                </p>
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveTicket(t)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-slate-800"
                  >
                    Respond as Support Staff
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Admin reply modal */}
          {activeTicket && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
                <h3 className="font-bold text-sm text-slate-900">
                  Reply to Ticket {activeTicket.ticketNumber} ({activeTicket.userName})
                </h3>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="OPEN">Open</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Response Message</label>
                  <textarea
                    rows={4}
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Enter official resolution message for the customer..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTicket(null)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminTicketSubmit}
                    className="px-5 py-2 rounded-xl bg-[#0B2545] text-white text-xs font-bold"
                  >
                    Send Resolution
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Immutable System Audit Logs
            </h3>
            <span className="text-[11px] text-slate-500">{auditLogs.length} Events Logged</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <p className="text-slate-800 font-medium mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
