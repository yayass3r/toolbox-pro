'use client';

import { useAppStore, type PageId } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdBanner } from '@/components/shared/ad-banner';
import {
  QrCode,
  Key,
  Braces,
  Binary,
  Pipette,
  Type,
  Hash,
  FileText,
  ImageIcon,
  Ruler,
  Crown,
  Zap,
  Users,
  Wrench,
  Star,
  ArrowLeft,
  Sparkles,
  FileOutput,
  Search,
  Camera,
  Smile,
  Paintbrush,
  Edit3,
  Shield,
  Lock,
} from 'lucide-react';

const tools: { id: PageId; name: string; desc: string; icon: React.ReactNode; color: string; premium?: boolean }[] = [
  {
    id: 'qr-generator',
    name: 'مولّد رموز QR',
    desc: 'أنشئ رموز QR مخصصة للروابط والنصوص',
    icon: <QrCode className="h-6 w-6" />,
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'password-generator',
    name: 'مولّد كلمات المرور',
    desc: 'أنشئ كلمات مرور قوية وآمنة',
    icon: <Key className="h-6 w-6" />,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'json-formatter',
    name: 'منسق JSON',
    desc: 'نسّق وضغط وتحقق من JSON',
    icon: <Braces className="h-6 w-6" />,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'base64',
    name: 'مشفر Base64',
    desc: 'شفر وألغِ تشفير النصوص والصور',
    icon: <Binary className="h-6 w-6" />,
    color: 'from-lime-500 to-lime-600',
  },
  {
    id: 'color-picker',
    name: 'منتقي الألوان',
    desc: 'اختر الألوان وحوّل بين الصيغ',
    icon: <Pipette className="h-6 w-6" />,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'text-counter',
    name: 'عداد النص',
    desc: 'احسب الكلمات والأحرف والجمل',
    icon: <Type className="h-6 w-6" />,
    color: 'from-teal-600 to-teal-700',
  },
  {
    id: 'hash-generator',
    name: 'مولّد الهاش',
    desc: 'أنشئ هاشات MD5 و SHA',
    icon: <Hash className="h-6 w-6" />,
    color: 'from-emerald-600 to-emerald-700',
  },
  {
    id: 'lorem-ipsum',
    name: 'مولّد النص العشوائي',
    desc: 'أنشئ نصاً عشوائياً عربي وإنجليزي',
    icon: <FileText className="h-6 w-6" />,
    color: 'from-green-600 to-green-700',
  },
  {
    id: 'image-converter',
    name: 'محول الصور',
    desc: 'حوّل الصور بين PNG و JPG و WebP',
    icon: <ImageIcon className="h-6 w-6" />,
    color: 'from-lime-600 to-lime-700',
  },
  {
    id: 'unit-converter',
    name: 'محول الوحدات',
    desc: 'حوّل بين وحدات الطول والوزن والحرارة',
    icon: <Ruler className="h-6 w-6" />,
    color: 'from-cyan-600 to-cyan-700',
  },
];

const premiumTools: { id: PageId; name: string; desc: string; icon: React.ReactNode; color: string; premium?: boolean }[] = [
  {
    id: 'pdf-tools',
    name: 'أدوات PDF',
    desc: 'ادمج، قسم، اضغط، وحوّل ملفات PDF',
    icon: <FileOutput className="h-6 w-6" />,
    color: 'from-red-500 to-red-600',
    premium: true,
  },
  {
    id: 'seo-analyzer',
    name: 'محلل SEO',
    desc: 'حلّل موقعك واحصل على تقييم SEO',
    icon: <Search className="h-6 w-6" />,
    color: 'from-amber-500 to-amber-600',
    premium: true,
  },
  {
    id: 'screenshot-tool',
    name: 'أداة لقطات الشاشة',
    desc: 'التقط لقطات شاشة لأي موقع',
    icon: <Camera className="h-6 w-6" />,
    color: 'from-violet-500 to-violet-600',
  },
  {
    id: 'emoji-picker',
    name: 'منتقي الرموز التعبيرية',
    desc: 'ابحث وانسخ رموز الإيموجي',
    icon: <Smile className="h-6 w-6" />,
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'css-generator',
    name: 'مولّد CSS',
    desc: 'أنشئ ظلال، تدرجات، حواف دائرية وحركات',
    icon: <Paintbrush className="h-6 w-6" />,
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'markdown-editor',
    name: 'محرر Markdown',
    desc: 'اكتب Markdown مع معاينة مباشرة',
    icon: <Edit3 className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600',
  },
];

const stats = [
  { icon: <Wrench className="h-5 w-5" />, value: '16+', label: 'أداة مجانية' },
  { icon: <Users className="h-5 w-5" />, value: '50K+', label: 'مستخدم نشط' },
  { icon: <Zap className="h-5 w-5" />, value: '1M+', label: 'عملية تنفيذ' },
  { icon: <Star className="h-5 w-5" />, value: '4.9', label: 'تقييم المستخدمين' },
];

export function HomePage() {
  const { setCurrentPage, user } = useAppStore();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 p-8 md:p-12 mb-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              مجاني 100%
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            أدوات أونلاين مجانية
            <br />
            <span className="text-teal-200">لكل احتياجاتك الرقمية</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl">
            مجموعة شاملة من الأدوات المجانية والسريعة التي تعمل مباشرة في المتصفح.
            لا حاجة للتسجيل أو التحميل.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-white/90 font-semibold"
              onClick={() => {
                document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              استكشف الأدوات
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => setCurrentPage('premium')}
            >
              <Crown className="h-4 w-4 ml-1" />
              النسخة المميزة
            </Button>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner slot="home-top" format="horizontal" className="mb-8" />

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Tools Grid */}
      <section id="tools-grid" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">الأدوات المجانية</h2>
          <Badge variant="secondary">{tools.length} أداة</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => setCurrentPage(tool.id)}
            >
              <CardContent className="p-5">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  {tool.icon}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner slot="home-middle" format="horizontal" className="mb-8" />

      {/* Premium Tools */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">أدوات متقدمة</h2>
            <Crown className="h-5 w-5 text-emerald-600" />
          </div>
          <Badge variant="secondary">{premiumTools.length} أداة</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {premiumTools.map((tool) => (
            <Card
              key={tool.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-emerald-200 dark:border-emerald-800"
              onClick={() => setCurrentPage(tool.id)}
            >
              <CardContent className="p-5 relative">
                {tool.premium && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0">
                      <Lock className="h-3 w-3 ml-0.5" />
                      مميز
                    </Badge>
                  </div>
                )}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  {tool.icon}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 md:p-12 mb-8 text-center">
        <Crown className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          ارتقِ إلى النسخة المميزة
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          احصل على ميزات متقدمة، بدون إعلانات، ودعم فني أولوي بسعر رمزي
        </p>
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => setCurrentPage('premium')}
        >
          <Crown className="h-4 w-4 ml-1" />
          اشترك الآن - $9.99/شهر
        </Button>
      </section>

      {/* Newsletter */}
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">ابقَ على اطلاع</h3>
          <p className="text-sm text-muted-foreground mb-4">
            اشترك في النشرة البريدية لمعرفة آخر الأدوات والميزات
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-2 border rounded-lg text-sm bg-background"
              dir="ltr"
            />
            <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
              اشترك
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Link (only for admin) */}
      {user?.email === 'yayass3r@gmail.com' && (
        <Card className="mb-8 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium">لوحة الإدارة</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage('admin')}
            >
              الدخول
              <ArrowLeft className="h-3 w-3 mr-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bottom Ad */}
      <AdBanner slot="home-bottom" format="horizontal" />
    </div>
  );
}
