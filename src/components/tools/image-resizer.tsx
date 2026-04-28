'use client';

import { useState, useRef, useCallback } from 'react';
import { ImageIcon, Download, Upload, Lock, Unlock, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

const presetSizes = [
  { name: 'Instagram منشور', width: 1080, height: 1080, platform: 'Instagram' },
  { name: 'Instagram قصة', width: 1080, height: 1920, platform: 'Instagram' },
  { name: 'Twitter منشور', width: 1200, height: 675, platform: 'Twitter' },
  { name: 'Facebook منشور', width: 1200, height: 630, platform: 'Facebook' },
  { name: 'LinkedIn منشور', width: 1200, height: 627, platform: 'LinkedIn' },
  { name: 'LinkedIn غلاف', width: 1584, height: 396, platform: 'LinkedIn' },
  { name: 'YouTube صورة مصغرة', width: 1280, height: 720, platform: 'YouTube' },
  { name: 'YouTube غلاف', width: 2560, height: 1440, platform: 'YouTube' },
];

export function ImageResizer() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [previewUrl, setPreviewUrl] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [fileName, setFileName] = useState('');

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setPreviewUrl(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.createElement('input');
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      Object.defineProperty(input, 'files', { value: dataTransfer.files });
      handleImageUpload({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [handleImageUpload]);

  const applyPreset = (preset: typeof presetSizes[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspect(false);
    resizeImage(preset.width, preset.height);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect && originalDimensions.width > 0) {
      const newHeight = Math.round((newWidth / originalDimensions.width) * originalDimensions.height);
      setHeight(newHeight);
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect && originalDimensions.height > 0) {
      const newWidth = Math.round((newHeight / originalDimensions.height) * originalDimensions.width);
      setWidth(newWidth);
    }
  };

  const resizeImage = (w?: number, h?: number) => {
    if (!originalImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const targetW = w || width;
    const targetH = h || height;
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, targetW, targetH);
    ctx.drawImage(originalImage, 0, 0, targetW, targetH);
  };

  const downloadResized = () => {
    if (!originalImage) return;
    resizeImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mimeType = `image/${format}`;
    const dataUrl = canvas.toDataURL(mimeType, quality / 100);
    const link = document.createElement('a');
    link.download = `${fileName}_resized.${format}`;
    link.href = dataUrl;
    link.click();

    toast({ title: 'تم التحميل', description: `تم تحميل الصورة بحجم ${width}×${height}` });
  };

  const resetToOriginal = () => {
    if (!originalImage) return;
    setWidth(originalDimensions.width);
    setHeight(originalDimensions.height);
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مغير حجم الصور"
        description="غيّر حجم الصور مع أحجام مسبقة لمنصات التواصل الاجتماعي"
        icon={<ImageIcon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
                    <p className="text-sm text-muted-foreground">
                      {originalDimensions.width} × {originalDimensions.height} بكسل
                    </p>
                    <Button size="sm" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                      تغيير الصورة
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="font-medium mb-1">اسحب الصورة هنا أو اضغط للاختيار</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, WebP</p>
                  </>
                )}
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </CardContent>
          </Card>

          {/* Resize Controls */}
          {originalImage && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">أبعاد الصورة</h3>
                  <Button size="sm" variant="ghost" onClick={resetToOriginal}>
                    <RotateCcw className="h-3 w-3 ml-1" /> إعادة تعيين
                  </Button>
                </div>

                <div className="flex items-end gap-3">
                  <div className="space-y-1 flex-1">
                    <Label>العرض (بكسل)</Label>
                    <Input type="number" min={1} value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-1"
                    onClick={() => setMaintainAspect(!maintainAspect)}
                  >
                    {maintainAspect ? <Lock className="h-4 w-4 text-teal-600" /> : <Unlock className="h-4 w-4 text-gray-400" />}
                  </Button>
                  <div className="space-y-1 flex-1">
                    <Label>الارتفاع (بكسل)</Label>
                    <Input type="number" min={1} value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>الصيغة</Label>
                    <Select value={format} onValueChange={(v) => setFormat(v as 'png' | 'jpeg' | 'webp')}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>الجودة: {quality}%</Label>
                    <Input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
                  </div>
                </div>

                <Button onClick={downloadResized} className="w-full bg-teal-600 hover:bg-teal-700">
                  <Download className="h-4 w-4 ml-1" />
                  تحميل الصورة ({width}×{height})
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {/* Preset Sizes */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-sm mb-3">أحجام مسبقة لمنصات التواصل</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {presetSizes.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="w-full p-3 rounded-lg border text-right hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{preset.name}</span>
                        <Badge variant="outline" className="text-[10px] mr-2">{preset.platform}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground" dir="ltr">
                        {preset.width}×{preset.height}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <PremiumGate feature="تغيير حجم دفعات متعددة من الصور في وقت واحد">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-bold text-sm mb-2">تغيير حجم دفعي</h3>
                <p className="text-xs text-muted-foreground mb-3">غيّر حجم عدة صور دفعة واحدة بنفس الأبعاد</p>
                <Button variant="outline" size="sm" disabled>
                  قريباً - النسخة المميزة
                </Button>
              </CardContent>
            </Card>
          </PremiumGate>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6">
        <AdBanner slot="image-resizer-bottom" format="horizontal" />
      </div>
    </div>
  );
}
