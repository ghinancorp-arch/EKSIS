import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DonationProgram, DonationRecord } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  HeartHandshake,
  Heart,
  Sparkles,
  Building2,
  Copy,
  Check,
  CheckCircle2,
  Users,
  Award,
  QrCode,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Download,
  Share2,
  X,
  Plus,
} from 'lucide-react';

export const TabunganAkhiratView: React.FC = () => {
  const {
    donationPrograms,
    donations,
    createDonation,
    currentUser,
    showToast,
  } = useApp();

  const [selectedProgramForDonation, setSelectedProgramForDonation] = useState<DonationProgram | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Form fields
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>(currentUser.name || '');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorPhone, setDonorPhone] = useState<string>(currentUser.phone || '');
  const [donorPrayer, setDonorPrayer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Transfer Bank BSI');

  // Receipt Modal state
  const [latestReceipt, setLatestReceipt] = useState<DonationRecord | null>(null);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

  const handleCopyBSI = () => {
    navigator.clipboard.writeText('7149719649');
    setCopiedBank(true);
    showToast('Nomor Rekening BSI 7149719649 disalin', 'success');
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleOpenDonate = (program: DonationProgram) => {
    setSelectedProgramForDonation(program);
    setSelectedAmount(100000);
    setCustomAmount('');
    setDonorPrayer('');
  };

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramForDonation) return;

    const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount < 10000) {
      showToast('Minimal donasi adalah Rp 10.000', 'error');
      return;
    }

    const effectiveDonorName = isAnonymous ? 'Hamba Allah' : donorName.trim() || 'Hamba Allah';

    const newRecord = createDonation({
      programId: selectedProgramForDonation.id,
      programTitle: selectedProgramForDonation.title,
      donorName: effectiveDonorName,
      donorPhone: donorPhone.trim(),
      isAnonymous,
      amount: finalAmount,
      prayerOrNote: donorPrayer.trim(),
      paymentMethod,
      bankDestination: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '7149719649',
    });

    showToast('Alhamdulillah, donasi Tabungan Akhirat Anda telah tercatat', 'success');
    setSelectedProgramForDonation(null);
    setLatestReceipt(newRecord);
  };

  const totalCollectedAll = donationPrograms.reduce((acc, p) => acc + p.collectedAmount, 0);
  const totalDonorsAll = donationPrograms.reduce((acc, p) => acc + p.donorCount, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Spiritual Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/90 text-white shadow-xs">
            <Heart size={14} fill="currentColor" />
            <span>Tabungan Akhirat EKSIS • Infaq, Sedekah & Wakaf Produktif</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Investasi Abadi untuk Negeri & Akhirat Bersama Yayasan Mahkota Cahaya Abadi
          </h1>

          <p className="text-xs sm:text-base text-slate-200 leading-relaxed">
            Harta yang sesungguhnya adalah apa yang kita sedekahkan di jalan Allah. Salurkan infaq, sedekah modal usaha bergulir dhuafa, beasiswa tahfidz, dan wakaf produktif secara transparan & amanah langsung ke rekening resmi yayasan.
          </p>

          <div className="italic text-xs text-emerald-200 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 max-w-2xl leading-relaxed">
            "Perumpamaan orang yang menafkahkan hartanya di jalan Allah seperti sebutir benih yang menumbuhkan tujuh bulir, pada tiap-tiap bulir seratus biji. Allah melipatgandakan bagi siapa yang Dia kehendaki."
            <span className="block not-italic font-bold text-amber-300 mt-1">
              — QS. Al-Baqarah: 261
            </span>
          </div>
        </div>

        {/* Dedicated Bank Account Highlight Box */}
        <div className="mt-8 pt-6 border-t border-emerald-800/60 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-emerald-300 font-bold block uppercase tracking-wider">
                Rekening Resmi Penerima Donasi
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg sm:text-xl font-bold text-white">
                  Bank Syariah Indonesia (BSI)
                </span>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded">
                  BSI
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-wider text-amber-300 font-mono mt-0.5">
                7149719649
              </div>
              <span className="text-xs text-emerald-100 block mt-0.5">
                a.n. <strong>YAYASAN MAHKOTA CAHAYA ABADI</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                id="btn-copy-bsi-donation"
                onClick={handleCopyBSI}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedBank ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copiedBank ? 'Tersalin!' : 'Salin No. Rekening'}</span>
              </button>

              <button
                onClick={() => {
                  if (donationPrograms.length > 0) handleOpenDonate(donationPrograms[0]);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <HeartHandshake size={16} />
                <span>Kirim Donasi Sekarang</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col justify-center text-center">
            <span className="text-[11px] text-emerald-300 block">Total Dana Terhimpun</span>
            <span className="text-2xl font-black text-white mt-1">
              {formatRupiah(totalCollectedAll)}
            </span>
            <span className="text-xs text-amber-300 mt-1 font-semibold">
              Dari {totalDonorsAll} Dermawan / Muhsinin
            </span>
          </div>
        </div>
      </div>

      {/* Program Donation Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Program Tabungan Akhirat
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Disalurkan secara tepat sasaran oleh Yayasan Mahkota Cahaya Abadi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationPrograms.map((program) => {
            const percent = Math.min(100, Math.round((program.collectedAmount / program.targetAmount) * 100));

            return (
              <div
                key={program.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-400 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 bg-emerald-700/90 text-white text-[10px] font-extrabold uppercase rounded-lg shadow-2xs">
                        {program.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        {program.foundationName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-2 leading-snug">
                        {program.title}
                      </h3>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-emerald-700">
                          {formatRupiah(program.collectedAmount)}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Target {formatRupiah(program.targetAmount)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{percent}% Terpenuhi</span>
                        <span>{program.donorCount} Donatur</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                      Rekening Penyaluran: <strong>{program.bankInfo}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenDonate(program)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <HeartHandshake size={16} />
                    <span>Donasi Sekarang</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Blessings / Donatur Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Untaian Doa & Jejak Sedekah Muhsinin
              </h3>
              <p className="text-xs text-slate-500">
                Semoga Allah membalas dengan kebaikan yang berlipat ganda
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {donations.map((don) => (
            <div
              key={don.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {don.isAnonymous ? 'Hamba Allah' : don.donorName}
                </span>
                <span className="font-bold text-emerald-700">
                  {formatRupiah(don.amount)}
                </span>
              </div>

              <span className="text-[11px] text-slate-500 block">
                Untuk: {don.programTitle}
              </span>

              {don.prayerOrNote && (
                <p className="text-slate-600 italic text-[11px] bg-white p-2.5 rounded-lg border border-slate-100">
                  "{don.prayerOrNote}"
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{don.date}</span>
                <span className="text-emerald-600 font-semibold">Terkonfirmasi</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DONATION FORM MODAL */}
      {selectedProgramForDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setSelectedProgramForDonation(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                Tabungan Akhirat
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Salurkan Sedekah & Infaq
              </h3>
              <p className="text-xs text-slate-500">
                {selectedProgramForDonation.title}
              </p>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-4 text-xs">
              {/* Preset Amounts */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Pilih Nominal Infaq / Sedekah
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {formatRupiah(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Atau Masukkan Nominal Lain (Rp)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-slate-900"
                />
              </div>

              {/* Destination Bank BSI 7149719649 */}
              <div className="bg-gradient-to-br from-emerald-950 to-teal-950 text-white p-4 rounded-2xl space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                  Rekening Tujuan Yayasan Mahkota Cahaya Abadi
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Bank Syariah Indonesia (BSI)</span>
                  <span className="font-mono text-base font-black text-amber-300">
                    7149719649
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 block">
                  Atas Nama: <strong>YAYASAN MAHKOTA CAHAYA ABADI</strong>
                </span>
              </div>

              {/* Donor info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">Nama Donatur</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                    <span className="text-[11px]">Sembunyikan Nama (Hamba Allah)</span>
                  </label>
                </div>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Nama Lengkap Donatur"
                    required={!isAnonymous}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Nomor WhatsApp (Untuk Pengiriman Tanda Terima Digital)
                </label>
                <input
                  type="text"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Titipan Doa / Harapan Kebaikan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={donorPrayer}
                  onChange={(e) => setDonorPrayer(e.target.value)}
                  placeholder="Tuliskan doa atau niat sedekah (contoh: Untuk almarhum orang tua, keberkahan usaha...)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedProgramForDonation(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Heart size={15} fill="currentColor" />
                  <span>Kirim Donasi & Terbitkan Bukti</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT / BUKTI DONASI DIGITAL MODAL */}
      {latestReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-500 text-center relative animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Tanda Terima Donasi Sah
            </span>

            <h3 className="text-xl font-black text-slate-900 mt-2">
              Jazakumullah Khairan Katsiran
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Terima kasih atas infaq/sedekah Anda untuk program kebaikan Tabungan Akhirat.
            </p>

            {/* Receipt Card */}
            <div className="my-5 p-5 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl border border-emerald-600/50 shadow-md text-left text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-700/50 pb-2">
                <span className="font-mono text-amber-300 font-bold">
                  {latestReceipt.receiptNumber}
                </span>
                <span className="text-[10px] text-emerald-200">
                  {latestReceipt.date}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-300 block">Nama Donatur</span>
                <span className="font-bold text-white text-sm">
                  {latestReceipt.donorName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-300 block">Program Kebaikan</span>
                <span className="font-semibold text-white">
                  {latestReceipt.programTitle}
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-800/50 flex justify-between items-center">
                <span className="text-xs text-emerald-200">Jumlah Donasi:</span>
                <span className="text-base font-black text-amber-300">
                  {formatRupiah(latestReceipt.amount)}
                </span>
              </div>

              <div className="text-[10px] text-emerald-200/80 pt-2 border-t border-emerald-800/50 text-center">
                Disalurkan via BSI 7149719649 a.n. Yayasan Mahkota Cahaya Abadi
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Unduh Bukti</span>
              </button>

              <button
                onClick={() => setLatestReceipt(null)}
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
