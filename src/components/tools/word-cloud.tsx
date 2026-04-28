'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Cloud, Download, Palette, Type, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

interface WordItem {
  text: string;
  size: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  font: string;
}

const colorPalettes = {
  ocean: ['#0d9488', '#059669', '#10b981', '#2dd4bf', '#34d399', '#6ee7b7', '#14b8a6', '#0f766e'],
  sunset: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#dc2626', '#d97706'],
  purple: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6', '#9333ea', '#a855f7'],
  neon: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#6366f1', '#d946ef'],
  earth: ['#92400e', '#b45309', '#ca8a04', '#65a30d', '#16a34a', '#0d9488', '#78716c', '#a8a29e'],
};

const fonts = ['Arial', 'Georgia', 'Courier New', 'Verdana', 'Impact', 'Trebuchet MS'];

function processText(text: string): Map<string, number> {
  const stopWords = new Set(['و', 'في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي', 'التي', 'هو', 'هي', 'كان', 'كانت', 'أن', 'لا', 'ما', 'لم', 'لن', 'قد', 'كل', 'بعد', 'قبل', 'بين', 'حتى', 'عند', 'ثم', 'أو', 'أم', 'بل', 'لكن', 'أن', 'إن', 'حين', 'أي', 'بعض', 'نحن', 'أنت', 'هم', 'هؤلاء', 'أولئك', 'ذلك', 'تلك', 'هنا', 'هناك', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why']);

  const words = text.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, '').split(/\s+/).filter((w) => w.length > 1 && !stopWords.has(w));

  const freq = new Map<string, number>();
  words.forEach((word) => {
    freq.set(word, (freq.get(word) || 0) + 1);
  });

  return freq;
}

function generateWordCloud(
  wordFreqs: Map<string, number>,
  width: number,
  height: number,
  palette: string,
  font: string,
  maxWords: number
): WordItem[] {
  const colors = colorPalettes[palette as keyof typeof colorPalettes] || colorPalettes.ocean;
  const entries = [...wordFreqs.entries()].sort((a, b) => b[1] - a[1]).slice(0, maxWords);

  if (entries.length === 0) return [];

  const maxFreq = entries[0][1];
  const minFreq = entries[entries.length - 1][1];
  const items: WordItem[] = [];
  const placed: { x: number; y: number; w: number; h: number }[] = [];

  const centerX = width / 2;
  const centerY = height / 2;

  entries.forEach(([word, freq], idx) => {
    const sizeRange = maxFreq === minFreq ? 1 : maxFreq - minFreq;
    const normalizedFreq = (freq - minFreq) / sizeRange;
    const fontSize = Math.max(14, Math.min(72, 14 + normalizedFreq * 58));
    const rotation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 90 : -90) : 0;

    const textWidth = word.length * fontSize * 0.6;
    const textHeight = fontSize * 1.2;

    // Spiral placement
    let placed_flag = false;
    for (let r = 0; r < Math.max(width, height) / 2 && !placed_flag; r += 5) {
      for (let angle = 0; angle < 360 && !placed_flag; angle += 15) {
        const rad = (angle * Math.PI) / 180;
        const x = centerX + r * Math.cos(rad) - textWidth / 2;
        const y = centerY + r * Math.sin(rad) - textHeight / 2;

        if (x < 0 || y < 0 || x + textWidth > width || y + textHeight > height) continue;

        const overlap = placed.some((p) =>
          x < p.x + p.w && x + textWidth > p.x && y < p.y + p.h && y + textHeight > p.y
        );

        if (!overlap) {
          placed.push({ x, y, w: textWidth, h: textHeight });
          items.push({
            text: word,
            size: fontSize,
            x: x + textWidth / 2,
            y: y + textHeight / 2,
            color: colors[idx % colors.length],
            rotation,
            font,
          });
          placed_flag = true;
        }
      }
    }
  });

  return items;
}

