'use client';

import { Heart, Crown, Twitter, Facebook, Linkedin, MessageCircle, ExternalLink } from 'lucide-react';
import { useAppStore, type PageId } from '@/lib/store';

const quickLinks: { id: PageId; label: string }[] = [
  { id: 'qr-generator', label: 'مولّد QR' },
  { id: 'password-generator', label: 'مولّد كلمات المرور' },
  { id: 'json-formatter', label: 'منسق JSON' },
  { id: 'base64', label: 'مشفر Base64' },
  { id: 'color-picker', label: 'منتقي الألوان' },
];

const moreLinks: { id: PageId; label: string }[] = [
  { id: 'text-counter', label: 'عداد النص' },
  { id: 'hash-generator', label: 'مولّد الهاش' },
  { id: 'lorem-ipsum', label: 'مولّد النص العشوائي' },
  { id: 'image-converter', label: 'محول الصور' },
  { id: 'unit-converter', label: 'محول الوحدات' },
];

const advancedLinks: { id: PageId; label: string }[] = [
  { id: 'pdf-tools', label: 'أدوات PDF' },
  { id: 'seo-analyzer', label: 'محلل SEO' },
  { id: 'screenshot-tool', label: 'لقطة شاشة' },
  { id: 'emoji-picker', label: 'منتقي إيموجي' },
  { id: 'css-generator', label: 'مولّد CSS' },
  { id: 'markdown-editor', label: 'محرر Markdown' },
];

export function Footer() {
  const { setCurrentPage } = useAppStore();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-2">ToolBox Pro</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              صندوق الأدوات الاحترافي - مجموعة شاملة من الأدوات المجانية أونلاين
              لكل احتياجاتك الرقمية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">أدوات سريعة</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setCurrentPage(link.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-semibold mb-3">المزيد من الأدوات</h4>
            <ul className="space-y-1.5">
              {moreLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setCurrentPage(link.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Advanced Links */}
          <div>
            <h4 className="font-semibold mb-3">أدوات متقدمة</h4>
            <ul className="space-y-1.5">
              {advancedLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setCurrentPage(link.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="font-semibold mb-3">عن الموقع</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  من نحن
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  سياسة الخصوصية
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  شروط الاستخدام
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            صُنع بـ <Heart className="h-3 w-3 text-red-500 fill-red-500" /> بواسطة ToolBox Pro
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/toolboxpro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-sky-500 transition-colors"
              title="تويتر/X"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com/toolboxpro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-600 transition-colors"
              title="فيسبوك"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/company/toolboxpro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-indigo-500 transition-colors"
              title="لينكدإن"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-green-500 transition-colors"
              title="واتساب"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>

          <button
            onClick={() => setCurrentPage('premium')}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Crown className="h-3 w-3" />
            ترقية إلى النسخة المميزة
          </button>
        </div>
      </div>
    </footer>
  );
}
