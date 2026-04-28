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
}

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
}));
