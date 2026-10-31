import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Landmark, Smartphone, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingTitle: string;
  onSuccess: (paymentDetails: { paymentId: string; method: string }) => void;
  onFailure?: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  bookingTitle,
  onSuccess,
  onFailure,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('luckysharma@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFailure) {
        if (onFailure) {
          onFailure('Payment declined by issuing bank (Sandbox Test Simulation)');
        }
      } else {
        const paymentId = `DEMO-PAY-${Date.now().toString().slice(-6)}`;
        const methodName =
          method === 'upi' ? `UPI (${upiId})` : method === 'card' ? 'Visa Card (•••• 4242)' : `Net Banking (${selectedBank})`;
        onSuccess({ paymentId, method: methodName });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Gateway Header */}
        <div className="bg-[#0B2545] text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight">LuckyTrip Pay</span>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                SANDBOX SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 truncate max-w-xs">{bookingTitle}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-300">Total Payable</span>
            <p className="text-xl font-black text-emerald-400">₹{amount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setMethod('upi')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              method === 'upi' ? 'bg-white text-sky-700 border-b-2 border-sky-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            UPI / QR
          </button>
          <button
            onClick={() => setMethod('card')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              method === 'card' ? 'bg-white text-sky-700 border-b-2 border-sky-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cards
          </button>
          <button
            onClick={() => setMethod('netbanking')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              method === 'netbanking' ? 'bg-white text-sky-700 border-b-2 border-sky-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Net Banking
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {method === 'upi' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-white p-2 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-20 h-20 text-slate-800" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-900">Scan & Pay via any UPI App</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Instant Auto-Confirmation
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Or Enter Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="username@bank"
                />
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number (Sandbox Test Card)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Bank</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      selectedBank === b ? 'border-sky-600 bg-sky-50 text-sky-800' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sandbox controls for QA & resilience evaluation */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Simulate Payment Failure?
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className={`w-2/3 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                simulateFailure ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authorizing Sandbox Payment...
                </>
              ) : simulateFailure ? (
                'Trigger Test Decline'
              ) : (
                `Pay ₹${amount.toLocaleString('en-IN')} (Sandbox Test)`
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted Razorpay Sandbox Gateway • No Real Money Charged</span>
          </div>
        </div>
      </div>
    </div>
  );
};
