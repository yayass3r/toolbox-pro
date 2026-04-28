'use client';

import { useState } from 'react';
import { Binary, Copy, Check, Upload, ArrowDownUp, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [imageInput, setImageInput] = useState<string | null>(null);
  const [imageOutput, setImageOutput] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTextProcess = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        toast({ title: 'تم التشفير', description: 'تم تشفير النص بنجاح' });
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        toast({ title: 'تم فك التشفير', description: 'تم فك تشفير النص بنجاح' });
      }
    } catch {
      toast({
        title: 'خطأ',
        description: mode === 'encode' ? 'فشل في تشفير النص' : 'نص Base64 غير صالح',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ النتيجة إلى الحافظة' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageInput(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setImageOutput(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDecodeImage = () => {
    if (!input.trim()) return;
    try {
      const dataUrl = input.startsWith('data:') ? input : `data:image/png;base64,${input}`;
      setImageOutput(dataUrl);
      toast({ title: 'تم فك التشفير', description: 'تم فك تشفير الصورة بنجاح' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في فك تشفير الصورة', variant: 'destructive' });
    }
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مشفر/فاك تشفير Base64"
        description="شفر وألغِ تشفير النصوص والصور بصيغة Base64"
        icon={<Binary className="h-5 w-5" />}
      />

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="text">نص</TabsTrigger>
          <TabsTrigger value="image">صورة</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>الإدخال ({mode === 'encode' ? 'نص عادي' : 'Base64'})</Label>
                  <Button variant="ghost" size="sm" onClick={handleSwap}>
                    <ArrowDownUp className="h-4 w-4 ml-1" />
                    تبديل
                  </Button>
                </div>
                <Textarea
                  placeholder={mode === 'encode' ? 'أدخل النص المراد تشفيره...' : 'أدخل نص Base64 المراد فك تشفيره...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono text-sm min-h-[200px] direction-ltr"
                  dir="ltr"
                />
                <Button onClick={handleTextProcess} className="w-full bg-primary hover:bg-primary/90">
                  {mode === 'encode' ? 'تشفير' : 'فك التشفير'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>الناتج ({mode === 'encode' ? 'Base64' : 'نص عادي'})</Label>
                  <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={output}
                  readOnly
                  className="font-mono text-sm min-h-[200px] direction-ltr break-all"
                  dir="ltr"
                  placeholder="النتيجة ستظهر هنا..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="image" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Label>رفع صورة لتحويلها إلى Base64</Label>
                <Button variant="outline" asChild className="w-full h-32">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">اضغط لرفع صورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
                {imageInput && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">معاينة الصورة:</p>
                    <img src={imageInput} alt="Preview" className="max-h-40 rounded-lg mx-auto" />
                    <Textarea
                      value={imageOutput || ''}
                      readOnly
                      className="font-mono text-xs min-h-[100px] direction-ltr"
                      dir="ltr"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(imageOutput || '');
                        toast({ title: 'تم النسخ', description: 'تم نسخ Base64 للصورة' });
                      }}
                    >
                      <Copy className="h-4 w-4 ml-1" />
                      نسخ Base64
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Label>فك تشفير Base64 إلى صورة</Label>
                <Textarea
                  placeholder="الصق نص Base64 هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono text-xs min-h-[200px] direction-ltr"
                  dir="ltr"
                />
                <Button onClick={handleDecodeImage} className="w-full">
                  فك التشفير
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <PremiumGate feature="معالجة دفعية - تشفير/فك تشفير عدة ملفات دفعة واحدة">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">معالجة دفعية</p>
                  <p className="text-xs text-muted-foreground">شفر وألغِ تشفير عدة ملفات دفعة واحدة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PremiumGate>
      </div>

      <div className="mt-6">
        <AdBanner slot="base64-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
