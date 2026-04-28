'use client';

import { useTheme } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Crown,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, type PageId } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const toolLinks: { id: PageId; label: string }[] = [
  { id: 'qr-generator', label: 'مولّد QR' },
  { id: 'password-generator', label: 'مولّد كلمات المرور' },
  { id: 'json-formatter', label: 'منسق JSON' },
  { id: 'base64', label: 'مشفر Base64' },
  { id: 'color-picker', label: 'منتقي الألوان' },
  { id: 'text-counter', label: 'عداد النص' },
  { id: 'hash-generator', label: 'مولّد الهاش' },
  { id: 'lorem-ipsum', label: 'مولّد النص العشوائي' },
  { id: 'image-converter', label: 'محول الصور' },
  { id: 'unit-converter', label: 'محول الوحدات' },
];

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { currentPage, setCurrentPage, user, setUser, setIsAuthDialogOpen, isPremium } =
    useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageId) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold gradient-text">ToolBox Pro</span>
          {isPremium && (
            <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0">
              <Crown className="h-3 w-3 ml-0.5" />
              برو
            </Badge>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Button
            variant={currentPage === 'home' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleNav('home')}
          >
            الرئيسية
          </Button>
          <Button
            variant={currentPage === 'premium' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleNav('premium')}
            className="text-emerald-600 dark:text-emerald-400"
          >
            <Crown className="h-4 w-4 ml-1" />
            الاشتراك المميز
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleNav('profile')}>
                  <User className="h-4 w-4 ml-2" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNav('premium')}>
                  <Crown className="h-4 w-4 ml-2" />
                  الاشتراك المميز
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsAuthDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              تسجيل الدخول
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="px-4 pt-4 pb-2 text-lg font-bold gradient-text">
                ToolBox Pro
              </SheetTitle>
              <div className="flex flex-col gap-1 p-4">
                <Button
                  variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => handleNav('home')}
                >
                  الرئيسية
                </Button>
                <Button
                  variant={currentPage === 'premium' ? 'secondary' : 'ghost'}
                  className="justify-start text-emerald-600 dark:text-emerald-400"
                  onClick={() => handleNav('premium')}
                >
                  <Crown className="h-4 w-4 ml-2" />
                  الاشتراك المميز
                </Button>
                <div className="my-2 border-t" />
                <p className="px-3 text-xs text-muted-foreground font-semibold mb-1">
                  الأدوات
                </p>
                {toolLinks.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={currentPage === tool.id ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleNav(tool.id)}
                  >
                    {tool.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
