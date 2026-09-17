import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo, downloadCsvFile } from '../../utils/formatters';
import { UserRole, Product, OrderStatus, Wallet as WalletType } from '../../types';
import {
  ShieldCheck,
  Users,
  Package,
  ShoppingBag,
  Wallet,
  Truck,
  FileText,
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Search,
  Check,
  X,
  TrendingUp,
  CreditCard,
  Building2,
  Store,
  Eye,
  Sliders,
  Bell,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC<{
  onOpenProductDetail: (p: Product) => void;
}> = ({ onOpenProductDetail }) => {
  const {
    users,
    products,
    orders,
    wallets,
    withdrawals,
    auditLogs,
    settings,
    updateSettings,
    approveUser,
    rejectUser,
    toggleUserBlock,
    moderateProduct,
    processWithdrawal,
    updateOrderStatus,
    adminActiveTab,
    setAdminActiveTab,
  } = useApp();

  // Settings form state
  const [platformFeeInput, setPlatformFeeInput] = useState<number>(settings.platformFeeFixed);
  const [minWdInput, setMinWdInput] = useState<number>(settings.minWithdrawal);
  const [bankAccountInput, setBankAccountInput] = useState<string>(settings.adminBankInfo.accountNumber);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // User search filter
  const [userSearch, setUserSearch] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // KPI calculations
  const totalUsersCount = users.length;
  const pendingUsersCount = users.filter((u) => u.status === 'pending_approval').length;
  const activeProductsCount = products.filter((p) => p.moderationStatus === 'approved').length;
  const pendingProductsCount = products.filter((p) => p.moderationStatus === 'pending').length;
  const totalOrdersCount = orders.length;

  const totalPlatformOmzet = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPlatformEarnings = orders.reduce((sum, o) => sum + o.platformFee, 0);

  const totalAvailableBalances: number = (Object.values(wallets) as WalletType[]).reduce((sum, w) => sum + (w?.availableBalance || 0), 0);
  const totalPendingBalances: number = (Object.values(wallets) as WalletType[]).reduce((sum, w) => sum + (w?.pendingBalance || 0), 0);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
      if (userSearch) {
        const query = userSearch.toLowerCase();
        return (
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.phone.includes(query) ||
          u.city.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [users, userSearch, userRoleFilter]);

  // Handle settings save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platformFeeFixed: platformFeeInput,
      minWithdrawal: minWdInput,
      adminBankInfo: {
        ...settings.adminBankInfo,
        accountNumber: bankAccountInput,
      },
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const chartData = [
    { name: 'Jan', omzet: 12500000, fee: 350000 },
    { name: 'Feb', omzet: 18200000, fee: 520000 },
    { name: 'Mar', omzet: 24800000, fee: 740000 },
    { name: 'Apr', omzet: 31000000, fee: 920000 },
    { name: 'Mei', omzet: 42500000, fee: 1250000 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Super Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Super Admin Ghinan Online Shop</h1>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono font-bold border border-emerald-500/30">
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Kontrol terpusat seluruh ekosistem Produsen, Reseller, Keuangan, dan Logistik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingUsersCount > 0 && (
            <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-xl animate-pulse">
              ⚠️ {pendingUsersCount} Akun Perlu Approval
            </span>
          )}
        </div>
      </div>

      {/* 10 Navigation Menus (Poin 18) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-1.5 shadow-2xs overflow-x-auto scrollbar-none flex items-center gap-1">
        {[
          { id: 'dashboard', label: 'Dashboard Utama', icon: TrendingUp },
          { id: 'pengguna', label: `Pengguna (${pendingUsersCount > 0 ? `! ${users.length}` : users.length})`, icon: Users },
          { id: 'produk', label: `Produk (${products.length})`, icon: Package },
          { id: 'pesanan', label: `Pesanan (${orders.length})`, icon: ShoppingBag },
          { id: 'keuangan', label: 'Keuangan & Payout', icon: Wallet },
          { id: 'ekspedisi', label: 'Ekspedisi & Kurir', icon: Truck },
          { id: 'laporan', label: 'Laporan & Analytics', icon: FileText },
          { id: 'pengaturan', label: 'Pengaturan Sistem', icon: Sliders },
          { id: 'audit_log', label: 'Log Aktivitas Sistem', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD UTAMA (Poin 18) */}
      {adminActiveTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Total Pengguna</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalUsersCount}</div>
              <span className="text-[10px] text-amber-600 font-semibold">{pendingUsersCount} menunggu review</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Total Transaksi Selesai</span>
              <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">{totalOrdersCount}</div>
              <span className="text-[10px] text-slate-400">Order riil konsumen</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Omzet Ekosistem Ghinan</span>
              <div className="text-base sm:text-xl font-black text-slate-900 mt-1 truncate">
                {formatRupiah(totalPlatformOmzet)}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Total GMV</span>
            </div>

            <div className="p-4 bg-gradient-to-br from-rose-950 to-slate-900 text-white rounded-xl shadow-xs">
              <span className="text-[11px] text-rose-200 font-medium block">Pendapatan Fee Ghinan</span>
              <div className="text-base sm:text-xl font-black text-amber-300 mt-1 truncate">
                {formatRupiah(totalPlatformEarnings)}
              </div>
              <span className="text-[10px] text-slate-300">Rp5.000/order layanan</span>
            </div>
          </div>

          {/* Pending Approval Shortcut Card */}
          {pendingUsersCount > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                  Terdapat {pendingUsersCount} Pendaftaran Pengguna Baru Menunggu Konfirmasi
                </h4>
                <p className="text-xs text-amber-800">
                  Calon produsen dan reseller baru tidak dapat aktif berjualan sebelum disetujui admin.
                </p>
              </div>
              <button
                onClick={() => setAdminActiveTab('pengguna')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Tinjau Pengguna Sekarang
              </button>
            </div>
          )}

          {/* Chart GMV */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pertumbuhan GMV Transaksi & Keuntungan Platform</h3>
                <p className="text-[11px] text-slate-400">Arus perputaran uang di Ghinan Online Shop</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Sistem Sehat
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `Rp${v / 1000000}M`} />
                  <Tooltip
                    formatter={(v: any) => [formatRupiah(Number(v)), '']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="omzet" name="Total GMV" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fee" name="Pendapatan Fee Admin" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN PENGGUNA (Poin 18 Sub 2) */}
      {adminActiveTab === 'pengguna' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Manajemen Pengguna & Verifikasi Akun</h2>
              <p className="text-xs text-slate-500">
                Setujui calon mitra Produsen & Reseller, blokir akun bermasalah, atau atur status keanggotaan.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama/email/kota..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg w-48"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-semibold"
              >
                <option value="all">Semua Peran</option>
                <option value="reseller">Reseller</option>
                <option value="producer">Produsen</option>
                <option value="customer">Pembeli</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Peran (Role)</th>
                  <th className="p-3">Kota / Alamat</th>
                  <th className="p-3">Status Akun</th>
                  <th className="p-3 text-right">Aksi Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email} • {u.phone}</div>
                    </td>
                    <td className="p-3 font-semibold uppercase text-[10px] text-slate-700">
                      {u.role}
                    </td>
                    <td className="p-3 text-slate-600">{u.city}, {u.province}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status === 'active'
                          ? 'Aktif'
                          : u.status === 'pending_approval'
                          ? 'Menunggu Approval'
                          : 'Diblokir'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {u.status === 'pending_approval' ? (
                          <>
                            <button
                              onClick={() => approveUser(u.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[11px] cursor-pointer flex items-center gap-1"
                            >
                              <Check size={12} />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => rejectUser(u.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-bold text-[11px] cursor-pointer flex items-center gap-1"
                            >
                              <X size={12} />
                              <span>Tolak</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => toggleUserBlock(u.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Blokir' : 'Buka Blokir'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAJEMEN PRODUK (Poin 18 Sub 3) */}
      {adminActiveTab === 'produk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Moderasi & Manajemen Seluruh Produk</h2>
              <p className="text-xs text-slate-500">
                Pemeriksaan kualitas produk mitra produsen sebelum tayang di marketplace dan katalog reseller.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              Total {products.length} Produk Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-3.5 shadow-2xs">
                <img src={p.image} alt={p.name} className="w-20 h-20 rounded-lg object-cover border shrink-0" />
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-500 truncate">{p.producerName}</span>
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          p.moderationStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.moderationStatus.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate mt-0.5">{p.name}</h4>
                    <div className="flex gap-3 text-xs text-slate-600 mt-1">
                      <span>Modal: <strong>{formatRupiah(p.basePrice)}</strong></span>
                      <span>Min Jual: <strong>{formatRupiah(p.minResellerPrice)}</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-[11px] text-slate-400">Stok: {p.stock} unit</span>
                    <div className="flex items-center gap-1.5">
                      {p.moderationStatus !== 'approved' && (
                        <button
                          onClick={() => moderateProduct(p.id, 'approved')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Terima
                        </button>
                      )}
                      {p.moderationStatus === 'approved' && (
                        <button
                          onClick={() => moderateProduct(p.id, 'rejected')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded text-xs font-bold hover:bg-rose-100 cursor-pointer"
                        >
                          Takedown
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANAJEMEN PESANAN (Poin 18 Sub 4) */}
      {adminActiveTab === 'pesanan' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Seluruh Pesanan Ekosistem ({orders.length})</h2>
            <p className="text-xs text-slate-500">
              Pantau status pengiriman antar pihak, selesaikan sengketa transaksi, atau tindak lanjuti komplain.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="p-3">ID Pesanan</th>
                  <th className="p-3">Pembeli</th>
                  <th className="p-3">Reseller</th>
                  <th className="p-3">Total Nilai</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">#{o.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{o.customerName}</div>
                      <div className="text-[10px] text-slate-400">{o.customerCity}</div>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {o.resellerStoreName || 'Marketplace Langsung'}
                    </td>
                    <td className="p-3 font-extrabold text-slate-900">{formatRupiah(o.totalAmount)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                        {o.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {o.orderStatus !== 'completed' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'completed')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Selesaikan Manual
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: KEUANGAN & APPROVAL WITHDRAWAL (Poin 18 Sub 5) */}
      {adminActiveTab === 'keuangan' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Keuangan Platform & Approval Pencairan Dana (Payout)</h2>
            <p className="text-xs text-slate-500">
              Otorisasi transfer penarikan saldo keuntungan reseller dan modal produsen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">TOTAL SALDO TERSEDIA MITRA</span>
              <div className="text-2xl font-black text-emerald-950 mt-1">{formatRupiah(totalAvailableBalances)}</div>
              <span className="text-[10px] text-emerald-700 mt-1 block">Dana siap dicairkan oleh reseller & produsen</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800 block">TOTAL SALDO PENDING (ESCROW)</span>
              <div className="text-2xl font-black text-amber-950 mt-1">{formatRupiah(totalPendingBalances)}</div>
              <span className="text-[10px] text-amber-700 mt-1 block">Tertahan selama pesanan belum sampai</span>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800 block">AKUMULASI PENDAPATAN PLATFORM</span>
              <div className="text-2xl font-black text-rose-950 mt-1">{formatRupiah(totalPlatformEarnings)}</div>
              <span className="text-[10px] text-rose-700 mt-1 block">Fee platform Ghinan</span>
            </div>
          </div>

          {/* Permintaan Penarikan Dana (Withdrawal Queue) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-3 p-4">
            <h3 className="font-bold text-slate-900 text-sm">Antrean Pengajuan Penarikan Saldo (Withdrawals)</h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="p-2.5">Tanggal</th>
                  <th className="p-2.5">Pemohon</th>
                  <th className="p-2.5">Rekening Tujuan</th>
                  <th className="p-2.5">Nominal</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Otorisasi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-500">{w.requestDate}</td>
                    <td className="p-2.5 font-bold text-slate-800">{w.userName}</td>
                    <td className="p-2.5">
                      <div>{w.bankName} - {w.bankAccountNumber}</div>
                      <div className="text-[10px] text-slate-400">a/n {w.accountHolder}</div>
                    </td>
                    <td className="p-2.5 font-extrabold text-blue-700">{formatRupiah(w.amount)}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.status === 'completed' ? 'Tercairkan' : 'Menunggu Transfer'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {w.status === 'pending' && (
                        <button
                          onClick={() => processWithdrawal(w.id, 'completed')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                        >
                          Setujui & Transfer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: EKSPEDISI & KURIR */}
      {adminActiveTab === 'ekspedisi' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 max-w-2xl text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Integrasi Layanan Ekspedisi & Ongkir</h3>
          <p className="text-slate-600">
            Platform Ghinan Online Shop telah mengintegrasikan kalkulasi ongkos kirim real-time untuk kurir nasional:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="font-bold text-slate-800 block text-sm">JNE Express</span>
              <span className="text-slate-500 text-[11px]">Layanan REG & YES (Yakin Esok Sampai)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="font-bold text-slate-800 block text-sm">J&T Express</span>
              <span className="text-slate-500 text-[11px]">Layanan EZ Standard (1-3 hari)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="font-bold text-slate-800 block text-sm">SiCepat Express</span>
              <span className="text-slate-500 text-[11px]">Layanan REG & Halu Hemat</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="font-bold text-slate-800 block text-sm">Anteraja</span>
              <span className="text-slate-500 text-[11px]">Layanan Reguler door-to-door</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: LAPORAN & ANALYTICS */}
      {adminActiveTab === 'laporan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Laporan Platform Lengkap & Export Data</h2>
              <p className="text-xs text-slate-500">Unduh rekapan kinerja penjualan, produsen terbaik, dan komisi reseller.</p>
            </div>
            <button
              onClick={() => {
                const headers = ['ID Pesanan', 'Tanggal', 'Reseller', 'Customer', 'Omzet', 'Margin Reseller', 'Fee Platform'];
                const rows = orders.map((o) => [
                  o.id,
                  o.createdAt,
                  o.resellerStoreName || 'Marketplace',
                  o.customerName,
                  o.totalAmount,
                  o.resellerTotalMargin,
                  o.platformFee,
                ]);
                downloadCsvFile('Laporan_Platform_Ghinan.csv', headers, rows);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download size={13} />
              <span>Export Laporan Excel (.csv)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800">Ringkasan Omzet Bulanan</h4>
              <div className="text-xl font-black text-blue-700">{formatRupiah(totalPlatformOmzet)}</div>
              <p className="text-slate-500">Akumulasi seluruh transaksi sukses di aplikasi.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800">Margin yang Dihasilkan Reseller</h4>
              <div className="text-xl font-black text-emerald-600">
                {formatRupiah(orders.reduce((s, o) => s + o.resellerTotalMargin, 0))}
              </div>
              <p className="text-slate-500">Pendapatan bersih yang disalurkan kepada member reseller.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PENGATURAN SISTEM (Poin 18 Sub 9 & Poin 21) */}
      {adminActiveTab === 'pengaturan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-xl space-y-4 shadow-2xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Pengaturan Biaya Layanan Platform & Sistem</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan besaran fee platform per pesanan dan batas minimal penarikan dana.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh transaksi baru!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Biaya Layanan Platform per Pesanan (Rp)
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={platformFeeInput}
                onChange={(e) => setPlatformFeeInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Default: Rp5.000 (sesuai spesifikasi sistem Ghinan)
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Batas Minimal Penarikan Saldo (Withdrawal) (Rp)
              </label>
              <input
                type="number"
                step="10000"
                min="10000"
                value={minWdInput}
                onChange={(e) => setMinWdInput(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Rekening Resmi Penampung Ghinan
              </label>
              <input
                type="text"
                value={bankAccountInput}
                onChange={(e) => setBankAccountInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
            >
              Simpan Perubahan Pengaturan
            </button>
          </form>
        </div>
      )}

      {/* TAB 9: AUDIT LOG (Poin 18 Sub 10) */}
      {adminActiveTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Log Aktivitas & Audit Keamanan Sistem</h2>
            <p className="text-xs text-slate-500">
              Pencatatan real-time setiap aksi kritis (registrasi, approval, order, pembayaran, penarikan dana).
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{log.userName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 uppercase font-mono">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
