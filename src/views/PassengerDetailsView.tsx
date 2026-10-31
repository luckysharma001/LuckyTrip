import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import { api } from '../api/client';
import { Passenger, SavedTraveller, User } from '../types';

interface PassengerDetailsViewProps {
  user: User | null;
  tripSummary: {
    type: 'train' | 'flight' | 'hotel' | 'metro' | 'bus';
    title: string;
    route: string;
    date: string;
    serviceNumber?: string;
    baseFarePerPassenger: number;
    taxesPerPassenger: number;
  };
  onProceedToCheckout: (data: {
    passengers: Passenger[];
    contactEmail: string;
    contactPhone: string;
    optInsurance: boolean;
  }) => void;
  onBack: () => void;
}

export const PassengerDetailsView: React.FC<PassengerDetailsViewProps> = ({
  user,
  tripSummary,
  onProceedToCheckout,
  onBack,
}) => {
  const [savedTravellers, setSavedTravellers] = useState<SavedTraveller[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      name: user?.name || 'Lucky Sharma',
      age: 28,
      gender: 'male',
      berthPreference: 'Side Lower',
      seatNumber: '29',
      coachNumber: 'B4',
    },
  ]);
  const [contactEmail, setContactEmail] = useState(user?.email || 'luckysharmadefence001@gmail.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98765 43210');
  const [optInsurance, setOptInsurance] = useState(true);

  useEffect(() => {
    api.getTravellers().then((res) => setSavedTravellers(res || []));
  }, []);

  const handleAddPassenger = () => {
    setPassengers([
      ...passengers,
      {
        name: '',
        age: 25,
        gender: 'male',
        berthPreference: 'No Preference',
        seatNumber: `${passengers.length + 1}B`,
        coachNumber: 'B4',
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, idx) => idx !== index));
  };

  const handleApplySavedTraveller = (index: number, traveller: SavedTraveller) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      name: traveller.fullName,
      age: traveller.age,
      gender: traveller.gender,
      berthPreference: traveller.berthPreference,
    };
    setPassengers(updated);
  };

  const handleUpdatePassenger = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToCheckout({
      passengers,
      contactEmail,
      contactPhone,
      optInsurance,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Traveller Details</h1>
          <p className="text-xs text-slate-500">
            {tripSummary.title} • {tripSummary.route} ({tripSummary.date})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Saved Travellers Quick Selection */}
        {savedTravellers.length > 0 && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5 mb-2">
              <UserCheck className="w-4 h-4 text-sky-700" />
              1-Click Autofill from Saved Travellers
            </span>
            <div className="flex flex-wrap gap-2">
              {savedTravellers.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleApplySavedTraveller(passengers.length - 1, st)}
                  className="bg-white hover:bg-sky-100 text-sky-900 text-xs font-semibold px-3 py-1.5 rounded-xl border border-sky-300 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3 h-3 text-sky-700" />
                  <span>{st.fullName} ({st.age}y, {st.gender})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Passenger Forms */}
        <div className="space-y-4">
          {passengers.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-600" />
                  Passenger {idx + 1}
                </span>

                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePassenger(idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={p.name}
                    onChange={(e) => handleUpdatePassenger(idx, 'name', e.target.value)}
                    placeholder="As shown on Government ID"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={p.age}
                    onChange={(e) => handleUpdatePassenger(idx, 'age', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={p.gender}
                    onChange={(e) => handleUpdatePassenger(idx, 'gender', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {tripSummary.type === 'train' && (
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Berth Preference</label>
                    <select
                      value={p.berthPreference || 'No Preference'}
                      onChange={(e) => handleUpdatePassenger(idx, 'berthPreference', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Lower">Lower Berth</option>
                      <option value="Middle">Middle Berth</option>
                      <option value="Upper">Upper Berth</option>
                      <option value="Side Lower">Side Lower (SL)</option>
                      <option value="Side Upper">Side Upper (SU)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add passenger button */}
          <button
            type="button"
            onClick={handleAddPassenger}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-sky-300 text-sky-800 hover:bg-sky-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Passenger</span>
          </button>
        </div>

        {/* Contact Information for E-Ticket & SMS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Booking Communication & E-Ticket Recipient
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Travel Insurance Option */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3">
          <input
            type="checkbox"
            id="insurance"
            checked={optInsurance}
            onChange={(e) => setOptInsurance(e.target.checked)}
            className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="insurance" className="cursor-pointer">
            <span className="text-xs font-bold text-emerald-900 block">
              Comprehensive Journey Protection (₹35 / traveller)
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Includes baggage delay compensation, medical emergencies, and travel cancellation coverage.
            </p>
          </label>
        </div>

        {/* Submit to Checkout */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0B2545] hover:bg-[#07192F] text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Payment Review ({passengers.length} Traveller{passengers.length > 1 ? 's' : ''})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
