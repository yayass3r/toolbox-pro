'use client';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export function AdBanner({ slot, format = 'horizontal', className = '' }: AdBannerProps) {
  const sizeClasses = {
    horizontal: 'h-[90px] w-full',
    vertical: 'h-[600px] w-[160px] mx-auto',
    square: 'h-[250px] w-[250px] mx-auto',
  };

  return (
    <div
      className={`ad-banner flex items-center justify-center ${sizeClasses[format]} ${className}`}
      data-ad-slot={slot || 'placeholder'}
    >
      <div className="flex flex-col items-center gap-1 opacity-60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
        <span className="text-xs">مساحة إعلانية - Google AdSense</span>
        <span className="text-[10px] opacity-50">
          {slot ? `Slot: ${slot}` : 'استبدل بكود AdSense'}
        </span>
      </div>
    </div>
  );
}
