'use client';

import { useState, useMemo } from 'react';
import {
  Paintbrush,
  Copy,
  Square,
  Palette,
  Circle,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

export function CssGenerator() {
  const { toast } = useToast();

  // Box Shadow state
  const [shadowX, setShadowX] = useState([5]);
  const [shadowY, setShadowY] = useState([5]);
  const [shadowBlur, setShadowBlur] = useState([15]);
  const [shadowSpread, setShadowSpread] = useState([0]);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState([20]);
  const [shadowInset, setShadowInset] = useState(false);

  // Gradient state
  const [gradColor1, setGradColor1] = useState('#0d9488');
  const [gradColor2, setGradColor2] = useState('#059669');
  const [gradAngle, setGradAngle] = useState([135]);
  const [gradType, setGradType] = useState<'linear' | 'radial'>('linear');

  // Border Radius state
  const [radiusTL, setRadiusTL] = useState([16]);
  const [radiusTR, setRadiusTR] = useState([16]);
  const [radiusBL, setRadiusBL] = useState([16]);
  const [radiusBR, setRadiusBR] = useState([16]);
  const [radiusLinked, setRadiusLinked] = useState(true);

  // Animation state
  const [animType, setAnimType] = useState('pulse');
  const [animDuration, setAnimDuration] = useState([2]);
  const [animDelay, setAnimDelay] = useState([0]);
  const [animIteration, setAnimIteration] = useState('infinite');

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const boxShadowCSS = useMemo(() => {
    const color = hexToRgba(shadowColor, shadowOpacity[0]);
    const inset = shadowInset ? 'inset ' : '';
    return `box-shadow: ${inset}${shadowX[0]}px ${shadowY[0]}px ${shadowBlur[0]}px ${shadowSpread[0]}px ${color};`;
  }, [shadowX, shadowY, shadowBlur, shadowSpread, shadowColor, shadowOpacity, shadowInset]);

  const gradientCSS = useMemo(() => {
    if (gradType === 'linear') {
      return `background: linear-gradient(${gradAngle[0]}deg, ${gradColor1}, ${gradColor2});`;
    }
    return `background: radial-gradient(circle, ${gradColor1}, ${gradColor2});`;
  }, [gradColor1, gradColor2, gradAngle, gradType]);

  const borderRadiusCSS = useMemo(() => {
    if (radiusLinked || (radiusTL[0] === radiusTR[0] && radiusTL[0] === radiusBL[0] && radiusTL[0] === radiusBR[0])) {
      return `border-radius: ${radiusTL[0]}px;`;
    }
    return `border-radius: ${radiusTL[0]}px ${radiusTR[0]}px ${radiusBR[0]}px ${radiusBL[0]}px;`;
  }, [radiusTL, radiusTR, radiusBL, radiusBR, radiusLinked]);

  const animationCSS = useMemo(() => {
    let keyframes = '';
    switch (animType) {
      case 'pulse':
        keyframes = `@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}`;
        break;
      case 'bounce':
        keyframes = `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`;
        break;
      case 'rotate':
        keyframes = `@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
        break;
      case 'shake':
        keyframes = `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}`;
        break;
      case 'fadeIn':
        keyframes = `@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
        break;
      case 'glow':
        keyframes = `@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(13, 148, 136, 0.5); }
  50% { box-shadow: 0 0 20px rgba(13, 148, 136, 0.8); }
}`;
        break;
    }
    const anim = `animation: ${animType} ${animDuration[0]}s ${animDelay[0]}s ${animIteration === 'infinite' ? 'infinite' : animIteration + ' times'} ease-in-out;`;
    return `${keyframes}\n\n.${animType}-element {\n  ${anim}\n}`;
  }, [animType, animDuration, animDelay, animIteration]);

  const copyCSS = (css: string) => {
    navigator.clipboard.writeText(css);
    toast({ title: 'تم النسخ', description: 'تم نسخ كود CSS إلى الحافظة' });
  };

  const handleRadiusChange = (value: number[]) => {
    if (radiusLinked) {
      setRadiusTL(value);
      setRadiusTR(value);
      setRadiusBL(value);
      setRadiusBR(value);
    } else {
      setRadiusTL(value);
    }
  };

  const getAnimPreviewStyle = (): React.CSSProperties => {
    const duration = animDuration[0];
    const delay = animDelay[0];
    const iter = animIteration === 'infinite' ? 'infinite' : animIteration;
    const base = { animationDuration: `${duration}s`, animationDelay: `${delay}s`, animationIterationCount: iter, animationTimingFunction: 'ease-in-out', animationFillMode: 'both' };

    switch (animType) {
      case 'pulse':
        return { ...base, animationName: 'cssGenPulse' };
      case 'bounce':
        return { ...base, animationName: 'cssGenBounce' };
      case 'rotate':
        return { ...base, animationName: 'cssGenRotate' };
      case 'shake':
        return { ...base, animationName: 'cssGenShake' };
      case 'fadeIn':
        return { ...base, animationName: 'cssGenFadeIn' };
      case 'glow':
        return { ...base, animationName: 'cssGenGlow' };
      default:
        return base;
    }
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مولّد CSS"
        description="أنشئ تأثيرات CSS بصرية مذهلة بسهولة"
        icon={<Paintbrush className="h-5 w-5" />}
      />

      {/* Animation keyframes */}
      <style>{`
        @keyframes cssGenPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes cssGenBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes cssGenRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cssGenShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes cssGenFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cssGenGlow { 0%, 100% { box-shadow: 0 0 5px rgba(13, 148, 136, 0.5); } 50% { box-shadow: 0 0 20px rgba(13, 148, 136, 0.8); } }
      `}</style>

      <Tabs defaultValue="box-shadow" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="box-shadow" className="flex-1 min-w-[100px]">
            <Square className="h-4 w-4 ml-1" />
            ظل الصندوق
          </TabsTrigger>
          <TabsTrigger value="gradient" className="flex-1 min-w-[100px]">
            <Palette className="h-4 w-4 ml-1" />
            تدرج لوني
          </TabsTrigger>
          <TabsTrigger value="border-radius" className="flex-1 min-w-[100px]">
            <Circle className="h-4 w-4 ml-1" />
            حواف دائرية
          </TabsTrigger>
          <TabsTrigger value="animation" className="flex-1 min-w-[100px]">
            <Sparkles className="h-4 w-4 ml-1" />
            حركات
          </TabsTrigger>
        </TabsList>

        {/* Box Shadow */}
        <TabsContent value="box-shadow" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="flex justify-between">
                      <span>الإزاحة الأفقية (X)</span>
                      <span className="text-muted-foreground">{shadowX[0]}px</span>
                    </Label>
                    <Slider value={shadowX} onValueChange={setShadowX} min={-50} max={50} />
                  </div>
                  <div>
                    <Label className="flex justify-between">
                      <span>الإزاحة العمودية (Y)</span>
                      <span className="text-muted-foreground">{shadowY[0]}px</span>
                    </Label>
                    <Slider value={shadowY} onValueChange={setShadowY} min={-50} max={50} />
                  </div>
                  <div>
                    <Label className="flex justify-between">
                      <span>الضبابية</span>
                      <span className="text-muted-foreground">{shadowBlur[0]}px</span>
                    </Label>
                    <Slider value={shadowBlur} onValueChange={setShadowBlur} min={0} max={100} />
                  </div>
                  <div>
                    <Label className="flex justify-between">
                      <span>الانتشار</span>
                      <span className="text-muted-foreground">{shadowSpread[0]}px</span>
                    </Label>
                    <Slider value={shadowSpread} onValueChange={setShadowSpread} min={-50} max={50} />
                  </div>
                  <div>
                    <Label className="flex justify-between">
                      <span>الشفافية</span>
                      <span className="text-muted-foreground">{shadowOpacity[0]}%</span>
                    </Label>
                    <Slider value={shadowOpacity} onValueChange={setShadowOpacity} min={0} max={100} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label>لون الظل</Label>
                    <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                    <Input value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} dir="ltr" className="w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="inset" checked={shadowInset} onChange={(e) => setShadowInset(e.target.checked)} className="rounded" />
                    <Label htmlFor="inset">ظل داخلي (Inset)</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-40 h-40 bg-emerald-500 rounded-lg"
                    style={{
                      boxShadow: `${shadowInset ? 'inset ' : ''}${shadowX[0]}px ${shadowY[0]}px ${shadowBlur[0]}px ${shadowSpread[0]}px ${hexToRgba(shadowColor, shadowOpacity[0])}`,
                    }}
                  />
                  <div className="w-full bg-muted/50 p-3 rounded-lg">
                    <code className="text-xs block text-center" dir="ltr">{boxShadowCSS}</code>
                  </div>
                  <Button onClick={() => copyCSS(boxShadowCSS)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Copy className="h-4 w-4 ml-1" />
                    نسخ الكود
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gradient */}
        <TabsContent value="gradient" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={gradType === 'linear' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGradType('linear')}
                  >
                    خطي
                  </Button>
                  <Button
                    variant={gradType === 'radial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGradType('radial')}
                  >
                    دائري
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Label>اللون الأول</Label>
                  <input type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                  <Input value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} dir="ltr" className="w-24" />
                </div>

                <div className="flex items-center gap-3">
                  <Label>اللون الثاني</Label>
                  <input type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                  <Input value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} dir="ltr" className="w-24" />
                </div>

                {gradType === 'linear' && (
                  <div>
                    <Label className="flex justify-between">
                      <span>الزاوية</span>
                      <span className="text-muted-foreground">{gradAngle[0]}°</span>
                    </Label>
                    <Slider value={gradAngle} onValueChange={setGradAngle} min={0} max={360} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-full h-40 rounded-lg"
                    style={{
                      background: gradType === 'linear'
                        ? `linear-gradient(${gradAngle[0]}deg, ${gradColor1}, ${gradColor2})`
                        : `radial-gradient(circle, ${gradColor1}, ${gradColor2})`,
                    }}
                  />
                  <div className="w-full bg-muted/50 p-3 rounded-lg">
                    <code className="text-xs block text-center" dir="ltr">{gradientCSS}</code>
                  </div>
                  <Button onClick={() => copyCSS(gradientCSS)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Copy className="h-4 w-4 ml-1" />
                    نسخ الكود
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Border Radius */}
        <TabsContent value="border-radius" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="link-radii"
                    checked={radiusLinked}
                    onChange={(e) => setRadiusLinked(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="link-radii">ربط جميع الحواف</Label>
                </div>

                <div>
                  <Label className="flex justify-between">
                    <span>أعلى يمين</span>
                    <span className="text-muted-foreground">{radiusTL[0]}px</span>
                  </Label>
                  <Slider value={radiusTL} onValueChange={handleRadiusChange} min={0} max={100} />
                </div>

                {!radiusLinked && (
                  <>
                    <div>
                      <Label className="flex justify-between">
                        <span>أعلى يسار</span>
                        <span className="text-muted-foreground">{radiusTR[0]}px</span>
                      </Label>
                      <Slider value={radiusTR} onValueChange={setRadiusTR} min={0} max={100} />
                    </div>
                    <div>
                      <Label className="flex justify-between">
                        <span>أسفل يمين</span>
                        <span className="text-muted-foreground">{radiusBL[0]}px</span>
                      </Label>
                      <Slider value={radiusBL} onValueChange={setRadiusBL} min={0} max={100} />
                    </div>
                    <div>
                      <Label className="flex justify-between">
                        <span>أسفل يسار</span>
                        <span className="text-muted-foreground">{radiusBR[0]}px</span>
                      </Label>
                      <Slider value={radiusBR} onValueChange={setRadiusBR} min={0} max={100} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-40 h-40 bg-emerald-500"
                    style={{
                      borderRadius: radiusLinked
                        ? `${radiusTL[0]}px`
                        : `${radiusTL[0]}px ${radiusTR[0]}px ${radiusBR[0]}px ${radiusBL[0]}px`,
                    }}
                  />
                  <div className="w-full bg-muted/50 p-3 rounded-lg">
                    <code className="text-xs block text-center" dir="ltr">{borderRadiusCSS}</code>
                  </div>
                  <Button onClick={() => copyCSS(borderRadiusCSS)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Copy className="h-4 w-4 ml-1" />
                    نسخ الكود
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Animation */}
        <TabsContent value="animation" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>نوع الحركة</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pulse', label: 'نبض' },
                      { id: 'bounce', label: 'ارتداد' },
                      { id: 'rotate', label: 'دوران' },
                      { id: 'shake', label: 'اهتزاز' },
                      { id: 'fadeIn', label: 'ظهور' },
                      { id: 'glow', label: 'توهج' },
                    ].map((anim) => (
                      <Button
                        key={anim.id}
                        variant={animType === anim.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAnimType(anim.id)}
                      >
                        {anim.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex justify-between">
                    <span>المدة</span>
                    <span className="text-muted-foreground">{animDuration[0]}s</span>
                  </Label>
                  <Slider value={animDuration} onValueChange={setAnimDuration} min={0.1} max={5} step={0.1} />
                </div>

                <div>
                  <Label className="flex justify-between">
                    <span>التأخير</span>
                    <span className="text-muted-foreground">{animDelay[0]}s</span>
                  </Label>
                  <Slider value={animDelay} onValueChange={setAnimDelay} min={0} max={5} step={0.1} />
                </div>

                <div className="space-y-2">
                  <Label>التكرار</Label>
                  <div className="flex gap-2">
                    {['infinite', '1', '2', '3'].map((val) => (
                      <Button
                        key={val}
                        variant={animIteration === val ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAnimIteration(val)}
                      >
                        {val === 'infinite' ? 'لانهائي' : val + 'x'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-24 h-24 bg-emerald-500 rounded-lg flex items-center justify-center"
                    style={getAnimPreviewStyle()}
                  >
                    <RotateCw className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-full bg-muted/50 p-3 rounded-lg max-h-48 overflow-y-auto">
                    <pre className="text-xs" dir="ltr">{animationCSS}</pre>
                  </div>
                  <Button onClick={() => copyCSS(animationCSS)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Copy className="h-4 w-4 ml-1" />
                    نسخ الكود
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Presets (Premium) */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <PremiumGate feature="حفظ الإعدادات المسبقة">
            <div className="text-center py-4">
              <Badge variant="outline">
                <Sparkles className="h-3 w-3 ml-1" />
                احفظ إعداداتك المسبقة في النسخة المميزة
              </Badge>
            </div>
          </PremiumGate>
        </CardContent>
      </Card>

      <div className="mt-6">
        <AdBanner slot="css-generator-bottom" format="horizontal" />
      </div>
    </div>
  );
}