export function WordCloud() {
  const { isPremium } = useAppStore();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('');
  const [palette, setPalette] = useState('ocean');
  const [font, setFont] = useState('Arial');
  const [maxWords, setMaxWords] = useState(50);
  const [showRotation, setShowRotation] = useState(true);
  const [words, setWords] = useState<WordItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topWords, setTopWords] = useState<[string, number][]>([]);

  const generate = useCallback(() => {
    if (!text.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال نص', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    const freqs = processText(text);
    const topEntries = [...freqs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    setTopWords(topEntries);

    setTimeout(() => {
      const cloudWords = generateWordCloud(freqs, 800, 500, palette, font, maxWords);
      setWords(cloudWords);
      setIsGenerating(false);
    }, 100);
  }, [text, palette, font, maxWords, toast]);

  useEffect(() => {
    if (words.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 500);

      words.forEach((word) => {
        ctx.save();
        ctx.translate(word.x, word.y);
        if (showRotation && word.rotation !== 0) {
          ctx.rotate((word.rotation * Math.PI) / 180);
        }
        ctx.font = `bold ${word.size}px ${word.font}`;
        ctx.fillStyle = word.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(word.text, 0, 0);
        ctx.restore();
      });
    }
  }, [words, showRotation]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'word-cloud.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast({ title: 'تم التحميل', description: 'تم تحميل سحابة الكلمات بصيغة PNG' });
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مولّد سحابة الكلمات"
        description="حوّل النصوص إلى سحابة كلمات ملونة ومخصصة"
        icon={<Cloud className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>النص</Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="أدخل النص هنا... كلما كررت كلمة أكثر، ظهرت أكبر في السحابة"
                  rows={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>ألوان</Label>
                  <Select value={palette} onValueChange={setPalette}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ocean">🌊 محيطي</SelectItem>
                      <SelectItem value="sunset">🌅 غروبي</SelectItem>
                      <SelectItem value="purple">💜 بنفسجي</SelectItem>
                      <SelectItem value="neon">💡 نيون</SelectItem>
                      <SelectItem value="earth">🌍 ترابي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>الخط</Label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fonts.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label>أقصى عدد كلمات: {maxWords}</Label>
                <Input type="range" min={10} max={100} value={maxWords} onChange={(e) => setMaxWords(Number(e.target.value))} />
              </div>

              <div className="flex items-center justify-between">
                <Label>تدوير الكلمات</Label>
                <Switch checked={showRotation} onCheckedChange={setShowRotation} />
              </div>

              <Button onClick={generate} className="w-full bg-teal-600 hover:bg-teal-700" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1" />
                    جارٍ الإنشاء...
                  </>
                ) : (
                  <>
                    <Cloud className="h-4 w-4 ml-1" />
                    إنشاء سحابة الكلمات
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Top Words */}
          {topWords.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-3">أكثر الكلمات تكراراً</h3>
                <div className="space-y-2">
                  {topWords.map(([word, count], idx) => (
                    <div key={word} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                        <span className="text-sm font-medium">{word}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${(count / topWords[0][1]) * 100}%` }}
                          />
                        </div>
                        <Badge variant="secondary" className="text-xs">{count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {/* Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">المعاينة</h3>
                {words.length > 0 && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={downloadPNG} className="bg-teal-600 hover:bg-teal-700">
                      <Download className="h-4 w-4 ml-1" /> PNG
                    </Button>
                  </div>
                )}
              </div>
              {words.length > 0 ? (
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="relative w-full" style={{ aspectRatio: '800/500' }}>
                    <canvas ref={canvasRef} className="w-full h-full" />
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg bg-muted/30 flex items-center justify-center" style={{ aspectRatio: '800/500' }}>
                  <div className="text-center">
                    <Cloud className="h-16 w-16 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">أدخل نصاً وانقر &quot;إنشاء&quot; لعرض سحابة الكلمات</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <PremiumGate feature="أشكال مخصصة وتصدير SVG">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">مزايا النسخة المميزة</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• أشكال مخصصة (قلب، نجمة، دائرة...)</li>
                  <li>• تصدير بصيغة SVG عالي الجودة</li>
                  <li>• خلفيات مخصصة</li>
                  <li>• عدد كلمات غير محدود</li>
                </ul>
              </CardContent>
            </Card>
          </PremiumGate>
        </div>
      </div>

      <div className="mt-6">
        <AdBanner slot="word-cloud-bottom" format="horizontal" />
      </div>
    </div>
  );
}
