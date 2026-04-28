'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'square' | 'auto';
  className?: string;
}

export function AdBanner({ slot, format = 'horizontal', className = '' }: AdBannerProps) {
  const { adSettings } = useAppStore();
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  const adSlot = adSettings.adSlots.find((s) => s.id === slot || s.position === slot);

  // Determine if this slot is active
  const isActive = adSlot?.active && adSettings.adsenseEnabled;

  // Size classes based on format
  const sizeClasses = {
    horizontal: 'h-[90px] w-full max-w-full',
    vertical: 'h-[600px] w-[160px] mx-auto',
    square: 'h-[250px] w-[250px] mx-auto',
    auto: 'w-full min-h-[90px]',
  };

  const actualFormat = adSlot?.format || format;

  // Inject AdSense script once if client ID is set
  useEffect(() => {
    if (adSettings.adsenseClientId && adSettings.adsenseEnabled) {
      const existingScript = document.querySelector(
        'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
      );
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSettings.adsenseClientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }
  }, [adSettings.adsenseClientId, adSettings.adsenseEnabled]);

  // Auto Ads
  useEffect(() => {
    if (adSettings.autoAdsEnabled && adSettings.adsenseClientId && adSettings.adsenseEnabled) {
      const existingAuto = document.querySelector('script[data-ad-auto]');
      if (!existingAuto) {
        const script = document.createElement('script');
        script.setAttribute('data-ad-auto', 'true');
        script.async = true;
        script.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "${adSettings.adsenseClientId}", enable_page_level_ads: true});`;
        document.head.appendChild(script);
      }
    }
  }, [adSettings.autoAdsEnabled, adSettings.adsenseClientId, adSettings.adsenseEnabled]);

  // Push ad to AdSense when slot has an ID
  useEffect(() => {
    if (
      isActive &&
      adSlot?.adsenseSlotId &&
      adSettings.adsenseClientId &&
      insRef.current
    ) {
      try {
        const win = window as unknown as Record<string, unknown[]>;
        if (!win.adsbygoogle) win.adsbygoogle = [];
        win.adsbygoogle.push({});
      } catch {
        // AdSense not loaded yet
      }
    }
  }, [isActive, adSlot?.adsenseSlotId, adSettings.adsenseClientId]);

  // If ad is not active or ads are disabled, show placeholder
  if (!isActive) {
    return (
      <div
        className={`ad-banner flex items-center justify-center ${sizeClasses[actualFormat]} ${className} opacity-30`}
      >
        <div className="flex flex-col items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          <span className="text-[10px]">إعلان معطل</span>
        </div>
      </div>
    );
  }

  // Custom HTML ad
  if (adSlot?.customHtml) {
    return (
      <div
        className={`ad-banner ${sizeClasses[actualFormat]} ${className}`}
        ref={adRef}
        dangerouslySetInnerHTML={{ __html: adSlot.customHtml }}
      />
    );
  }

  // Real AdSense ad unit
  if (adSlot?.adsenseSlotId && adSettings.adsenseClientId) {
    const adFormatMap: Record<string, string> = {
      horizontal: 'horizontal',
      vertical: 'vertical',
      square: 'rectangle',
      auto: 'auto',
    };

    return (
      <div className={`ad-banner ${className}`} ref={adRef}>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: actualFormat === 'vertical' ? '160px' : '100%',
            height: actualFormat === 'horizontal' ? '90px' : actualFormat === 'vertical' ? '600px' : actualFormat === 'square' ? '250px' : '90px',
          }}
          data-ad-client={adSettings.adsenseClientId}
          data-ad-slot={adSlot.adsenseSlotId}
          data-ad-format={adFormatMap[actualFormat] || 'auto'}
          data-full-width-responsive={actualFormat === 'horizontal' ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Placeholder when no slot ID is configured yet
  return (
    <div
      className={`ad-banner flex items-center justify-center ${sizeClasses[actualFormat]} ${className} border border-dashed border-muted-foreground/20 rounded-lg`}
    >
      <div className="flex flex-col items-center gap-1 opacity-40">
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
          {slot ? `${slot} - أضف كود Slot من لوحة الإدارة` : 'استبدل بكود AdSense'}
        </span>
      </div>
    </div>
  );
}
