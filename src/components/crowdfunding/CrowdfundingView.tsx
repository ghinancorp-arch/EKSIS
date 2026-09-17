import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CrowdfundingProject, SyariahContractType } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Coins,
  TrendingUp,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Filter,
  PlusCircle,
  FileText,
  Award,
  DollarSign,
  AlertCircle,
  Percent,
  Calculator,
  UserCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Briefcase,
  Lock,
  Factory,
  Check,
} from 'lucide-react';

export const CrowdfundingView: React.FC = () => {
  const {
    crowdfundingProjects,
    investInProject,
    addCrowdfundingProject,
    currentUser,
    activeRole,
    switchRole,
    setCurrentView,
    addNotification,
    setIsAuthModalOpen,
    setAuthModalType,
    producerProfiles,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedContract, setSelectedContract] = useState<string>('Semua');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'funded'>('all');

  // Modals state
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<CrowdfundingProject | null>(null);
  const [selectedProjectForInvest, setSelectedProjectForInvest] = useState<CrowdfundingProject | null>(null);
  const [isSubmitProposalOpen, setIsSubmitProposalOpen] = useState(false);
  const [isProducerRestrictionModalOpen, setIsProducerRestrictionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [investmentSuccessCertificate, setInvestmentSuccessCertificate] = useState<{
    certNumber: string;
    projectTitle: string;
    businessName: string;
    amount: number;
    lotsCount: number;
    contract: string;
    roi: number;
  } | null>(null);

  // Investment form state
  const [lotsToBuy, setLotsToBuy] = useState<number>(1);
  const [ijabQabulAccepted, setIjabQabulAccepted] = useState<boolean>(false);
  const [investorPhone, setInvestorPhone] = useState<string>(currentUser.phone || '');

  // Proposal form state
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalBusinessName, setProposalBusinessName] = useState('');
  const [proposalCategory, setProposalCategory] = useState<'kuliner' | 'fashion' | 'herbal' | 'agribisnis' | 'manufaktur'>('kuliner');
  const [proposalContract, setProposalContract] = useState<SyariahContractType>('mudharabah');
  const [proposalTarget, setProposalTarget] = useState<number>(50000000);
  const [proposalMinInvest, setProposalMinInvest] = useState<number>(100000);
  const [proposalRoi, setProposalRoi] = useState<number>(18);
  const [proposalTenor, setProposalTenor] = useState<number>(12);
  const [proposalRatio, setProposalRatio] = useState('70:30');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalFundsUse, setProposalFundsUse] = useState('');

  const categories = ['Semua', 'kuliner', 'fashion', 'herbal', 'agribisnis', 'manufaktur'];

  // Handle open proposal: RESTRICTED TO REGISTERED PRODUCERS ONLY
  const handleOpenProposal = () => {
    if (currentUser.role !== 'producer') {
      setIsProducerRestrictionModalOpen(true);
      return;
    }
    const myProfile = producerProfiles.find((p) => p.userId === currentUser.id);
    if (myProfile) {
      setProposalBusinessName(myProfile.companyName);
    }
    setIsSubmitProposalOpen(true);
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return crowdfundingProjects.filter((p) => {
      if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false;
      if (selectedContract !== 'Semua' && p.contractType !== selectedContract) return false;
      if (activeTab === 'active' && p.status !== 'funding') return false;
      if (activeTab === 'funded' && p.status !== 'funded' && p.status !== 'running') return false;
      return true;
    });
  }, [crowdfundingProjects, selectedCategory, selectedContract, activeTab]);

  // Handle open investment modal
  const handleOpenInvest = (project: CrowdfundingProject) => {
    setSelectedProjectForInvest(project);
    setLotsToBuy(1);
    setIjabQabulAccepted(false);
  };

  // Submit investment
  const handleExecuteInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForInvest) return;

    if (!ijabQabulAccepted) {
      showToast('Harap menyetujui akad Ijab & Qabul syariah', 'error');
      return;
    }

    const totalAmount = lotsToBuy * selectedProjectForInvest.minInvestment;
    const certNumber = `SUKUK-EKSIS-${Date.now().toString().slice(-6)}`;

    investInProject(selectedProjectForInvest.id, lotsToBuy);

    setInvestmentSuccessCertificate({
      certNumber,
      projectTitle: selectedProjectForInvest.title,
      businessName: selectedProjectForInvest.businessName,
      amount: totalAmount,
      lotsCount: lotsToBuy,
      contract: selectedProjectForInvest.contractType.toUpperCase(),
      roi: selectedProjectForInvest.expectedRoiAnnual,
    });

    setSelectedProjectForInvest(null);
  };

  // Submit proposal
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim() || !proposalBusinessName.trim() || proposalTarget <= 0) {
      showToast('Mohon lengkapi data permodalan usaha', 'error');
      return;
    }

    const fundsArray = proposalFundsUse
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addCrowdfundingProject({
      title: proposalTitle,
      businessName: proposalBusinessName,
      ownerName: currentUser.name,
      ownerUserId: currentUser.id,
      category: proposalCategory,
      contractType: proposalContract,
      targetAmount: proposalTarget,
      minInvestment: proposalMinInvest,
      expectedRoiAnnual: proposalRoi,
      tenorMonths: proposalTenor,
      payoutFrequency: 'Bulanan',
      profitSharingRatio: proposalRatio,
      description: proposalDescription,
      image:
        proposalCategory === 'kuliner'
          ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
      status: 'funding',
      daysLeft: 45,
      useOfFunds: fundsArray.length > 0 ? fundsArray : ['Pembelian Bahan Baku 50%', 'Pengembangan Kapasitas 30%', 'Pemasaran 20%'],
      highlights: ['Produsen Terverifikasi EKSIS', 'Akad Syariah Murni', 'Tergabung dalam Ekosistem Bisnis EKSIS'],
    });

    addNotification({
      targetRole: 'admin',
      title: 'Pengajuan Permodalan Produsen Baru',
      message: `Produsen ${currentUser.name} (${proposalBusinessName}) mengajukan permodalan ${proposalTitle} senilai ${formatRupiah(proposalTarget)}.`,
      type: 'account',
    });

    showToast('Pengajuan permodalan UMKM berhasil dikirim & sedang diverifikasi', 'success');
    setIsSubmitProposalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner: Permodalan & Crowdfunding Syariah */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
            <Coins size={14} />
            <span>Permodalan Syariah Bebas Riba • Securities Crowdfunding</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Gotong Royong Permodalan UMKM & Investasi Syariah Berkah
          </h1>

          <p className="text-xs sm:text-base text-slate-200 leading-relaxed">
            Wadah investasi syariah terpercaya untuk mendanai ekspansi usaha produsen & mitra UMKM EKSIS dengan akad Mudharabah, Musyarakah, dan Murabahah. Nikmati proyeksi bagi hasil 15% – 22% p.a. yang diawasi langsung oleh Dewan Pengawas Syariah.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="btn-crowdfunding-propose"
              onClick={handleOpenProposal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Ajukan Permodalan Usaha</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-950/20 text-slate-950 rounded font-black uppercase tracking-wider">
                Khusus Produsen
              </span>
            </button>

            {activeRole !== 'investor' ? (
              <button
                onClick={() => switchRole('investor')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserCheck size={16} />
                <span>Masuk Akun Member Investor</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('investor_dashboard')}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp size={16} />
                <span>Dashboard Portofolio Saya</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Key Statistics Strip */}
        <div className="mt-8 pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-emerald-300 block">Total Dana Tersalurkan</span>
            <span className="text-lg sm:text-2xl font-black text-white">Rp 2.45 Miliar</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300 block">UMKM Terbiayai</span>
            <span className="text-lg sm:text-2xl font-black text-amber-300">48 Mitra</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300 block">Rata-rata ROI Bagi Hasil</span>
            <span className="text-lg sm:text-2xl font-black text-emerald-400">18.5% p.a.</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300 block">Tingkat Pengembalian (TKB90)</span>
            <span className="text-lg sm:text-2xl font-black text-white">100% Amanah</span>
          </div>
        </div>
      </div>

      {/* Syariah Contracts Explanation Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-1">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>Akad Mudharabah</span>
          </div>
          <p className="text-emerald-800 leading-relaxed text-[11px]">
            Kerjasama 100% modal dari investor (Shahibul Maal), keahlian usaha dari UMKM (Mudharib). Keuntungan dibagi sesuai nisbah yang disepakati di awal.
          </p>
        </div>

        <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1">
            <Building2 size={16} className="text-amber-700" />
            <span>Akad Musyarakah</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            Penyertaan modal bersama antara pemodal dan mitra pengelola untuk ekspansi cabang atau fasilitas produksi dengan pembagian hasil berimbang.
          </p>
        </div>

        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 font-bold text-blue-900 text-sm mb-1">
            <Award size={16} className="text-blue-700" />
            <span>Rekening Escrow BSI</span>
          </div>
          <p className="text-blue-800 leading-relaxed text-[11px]">
            Penyaluran modal diawasi rekening kustodi resmi <strong>BSI 7198606228</strong> a/n EKSIS BISNIS SYARIAH untuk memastikan dana hanya dipakai untuk proyek terkait.
          </p>
        </div>
      </div>

      {/* Filter and Projects Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Daftar Proyek Permodalan Syariah
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih peluang investasi bisnis halal dengan proyeksi bagi hasil bulanan yang menarik
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Proyek
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sedang Funding
            </button>
            <button
              onClick={() => setActiveTab('funded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'funded'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terdanai / Berjalan
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                selectedCategory === c
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c === 'kuliner' ? 'Kuliner (F&B)' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Coins size={40} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Tidak Ada Proyek Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Pilih kategori atau status proyek yang lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const percentFunded = Math.min(
              100,
              Math.round((project.collectedAmount / project.targetAmount) * 100)
            );

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-400 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase rounded-lg shadow-2xs">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-1 bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase rounded-lg shadow-2xs">
                        Akad {project.contractType}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-xs">
                      ROI {project.expectedRoiAnnual}% p.a.
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-xs text-slate-500 font-semibold block">
                        {project.businessName} • {project.ownerName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-2 leading-snug">
                        {project.title}
                      </h3>
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-emerald-700">
                          {formatRupiah(project.collectedAmount)}
                        </span>
                        <span className="text-slate-500 font-medium">
                          dari {formatRupiah(project.targetAmount)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentFunded}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{percentFunded}% Terdanai</span>
                        <span>{project.investorCount} Pemodal Tergabung</span>
                      </div>
                    </div>

                    {/* Key Investment Terms Grid */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Min. Investasi</span>
                        <span className="font-bold text-slate-800">
                          {formatRupiah(project.minInvestment)}/lot
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Tenor Pembiayaan</span>
                        <span className="font-bold text-slate-800">{project.tenorMonths} Bulan</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Penyaluran Hasil</span>
                        <span className="font-bold text-slate-800">{project.payoutFrequency}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Nisbah Bagi Hasil</span>
                        <span className="font-bold text-emerald-700">
                          {project.profitSharingRatio}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProjectForDetail(project)}
                    className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Detail Proyek
                  </button>

                  <button
                    disabled={project.status !== 'funding'}
                    onClick={() => handleOpenInvest(project)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Coins size={14} />
                    <span>{project.status === 'funding' ? 'Investasi Sekarang' : 'Terdanai'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedProjectForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProjectForDetail(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                  <ShieldCheck size={14} />
                  <span>Akad {selectedProjectForDetail.contractType.toUpperCase()} Syariah</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedProjectForDetail.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Badan Usaha: <strong>{selectedProjectForDetail.businessName}</strong> • Pengelola: {selectedProjectForDetail.ownerName}
                </p>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedProjectForDetail.image}
                  alt={selectedProjectForDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Highlights & Financials */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-xs">
                <div>
                  <span className="text-[11px] text-emerald-800 block">Kebutuhan Modal</span>
                  <span className="font-black text-emerald-950 text-sm">
                    {formatRupiah(selectedProjectForDetail.targetAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-800 block">Proyeksi ROI</span>
                  <span className="font-black text-amber-600 text-sm">
                    {selectedProjectForDetail.expectedRoiAnnual}% p.a.
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-800 block">Nisbah Bagi Hasil</span>
                  <span className="font-black text-slate-900 text-sm">
                    {selectedProjectForDetail.profitSharingRatio}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-800 block">Tenor</span>
                  <span className="font-black text-slate-900 text-sm">
                    {selectedProjectForDetail.tenorMonths} Bulan
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                <h4 className="font-bold text-slate-900 text-sm">Deskripsi Proyek & Usaha</h4>
                <p>{selectedProjectForDetail.description}</p>
              </div>

              {/* Rencana Penggunaan Dana (Use of Funds) */}
              {selectedProjectForDetail.useOfFunds && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Alokasi Penggunaan Modal</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedProjectForDetail.useOfFunds.map((u, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legalitas & Dewan Pengawas Syariah */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-600" />
                  <span>Jaminan Akad & Legalitas Usaha</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Usaha telah diverifikasi memiliki NIB resmi ({selectedProjectForDetail.nibOrLegalDoc || 'NIB-912000382910'}). Seluruh kontrak pembiayaan menggunakan template baku Dewan Pengawas Syariah EKSIS tanpa unsur riba, gharar, maupun maysir.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedProjectForDetail(null)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const p = selectedProjectForDetail;
                    setSelectedProjectForDetail(null);
                    handleOpenInvest(p);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Coins size={16} />
                  <span>Lanjut Investasi Proyek Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVESTMENT MODAL (PILIHAN INVESTASI) */}
      {selectedProjectForInvest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setSelectedProjectForInvest(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                Akad {selectedProjectForInvest.contractType}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Pilihan Investasi Syariah
              </h3>
              <p className="text-xs text-slate-500">
                {selectedProjectForInvest.title} ({selectedProjectForInvest.businessName})
              </p>
            </div>

            <form onSubmit={handleExecuteInvestment} className="space-y-4 text-xs">
              {/* Lots Input & Return Calculator */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Jumlah Lembar / Lot Investasi
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formatRupiah(selectedProjectForInvest.minInvestment)} / lot
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLotsToBuy((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer text-base"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={lotsToBuy}
                    onChange={(e) => setLotsToBuy(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-center font-black text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setLotsToBuy((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer text-base"
                  >
                    +
                  </button>
                </div>

                {/* Return Projection Calculator */}
                <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Nilai Investasi:</span>
                    <strong className="text-emerald-800 text-sm">
                      {formatRupiah(lotsToBuy * selectedProjectForInvest.minInvestment)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimasi Bagi Hasil Bulanan:</span>
                    <strong className="text-amber-600">
                      {formatRupiah(
                        Math.round(
                          ((lotsToBuy * selectedProjectForInvest.minInvestment * (selectedProjectForInvest.expectedRoiAnnual / 100)) / 12)
                        )
                      )} / bln
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Estimasi Pengembalian ({selectedProjectForInvest.tenorMonths} bln):</span>
                    <strong className="text-slate-900">
                      {formatRupiah(
                        Math.round(
                          lotsToBuy * selectedProjectForInvest.minInvestment * (1 + (selectedProjectForInvest.expectedRoiAnnual / 100) * (selectedProjectForInvest.tenorMonths / 12))
                        )
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Destination Escrow Bank BSI */}
              <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300 font-semibold">
                    Rekening Escrow Penampungan Resmi
                  </span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                    BSI
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 block">Bank Syariah Indonesia (BSI)</span>
                    <span className="text-lg font-black tracking-wider font-mono text-white">
                      7198606228
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-200 block">
                  Atas Nama: <strong>EKSIS BISNIS SYARIAH (ESCROW CROWDFUNDING)</strong>
                </span>
              </div>

              {/* Ijab & Qabul Checklist */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="ijab-qabul"
                    checked={ijabQabulAccepted}
                    onChange={(e) => setIjabQabulAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="ijab-qabul" className="text-[11px] text-amber-950 leading-relaxed cursor-pointer">
                    <strong>Pernyataan Ijab & Qabul Syariah:</strong><br />
                    <em>"Bismillahir Rahmanir Rahim. Saya menyatakan dengan sadar menginvestasikan dana sejumlah {formatRupiah(lotsToBuy * selectedProjectForInvest.minInvestment)} untuk modal usaha {selectedProjectForInvest.businessName} dengan akad {selectedProjectForInvest.contractType.toUpperCase()} saling ridho (Antaradin Minkum) sesuai ketentuan syariat Islam."</em>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForInvest(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!ijabQabulAccepted}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck size={16} />
                  <span>Konfirmasi & Terbitkan Sukuk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVESTMENT SUCCESS / CERTIFICATE MODAL */}
      {investmentSuccessCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-500 text-center relative animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              Transaksi Sah & Berkah
            </span>

            <h3 className="text-xl font-black text-slate-900 mt-2">
              Sertifikat Investasi Sukuk Diterbitkan
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Alhamdulillah, penyertaan modal syariah Anda telah tercatat secara resmi dalam sistem EKSIS Crowdfunding.
            </p>

            {/* Certificate Card Preview */}
            <div className="my-5 p-5 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl border border-emerald-500/50 shadow-lg text-left text-xs space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-emerald-700/50 pb-2">
                <span className="font-mono text-amber-300 font-bold">
                  {investmentSuccessCertificate.certNumber}
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-semibold">
                  AKAD {investmentSuccessCertificate.contract}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-200 block">Nama Mitra Usaha</span>
                <span className="font-extrabold text-sm text-white">
                  {investmentSuccessCertificate.businessName}
                </span>
                <span className="text-[11px] text-slate-300 block">
                  {investmentSuccessCertificate.projectTitle}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-800/40">
                <div>
                  <span className="text-[10px] text-emerald-300">Nilai Investasi</span>
                  <span className="font-bold block text-sm text-amber-300">
                    {formatRupiah(investmentSuccessCertificate.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300">Jumlah Kepemilikan</span>
                  <span className="font-bold block text-sm text-white">
                    {investmentSuccessCertificate.lotsCount} Lembar Lot
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-emerald-200/80 pt-2 border-t border-emerald-800/50 text-center">
                Rekening Penampungan: BSI 7198606228 • EKSIS Bisnis Syariah
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  setInvestmentSuccessCertificate(null);
                  setCurrentView('investor_dashboard');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <TrendingUp size={15} />
                <span>Buka Dashboard Investor</span>
              </button>

              <button
                onClick={() => setInvestmentSuccessCertificate(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Kembali ke Katalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT PROPOSAL MODAL (FOR UMKM) */}
      {isSubmitProposalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitProposalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-[11px] flex items-center gap-1.5">
                  <Factory size={13} />
                  <span>Akun Produsen Terverifikasi</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  ID: <strong className="text-slate-800">{currentUser.id}</strong>
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Pengajuan Permodalan Syariah UMKM
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dapatkan pendanaan dari jaringan pemodal syariah EKSIS untuk ekspansi kapasitas produksi & pembelian bahan baku.
              </p>
            </div>

            {/* Verified Producer Context Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 mb-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Produsen Pengaju:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rekening Resmi Pencairan:</span>
                <span className="font-bold text-emerald-800 font-mono">BSI 7198606228</span>
              </div>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Badan Usaha / Brand UMKM
                </label>
                <input
                  type="text"
                  value={proposalBusinessName}
                  onChange={(e) => setProposalBusinessName(e.target.value)}
                  placeholder="Contoh: Sambal Nusantara Berkah"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Judul Proyek Pendanaan
                </label>
                <input
                  type="text"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="Contoh: Ekspansi Dapur Produksi & Pengadaan Mesin Sealer"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Kategori Usaha
                  </label>
                  <select
                    value={proposalCategory}
                    onChange={(e) => setProposalCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="kuliner">Kuliner & F&B</option>
                    <option value="fashion">Fashion Muslim</option>
                    <option value="herbal">Herbal & Kosmetik</option>
                    <option value="agribisnis">Agribisnis & Peternakan</option>
                    <option value="manufaktur">Manufaktur & Logistik</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Akad Syariah Pilihan
                  </label>
                  <select
                    value={proposalContract}
                    onChange={(e) => setProposalContract(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="mudharabah">Mudharabah (Bagi Hasil)</option>
                    <option value="musyarakah">Musyarakah (Kemitraan Modal)</option>
                    <option value="murabahah">Murabahah (Jual Beli Aset)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Target Kebutuhan Dana (Rp)
                  </label>
                  <input
                    type="number"
                    step={1000000}
                    value={proposalTarget}
                    onChange={(e) => setProposalTarget(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tenor Pengembalian (Bulan)
                  </label>
                  <select
                    value={proposalTenor}
                    onChange={(e) => setProposalTenor(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan (1 Tahun)</option>
                    <option value={18}>18 Bulan</option>
                    <option value={24}>24 Bulan (2 Tahun)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Proyeksi Bagi Hasil (% p.a.)
                  </label>
                  <input
                    type="number"
                    value={proposalRoi}
                    onChange={(e) => setProposalRoi(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Usulan Nisbah (Pengelola : Pemodal)
                  </label>
                  <input
                    type="text"
                    value={proposalRatio}
                    onChange={(e) => setProposalRatio(e.target.value)}
                    placeholder="Contoh: 70:30"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deskripsi Singkat Usaha & Rencana Ekspansi
                </label>
                <textarea
                  rows={3}
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  placeholder="Ceritakan latar belakang bisnis, omset rata-rata bulanan, dan tujuan pendanaan..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Rencana Alokasi Dana (Tulis per baris)
                </label>
                <textarea
                  rows={2}
                  value={proposalFundsUse}
                  onChange={(e) => setProposalFundsUse(e.target.value)}
                  placeholder="Pengadaan Mesin Otomatis: 50%&#10;Bahan Baku Awal: 30%&#10;Pemasaran & Packaging: 20%"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSubmitProposalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Kirim Pengajuan Permodalan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCER ONLY RESTRICTION MODAL (User Requirement: Jadikan fitur permodalan hanya bagi produsen terdaftar) */}
      {isProducerRestrictionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in duration-150 text-center space-y-4">
            <button
              onClick={() => setIsProducerRestrictionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
              <Lock size={30} />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-[11px] font-extrabold rounded-full">
                Fitur Khusus Produsen Terdaftar EKSIS
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Akses Permodalan Dibatasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                Sesuai ketentuan kepatuhan syariah dan perlindungan dana investor EKSIS, pengajuan permodalan (Crowdfunding Sukuk) <strong>hanya dapat diajukan oleh Produsen / Manufaktur UMKM yang telah terdaftar & terverifikasi</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-left text-xs space-y-1.5">
              <div className="text-[11px] text-slate-500">Status Akun Anda Saat Ini:</div>
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>{currentUser.name}</span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center gap-1">
                <AlertCircle size={13} className="text-amber-600 shrink-0" />
                <span>Daftarkan brand/usaha Anda sebagai produsen untuk membuka fitur ini.</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                id="btn-restrict-register-producer"
                onClick={() => {
                  setIsProducerRestrictionModalOpen(false);
                  setAuthModalType('register_producer');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Factory size={16} />
                <span>Daftar Sebagai Produsen Baru</span>
              </button>

              <button
                id="btn-restrict-switch-producer"
                onClick={() => {
                  switchRole('producer');
                  setIsProducerRestrictionModalOpen(false);
                  const myProfile = producerProfiles.find((p) => p.userId === currentUser.id);
                  if (myProfile) {
                    setProposalBusinessName(myProfile.companyName);
                  }
                  setIsSubmitProposalOpen(true);
                }}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck size={16} />
                <span>Beralih ke Akun Produsen (Demo)</span>
              </button>

              <button
                onClick={() => setIsProducerRestrictionModalOpen(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border ${
              toastMessage.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
