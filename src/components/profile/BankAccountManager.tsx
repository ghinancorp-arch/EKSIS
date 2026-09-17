import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BankAccount } from '../../types';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

interface BankAccountManagerProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onSelectAccount?: (account: BankAccount) => void;
}

export const BankAccountManager: React.FC<BankAccountManagerProps> = ({
  title = 'Rekening Pencairan Dana Syariah',
  subtitle = 'Kelola rekening Bank Syariah Indonesia (BSI) dan bank lainnya untuk pencairan saldo komisi, penjualan, dan dividen.',
  compact = false,
  onSelectAccount,
}) => {
  const {
    currentUser,
    bankAccounts,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setPrimaryBankAccount,
    showToast,
  } = useApp();

  const userAccounts = bankAccounts.filter((b) => b.userId === currentUser.id);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form fields
  const [bankName, setBankName] = useState('Bank Syariah Indonesia (BSI)');
  const [accountNumber, setAccountNumber] = useState('7198606228');
  const [accountHolder, setAccountHolder] = useState(currentUser.name || 'EKSIS BISNIS SYARIAH');
  const [branch, setBranch] = useState('KC BSI Jakarta');
  const [isPrimary, setIsPrimary] = useState(false);

  const supportedBanks = [
    'Bank Syariah Indonesia (BSI)',
    'Bank Muamalat Indonesia',
    'BCA Syariah',
    'Bank Mega Syariah',
    'Bank Mandiri',
    'Bank Central Asia (BCA)',
    'Bank Rakyat Indonesia (BRI)',
    'Bank Negara Indonesia (BNI)',
    'Bank Jago Syariah',
    'Bank Aladin Syariah',
  ];

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setBankName('Bank Syariah Indonesia (BSI)');
    setAccountNumber('7198606228');
    setAccountHolder(currentUser.name || 'EKSIS BISNIS SYARIAH');
    setBranch('KC BSI Sudirman');
    setIsPrimary(userAccounts.length === 0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: BankAccount) => {
    setEditingAccount(acc);
    setBankName(acc.bankName);
    setAccountNumber(acc.accountNumber);
    setAccountHolder(acc.accountHolder);
    setBranch(acc.branch || '');
    setIsPrimary(acc.isPrimary);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim() || !accountHolder.trim()) {
      showToast('Nomor rekening dan nama pemilik wajib diisi', 'error');
      return;
    }

    if (editingAccount) {
      updateBankAccount(editingAccount.id, {
        bankName,
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
        branch: branch.trim(),
        isPrimary,
      });
      showToast('Rekening pencairan berhasil diperbarui', 'success');
    } else {
      addBankAccount({
        userId: currentUser.id,
        bankName,
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
        branch: branch.trim(),
        isPrimary: isPrimary || userAccounts.length === 0,
        isVerified: true,
      });
      showToast('Rekening pencairan baru berhasil ditambahkan', 'success');
    }
    setIsModalOpen(false);
  };

  const handleCopyNumber = (accNumber: string, id: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedId(id);
    showToast('Nomor rekening disalin ke papan klip', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Building2 size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{subtitle}</p>
          )}
        </div>

        <button
          id="btn-add-bank-account"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Rekening</span>
        </button>
      </div>

      {/* Account List */}
      <div className="p-5 sm:p-6 space-y-4">
        {userAccounts.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <CreditCard size={36} className="mx-auto text-slate-400 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Belum Ada Rekening Tersimpan</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tambahkan rekening Bank Syariah Indonesia (BSI) atau bank syariah Anda untuk kemudahan penarikan dana & bagi hasil usaha.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              + Tambah Rekening BSI (7198606228)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => onSelectAccount && onSelectAccount(account)}
                className={`relative rounded-xl p-4 sm:p-5 border transition-all ${
                  account.isPrimary
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                } ${onSelectAccount ? 'cursor-pointer hover:shadow-xs' : ''}`}
              >
                {/* Primary Badge */}
                {account.isPrimary && (
                  <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                    <CheckCircle2 size={12} />
                    <span>UTAMA</span>
                  </div>
                )}

                {/* Bank icon & Name */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    {account.bankName.includes('BSI')
                      ? 'BSI'
                      : account.bankName.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="pr-16">
                    <span className="text-xs font-extrabold text-slate-800 block">
                      {account.bankName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {account.branch || 'Cabang Resmi Terdaftar'}
                    </span>
                  </div>
                </div>

                {/* Account Number & Copy */}
                <div className="mt-4 bg-slate-900/5 p-2.5 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Nomor Rekening
                    </span>
                    <span className="text-sm sm:text-base font-black tracking-wider text-slate-900 font-mono">
                      {account.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyNumber(account.accountNumber, account.id);
                    }}
                    title="Salin Nomor Rekening"
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedId === account.id ? (
                      <Check size={16} className="text-emerald-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                {/* Account Holder */}
                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Atas Nama</span>
                    <span className="font-bold text-slate-800 uppercase">
                      {account.accountHolder}
                    </span>
                  </div>

                  {account.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      <ShieldCheck size={13} />
                      <span>Terverifikasi</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons: Edit, Set Primary, Delete */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {!account.isPrimary && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimaryBankAccount(account.id);
                        }}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                      >
                        Jadikan Utama
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-edit-bank-${account.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(account);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-blue-700 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <Edit2 size={13} />
                      <span>Edit Rekening</span>
                    </button>

                    {userAccounts.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Hapus rekening ini dari daftar pencairan?')) {
                            deleteBankAccount(account.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                        title="Hapus Rekening"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security & Verification Notice */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Keamanan Dana & Verifikasi Rekening Syariah</span>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Seluruh transaksi penarikan saldo dan bagi hasil diproses otomatis melalui jaringan perbankan syariah resmi (BSI & mitra). Pastikan nama pada rekening bank identik dengan nama identitas Anda demi keamanan transaksi.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Bank Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              {editingAccount ? 'Edit Rekening Pencairan' : 'Tambah Rekening Bank Syariah'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Rekening ini digunakan untuk mentransfer saldo komisi, penjualan produk, dan hasil dividen sukuk.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pilih Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  {supportedBanks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Rekening
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Contoh: 7198606228"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  {accountNumber === '7198606228' && (
                    <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Rekening BSI EKSIS
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Pemilik Rekening (Sesuai Buku Tabungan)
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Nama Pemilik"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kantor Cabang (Opsional)
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Contoh: KC BSI Sudirman Jakarta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is-primary-checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="is-primary-checkbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Jadikan sebagai Rekening Utama Pencairan
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingAccount ? 'Simpan Perubahan' : 'Tambah Rekening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
