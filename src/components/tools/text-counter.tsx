'use client';

import { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  keywords: { word: string; count: number; density: number }[];
}

function analyzeText(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const sentences = text.trim()
    ? text.split(/[.!?؟。！？]+/).filter((s) => s.trim()).length
    : 0;

  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;

  const readingMin = Math.ceil(words / 200);
  const speakingMin = Math.ceil(words / 130);

  const wordFreq: Record<string, number> = {};
  if (text.trim()) {
    text
      .trim()
      .split(/\s+/)
      .forEach((word) => {
        const cleaned = word.replace(/[^a-zA-Z\u0600-\u06FF]/g, '').toLowerCase();
        if (cleaned.length > 2) {
          wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
        }
      });
  }

  const keywords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      density: words > 0 ? parseFloat(((count / words) * 100).toFixed(1)) : 0,
    }));

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTime: readingMin > 0 ? `${readingMin} دقيقة` : 'أقل من دقيقة',
    speakingTime: speakingMin > 0 ? `${speakingMin} دقيقة` : 'أقل من دقيقة',
    keywords,
  };
}

export function TextCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const stats = analyzeText(text);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ النص إلى الحافظة' });
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'الأحرف', value: stats.characters },
    { label: 'بدون مسافات', value: stats.charactersNoSpaces },
    { label: 'الكلمات', value: stats.words },
    { label: 'الجمل', value: stats.sentences },
    { label: 'الفقرات', value: stats.paragraphs },
    { label: 'وقت القراءة', value: stats.readingTime },
    { label: 'وقت التحدث', value: stats.speakingTime },
  ];

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="عداد النص"
        description="احسب عدد الكلمات والأحرف والجمل والفقرات مع تقدير وقت القراءة وكثافة الكلمات المفتاحية"
        icon={<Type className="h-5 w-5" />}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">النص</p>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!text}>
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea
              placeholder="أدخل أو الصق النص هنا..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px] resize-y"
            />
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <p className="text-sm font-medium">الكلمات المفتاحية</p>
            {stats.keywords.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {stats.keywords.map((kw) => (
                  <div
                    key={kw.word}
                    className="flex items-center justify-between text-sm p-2 rounded bg-muted"
                  >
                    <span className="font-mono">{kw.word}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{kw.count}×</span>
                      <span className="text-xs">({kw.density}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                ستظهر الكلمات المفتاحية عند إدخال النص
              </p>
            )}

            <PremiumGate feature="درجة قابلية القراءة - تحليل مستوى صعوبة النص">
              <div className="space-y-1 p-3 border rounded-lg">
                <p className="text-sm font-medium">درجة قابلية القراءة</p>
                <p className="text-xs text-muted-foreground">تحليل مستوى صعوبة النص وفقاً لمقاييس عالمية</p>
              </div>
            </PremiumGate>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AdBanner slot="text-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
