import React, { useState } from 'react';
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

const MainLayout: React.FC = () => {
  const { currentView, searchQuery } = useApp();

  // Selected product states for modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForMargin, setSelectedProductForMargin] = useState<Product | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);

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
