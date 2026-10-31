import React from 'react';
import { ShieldCheck, Heart, Mail, Phone, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#07192F] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light size="lg" onClick={() => onNavigate('home')} />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              LuckyTrip is an independent, unified multi-modal travel platform built to simplify
              journey discovery, reservations, transit planning, and expense tracking under one roof.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-sky-400">
              <span className="flex items-center gap-1 bg-sky-950/80 px-3 py-1.5 rounded-lg border border-sky-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Multi-Modal Transit
              </span>
            </div>
          </div>

          {/* Travel Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Travel Modules</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('train')} className="hover:text-white transition-colors">
                  Train Search & Live Seat Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('flight')} className="hover:text-white transition-colors">
                  Domestic & International Flights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hotel')} className="hover:text-white transition-colors">
                  Hotels, Resorts & Homestays
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('metro')} className="hover:text-white transition-colors">
                  City Metro Transit & Route Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bus')} className="hover:text-white transition-colors">
                  Intercity Electric & Volvo Buses
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Trips & Support */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Trips & Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('trips')} className="hover:text-white transition-colors">
                  My Trips Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refunds')} className="hover:text-white transition-colors">
                  Refund Tracking & Timeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('premium')} className="hover:text-white transition-colors flex items-center gap-1 text-amber-400 font-semibold">
                  <span>LuckyTrip Premium (₹999/yr)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Help Centre & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Support Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Legal & Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About LuckyTrip
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors text-sky-400">
                  Operations Admin Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Independent Platform Disclaimer (Crucial requirement from prompt) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 text-xs text-slate-400 leading-relaxed mb-8">
          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Important Independent Platform Disclaimer:
          </p>
          <p className="text-[11px] text-slate-400">
            LuckyTrip is an independent product concept and travel technology platform. LuckyTrip is not affiliated with, endorsed by, or an official entity of Indian Railways, IRCTC, or any government metro authority. In Demo Sandbox mode, all booking reference numbers (prefixed with DEMO-) and tickets are simulated for application demonstration and workflow testing, and do not constitute valid travel authority. Production bookings require authorized partner provider API credentials.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LuckyTrip Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care for seamless travel across India & beyond</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
