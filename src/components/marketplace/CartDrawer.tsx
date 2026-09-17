import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    setIsCheckoutModalOpen,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800 text-base">Keranjang Belanja</h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
              {cart.reduce((s, c) => s + c.quantity, 0)} item
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag size={48} className="mx-auto mb-3 text-slate-300 stroke-1" />
              <p className="text-sm font-medium">Keranjang belanja masih kosong</p>
              <p className="text-xs text-slate-400 mt-1">Pilih produk favorit Anda dari katalog</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}_${item.variantId || 'default'}`} className="py-3.5 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.product.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[11px] text-blue-600 font-medium">
                        Varian: {item.variantName}
                      </span>
                    )}
                    {item.resellerName && (
                      <div className="text-[10px] text-emerald-600 font-medium">
                        Toko: {item.resellerName}
                      </div>
                    )}
                    <div className="text-xs font-extrabold text-blue-700 mt-1">
                      {formatRupiah(item.sellingPrice)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal Produk:</span>
              <span className="text-slate-900 font-extrabold text-sm">
                {formatRupiah(cartSubtotal)}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Ongkir & metode pembayaran dihitung di tahap checkout</span>
            </div>

            <button
              id="btn-proceed-checkout"
              onClick={() => {
                setIsCartDrawerOpen(false);
                setIsCheckoutModalOpen(true);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
