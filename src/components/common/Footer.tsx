import React from 'react';
import { GhinanLogo } from './GhinanLogo';
import { ShieldCheck, Store, Factory, MessageCircle, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setAuthModalType, setIsAuthModalOpen, setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <GhinanLogo size="lg" isDark={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>EKSIS (Ekosistem Bisnis Syariah)</strong> — Platform terpadu perdagangan digital syariah yang menghubungkan Produsen, Reseller, Pemodal Crowdfunding Sukuk, dan Program Sosial Tabungan Akhirat secara transparan & amanah.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck size={16} />
              <span>Diawasi Dewan Pengawas Syariah</span>
            </div>
          </div>

          {/* Col 2: Permodalan & Crowdfunding */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Store size={14} className="text-amber-400" />
              <span>Ekosistem Syariah</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('crowdfunding')}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Permodalan & Sukuk UMKM
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('investor_dashboard')}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Akun Member Investor
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tabungan_akhirat')}
                  className="hover:text-rose-400 cursor-pointer transition-colors text-left font-semibold text-rose-300"
                >
                  Tabungan Akhirat (BSI 7149719649)
                </button>
              </li>
              <li>Akad Mudharabah & Musyarakah</li>
              <li>Rekening Escrow BSI 7198606228</li>
            </ul>
          </div>

          {/* Col 3: Untuk Produsen & Reseller */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Factory size={14} className="text-emerald-400" />
              <span>Kemitraan Usaha</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setAuthModalType('register_reseller');
                    setIsAuthModalOpen(true);
                  }}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Daftar Member Reseller EKSIS
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthModalType('register_producer');
                    setIsAuthModalOpen(true);
                  }}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Daftar Produsen Mitra
                </button>
              </li>
              <li>Fee Admin 2,5% Transparan</li>
              <li>Katalog Tertutup Khusus Reseller</li>
              <li>Cetak Resi & Tracking Otomatis</li>
            </ul>
          </div>

          {/* Col 4: Layanan & Rekening Resmi */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle size={14} className="text-emerald-400" />
              <span>Rekening Resmi & Bantuan</span>
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div>
                <span className="text-slate-400 text-[10px] block">Rekening Pencairan Platform:</span>
                <span className="text-white font-mono font-bold">BSI 7198606228</span>
                <span className="text-[10px] text-emerald-400 block">a/n EKSIS BISNIS SYARIAH</span>
              </div>
              <div className="pt-1.5 border-t border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">Rekening Tabungan Akhirat:</span>
                <span className="text-amber-300 font-mono font-bold">BSI 7149719649</span>
                <span className="text-[10px] text-amber-200 block">a/n YAYASAN MAHKOTA CAHAYA ABADI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EKSIS (Ekosistem Bisnis Syariah). Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Kolaborasi Yayasan Mahkota Cahaya Abadi & Mitra UMKM Nasional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
