import React, { useState } from 'react';
import { X, Mail, Phone, Lock, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { api, setStoredToken } from '../api/client';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'IDENTIFIER' | 'OTP'>('IDENTIFIER');
  const [identifier, setIdentifier] = useState('luckysharmadefence001@gmail.com');
  const [name, setName] = useState('Lucky Sharma');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hintOtp, setHintOtp] = useState<string | null>('123456');

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.sendOtp(identifier.trim());
      setHintOtp(res.hintOtp || '123456');
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.verifyOtp(identifier.trim(), otp.trim(), name);
      setStoredToken(res.token);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0B2545] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-black tracking-tight">Lucky<span className="text-sky-400">Trip</span></span>
            <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
              SECURE ACCESS
            </span>
          </div>
          <h3 className="text-lg font-bold">
            {step === 'IDENTIFIER' ? 'Sign In or Create Account' : 'Verify One-Time Password'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {step === 'IDENTIFIER'
              ? 'Access unified bookings, saved travellers, and real-time journey tracking.'
              : `Enter the 6-digit code sent to ${identifier}`}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {step === 'IDENTIFIER' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name (Optional for new users)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lucky Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? 'Sending Code...' : 'Get Verification Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between text-xs text-sky-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Demo Mode Sandbox OTP
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('luckysharmadefence001@gmail.com');
                    setName('Lucky Sharma');
                  }}
                  className="text-xs font-bold text-sky-700 underline hover:text-sky-900"
                >
                  Fill Demo User
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-mono tracking-widest text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    required
                  />
                </div>
              </div>

              {hintOtp && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Sandbox OTP: <strong>{hintOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(hintOtp)}
                    className="text-xs font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-300 px-2 py-1 rounded-md"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('IDENTIFIER')}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <p className="mt-4 text-[10px] text-slate-400 text-center leading-normal">
            By proceeding, you agree to LuckyTrip's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
