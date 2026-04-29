import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | ToolBox Pro',
  description: 'شروط استخدام منصة ToolBox Pro للأدوات المجانية أونلاين.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">شروط الاستخدام</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-lg">آخر تحديث: {new Date().toLocaleDateString('ar')}</p>

          <section>
            <h2 className="text-2xl font-bold mb-3">قبول الشروط</h2>
            <p className="text-muted-foreground leading-relaxed">
              باستخدامك لموقع ToolBox Pro، فإنك توافق على هذه الشروط. إذا لم توافق على أي جزء منها، يرجى عدم استخدام الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">استخدام الخدمة</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>يُسمح باستخدام الأدوات للأغراض الشخصية والتجارية المشروعة.</li>
              <li>لا يُسمح باستخدام الخدمة لأي أغراض غير قانونية أو ضارة.</li>
              <li>لا يُسمح بمحاولة الوصول غير المصرح به لأنظمتنا.</li>
              <li>نحتفظ بالحق في تقييد الوصول لأي مستخدم ينتهك هذه الشروط.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">الملكية الفكرية</h2>
            <p className="text-muted-foreground leading-relaxed">
              جميع المحتويات والتصاميم والأكواد على الموقع هي ملك لـ ToolBox Pro ومحمية بقوانين الملكية الفكرية. لا يُسمح بإعادة إنتاج أو توزيع أي جزء من الموقع بدون إذن مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">إخلاء المسؤولية</h2>
            <p className="text-muted-foreground leading-relaxed">
              الخدمة مقدمة "كما هي" بدون ضمانات من أي نوع. لا نضمن دقة النتائج أو توفر الخدمة بشكل مستمر. أنت مسؤول عن التحقق من دقة المخرجات.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">الاشتراكات المدفوعة</h2>
            <p className="text-muted-foreground leading-relaxed">
              النسخة المميزة متاحة باشتراك شهري أو سنوي. يمكن إلغاء الاشتراك في أي وقت. لا يتم استرداد المبالغ للأجزاء غير المستخدمة من فترة الاشتراك.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">التغييرات</h2>
            <p className="text-muted-foreground leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على الموقع.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
