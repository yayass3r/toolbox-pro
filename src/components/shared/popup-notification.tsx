'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore, type PopupConfig } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function PopupNotification() {
  const { popups, setActivePopup, activePopup, dismissedPopups, dismissPopup, setCurrentPage, isPremium, user } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);

  // Check if a popup should show based on frequency
  const shouldShowPopup = useCallback((popup: PopupConfig): boolean => {
    if (!popup.active) return false;
    if (dismissedPopups.includes(popup.id)) return false;

    // Check date range
    const now = new Date();
    if (popup.startDate && new Date(popup.startDate) > now) return false;
    if (popup.endDate && new Date(popup.endDate) < now) return false;

    // Check target audience
    if (popup.targetAudience === 'free' && isPremium) return false;
    if (popup.targetAudience === 'premium' && !isPremium) return false;
    if (popup.targetAudience === 'new' && user) return false;

    // Check frequency
    try {
      const storageKey = `popup_${popup.id}_dismissed`;
      const lastDismissed = localStorage.getItem(storageKey);
      if (lastDismissed) {
        const dismissedDate = new Date(lastDismissed);
        const diffMs = now.getTime() - dismissedDate.getTime();
        const diffMins = diffMs / (1000 * 60);
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        switch (popup.frequency) {
          case 'once_per_session':
            return !sessionStorage.getItem(`popup_${popup.id}_shown`);
          case 'once_per_day':
            return diffDays >= 1;
          case 'once_per_week':
            return diffDays >= 7;
          case 'every_visit':
            return true;
        }
      }
    } catch {
      // localStorage not available
    }

    return true;
  }, [dismissedPopups, isPremium, user]);

  // Find the best popup to show
  const findBestPopup = useCallback((): PopupConfig | null => {
    const activePopups = popups.filter(shouldShowPopup);
    if (activePopups.length === 0) return null;

    // Prioritize: discount > promotion > tool_recommendation > newsletter > announcement
    const priority: Record<string, number> = {
      discount: 5,
      promotion: 4,
      tool_recommendation: 3,
      newsletter: 2,
      announcement: 1,
    };

    activePopups.sort((a, b) => (priority[b.type] || 0) - (priority[a.type] || 0));
    return activePopups[0];
  }, [popups, shouldShowPopup]);

  // Show popup
  const showPopup = useCallback((popup: PopupConfig) => {
    setActivePopup(popup);
    setIsVisible(true);
    try {
      sessionStorage.setItem(`popup_${popup.id}_shown`, 'true');
    } catch {
      // sessionStorage not available
    }
  }, [setActivePopup]);

  // Close popup
  const closePopup = useCallback(() => {
    setIsVisible(false);
    if (activePopup) {
      dismissPopup(activePopup.id);
      try {
        localStorage.setItem(`popup_${activePopup.id}_dismissed`, new Date().toISOString());
      } catch {
        // localStorage not available
      }
    }
    setTimeout(() => setActivePopup(null), 300);
  }, [activePopup, dismissPopup, setActivePopup]);

  // Handle button click
  const handleButtonClick = useCallback(() => {
    if (activePopup) {
      if (activePopup.buttonUrl === '#newsletter') {
        document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (activePopup.buttonUrl.startsWith('http')) {
        window.open(activePopup.buttonUrl, '_blank');
      } else {
        setCurrentPage(activePopup.buttonUrl as 'home');
      }
    }
    closePopup();
  }, [activePopup, closePopup, setCurrentPage]);

  // Time delay trigger
  useEffect(() => {
    const bestPopup = findBestPopup();
    if (!bestPopup) return;

    if (bestPopup.trigger === 'page_load') {
      const timer = setTimeout(() => showPopup(bestPopup), 1500);
      return () => clearTimeout(timer);
    }

    if (bestPopup.trigger === 'time_delay') {
      const timer = setTimeout(() => showPopup(bestPopup), (bestPopup.triggerDelay || 10) * 1000);
      return () => clearTimeout(timer);
    }
  }, [popups, findBestPopup, showPopup]);

  // Exit intent trigger
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        setExitIntentTriggered(true);
        const bestPopup = findBestPopup();
        if (bestPopup && bestPopup.trigger === 'exit_intent') {
          showPopup(bestPopup);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitIntentTriggered, findBestPopup, showPopup]);

  // Scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 50) {
        const bestPopup = findBestPopup();
        if (bestPopup && bestPopup.trigger === 'scroll') {
          showPopup(bestPopup);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [popups, findBestPopup, showPopup]);

  if (!activePopup) return null;

  const typeStyles: Record<string, string> = {
    discount: 'from-amber-500 to-orange-600',
    promotion: 'from-emerald-500 to-teal-600',
    tool_recommendation: 'from-blue-500 to-indigo-600',
    newsletter: 'from-purple-500 to-violet-600',
    announcement: 'from-cyan-500 to-sky-600',
  };

  const typeLabels: Record<string, string> = {
    discount: 'عرض خاص',
    promotion: 'ترقية',
    tool_recommendation: 'أداة مميزة',
    newsletter: 'نشرة بريدية',
    announcement: 'إعلان',
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closePopup}
      />

      {/* Popup Card */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header gradient */}
        <div className={`bg-gradient-to-r ${typeStyles[activePopup.type] || typeStyles.announcement} p-5 text-white`}>
          <button
            onClick={closePopup}
            className="absolute top-3 left-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{activePopup.icon}</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {typeLabels[activePopup.type]}
            </span>
          </div>
          <h3 className="text-lg font-bold">{activePopup.title}</h3>
        </div>

        {/* Body */}
        <div className="p-5">
          {activePopup.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img src={activePopup.imageUrl} alt="" className="w-full h-40 object-cover" />
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {activePopup.message}
          </p>

          {/* Action button */}
          <Button
            className={`w-full bg-gradient-to-r ${typeStyles[activePopup.type] || typeStyles.announcement} text-white hover:opacity-90`}
            onClick={handleButtonClick}
          >
            {activePopup.buttonText}
          </Button>

          <button
            onClick={closePopup}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors"
          >
            لا شكراً، أغلق
          </button>
        </div>
      </div>
    </div>
  );
}
