'use client';

import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Palette, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

export function QrGenerator() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState([256]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const generateQR = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: size[0],
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrDataUrl(url);
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء رمز QR',
        variant: 'destructive',
      });
    }
  }, [text, size, fgColor, bgColor, toast]);

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim()) {
      QRCode.toDataURL(value, {
        width: size[0],
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      })
        .then(setQrDataUrl)
        .catch(() => {});
    } else {
      setQrDataUrl('');
    }
  };

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrDataUrl) return;
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrDataUrl;
      link.click();
    } else {
      QRCode.toString(text, {
        type: 'svg',
        width: size[0],
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      }).then((svg) => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'qrcode.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
    toast({ title: 'تم التحميل', description: `تم تحميل رمز QR بصيغة ${format.toUpperCase()}` });
  };

  const copyToClipboard = () => {
    if (!qrDataUrl) return;
    navigator.clipboard.writeText(qrDataUrl);
    toast({ title: 'تم النسخ', description: 'تم نسخ رمز QR إلى الحافظة' });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مولّد رموز QR"
        description="أنشئ رموز QR مخصصة للروابط والنصوص مع إمكانية تخصيص الألوان والحجم والتحميل بصيغ متعددة"
        icon={<QrCode className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="qr-text">النص أو الرابط</Label>
              <Input
                id="qr-text"
                placeholder="أدخل النص أو الرابط هنا..."
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                className="direction-ltr text-left"
                dir="ltr"
              />
            </div>

            <Tabs defaultValue="customize" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="customize" className="flex-1">
                  <Palette className="h-4 w-4 ml-1" />
                  تخصيص
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex-1">
                  <Upload className="h-4 w-4 ml-1" />
                  متقدم
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customize" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>لون الأمامية</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => {
                          setFgColor(e.target.value);
                          if (text.trim()) generateQR();
                        }}
                        className="h-10 w-10 rounded cursor-pointer"
                      />
                      <Input
                        value={fgColor}
                        onChange={(e) => {
                          setFgColor(e.target.value);
                          if (text.trim()) generateQR();
                        }}
                        dir="ltr"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>لون الخلفية</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => {
                          setBgColor(e.target.value);
                          if (text.trim()) generateQR();
                        }}
                        className="h-10 w-10 rounded cursor-pointer"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => {
                          setBgColor(e.target.value);
                          if (text.trim()) generateQR();
                        }}
                        dir="ltr"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الحجم: {size[0]}×{size[0]} بكسل</Label>
                  <Slider
                    value={size}
                    onValueChange={(v) => {
                      setSize(v);
                      if (text.trim()) generateQR();
                    }}
                    min={128}
                    max={512}
                    step={16}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <PremiumGate feature="إضافة شعار في منتصف رمز QR">
                  <div className="space-y-3">
                    <Label>شعار مخصص (في المنتصف)</Label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" asChild>
                        <label className="cursor-pointer">
                          <Upload className="h-4 w-4 ml-1" />
                          رفع شعار
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </Button>
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                    </div>
                  </div>
                </PremiumGate>

                <PremiumGate feature="إنشاء رموز QR متعددة دفعة واحدة">
                  <div className="space-y-2">
                    <Label>إنشاء دفعي</Label>
                    <p className="text-sm text-muted-foreground">
                      أنشئ عدة رموز QR من قائمة روابط
                    </p>
                  </div>
                </PremiumGate>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              {qrDataUrl ? (
                <>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="max-w-[256px] max-h-[256px]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => downloadQR('png')} size="sm">
                      <Download className="h-4 w-4 ml-1" />
                      PNG
                    </Button>
                    <Button onClick={() => downloadQR('svg')} variant="outline" size="sm">
                      <Download className="h-4 w-4 ml-1" />
                      SVG
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 ml-1" />
                      نسخ
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <QrCode className="h-16 w-16 mb-3 opacity-30" />
                  <p className="text-sm">أدخل نصاً أو رابطاً لإنشاء رمز QR</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AdBanner slot="qr-tool-bottom" format="horizontal" />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
