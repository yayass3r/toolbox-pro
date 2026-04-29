import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | ToolBox Pro',
  description: 'سياسة الخصوصية لمنصة ToolBox Pro - نحمي بياناتك ونحترم خصوصيتك.',
  openGraph: {
    title: 'سياسة الخصوصية | ToolBox Pro',
    description: 'تعرف على كيفية حماية بياناتك في ToolBox Pro',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">سياسة الخصوصية</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-lg">آخر تحديث: {new Date().toLocaleDateString('ar')}</p>

          <section>
            <h2 className="text-2xl font-bold mb-3">مقدمة</h2>
            <p className="text-muted-foreground leading-relaxed">
              نحن في ToolBox Pro نأخذ خصوصيتك على محمل الجد. هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا. معظم أدواتنا تعمل محلياً في متصفحك ولا ترسل أي بيانات لخوادمنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">المعلومات التي نجمعها</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>معلومات الحساب:</strong> عند التسجيل، نجمع عنوان البريد الإلكتروني والاسم. هذه المعلومات ضرورية لتقديم الخدمة.</li>
              <li><strong>بيانات الاستخدام:</strong> نجمع بيانات مجهولة حول الأدوات الأكثر استخداماً لتحسين الخدمة.</li>
              <li><strong>ملفات تعريف الارتباط:</strong> نستخدم ملفات تعريف الارتباط لتخصيص تجربتك وتحليل حركة المرور.</li>
              <li><strong>بيانات الإعلانات:</strong> نستخدم Google AdSense لعرض الإعلانات، والتي قد تستخدم ملفات تعريف الارتباط لعرض إعلانات مناسبة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">ما لا نجمعه</h2>
            <p className="text-muted-foreground leading-relaxed">
              الأدوات تعالج بياناتك محلياً في المتصفح. النصوص التي تكتبها، الصور التي تحولها، كلمات المرور التي تولّدها، وبيانات JSON التي تنسقها - كلها تبقى في جهازك ولا تُرسل لأي خادم خارجي.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">مشاركة المعلومات</h2>
            <p className="text-muted-foreground leading-relaxed">
              لا نبيع أو نتاجر بمعلوماتك الشخصية. قد نشارك بيانات مجهولة مع مقدمي خدمات التحليل لتحسين الخدمة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">الأمان</h2>
            <p className="text-muted-foreground leading-relaxed">
              نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. نستخدم تشفير SSL/TLS وجدران الحماية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">حقوقك</h2>
            <p className="text-muted-foreground leading-relaxed">
              لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. يمكنك حذف حسابك في أي وقت من خلال التواصل معنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">الاتصال بنا</h2>
            <p className="text-muted-foreground leading-relaxed">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني: support@toolboxpro.dev
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
