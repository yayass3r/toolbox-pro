'use client';

import { Crown, Mail, User, Shield, ArrowRight, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ToolHeader } from '@/components/shared/tool-header';
import { useAppStore } from '@/lib/store';

export function ProfilePage() {
  const { user, isPremium, setCurrentPage, setUser, setIsPremium } = useAppStore();

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <User className="h-16 w-16 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
        <Button onClick={() => useAppStore.getState().setIsAuthDialogOpen(true)}>
          تسجيل الدخول
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <ToolHeader
        title="الملف الشخصي"
        description="إعدادات حسابك ومعلومات الاشتراك"
        icon={<User className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold">حالة الاشتراك</span>
              </div>
              <Badge className={isPremium ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}>
                {isPremium ? 'مميز' : 'مجاني'}
              </Badge>
            </div>

            {isPremium ? (
              <div className="space-y-2">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  ✨ أنت مستخدم مميز! استمتع بجميع الميزات المتقدمة.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">هاش الملفات</Badge>
                  <Badge variant="outline">تحويل دفعي</Badge>
                  <Badge variant="outline">خزنة كلمات المرور</Badge>
                  <Badge variant="outline">بدون إعلانات</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  قم بالترقية للوصول إلى جميع الميزات المتقدمة وإزالة الإعلانات.
                </p>
                <Button
                  onClick={() => setCurrentPage('premium')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Crown className="h-4 w-4 ml-1" />
                  ترقية إلى النسخة المميزة
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">10</p>
              <p className="text-xs text-muted-foreground">أدوات متاحة</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{isPremium ? '10' : '0'}</p>
              <p className="text-xs text-muted-foreground">ميزات مميزة</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {!isPremium && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentPage('premium')}
              >
                <Crown className="h-4 w-4 ml-2 text-emerald-600" />
                إدارة الاشتراك
                <ArrowRight className="h-4 w-4 mr-auto" />
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                setUser(null);
                setIsPremium(false);
              }}
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
