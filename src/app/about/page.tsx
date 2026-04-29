import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حول ToolBox Pro | صندوق الأدوات الاحترافي',
  description: 'تعرف على ToolBox Pro - منصة الأدوات المجانية أونلاين التي تقدم أكثر من 24 أداة احترافية تعمل مباشرة في المتصفح.',
  openGraph: {
    title: 'حول ToolBox Pro',
    description: 'منصة الأدوات المجانية أونلاين التي تقدم أكثر من 24 أداة احترافية',
    url: 'https://toolbox-pro-three.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">حول ToolBox Pro</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">ما هو ToolBox Pro؟</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              ToolBox Pro هو منصة شاملة للأدوات المجانية أونلاين، مصممة لمساعدة المطورين والمصممين والمسوقين وكل من يحتاج أدوات رقمية سريعة وموثوقة. نوفر أكثر من 24 أداة احترافية تعمل مباشرة في المتصفح بدون الحاجة لتسجيل أو تحميل أي برنامج.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">لماذا ToolBox Pro؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-muted/50">
                <h3 className="font-bold text-lg mb-2">مجاني 100%</h3>
                <p className="text-muted-foreground">جميع الأدوات الأساسية مجانية بالكامل بدون حدود على الاستخدام. نوفر أيضاً نسخة مميزة بميزات إضافية للاحتياجات المتقدمة.</p>
              </div>
              <div className="p-6 rounded-xl bg-muted/50">
                <h3 className="font-bold text-lg mb-2">سريع وآمن</h3>
                <p className="text-muted-foreground">جميع الأدوات تعمل مباشرة في متصفحك. لا نرسل بياناتك لأي خادم خارجي. معالجة البيانات تتم محلياً لضمان السرية والأمان.</p>
              </div>
              <div className="p-6 rounded-xl bg-muted/50">
                <h3 className="font-bold text-lg mb-2">بدون تسجيل</h3>
                <p className="text-muted-foreground">استخدم الأدوات فوراً بدون إنشاء حساب. التسجيل اختياري ويمنحك ميزات إضافية مثل حفظ الإعدادات والوصول للأدوات المميزة.</p>
              </div>
              <div className="p-6 rounded-xl bg-muted/50">
                <h3 className="font-bold text-lg mb-2">متوفر بالعربية</h3>
                <p className="text-muted-foreground">واجهة عربية كاملة مع دعم RTL، مصممة خصيصاً للمستخدم العربي. جميع الأدوات والوصف مترجمة بعناية.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">أدواتنا</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              نوفر مجموعة متنوعة من الأدوات تشمل:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>أدوات المطورين:</strong> منسق JSON، مشفر Base64، مولّد الهاش، محول وحدات، محرر Markdown، مولّد CSS</li>
              <li><strong>أدوات الأمان:</strong> مولّد كلمات المرور، مولّد الهاش</li>
              <li><strong>أدوات التصميم:</strong> منتقي الألوان، محول الصور، مغير حجم الصور، سحابة الكلمات</li>
              <li><strong>أدوات الإنتاجية:</strong> أدوات PDF، منشئ السيرة الذاتية، منشئ الفواتير، عداد ومؤقت</li>
              <li><strong>أدوات التسويق:</strong> محلل SEO، مولّد QR، مقص الروابط، لقطة شاشة</li>
              <li><strong>أدوات مساعدة:</strong> عداد النص، منتقي إيموجي، حاسبة العمر، محول فيديو إلى GIF</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">التقنية</h2>
            <p className="text-muted-foreground leading-relaxed">
              تم بناء ToolBox Pro باستخدام أحدث التقنيات بما في ذلك Next.js 16 و TypeScript و Tailwind CSS. نستخدم Appwrite كخلفية للمصادقة وقاعدة البيانات، ونُشر على Vercel لضمان الأداء العالي والتوفر المستمر.
            </p>
          </section>

          <section className="text-center py-8">
            <p className="text-muted-foreground">
              صُنع بـ ❤️ بواسطة فريق ToolBox Pro
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} ToolBox Pro. جميع الحقوق محفوظة.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
