import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import {
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  Store,
  Factory,
  CheckCircle2,
  ShieldCheck,
  Search,
  Truck,
  Filter,
  ArrowRight,
  Lock,
  Coins,
  HeartHandshake,
  UserCheck,
  Building2,
  KeyRound,
} from 'lucide-react';

export const HomeView: React.FC<{
  searchQuery: string;
  onOpenProductDetail: (p: Product) => void;
  onOpenMarginModal: (p: Product) => void;
}> = ({ searchQuery, onOpenProductDetail, onOpenMarginModal }) => {
  const {
    products,
    activeRole,
    currentUser,
    canAccessCatalog,
    switchRole,
    activeReferralReseller,
    setIsAuthModalOpen,
    setAuthModalType,
    setCurrentView,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'best_seller' | 'latest' | 'promo'>('all');

  const categories = [
    'Semua',
    'Herbal & Kesehatan',
    'Fashion Muslimah',
    'Fashion Pria',
  ];

  // Filter products by search, category, and tabs
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be approved by admin
      if (product.moderationStatus !== 'approved') return false;

      // Search match
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.producerName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'Semua' && product.category !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeFilterTab === 'best_seller' && product.soldCount < 300) {
        return false;
      }
      if (activeFilterTab === 'promo' && product.suggestedMargin < 25000) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, activeFilterTab]);

  return (
    <div className="space-y-8 pb-16">
      {/* Reseller Showcase Banner if accessing via referral link */}
      {activeReferralReseller ? (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-emerald-700/40">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                <Store size={14} />
                <span>TOKO MITRA RESMI EKSIS</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">
                {activeReferralReseller.profile.storeName}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                {activeReferralReseller.profile.bio ||
                  'Selamat datang di etalase resmi mitra kami. Seluruh produk dijamin halal & dipasok langsung dari produsen terverifikasi EKSIS.'}
              </p>
              <div className="text-xs text-emerald-200 flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-start pt-1">
                <span>👤 Mitra Reseller: {activeReferralReseller.user.name}</span>
                <span>📍 Asal: {activeReferralReseller.user.city}</span>
                <span>📱 WhatsApp: {activeReferralReseller.user.phone}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <span className="text-[11px] text-emerald-200 block">Jaminan Pelayanan Syariah</span>
              <div className="font-extrabold text-amber-300 text-sm mt-0.5">
                Amanah • Halal • Bebas Riba
              </div>
              <span className="text-[10px] text-emerald-100 block mt-1">
                Pengiriman langsung dari gudang produsen
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Modern Marketplace Hero Banner */
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-emerald-900/50">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 shadow-xs">
              <Sparkles size={14} />
              <span>Ekosistem Bisnis Syariah Terintegrasi</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              EKSIS: Ekosistem Bisnis Syariah
            </h1>

            <p className="text-xs sm:text-base text-slate-200 leading-relaxed">
              Platform terintegrasi yang menghubungkan Produsen UMKM, Member Reseller, Pemodal Syariah (Crowdfunding Sukuk), dan Tabungan Akhirat Yayasan Mahkota Cahaya Abadi dengan akad yang transparan, amanah, dan terbebas dari riba.
            </p>

            {/* Quick Ecosystem CTAs */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                id="hero-btn-reseller"
                onClick={() => {
                  setAuthModalType('register_reseller');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Store size={16} />
                <span>Daftar Member Reseller</span>
              </button>

              <button
                id="hero-btn-producer"
                onClick={() => {
                  setAuthModalType('register_producer');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Factory size={16} />
                <span>Daftar Jadi Produsen</span>
              </button>

              <button
                id="hero-btn-crowdfunding"
                onClick={() => setCurrentView('crowdfunding')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Coins size={16} />
                <span>Permodalan Syariah UMKM</span>
              </button>

              <button
                id="hero-btn-donation"
                onClick={() => setCurrentView('tabungan_akhirat')}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <HeartHandshake size={16} className="text-rose-400" />
                <span>Tabungan Akhirat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Pillars of EKSIS Ecosystem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div 
          onClick={() => {
            if (activeRole !== 'reseller') switchRole('reseller');
            else setCurrentView('reseller_dashboard');
          }}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Store size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Fee 2.5%</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Reseller Syariah</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Akses katalog eksklusif, fee admin otomatis 2,5%, atur margin suka-suka, dan pencairan saldo ke BSI 7198606228.
          </p>
        </div>

        <div 
          onClick={() => setCurrentView('crowdfunding')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Coins size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Mudharabah</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Permodalan Syariah</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Crowdfunding berbasis sukuk dan bagi hasil syariah untuk UMKM yang membutuhkan ekspansi modal kerja.
          </p>
        </div>

        <div 
          onClick={() => {
            if (activeRole !== 'investor') switchRole('investor');
            else setCurrentView('investor_dashboard');
          }}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Investasi</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Pilihan Investasi</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Wadah investasi bagi member dengan return bagi hasil kompetitif (15-22% p.a.) diawasi Dewan Pengawas Syariah.
          </p>
        </div>

        <div 
          onClick={() => setCurrentView('tabungan_akhirat')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <HeartHandshake size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">BSI 7149719649</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Tabungan Akhirat</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Infaq, sedekah, dan wakaf produktif disalurkan ke Yayasan Mahkota Cahaya Abadi dengan sertifikat digital.
          </p>
        </div>
      </div>

      {/* DEDICATED PRODUCER PARTNERSHIP & REGISTRATION SECTION (User Requirement) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Factory size={14} />
              <span>Kemitraan Produsen & Manufaktur UMKM</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              Punya Produk Berkualitas? Bergabung Jadi Mitra Produsen EKSIS
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Daftarkan brand atau pabrik Anda sekarang. Produk Anda langsung tampil di listing katalog reseller untuk dipasarkan oleh ribuan mitra secara luas, pembayaran pembeli ditampung ke rekening resmi BSI <strong>7198606228</strong>, dan Anda mendapatkan hak eksklusif mengajukan <strong>Permodalan Syariah (Crowdfunding Sukuk)</strong> untuk ekspansi usaha.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                <span className="text-emerald-400 font-bold text-xs block">✓ Listing Otomatis Reseller</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">Produk langsung bisa dipilih & dijual reseller.</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                <span className="text-amber-400 font-bold text-xs block">✓ Akses Permodalan Syariah</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">Fasilitas khusus crowdfunding modal kerja UMKM.</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                <span className="text-blue-400 font-bold text-xs block">✓ Notifikasi Pesanan Real-time</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">Notif instan saat ada pesanan via link reseller.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              id="home-btn-register-producer-banner"
              onClick={() => {
                setAuthModalType('register_producer');
                setIsAuthModalOpen(true);
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Factory size={18} />
              <span>Daftar Sebagai Produsen Sekarang</span>
            </button>
            <button
              onClick={() => {
                if (activeRole !== 'producer') switchRole('producer');
                else setCurrentView('producer_dashboard');
              }}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 text-center cursor-pointer"
            >
              Sudah Terdaftar? Buka Dashboard Produsen
            </button>
          </div>
        </div>
      </div>

      {/* CATALOG SECTION: Protected by User Rule */}
      {/* "Sembunyikan katalog produk. Hanya member reseller yang dapat mengakses." */}
      {!canAccessCatalog ? (
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <Lock size={32} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <span>Akses Terbatas: Khusus Member Reseller</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Katalog Produk Disembunyikan
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                Sesuai kebijakan perlindungan harga dan keadilan akad bisnis syariah di EKSIS, katalog produk lengkap beserta harga produsen & margin reseller <strong>hanya dapat diakses oleh Member Reseller terdaftar</strong>.
              </p>
            </div>

            {/* Quick Login / Register CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="btn-login-reseller-gate"
                onClick={() => {
                  setAuthModalType('login');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound size={16} />
                <span>Login Member Reseller</span>
              </button>

              <button
                id="btn-register-reseller-gate"
                onClick={() => {
                  setAuthModalType('register_reseller');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Store size={16} />
                <span>Daftar Reseller (Gratis)</span>
              </button>

              <button
                id="btn-register-producer-gate"
                onClick={() => {
                  setAuthModalType('register_producer');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600/80 hover:bg-blue-600 border border-blue-400/40 text-white text-sm font-semibold rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Factory size={16} />
                <span>Daftar Sebagai Produsen</span>
              </button>
            </div>

            {/* Instant Demo Switcher for User Convenience */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400">
              <span>Ingin mencoba tampilan katalog langsung?</span>
              <button
                onClick={() => switchRole('reseller')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer inline-flex items-center gap-1"
              >
                <UserCheck size={14} />
                <span>Buka Akses sebagai Reseller (Ahmad Fauzi)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ACCESSIBLE CATALOG FOR RESELLER / AUTHORIZED MEMBER */
        <div className="space-y-6">
          {/* Member Access Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <span className="font-bold text-sm block text-emerald-950">
                  Akses Terbuka: Member Reseller Aktif ({currentUser.name})
                </span>
                <span className="text-emerald-700">
                  Fee admin platform otomatis 2,5% telah diperhitungkan dari harga produsen sebagai nilai beli Anda.
                </span>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('reseller_dashboard')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store size={14} />
              <span>Kelola Toko Saya</span>
            </button>
          </div>

          {/* Category Pills Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Katalog Produk Resmi
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {filteredProducts.length} Produk Siap Dipasarkan
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Tabs: Terlaris, Terbaru, Promo */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeFilterTab === 'all'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Produk
              </button>
              <button
                onClick={() => setActiveFilterTab('best_seller')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  activeFilterTab === 'best_seller'
                    ? 'bg-white text-amber-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame size={13} className="text-amber-500" />
                <span>Produk Terlaris</span>
              </button>
              <button
                onClick={() => setActiveFilterTab('promo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  activeFilterTab === 'promo'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={13} className="text-rose-500" />
                <span>Margin Tinggi / Promo</span>
              </button>
            </div>

            <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
              💼 Klik <strong>“Jual Produk Ini”</strong> untuk menentukan harga jual & margin keuntungan Anda.
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Search size={40} className="mx-auto text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Coba kata kunci lain atau pilih kategori yang berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={onOpenProductDetail}
                  onOpenMarginModal={onOpenMarginModal}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
