import { MetadataRoute } from 'next';

const SITE_URL = 'https://toolbox-pro-three.vercel.app';

const tools = [
  { id: 'qr-generator', name: 'مولّد رموز QR', priority: 0.9 },
  { id: 'password-generator', name: 'مولّد كلمات المرور', priority: 0.9 },
  { id: 'json-formatter', name: 'منسق JSON', priority: 0.8 },
  { id: 'base64', name: 'مشفر Base64', priority: 0.8 },
  { id: 'color-picker', name: 'منتقي الألوان', priority: 0.7 },
  { id: 'text-counter', name: 'عداد النص', priority: 0.7 },
  { id: 'hash-generator', name: 'مولّد الهاش', priority: 0.7 },
  { id: 'lorem-ipsum', name: 'مولّد النص العشوائي', priority: 0.6 },
  { id: 'image-converter', name: 'محول الصور', priority: 0.8 },
  { id: 'unit-converter', name: 'محول الوحدات', priority: 0.7 },
  { id: 'pdf-tools', name: 'أدوات PDF', priority: 0.9 },
  { id: 'seo-analyzer', name: 'محلل SEO', priority: 0.9 },
  { id: 'screenshot-tool', name: 'أداة لقطات الشاشة', priority: 0.7 },
  { id: 'emoji-picker', name: 'منتقي الرموز التعبيرية', priority: 0.6 },
  { id: 'css-generator', name: 'مولّد CSS', priority: 0.8 },
  { id: 'markdown-editor', name: 'محرر Markdown', priority: 0.8 },
  { id: 'resume-builder', name: 'منشئ السيرة الذاتية', priority: 0.9 },
  { id: 'invoice-generator', name: 'منشئ الفواتير', priority: 0.9 },
  { id: 'link-shortener', name: 'مقص الروابط', priority: 0.8 },
  { id: 'image-resizer', name: 'مغير حجم الصور', priority: 0.7 },
  { id: 'video-to-gif', name: 'محول فيديو إلى GIF', priority: 0.7 },
  { id: 'timer-stopwatch', name: 'عداد ومؤقت', priority: 0.6 },
  { id: 'age-calculator', name: 'حاسبة العمر', priority: 0.6 },
  { id: 'word-cloud', name: 'سحابة الكلمات', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const toolPages = tools.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.priority,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/premium`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...toolPages,
  ];
}
