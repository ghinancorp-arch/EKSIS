import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GhinanLogo } from './GhinanLogo';
import {
  Search,
  ShoppingCart,
  Bell,
  User as UserIcon,
  Store,
  Factory,
  ShieldAlert,
  Package,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Coins,
  Heart,
  TrendingUp,
  Building2,
} from 'lucide-react';

export const Navbar: React.FC<{
  onOpenNotifications: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}> = ({ onOpenNotifications, searchQuery: propSearchQuery, setSearchQuery: propSetSearchQuery }) => {
  const {
    currentUser,
    activeRole,
    currentView,
    setCurrentView,
    cartTotalCount,
    setIsCartDrawerOpen,
    activeReferralReseller,
    setActiveReferralCode,
    notifications,
    setIsAuthModalOpen,
    setAuthModalType,
    searchQuery: ctxSearchQuery,
    setSearchQuery: ctxSetSearchQuery,
  } = useApp();

  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : ctxSearchQuery;
  const setSearchQuery = propSetSearchQuery !== undefined ? propSetSearchQuery : ctxSetSearchQuery;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadNotifCount = notifications.filter(
    (n) => !n.read && (n.targetRole === 'all' || n.targetRole === activeRole)
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Reseller Store Ribbon if buyer is accessing via referral */}
      {activeReferralReseller && (
        <div
          id="active-referral-ribbon"
          className="bg-blue-900 text-blue-50 px-4 py-2 text-xs flex items-center justify-between shadow-inner"
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium">
                Toko Mitra Resmi:{' '}
                <strong className="text-amber-300 font-bold">
                  {activeReferralReseller.profile.storeName}
                </strong>{' '}
                ({activeReferralReseller.user.name} - {activeReferralReseller.user.city})
              </span>
            </div>
            <button
              onClick={() => setActiveReferralCode(null)}
              className="text-blue-200 hover:text-white underline cursor-pointer text-[11px]"
            >
              Belanja di Katalog Umum
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Logo */}
          <div className="shrink-0">
            <GhinanLogo
              size="md"
              showTagline={false}
              onClick={() => setCurrentView('home')}
            />
          </div>

          {/* Search bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Cari produk muslim, herbal, busana, kosmetik halal..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'home') setCurrentView('home');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-full text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dashboard Quick link if in reseller/producer/admin mode */}
            {activeRole === 'reseller' && (
              <button
                id="btn-nav-reseller-dash"
                onClick={() => setCurrentView('reseller_dashboard')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  currentView === 'reseller_dashboard'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Store size={15} className="text-blue-600" />
                <span>Dashboard Reseller</span>
              </button>
            )}

            {activeRole === 'producer' && (
              <button
                id="btn-nav-producer-dash"
                onClick={() => setCurrentView('producer_dashboard')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  currentView === 'producer_dashboard'
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Factory size={15} className="text-amber-600" />
                <span>Dashboard Produsen</span>
              </button>
            )}

            {activeRole === 'admin' && (
              <button
                id="btn-nav-admin-dash"
                onClick={() => setCurrentView('admin_dashboard')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  currentView === 'admin_dashboard'
                    ? 'bg-rose-100 text-rose-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert size={15} className="text-rose-600" />
                <span>Super Admin</span>
              </button>
            )}

            {/* Navigation links */}
            <button
              onClick={() => setCurrentView('home')}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                currentView === 'home'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Katalog
            </button>

            {/* Permodalan & Crowdfunding */}
            <button
              id="btn-nav-crowdfunding"
              onClick={() => setCurrentView('crowdfunding')}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                currentView === 'crowdfunding'
                  ? 'text-emerald-800 bg-emerald-100/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins size={14} className="text-amber-500" />
              <span>Permodalan</span>
            </button>

            {/* Tabungan Akhirat */}
            <button
              id="btn-nav-tabungan-akhirat"
              onClick={() => setCurrentView('tabungan_akhirat')}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                currentView === 'tabungan_akhirat'
                  ? 'text-rose-700 bg-rose-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart size={14} className="text-rose-500" />
              <span>Tabungan Akhirat</span>
            </button>

            {/* Riwayat Pesanan */}
            <button
              onClick={() => setCurrentView('my_orders')}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                currentView === 'my_orders'
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pesanan
            </button>

            {/* Cart Icon */}
            <button
              id="btn-open-cart"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-slate-700 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Keranjang Belanja"
            >
              <ShoppingCart size={20} />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-700 hover:text-blue-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifikasi"
            >
              <Bell size={20} />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Registration CTA Buttons (if customer) */}
            {activeRole === 'customer' && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  id="btn-register-reseller-nav"
                  onClick={() => {
                    setAuthModalType('register_reseller');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer transition-all"
                >
                  Daftar Reseller
                </button>
                <button
                  id="btn-register-producer-nav"
                  onClick={() => {
                    setAuthModalType('register_producer');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer shadow-xs transition-all"
                >
                  Daftar Produsen
                </button>
              </div>
            )}

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div
                className="flex items-center gap-1.5 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                onClick={() => {
                  if (activeRole === 'reseller') setCurrentView('reseller_dashboard');
                  else if (activeRole === 'producer') setCurrentView('producer_dashboard');
                  else if (activeRole === 'admin') setCurrentView('admin_dashboard');
                  else setCurrentView('my_orders');
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                />
                <div className="hidden xl:block text-left text-xs leading-none">
                  <div className="font-semibold text-slate-800 truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {activeRole === 'admin'
                      ? 'Admin'
                      : activeRole === 'producer'
                      ? 'Produsen'
                      : activeRole === 'reseller'
                      ? 'Reseller'
                      : 'Pembeli'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Cari produk muslim, herbal, busana..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'home') setCurrentView('home');
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 text-slate-800 rounded-full text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1 bg-white text-xs">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3.5 py-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-700"
            >
              Katalog Marketplace (Reseller)
            </button>
            <button
              onClick={() => {
                setCurrentView('crowdfunding');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 rounded-lg hover:bg-slate-100 font-semibold text-emerald-800 flex items-center justify-between"
            >
              <span>Permodalan Syariah & Crowdfunding</span>
              <Coins size={15} className="text-amber-500" />
            </button>
            <button
              onClick={() => {
                setCurrentView('tabungan_akhirat');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 rounded-lg hover:bg-slate-100 font-semibold text-rose-700 flex items-center justify-between"
            >
              <span>Tabungan Akhirat (BSI 7149719649)</span>
              <Heart size={15} className="text-rose-500" />
            </button>
            <button
              onClick={() => {
                setCurrentView('investor_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 flex items-center justify-between"
            >
              <span>Portofolio Investasi Saya</span>
              <TrendingUp size={15} className="text-emerald-600" />
            </button>
            <button
              onClick={() => {
                setCurrentView('my_orders');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3.5 py-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-700"
            >
              Lacak Pesanan Saya
            </button>
            <div className="border-t border-slate-100 pt-2 space-y-1">
              <button
                onClick={() => {
                  setAuthModalType('register_reseller');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-blue-700 font-semibold flex items-center justify-between"
              >
                <span>Daftar Menjadi Reseller</span>
                <Store size={16} />
              </button>
              <button
                onClick={() => {
                  setAuthModalType('register_producer');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-rose-600 font-semibold flex items-center justify-between"
              >
                <span>Daftar Menjadi Produsen</span>
                <Factory size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
