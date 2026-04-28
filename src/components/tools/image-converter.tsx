'use client';

import { useState, useRef } from 'react';
import { ImageIcon, Download, Upload, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

type ImageFormat = 'png' | 'jpeg' | 'webp';

export function ImageConverter() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState([90]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new globalThis.Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setSourceImage(reader.result as string);
        setConvertedUrl(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect && originalWidth > 0) {
      setHeight(Math.round((newWidth / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect && originalHeight > 0) {
      setWidth(Math.round((newHeight / originalHeight) * originalWidth));
    }
  };

  const convertImage = () => {
    if (!sourceImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new globalThis.Image();
    img.onload = () => {
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mimeType = `image/${format}`;
      const qualityValue = format === 'png' ? undefined : quality[0] / 100;
      const url = canvas.toDataURL(mimeType, qualityValue);
      setConvertedUrl(url);
      toast({ title: 'تم التحويل', description: `تم تحويل الصورة إلى ${format.toUpperCase()}` });
    };
    img.src = sourceImage;
  };

  const downloadImage = () => {
    if (!convertedUrl) return;
    const link = document.createElement('a');
    link.download = `converted.${format}`;
    link.href = convertedUrl;
    link.click();
    toast({ title: 'تم التحميل', description: 'تم تحميل الصورة المحولة' });
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="محول الصور"
        description="حوّل الصور بين صيغ PNG و JPG و WebP مع إمكانية تغيير الحجم"
        icon={<ImageIcon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Options */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>رفع صورة</Label>
              {!sourceImage ? (
                <Button variant="outline" asChild className="w-full h-40">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">اضغط لرفع صورة</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
              ) : (
                <div className="relative">
                  <img
                    src={sourceImage}
                    alt="Source"
                    className="max-h-40 rounded-lg mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setSourceImage(null);
                      setConvertedUrl(null);
                    }}
                  >
                    تغيير الصورة
                  </Button>
                </div>
              )}
            </div>

            {sourceImage && (
              <>
                <div className="space-y-2">
                  <Label>صيغة التحويل</Label>
                  <Select value={format} onValueChange={(v) => setFormat(v as ImageFormat)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {format !== 'png' && (
                  <div className="space-y-2">
                    <Label>الجودة: {quality[0]}%</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={10}
                      max={100}
                      step={5}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label>تغيير الحجم</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">العرض</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1 border rounded text-sm"
                          dir="ltr"
                        />
                        <span className="text-xs text-muted-foreground">px</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">الارتفاع</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1 border rounded text-sm"
                          dir="ltr"
                        />
                        <span className="text-xs text-muted-foreground">px</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    الأبعاد الأصلية: {originalWidth} × {originalHeight}
                  </p>
                </div>

                <Button onClick={convertImage} className="w-full bg-primary hover:bg-primary/90">
                  تحويل الصورة
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Label>النتيجة</Label>
            {convertedUrl ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={convertedUrl}
                  alt="Converted"
                  className="max-h-[300px] rounded-lg"
                />
                <Button onClick={downloadImage}>
                  <Download className="h-4 w-4 ml-1" />
                  تحميل الصورة ({format.toUpperCase()})
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-3 opacity-30" />
                <p className="text-sm">ارفع صورة وحولها لرؤية النتيجة</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <PremiumGate feature="تحويل دفعي - تحويل عدة صور دفعة واحدة">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">تحويل دفعي</p>
                  <p className="text-xs text-muted-foreground">حوّل عدة صور دفعة واحدة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PremiumGate>
      </div>

      <div className="mt-6">
        <AdBanner slot="image-tool-bottom" format="horizontal" />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
