import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { OrderStatus } from '../../types';
import {
  X,
  Truck,
  PackageCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  ArrowRight,
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    trackingOrderId,
    setTrackingOrderId,
    orders,
    updateOrderStatus,
    activeRole,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [newResiInput, setNewResiInput] = useState('');

  if (!trackingOrderId) return null;

  const order = orders.find((o) => o.id === trackingOrderId);
  if (!order) return null;

  const handleCopyResi = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Quick progression steps for testing and demonstration
  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    waiting_payment: 'payment_received',
    payment_received: 'processing',
    processing: 'packing',
    packing: 'shipping',
    shipping: 'in_transit',
    in_transit: 'delivered',
    delivered: 'completed',
    completed: null,
    cancelled: null,
    returned: null,
  };

  const nextStatus = nextStatusMap[order.orderStatus];

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    updateOrderStatus(order.id, nextStatus, order.trackingNumber || 'GOS-RESI-99120');
  };

  const handleSetResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResiInput) return;
    updateOrderStatus(order.id, 'shipping', newResiInput, order.shippingCourier);
    setNewResiInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setTrackingOrderId(null)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2 text-xs text-blue-700 font-bold mb-1">
            <Truck size={16} />
            <span>Pelacakan Status Pengiriman Ekspedisi</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">
              Pesanan #{order.id}
            </h2>
            <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold uppercase tracking-wider">
              {order.orderStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Courier & Waybill details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Kurir Ekspedisi:</span>
            <span className="font-extrabold text-slate-800 text-sm">
              {order.shippingCourier} ({order.shippingService})
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Nomor Resi Pengiriman:</span>
            {order.trackingNumber ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {order.trackingNumber}
                </span>
                <button
                  onClick={handleCopyResi}
                  className="p-1 text-slate-500 hover:text-blue-600 rounded bg-white border border-slate-200 cursor-pointer"
                  title="Salin Resi"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                </button>
              </div>
            ) : (
              <span className="text-amber-600 italic font-medium">
                Sedang diproses oleh warehouse produsen
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Penerima:</span>
            <span className="font-semibold text-slate-700">
              {order.customerName} ({order.customerCity})
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Mitra Reseller:</span>
            <span className="font-semibold text-slate-700">
              {order.resellerStoreName || 'Marketplace Ghinan'}
            </span>
          </div>
        </div>

        {/* Timeline Visualization (Poin 11) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
            Riwayat Perjalanan Paket
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {order.trackingTimeline.map((item, idx) => (
              <div key={item.id} className="relative">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.completed
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {item.completed ? <Check size={11} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                </div>

                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin/Producer Manual Tracking & Status Step-forward Controls */}
        <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Kontrol Simulasi Pengiriman & Status:</span>
            <span className="text-[10px] text-slate-500">
              Uji alur dari Produsen/Admin
            </span>
          </div>

          {/* If no tracking number yet, allow entering resi */}
          {!order.trackingNumber && (
            <form onSubmit={handleSetResi} className="flex gap-2">
              <input
                type="text"
                placeholder="Input nomor resi pengiriman baru..."
                value={newResiInput}
                onChange={(e) => setNewResiInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
              >
                Kirim Resi
              </button>
            </form>
          )}

          {nextStatus && (
            <button
              onClick={handleAdvanceStatus}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Majukan Status: <strong>{nextStatus.replace('_', ' ').toUpperCase()}</strong></span>
              <ArrowRight size={14} />
            </button>
          )}

          {order.orderStatus === 'completed' && (
            <div className="text-center text-xs font-bold text-emerald-700 py-1 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>Pesanan Selesai. Margin reseller & pembayaran produsen telah masuk ke saldo!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
