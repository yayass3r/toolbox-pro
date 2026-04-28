import { create } from 'zustand';

export type PageId =
  | 'home'
  | 'qr-generator'
  | 'password-generator'
  | 'json-formatter'
  | 'base64'
  | 'color-picker'
  | 'text-counter'
  | 'hash-generator'
  | 'lorem-ipsum'
  | 'image-converter'
  | 'unit-converter'
  | 'pdf-tools'
  | 'seo-analyzer'
  | 'screenshot-tool'
  | 'emoji-picker'
  | 'css-generator'
  | 'markdown-editor'
  | 'resume-builder'
  | 'invoice-generator'
  | 'link-shortener'
  | 'image-resizer'
  | 'video-to-gif'
  | 'timer-stopwatch'
  | 'age-calculator'
  | 'word-cloud'
  | 'admin'
  | 'premium'
  | 'profile';

export interface AdSlot {
  id: string;
  name: string;
  position: string;
  active: boolean;
  adsenseSlotId: string;
  customHtml: string;
  format: 'horizontal' | 'vertical' | 'square' | 'auto';
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface PopupConfig {
  id: string;
  title: string;
  message: string;
  type: 'promotion' | 'announcement' | 'tool_recommendation' | 'newsletter' | 'discount';
  icon: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  trigger: 'page_load' | 'time_delay' | 'exit_intent' | 'scroll';
  triggerDelay: number;
  targetAudience: 'all' | 'free' | 'premium' | 'new';
  frequency: 'once_per_session' | 'once_per_day' | 'every_visit' | 'once_per_week';
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  impressions: number;
  clicks: number;
}

export interface AdSettings {
  adsenseClientId: string;
  adsenseEnabled: boolean;
  autoAdsEnabled: boolean;
  adSlots: AdSlot[];
}

interface AppState {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  isAuthDialogOpen: boolean;
  setIsAuthDialogOpen: (open: boolean) => void;
  authTab: 'login' | 'register';
  setAuthTab: (tab: 'login' | 'register') => void;
  adSettings: AdSettings;
  setAdSettings: (settings: AdSettings) => void;
  popups: PopupConfig[];
  setPopups: (popups: PopupConfig[]) => void;
  activePopup: PopupConfig | null;
  setActivePopup: (popup: PopupConfig | null) => void;
  dismissedPopups: string[];
  dismissPopup: (id: string) => void;
}

const defaultAdSlots: AdSlot[] = [
  { id: 'home-top', name: 'الرئيسية - أعلى', position: 'home-top', active: true, adsenseSlotId: '', customHtml: '', format: 'horizontal', impressions: 45000, clicks: 890, revenue: 180 },
  { id: 'home-middle', name: 'الرئيسية - وسط', position: 'home-middle', active: true, adsenseSlotId: '', customHtml: '', format: 'horizontal', impressions: 38000, clicks: 720, revenue: 145 },
  { id: 'home-bottom', name: 'الرئيسية - أسفل', position: 'home-bottom', active: false, adsenseSlotId: '', customHtml: '', format: 'horizontal', impressions: 22000, clicks: 340, revenue: 68 },
  { id: 'tool-top', name: 'الأدوات - أعلى', position: 'tool-top', active: true, adsenseSlotId: '', customHtml: '', format: 'horizontal', impressions: 55000, clicks: 1100, revenue: 220 },
  { id: 'tool-bottom', name: 'الأدوات - أسفل', position: 'tool-bottom', active: true, adsenseSlotId: '', customHtml: '', format: 'horizontal', impressions: 85000, clicks: 1700, revenue: 340 },
  { id: 'tool-sidebar', name: 'الأدوات - جانبي', position: 'tool-sidebar', active: true, adsenseSlotId: '', customHtml: '', format: 'vertical', impressions: 32000, clicks: 580, revenue: 116 },
  { id: 'tool-middle', name: 'الأدوات - وسط', position: 'tool-middle', active: false, adsenseSlotId: '', customHtml: '', format: 'horizontal', impressions: 28000, clicks: 450, revenue: 90 },
  { id: 'sidebar-sticky', name: 'جانبي ثابت', position: 'sidebar-sticky', active: false, adsenseSlotId: '', customHtml: '', format: 'vertical', impressions: 18000, clicks: 280, revenue: 56 },
];

const defaultPopups: PopupConfig[] = [
  {
    id: 'popup-1',
    title: 'عرض خاص!',
    message: 'احصل على خصم 50% على الاشتراك المميز لفترة محدودة',
    type: 'discount',
    icon: '🎉',
    imageUrl: '',
    buttonText: 'اشترك الآن',
    buttonUrl: 'premium',
    trigger: 'time_delay',
    triggerDelay: 10,
    targetAudience: 'free',
    frequency: 'once_per_day',
    active: true,
    startDate: '',
    endDate: '',
    createdAt: new Date().toISOString(),
    impressions: 1200,
    clicks: 85,
  },
  {
    id: 'popup-2',
    title: 'جرب أداتنا الجديدة!',
    message: 'منشئ السيرة الذاتية - أنشئ سيرتك الذاتية الاحترافية في دقائق',
    type: 'tool_recommendation',
    icon: '🛠️',
    imageUrl: '',
    buttonText: 'جرب الآن',
    buttonUrl: 'resume-builder',
    trigger: 'page_load',
    triggerDelay: 0,
    targetAudience: 'all',
    frequency: 'once_per_session',
    active: true,
    startDate: '',
    endDate: '',
    createdAt: new Date().toISOString(),
    impressions: 890,
    clicks: 120,
  },
  {
    id: 'popup-3',
    title: 'لا تفوت أحدث الأدوات!',
    message: 'اشترك في النشرة البريدية واحصل على آخر التحديثات والأدوات الجديدة',
    type: 'newsletter',
    icon: '📧',
    imageUrl: '',
    buttonText: 'اشترك مجاناً',
    buttonUrl: '#newsletter',
    trigger: 'exit_intent',
    triggerDelay: 0,
    targetAudience: 'new',
    frequency: 'once_per_week',
    active: false,
    startDate: '',
    endDate: '',
    createdAt: new Date().toISOString(),
    impressions: 560,
    clicks: 45,
  },
];

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
  isPremium: false,
  setIsPremium: (premium) => set({ isPremium: premium }),
  user: null,
  setUser: (user) => set({ user }),
  isAuthDialogOpen: false,
  setIsAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),
  authTab: 'login',
  setAuthTab: (tab) => set({ authTab: tab }),
  adSettings: {
    adsenseClientId: '',
    adsenseEnabled: false,
    autoAdsEnabled: false,
    adSlots: defaultAdSlots,
  },
  setAdSettings: (settings) => set({ adSettings: settings }),
  popups: defaultPopups,
  setPopups: (popups) => set({ popups }),
  activePopup: null,
  setActivePopup: (popup) => set({ activePopup: popup }),
  dismissedPopups: [],
  dismissPopup: (id) => set((state) => ({ dismissedPopups: [...state.dismissedPopups, id] })),
}));
