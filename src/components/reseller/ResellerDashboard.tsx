import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo, downloadCsvFile, generateWhatsAppShareText } from '../../utils/formatters';
import { Product } from '../../types';
import {
  Store,
  TrendingUp,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Wallet,
  Share2,
  Users,
  FileText,
  HelpCircle,
  Settings,
  Plus,
  Tag,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ExternalLink,
  MessageCircle,
  Eye,
  Send,
  BarChart3,
  Calendar,
  Factory,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { BankAccountManager } from '../profile/BankAccountManager';

export const ResellerDashboard: React.FC<{
  onOpenMarginModal: (p: Product) => void;
  onOpenProductDetail: (p: Product) => void;
}> = ({ onOpenMarginModal, onOpenProductDetail }) => {
  const {
    currentUser,
    resellerProfiles,
    resellerProducts,
    products,
    orders,
    wallets,
    withdrawals,
    requestWithdrawal,
    recordShareClick,
    setTrackingOrderId,
    toggleResellerProductActive,
    resellerActiveTab,
    setResellerActiveTab,
  } = useApp();

  const [wdAmount, setWdAmount] = useState<number>(100000);
  const [wdBank, setWdBank] = useState<string>('BCA');
  const [wdAccNumber, setWdAccNumber] = useState<string>('1340982211');
  const [wdHolder, setWdHolder] = useState<string>(currentUser.name || 'Ahmad Fauzi');
  const [wdMessage, setWdMessage] = useState<string | null>(null);

  // Date filter for financial reports
  const [reportPeriod, setReportPeriod] = useState<'today' | 'this_week' | 'this_month' | 'this_year'>('this_month');

  const profile = resellerProfiles.find((p) => p.userId === currentUser.id) || {
    userId: currentUser.id,
    storeName: 'Toko Berkah Mandiri',
    referralCode: 'BERKAH-FAUZI',
    socialMediaUrl: 'https://instagram.com/berkahmandiri_store',
    bio: 'Reseller Resmi Ghinan Online Shop',
    totalSales: 48,
    totalProfit: 1250000,
    activeProductsCount: 8,
  };

  const wallet = wallets[currentUser.id] || {
    userId: currentUser.id,
    role: 'reseller',
    availableBalance: 840000,
    pendingBalance: 410000,
    withdrawnBalance: 500000,
    totalEarned: 1750000,
  };

  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  // Orders routed through this reseller
  const resellerOrders = useMemo(() => {
    return orders.filter((o) => o.resellerId === currentUser.id);
  }, [orders, currentUser.id]);

  // KPIs
  const myResellerProducts = useMemo(() => {
    return resellerProducts.filter((rp) => rp.resellerId === currentUser.id);
  }, [resellerProducts, currentUser.id]);

  const activeProductsCount = myResellerProducts.filter((rp) => rp.isActive).length;
  const totalOrdersCount = resellerOrders.length;
  const processingOrdersCount = resellerOrders.filter((o) => ['payment_received', 'processing', 'packing'].includes(o.orderStatus)).length;
  const shippingOrdersCount = resellerOrders.filter((o) => ['shipping', 'in_transit'].includes(o.orderStatus)).length;
  const completedOrdersCount = resellerOrders.filter((o) => o.orderStatus === 'completed').length;
  const totalOmzet = resellerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalKeuntungan = resellerOrders.reduce((sum, o) => sum + o.resellerTotalMargin, 0);

  // Financial reporting calculations
  const grossProfit = totalKeuntungan;
  const platformCost = resellerOrders.length * 5000;
  const netProfit = Math.max(0, grossProfit - platformCost);

  // Chart data for revenue & profit
  const chartData = [
    { name: 'Senin', omzet: 240000, margin: 65000 },
    { name: 'Selasa', omzet: 420000, margin: 110000 },
    { name: 'Rabu', omzet: 310000, margin: 80000 },
    { name: 'Kamis', omzet: 560000, margin: 145000 },
    { name: 'Jumat', omzet: 780000, margin: 190000 },
    { name: 'Sabtu', omzet: 920000, margin: 230000 },
    { name: 'Minggu', omzet: 640000, margin: 160000 },
  ];

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wdAmount < 50000) {
      setWdMessage('Minimal penarikan saldo adalah Rp50.000');
      return;
    }
    const success = requestWithdrawal(wdAmount, wdBank, wdAccNumber, wdHolder);
    if (success) {
      setWdMessage('Pengajuan penarikan saldo sebesar ' + formatRupiah(wdAmount) + ' berhasil dikirim ke Admin.');
    } else {
      setWdMessage('Saldo tersedia tidak mencukupi untuk nominal tersebut.');
    }
  };

  const handleExportExcel = () => {
    const headers = ['ID Pesanan', 'Tanggal', 'Nama Pelanggan', 'Kota', 'Total Transaksi', 'Margin Reseller', 'Status'];
    const rows = resellerOrders.map((o) => [
      o.id,
      formatDateIndo(o.createdAt),
      o.customerName,
      o.customerCity,
      o.totalAmount,
      o.resellerTotalMargin,
      o.orderStatus,
    ]);
    downloadCsvFile(`Laporan_Penjualan_Reseller_${profile.referralCode}.csv`, headers, rows);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Pending Approval Banner if Account is Still Pending (Poin 3) */}
      {currentUser.status === 'pending_approval' && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Status Akun: Menunggu Persetujuan Admin
            </h3>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Pendaftaran Anda sedang ditinjau oleh Super Admin. Setelah disetujui, Anda dapat mempublikasikan toko, menerima pesanan pelanggan, dan menarik keuntungan secara penuh.
            </p>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <Store size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {profile.storeName}
              </h1>
              <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {currentUser.status === 'active' ? 'Akun Aktif' : 'Menunggu Review'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kode Referral Resmi: <strong className="font-mono text-blue-700">{profile.referralCode}</strong> • {currentUser.city || 'Indonesia'}
            </p>
          </div>
        </div>

        {/* Quick Link Share & Store Preview */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/?ref=${profile.referralCode}`;
              navigator.clipboard.writeText(url);
              alert(`Link Toko Anda berhasil disalin!\n${url}`);
            }}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 size={14} />
            <span>Salin Link Toko Saya</span>
          </button>
        </div>
      </div>

      {/* 10 Navigation Menus (Poin 4) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-1.5 shadow-2xs overflow-x-auto scrollbar-none flex items-center gap-1">
        {[
          { id: 'overview', label: 'Ringkasan', icon: TrendingUp },
          { id: 'katalog', label: 'Katalog Produk', icon: ShoppingBag },
          { id: 'produk_saya', label: 'Produk Saya', icon: Package },
          { id: 'pesanan', label: 'Pesanan', icon: Truck },
          { id: 'pelanggan', label: 'Pelanggan', icon: Users },
          { id: 'bagikan', label: 'Bagikan Produk', icon: Share2 },
          { id: 'keuangan', label: 'Keuangan & Saldo', icon: Wallet },
          { id: 'laporan', label: 'Laporan', icon: FileText },
          { id: 'profil', label: 'Profil Toko', icon: Settings },
          { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = resellerActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setResellerActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS (Poin 4) */}
      {resellerActiveTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Produk Dipasarkan</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {activeProductsCount}
              </div>
              <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
                dari {products.length} produk mitra
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Total Pesanan</span>
              <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
                {totalOrdersCount}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {completedOrdersCount} pesanan selesai
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Total Omzet Penjualan</span>
              <div className="text-base sm:text-xl font-black text-slate-900 mt-1 truncate">
                {formatRupiah(totalOmzet)}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                Transaksi riil pelanggan
              </span>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl shadow-xs">
              <span className="text-[11px] text-blue-200 font-medium block">Saldo Tersedia</span>
              <div className="text-base sm:text-xl font-black text-amber-300 mt-1 truncate">
                {formatRupiah(wallet.availableBalance)}
              </div>
              <span className="text-[10px] text-blue-100 mt-0.5 block">
                Pending: {formatRupiah(wallet.pendingBalance)}
              </span>
            </div>
          </div>

          {/* Quick Status Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] text-amber-800 font-bold block">PESANAN DIPROSES</span>
              <span className="text-lg font-black text-amber-900">{processingOrdersCount}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <span className="text-[10px] text-blue-800 font-bold block">DALAM PENGIRIMAN</span>
              <span className="text-lg font-black text-blue-900">{shippingOrdersCount}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-bold block">SELESAI & CAIR</span>
              <span className="text-lg font-black text-emerald-900">{completedOrdersCount}</span>
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Grafik Tren Penjualan & Margin Keuntungan</h3>
                <p className="text-[11px] text-slate-400">Pertumbuhan omzet vs laba bersih reseller 7 hari terakhir</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                +24% Minggu Ini
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `Rp${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val)), '']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="omzet" name="Omzet Penjualan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="margin" name="Keuntungan Bersih" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KATALOG PRODUK RESELLER (Poin 5) */}
      {resellerActiveTab === 'katalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Katalog Produk Terhubung dari Produsen</h2>
              <p className="text-xs text-slate-500">
                Pilih produk bermutu tinggi yang didaftarkan langsung oleh produsen mitra EKSIS untuk Anda jual dengan margin harga Anda sendiri.
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-blue-50 text-blue-800 font-bold rounded-full border border-blue-200 self-start sm:self-auto">
              {products.length} Produk Tersedia
            </span>
          </div>

          {/* Connected Producer Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                <Store size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>Produk Produsen Langsung Tersinkronisasi</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Otomatis Aktif</span>
                </h3>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  Setiap kali mitra produsen me-listing produk baru, produk otomatis muncul di sini. Cukup klik <strong>"Jual Produk Ini"</strong>, tentukan margin keuntungan Anda, lalu bagikan link referral toko Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => {
              const myRp = myResellerProducts.find((rp) => rp.productId === prod.id);
              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3.5 shadow-2xs hover:border-blue-300 transition-all"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-24 h-24 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-0.5">
                        <span className="truncate max-w-[130px] font-semibold text-slate-700 flex items-center gap-1">
                          <Factory size={12} className="text-blue-600 shrink-0" />
                          <span className="truncate">{prod.producerName}</span>
                        </span>
                        <span className="font-semibold text-emerald-600">
                          Stok: {prod.stock} unit
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {prod.name}
                      </h4>
                      <div className="mt-1.5 grid grid-cols-2 gap-1 text-xs">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Modal Produsen:</span>
                          <span className="font-bold text-slate-800">{formatRupiah(prod.basePrice)}</span>
                        </div>
                        <div className="bg-blue-50 p-1.5 rounded border border-blue-100">
                          <span className="text-[10px] text-blue-600 block">Potensi Margin:</span>
                          <span className="font-bold text-blue-800">+{formatRupiah(prod.suggestedMargin)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onOpenMarginModal(prod)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          myRp
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Tag size={13} />
                        <span>{myRp ? 'Ubah Harga & Margin Jual (Aktif)' : 'Jual Produk Ini (+ Tambah ke Toko)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUK SAYA (Poin 6) */}
      {resellerActiveTab === 'produk_saya' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Produk Pilihan Saya ({myResellerProducts.length})</h2>
              <p className="text-xs text-slate-500">
                Kelola harga jual, status penayangan, pantau views, shares, dan performa penjualan masing-masing produk.
              </p>
            </div>
            <button
              onClick={() => setResellerActiveTab('katalog')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah Produk</span>
            </button>
          </div>

          {myResellerProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <Package size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Anda belum memilih produk untuk dijual.</p>
              <button
                onClick={() => setResellerActiveTab('katalog')}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
              >
                Buka Katalog Produk
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myResellerProducts.map((rp) => {
                const prod = products.find((p) => p.id === rp.productId);
                if (!prod) return null;
                return (
                  <div
                    key={rp.id}
                    className="bg-white rounded-xl border border-slate-200/90 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                          {prod.name}
                        </h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                          <span>Modal: <strong>{formatRupiah(prod.basePrice)}</strong></span>
                          <span>Harga Jual: <strong className="text-blue-700">{formatRupiah(rp.customSellingPrice)}</strong></span>
                          <span>Margin: <strong className="text-emerald-600">+{formatRupiah(rp.calculatedMargin)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Performance metrics & Controls */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1" title="Dilihat">
                          <Eye size={13} /> {rp.viewsCount}
                        </span>
                        <span className="flex items-center gap-1" title="Dibagikan">
                          <Share2 size={13} /> {rp.sharesCount}
                        </span>
                        <span className="font-bold text-blue-700" title="Terjual">
                          {rp.soldCount} terjual
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleResellerProductActive(prod.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            rp.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {rp.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                        <button
                          onClick={() => onOpenMarginModal(prod)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
                        >
                          Atur
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PESANAN RESELLER (Poin 8) */}
      {resellerActiveTab === 'pesanan' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Pesanan Masuk dari Pelanggan Anda</h2>
            <p className="text-xs text-slate-500">
              Setiap pesanan yang dibeli via link referral Anda otomatis tercatat dan margin langsung dialokasikan ke dompet Anda.
            </p>
          </div>

          {resellerOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <Truck size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Belum ada pesanan masuk melalui link Anda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">#{order.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatDateIndo(order.createdAt)}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-800">{order.customerName} ({order.customerCity})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>{it.quantity}x {it.productName}</span>
                        <span className="font-semibold">{formatRupiah(it.sellingPrice * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Margin Bersih Anda:</span>
                      <span className="font-black text-emerald-600 text-sm">
                        +{formatRupiah(order.resellerTotalMargin)}
                      </span>
                    </div>
                    <button
                      onClick={() => setTrackingOrderId(order.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Truck size={13} />
                      <span>Tracking Ekspedisi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PELANGGAN (Poin 4) */}
      {resellerActiveTab === 'pelanggan' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Database Pelanggan Reseller</h2>
            <p className="text-xs text-slate-500">
              Daftar kontak pembeli yang pernah bertransaksi di toko Anda untuk follow-up dan repeat order.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Nama Pelanggan</th>
                  <th className="p-3">Kota / Wilayah</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Total Pesanan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resellerOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{o.customerName}</td>
                    <td className="p-3 text-slate-600">{o.customerCity}</td>
                    <td className="p-3 font-mono text-blue-700">{o.customerPhone}</td>
                    <td className="p-3 font-semibold">{formatRupiah(o.totalAmount)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          const wa = `https://api.whatsapp.com/send?phone=${o.customerPhone.replace(/^0/, '62')}&text=Assalamu%27alaikum%20kak%20${encodeURIComponent(o.customerName)}%2C%20terima%20kasih%20telah%20berbelanja%20di%20${encodeURIComponent(profile.storeName)}.`;
                          window.open(wa, '_blank');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[11px] font-bold hover:bg-emerald-700 cursor-pointer inline-flex items-center gap-1"
                      >
                        <MessageCircle size={12} />
                        <span>Chat WA</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: BAGIKAN PRODUK (Poin 7) */}
      {resellerActiveTab === 'bagikan' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Pusat Promosi & Share Produk</h2>
            <p className="text-xs text-slate-500">
              Pilih produk dan bagikan ke media sosial dengan link toko yang otomatis merekam komisi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => {
              const url = `${window.location.origin}/?ref=${profile.referralCode}&product=${p.id}`;
              const myRp = myResellerProducts.find((rp) => rp.productId === p.id);
              const price = myRp ? myRp.customSellingPrice : p.recommendedPrice;

              return (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex gap-3">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover border" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{p.name}</h4>
                      <div className="text-blue-700 font-black text-sm mt-0.5">{formatRupiah(price)}</div>
                      <span className="text-[10px] text-slate-400">Produsen: {p.producerName}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-[11px] font-mono text-slate-600 truncate border">
                    {url}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        recordShareClick(p.id, 'whatsapp');
                        const msg = generateWhatsAppShareText(p.name, price, p.description, url);
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      <span>Share WA</span>
                    </button>
                    <button
                      onClick={() => {
                        recordShareClick(p.id, 'copy_link');
                        navigator.clipboard.writeText(url);
                        alert('Link referral produk berhasil disalin!');
                      }}
                      className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy size={14} />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: KEUANGAN RESELLER & TARIK SALDO (Poin 16) */}
      {resellerActiveTab === 'keuangan' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Manajemen Keuangan & Saldo Reseller</h2>
            <p className="text-xs text-slate-500">
              Pantau arus kas pendapatan penjualan, keuntungan cair, komisi tertahan, dan ajukan penarikan dana ke rekening Anda.
            </p>
          </div>

          {/* Saldo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">SALDO TERSEDIA (BISA DITARIK)</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {formatRupiah(wallet.availableBalance)}
              </div>
              <span className="text-[11px] text-emerald-700 mt-1 block">
                Dana dari pesanan yang sudah berstatus selesai
              </span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800 block">SALDO PENDING (TERTAHAN)</span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {formatRupiah(wallet.pendingBalance)}
              </div>
              <span className="text-[11px] text-amber-700 mt-1 block">
                Pesanan sedang dalam proses pengiriman
              </span>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">TOTAL TELAH DITARIK</span>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {formatRupiah(wallet.withdrawnBalance)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Akumulasi pencairan ke rekening bank
              </span>
            </div>
          </div>

          {/* Rekening Pencairan Dana Syariah */}
          <BankAccountManager
            title="Rekening Pencairan Komisi Reseller"
            subtitle="Rekening Bank Syariah Indonesia (BSI) atau bank lainnya yang digunakan untuk pengiriman saldo penarikan komisi."
            onSelectAccount={(acc) => {
              setWdBank(acc.bankName);
              setWdAccNumber(acc.accountNumber);
              setWdHolder(acc.accountHolder);
            }}
          />

          {/* Tarik Saldo Form & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Tarik Saldo */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wallet size={16} className="text-blue-600" />
                <span>Formulir Penarikan Saldo (Withdrawal)</span>
              </h3>

              {wdMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl">
                  {wdMessage}
                </div>
              )}

              <form onSubmit={handleWithdrawalSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nominal Penarikan (Minimal Rp50.000)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    min={50000}
                    max={wallet.availableBalance}
                    required
                    value={wdAmount}
                    onChange={(e) => setWdAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bank</label>
                    <input
                      type="text"
                      required
                      value={wdBank}
                      onChange={(e) => setWdBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      required
                      value={wdAccNumber}
                      onChange={(e) => setWdAccNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    required
                    value={wdHolder}
                    onChange={(e) => setWdHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={wallet.availableBalance < 50000}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                >
                  Ajukan Penarikan Dana
                </button>
              </form>
            </div>

            {/* Riwayat Penarikan Dana */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Penarikan Dana</h3>
              {userWithdrawals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">Belum ada riwayat penarikan dana.</div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {userWithdrawals.map((w) => (
                    <div key={w.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">{formatRupiah(w.amount)}</span>
                        <span className="text-[11px] text-slate-400">
                          {w.bankName} - {w.bankAccountNumber} ({w.requestDate})
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {w.status === 'completed' ? 'Berhasil' : w.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: LAPORAN KEUANGAN (Poin 17) */}
      {resellerActiveTab === 'laporan' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Laporan Keuangan Otomatis</h2>
              <p className="text-xs text-slate-500">
                Pencatatan akuntansi penjualan, HPP modal, omzet, dan laba bersih reseller.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintReport}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>Cetak PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText size={13} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit text-xs font-semibold">
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: 'this_week', label: 'Minggu Ini' },
              { id: 'this_month', label: 'Bulan Ini' },
              { id: 'this_year', label: 'Tahun Ini' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setReportPeriod(p.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  reportPeriod === p.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Financial Statement Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Ikhtisar Laba Rugi Reseller ({reportPeriod})</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between font-bold text-slate-800">
                <span>Total Omzet Penjualan Produk</span>
                <span>{formatRupiah(totalOmzet)}</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-600">
                <span>Harga Pokok Penjualan (HPP Modal Produsen)</span>
                <span className="text-rose-600 font-semibold">- {formatRupiah(totalOmzet - grossProfit)}</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold text-blue-800 bg-blue-50/50 px-2 rounded">
                <span>Laba Kotor (Gross Profit Reseller)</span>
                <span>{formatRupiah(grossProfit)}</span>
              </div>
              <div className="py-2.5 flex justify-between text-slate-600">
                <span>Biaya Layanan Platform Aplikasi</span>
                <span className="text-rose-600 font-semibold">- {formatRupiah(platformCost)}</span>
              </div>
              <div className="py-3 flex justify-between font-black text-sm text-emerald-700 bg-emerald-50 px-2 rounded-lg">
                <span>Keuntungan Bersih (Net Profit)</span>
                <span>{formatRupiah(netProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: PROFIL TOKO */}
      {resellerActiveTab === 'profil' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-xl space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Profil Toko & Pengaturan Reseller</h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Nama Toko</span>
              <div className="font-bold text-slate-800">{profile.storeName}</div>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Kode Referral Reseller</span>
              <div className="font-mono font-bold text-blue-700">{profile.referralCode}</div>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Media Sosial</span>
              <div className="text-slate-700">{profile.socialMediaUrl || 'Belum diisi'}</div>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Bio / Slogan</span>
              <div className="text-slate-700">{profile.bio}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: BANTUAN */}
      {resellerActiveTab === 'bantuan' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-900 text-sm">Pusat Bantuan & Panduan Reseller UMKM</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border">
              <h4 className="font-bold text-slate-900 mb-1">Bagaimana alur reseller tanpa stok?</h4>
              <p>
                Anda cukup memilih produk di katalog, menentukan harga jual, dan membagikan link ke calon pembeli. Saat ada pesanan, pesanan diteruskan langsung ke warehouse produsen untuk dikemas dan dikirim.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border">
              <h4 className="font-bold text-slate-900 mb-1">Kapan keuntungan/margin saya bisa ditarik?</h4>
              <p>
                Margin otomatis dicatat ke Saldo Pending saat pesanan dibuat, dan pindah ke Saldo Tersedia setelah pesanan sampai di tujuan pelanggan dan dinyatakan selesai.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
