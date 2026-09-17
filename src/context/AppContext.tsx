import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Product,
  ResellerProduct,
  Order,
  OrderStatus,
  ShippingRate,
  Wallet,
  WithdrawalRequest,
  NotificationItem,
  AuditLog,
  PlatformSettings,
  ResellerProfile,
  ProducerProfile,
  BankAccount,
  CrowdfundingProject,
  InvestmentRecord,
  DonationProgram,
  DonationRecord,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_RESELLER_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SHIPPING_RATES,
  INITIAL_WALLETS,
  INITIAL_WITHDRAWALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  INITIAL_RESELLER_PROFILES,
  INITIAL_PRODUCER_PROFILES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CROWDFUNDING_PROJECTS,
  INITIAL_INVESTMENTS,
  INITIAL_DONATION_PROGRAMS,
  INITIAL_DONATIONS,
} from '../data/mockData';

export interface CartItem {
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  sellingPrice: number;
  basePrice: number;
  marginPerItem: number;
  resellerId?: string;
  resellerName?: string;
}

export type AppView =
  | 'home'
  | 'reseller_dashboard'
  | 'producer_dashboard'
  | 'admin_dashboard'
  | 'my_orders'
  | 'crowdfunding'
  | 'investor_dashboard'
  | 'tabungan_akhirat';

interface AppContextType {
  // Auth & Roles
  currentUser: User;
  activeRole: UserRole;
  users: User[];
  resellerProfiles: ResellerProfile[];
  producerProfiles: ProducerProfile[];
  switchRole: (role: UserRole, userId?: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'rejected' | 'revision_required', note?: string) => void;
  registerReseller: (data: Partial<User> & Partial<ResellerProfile>) => void;
  registerProducer: (data: Partial<User> & Partial<ProducerProfile>) => void;
  registerInvestor: (data: Partial<User>) => void;

  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeReferralCode: string | null;
  setActiveReferralCode: (code: string | null) => void;
  activeReferralReseller: { user: User; profile: ResellerProfile } | null;

  // Catalog Access Control
  canAccessCatalog: boolean;

  // Fee & Syariah Calculations (2.5% Ujrah Platform Otomatis dari Harga Produsen)
  calculateAdminFee: (basePrice: number) => number;
  calculateResellerCostPrice: (basePrice: number) => number;

  // Bank Accounts Management (Rekening Pencairan BSI 7198606228)
  bankAccounts: BankAccount[];
  addBankAccount: (acc: Omit<BankAccount, 'id' | 'createdAt'>) => void;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  setPrimaryBankAccount: (id: string) => void;
  getUserBankAccounts: (userId?: string) => BankAccount[];
  getUserPrimaryBankAccount: (userId?: string) => BankAccount | undefined;

  // Crowdfunding & Permodalan Syariah UMKM
  crowdfundingProjects: CrowdfundingProject[];
  addCrowdfundingProject: (
    project: Omit<CrowdfundingProject, 'id' | 'collectedAmount' | 'soldLots' | 'status' | 'investorCount' | 'createdAt'>
  ) => void;
  investInProject: (
    projectId: string,
    lotsCount: number,
    paymentMethod: string,
    prayerOrNote?: string
  ) => InvestmentRecord | null;

  // Portofolio Investasi Syariah
  investments: InvestmentRecord[];

  // Tabungan Akhirat (Donasi Yayasan Mahkota Cahaya Abadi - BSI 7149719649)
  donationPrograms: DonationProgram[];
  donations: DonationRecord[];
  createDonation: (
    donData: Omit<DonationRecord, 'id' | 'date' | 'status' | 'receiptNumber'>
  ) => DonationRecord;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'moderationStatus' | 'soldCount' | 'reviewCount' | 'rating'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  moderateProduct: (id: string, status: 'approved' | 'rejected', note?: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Reseller Products
  resellerProducts: ResellerProduct[];
  saveResellerProductMargin: (productId: string, customPrice: number, customCaption?: string) => void;
  toggleResellerProductActive: (productId: string) => void;
  recordShareClick: (productId: string, platform: string) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Shipping & Orders
  shippingRates: ShippingRate[];
  calculateShipping: (origin: string, dest: string, weightGrams: number, courier: string) => ShippingRate[];
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingTimeline'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, trackingNumber?: string, courier?: string) => void;

  // Finance & Wallets
  wallets: Record<string, Wallet>;
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (amount: number, bankName: string, accountNum: string, holderName: string) => boolean;
  processWithdrawal: (withdrawalId: string, status: 'completed' | 'rejected', note?: string) => void;

  // Notifications & Audit Logs
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  auditLogs: AuditLog[];
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;

  // Modals & UI States
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalType: 'login' | 'register_reseller' | 'register_producer' | 'register_investor';
  setAuthModalType: (type: 'login' | 'register_reseller' | 'register_producer' | 'register_investor') => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isMarginModalOpen: boolean;
  setIsMarginModalOpen: (open: boolean) => void;
  marginModalProduct: Product | null;
  setMarginModalProduct: (prod: Product | null) => void;
  isBankAccountModalOpen: boolean;
  setIsBankAccountModalOpen: (open: boolean) => void;
  editingBankAccount: BankAccount | null;
  setEditingBankAccount: (acc: BankAccount | null) => void;
  isDonationModalOpen: boolean;
  setIsDonationModalOpen: (open: boolean) => void;
  selectedDonationProgramId: string | null;
  setSelectedDonationProgramId: (id: string | null) => void;
  selectedCrowdfundingId: string | null;
  setSelectedCrowdfundingId: (id: string | null) => void;
  resellerActiveTab: string;
  setResellerActiveTab: (tab: string) => void;
  producerActiveTab: string;
  setProducerActiveTab: (tab: string) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ghinan_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[3] || INITIAL_USERS[3]); // Reseller Ahmad Fauzi by default
  const [activeRole, setActiveRole] = useState<UserRole>('reseller');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [resellerProfiles, setResellerProfiles] = useState<ResellerProfile[]>(() => {
    const saved = localStorage.getItem('ghinan_reseller_profiles');
    return saved ? JSON.parse(saved) : INITIAL_RESELLER_PROFILES;
  });

