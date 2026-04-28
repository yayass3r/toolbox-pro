'use client';

import { useState } from 'react';
import {
  Search,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

interface SeoResult {
  url: string;
  score: number;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imageCount: number;
  imagesWithoutAlt: number;
  linkCount: number;
  externalLinks: number;
  hasFavicon: boolean;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasRobots: boolean;
  hasSitemap: boolean;
  https: boolean;
  loadTime: number;
  suggestions: Array<{ type: 'good' | 'warning' | 'error'; text: string }>;
}

export function SeoAnalyzer() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SeoResult | null>(null);

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال رابط', variant: 'destructive' });
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Use our API proxy to fetch the page
      const response = await fetch(`/api/seo-analyze?url=${encodeURIComponent(normalizedUrl)}`);
      if (!response.ok) {
        throw new Error('فشل في تحليل الصفحة');
      }
      const data = await response.json();
      setResult(data);
    } catch {
      // Fallback: generate analysis from URL patterns
      const isHttps = normalizedUrl.startsWith('https://');
      const domain = normalizedUrl.replace(/https?:\/\//, '').split('/')[0];
      const suggestions: Array<{ type: 'good' | 'warning' | 'error'; text: string }> = [];

      if (isHttps) suggestions.push({ type: 'good', text: 'الموقع يستخدم HTTPS - آمن' });
      else suggestions.push({ type: 'error', text: 'الموقع لا يستخدم HTTPS - غير آمن' });

      suggestions.push({ type: 'warning', text: 'تعذر جلب بيانات الصفحة بالكامل. قد يكون الموقع يمنع الوصول.' });
      suggestions.push({ type: 'warning', text: 'تأكد من أن الموقع يسمح بالوصول عبر CORS أو استخدم أداة فحص SEO متقدمة.' });

      setResult({
        url: normalizedUrl,
        score: isHttps ? 40 : 20,
        title: domain,
        titleLength: domain.length,
        description: '',
        descriptionLength: 0,
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        imageCount: 0,
        imagesWithoutAlt: 0,
        linkCount: 0,
        externalLinks: 0,
        hasFavicon: false,
        hasViewport: false,
        hasCanonical: false,
        hasOpenGraph: false,
        hasTwitterCard: false,
        hasRobots: false,
        hasSitemap: false,
        https: isHttps,
        loadTime: 0,
        suggestions,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'متوسط';
    return 'ضعيف';
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="محلل SEO"
        description="حلّل موقعك واحصل على تقييم SEO مع اقتراحات التحسين"
        icon={<Search className="h-5 w-5" />}
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <Label>رابط الموقع</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  dir="ltr"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
                />
                <Button
                  onClick={analyzeUrl}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 ml-1" />}
                  تحليل
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Score Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">من 100</p>
                  <Badge variant={result.score >= 60 ? 'default' : 'destructive'} className="mt-2">
                    {getScoreLabel(result.score)}
                  </Badge>
                </div>
                <div className="flex-1 w-full">
                  <Progress value={result.score} className="h-3 mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">HTTPS</p>
                      {result.https ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-red-500" />
                      )}
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Favicon</p>
                      {result.hasFavicon ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-red-500" />
                      )}
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Viewport</p>
                      {result.hasViewport ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-red-500" />
                      )}
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Open Graph</p>
                      {result.hasOpenGraph ? (
                        <CheckCircle className="h-5 w-5 mx-auto text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 mx-auto text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">معلومات Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">العنوان ({result.titleLength} حرف)</p>
                  <p className="text-sm font-medium bg-muted/50 p-2 rounded">{result.title || 'غير موجود'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">الوصف ({result.descriptionLength} حرف)</p>
                  <p className="text-sm bg-muted/50 p-2 rounded">{result.description || 'غير موجود'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">إحصائيات الصفحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-lg font-bold">{result.h1Count}</p>
                    <p className="text-xs text-muted-foreground">H1</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-lg font-bold">{result.h2Count}</p>
                    <p className="text-xs text-muted-foreground">H2</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-lg font-bold">{result.imageCount}</p>
                    <p className="text-xs text-muted-foreground">صور</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-lg font-bold">{result.imagesWithoutAlt}</p>
                    <p className="text-xs text-muted-foreground">صور بدون alt</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-lg font-bold">{result.linkCount}</p>
                    <p className="text-xs text-muted-foreground">روابط</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-center">
                    <p className="text-lg font-bold">{result.externalLinks}</p>
                    <p className="text-xs text-muted-foreground">روابط خارجية</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">الاقتراحات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/30"
                  >
                    {s.type === 'good' && <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />}
                    {s.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />}
                    {s.type === 'error' && <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                    <span className="text-sm">{s.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Report (Premium) */}
          <PremiumGate feature="تقرير SEO مفصّل مع اقتراحات متقدمة">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">التقرير المفصّل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Canonical URL</span>
                  <span className="text-sm">{result.hasCanonical ? 'موجود ✓' : 'غير موجود ✗'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Twitter Card</span>
                  <span className="text-sm">{result.hasTwitterCard ? 'موجود ✓' : 'غير موجود ✗'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Robots.txt</span>
                  <span className="text-sm">{result.hasRobots ? 'موجود ✓' : 'غير موجود ✗'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Sitemap.xml</span>
                  <span className="text-sm">{result.hasSitemap ? 'موجود ✓' : 'غير موجود ✗'}</span>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">أدوات SEO موصى بها:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="cursor-pointer">Ahrefs</Badge>
                    <Badge variant="outline" className="cursor-pointer">SEMrush</Badge>
                    <Badge variant="outline" className="cursor-pointer">Google Search Console</Badge>
                    <Badge variant="outline" className="cursor-pointer">Screaming Frog</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PremiumGate>
        </div>
      )}

      <div className="mt-6">
        <AdBanner slot="seo-analyzer-bottom" format="horizontal" />
      </div>
    </div>
  );
}
