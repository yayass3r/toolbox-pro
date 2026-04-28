'use client';

import { useState } from 'react';
import { Crown, Check, X, Zap, Star, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface Feature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
}

const features: Feature[] = [
  { name: 'جميع الأدوات الأساسية', free: true, pro: true },
  { name: 'مولّد رموز QR', free: 'أساسي', pro: 'متقدم + شعار + دفعي' },
  { name: 'مولّد كلمات المرور', free: 'أساسي', pro: '+ خزنة كلمات المرور' },
  { name: 'منسق JSON', free: 'تنسيق + ضغط', pro: '+ تحويل CSV/Excel' },
  { name: 'مشفر Base64', free: 'نص + صورة', pro: '+ معالجة دفعية' },
  { name: 'منتقي الألوان', free: 'HEX/RGB/HSL', pro: '+ فاحص إمكانية الوصول' },
  { name: 'عداد النص', free: 'أساسي', pro: '+ درجة قابلية القراءة' },
  { name: 'مولّد الهاش', free: 'نص', pro: '+ هاش الملفات' },
  { name: 'محول الصور', free: 'صورة واحدة', pro: '+ تحويل دفعي' },
  { name: 'محول الوحدات', free: 'وحدات قياسية', pro: '+ وحدات مخصصة' },
  { name: 'بدون إعلانات', free: false, pro: true },
  { name: 'دعم فني أولوي', free: false, pro: true },
];

export function PremiumPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const { isPremium, setIsPremium, user } = useAppStore();
  const { toast } = useToast();

  const monthlyPrice = 9.99;
  const yearlyPrice = 79.99;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);

  const handleSubscribe = () => {
    if (!user) {
      useAppStore.getState().setIsAuthDialogOpen(true);
      toast({ title: 'يرجى تسجيل الدخول', description: 'تحتاج إلى حساب للاشتراك' });
      return;
    }
    // Placeholder for Stripe integration
    toast({
      title: 'قريباً!',
      description: 'سيتم تفعيل الدفع عبر Stripe قريباً. تم تفعيل النسخة المميزة للتجربة.',
    });
    setIsPremium(true);
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="الاشتراك المميز"
        description="ارتقِ بتجربتك مع ميزات متقدمة وبدون إعلانات"
        icon={<Crown className="h-5 w-5" />}
      />

      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 mb-4">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">وفر 33% مع الاشتراك السنوي</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">اختر خطتك</h2>
        <p className="text-muted-foreground">استمتع بأدوات مجانية أو ارتقِ للنسخة المميزة</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <Button
          variant={billing === 'monthly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBilling('monthly')}
        >
          شهري
        </Button>
        <Button
          variant={billing === 'yearly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBilling('yearly')}
          className="relative"
        >
          سنوي
          <Badge className="absolute -top-2 -left-2 bg-emerald-500 text-white text-[9px] px-1 py-0">
            وفّر
          </Badge>
        </Button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
        {/* Free Plan */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-xl font-bold">مجاني</h3>
            </div>
            <div>
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground"> / شهرياً</span>
            </div>
            <p className="text-sm text-muted-foreground">
              الوصول إلى جميع الأدوات الأساسية مجاناً
            </p>
            <Separator />
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                10 أدوات مجانية
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                استخدام غير محدود
              </li>
              <li className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-400" />
                ميزات متقدمة
              </li>
              <li className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-400" />
                بدون إعلانات
              </li>
              <li className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-400" />
                دعم فني أولوي
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled={isPremium}>
              {isPremium ? 'الخطة الحالية: مميز' : 'الخطة الحالية'}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-emerald-500 dark:border-emerald-400 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-emerald-500 text-white px-3 py-1">
              <Crown className="h-3 w-3 ml-1" />
              الأفضل قيمة
            </Badge>
          </div>
          <CardContent className="p-6 space-y-4 premium-shimmer">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xl font-bold">مميز</h3>
            </div>
            <div>
              <span className="text-4xl font-bold">
                ${billing === 'monthly' ? monthlyPrice : yearlyMonthly}
              </span>
              <span className="text-muted-foreground"> / شهرياً</span>
              {billing === 'yearly' && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  ${yearlyPrice} سنوياً - وفّر ${(monthlyPrice * 12 - yearlyPrice).toFixed(2)}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              جميع الميزات المتقدمة بدون إعلانات
            </p>
            <Separator />
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                كل مميزات الخطة المجانية
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                ميزات متقدمة لكل الأدوات
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                بدون إعلانات
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                دعم فني أولوي
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                ميزات حصرية جديدة
              </li>
            </ul>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSubscribe}
              disabled={isPremium}
            >
              {isPremium ? (
                <>
                  <Shield className="h-4 w-4 ml-1" />
                  أنت مشترك بالفعل
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 ml-1" />
                  اشترك الآن
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-4 text-center">مقارنة الميزات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-right font-medium">الميزة</th>
                  <th className="py-2 text-center font-medium">مجاني</th>
                  <th className="py-2 text-center font-medium text-emerald-600 dark:text-emerald-400">مميز</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2.5">{feature.name}</td>
                    <td className="py-2.5 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {feature.pro}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Guarantee */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-emerald-500" />
          ضمان استرداد المال خلال 30 يوماً
        </div>
      </div>

      <AdBanner slot="premium-page-bottom" format="horizontal" />
    </div>
  );
}
