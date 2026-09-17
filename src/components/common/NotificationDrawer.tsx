import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, X, AlertTriangle, ShoppingCart, UserCheck, Wallet, Package } from 'lucide-react';

export const NotificationDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, activeRole } = useApp();

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === activeRole
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="text-emerald-600" size={18} />;
      case 'stock':
        return <AlertTriangle className="text-amber-500" size={18} />;
      case 'account':
        return <UserCheck className="text-blue-600" size={18} />;
      case 'wallet':
        return <Wallet className="text-purple-600" size={18} />;
      default:
        return <Package className="text-slate-500" size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800 text-base">Notifikasi Sistem</h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
              {filteredNotifs.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada notifikasi baru untuk peran ini.
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3.5 rounded-lg transition-colors cursor-pointer flex gap-3 ${
                  item.read ? 'bg-white opacity-80 hover:bg-slate-50' : 'bg-blue-50/70 hover:bg-blue-50'
                }`}
              >
                <div className="mt-0.5 shrink-0 p-2 rounded-full bg-white shadow-xs border border-slate-100">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className={`text-xs font-semibold truncate ${item.read ? 'text-slate-800' : 'text-blue-950'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 self-center shrink-0" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => filteredNotifs.forEach((n) => markNotificationRead(n.id))}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck size={14} />
            <span>Tandai Semua Sudah Dibaca</span>
          </button>
        </div>
      </div>
    </div>
  );
};
