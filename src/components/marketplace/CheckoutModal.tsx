import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { OrderItem } from '../../types';
import {
  X,
  Truck,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ArrowRight,
  QrCode,
  Building2,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    calculateShipping,
    createOrder,
    settings,
    currentUser,
    setTrackingOrderId,
    activeReferralReseller,
  } = useApp();

  // Buyer & Shipping Form State
  const [customerName, setCustomerName] = useState(currentUser.name || 'Dewi Lestari');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '081399882211');
  const [customerAddress, setCustomerAddress] = useState(currentUser.address || 'Jl. Kemang Raya No. 45');
  const [customerCity, setCustomerCity] = useState(currentUser.city || 'Jakarta Selatan');
  const [customerDistrict, setCustomerDistrict] = useState(currentUser.district || 'Mampang Prapatan');
  const [customerProvince, setCustomerProvince] = useState(currentUser.province || 'DKI Jakarta');
  const [customerPostalCode, setCustomerPostalCode] = useState(currentUser.postalCode || '12730');
  const [selectedCourier, setSelectedCourier] = useState<string>('JNE');
  const [selectedService, setSelectedService] = useState<string>('REG (Reguler)');
  const [paymentMethod, setPaymentMethod] = useState<string>('Transfer Bank BSI');
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [orderPlacedViaReseller, setOrderPlacedViaReseller] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Calculate total weight
  const totalWeightGrams = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.weightGrams * item.quantity, 0);
  }, [cart]);

  // Available shipping options based on origin (Bandung) to destination city
  const shippingOptions = useMemo(() => {
    return calculateShipping('Bandung', customerCity, totalWeightGrams, selectedCourier);
  }, [customerCity, totalWeightGrams, selectedCourier, calculateShipping]);

  // Selected shipping cost
  const currentShippingRate = shippingOptions.find((s) => s.service === selectedService) || shippingOptions[0];
  const shippingCost = currentShippingRate ? currentShippingRate.costPerKg : 12000;

  // Reseller margin total
  const resellerTotalMargin = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.marginPerItem * item.quantity, 0);
  }, [cart]);

  const platformFee = settings.platformFeeFixed; // Rp5.000
  const discount = 0;
  const grandTotal = cartSubtotal + shippingCost + platformFee - discount;

  if (!isCheckoutModalOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Convert cart items to OrderItems
    const orderItems: OrderItem[] = cart.map((ci) => ({
      id: `oi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      productId: ci.product.id,
      productName: ci.product.name,
      productImage: ci.product.image,
      variantName: ci.variantName,
      quantity: ci.quantity,
      basePrice: ci.basePrice,
      sellingPrice: ci.sellingPrice,
      marginPerItem: ci.marginPerItem,
      weightGrams: ci.product.weightGrams,
      producerId: ci.product.producerId,
      producerName: ci.product.producerName,
    }));

    const cartReseller = cart.find((c) => c.resellerId);
    const resellerId = cartReseller?.resellerId || activeReferralReseller?.user.id;
    const resellerName = cartReseller?.resellerName || activeReferralReseller?.user.name;
    const resellerStoreName = activeReferralReseller?.profile.storeName || cartReseller?.resellerName;

    if (resellerStoreName || resellerName) {
      setOrderPlacedViaReseller(resellerStoreName || resellerName || 'Mitra Reseller');
    } else {
      setOrderPlacedViaReseller(null);
    }

    const newOrder = createOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerCity,
      customerDistrict,
      customerProvince,
      customerPostalCode,
      resellerId,
      resellerName,
      resellerStoreName,
      items: orderItems,
      itemsSubtotal: cartSubtotal,
      resellerTotalMargin,
      platformFee,
      shippingCourier: selectedCourier,
      shippingService: currentShippingRate?.service || selectedService,
      shippingCost,
      totalWeightGrams,
      discount,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: 'paid', // Simulasi pembayaran instan terverifikasi
      orderStatus: 'payment_received',
    });

    setOrderSuccessId(newOrder.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => {
            setIsCheckoutModalOpen(false);
            setOrderSuccessId(null);
          }}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        {orderSuccessId ? (
          /* Order Placement Success View with Direct Tracking Option */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Pembayaran Berhasil Diterima!
            </h2>
            <div className="inline-block bg-blue-50 text-blue-800 text-xs font-mono font-bold px-3 py-1 rounded-full border border-blue-200">
              ID Pesanan: #{orderSuccessId}
            </div>

            {/* BSI Payment Confirmation Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-lg mx-auto text-left space-y-2.5">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-700 text-white rounded-lg">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block">Tujuan Transfer:</span>
                    <span className="text-xs font-bold text-emerald-950">Bank Syariah Indonesia (BSI)</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                  Terverifikasi Lunas
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">No. Rekening Tujuan:</span>
                  <span className="font-mono font-bold text-slate-900">7198606228</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Atas Nama:</span>
                  <span className="font-bold text-slate-900">EKSIS BISNIS SYARIAH</span>
                </div>
              </div>
              <div className="pt-1 text-[11px] text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-100">
                ✅ <strong>Notifikasi Produsen Terkirim:</strong> Produsen telah menerima pemberitahuan otomatis untuk segera mengemas dan mencetak label pengiriman paket pesanan Anda.
              </div>
            </div>

            {orderPlacedViaReseller && (
              <div className="bg-blue-50 border border-blue-200 text-blue-950 p-3 rounded-xl max-w-lg mx-auto text-xs flex items-center gap-2 text-left">
                <Share2 size={18} className="text-blue-600 shrink-0" />
                <div>
                  Pesanan ini tercatat melalui <strong>Link Reseller: {orderPlacedViaReseller}</strong>. Komisi penjualan reseller telah dicatat secara otomatis.
                </div>
              </div>
            )}

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Terima kasih telah berbelanja produk halal berkualitas di ekosistem bisnis syariah EKSIS.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2 max-w-md mx-auto">
              <button
                onClick={() => {
                  const id = orderSuccessId;
                  setIsCheckoutModalOpen(false);
                  setOrderSuccessId(null);
                  setTrackingOrderId(id);
                }}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Truck size={16} />
                <span>Lacak Pengiriman Pesanan</span>
              </button>
              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setOrderSuccessId(null);
                }}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                Checkout & Pengiriman
              </h2>
              <p className="text-xs text-slate-500">
                Lengkapi alamat penerima, hitung ongkir otomatis, dan pilih metode pembayaran.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Alamat & Ekspedisi */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-600" />
                    <span>Alamat Pengiriman Penerima</span>
                  </h3>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Penerima *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      No. WhatsApp Penerima *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1">Kota/Kab</label>
                      <input
                        type="text"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={customerDistrict}
                        onChange={(e) => setCustomerDistrict(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 9: Kalkulator Ongkir Otomatis */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck size={14} className="text-blue-600" />
                      <span>Pilihan Kurir & Ongkir Otomatis</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Berat: {totalWeightGrams}g
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {['JNE', 'J&T Express', 'SiCepat'].map((courier) => (
                      <button
                        type="button"
                        key={courier}
                        onClick={() => setSelectedCourier(courier)}
                        className={`py-2 px-2 text-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedCourier === courier
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {courier}
                      </button>
                    ))}
                  </div>

                  {/* Available Services */}
                  <div className="space-y-1.5">
                    {shippingOptions.map((rate) => (
                      <div
                        key={rate.id}
                        onClick={() => setSelectedService(rate.service)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedService === rate.service
                            ? 'border-blue-600 bg-blue-50/60 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="text-slate-800">{rate.courier} - {rate.service}</div>
                          <div className="text-[10px] text-slate-400">Estimasi tiba: {rate.etdDays}</div>
                        </div>
                        <div className="text-blue-700 font-extrabold">
                          {formatRupiah(rate.costPerKg)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items, Payment Method, and Total */}
              <div className="space-y-4">
                {/* Items preview */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">Ringkasan Produk ({cart.length} item)</h4>
                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-200">
                    {cart.map((it) => (
                      <div key={it.product.id} className="py-2 flex justify-between items-center text-xs">
                        <div className="truncate pr-2">
                          <span className="font-medium text-slate-800">{it.quantity}x {it.product.name}</span>
                          {it.variantName && (
                            <span className="text-[10px] text-slate-500 block">({it.variantName})</span>
                          )}
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          {formatRupiah(it.sellingPrice * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 10: Pilihan Pembayaran */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={14} className="text-blue-600" />
                      <span>Metode Pembayaran Syariah</span>
                    </h3>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      Bebas Riba
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: 'Transfer Bank BSI',
                        label: 'Transfer Bank Syariah Indonesia (BSI) - Rekening Resmi 7198606228',
                        badge: 'Direkomendasikan (Utama)',
                        icon: Building2,
                      },
                      {
                        id: 'QRIS Syariah (BSI / Mandiri)',
                        label: 'QRIS Syariah (BSI Mobile, Livin, GoPay, ShopeePay)',
                        badge: 'Instan',
                        icon: QrCode,
                      },
                      {
                        id: 'Virtual Account BSI',
                        label: 'BSI Virtual Account (VA Otomatis)',
                        badge: 'Cek Otomatis',
                        icon: CreditCard,
                      },
                      {
                        id: 'Transfer BCA Syariah',
                        label: 'Transfer Bank BCA Syariah',
                        icon: CreditCard,
                      },
                      {
                        id: 'COD (Bayar di Tempat)',
                        label: 'COD - Bayar Tunai Saat Barang Tiba di Tujuan',
                        icon: Truck,
                      },
                    ].map((p) => {
                      const Icon = p.icon;
                      const isSelected = paymentMethod === p.id;
                      return (
                        <label
                          key={p.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 font-semibold text-slate-900 shadow-xs ring-1 ring-emerald-500'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={p.id}
                              checked={isSelected}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500 shrink-0"
                            />
                            <Icon size={16} className={isSelected ? 'text-emerald-600' : 'text-slate-400'} />
                            <span className="truncate">{p.label}</span>
                          </div>
                          {p.badge && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {p.badge}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* BSI Account Details Box when BSI is selected */}
                  {paymentMethod === 'Transfer Bank BSI' && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-2xs">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider">
                              Rekening Resmi Pembayaran EKSIS
                            </div>
                            <div className="text-xs font-black text-emerald-900">
                              Bank Syariah Indonesia (BSI)
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full shadow-2xs">
                          Kode Bank: 451
                        </span>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-emerald-200 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Nomor Rekening BSI:</span>
                          <span className="text-base font-black text-slate-900 font-mono tracking-wider">
                            7198606228
                          </span>
                          <span className="text-[10px] text-emerald-800 block font-semibold">
                            a/n EKSIS BISNIS SYARIAH
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('7198606228');
                            setCopiedAccount(true);
                            setTimeout(() => setCopiedAccount(false), 2000);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {copiedAccount ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedAccount ? 'Tersalin!' : 'Salin No. Rekening'}</span>
                        </button>
                      </div>

                      <div className="bg-white rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between text-xs shadow-2xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Nominal Pas Transfer:</span>
                          <span className="font-extrabold text-emerald-800 text-sm">
                            {formatRupiah(grandTotal)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(grandTotal.toString());
                            setCopiedAmount(true);
                            setTimeout(() => setCopiedAmount(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedAmount ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedAmount ? 'Tersalin!' : 'Salin Nominal'}</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-emerald-800 leading-normal">
                        💡 <strong>Catatan Syariah:</strong> Pembayaran Anda langsung masuk ke rekening pusat BSI EKSIS no. <strong>7198606228</strong>. Sistem akan otomatis memverifikasi dan mengirimkan notifikasi ke produsen untuk mengirimkan barang ke alamat Anda.
                      </p>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-inner space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Produk:</span>
                    <span>{formatRupiah(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Biaya Ongkos Kirim:</span>
                    <span>{formatRupiah(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Biaya Layanan Aplikasi:</span>
                    <span>{formatRupiah(platformFee)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between items-baseline">
                    <span className="font-bold text-slate-200">Total Pembayaran:</span>
                    <span className="text-xl font-black text-amber-300">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={18} />
                  <span>Bayar Sekarang ({formatRupiah(grandTotal)})</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
