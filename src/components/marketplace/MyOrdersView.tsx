import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { Truck, Package, Clock, ExternalLink, CheckCircle2, ChevronRight } from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const { orders, setTrackingOrderId, setCurrentView } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled';
    if (filterStatus === 'completed') return o.orderStatus === 'completed';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Daftar Pesanan & Pelacakan
          </h1>
          <p className="text-xs text-slate-500">
            Pantau status pesanan, pembayaran, dan perjalanan kurir secara real-time.
          </p>
        </div>

        {/* Filter */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'active' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Sedang Berjalan
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
          <Package size={44} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Pesanan</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Anda belum melakukan transaksi atau tidak ada pesanan di kategori ini.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
          >
            Mulai Belanja di Katalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-blue-300 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700">#{order.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{formatDateIndo(order.createdAt)}</span>
                  {order.resellerStoreName && (
                    <span className="bg-blue-50 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                      Toko: {order.resellerStoreName}
                    </span>
                  )}
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 mb-4">
                {order.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img
                      src={it.productImage}
                      alt={it.productName}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-slate-800 truncate">{it.productName}</div>
                      <div className="text-[11px] text-slate-500">
                        {it.quantity} barang x {formatRupiah(it.sellingPrice)}
                        {it.variantName && ` • Varian: ${it.variantName}`}
                      </div>
                      <div className="text-[10px] text-slate-400">Produsen: {it.producerName}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Total & Tracking Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Total Belanja:</span>
                  <span className="text-base font-extrabold text-blue-700">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTrackingOrderId(order.id)}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Truck size={14} />
                    <span>Lacak Pengiriman</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
