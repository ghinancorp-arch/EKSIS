import React from 'react';

interface GhinanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GhinanLogo: React.FC<GhinanLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32, text: 'text-base', subText: 'text-[9px]' },
    md: { w: 42, h: 42, text: 'text-lg', subText: 'text-[11px]' },
    lg: { w: 54, h: 54, text: 'text-2xl', subText: 'text-xs' },
    xl: { w: 72, h: 72, text: 'text-3xl', subText: 'text-sm' },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      id="ghinan-logo-container"
    >
      {/* EKSIS Syariah Emblem */}
      <div
        className="relative bg-gradient-to-br from-emerald-700 to-teal-900 rounded-xl p-1 shadow-xs flex items-center justify-center shrink-0 text-white"
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Islamic Star / Geometric Polygon */}
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="12"
            fill="#047857"
            transform="rotate(45 50 50)"
          />
          {/* Inner Golden Ring */}
          <circle
            cx="50"
            cy="50"
            r="28"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          {/* E lettermark styled */}
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontWeight="900"
            fontSize="30"
            fill="#FFFFFF"
          >
            E
          </text>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-emerald-950 ${iconDimensions.text}`}>
            EKSIS
          </span>
          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
            SYARIAH
          </span>
        </div>
        <span className={`text-emerald-700 font-semibold tracking-tight ${iconDimensions.subText}`}>
          Ekosistem Bisnis Syariah
        </span>
      </div>
    </div>
  );
};
