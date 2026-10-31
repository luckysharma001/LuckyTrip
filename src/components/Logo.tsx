import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  light = false,
  className = '',
  onClick,
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Brand SVG Mark: Pin + Curved Journey Path + Golden Star */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm flex-shrink-0"
        >
          {/* Background circular badge */}
          <rect width="48" height="48" rx="14" fill={light ? '#FFFFFF' : '#0B2545'} />
          
          {/* Journey path swoop in Sky Blue */}
          <path
            d="M8 36C14 26 22 18 38 14"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1 0"
          />
          <path
            d="M12 40C20 32 30 26 42 24"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Location Pin */}
          <g filter="url(#pinGlow)">
            <path
              d="M24 10C20.6863 10 18 12.6863 18 16C18 20.5 24 28 24 28C24 28 30 20.5 30 16C30 12.6863 27.3137 10 24 10Z"
              fill={light ? '#0B2545' : '#0284C7'}
            />
            {/* Center aperture */}
            <circle cx="24" cy="16" r="2.8" fill={light ? '#FFFFFF' : '#F0F9FF'} />
          </g>

          {/* Golden Star perched on journey path */}
          <path
            d="M37 9L38.2 12.2L41.5 12.5L39 14.7L39.8 18L37 16.3L34.2 18L35 14.7L32.5 12.5L35.8 12.2L37 9Z"
            fill="#FBBF24"
          />

          <defs>
            <filter id="pinGlow" x="14" y="8" width="20" height="24" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <span
            className={`font-black tracking-tight ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
            } ${light ? 'text-white' : 'text-[#0B2545]'}`}
          >
            Lucky<span className="text-sky-500">Trip</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        </div>
        {showTagline && (
          <span
            className={`font-medium tracking-wide uppercase ${
              size === 'sm' ? 'text-[9px]' : 'text-[10px]'
            } ${light ? 'text-sky-200' : 'text-slate-500'}`}
          >
            One App. Every Journey.
          </span>
        )}
      </div>
    </div>
  );
};
