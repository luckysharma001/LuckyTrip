import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Crown,
  Users,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  Mail,
  Phone,
  Save,
} from 'lucide-react';
import { api, clearStoredToken } from '../api/client';
import { User, SavedTraveller } from '../types';

interface ProfileViewProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenAuth,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedTravellers, setSavedTravellers] = useState<SavedTraveller[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Add traveller modal/form
  const [isAddingTraveller, setIsAddingTraveller] = useState(false);
  const [travName, setTravName] = useState('');
  const [travAge, setTravAge] = useState(28);
  const [travGender, setTravGender] = useState<'male' | 'female' | 'other'>('male');
  const [travBerth, setTravBerth] = useState('Lower');
  const [travIdType, setTravIdType] = useState('Aadhaar / Gov ID');
  const [travIdNum, setTravIdNum] = useState('•••• •••• 1234');

  // Delete account confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      api.getTravellers().then((res) => setSavedTravellers(res || []));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-black text-slate-900">Sign in to manage your profile</h2>
        <p className="text-xs text-slate-500">
          Save co-passengers for faster checkouts and view your unified travel history.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold"
        >
          Sign In / OTP
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg(null);
    try {
      const res = await api.updateProfile({ name, email, phone });
      onUpdateUser(res.user);
      setSaveMsg('Profile saved successfully!');
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTraveller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.addTraveller({
        fullName: travName,
        age: travAge,
        gender: travGender,
        berthPreference: travBerth,
        idType: travIdType,
        idNumber: travIdNum,
      });
      setSavedTravellers([...savedTravellers, res]);
      setIsAddingTraveller(false);
      setTravName('');
    } catch {
      // ignore
    }
  };

  const handleDeleteTraveller = async (id: string) => {
    try {
      await api.deleteTraveller(id);
      setSavedTravellers(savedTravellers.filter((t) => t.id !== id));
    } catch {
      // ignore
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      clearStoredToken();
      onLogout();
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-[#0B2545] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{user.name}</h1>
              {user.isPremium && (
                <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-sky-300 font-mono">{user.phone}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 w-fit"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>

      {saveMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* Profile Editor Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
          Account & Contact Information
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Update Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved Travellers Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              Saved Travellers List
            </h2>
            <p className="text-xs text-slate-500">Auto-fill passenger forms with 1-click</p>
          </div>
          <button
            onClick={() => setIsAddingTraveller(true)}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Traveller</span>
          </button>
        </div>

        {isAddingTraveller && (
          <form onSubmit={handleAddTraveller} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-800">Add New Co-Passenger</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={travName}
                  onChange={(e) => setTravName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  value={travAge}
                  onChange={(e) => setTravAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={travGender}
                  onChange={(e) => setTravGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTraveller(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#0B2545] text-white font-bold"
              >
                Save Traveller
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-100">
          {savedTravellers.map((st) => (
            <div key={st.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{st.fullName}</span>
                <span className="text-slate-500 ml-2">({st.age} yrs, {st.gender})</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Berth: {st.berthPreference} • ID: {st.idType} ({st.idNumber})
                </span>
              </div>
              <button
                onClick={() => handleDeleteTraveller(st.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Deletion & Privacy Policy Compliance */}
      <div className="bg-red-50/50 rounded-3xl p-6 border border-red-200 space-y-3">
        <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
          Data Privacy & Account Deletion
        </h3>
        <p className="text-xs text-red-700 leading-relaxed">
          Under Indian Digital Personal Data Protection (DPDP) guidelines, you have the right to request
          permanent erasure of all stored passenger records and account sessions.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
        >
          Request Account Deletion
        </button>
      </div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-black text-slate-900">Permanently Delete Account?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action will permanently purge your saved travellers, session tokens, and active profile from LuckyTrip's database.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-1/2 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-1/2 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Yes, Delete Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
