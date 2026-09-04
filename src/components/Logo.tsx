import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'glass';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'primary', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-32 sm:h-32',
  };

  return (
    <div className={`flex items-center justify-center shrink-0 ${sizes[size]} ${className} transition-all duration-500`}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          {/* Emerald Awning Gradient */}
          <linearGradient id={`emGrad-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399"/>
            <stop offset="100%" stopColor="#047857"/>
          </linearGradient>
          
          {/* Off-White Awning Gradient */}
          <linearGradient id={`whGrad-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#CBD5E1"/>
          </linearGradient>
          
          {/* Fruit Gradients for realism */}
          <linearGradient id={`orGrad-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24"/>
            <stop offset="100%" stopColor="#D97706"/>
          </linearGradient>
          <linearGradient id={`reGrad-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F87171"/>
            <stop offset="100%" stopColor="#B91C1C"/>
          </linearGradient>
          <linearGradient id={`leGrad-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ADE80"/>
            <stop offset="100%" stopColor="#15803D"/>
          </linearGradient>

          {/* Realistic drop shadow for the awning */}
          <filter id={`shadow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity={variant === 'primary' ? '0.15' : '0.25'} />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="32" cy="60" rx="20" ry="2.5" fill={variant === 'primary' ? '#0F172A' : '#064E3B'} opacity={variant === 'primary' ? 0.08 : 0.3} />

        {/* Fresh Produce Inside the Cart (The "Aesthetic Market" touch) */}
        <g className="produce origin-center">
          {/* Red Apple */}
          <circle cx="36" cy="27" r="5.5" fill={`url(#reGrad-${variant})`} />
          <path d="M 36 21 Q 39 18 41 21.5 Q 38 23.5 36 21 Z" fill={`url(#leGrad-${variant})`} />
          
          {/* Golden Orange */}
          <circle cx="25" cy="28" r="5" fill={`url(#orGrad-${variant})`} />
          
          {/* Leafy Green / Veggie */}
          <path d="M 18 29 C 16 22, 22 20, 24 26 C 26 31, 20 33, 18 29 Z" fill={`url(#leGrad-${variant})`} />
        </g>

        {/* Solid, Premium Cart Frame */}
        <g className="cart">
          {/* Basket Frosted Backing */}
          <path d="M 16 30 H 48 L 43 47 H 21 Z" fill={variant === 'primary' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)'} stroke={variant === 'primary' ? '#047857' : '#FFFFFF'} strokeWidth="2.5" strokeLinejoin="round" />
          
          {/* Sleek Basket Wireframe Lines */}
          <path d="M 17.5 35.5 H 46.5" stroke={variant === 'primary' ? '#047857' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 19 41.5 H 44.5" stroke={variant === 'primary' ? '#047857' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" />

          {/* Cart Handle */}
          <path d="M 48 30 L 52 27 H 55" stroke={variant === 'primary' ? '#047857' : '#FFFFFF'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* Heavy Duty Base Chassis */}
          <path d="M 21 47 V 52 A 2 2 0 0 0 23 54 H 41 A 2 2 0 0 0 43 52 V 47" stroke={variant === 'primary' ? '#047857' : '#FFFFFF'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* Rubber Wheels */}
          <circle cx="25" cy="56" r="3.5" fill={variant === 'primary' ? '#047857' : '#FFFFFF'} />
          <circle cx="39" cy="56" r="3.5" fill={variant === 'primary' ? '#047857' : '#FFFFFF'} />
          
          {/* Wheel Hub Highlights */}
          <circle cx="25" cy="56" r="1.5" fill={variant === 'primary' ? '#FFFFFF' : '#10B981'} />
          <circle cx="39" cy="56" r="1.5" fill={variant === 'primary' ? '#FFFFFF' : '#10B981'} />
        </g>

        {/* 3D Fanned Awning (Casts shadow over the cart) */}
        <g filter={`url(#shadow-${variant})`}>
          {/* Stripe 1 */}
          <path d="M 12 6 H 20 L 17 25 A 5 3.5 0 0 1 7 25 Z" fill={variant === 'primary' ? `url(#emGrad-${variant})` : `url(#whGrad-${variant})`} />
          {/* Stripe 2 */}
          <path d="M 20 6 H 28 L 27 25 A 5 3.5 0 0 1 17 25 Z" fill={variant === 'primary' ? `url(#whGrad-${variant})` : 'rgba(255,255,255,0.5)'} />
          {/* Stripe 3 */}
          <path d="M 28 6 H 36 L 37 25 A 5 3.5 0 0 1 27 25 Z" fill={variant === 'primary' ? `url(#emGrad-${variant})` : `url(#whGrad-${variant})`} />
          {/* Stripe 4 */}
          <path d="M 36 6 H 44 L 47 25 A 5 3.5 0 0 1 37 25 Z" fill={variant === 'primary' ? `url(#whGrad-${variant})` : 'rgba(255,255,255,0.5)'} />
          {/* Stripe 5 */}
          <path d="M 44 6 H 52 L 57 25 A 5 3.5 0 0 1 47 25 Z" fill={variant === 'primary' ? `url(#emGrad-${variant})` : `url(#whGrad-${variant})`} />
        </g>
      </svg>
    </div>
  );
};
