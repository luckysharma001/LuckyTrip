import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { RefundRecord } from '../types';

interface RefundTrackerViewProps {
  bookingId?: string;
  onBack: () => void;
  onOpenSupport: () => void;
}

export const RefundTrackerView: React.FC<RefundTrackerViewProps> = ({
  bookingId,
  onBack,
  onOpenSupport,
}) => {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RefundRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getRefunds().then((res) => {
      setRefunds(res || []);
      if (bookingId) {
        const found = res.find((r) => r.bookingId === bookingId);
        if (found) setSelectedRecord(found);
        else if (res.length > 0) setSelectedRecord(res[0]);
      } else if (res.length > 0) {
        setSelectedRecord(res[0]);
      }
      setIsLoading(false);
    });
  }, [bookingId]);

  const steps = [
    { key: 'INITIATED', label: 'Cancellation & Refund Requested', desc: 'Provider verified and ticket cancelled' },
    { key: 'PROCESSING', label: 'Gateway Processing', desc: 'Transfer instruction dispatched to banking network' },
    { key: 'COMPLETED', label: 'Refund Credited Successfully', desc: 'Funds settled into original payment source' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <button
          onClick={onOpenSupport}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4 text-sky-600" />
          <span>Refund Support Desk</span>
        </button>
      </div>

      <div className="bg-[#0B2545] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Financial Transparency
            </span>
            <h1 className="text-xl sm:text-2xl font-black">Cancellation & Refund Tracker</h1>
            <p className="text-xs text-slate-300">
              Live updates on reversal settlements and banking transaction IDs.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 animate-pulse h-48"></div>
      ) : refunds.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
          <RotateCcw className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Refund Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you cancel a journey, detailed progress and banking settlement references will be tracked here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of refund records */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Refund History ({refunds.length})
            </span>
            {refunds.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRecord(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedRecord?.id === r.id
                    ? 'bg-sky-50/80 border-sky-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{r.bookingRef}</span>
                  <span className="text-xs font-black text-emerald-600">₹{r.netRefund}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Initiated: {new Date(r.initiatedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          {/* Detailed tracker for selected record */}
          {selectedRecord && (
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Booking Reference
                  </span>
                  <h3 className="font-mono text-lg font-black text-slate-900">{selectedRecord.bookingRef}</h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Net Refund Amount
                  </span>
                  <p className="text-2xl font-black text-emerald-600 font-mono">₹{selectedRecord.netRefund}</p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2 space-y-6">
                {steps.map((st, idx) => {
                  const isDone = true; // In our demo backend, instant simulated completion
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="w-0.5 h-10 bg-emerald-300 my-1"></div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{st.label}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                        {idx === 2 && (
                          <span className="inline-block mt-1 text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            Txn ID: {selectedRecord.gatewayRefundId}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Booking Amount</span>
                  <span>₹{selectedRecord.requestedAmount}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Cancellation Deduction</span>
                  <span>-₹{selectedRecord.cancellationCharge}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Settlement Method</span>
                  <span>{selectedRecord.refundMethod}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Net Credited</span>
                  <span className="text-emerald-600">₹{selectedRecord.netRefund}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Sandbox Demonstration:</strong> Real-world payment gateway reversals take 3-5 banking business days. In LuckyTrip Sandbox, we simulate end-to-end settlement confirmation instantly.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
