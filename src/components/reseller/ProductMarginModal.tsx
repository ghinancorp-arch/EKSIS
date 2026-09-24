import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah, generateWhatsAppShareText } from '../../utils/formatters';
import { openExternalUrl, nativeShare } from '../../utils/capacitorBridge';
import {
  X,
  Calculator,
  Share2,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface ProductMarginModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductMarginModal: React.FC<ProductMarginModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    resellerProducts,
    saveResellerProductMargin,
    recordShareClick,
    resellerProfiles,
  } = useApp();

  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [caption, setCaption] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const resellerProfile = resellerProfiles.find((p) => p.userId === currentUser.id);
  const referralCode = resellerProfile?.referralCode || 'BERKAH-FAUZI';

  // Load existing reseller configuration if already saved
  useEffect(() => {
    if (product) {
      const existing = resellerProducts.find(
        (rp) => rp.productId === product.id && rp.resellerId === currentUser.id
      );
      if (existing) {
        setSellingPrice(existing.customSellingPrice);
        setCaption(existing.customCaption || product.description.slice(0, 160));
      } else {
        setSellingPrice(product.recommendedPrice);
        setCaption(product.description.slice(0, 160));
      }
      setSavedSuccess(false);
    }
  }, [product, resellerProducts, currentUser.id]);

  if (!isOpen || !product) return null;

  const currentMargin = sellingPrice - product.basePrice;
  const isBelowMinimum = sellingPrice < product.minResellerPrice;
  const currentMarginPercent =
    product.basePrice > 0 ? Math.round((currentMargin / product.basePrice) * 100) : 0;

  // Platform fee simulation (Poin 21: platform fee Rp5.000)
  const platformFee = 5000;
  const netResellerProfit = Math.max(0, currentMargin - platformFee);

  // Link containing reseller referral code
  const currentHost = window.location.origin;
  const shareableProductUrl = `${currentHost}/?ref=${referralCode}&product=${product.id}`;

  const handleSave = () => {
    if (isBelowMinimum) {
      alert(`Harga jual tidak boleh kurang dari harga minimum: ${formatRupiah(product.minResellerPrice)}`);
      return;
    }
    saveResellerProductMargin(product.id, sellingPrice, caption);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const handleShareWhatsApp = () => {
    recordShareClick(product.id, 'whatsapp');
    const msg = generateWhatsAppShareText(
      product.name,
      sellingPrice,
      caption || product.description,
      shareableProductUrl
    );
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    openExternalUrl(waUrl);
  };

  const handleNativeShare = async () => {
    recordShareClick(product.id, 'native_share');
    await nativeShare({
      title: product.name,
      text: generateWhatsAppShareText(
        product.name,
        sellingPrice,
        caption || product.description,
        shareableProductUrl
      ),
      url: shareableProductUrl,
      dialogTitle: `Bagikan ${product.name}`,
    });
  };

  const handleCopyLink = () => {
    recordShareClick(product.id, 'copy_link');
    navigator.clipboard.writeText(shareableProductUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSocial = (platform: string) => {
    recordShareClick(product.id, platform);
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(shareableProductUrl);
    const encodedTitle = encodeURIComponent(product.name);

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    } else {
      // Instagram / TikTok / generic
      handleCopyLink();
      alert(`Link produk telah disalin! Buka ${platform} dan tempel (paste) link di bio atau story Anda.`);
      return;
    }
    openExternalUrl(shareUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <Calculator size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Atur Margin & Jual Produk
            </h2>
            <p className="text-xs text-slate-500">
              Tentukan harga jual Anda sendiri. Tanpa perlu modal stok atau packing barang.
            </p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="flex gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-5 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
              {product.category} • Produsen: {product.producerName}
            </span>
            <h4 className="font-bold text-slate-800 text-sm truncate">
              {product.name}
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
              <span>Modal Produsen: <strong>{formatRupiah(product.basePrice)}</strong></span>
              <span>Min. Jual: <strong className="text-rose-600">{formatRupiah(product.minResellerPrice)}</strong></span>
              <span>Stok: <strong className="text-emerald-600">{product.stock} unit</strong></span>
            </div>
          </div>
        </div>

        {/* Margin & Pricing Calculator */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between items-center">
              <span>Tentukan Harga Jual Reseller</span>
              <span className="text-[11px] font-normal text-slate-500">
                Rekomendasi produsen: {formatRupiah(product.recommendedPrice)}
              </span>
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                Rp
              </span>
              <input
                id="input-reseller-selling-price"
                type="number"
                step="1000"
                min={product.minResellerPrice}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-base font-extrabold border transition-all ${
                  isBelowMinimum
                    ? 'border-rose-400 bg-rose-50 text-rose-800 focus:ring-2 focus:ring-rose-500'
                    : 'border-blue-400 bg-blue-50/30 text-blue-900 focus:ring-2 focus:ring-blue-600'
                }`}
              />
            </div>

            {isBelowMinimum && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1.5">
                <ShieldAlert size={14} />
                <span>
                  Harga tidak boleh di bawah batas minimum: {formatRupiah(product.minResellerPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Real-time Profit Calculation Breakdown (Poin 21) */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-xl shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Harga Jual ke Pembeli:</span>
              <span className="font-semibold text-white">{formatRupiah(sellingPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Harga Modal Produsen (HPP):</span>
              <span className="font-semibold text-rose-300">- {formatRupiah(product.basePrice)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Biaya Platform Ghinan:</span>
              <span className="font-semibold text-slate-400">- {formatRupiah(platformFee)}</span>
            </div>
            <div className="border-t border-slate-700/80 pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-amber-300 block">
                  Keuntungan Bersih Reseller (Net Profit):
                </span>
                <span className="text-[10px] text-slate-400">
                  Margin kotor: {formatRupiah(currentMargin)} (+{currentMarginPercent}%)
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-400">
                  {formatRupiah(netResellerProfit)}
                </span>
                <span className="text-[10px] text-emerald-300 block font-medium">
                  per 1 produk terjual
                </span>
              </div>
            </div>
          </div>

          {/* Promotion Caption (Poin 6) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Buat Caption Promosi Anda
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tulis kalimat ajakan beli yang menarik..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Save & Status */}
        <div className="flex items-center gap-3 mb-6">
          <button
            id="btn-save-reseller-margin"
            onClick={handleSave}
            disabled={isBelowMinimum}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check size={16} />
                <span>Tersimpan di Produk Saya!</span>
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                <span>Simpan Harga & Pasarkan Produk</span>
              </>
            )}
          </button>
        </div>

        {/* Share Section (Poin 7) */}
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Share2 size={14} className="text-blue-600" />
            <span>Bagikan Produk ke Pelanggan (Link Mengandung ID Reseller)</span>
          </h4>

          {/* Referral Link Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 mb-3">
            <span className="text-[11px] text-slate-600 truncate flex-1 font-mono px-1">
              {shareableProductUrl}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleNativeShare}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                title="Buka menu bagikan bawaan ponsel/Android"
              >
                <Share2 size={13} />
                <span>Bagikan</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Tersalin' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Direct Social Media Share Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => handleShareSocial('facebook')}
              className="py-2 px-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShareSocial('telegram')}
              className="py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Telegram</span>
            </button>
            <button
              onClick={() => handleShareSocial('instagram')}
              className="py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Instagram/TikTok</span>
            </button>
          </div>

          {/* WhatsApp Preview Text Note */}
          <p className="text-[11px] text-slate-400 mt-2.5">
            💡 <em>Pesan WhatsApp otomatis menyertakan ucapan salam, nama produk, harga yang Anda tentukan, deskripsi, dan link toko Anda.</em>
          </p>
        </div>
      </div>
    </div>
  );
};
