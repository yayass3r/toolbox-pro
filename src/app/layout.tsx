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
    "مجموعة شاملة من الأدوات المجانية أونلاين: مولّد QR، مولّد كلمات مرور، منسق JSON، مشفر Base64، منتقي ألوان، عداد نص، مولّد هاش، مولّد نص عشوائي، محول صور، محول وحدات والمزيد.",
  keywords: [
    "أدوات أونلاين",
    "مولّد QR",
    "مولّد كلمات مرور",
    "منسق JSON",
    "مشفر Base64",
    "منتقي ألوان",
    "عداد نص",
    "محول وحدات",
    "أدوات مجانية",
    "صندوق أدوات",
  ],
  authors: [{ name: "ToolBox Pro" }],
  openGraph: {
    title: "ToolBox Pro - أدوات مجانية أونلاين",
    description:
      "مجموعة شاملة من الأدوات المجانية أونلاين لكل احتياجاتك الرقمية",
    type: "website",
    locale: "ar_SA",
    siteName: "ToolBox Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox Pro - أدوات مجانية أونلاين",
    description:
      "مجموعة شاملة من الأدوات المجانية أونلاين لكل احتياجاتك الرقمية",
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
