import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GhinanLogo } from '../common/GhinanLogo';
import { X, Store, Factory, LogIn, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalType,
    setAuthModalType,
    registerReseller,
    registerProducer,
    switchRole,
    users,
  } = useApp();

  // Reseller form fields
  const [resellerForm, setResellerForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    province: 'Jawa Barat',
    city: 'Bandung',
    district: '',
    postalCode: '',
    storeName: '',
    socialMediaUrl: '',
    agreeTerms: false,
  });

  // Producer form fields
  const [producerForm, setProducerForm] = useState({
    name: '',
    companyName: '',
    businessCategory: 'Herbal & Kesehatan',
    phone: '',
    email: '',
    password: '',
    address: '',
    province: 'Jawa Barat',
    city: 'Bandung',
    district: '',
    postalCode: '',
    nibOrLegalNumber: '',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '',
    bankAccountHolder: '',
    description: '',
    socialMediaOrMarketplaceLink: '',
    agreeTerms: false,
  });

  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleResellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resellerForm.agreeTerms) {
      alert('Mohon setujui syarat dan ketentuan kemitraan.');
      return;
    }
    registerReseller(resellerForm);
    setSubmittedMessage(
      'Pendaftaran berhasil dikirim! Status akun Anda: "Menunggu Persetujuan Admin". Anda dapat meninjau dashboard sembari menunggu konfirmasi admin.'
    );
  };

  const handleProducerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!producerForm.agreeTerms) {
      alert('Mohon setujui syarat dan ketentuan produsen.');
      return;
    }
    registerProducer(producerForm);
    setSubmittedMessage(
      'Pendaftaran produsen berhasil dikirim! Status awal: "Menunggu Persetujuan Admin". Admin akan memverifikasi legalitas usaha Anda.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setSubmittedMessage(null);
          }}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <GhinanLogo size="lg" className="justify-center mb-2" />
          <p className="text-xs text-slate-500 font-medium">
            Pusat Belanja & Reseller untuk Pertumbuhan Bisnis
          </p>
        </div>

        {submittedMessage ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Registrasi Terkirim</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
              {submittedMessage}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setSubmittedMessage(null);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 cursor-pointer shadow-md"
              >
                Lanjutkan ke Aplikasi
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setAuthModalType('login')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  authModalType === 'login'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Masuk / Login
              </button>
              <button
                onClick={() => setAuthModalType('register_reseller')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  authModalType === 'register_reseller'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Daftar Reseller
              </button>
              <button
                onClick={() => setAuthModalType('register_producer')}
                className={`flex-1 pb-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  authModalType === 'register_producer'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Daftar Produsen
              </button>
            </div>

            {/* TAB: LOGIN */}
            {authModalType === 'login' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block mb-2">
                    Masuk Cepat Demo (Pilih Akun yang Sudah Terdaftar):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        switchRole('reseller', 'user_reseller_1');
                        setIsAuthModalOpen(false);
                      }}
                      className="p-3 text-left bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
                    >
                      <Store size={18} className="text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800">Ahmad Fauzi</div>
                        <div className="text-[11px] text-blue-700 font-medium truncate">
                          Reseller (Toko Berkah)
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('producer', 'user_producer_1');
                        setIsAuthModalOpen(false);
                      }}
                      className="p-3 text-left bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
                    >
                      <Factory size={18} className="text-amber-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800">CV Ghinan Herbal</div>
                        <div className="text-[11px] text-amber-700 font-medium truncate">
                          Produsen Herbal
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('admin', 'user_admin');
                        setIsAuthModalOpen(false);
                      }}
                      className="p-3 text-left bg-white rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck size={18} className="text-rose-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800">Super Admin</div>
                        <div className="text-[11px] text-rose-700 font-medium truncate">
                          Akses Penuh Sistem
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('customer', 'user_customer_1');
                        setIsAuthModalOpen(false);
                      }}
                      className="p-3 text-left bg-white rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
                    >
                      <LogIn size={18} className="text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800">Dewi Lestari</div>
                        <div className="text-[11px] text-emerald-700 font-medium truncate">
                          Pembeli / Pelanggan
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-4 text-xs text-slate-400 font-medium">
                    Atau Masuk dengan Email
                  </span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    switchRole('reseller', 'user_reseller_1');
                    setIsAuthModalOpen(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email atau WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="contoh: reseller@ghinan.id"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kata Sandi (Password)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 cursor-pointer transition-all shadow-md mt-2"
                  >
                    Masuk ke Akun
                  </button>
                </form>
              </div>
            )}

            {/* TAB: REGISTER RESELLER (Sesuai Poin 3) */}
            {authModalType === 'register_reseller' && (
              <form onSubmit={handleResellerSubmit} className="space-y-3.5">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Setelah mendaftar, status akun Anda: <strong>“Menunggu Persetujuan Admin”</strong>. Akun aktif setelah verifikasi admin.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={resellerForm.name}
                      onChange={(e) => setResellerForm({ ...resellerForm, name: e.target.value })}
                      placeholder="Nama lengkap Anda"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={resellerForm.phone}
                      onChange={(e) => setResellerForm({ ...resellerForm, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={resellerForm.email}
                      onChange={(e) => setResellerForm({ ...resellerForm, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={resellerForm.password}
                      onChange={(e) => setResellerForm({ ...resellerForm, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Toko / Brand Reseller (Opsional)
                  </label>
                  <input
                    type="text"
                    value={resellerForm.storeName}
                    onChange={(e) => setResellerForm({ ...resellerForm, storeName: e.target.value })}
                    placeholder="Contoh: Toko Berkah Barakah"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={resellerForm.address}
                    onChange={(e) => setResellerForm({ ...resellerForm, address: e.target.value })}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Provinsi</label>
                    <input
                      type="text"
                      value={resellerForm.province}
                      onChange={(e) => setResellerForm({ ...resellerForm, province: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kota/Kab</label>
                    <input
                      type="text"
                      value={resellerForm.city}
                      onChange={(e) => setResellerForm({ ...resellerForm, city: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kecamatan</label>
                    <input
                      type="text"
                      value={resellerForm.district}
                      onChange={(e) => setResellerForm({ ...resellerForm, district: e.target.value })}
                      placeholder="Kecamatan"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kode Pos</label>
                    <input
                      type="text"
                      value={resellerForm.postalCode}
                      onChange={(e) => setResellerForm({ ...resellerForm, postalCode: e.target.value })}
                      placeholder="40xxx"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link Media Sosial (Instagram / TikTok / Facebook)
                  </label>
                  <input
                    type="url"
                    value={resellerForm.socialMediaUrl}
                    onChange={(e) => setResellerForm({ ...resellerForm, socialMediaUrl: e.target.value })}
                    placeholder="https://instagram.com/namatoko"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="reseller-terms"
                    checked={resellerForm.agreeTerms}
                    onChange={(e) => setResellerForm({ ...resellerForm, agreeTerms: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="reseller-terms" className="text-xs text-slate-600 leading-tight">
                    Saya menyetujui syarat & ketentuan kemitraan Reseller Ghinan Online Shop (jujur, amanah, dan tidak memanipulasi harga di bawah batas minimum).
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 cursor-pointer transition-all shadow-md"
                >
                  Kirim Pendaftaran Reseller
                </button>
              </form>
            )}

            {/* TAB: REGISTER PRODUSEN (Sesuai Poin 12) */}
            {authModalType === 'register_producer' && (
              <form onSubmit={handleProducerSubmit} className="space-y-3.5">
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    Produsen dapat mendistribusikan produk ke ribuan reseller. Status awal: <strong>“Menunggu Persetujuan Admin”</strong>.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pemilik Usaha *
                    </label>
                    <input
                      type="text"
                      required
                      value={producerForm.name}
                      onChange={(e) => setProducerForm({ ...producerForm, name: e.target.value })}
                      placeholder="Nama lengkap pemilik"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Perusahaan / Usaha *
                    </label>
                    <input
                      type="text"
                      required
                      value={producerForm.companyName}
                      onChange={(e) => setProducerForm({ ...producerForm, companyName: e.target.value })}
                      placeholder="Contoh: PT Berkah Herbal Nusantara"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Bisnis *
                    </label>
                    <input
                      type="tel"
                      required
                      value={producerForm.phone}
                      onChange={(e) => setProducerForm({ ...producerForm, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Produk Utama *
                    </label>
                    <select
                      value={producerForm.businessCategory}
                      onChange={(e) => setProducerForm({ ...producerForm, businessCategory: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                    >
                      <option value="Herbal & Kesehatan">Herbal & Kesehatan</option>
                      <option value="Fashion Muslimah">Fashion Muslimah</option>
                      <option value="Fashion Pria">Fashion Pria</option>
                      <option value="Makanan & Minuman Halal">Makanan & Minuman Halal</option>
                      <option value="Perlengkapan Ibadah">Perlengkapan Ibadah</option>
                      <option value="Skincare & Kosmetik Halal">Skincare & Kosmetik Halal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Legalitas / NIB / PIRT
                    </label>
                    <input
                      type="text"
                      value={producerForm.nibOrLegalNumber}
                      onChange={(e) => setProducerForm({ ...producerForm, nibOrLegalNumber: e.target.value })}
                      placeholder="NIB / No Izin Usaha jika ada"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Usaha *
                    </label>
                    <input
                      type="email"
                      required
                      value={producerForm.email}
                      onChange={(e) => setProducerForm({ ...producerForm, email: e.target.value })}
                      placeholder="kontak@perusahaan.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Rekening Pembayaran & Pencairan Modal
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        value={producerForm.bankName}
                        onChange={(e) => setProducerForm({ ...producerForm, bankName: e.target.value })}
                        placeholder="Nama Bank (BSI / BCA)"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={producerForm.bankAccountNumber}
                        onChange={(e) => setProducerForm({ ...producerForm, bankAccountNumber: e.target.value })}
                        placeholder="Nomor Rekening"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={producerForm.bankAccountHolder}
                        onChange={(e) => setProducerForm({ ...producerForm, bankAccountHolder: e.target.value })}
                        placeholder="Atas Nama Rekening"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Singkat Usaha & Kapasitas Produksi
                  </label>
                  <textarea
                    rows={2}
                    value={producerForm.description}
                    onChange={(e) => setProducerForm({ ...producerForm, description: e.target.value })}
                    placeholder="Ceritakan produk yang Anda buat, kapasitas stok per bulan, dan standar kualitas."
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="producer-terms"
                    checked={producerForm.agreeTerms}
                    onChange={(e) => setProducerForm({ ...producerForm, agreeTerms: e.target.checked })}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="producer-terms" className="text-xs text-slate-600 leading-tight">
                    Saya menyatakan data usaha ini benar dan bersedia mematuhi SOP pengemasan rapi dan pengiriman tepat waktu untuk reseller.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 cursor-pointer transition-all shadow-md"
                >
                  Kirim Pendaftaran Produsen
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
