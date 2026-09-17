export type UserRole = 'admin' | 'producer' | 'reseller' | 'customer' | 'investor';

export type AccountStatus = 'pending_approval' | 'active' | 'rejected' | 'revision_required';

export type OrderStatus =
  | 'waiting_payment'
  | 'payment_received'
  | 'processing'
  | 'packing'
  | 'shipping'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';

export type StockStatus = 'in_stock' | 'limited' | 'out_of_stock';

export type ProductModerationStatus = 'pending_review' | 'approved' | 'rejected' | 'needs_revision';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: AccountStatus;
  createdAt: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export interface ResellerProfile {
  userId: string;
  storeName: string;
  referralCode: string;
  socialMediaUrl?: string;
  bio?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  totalSales: number;
  totalProfit: number;
  activeProductsCount: number;
}

export interface ProducerProfile {
  userId: string;
  companyName: string;
  businessCategory: string;
  nibOrLegalNumber?: string;
  description: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  socialMediaOrMarketplaceLink?: string;
  rating: number;
  totalSold: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  additionalPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  producerId: string;
  producerName: string;
  name: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  basePrice: number; // Producer cost price
  minResellerPrice: number; // Minimum reseller selling price set by producer/admin
  recommendedPrice: number; // Suggested selling price
  suggestedMargin: number; // Recommended margin
  stock: number;
  stockStatus: StockStatus;
  weightGrams: number;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  moderationStatus: ProductModerationStatus;
  isActive: boolean;
  createdAt: string;
}

export interface ResellerProduct {
  id: string;
  resellerId: string;
  productId: string;
  customSellingPrice: number;
  calculatedMargin: number;
  isActive: boolean;
  viewsCount: number;
  sharesCount: number;
  soldCount: number;
  customCaption?: string;
  product?: Product;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  basePrice: number;
  sellingPrice: number;
  marginPerItem: number;
  weightGrams: number;
  producerId: string;
  producerName: string;
}

export interface Order {
  id: string; // e.g. GOS-000123
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerDistrict: string;
  customerProvince: string;
  customerPostalCode: string;
  resellerId?: string;
  resellerName?: string;
  resellerStoreName?: string;
  items: OrderItem[];
  itemsSubtotal: number;
  resellerTotalMargin: number;
  platformFee: number;
  shippingCourier: string;
  shippingService: string;
  shippingCost: number;
  totalWeightGrams: number;
  discount: number;
  donationAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingTimeline: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TrackingEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

export interface ShippingRate {
  id: string;
  courier: string; // JNE, J&T, SiCepat, Anteraja
  service: string; // REG, YES, Cargo, etc.
  originCity: string;
  destinationCity: string;
  costPerKg: number;
  etdDays: string; // e.g. "2-3 hari"
}

export interface Wallet {
  userId: string;
  role: UserRole;
  availableBalance: number;
  pendingBalance: number;
  withdrawnBalance: number;
  totalEarned: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  processedDate?: string;
  note?: string;
}

export interface PlatformTransaction {
  id: string;
  userId: string;
  orderId?: string;
  type: 'order_margin' | 'order_producer_payment' | 'platform_fee' | 'withdrawal' | 'adjustment';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'success' | 'failed';
}

export interface ProductReview {
  id: string;
  productId: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'approved' | 'hidden';
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'account' | 'stock' | 'wallet' | 'product';
  link?: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformFeeFixed: number;
  platformFeePercent: number; // 2.5% fee syariah ujrah
  minResellerMarginPercent: number;
  autoApproveReseller: boolean;
  autoApproveProduct: boolean;
  supportedCouriers: string[];
  supportedPaymentMethods: string[];
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
  branch?: string;
  isVerified?: boolean;
  label?: string;
  createdAt: string;
}

export type SyariahContractType = 'mudharabah' | 'musyarakah' | 'murabahah' | 'ijarah';

export interface CrowdfundingProject {
  id: string;
  title: string;
  businessName: string;
  businessOwnerName?: string;
  ownerName?: string;
  businessOwnerId?: string;
  ownerUserId?: string;
  category: string;
  description: string;
  image: string;
  targetAmount: number;
  collectedAmount: number;
  minInvestmentLot?: number;
  pricePerLot?: number;
  minInvestment?: number;
  totalLots?: number;
  soldLots?: number;
  contractType: SyariahContractType;
  profitSharingRatio: string;
  projectedRoiAnnual?: number;
  expectedRoiAnnual?: number;
  tenorMonths: number;
  payoutFrequency: 'Bulanan' | 'Tiap 3 Bulan' | 'Akhir Periode' | string;
  location?: string;
  status: 'open' | 'funding' | 'funded' | 'running' | 'completed';
  daysLeft: number;
  investorCount: number;
  nibOrLegalDoc?: string;
  useOfFunds: string[];
  highlights: string[];
  monthlyRevenue?: number;
  monthlyNetProfit?: number;
  createdAt?: string;
}

export interface InvestmentRecord {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectTitle: string;
  businessName: string;
  amount: number;
  lotsCount: number;
  contractType: SyariahContractType;
  profitSharingRatio: string;
  expectedRoiAnnual: number;
  tenorMonths: number;
  payoutFrequency: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  totalDividendsReceived: number;
  certificateNumber: string;
  ijabQabulConfirmed: boolean;
}

export interface DonationProgram {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  image: string;
  category: 'modal_umkm' | 'pendidikan' | 'wakaf' | 'kemanusiaan' | 'dhuafa';
  foundationName: string;
  bankInfo: string;
}

export interface DonationRecord {
  id: string;
  programId: string;
  programTitle: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  isAnonymous: boolean;
  amount: number;
  prayerOrNote?: string;
  paymentMethod: string;
  bankDestination: string;
  accountNumber: string;
  date: string;
  status: 'confirmed' | 'pending';
  receiptNumber: string;
}

