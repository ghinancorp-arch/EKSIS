import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSimulatorBar } from './components/common/RoleSimulatorBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { HomeView } from './components/marketplace/HomeView';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { ProductMarginModal } from './components/reseller/ProductMarginModal';
import { CartDrawer } from './components/marketplace/CartDrawer';
import { CheckoutModal } from './components/marketplace/CheckoutModal';
import { OrderTrackingModal } from './components/marketplace/OrderTrackingModal';
import { MyOrdersView } from './components/marketplace/MyOrdersView';
import { ResellerDashboard } from './components/reseller/ResellerDashboard';
import { ProducerDashboard } from './components/producer/ProducerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CrowdfundingView } from './components/crowdfunding/CrowdfundingView';
import { InvestorDashboard } from './components/crowdfunding/InvestorDashboard';
import { TabunganAkhiratView } from './components/donation/TabunganAkhiratView';
import { Product } from './types';
import { initNativeFeatures } from './utils/capacitorBridge';

const MainLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    trackingOrderId,
    setTrackingOrderId,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  // Selected product states for modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForMargin, setSelectedProductForMargin] = useState<Product | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);

  // Inisialisasi fitur native Android (Back button, StatusBar)
  useEffect(() => {
    initNativeFeatures(() => {
      // Prioritas 1: Tutup modal detail produk jika sedang terbuka
      if (selectedProductForDetail) {
        setSelectedProductForDetail(null);
        return true;
      }
      // Prioritas 2: Tutup modal margin produk
      if (selectedProductForMargin) {
        setSelectedProductForMargin(null);
        return true;
      }
      // Prioritas 3: Tutup drawer notifikasi
      if (isNotifDrawerOpen) {
        setIsNotifDrawerOpen(false);
        return true;
      }
      // Prioritas 4: Tutup modal pelacakan resi
      if (trackingOrderId) {
        setTrackingOrderId(null);
        return true;
      }
      // Prioritas 5: Tutup modal checkout
      if (isCheckoutOpen) {
        setIsCheckoutOpen(false);
        return true;
      }
      // Prioritas 6: Tutup keranjang
      if (isCartOpen) {
        setIsCartOpen(false);
        return true;
      }
      // Prioritas 7: Tutup modal auth
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return true;
      }
      // Prioritas 8: Jika bukan di halaman beranda, kembali ke beranda
      if (currentView !== 'home') {
        setCurrentView('home');
        return true;
      }
      // Jika sudah di beranda dan tidak ada modal terbuka, biarkan default (keluar aplikasi)
      return false;
    });
  }, [
    selectedProductForDetail,
    selectedProductForMargin,
    isNotifDrawerOpen,
    isCartOpen,
    isCheckoutOpen,
    trackingOrderId,
    isAuthModalOpen,
    currentView,
    setCurrentView,
    setIsCartOpen,
    setIsCheckoutOpen,
    setTrackingOrderId,
    setIsAuthModalOpen,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-800 font-sans antialiased">
      {/* Developer Role Simulator Bar at Top */}
      <RoleSimulatorBar />

      {/* Primary Sticky Navbar */}
      <Navbar onOpenNotifications={() => setIsNotifDrawerOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'home' && (
          <HomeView
            searchQuery={searchQuery}
            onOpenProductDetail={(p) => setSelectedProductForDetail(p)}
            onOpenMarginModal={(p) => setSelectedProductForMargin(p)}
          />
        )}

        {currentView === 'my_orders' && <MyOrdersView />}

        {currentView === 'crowdfunding' && <CrowdfundingView />}

        {currentView === 'investor_dashboard' && <InvestorDashboard />}

        {currentView === 'tabungan_akhirat' && <TabunganAkhiratView />}

        {currentView === 'reseller_dashboard' && (
          <ResellerDashboard
            onOpenMarginModal={(p) => setSelectedProductForMargin(p)}
            onOpenProductDetail={(p) => setSelectedProductForDetail(p)}
          />
        )}

        {currentView === 'producer_dashboard' && <ProducerDashboard />}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard
            onOpenProductDetail={(p) => setSelectedProductForDetail(p)}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onOpenMarginModal={(p) => {
          setSelectedProductForDetail(null);
          setSelectedProductForMargin(p);
        }}
      />

      <ProductMarginModal
        product={selectedProductForMargin}
        isOpen={!!selectedProductForMargin}
        onClose={() => setSelectedProductForMargin(null)}
      />

      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AuthModal />
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
