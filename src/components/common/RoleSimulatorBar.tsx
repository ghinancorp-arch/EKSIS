import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, Store, Factory, ShoppingBag, ArrowRightLeft, Sparkles, Coins } from 'lucide-react';

export const RoleSimulatorBar: React.FC = () => {
  const { activeRole, switchRole, currentUser, users } = useApp();

  const rolesConfig: { role: UserRole; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    {
      role: 'customer',
      label: 'Pembeli',
      icon: ShoppingBag,
      color: 'bg-emerald-600 text-white hover:bg-emerald-700',
      desc: 'Katalog & Belanja',
    },
    {
      role: 'reseller',
      label: 'Reseller',
      icon: Store,
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      desc: 'Toko Berkah Mandiri',
    },
    {
      role: 'investor',
      label: 'Investor',
      icon: Coins,
      color: 'bg-amber-600 text-white hover:bg-amber-700',
      desc: 'Pemodal Sukuk Syariah',
    },
    {
      role: 'producer',
      label: 'Produsen',
      icon: Factory,
      color: 'bg-teal-600 text-white hover:bg-teal-700',
      desc: 'CV Ghinan Herbal',
    },
    {
      role: 'admin',
      label: 'Super Admin',
      icon: ShieldCheck,
      color: 'bg-rose-600 text-white hover:bg-rose-700',
      desc: 'Pusat Kontrol',
    },
  ];

  return (
    <div
      id="role-simulator-bar"
      className="bg-slate-900 text-white px-3 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
          <Sparkles size={13} />
          <span>Demo Role Switcher</span>
        </span>
        <span className="hidden sm:inline text-slate-300">
          Uji seluruh alur ekosistem secara langsung:
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
        {rolesConfig.map((item) => {
          const Icon = item.icon;
          const isActive = activeRole === item.role;
          return (
            <button
              key={item.role}
              id={`switch-to-${item.role}`}
              onClick={() => {
                if (item.role === 'customer') {
                  const cust = users.find((u) => u.role === 'customer');
                  switchRole('customer', cust?.id);
                } else if (item.role === 'reseller') {
                  const res = users.find((u) => u.id === 'user_reseller_1');
                  switchRole('reseller', res?.id);
                } else if (item.role === 'investor') {
                  const inv = users.find((u) => u.role === 'investor');
                  switchRole('investor', inv?.id);
                } else if (item.role === 'producer') {
                  const prod = users.find((u) => u.id === 'user_producer_1');
                  switchRole('producer', prod?.id);
                } else {
                  const adm = users.find((u) => u.role === 'admin');
                  switchRole('admin', adm?.id);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                isActive
                  ? `${item.color} shadow-sm ring-2 ring-white/20 font-bold scale-[1.02]`
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={`Beralih ke mode ${item.label}`}
            >
              <Icon size={13} />
              <span>{item.label}</span>
              {isActive && (
                <span className="hidden md:inline text-[10px] opacity-80 border-l border-white/20 pl-1.5">
                  ({currentUser.name.split(' ')[0]})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
