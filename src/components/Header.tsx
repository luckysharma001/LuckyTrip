import React, { useState } from 'react';
import {
  Train,
  Plane,
  Building2,
  TramFront as Subway,
  Bus,
  Briefcase as Suitcase,
  Crown,
  Bell,
  HelpCircle,
  ShieldAlert,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Logo } from './Logo';
import { User, TravelTab } from '../types';

interface HeaderProps {
  currentTab: TravelTab | string;
  onSelectTab: (tab: TravelTab | string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
  onOpenNotifications,
  unreadNotificationsCount,
  isDemoMode,
  onToggleDemoMode,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [modeTooltip, setModeTooltip] = useState(false);

  const navItems = [
    { id: 'train', label: 'Trains', icon: Train },
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'hotel', label: 'Hotels', icon: Building2 },
    { id: 'metro', label: 'Metro', icon: Subway },
    { id: 'bus', label: 'Buses', icon: Bus },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Mode Transparency & Independent Platform Disclaimer Notice */}
      <div className="bg-[#07192F] text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] truncate">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Independent Travel Platform:
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Sample schedules & sandbox payments are simulated for safe demonstration.
            </span>
            <span className="text-slate-300 sm:hidden">Demo Sandbox active</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mode Switcher Toggle */}
            <button
              onClick={onToggleDemoMode}
              onMouseEnter={() => setModeTooltip(true)}
              onMouseLeave={() => setModeTooltip(false)}
              className={`relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                isDemoMode
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isDemoMode ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>DEMO MODE (Sandbox)</span>
                  <ToggleLeft className="w-3.5 h-3.5 text-amber-300" />
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>PRODUCTION MODE</span>
                  <ToggleRight className="w-3.5 h-3.5 text-emerald-300" />
                </>
              )}
            </button>

            {/* Quick Admin Shortcut */}
            <button
              onClick={() => onSelectTab('admin')}
              className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-sky-400" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Logo
            onClick={() => {
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Desktop Category Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0B2545] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Trips Shortcut */}
            <button
              onClick={() => onSelectTab('trips')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'trips'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Suitcase className="w-4 h-4 text-sky-600" />
              <span>My Trips</span>
            </button>

            {/* LuckyTrip Premium */}
            <button
              onClick={() => onSelectTab('premium')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                user?.isPremium
                  ? 'bg-amber-500 text-slate-900 shadow-xs hover:bg-amber-400'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200 hover:border-amber-300'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">LuckyTrip</span>
              <span>Premium</span>
              {user?.isPremium && (
                <span className="bg-slate-900 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Customer Support Shortcut */}
            <button
              onClick={() => onSelectTab('support')}
              className="hidden md:flex p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Help Centre & Support"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Account / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-500"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-none">
                      {user.role === 'admin' ? 'Administrator' : user.isPremium ? 'Premium Member' : 'Traveller'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      Profile & Saved Travellers
                    </button>

                    <button
                      onClick={() => {
                        onSelectTab('trips');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Suitcase className="w-3.5 h-3.5 text-slate-400" />
                      My Trips & History
                    </button>

                    <button
                      onClick={() => {
                        onSelectTab('refunds');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="w-3.5 text-center text-xs text-emerald-600 font-bold">₹</span>
                      Refund Tracking
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onSelectTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50/70 hover:bg-sky-100 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0B2545] text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / OTP</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-2 animate-in slide-in-from-top-1">
            <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1.5 rounded-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-[11px] font-semibold transition-all ${
                      isActive ? 'bg-[#0B2545] text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectTab('trips');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800"
              >
                <Suitcase className="w-4 h-4 text-sky-600" />
                My Trips
              </button>
              <button
                onClick={() => {
                  onSelectTab('refunds');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800"
              >
                <span className="font-bold text-emerald-600">₹</span>
                Refund Status
              </button>
              <button
                onClick={() => {
                  onSelectTab('support');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800"
              >
                <HelpCircle className="w-4 h-4 text-slate-600" />
                Help Centre
              </button>
              <button
                onClick={() => {
                  onSelectTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800"
              >
                <ShieldAlert className="w-4 h-4 text-sky-600" />
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
