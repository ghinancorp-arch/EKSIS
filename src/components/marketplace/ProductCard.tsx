import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { Star, ShieldCheck, Share2, Tag, ShoppingBag, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (p: Product) => void;
  onOpenMarginModal?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onOpenMarginModal,
}) => {
  const {
    activeRole,
    activeReferralReseller,
    resellerProducts,
    addToCart,
    currentUser,
  } = useApp();

  // If in reseller mode, check if reseller has already added this product
  const currentResellerProduct = resellerProducts.find(
    (rp) => rp.productId === product.id && rp.resellerId === currentUser.id
  );

  // Determine display price:
  // If referral active and reseller set price, use that.
  // Otherwise if reseller mode, show recommended price or base price.
  let displayPrice = product.recommendedPrice;
  if (activeReferralReseller) {
    const refProduct = resellerProducts.find(
      (rp) => rp.productId === product.id && rp.resellerId === activeReferralReseller.user.id
    );
    if (refProduct && refProduct.isActive) {
      displayPrice = refProduct.customSellingPrice;
    }
  }

  const stockBadge = () => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          🔴 Habis
        </span>
      );
    }
    if (product.stock < 10) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          🟡 Sisa {product.stock}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
        🟢 Tersedia ({product.stock})
      </span>
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart({
      product,
      quantity: 1,
      sellingPrice: displayPrice,
      basePrice: product.basePrice,
      marginPerItem: activeReferralReseller
        ? Math.max(0, displayPrice - product.basePrice)
        : 0,
      resellerId: activeReferralReseller?.user.id,
      resellerName: activeReferralReseller?.profile.storeName,
    });
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer flex flex-col h-full relative"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Stock Badge */}
        <div className="absolute top-2.5 left-2.5">{stockBadge()}</div>

        {/* Producer Verified pill */}
        <div className="absolute top-2.5 right-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck size={11} className="text-emerald-400" />
          <span>Halal & Asli</span>
        </div>

        {/* Margin potential pill for Reseller */}
        {activeRole === 'reseller' && (
          <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-blue-900/90 to-indigo-900/90 backdrop-blur-xs text-white p-1.5 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
            <span className="text-[11px] text-blue-200">Potensi Keuntungan:</span>
            <span className="text-amber-300 font-bold">
              +{formatRupiah(product.suggestedMargin)}
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Producer & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="truncate max-w-[130px] font-medium text-slate-600">
              {product.producerName}
            </span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Ratings and sold */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-500 font-bold text-[11px] gap-0.5">
              <Star size={12} fill="currentColor" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="text-[11px]">{product.soldCount} terjual</span>
          </div>
        </div>

        <div>
          {/* Reseller Mode Pricing vs Normal Buyer Pricing */}
          {activeRole === 'reseller' ? (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs mb-2 space-y-1">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Harga Produsen:</span>
                <span className="font-semibold text-slate-700">{formatRupiah(product.basePrice)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 text-[11px]">
                <span>Fee Admin Platform (2.5%):</span>
                <span className="font-semibold">+{formatRupiah(Math.round(product.basePrice * 0.025))}</span>
              </div>
              <div className="flex justify-between text-slate-800 text-[11px] font-bold pt-1 border-t border-slate-200">
                <span>Nilai Jual ke Reseller:</span>
                <span className="text-blue-700">{formatRupiah(product.basePrice + Math.round(product.basePrice * 0.025))}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px] pt-0.5">
                <span>Rekomendasi Jual:</span>
                <span className="font-bold text-slate-800">{formatRupiah(product.recommendedPrice)}</span>
              </div>
            </div>
          ) : (
            <div className="mb-2">
              <div className="text-base font-extrabold text-blue-700">
                {formatRupiah(displayPrice)}
              </div>
              {product.basePrice < displayPrice && (
                <div className="text-[11px] text-slate-400 line-through">
                  {formatRupiah(Math.round(displayPrice * 1.15))}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {activeRole === 'reseller' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenMarginModal) onOpenMarginModal(product);
              }}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Tag size={14} />
              <span>{currentResellerProduct ? 'Atur Margin & Jual' : 'Jual Produk Ini'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickAdd}
                disabled={product.stock <= 0}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                <ShoppingBag size={14} />
                <span>{product.stock <= 0 ? 'Habis' : '+ Keranjang'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
