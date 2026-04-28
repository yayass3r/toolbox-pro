'use client';

import { useState } from 'react';
import {
  Camera,
  Download,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

type ViewportType = 'desktop' | 'tablet' | 'mobile';

const viewports: Record<ViewportType, { width: number; height: number; label: string; icon: React.ReactNode }> = {
  desktop: { width: 1280, height: 800, label: 'كمبيوتر', icon: <Monitor className="h-4 w-4" /> },
  tablet: { width: 768, height: 1024, label: 'جهاز لوحي', icon: <Tablet className="h-4 w-4" /> },
  mobile: { width: 375, height: 812, label: 'هاتف', icon: <Smartphone className="h-4 w-4" /> },
};

export function ScreenshotTool() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const [fullPage, setFullPage] = useState(false);

  const captureScreenshot = async () => {
    if (!url.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال رابط', variant: 'destructive' });
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    setIsLoading(true);
    setScreenshotUrl(null);

    try {
      const vp = viewports[viewport];
      const response = await fetch(
        `/api/screenshot?url=${encodeURIComponent(normalizedUrl)}&width=${vp.width}&height=${vp.height}&fullPage=${fullPage}`
      );

      if (!response.ok) {
        throw new Error('فشل في التقاط اللقطة');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setScreenshotUrl(imageUrl);
      toast({ title: 'تم بنجاح', description: 'تم التقاط لقطة الشاشة' });
    } catch {
      // Fallback: use a placeholder screenshot service
      try {
        let normalizedUrl2 = url.trim();
        if (!normalizedUrl2.startsWith('http')) {
          normalizedUrl2 = 'https://' + normalizedUrl2;
        }
        const domain = new URL(normalizedUrl2).hostname;
        const placeholderUrl = `https://image.thum.io/get/width/${viewports[viewport].width}/${normalizedUrl2}`;
        setScreenshotUrl(placeholderUrl);
        toast({ title: 'تم', description: 'تم التقاط لقطة باستخدام خدمة بديلة' });
      } catch {
        toast({ title: 'خطأ', description: 'فشل في التقاط لقطة الشاشة', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadScreenshot = () => {
    if (!screenshotUrl) return;
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `screenshot-${viewport}.png`;
    link.click();
    toast({ title: 'تم التحميل', description: 'تم تحميل لقطة الشاشة' });
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="أداة لقطات الشاشة"
        description="التقط لقطات شاشة لأي موقع بسهولة"
        icon={<Camera className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>رابط الموقع</Label>
              <Input
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                dir="ltr"
                onKeyDown={(e) => e.key === 'Enter' && captureScreenshot()}
              />
            </div>

            <div className="space-y-2">
              <Label>حجم الشاشة</Label>
              <ToggleGroup
                type="single"
                value={viewport}
                onValueChange={(val) => val && setViewport(val as ViewportType)}
                className="justify-start"
              >
                {Object.entries(viewports).map(([key, vp]) => (
                  <ToggleGroupItem key={key} value={key} aria-label={vp.label}>
                    {vp.icon}
                    <span className="mr-1 text-xs">{vp.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <p className="text-xs text-muted-foreground">
                {viewports[viewport].width}×{viewports[viewport].height} بكسل
              </p>
            </div>

            <PremiumGate feature="التقاط لقطة كاملة للصفحة">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">لقطة كاملة</p>
                  <p className="text-xs text-muted-foreground">التقاط الصفحة بالكامل وليس الجزء المرئي فقط</p>
                </div>
                <Badge variant="outline">
                  <Camera className="h-3 w-3 ml-1" />
                  مميز
                </Badge>
              </div>
            </PremiumGate>

            <Button
              onClick={captureScreenshot}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-1" />
              ) : (
                <Camera className="h-4 w-4 ml-1" />
              )}
              {isLoading ? 'جاري الالتقاط...' : 'التقاط لقطة'}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {screenshotUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src={screenshotUrl}
                    alt="Screenshot"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadScreenshot} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="h-4 w-4 ml-1" />
                    تحميل PNG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (screenshotUrl) {
                        navigator.clipboard.writeText(screenshotUrl);
                        toast({ title: 'تم النسخ', description: 'تم نسخ رابط اللقطة' });
                      }
                    }}
                  >
                    نسخ الرابط
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <Camera className="h-16 w-16 mb-3 opacity-30" />
                <p className="text-sm">أدخل رابط موقع والتقط لقطة شاشة</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AdBanner slot="screenshot-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
