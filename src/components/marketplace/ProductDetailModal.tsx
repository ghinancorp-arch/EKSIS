import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { INITIAL_REVIEWS } from '../../data/mockData';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Tag,
  Check,
  Scale,
  Building2,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMarginModal?: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenMarginModal,
}) => {
  const {
    activeRole,
    activeReferralReseller,
    resellerProducts,
    addToCart,
    currentUser,
    setIsCheckoutModalOpen,
  } = useApp();

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc');

  if (!isOpen || !product) return null;

  const currentResellerProduct = resellerProducts.find(
    (rp) => rp.productId === product.id && rp.resellerId === currentUser.id
  );

  let displayPrice = product.recommendedPrice;
  if (activeReferralReseller) {
    const refProd = resellerProducts.find(
      (rp) => rp.productId === product.id && rp.resellerId === activeReferralReseller.user.id
    );
    if (refProd && refProd.isActive) {
      displayPrice = refProd.customSellingPrice;
    }
  }

  // Selected variant additional price
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const finalUnitPrice = displayPrice + (selectedVariant?.additionalPrice || 0);

  const productReviews = INITIAL_REVIEWS.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart({
      product,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      quantity,
      sellingPrice: finalUnitPrice,
      basePrice: product.basePrice + (selectedVariant?.additionalPrice || 0),
      marginPerItem: activeReferralReseller
        ? Math.max(0, finalUnitPrice - (product.basePrice + (selectedVariant?.additionalPrice || 0)))
        : 0,
      resellerId: activeReferralReseller?.user.id,
      resellerName: activeReferralReseller?.profile.storeName,
    });
    onClose();
  };

  const handleBuyNow = () => {
    addToCart({
      product,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      quantity,
      sellingPrice: finalUnitPrice,
      basePrice: product.basePrice + (selectedVariant?.additionalPrice || 0),
      marginPerItem: activeReferralReseller
        ? Math.max(0, finalUnitPrice - (product.basePrice + (selectedVariant?.additionalPrice || 0)))
        : 0,
      resellerId: activeReferralReseller?.user.id,
      resellerName: activeReferralReseller?.profile.storeName,
    });
    onClose();
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Product Image & Badges */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shadow-xs border border-slate-200/80">
                {product.stock > 10 ? (
                  <span className="text-emerald-700">🟢 Stok Tersedia ({product.stock})</span>
                ) : product.stock > 0 ? (
                  <span className="text-amber-700">🟡 Stok Terbatas ({product.stock})</span>
                ) : (
                  <span className="text-rose-700">🔴 Stok Habis</span>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                <Scale size={16} className="text-blue-600" />
                <div>
                  <div className="text-[10px] text-slate-400">Berat Produk</div>
                  <div className="font-bold text-slate-800">{product.weightGrams} gram</div>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                <Building2 size={16} className="text-amber-600" />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400">Produsen Mitra</div>
                  <div className="font-bold text-slate-800 truncate">{product.producerName}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info, Price, Variants & CTA */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} ulasan)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2">
                {product.name}
              </h1>

              {/* Pricing View */}
              {activeRole === 'reseller' ? (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 mb-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Harga Pokok Produsen:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(product.basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-800">
                    <span>Rekomendasi Harga Jual:</span>
                    <span className="font-extrabold">{formatRupiah(product.recommendedPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-700 font-bold border-t border-blue-200 pt-1">
                    <span>Potensi Margin Anda:</span>
                    <span>+{formatRupiah(product.suggestedMargin)}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="text-2xl font-black text-blue-700">
                    {formatRupiah(finalUnitPrice)}
                  </div>
                  {activeReferralReseller && (
                    <div className="text-xs text-emerald-700 font-medium mt-0.5">
                      ✓ Dijual oleh Reseller Resmi: {activeReferralReseller.profile.storeName}
                    </div>
                  )}
                </div>
              )}

              {/* Variants if available */}
              {product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Variasi:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id === selectedVariantId ? '' : v.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          selectedVariantId === v.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {v.name} {v.additionalPrice > 0 && `(+${formatRupiah(v.additionalPrice)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector (if buyer) */}
              {activeRole !== 'reseller' && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-slate-700">Jumlah:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500">Tersisa {product.stock} unit</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {activeRole === 'reseller' ? (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenMarginModal) onOpenMarginModal(product);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Tag size={16} />
                  <span>
                    {currentResellerProduct
                      ? 'Kelola Margin & Bagikan Produk'
                      : 'Jual Produk Ini (Tentukan Margin)'}
                  </span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 bg-blue-50 border border-blue-600 text-blue-700 hover:bg-blue-100 disabled:opacity-50 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    <span>+ Keranjang</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-400 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Beli Sekarang</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Details: Deskripsi, Ulasan, dan Pengiriman */}
        <div className="mt-8 border-t border-slate-200 pt-5">
          <div className="flex border-b border-slate-200 gap-6 text-sm mb-4">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 font-semibold cursor-pointer border-b-2 transition-colors ${
                activeTab === 'desc'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Deskripsi Produk
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Ulasan Pembeli</span>
              <span className="text-xs bg-slate-100 px-1.5 py-0.2 rounded-full">
                {productReviews.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 font-semibold cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'shipping'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Ongkir & Pengiriman</span>
              <Truck size={14} />
            </button>
          </div>

          {activeTab === 'desc' && (
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <p>{product.description}</p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 mt-3">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Jaminan Kualitas Ghinan:</strong> Produk diproduksi sesuai standar syariah, higienis, dan terjamin keasliannya dari produsen terverifikasi.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <div className="text-slate-400 text-xs py-4 text-center">
                  Belum ada ulasan untuk produk ini.
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{rev.customerName}</span>
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                    </div>
                    <div className="flex text-amber-500 mb-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="text-xs text-slate-700 space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck size={15} className="text-blue-600" />
                  <span>Ekspedisi Pengiriman yang Didukung:</span>
                </div>
                <p className="text-slate-600">
                  JNE (REG/YES), J&T Express, SiCepat (REG/Halu), Anteraja. Tarif dihitung otomatis saat checkout berdasarkan berat ({product.weightGrams}g) dan alamat tujuan.
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  📍 Dikirim langsung dari warehouse produsen: <strong>{product.producerName}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
