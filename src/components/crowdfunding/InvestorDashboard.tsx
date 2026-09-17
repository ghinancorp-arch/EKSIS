import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentRecord } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { BankAccountManager } from '../profile/BankAccountManager';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Award,
  Calendar,
  DollarSign,
  Download,
  Building2,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  X,
  CreditCard,
} from 'lucide-react';

export const InvestorDashboard: React.FC = () => {
  const {
    currentUser,
    investments,
    setCurrentView,
    bankAccounts,
    showToast,
  } = useApp();

  const [selectedCert, setSelectedCert] = useState<InvestmentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'bank_accounts'>('portfolio');

  // Filter user investments
  const userInvestments = investments.filter(
    (inv) => inv.userId === currentUser.id || inv.userName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const totalInvested = userInvestments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDividends = userInvestments.reduce((acc, curr) => acc + curr.totalDividendsReceived, 0);
  const estimatedMonthlyDividend = userInvestments.reduce(
    (acc, curr) => acc + Math.round((curr.amount * (curr.expectedRoiAnnual / 100)) / 12),
    0
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              <Award size={14} />
              <span>Akun Member Investor Syariah</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Dashboard Portofolio Investasi
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
              Selamat datang, <strong>{currentUser.name}</strong>. Pantau pertumbuhan portofolio modal usaha syariah, jadwal dividen bulanan, dan pencairan bagi hasil ke rekening bank Anda.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setCurrentView('crowdfunding')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>Cari Proyek Investasi Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-8 pt-6 border-t border-emerald-800/60 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">Total Nilai Investasi</span>
            <span className="text-lg sm:text-2xl font-black text-white mt-0.5 block">
              {formatRupiah(totalInvested)}
            </span>
            <span className="text-[10px] text-emerald-300 mt-1 block">
              {userInvestments.length} Portofolio Aktif
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">Total Dividen Diterima</span>
            <span className="text-lg sm:text-2xl font-black text-amber-300 mt-0.5 block">
              {formatRupiah(totalDividends)}
            </span>
            <span className="text-[10px] text-amber-200 mt-1 block">
              Tercatat & Terdistribusi
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">Estimasi Bagi Hasil Bulanan</span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400 mt-0.5 block">
              {formatRupiah(estimatedMonthlyDividend)}
            </span>
            <span className="text-[10px] text-emerald-300 mt-1 block">
              Berdasarkan ROI tahunan
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-200 block">Rekening Penyaluran Dividen</span>
            <span className="text-base sm:text-lg font-black text-white mt-0.5 block font-mono">
              BSI 7198606228
            </span>
            <span className="text-[10px] text-emerald-300 mt-1 block">
              Bebas Biaya Transfer
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Portofolio Sukuk ({userInvestments.length})
        </button>

        <button
          onClick={() => setActiveTab('bank_accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bank_accounts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Rekening Pencairan Dividen (BSI)
        </button>
      </div>

      {activeTab === 'bank_accounts' ? (
        <BankAccountManager
          title="Rekening Pencairan Dividen Syariah"
          subtitle="Pencairan bagi hasil sukuk bulanan akan dikirimkan langsung ke rekening BSI no 7198606228 atau rekening bank syariah Anda yang telah terdaftar."
        />
      ) : (
        /* PORTFOLIO LIST */
        <div className="space-y-4">
          {userInvestments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Coins size={44} className="mx-auto text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Belum Memiliki Portofolio Investasi</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Anda belum melakukan investasi pada proyek UMKM syariah. Jelajahi pilihan proyek permodalan untuk mulai berinvestasi.
              </p>
              <button
                onClick={() => setCurrentView('crowdfunding')}
                className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Lihat Proyek Investasi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {inv.certificateNumber}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-900 text-white rounded">
                        Akad {inv.contractType}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {inv.businessName}
                      </h4>
                      <p className="text-xs text-slate-500">{inv.projectTitle}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Total Investasi</span>
                        <span className="font-bold text-slate-900">{formatRupiah(inv.amount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Kepemilikan</span>
                        <span className="font-bold text-slate-900">{inv.lotsCount} Lot</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Proyeksi ROI</span>
                        <span className="font-bold text-emerald-700">
                          {inv.expectedRoiAnnual}% p.a.
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Dividen Diterima</span>
                        <span className="font-bold text-amber-600">
                          {formatRupiah(inv.totalDividendsReceived)}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Tanggal Akad: {inv.date}</span>
                      <span>Tenor: {inv.tenorMonths} Bulan</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      <span>Akad Sah & Berjalan</span>
                    </span>

                    <button
                      onClick={() => setSelectedCert(inv)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <FileCheck size={14} />
                      <span>Lihat Sertifikat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 relative my-8 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-1 mb-6 border-b border-amber-200 pb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                EKSIS EKOSISTEM BISNIS SYARIAH
              </span>
              <h2 className="text-xl font-black text-slate-900">
                SERTIFIKAT KEPEMILIKAN SUKUK SYARIAH
              </h2>
              <span className="font-mono text-xs font-bold text-slate-600 block">
                No: {selectedCert.certificateNumber}
              </span>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="text-center italic text-slate-600">
                "Bismillahir Rahmanir Rahim. Diterbitkan sebagai bukti kepemilikan modal yang sah dan amanah atas proyek usaha halal:"
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Investor:</span>
                  <strong className="text-slate-900 uppercase">{selectedCert.userName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Usaha Penerbit:</span>
                  <strong className="text-slate-900">{selectedCert.businessName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Judul Proyek:</span>
                  <strong className="text-slate-900 text-right max-w-[200px]">{selectedCert.projectTitle}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Akad:</span>
                  <strong className="text-emerald-700">Akad {selectedCert.contractType.toUpperCase()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah Kepemilikan:</span>
                  <strong className="text-slate-900">{selectedCert.lotsCount} Lembar Lot</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nilai Investasi:</span>
                  <strong className="text-emerald-800 text-sm">{formatRupiah(selectedCert.amount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proyeksi Bagi Hasil:</span>
                  <strong className="text-amber-700">{selectedCert.expectedRoiAnnual}% p.a. ({selectedCert.profitSharingRatio})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Akad:</span>
                  <strong className="text-slate-900">{selectedCert.date}</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 text-center">
                Rekening Pencairan Bagi Hasil Terdaftar: <strong>BSI 7198606228</strong><br />
                Diawasi Dewan Pengawas Syariah EKSIS
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Unduh / Cetak</span>
              </button>

              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
