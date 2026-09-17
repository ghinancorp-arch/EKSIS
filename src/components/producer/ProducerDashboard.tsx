import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo, downloadCsvFile } from '../../utils/formatters';
import { Product } from '../../types';
import {
  Factory,
  Package,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Search,
  Eye,
  Edit,
  Download,
  Building2,
  X,
  Coins,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BankAccountManager } from '../profile/BankAccountManager';

export const ProducerDashboard: React.FC = () => {
  const {
    currentUser,
    producerProfiles,
    products,
    addProduct,
    updateProductStock,
    orders,
    updateOrderStatus,
    wallets,
    withdrawals,
    requestWithdrawal,
    resellerProducts,
    setTrackingOrderId,
    producerActiveTab,
    setProducerActiveTab,
    setCurrentView,
  } = useApp();

  const profile = producerProfiles.find((p) => p.userId === currentUser.id) || {
    userId: currentUser.id,
    companyName: 'CV Ghinan Herbal Nusantara',
    businessCategory: 'Herbal & Kesehatan',
    nibOrLegalNumber: 'NIB-912000219481',
    address: 'Kawasan Industri Halal, Bandung',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '7192837465',
    bankAccountHolder: 'CV Ghinan Herbal Nusantara',
    totalProductsSold: 1420,
    activeResellersCount: 38,
  };

  const wallet = wallets[currentUser.id] || {
    userId: currentUser.id,
    role: 'producer',
    availableBalance: 4650000,
    pendingBalance: 1200000,
    withdrawnBalance: 15000000,
    totalEarned: 20850000,
  };

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);
  const [inputResiOrderId, setInputResiOrderId] = useState<string | null>(null);
  const [resiNumber, setResiNumber] = useState<string>('');
  const [producerToast, setProducerToast] = useState<string | null>(null);

  // Withdrawal states
  const [wdAmount, setWdAmount] = useState<number>(500000);
  const [wdMessage, setWdMessage] = useState<string | null>(null);

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Herbal & Kesehatan',
    description: '',
    basePrice: 50000,
    recommendedPrice: 75000,
    minResellerPrice: 65000,
    suggestedMargin: 25000,
    stock: 50,
    weightGrams: 250,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
  });

  // Filter products belonging to this producer
  const myProducts = useMemo(() => {
    return products.filter((p) => p.producerId === currentUser.id);
  }, [products, currentUser.id]);

  // Total stock
  const totalStockCount = myProducts.reduce((sum, p) => sum + p.stock, 0);

  // Orders containing products made by this producer
  const myProducerOrders = useMemo(() => {
    return orders.filter((o) =>
      o.items.some((it) => it.producerId === currentUser.id)
    );
  }, [orders, currentUser.id]);

  // Order status counts
  const newOrdersCount = myProducerOrders.filter((o) => o.orderStatus === 'payment_received').length;
  const processingOrdersCount = myProducerOrders.filter((o) => ['payment_received', 'processing', 'packing'].includes(o.orderStatus)).length;
  const shippingOrdersCount = myProducerOrders.filter((o) => ['shipping', 'in_transit'].includes(o.orderStatus)).length;
  const completedOrdersCount = myProducerOrders.filter((o) => o.orderStatus === 'completed').length;

  // Total omzet earned by producer from their basePrice
  const totalProducerRevenue = myProducerOrders.reduce((sum, o) => {
    const myItems = o.items.filter((it) => it.producerId === currentUser.id);
    return sum + myItems.reduce((s, it) => s + it.basePrice * it.quantity, 0);
  }, 0);

  // Resellers actively selling this producer's products
  const activeResellersForProducer = useMemo(() => {
    const matchingResellerProductPairs = resellerProducts.filter((rp) =>
      myProducts.some((mp) => mp.id === rp.productId)
    );
    const uniqueResellerIds: string[] = Array.from(new Set(matchingResellerProductPairs.map((r) => r.resellerId)));
    return uniqueResellerIds.map((resellerId: string) => {
      const prods = matchingResellerProductPairs.filter((r) => r.resellerId === resellerId);
      const ordersByReseller = myProducerOrders.filter((o) => o.resellerId === resellerId);
      const omzet = ordersByReseller.reduce((s, o) => s + o.totalAmount, 0);
      return {
        resellerId,
        storeName: prods[0]?.resellerName || `Reseller ${resellerId.slice(0, 5)}`,
        productsCount: prods.length,
        totalOrders: ordersByReseller.length,
        omzet,
      };
    });
  }, [resellerProducts, myProducts, myProducerOrders]);

  const chartData = [
    { day: 'Sen', produksi: 120, kirim: 95 },
    { day: 'Sel', produksi: 150, kirim: 130 },
    { day: 'Rab', produksi: 180, kirim: 160 },
    { day: 'Kam', produksi: 140, kirim: 140 },
    { day: 'Jum', produksi: 200, kirim: 190 },
    { day: 'Sab', produksi: 220, kirim: 210 },
    { day: 'Min', produksi: 110, kirim: 100 },
  ];

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      ...newProductForm,
      producerId: currentUser.id,
      producerName: profile.companyName,
      variants: [],
    });
    setIsAddProductModalOpen(false);
    setProducerToast(`Produk "${newProductForm.name}" berhasil didaftarkan dan otomatis terhubung ke katalog reseller untuk dipilih & dijual!`);
    setTimeout(() => setProducerToast(null), 5000);
  };

  const handleQuickStockUpdate = (productId: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    updateProductStock(productId, next);
  };

  const handleSaveResi = (orderId: string) => {
    if (!resiNumber) return;
    updateOrderStatus(orderId, 'shipping', resiNumber);
    setInputResiOrderId(null);
    setResiNumber('');
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const success = requestWithdrawal(
      wdAmount,
      profile.bankName,
      profile.bankAccountNumber,
      profile.bankAccountHolder
    );
    if (success) {
      setWdMessage(`Pengajuan pencairan modal ${formatRupiah(wdAmount)} berhasil dikirim.`);
    } else {
      setWdMessage('Saldo tersedia tidak mencukupi.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast feedback */}
      {producerToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{producerToast}</span>
          </div>
          <button
            onClick={() => setProducerToast(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Producer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-600 text-white rounded-xl shadow-md">
            <Factory size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {profile.companyName}
              </h1>
              <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                Produsen Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Legalitas: <strong className="font-mono text-slate-700">{profile.nibOrLegalNumber}</strong> • Kategori: {profile.businessCategory}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-producer-crowdfunding"
            onClick={() => setCurrentView('crowdfunding')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Coins size={15} />
            <span>Permodalan Syariah UMKM</span>
          </button>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* 9 Navigation Tabs (Poin 13) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-1.5 shadow-2xs overflow-x-auto scrollbar-none flex items-center gap-1">
        {[
          { id: 'beranda', label: 'Beranda KPI', icon: TrendingUp },
          { id: 'produk', label: 'Manajemen Produk', icon: Package },
          { id: 'stok', label: 'Manajemen Stok', icon: AlertTriangle },
          { id: 'pesanan_masuk', label: 'Pesanan Masuk', icon: Truck },
          { id: 'reseller_saya', label: 'Reseller Saya', icon: Users },
          { id: 'keuangan', label: 'Keuangan Produsen', icon: Wallet },
          { id: 'laporan', label: 'Laporan Penjualan', icon: FileText },
          { id: 'profil_usaha', label: 'Profil Usaha', icon: Building2 },
          { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = producerActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setProducerActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BERANDA KPI (Poin 13) */}
      {producerActiveTab === 'beranda' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Total Produk Aktif</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{myProducts.length}</div>
              <span className="text-[10px] text-slate-400">Total stok: {totalStockCount} unit</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Pesanan Baru Masuk</span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{newOrdersCount}</div>
              <span className="text-[10px] text-amber-700">Perlu diproses segera</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Mitra Reseller Aktif</span>
              <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
                {profile.activeResellersCount}
              </div>
              <span className="text-[10px] text-blue-600">Jaringan distribusi</span>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-900 to-slate-900 text-white rounded-xl shadow-xs">
              <span className="text-[11px] text-amber-200 block">Saldo Siap Tarik</span>
              <div className="text-base sm:text-xl font-black text-amber-400 mt-1 truncate">
                {formatRupiah(wallet.availableBalance)}
              </div>
              <span className="text-[10px] text-slate-300">Pending: {formatRupiah(wallet.pendingBalance)}</span>
            </div>
          </div>

          {/* Quick status progress */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] text-amber-800 font-bold block">SEDANG DIKEMAS</span>
              <span className="text-lg font-black text-amber-900">{processingOrdersCount}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <span className="text-[10px] text-blue-800 font-bold block">DALAM PENGIRIMAN</span>
              <span className="text-lg font-black text-blue-900">{shippingOrdersCount}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-bold block">SELESAI TERKIRIM</span>
              <span className="text-lg font-black text-emerald-900">{completedOrdersCount}</span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Produksi & Pengiriman Mingguan (Unit)</h3>
              <span className="text-xs text-slate-400">7 Hari Terakhir</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={10} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="produksi" name="Diproduksi/Ready" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="kirim" name="Terkirim ke Ekspedisi" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN PRODUK PRODUSEN (Poin 14) */}
      {producerActiveTab === 'produk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Katalog Produk Pabrik Anda ({myProducts.length})</h2>
              <p className="text-xs text-slate-500">
                Atur harga pokok modal produsen, batas harga minimum reseller, berat gram, dan deskripsi produk.
              </p>
            </div>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProducts.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-3.5 shadow-2xs">
                <img src={p.image} alt={p.name} className="w-20 h-20 rounded-lg object-cover border shrink-0" />
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-amber-700 font-bold uppercase">{p.category}</span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{p.name}</h4>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 mt-1">
                      <span>Harga Modal: <strong>{formatRupiah(p.basePrice)}</strong></span>
                      <span>Min. Jual: <strong>{formatRupiah(p.minResellerPrice)}</strong></span>
                      <span>Berat: <strong>{p.weightGrams}g</strong></span>
                      <span>
                        Stok:{' '}
                        <strong className={p.stock < 10 ? 'text-rose-600' : 'text-emerald-600'}>
                          {p.stock} unit
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-[11px] text-slate-400">{p.soldCount} terjual via reseller</span>
                    <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">
                      Disetujui Admin
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANAJEMEN STOK (Poin 14) */}
      {producerActiveTab === 'stok' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Manajemen Stok & Ketersediaan Barang</h2>
            <p className="text-xs text-slate-500">
              Sesuai SOP: 🟢 Tersedia (stok &gt; 10), 🟡 Stok Terbatas (&lt; 10), 🔴 Habis. Update stok cepat tanpa reload.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Status Ketersediaan</th>
                  <th className="p-3">Stok Saat Ini</th>
                  <th className="p-3 text-right">Update Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myProducts.map((p) => {
                  let badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      🟢 Tersedia ({p.stock})
                    </span>
                  );
                  if (p.stock === 0) {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        🔴 Habis (0)
                      </span>
                    );
                  } else if (p.stock < 10) {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        🟡 Terbatas ({p.stock})
                      </span>
                    );
                  }

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 flex items-center gap-2">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">{p.name}</span>
                      </td>
                      <td className="p-3">{badge}</td>
                      <td className="p-3 font-mono font-bold text-sm text-slate-900">{p.stock}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, p.stock, -5)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold cursor-pointer"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, p.stock, 10)}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleQuickStockUpdate(p.id, p.stock, 50)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold cursor-pointer"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PESANAN MASUK & CETAK LABEL (Poin 15) */}
      {producerActiveTab === 'pesanan_masuk' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Pesanan Masuk dari Reseller & Marketplace</h2>
            <p className="text-xs text-slate-500">
              Kemas pesanan sesuai standar pengemasan aman, cetak label pengiriman, dan input nomor resi ekspedisi.
            </p>
          </div>

          {myProducerOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <Truck size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Belum ada pesanan masuk untuk produk Anda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myProducerOrders.map((order) => {
                const myItems = order.items.filter((it) => it.producerId === currentUser.id);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700">#{order.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{formatDateIndo(order.createdAt)}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-slate-800">
                          Reseller: {order.resellerStoreName || 'Marketplace'}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Penerima Info & Ekspedisi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Tujuan Pengiriman:</span>
                        <span className="font-bold text-slate-800">{order.customerName} ({order.customerPhone})</span>
                        <p className="text-slate-600 text-[11px] leading-tight mt-0.5">
                          {order.customerAddress}, {order.customerCity}, {order.customerProvince} {order.customerPostalCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Kurir Dipilih:</span>
                        <span className="font-bold text-blue-700">{order.shippingCourier} - {order.shippingService}</span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Nomor Resi: <strong className="font-mono text-slate-800">{order.trackingNumber || 'Belum diinput'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="text-xs text-slate-700 space-y-1">
                      {myItems.map((it) => (
                        <div key={it.id} className="flex justify-between">
                          <span>{it.quantity}x {it.productName} ({it.weightGrams * it.quantity}g)</span>
                          <span className="font-bold text-slate-900">{formatRupiah(it.basePrice * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions: Print Label, Update Status, Input Resi */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Printer size={13} />
                          <span>Cetak Label Resi / Invoice</span>
                        </button>
                        <button
                          onClick={() => setTrackingOrderId(order.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Truck size={13} />
                          <span>Status Tracking</span>
                        </button>
                      </div>

                      {/* Status progression for Producer */}
                      <div className="flex items-center gap-2">
                        {order.orderStatus === 'payment_received' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 cursor-pointer"
                          >
                            Proses Pesanan
                          </button>
                        )}
                        {order.orderStatus === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'packing')}
                            className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            Tandai Sudah Dikemas
                          </button>
                        )}
                        {order.orderStatus === 'packing' && (
                          <div className="flex items-center gap-1">
                            {inputResiOrderId === order.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="No. Resi JNE/J&T..."
                                  value={resiNumber}
                                  onChange={(e) => setResiNumber(e.target.value)}
                                  className="px-2 py-1 text-xs border rounded w-36"
                                />
                                <button
                                  onClick={() => handleSaveResi(order.id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                                >
                                  Kirim
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setInputResiOrderId(order.id);
                                  setResiNumber(`GOS-${order.shippingCourier.slice(0, 3)}-${Date.now().toString().slice(-6)}`);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 cursor-pointer"
                              >
                                Input Resi & Kirim
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RESELLER SAYA (Poin 13) */}
      {producerActiveTab === 'reseller_saya' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Jaringan Reseller yang Menjual Produk Anda</h2>
            <p className="text-xs text-slate-500">
              Pantau siapa saja reseller mitra yang aktif mendistribusikan produk herbal & fashion Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeResellersForProducer.map((r) => (
              <div key={r.resellerId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">{r.storeName}</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                    Mitra Aktif
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Katalog</span>
                    <span className="font-bold text-slate-800">{r.productsCount} produk</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pesanan</span>
                    <span className="font-bold text-slate-800">{r.totalOrders} order</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Omzet</span>
                    <span className="font-bold text-emerald-600">{formatRupiah(r.omzet)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: KEUANGAN PRODUSEN (Poin 16) */}
      {producerActiveTab === 'keuangan' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Dompet & Penarikan Dana Modal Pabrik</h2>
            <p className="text-xs text-slate-500">
              Dana modal dasar produk otomatis cair ke saldo produsen begitu pesanan selesai dan diterima pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">SALDO SIAP DITARIK</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">{formatRupiah(wallet.availableBalance)}</div>
              <span className="text-[11px] text-emerald-700 mt-1 block">Hasil penjualan produk berstatus selesai</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800 block">SALDO PENDING (DALAM PENGIRIMAN)</span>
              <div className="text-2xl font-black text-amber-900 mt-1">{formatRupiah(wallet.pendingBalance)}</div>
              <span className="text-[11px] text-amber-700 mt-1 block">Pesanan dalam perjalanan kurir</span>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">TOTAL MODAL DITARIK</span>
              <div className="text-2xl font-black text-slate-800 mt-1">{formatRupiah(wallet.withdrawnBalance)}</div>
              <span className="text-[11px] text-slate-500 mt-1 block">Telah ditransfer ke rekening bank usaha</span>
            </div>
          </div>

          {/* Rekening Pencairan Dana Produsen */}
          <BankAccountManager
            title="Rekening Pencairan Modal Usaha Produsen"
            subtitle="Rekening Bank Syariah Indonesia (BSI) atau bank lainnya yang terdaftar untuk menerima hasil penjualan produk pabrik."
            onSelectAccount={(acc) => {
              profile.bankName = acc.bankName;
              profile.bankAccountNumber = acc.accountNumber;
              profile.bankAccountHolder = acc.accountHolder;
            }}
          />

          {/* Form Tarik Modal */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-xl space-y-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">Ajukan Pencairan Dana ke Rekening Bank</h3>
            {wdMessage && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl">
                {wdMessage}
              </div>
            )}
            <form onSubmit={handleWithdrawal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  step="50000"
                  min={100000}
                  max={wallet.availableBalance}
                  value={wdAmount}
                  onChange={(e) => setWdAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold border rounded-lg"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border text-slate-600">
                <div>Bank Tujuan: <strong>{profile.bankName}</strong></div>
                <div>No Rekening: <strong>{profile.bankAccountNumber}</strong></div>
                <div>Atas Nama: <strong>{profile.bankAccountHolder}</strong></div>
              </div>
              <button
                type="submit"
                disabled={wallet.availableBalance < 100000}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl cursor-pointer disabled:bg-slate-300"
              >
                Tarik Dana Modal Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 7: LAPORAN PENJUALAN */}
      {producerActiveTab === 'laporan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Laporan Penjualan Produk Produsen</h2>
              <p className="text-xs text-slate-500">Rekap volume barang keluar dan realisasi pendapatan produsen.</p>
            </div>
            <button
              onClick={() => {
                const headers = ['Produk', 'Kategori', 'Harga Modal', 'Stok', 'Total Terjual', 'Estimasi Nilai Omzet'];
                const rows = myProducts.map((p) => [
                  p.name,
                  p.category,
                  p.basePrice,
                  p.stock,
                  p.soldCount,
                  p.soldCount * p.basePrice,
                ]);
                downloadCsvFile('Laporan_Produksi_Ghinan.csv', headers, rows);
              }}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="p-3">Nama Produk</th>
                  <th className="p-3">HPP Modal</th>
                  <th className="p-3">Total Terjual</th>
                  <th className="p-3">Realisasi Omzet Pabrik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-slate-800">{p.name}</td>
                    <td className="p-3">{formatRupiah(p.basePrice)}</td>
                    <td className="p-3 font-semibold">{p.soldCount} unit</td>
                    <td className="p-3 font-extrabold text-blue-700">{formatRupiah(p.soldCount * p.basePrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: PROFIL USAHA */}
      {producerActiveTab === 'profil_usaha' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-xl space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Informasi Usaha & Gudang Pengiriman</h3>
          <div>
            <span className="text-slate-400 block">Nama Perusahaan</span>
            <span className="font-bold text-slate-800 text-sm">{profile.companyName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">NIB / Izin Edar</span>
            <span className="font-mono text-slate-700">{profile.nibOrLegalNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Alamat Gudang Asal Pengiriman</span>
            <span className="text-slate-700">{profile.address}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Rekening Penampung</span>
            <span className="text-slate-700">{profile.bankName} - {profile.bankAccountNumber} a/n {profile.bankAccountHolder}</span>
          </div>
        </div>
      )}

      {/* TAB 9: BANTUAN */}
      {producerActiveTab === 'bantuan' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-xl space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Standar Operasional Produsen (SOP)</h3>
          <p className="text-slate-600 leading-relaxed">
            1. Pesanan yang masuk wajib dikemas dalam waktu maksimal 24 jam.<br />
            2. Gunakan bubble wrap dan kardus standar agar barang tidak rusak saat pengiriman kurir.<br />
            3. Tempelkan label resi pengiriman Ghinan Online Shop secara jelas di atas paket.
          </p>
        </div>
      )}

      {/* MODAL: TAMBAH PRODUK BARU */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddProductModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-base font-bold text-slate-900 mb-4">Tambah Produk Mitra Baru</h2>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="Contoh: Madu Randu Murni 500g"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Herbal & Kesehatan">Herbal & Kesehatan</option>
                    <option value="Fashion Muslimah">Fashion Muslimah</option>
                    <option value="Fashion Pria">Fashion Pria</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Berat (Gram) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.weightGrams}
                    onChange={(e) => setNewProductForm({ ...newProductForm, weightGrams: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Modal</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.basePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, basePrice: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batas Min. Reseller</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.minResellerPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, minResellerPrice: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rekomendasi Jual</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.recommendedPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, recommendedPrice: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah Stok Awal</label>
                <input
                  type="number"
                  required
                  value={newProductForm.stock}
                  onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Produk</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  placeholder="Kandungan, manfaat, cara pakai..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer mt-2"
              >
                Simpan & Daftarkan Produk
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK LABEL RESI / INVOICE (Poin 15) */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-xs space-y-3 font-sans">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-extrabold text-blue-900 text-sm">GHINAN SHIPPING LABEL</span>
                <span className="font-mono font-bold">{selectedOrderForInvoice.shippingCourier}</span>
              </div>

              <div className="bg-slate-50 p-2 rounded text-center">
                <span className="text-[10px] text-slate-400 block">NOMOR RESI PENGIRIMAN:</span>
                <span className="font-mono font-black text-base text-slate-900 tracking-wider">
                  {selectedOrderForInvoice.trackingNumber || 'BELUM DICETAK'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">PENERIMA:</span>
                <div className="font-bold text-slate-800">{selectedOrderForInvoice.customerName} ({selectedOrderForInvoice.customerPhone})</div>
                <div className="text-slate-600">{selectedOrderForInvoice.customerAddress}, {selectedOrderForInvoice.customerCity}</div>
              </div>

              <div className="border-t pt-2 space-y-1">
                <span className="text-[10px] text-slate-400 block">PENGIRIM (DROPSHIP RESELLER):</span>
                <div className="font-bold text-slate-800">{selectedOrderForInvoice.resellerStoreName || 'Ghinan Store'}</div>
                <div className="text-slate-500 text-[10px]">Warehouse: {profile.companyName}</div>
              </div>

              <div className="border-t pt-2">
                <span className="font-bold block mb-1">Isi Paket ({selectedOrderForInvoice.items.length} item):</span>
                {selectedOrderForInvoice.items.map((it: any) => (
                  <div key={it.id} className="text-[11px] text-slate-600">
                    • {it.quantity}x {it.productName}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-1"
              >
                <Printer size={14} />
                <span>Cetak Label Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
