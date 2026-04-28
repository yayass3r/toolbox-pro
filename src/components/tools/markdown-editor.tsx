'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Quote,
  Link,
  Eye,
  Pencil,
  Download,
  Copy,
  Maximize2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

const defaultMarkdown = `# محرر Markdown

## مرحباً بك في محرر Markdown

هذا محرر Markdown بسيط وقوي يعمل مباشرة في المتصفح.

### الميزات

- **كتابة Markdown** مع معاينة مباشرة
- *تنسيق النصوص* بسهولة
- إنشاء القوائم والجداول
- إدراج الأكواد البرمجية

### مثال على كود

\`\`\`javascript
function hello() {
  console.log("مرحباً بالعالم!");
}
\`\`\`

### اقتباس

> التعلم المستمر هو مفتاح النجاح في عالم البرمجة.

### جدول

| الأداة | الوصف | الحالة |
|--------|--------|--------|
| محرر Markdown | كتابة وتنسيق النصوص | متاح |
| مولّد CSS | إنشاء تأثيرات CSS | متاح |
| أدوات PDF | معالجة ملفات PDF | مميز |

### قائمة مرقمة

1. افتح المحرر
2. اكتب المحتوى
3. شاهد المعاينة مباشرة
4. صدّر النتيجة

---

*صُنع بـ ❤️ باستخدام ToolBox Pro*
`;

export function MarkdownEditor() {
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea[name="markdown-editor"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end);

    setMarkdown(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const exportHTML = useCallback(() => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مستند Markdown</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; direction: rtl; line-height: 1.8; color: #333; }
    h1, h2, h3 { color: #0d9488; }
    code { background: #f0fdfa; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre { background: #f0fdfa; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    blockquote { border-right: 4px solid #0d9488; padding-right: 1rem; margin-right: 0; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
    th { background: #f0fdfa; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0; }
    img { max-width: 100%; }
    a { color: #0d9488; }
  </style>
</head>
<body>
${document.querySelector('.markdown-preview')?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'تم التصدير', description: 'تم تصدير المستند كملف HTML' });
  }, [toast]);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast({ title: 'تم النسخ', description: 'تم نسخ المحتوى إلى الحافظة' });
  };

  const copyHTML = () => {
    const previewEl = document.querySelector('.markdown-preview');
    if (previewEl) {
      navigator.clipboard.writeText(previewEl.innerHTML);
      toast({ title: 'تم النسخ', description: 'تم نسخ كود HTML إلى الحافظة' });
    }
  };

  const toolbarButtons = [
    { icon: <Bold className="h-4 w-4" />, title: 'عريض', action: () => insertMarkdown('**', '**') },
    { icon: <Italic className="h-4 w-4" />, title: 'مائل', action: () => insertMarkdown('*', '*') },
    { icon: <Heading1 className="h-4 w-4" />, title: 'عنوان 1', action: () => insertMarkdown('# ') },
    { icon: <Heading2 className="h-4 w-4" />, title: 'عنوان 2', action: () => insertMarkdown('## ') },
    { icon: <List className="h-4 w-4" />, title: 'قائمة', action: () => insertMarkdown('- ') },
    { icon: <ListOrdered className="h-4 w-4" />, title: 'قائمة مرقمة', action: () => insertMarkdown('1. ') },
    { icon: <Code className="h-4 w-4" />, title: 'كود', action: () => insertMarkdown('`', '`') },
    { icon: <Quote className="h-4 w-4" />, title: 'اقتباس', action: () => insertMarkdown('> ') },
    { icon: <Link className="h-4 w-4" />, title: 'رابط', action: () => insertMarkdown('[', '](url)') },
  ];

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="محرر Markdown"
        description="اكتب Markdown مع معاينة مباشرة وتصدير HTML"
        icon={<FileText className="h-5 w-5" />}
      />

      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-1">
            {toolbarButtons.map((btn, idx) => (
              <Button key={idx} variant="ghost" size="icon" className="h-8 w-8" title={btn.title} onClick={btn.action}>
                {btn.icon}
              </Button>
            ))}
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              title="تحرير"
              onClick={() => setViewMode('edit')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              title="معاينة"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'split' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              title="منقسم"
              onClick={() => setViewMode('split')}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8" title="نسخ Markdown" onClick={copyMarkdown}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="تصدير HTML" onClick={exportHTML}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-medium">تحرير</span>
                <Badge variant="secondary" className="text-xs">
                  {markdown.length} حرف
                </Badge>
              </div>
              <textarea
                name="markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[500px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
                dir="auto"
                placeholder="اكتب Markdown هنا..."
              />
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-medium">معاينة</span>
                <Button variant="ghost" size="sm" onClick={copyHTML} className="h-6 text-xs">
                  <Copy className="h-3 w-3 ml-1" />
                  نسخ HTML
                </Button>
              </div>
              <div
                className="markdown-preview p-4 h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none prose-headings:text-emerald-700 dark:prose-headings:text-emerald-400 prose-a:text-teal-600"
                dir="auto"
              >
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Premium Save */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <PremiumGate feature="حفظ المستندات والتصدير كـ PDF">
            <div className="flex items-center justify-center gap-4 py-4">
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 ml-1" />
                تصدير PDF
              </Button>
              <Button variant="outline" disabled>
                حفظ المستند
              </Button>
            </div>
          </PremiumGate>
        </CardContent>
      </Card>

      <div className="mt-6">
        <AdBanner slot="markdown-editor-bottom" format="horizontal" />
      </div>
    </div>
  );
}
