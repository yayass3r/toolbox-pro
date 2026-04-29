import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/shared/theme-provider";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ToolBox Pro - أدوات مجانية أونلاين | صندوق الأدوات الاحترافي",
  description:
    "مجموعة شاملة من أكثر من 24 أداة مجانية أونلاين: مولّد QR، مولّد كلمات مرور، منسق JSON، مشفر Base64، منتقي ألوان، عداد نص، مولّد هاش، محول صور، محول وحدات، أدوات PDF، محلل SEO، منشئ سيرة ذاتية، منشئ فواتير والمزيد. جميع الأدوات تعمل مباشرة في المتصفح بدون تسجيل.",
  keywords: [
    "أدوات أونلاين", "أدوات مجانية", "صندوق أدوات", "مولّد QR", "مولّد كلمات مرور",
    "منسق JSON", "مشفر Base64", "منتقي ألوان", "عداد نص", "محول وحدات",
    "أدوات PDF", "محلل SEO", "مولّد CSS", "محرر Markdown", "منشئ سيرة ذاتية",
    "منشئ فواتير", "مولّد هاش", "محول صور", "لقطة شاشة", "مقص روابط",
    "free online tools", "QR code generator", "password generator", "JSON formatter",
    "Base64 encoder", "color picker", "PDF tools", "SEO analyzer", "CSS generator",
    "markdown editor", "resume builder", "invoice generator", "hash generator",
    "image converter", "unit converter", "screenshot tool", "link shortener",
    "أدوات مطور", "أدوات تصميم", "أدوات برمجة", "online toolbox", "free tools",
  ],
  authors: [{ name: "ToolBox Pro", url: "https://toolbox-pro-three.vercel.app" }],
  creator: "ToolBox Pro",
  publisher: "ToolBox Pro",
  category: "Utilities",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://toolbox-pro-three.vercel.app",
  },
  openGraph: {
    title: "ToolBox Pro - أدوات مجانية أونلاين | أكثر من 24 أداة مجانية",
    description:
      "مجموعة شاملة من الأدوات المجانية أونلاين لكل احتياجاتك الرقمية. مولّد QR، كلمات مرور، منسق JSON، أدوات PDF والمزيد!",
    type: "website",
    locale: "ar_SA",
    url: "https://toolbox-pro-three.vercel.app",
    siteName: "ToolBox Pro",
    images: [{ url: "https://toolbox-pro-three.vercel.app/og-image.png", width: 1200, height: 630, alt: "ToolBox Pro - أدوات مجانية أونلاين" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox Pro - أدوات مجانية أونلاين | أكثر من 24 أداة مجانية",
    description:
      "مجموعة شاملة من الأدوات المجانية أونلاين لكل احتياجاتك الرقمية",
    images: ["https://toolbox-pro-three.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ToolBox Pro",
              description:
                "مجموعة شاملة من الأدوات المجانية أونلاين",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ToolBox Pro",
              url: "https://toolbox-pro-three.vercel.app",
              description: "مجموعة شاملة من الأدوات المجانية أونلاين",
              inLanguage: ["ar", "en"],
              potentialAction: {
                "@type": "SearchAction",
                target: "https://toolbox-pro-three.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ToolBox Pro",
              url: "https://toolbox-pro-three.vercel.app",
              logo: "https://toolbox-pro-three.vercel.app/logo.svg",
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "الرئيسية",
                  item: "https://toolbox-pro-three.vercel.app",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "هل أدوات ToolBox Pro مجانية تماماً؟",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "نعم، جميع الأدوات الأساسية مجانية تماماً بدون تسجيل. تتوفر أيضاً نسخة مميزة بميزات إضافية.",
                  },
                },
                {
                  "@type": "Question",
                  name: "هل أحتاج لإنشاء حساب لاستخدام الأدوات؟",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "لا، يمكنك استخدام معظم الأدوات بدون حساب. إنشاء حساب مجاني يتيح لك حفظ الإعدادات والوصول لميزات إضافية.",
                  },
                },
                {
                  "@type": "Question",
                  name: "هل بياناتي آمنة عند استخدام الأدوات؟",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "نعم، جميع الأدوات تعمل مباشرة في متصفحك. لا نرسل بياناتك لأي خادم خارجي. معالجة البيانات تتم محلياً.",
                  },
                },
                {
                  "@type": "Question",
                  name: "ما الأدوات المتوفرة في ToolBox Pro؟",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "يتوفر أكثر من 24 أداة تشمل: مولّد QR، مولّد كلمات مرور، منسق JSON، مشفر Base64، منتقي ألوان، عداد نص، مولّد هاش، محول صور، محول وحدات، أدوات PDF، محلل SEO، منشئ سيرة ذاتية، منشئ فواتير والمزيد.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${notoSansArabic.variable} antialiased bg-background text-foreground font-[family-name:var(--font-arabic)]`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
