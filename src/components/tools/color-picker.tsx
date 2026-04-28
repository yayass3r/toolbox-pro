'use client';

import { useState, useMemo } from 'react';
import { Pipette, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const palette: string[] = [];
  for (let i = 0; i < 10; i++) {
    const lightness = 95 - i * 9;
    palette.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  return palette;
}

function generateComplementary(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return [
    hex,
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
  ];
}

export function ColorPicker() {
  const [hex, setHex] = useState('#0d9488');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const { toast } = useToast();

  const rgb = useMemo(() => hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }, [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const palette = useMemo(() => generatePalette(hex), [hex]);
  const complementary = useMemo(() => generateComplementary(hex), [hex]);

  const copyValue = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast({ title: 'تم النسخ', description: `تم نسخ ${field}` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const saveColor = () => {
    if (!savedColors.includes(hex)) {
      setSavedColors([...savedColors, hex]);
      toast({ title: 'تم الحفظ', description: 'تم حفظ اللون في المفضلة' });
    }
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="منتقي الألوان"
        description="اختر الألوان وحوّل بين صيغ HEX و RGB و HSL مع مولّد لوحات ألوان"
        icon={<Pipette className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Picker */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="w-32 h-32 rounded-lg cursor-pointer border-2"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label>HEX</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={hex}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setHex(val);
                      }}
                      dir="ltr"
                      className="font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyValue(hex, 'HEX')}
                    >
                      {copiedField === 'HEX' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>RGB</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                      readOnly
                      dir="ltr"
                      className="font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                    >
                      {copiedField === 'RGB' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>HSL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                      readOnly
                      dir="ltr"
                      className="font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                    >
                      {copiedField === 'HSL' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={saveColor} variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-1" />
              حفظ اللون
            </Button>

            {/* Saved Colors */}
            {savedColors.length > 0 && (
              <div className="space-y-2">
                <Label>الألوان المحفوظة</Label>
                <div className="flex flex-wrap gap-2">
                  {savedColors.map((color, i) => (
                    <div key={i} className="relative group">
                      <button
                        className="w-10 h-10 rounded-lg border-2 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setHex(color)}
                        title={color}
                      />
                      <button
                        className="absolute -top-1 -left-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSavedColors(savedColors.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-2 w-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Palettes */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>لوحة التدرجات</Label>
              <div className="space-y-1">
                {palette.map((color, i) => (
                  <button
                    key={i}
                    className="w-full h-8 rounded cursor-pointer hover:scale-x-105 transition-transform border"
                    style={{ backgroundColor: color }}
                    onClick={() => setHex(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>ألوان مكملة</Label>
              <div className="flex gap-1">
                {complementary.map((color, i) => (
                  <button
                    key={i}
                    className="flex-1 h-10 rounded cursor-pointer hover:scale-105 transition-transform border"
                    style={{ backgroundColor: color }}
                    onClick={() => setHex(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <PremiumGate feature="فاحص إمكانية الوصول - تحقق من تباين الألوان">
              <div className="space-y-2 p-3 border rounded-lg">
                <p className="text-sm font-medium">فاحص التباين</p>
                <p className="text-xs text-muted-foreground">تحقق من توافق الألوان مع معايير WCAG</p>
              </div>
            </PremiumGate>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AdBanner slot="color-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