  const [producerProfiles, setProducerProfiles] = useState<ProducerProfile[]>(() => {
    const saved = localStorage.getItem('ghinan_producer_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCER_PROFILES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ghinan_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [resellerProducts, setResellerProducts] = useState<ResellerProduct[]>(() => {
    const saved = localStorage.getItem('ghinan_reseller_products');
    return saved ? JSON.parse(saved) : INITIAL_RESELLER_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ghinan_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [shippingRates] = useState<ShippingRate[]>(INITIAL_SHIPPING_RATES);

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem('ghinan_wallets');
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('ghinan_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ghinan_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ghinan_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('ghinan_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Bank Accounts (Defaulting to BSI 7198606228)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('eksis_bank_accounts');
    return saved ? JSON.parse(saved) : INITIAL_BANK_ACCOUNTS;
  });

  // Crowdfunding Projects (Permodalan Syariah UMKM)
  const [crowdfundingProjects, setCrowdfundingProjects] = useState<CrowdfundingProject[]>(() => {
    const saved = localStorage.getItem('eksis_crowdfunding');
    return saved ? JSON.parse(saved) : INITIAL_CROWDFUNDING_PROJECTS;
  });

  // Portofolio Investasi
  const [investments, setInvestments] = useState<InvestmentRecord[]>(() => {
    const saved = localStorage.getItem('eksis_investments');
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
  });

  // Tabungan Akhirat / Donations (Yayasan Mahkota Cahaya Abadi - BSI 7149719649)
  const [donationPrograms] = useState<DonationProgram[]>(INITIAL_DONATION_PROGRAMS);
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('eksis_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Cart & UI
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeReferralCode, setActiveReferralCode] = useState<string | null>(null);

  // Modals & Popups
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register_reseller' | 'register_producer' | 'register_investor'>('login');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isMarginModalOpen, setIsMarginModalOpen] = useState<boolean>(false);
  const [marginModalProduct, setMarginModalProduct] = useState<Product | null>(null);

  // Bank Account Modal
  const [isBankAccountModalOpen, setIsBankAccountModalOpen] = useState<boolean>(false);
  const [editingBankAccount, setEditingBankAccount] = useState<BankAccount | null>(null);

  // Donation Modal & Crowdfunding Detail State
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [selectedDonationProgramId, setSelectedDonationProgramId] = useState<string | null>(null);
  const [selectedCrowdfundingId, setSelectedCrowdfundingId] = useState<string | null>(null);

  // Sub-tabs
  const [resellerActiveTab, setResellerActiveTab] = useState<string>('overview');
  const [producerActiveTab, setProducerActiveTab] = useState<string>('overview');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('overview');

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('ghinan_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('ghinan_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('ghinan_reseller_products', JSON.stringify(resellerProducts));
  }, [resellerProducts]);
  useEffect(() => {
    localStorage.setItem('ghinan_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('ghinan_wallets', JSON.stringify(wallets));
  }, [wallets]);
  useEffect(() => {
    localStorage.setItem('ghinan_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);
  useEffect(() => {
    localStorage.setItem('ghinan_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('ghinan_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('ghinan_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('eksis_bank_accounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);
  useEffect(() => {
    localStorage.setItem('eksis_crowdfunding', JSON.stringify(crowdfundingProjects));
  }, [crowdfundingProjects]);
  useEffect(() => {
    localStorage.setItem('eksis_investments', JSON.stringify(investments));
  }, [investments]);
  useEffect(() => {
    localStorage.setItem('eksis_donations', JSON.stringify(donations));
  }, [donations]);

  // Catalog Access Control:
  // "Sembunyikan katalog produk. Hanya member reseller yang dapat mengakses."
  // Reseller members, Producers, and Admins can view the catalog, OR visitors with a direct reseller referral code
  const canAccessCatalog = React.useMemo(() => {
    if (activeReferralCode) return true;
    return (
      currentUser.role === 'reseller' ||
      currentUser.role === 'producer' ||
      currentUser.role === 'admin'
    );
  }, [currentUser.role, activeReferralCode]);

  // Syariah Fee Calculations:
  // "Buat fee admin otomatis 2,5% dari harga produsen sebagai nilai jual ke reseller"
  const calculateAdminFee = (basePrice: number): number => {
    return Math.round(basePrice * 0.025);
  };

  const calculateResellerCostPrice = (basePrice: number): number => {
    return basePrice + calculateAdminFee(basePrice);
  };

  // Derived Active Referral Reseller
  const activeReferralReseller = React.useMemo(() => {
    if (!activeReferralCode) return null;
    const profile = resellerProfiles.find(
      (p) => p.referralCode.toLowerCase() === activeReferralCode.toLowerCase()
    );
    if (!profile) return null;
    const user = users.find((u) => u.id === profile.userId);
    return user ? { user, profile } : null;
  }, [activeReferralCode, resellerProfiles, users]);

  // Role Switcher
  const switchRole = (role: UserRole, userId?: string) => {
    setActiveRole(role);
    let targetUser: User | undefined;
    if (userId) {
      targetUser = users.find((u) => u.id === userId);
    } else {
      targetUser = users.find((u) => u.role === role);
    }
    if (targetUser) {
      setCurrentUser(targetUser);
    }

    // Automatically route to appropriate screen
    if (role === 'admin') {
      setCurrentView('admin_dashboard');
    } else if (role === 'reseller') {
      setCurrentView('reseller_dashboard');
    } else if (role === 'producer') {
      setCurrentView('producer_dashboard');
    } else if (role === 'investor') {
      setCurrentView('investor_dashboard');
    } else {
      setCurrentView('home');
    }
  };

  // Add Notification Helper
  const addNotification = (item: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      time: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Audit Log Helper
  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminName: currentUser.name,
      action,
      target,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // User Management
  const updateUserStatus = (userId: string, status: 'active' | 'rejected' | 'revision_required', note?: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    if (status === 'active') {
      addNotification({
        targetRole: targetUser.role,
        targetUserId: targetUser.id,
        title: 'Akun Disetujui!',
        message: `Selamat! Akun ${targetUser.role === 'reseller' ? 'Reseller' : 'Produsen'} Anda di Ghinan Online Shop telah disetujui dan sekarang aktif.`,
        type: 'account',
      });
      addAuditLog(`SETUJUI_${targetUser.role.toUpperCase()}`, targetUser.name, note || 'Akun berhasil diverifikasi & diaktifkan');
    } else if (status === 'rejected') {
      addNotification({
        targetRole: targetUser.role,
        targetUserId: targetUser.id,
        title: 'Pendaftaran Ditolak',
        message: `Mohon maaf, pendaftaran akun Anda belum dapat disetujui: ${note || 'Data tidak memenuhi kriteria'}.`,
        type: 'account',
      });
      addAuditLog(`TOLAK_${targetUser.role.toUpperCase()}`, targetUser.name, note || 'Pendaftaran ditolak');
    }
  };

  const registerReseller = (data: Partial<User> & Partial<ResellerProfile>) => {
    const newUserId = `user_reseller_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: data.name || 'Calon Reseller',
      email: data.email || '',
      phone: data.phone || '',
      role: 'reseller',
      status: settings.autoApproveReseller ? 'active' : 'pending_approval',
      createdAt: new Date().toISOString(),
      address: data.address,
      province: data.province,
      city: data.city,
      district: data.district,
      postalCode: data.postalCode,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    };

    const newProfile: ResellerProfile = {
      userId: newUserId,
      storeName: data.storeName || `${data.name} Store`,
      referralCode: (data.storeName || data.name || 'STORE').toUpperCase().replace(/\s+/g, '-').slice(0, 12),
      socialMediaUrl: data.socialMediaUrl,
      totalSales: 0,
      totalProfit: 0,
      activeProductsCount: 0,
    };

    setUsers((prev) => [newUser, ...prev]);
    setResellerProfiles((prev) => [newProfile, ...prev]);
    setWallets((prev) => ({
      ...prev,
      [newUserId]: {
        userId: newUserId,
        role: 'reseller',
        availableBalance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0,
        totalEarned: 0,
      },
    }));

    addNotification({
      targetRole: 'admin',
      title: 'Pendaftaran Reseller Baru',
      message: `${newUser.name} (${newProfile.storeName}) telah mendaftar dan membutuhkan persetujuan Admin.`,
      type: 'account',
    });

    setCurrentUser(newUser);
    setActiveRole('reseller');
    setCurrentView('reseller_dashboard');
  };

  const registerProducer = (data: Partial<User> & Partial<ProducerProfile>) => {
    const newUserId = `user_producer_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: data.name || 'Calon Produsen',
      email: data.email || '',
      phone: data.phone || '',
      role: 'producer',
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
      address: data.address,
      province: data.province,
      city: data.city,
      district: data.district,
      postalCode: data.postalCode,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop',
    };

    const newProfile: ProducerProfile = {
      userId: newUserId,
      companyName: data.companyName || `${data.name} Usaha Mandiri`,
      businessCategory: data.businessCategory || 'UMKM Nusantara',
      nibOrLegalNumber: data.nibOrLegalNumber,
      description: data.description || 'Produsen produk unggulan UMKM terdaftar.',
      bankName: data.bankName || 'BCA',
      bankAccountNumber: data.bankAccountNumber || '000000000',
      bankAccountHolder: data.bankAccountHolder || data.name || '',
      socialMediaOrMarketplaceLink: data.socialMediaOrMarketplaceLink,
      rating: 5.0,
      totalSold: 0,
    };

    setUsers((prev) => [newUser, ...prev]);
    setProducerProfiles((prev) => [newProfile, ...prev]);
    setWallets((prev) => ({
      ...prev,
      [newUserId]: {
        userId: newUserId,
        role: 'producer',
        availableBalance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0,
        totalEarned: 0,
      },
    }));

    addNotification({
      targetRole: 'admin',
      title: 'Pendaftaran Produsen Baru',
      message: `${newProfile.companyName} (${newUser.name}) telah mendaftar dan menunggu verifikasi legalitas usaha.`,
      type: 'account',
    });

    setCurrentUser(newUser);
    setActiveRole('producer');
    setCurrentView('producer_dashboard');
  };

  const registerInvestor = (data: Partial<User>) => {
    const newUserId = `user_investor_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: data.name || 'Member Pemodal Syariah',
      email: data.email || '',
      phone: data.phone || '',
      role: 'investor',
      status: 'active',
      createdAt: new Date().toISOString(),
      address: data.address,
      province: data.province,
      city: data.city,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop',
    };

    setUsers((prev) => [newUser, ...prev]);

    // Create default primary bank account for investor (BSI 7198606228)
    const newBa: BankAccount = {
      id: `ba_${Date.now()}`,
      userId: newUserId,
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '7198606228',
      accountHolder: newUser.name,
      isPrimary: true,
      label: 'Rekening Dividen BSI',
      createdAt: new Date().toISOString(),
    };
    setBankAccounts((prev) => [newBa, ...prev]);

    setWallets((prev) => ({
      ...prev,
      [newUserId]: {
        userId: newUserId,
        role: 'customer',
        availableBalance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0,
        totalEarned: 0,
      },
    }));

    addNotification({
      targetRole: 'admin',
      title: 'Member Pemodal Baru Terdaftar',
      message: `${newUser.name} telah mendaftar sebagai Investor/Pemodal Syariah EKSIS.`,
      type: 'account',
    });

    setCurrentUser(newUser);
    setActiveRole('investor');
    setCurrentView('investor_dashboard');
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'moderationStatus' | 'soldCount' | 'reviewCount' | 'rating'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      moderationStatus: 'approved', // Langsung terhubung ke katalog reseller untuk dipilih dan dijual
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    // Beri notifikasi ke seluruh reseller bahwa ada produk produsen baru yang bisa dipilih untuk dijual
    addNotification({
      targetRole: 'reseller',
      title: 'Produk Baru Tersedia di Katalog!',
      message: `Produsen ${productData.producerName} telah menambahkan produk "${productData.name}". Segera tentukan margin Anda dan mulai jual ke pembeli!`,
      type: 'product',
    });

    addNotification({
      targetRole: 'admin',
      title: 'Produk Produsen Terbit ke Katalog',
      message: `Produsen ${productData.producerName} menerbitkan produk baru "${productData.name}". Produk langsung terhubung ke listing reseller.`,
      type: 'product',
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const moderateProduct = (id: string, status: 'approved' | 'rejected', note?: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, moderationStatus: status } : p))
    );

    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    addNotification({
      targetRole: 'producer',
      targetUserId: prod.producerId,
      title: status === 'approved' ? 'Produk Disetujui' : 'Produk Memerlukan Revisi',
      message:
        status === 'approved'
          ? `Produk "${prod.name}" Anda telah disetujui Admin dan siap dipasarkan oleh reseller!`
          : `Produk "${prod.name}" ditolak/perlu revisi: ${note || 'Silakan lengkapi data produk'}.`,
      type: 'product',
    });

    addAuditLog('MODERASI_PRODUK', prod.name, `Status diubah menjadi ${status}. ${note || ''}`);
  };

  const updateProductStock = (id: string, newStock: number) => {
    let stockStatus: 'in_stock' | 'limited' | 'out_of_stock' = 'in_stock';
    if (newStock <= 0) stockStatus = 'out_of_stock';
    else if (newStock < 10) stockStatus = 'limited';

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock, stockStatus } : p))
    );

    const prod = products.find((p) => p.id === id);
    if (prod && newStock <= 5 && newStock > 0) {
      addNotification({
        targetRole: 'producer',
        targetUserId: prod.producerId,
        title: 'Peringatan Stok Menipis!',
        message: `Stok "${prod.name}" tersisa ${newStock} unit. Segera tambahkan persediaan.`,
        type: 'stock',
      });
    }
  };

  // Reseller Products Operations
  const saveResellerProductMargin = (productId: string, customPrice: number, customCaption?: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const resellerId = currentUser.id;
    // Syariah fee rule: 2.5% platform fee dari harga produsen sebagai nilai beli reseller
    const adminFee = Math.round(product.basePrice * 0.025);
    const resellerCostPrice = product.basePrice + adminFee;
    const calculatedMargin = customPrice - resellerCostPrice;

    setResellerProducts((prev) => {
      const existing = prev.find((rp) => rp.productId === productId && rp.resellerId === resellerId);
      if (existing) {
        return prev.map((rp) =>
          rp.id === existing.id
            ? { ...rp, customSellingPrice: customPrice, calculatedMargin, customCaption: customCaption || rp.customCaption, isActive: true }
            : rp
        );
      } else {
        const newRp: ResellerProduct = {
          id: `rp_${Date.now()}`,
          resellerId,
          productId,
          customSellingPrice: customPrice,
          calculatedMargin,
          isActive: true,
          viewsCount: 0,
          sharesCount: 0,
          soldCount: 0,
          customCaption: customCaption || product.description.slice(0, 150),
        };
        return [newRp, ...prev];
      }
    });

    // Update profile count
    setResellerProfiles((prev) =>
      prev.map((p) =>
        p.userId === resellerId
          ? { ...p, activeProductsCount: p.activeProductsCount + 1 }
          : p
      )
    );
  };

  const toggleResellerProductActive = (productId: string) => {
    const resellerId = currentUser.id;
    setResellerProducts((prev) =>
      prev.map((rp) =>
        rp.productId === productId && rp.resellerId === resellerId
          ? { ...rp, isActive: !rp.isActive }
          : rp
      )
    );
  };

  const recordShareClick = (productId: string, platform: string) => {
    const resellerId = currentUser.id;
    setResellerProducts((prev) =>
      prev.map((rp) =>
        rp.productId === productId && rp.resellerId === resellerId
          ? { ...rp, sharesCount: rp.sharesCount + 1 }
          : rp
      )
    );
  };

  // Cart operations
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (ci) => ci.product.id === item.product.id && ci.variantId === item.variantId
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  // Shipping Calculation
  const calculateShipping = (
    _origin: string,
    _dest: string,
    weightGrams: number,
    courier: string
  ): ShippingRate[] => {
    const kg = Math.max(1, Math.ceil(weightGrams / 1000));
    return shippingRates
      .filter((rate) => courier === 'all' || rate.courier.toLowerCase().includes(courier.toLowerCase()))
      .map((rate) => ({
        ...rate,
        costPerKg: rate.costPerKg * kg,
      }));
  };

  // Order Creation & Workflow
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingTimeline'>): Order => {
    const newOrderId = `GOS-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      createdAt: now,
      updatedAt: now,
      trackingTimeline: [
        {
          id: `tr_${Date.now()}_1`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          title: 'Pesanan Dibuat',
          description: orderData.resellerId
            ? `Pesanan berhasil dibuat melalui Reseller ${orderData.resellerStoreName || ''}`
            : 'Pesanan berhasil dibuat melalui Marketplace Ghinan Online Shop',
          completed: true,
        },
        {
          id: `tr_${Date.now()}_2`,
          time: orderData.paymentStatus === 'paid' ? 'Otomatis' : 'Menunggu',
          title: orderData.paymentStatus === 'paid' ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran',
          description: `Metode pembayaran: ${orderData.paymentMethod}`,
          completed: orderData.paymentStatus === 'paid',
          active: orderData.paymentStatus !== 'paid',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reduce stock
    orderData.items.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        updateProductStock(p.id, Math.max(0, p.stock - item.quantity));
      }
    });

    // Notify producer
    orderData.items.forEach((item) => {
      const isFromReseller = Boolean(orderData.resellerId);
      addNotification({
        targetRole: 'producer',
        targetUserId: item.producerId,
        title: isFromReseller
          ? '🔔 Pesanan Baru dari Link Reseller!'
          : '🔔 Pesanan Baru Masuk!',
        message: isFromReseller
          ? `Pesanan #${newOrderId} via Link Reseller "${orderData.resellerStoreName || orderData.resellerName || 'Mitra'}": Pembeli ${orderData.customerName} (${orderData.customerCity}) telah memesan ${item.quantity}x "${item.productName}". Pembayaran transfer BSI No. 7198606228 telah dikonfirmasi. Mohon segera dipacking & kirim.`
          : `Pesanan #${newOrderId}: Pembeli ${orderData.customerName} telah memesan ${item.quantity}x "${item.productName}". Pembayaran transfer BSI No. 7198606228 terverifikasi. Mohon segera diproses.`,
        type: 'order',
      });
    });

    // If via reseller, notify reseller & record pending margin
    if (orderData.resellerId) {
      addNotification({
        targetRole: 'reseller',
        targetUserId: orderData.resellerId,
        title: 'Penjualan Baru dari Pelanggan!',
        message: `Pelanggan ${orderData.customerName} memesan produk senilai total Rp${orderData.totalAmount.toLocaleString('id-ID')}. Margin Anda: Rp${orderData.resellerTotalMargin.toLocaleString('id-ID')}.`,
        type: 'order',
      });

      // Update reseller pending balance
      setWallets((prev) => {
        const currentWallet = prev[orderData.resellerId!] || {
          userId: orderData.resellerId!,
          role: 'reseller',
          availableBalance: 0,
          pendingBalance: 0,
          withdrawnBalance: 0,
          totalEarned: 0,
        };
        return {
          ...prev,
          [orderData.resellerId!]: {
            ...currentWallet,
            pendingBalance: currentWallet.pendingBalance + orderData.resellerTotalMargin,
          },
        };
      });
    }

    // Notify admin
    addNotification({
      targetRole: 'admin',
      title: 'Transaksi Pesanan Baru',
      message: `Pesanan #${newOrderId} senilai Rp${orderData.totalAmount.toLocaleString('id-ID')} masuk ke sistem. Biaya platform Rp${orderData.platformFee.toLocaleString('id-ID')}.`,
      type: 'order',
    });

    clearCart();
    return newOrder;
  };

  // Order Status Updates with Tracking Timeline Progression
  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    trackingNumber?: string,
    courier?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = [...order.trackingTimeline];

        const statusLabels: Record<OrderStatus, { title: string; desc: string }> = {
          waiting_payment: { title: 'Menunggu Pembayaran', desc: 'Menunggu transfer pembeli' },
          payment_received: { title: 'Pembayaran Diterima', desc: 'Pembayaran telah terverifikasi' },
          processing: { title: 'Pesanan Diproses', desc: 'Produsen menyiapkan pesanan' },
          packing: { title: 'Pesanan Dikemas', desc: 'Paket telah dipacking rapi oleh produsen' },
          shipping: {
            title: 'Diserahkan ke Kurir',
            desc: `Paket diserahkan ke kurir ${courier || order.shippingCourier} (Resi: ${trackingNumber || order.trackingNumber || 'Dalam proses'})`,
          },
          in_transit: { title: 'Dalam Perjalanan', desc: 'Paket sedang dikirim menuju alamat tujuan' },
          delivered: { title: 'Sampai Tujuan', desc: 'Paket telah tiba di alamat tujuan' },
          completed: { title: 'Pesanan Selesai', desc: 'Pesanan selesai & dana/margin telah dicairkan ke dompet' },
          cancelled: { title: 'Pesanan Dibatalkan', desc: 'Pesanan telah dibatalkan' },
          returned: { title: 'Pesanan Dikembalikan', desc: 'Pengembalian barang' },
        };

        const info = statusLabels[newStatus];
        updatedTimeline.push({
          id: `tr_${Date.now()}`,
          time: nowStr,
          title: info.title,
          description: info.desc,
          completed: true,
          active: true,
        });

        // If completed: release pending margin into availableBalance for reseller
        if (newStatus === 'completed') {
          if (order.resellerId) {
            setWallets((wPrev) => {
              const resWallet = wPrev[order.resellerId!] || {
                userId: order.resellerId!,
                role: 'reseller',
                availableBalance: 0,
                pendingBalance: 0,
                withdrawnBalance: 0,
                totalEarned: 0,
              };
              return {
                ...wPrev,
                [order.resellerId!]: {
                  ...resWallet,
                  availableBalance: resWallet.availableBalance + order.resellerTotalMargin,
                  pendingBalance: Math.max(0, resWallet.pendingBalance - order.resellerTotalMargin),
                  totalEarned: resWallet.totalEarned + order.resellerTotalMargin,
                },
              };
            });

            // Update reseller profile metrics
            setResellerProfiles((rpPrev) =>
              rpPrev.map((p) =>
                p.userId === order.resellerId
                  ? {
                      ...p,
                      totalSales: p.totalSales + 1,
                      totalProfit: p.totalProfit + order.resellerTotalMargin,
                    }
                  : p
              )
            );
          }

          // Credit Producer wallet
          order.items.forEach((it) => {
            const prodEarnings = it.basePrice * it.quantity;
            setWallets((wPrev) => {
              const prodWallet = wPrev[it.producerId] || {
                userId: it.producerId,
                role: 'producer',
                availableBalance: 0,
                pendingBalance: 0,
                withdrawnBalance: 0,
                totalEarned: 0,
              };
              return {
                ...wPrev,
                [it.producerId]: {
                  ...prodWallet,
                  availableBalance: prodWallet.availableBalance + prodEarnings,
                  totalEarned: prodWallet.totalEarned + prodEarnings,
                },
              };
            });
          });
        }

        return {
          ...order,
          orderStatus: newStatus,
          paymentStatus: newStatus !== 'waiting_payment' && newStatus !== 'cancelled' ? 'paid' : order.paymentStatus,
          trackingNumber: trackingNumber || order.trackingNumber,
          trackingTimeline: updatedTimeline,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Withdrawal logic
  const requestWithdrawal = (
    amount: number,
    bankName: string,
    accountNum: string,
    holderName: string
  ): boolean => {
    const userWallet = wallets[currentUser.id];
    if (!userWallet || userWallet.availableBalance < amount) {
      return false;
    }

    const newWd: WithdrawalRequest = {
      id: `WD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      amount,
      bankName,
      bankAccountNumber: accountNum,
      bankAccountHolder: holderName,
      status: 'pending',
      requestDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: 'Permintaan pencairan saldo',
    };

    setWithdrawals((prev) => [newWd, ...prev]);

    // Deduct available balance immediately into pending withdrawal
    setWallets((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...userWallet,
        availableBalance: userWallet.availableBalance - amount,
      },
    }));

    addNotification({
      targetRole: 'admin',
      title: 'Permintaan Tarik Saldo',
      message: `${currentUser.name} mengajukan penarikan saldo sebesar Rp${amount.toLocaleString('id-ID')} ke rekening ${bankName} ${accountNum}.`,
      type: 'wallet',
    });

    return true;
  };

  const processWithdrawal = (withdrawalId: string, status: 'completed' | 'rejected', note?: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id !== withdrawalId) return w;
        return {
          ...w,
          status,
          processedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: note || (status === 'completed' ? 'Pencairan berhasil ditransfer' : 'Pencairan ditolak'),
        };
      })
    );

    const wd = withdrawals.find((w) => w.id === withdrawalId);
    if (!wd) return;

    if (status === 'completed') {
      setWallets((prev) => {
        const w = prev[wd.userId];
        if (!w) return prev;
        return {
          ...prev,
          [wd.userId]: {
            ...w,
            withdrawnBalance: w.withdrawnBalance + wd.amount,
          },
        };
      });

      addNotification({
        targetRole: wd.userRole,
        targetUserId: wd.userId,
        title: 'Penarikan Saldo Berhasil',
        message: `Dana Rp${wd.amount.toLocaleString('id-ID')} telah berhasil ditransfer ke rekening ${wd.bankName} ${wd.bankAccountNumber}.`,
        type: 'wallet',
      });
      addAuditLog('SETUJUI_PENARIKAN_DANA', wd.id, `Dana Rp${wd.amount} dikirim ke ${wd.userName}`);
    } else {
      // Refund balance if rejected
      setWallets((prev) => {
        const w = prev[wd.userId];
        if (!w) return prev;
        return {
          ...prev,
          [wd.userId]: {
            ...w,
            availableBalance: w.availableBalance + wd.amount,
          },
        };
      });

      addNotification({
        targetRole: wd.userRole,
        targetUserId: wd.userId,
        title: 'Penarikan Saldo Ditolak',
        message: `Pengajuan penarikan dana Rp${wd.amount.toLocaleString('id-ID')} ditolak: ${note || 'Data rekening tidak sesuai'}. Saldo dikembalikan ke akun Anda.`,
        type: 'wallet',
      });
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('UPDATE_PENGATURAN_SISTEM', 'Platform Settings', 'Konfigurasi biaya & fee diubah');
  };

  // Bank Account Management Methods
  const addBankAccount = (acc: Omit<BankAccount, 'id' | 'createdAt'>) => {
    const newAcc: BankAccount = {
      ...acc,
      id: `ba_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBankAccounts((prev) => {
      const updated = acc.isPrimary
        ? prev.map((b) => (b.userId === acc.userId ? { ...b, isPrimary: false } : b))
        : [...prev];
      return [newAcc, ...updated];
    });
    addNotification({
      targetRole: currentUser.role,
      targetUserId: currentUser.id,
      title: 'Rekening Bank Ditambahkan',
      message: `Rekening ${acc.bankName} (${acc.accountNumber}) a.n. ${acc.accountHolder} berhasil ditambahkan.`,
      type: 'wallet',
    });
  };

  const updateBankAccount = (id: string, updates: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return { ...b, ...updates };
      })
    );
  };

  const deleteBankAccount = (id: string) => {
    setBankAccounts((prev) => prev.filter((b) => b.id !== id));
  };

  const setPrimaryBankAccount = (id: string) => {
    const target = bankAccounts.find((b) => b.id === id);
    if (!target) return;
    setBankAccounts((prev) =>
      prev.map((b) =>
        b.userId === target.userId ? { ...b, isPrimary: b.id === id } : b
      )
    );
  };

  const getUserBankAccounts = (userId?: string): BankAccount[] => {
    const uid = userId || currentUser.id;
    const userAccs = bankAccounts.filter((b) => b.userId === uid);
    if (userAccs.length === 0) {
      // Return platform default BSI 7198606228
      return [
        {
          id: `ba_default_${uid}`,
          userId: uid,
          bankName: 'Bank Syariah Indonesia (BSI)',
          accountNumber: '7198606228',
          accountHolder: currentUser.name || 'Mitra EKSIS Syariah',
          isPrimary: true,
          label: 'Rekening Utama BSI',
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return userAccs;
  };

  const getUserPrimaryBankAccount = (userId?: string): BankAccount | undefined => {
    const accs = getUserBankAccounts(userId);
    return accs.find((a) => a.isPrimary) || accs[0];
  };

  // Crowdfunding Projects & Investment Methods
  const addCrowdfundingProject = (
    project: Omit<CrowdfundingProject, 'id' | 'collectedAmount' | 'soldLots' | 'status' | 'investorCount' | 'createdAt'>
  ) => {
    const newProj: CrowdfundingProject = {
      ...project,
      id: `proj_${Date.now()}`,
      collectedAmount: 0,
      soldLots: 0,
      status: 'open',
      investorCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCrowdfundingProjects((prev) => [newProj, ...prev]);
    addNotification({
      targetRole: 'admin',
      title: 'Proyek Permodalan Syariah Diajukan',
      message: `${project.businessName} mengajukan permodalan sukuk/syariah "${project.title}".`,
      type: 'account',
    });
  };

  const investInProject = (
    projectId: string,
    lotsCount: number,
    paymentMethod: string,
    prayerOrNote?: string
  ): InvestmentRecord | null => {
    const project = crowdfundingProjects.find((p) => p.id === projectId);
    if (!project || project.status !== 'open') return null;

    const totalInvestment = lotsCount * project.pricePerLot;
    const newRecord: InvestmentRecord = {
      id: `inv_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      projectId: project.id,
      projectTitle: project.title,
      businessName: project.businessName,
      amount: totalInvestment,
      lotsCount,
      contractType: project.contractType,
      profitSharingRatio: project.profitSharingRatio,
      expectedRoiAnnual: project.projectedRoiAnnual,
      tenorMonths: project.tenorMonths,
      payoutFrequency: project.payoutFrequency,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'active',
      totalDividendsReceived: 0,
      certificateNumber: `SUKUK-EKSIS-${Date.now().toString().slice(-6)}`,
      ijabQabulConfirmed: true,
    };

    setCrowdfundingProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newCollected = p.collectedAmount + totalInvestment;
        const newSold = p.soldLots + lotsCount;
        const newStatus = newCollected >= p.targetAmount ? 'funded' : p.status;
        return {
          ...p,
          collectedAmount: newCollected,
          soldLots: newSold,
          investorCount: p.investorCount + 1,
          status: newStatus,
        };
      })
    );

    setInvestments((prev) => [newRecord, ...prev]);

    addNotification({
      targetRole: 'investor',
      targetUserId: currentUser.id,
      title: 'Investasi Syariah Berhasil!',
      message: `Akad ${project.contractType.toUpperCase()} berhasil dikonfirmasi. Anda resmi mendanai ${lotsCount} lot (Rp${totalInvestment.toLocaleString('id-ID')}) pada ${project.businessName}.`,
      type: 'wallet',
    });

    addAuditLog('INVESTASI_SYARIAH_BERHASIL', project.businessName, `Pemodal ${currentUser.name} mendanai Rp${totalInvestment}`);
    return newRecord;
  };

  // Tabungan Akhirat / Donations Methods
  const createDonation = (
    donData: Omit<DonationRecord, 'id' | 'date' | 'status' | 'receiptNumber'>
  ): DonationRecord => {
    const newDonation: DonationRecord = {
      ...donData,
      id: `don_${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'confirmed',
      receiptNumber: `TA-MCA-${Date.now().toString().slice(-6)}`,
    };

    setDonations((prev) => [newDonation, ...prev]);

    addNotification({
      targetRole: 'all',
      title: 'Infaq Tabungan Akhirat Diterima',
      message: `Alhamdulillah, sedekah Rp${donData.amount.toLocaleString('id-ID')} untuk "${donData.programTitle}" telah tercatat ke Rekening BSI 7149719649 Yayasan Mahkota Cahaya Abadi.`,
      type: 'account',
    });

    return newDonation;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        users,
        resellerProfiles,
        producerProfiles,
        switchRole,
        updateUserStatus,
        registerReseller,
        registerProducer,
        registerInvestor,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        activeReferralCode,
        setActiveReferralCode,
        activeReferralReseller,
        canAccessCatalog,
        calculateAdminFee,
        calculateResellerCostPrice,
        bankAccounts,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        setPrimaryBankAccount,
        getUserBankAccounts,
        getUserPrimaryBankAccount,
        crowdfundingProjects,
        addCrowdfundingProject,
        investInProject,
        investments,
        donationPrograms,
        donations,
        createDonation,
        products,
        addProduct,
        updateProduct,
        moderateProduct,
        updateProductStock,
        resellerProducts,
        saveResellerProductMargin,
        toggleResellerProductActive,
        recordShareClick,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        shippingRates,
        calculateShipping,
        orders,
        createOrder,
        updateOrderStatus,
        wallets,
        withdrawals,
        requestWithdrawal,
        processWithdrawal,
        notifications,
        markNotificationRead,
        addNotification,
        auditLogs,
        settings,
        updateSettings,
        selectedProductId,
        setSelectedProductId,
        trackingOrderId,
        setTrackingOrderId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalType,
        setAuthModalType,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isMarginModalOpen,
        setIsMarginModalOpen,
        marginModalProduct,
        setMarginModalProduct,
        isBankAccountModalOpen,
        setIsBankAccountModalOpen,
        editingBankAccount,
        setEditingBankAccount,
        isDonationModalOpen,
        setIsDonationModalOpen,
        selectedDonationProgramId,
        setSelectedDonationProgramId,
        selectedCrowdfundingId,
        setSelectedCrowdfundingId,
        resellerActiveTab,
        setResellerActiveTab,
        producerActiveTab,
        setProducerActiveTab,
        adminActiveTab,
        setAdminActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
