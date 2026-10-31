import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Search,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { api } from '../api/client';
import { SupportTicket, User } from '../types';

interface SupportViewProps {
  user: User | null;
  onOpenAuth: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ user, onOpenAuth }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New ticket state
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [category, setCategory] = useState<'Train' | 'Flight' | 'Hotel' | 'Metro' | 'Payment' | 'Refund' | 'General'>('Train');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'train',
      question: 'How do train seat confirmations and demo references work?',
      answer: 'In Demo Sandbox mode, train schedules and berth allocations mirror live IRCTC systems. Bookings generate a test reference (DEMO-TR-XXXX) that simulates confirmed boarding status. In Production mode, live provider credentials connect directly to authorized railway aggregators.',
    },
    {
      category: 'refund',
      question: 'How long do cancellation refunds take to settle?',
      answer: 'Once you cancel a booking from My Trips, our system initiates reversal instantly. In sandbox mode, settlements complete immediately so you can test the full lifecycle. In production, banks typically credit funds within 3-5 business days.',
    },
    {
      category: 'premium',
      question: 'What are the benefits of LuckyTrip Premium (₹999/yr)?',
      answer: 'LuckyTrip Premium eliminates convenience charges across all bookings, unlocks rapid-response support ticketing, and saves frequent co-traveller profiles for one-click checkouts.',
    },
    {
      category: 'metro',
      question: 'Can I use the digital Metro QR code at turnstile gates?',
      answer: 'Our digital QR tokens demonstrate the transit routing engine, fare calculation, and timed validity. Real travel through turnstiles requires authorized transit smartcards or production operator ticketing.',
    },
    {
      category: 'payment',
      question: 'Which payment methods are accepted in sandbox mode?',
      answer: 'LuckyTrip Pay simulates UPI (GPay, PhonePe, Paytm, QR scan), credit/debit cards (with test numbers), and Net Banking across major banks with test success and failure triggers.',
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    if (faqCategory !== 'all' && f.category !== faqCategory) return false;
    if (faqSearch && !f.question.toLowerCase().includes(faqSearch.toLowerCase()) && !f.answer.toLowerCase().includes(faqSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const fetchTickets = async () => {
    if (!user) return;
    try {
      const res = await api.getSupportTickets();
      setTickets(res || []);
      if (res && res.length > 0 && !selectedTicket) {
        setSelectedTicket(res[0]);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      const newTicket = await api.createSupportTicket({
        category,
        subject,
        message,
        priority,
      });
      setTickets([newTicket, ...tickets]);
      setSelectedTicket(newTicket);
      setIsCreatingTicket(false);
      setSubject('');
      setMessage('');
    } catch {
      // ignore
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const res = await api.replySupportTicket(selectedTicket.id, replyMessage.trim());
      setSelectedTicket(res.ticket);
      setTickets(tickets.map((t) => (t.id === res.ticket.id ? res.ticket : t)));
      setReplyMessage('');
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                LuckyTrip Help & Support Centre
              </span>
              <h1 className="text-xl sm:text-3xl font-black">24x7 Customer Assistance</h1>
              <p className="text-xs text-slate-300">
                Browse answers or connect directly with our travel operations team.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!user) onOpenAuth();
              else setIsCreatingTicket(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition-colors flex items-center gap-2 shadow-md w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Open Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Direct Assistance</span>
            <h2 className="text-xl font-black text-slate-900">Your Support Tickets & Messages</h2>
          </div>
        </div>

        {isCreatingTicket ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
            <h3 className="text-sm font-black text-slate-900 mb-4">Create New Support Inquiry</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Train">Train Booking & PNR</option>
                    <option value="Flight">Flight & Baggage</option>
                    <option value="Hotel">Hotel Check-In & Rooms</option>
                    <option value="Metro">Metro Passes</option>
                    <option value="Payment">Payment Gateway Inquiry</option>
                    <option value="Refund">Cancellation & Refund Status</option>
                    <option value="General">General Inquiries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Upcoming Journey)</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding berth confirmation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry with booking reference if applicable..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-slate-800"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tickets Sidebar */}
            <div className="lg:col-span-5 space-y-2">
              {tickets.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No active support tickets. Click "Open Support Ticket" if you need assistance.
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedTicket?.id === t.id
                        ? 'bg-sky-50/80 border-sky-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">{t.ticketNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t.category} • Updated {new Date(t.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Conversation Thread */}
            {selectedTicket && (
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-[460px]">
                <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-sky-700">#{selectedTicket.ticketNumber}</span>
                    <h3 className="text-sm font-black text-slate-900">{selectedTicket.subject}</h3>
                  </div>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Message Scroll Area */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {selectedTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] ${
                        m.sender === 'user'
                          ? 'ml-auto bg-[#0B2545] text-white rounded-br-xs'
                          : 'mr-auto bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75">
                        <span className="font-bold">{m.senderName}</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the support team..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Self Service</span>
          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
        </div>

        {/* FAQ Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {['all', 'train', 'refund', 'premium', 'metro', 'payment'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                  faqCategory === cat ? 'bg-[#0B2545] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-sky-700 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
