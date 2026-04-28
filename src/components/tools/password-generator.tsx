'use client';

import { useState, useCallback } from 'react';
import { Key, Copy, RefreshCw, Shield, Check, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function calcStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;

  if (score <= 30) return { score, label: 'ضعيف', color: 'bg-red-500' };
  if (score <= 60) return { score, label: 'متوسط', color: 'bg-yellow-500' };
  if (score <= 80) return { score, label: 'قوي', color: 'bg-emerald-400' };
  return { score, label: 'قوي جداً', color: 'bg-emerald-600' };
}

export function PasswordGenerator() {
  const [length, setLength] = useState([16]);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    let chars = '';
    if (useLower) chars += LOWERCASE;
    if (useUpper) chars += UPPERCASE;
    if (useNumbers) chars += NUMBERS;
    if (useSymbols) chars += SYMBOLS;

    if (!chars) {
      toast({ title: 'خطأ', description: 'اختر نوع حرف واحد على الأقل', variant: 'destructive' });
      return;
    }

    const array = new Uint32Array(length[0]);
    crypto.getRandomValues(array);
    const result = Array.from(array, (n) => chars[n % chars.length]).join('');
    setPassword(result);
    setCopied(false);
  }, [useLower, useUpper, useNumbers, useSymbols, length, toast]);

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ كلمة المرور إلى الحافظة' });
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password ? calcStrength(password) : { score: 0, label: '', color: '' };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مولّد كلمات المرور"
        description="أنشئ كلمات مرور قوية وآمنة مع خيارات تخصيص متقدمة ومؤشر قوة الكلمة"
        icon={<Key className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Password Display */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>كلمة المرور المولّدة</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all direction-ltr" dir="ltr">
                  {password || 'اضغط "توليد" لإنشاء كلمة مرور'}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyPassword}
                  disabled={!password}
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>قوة كلمة المرور</span>
                  <span className={`font-semibold ${
                    strength.score > 80 ? 'text-emerald-600' :
                    strength.score > 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {strength.label}
                  </span>
                </div>
                <Progress value={strength.score} className="h-2" />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={generatePassword} className="flex-1 bg-primary hover:bg-primary/90">
                <RefreshCw className="h-4 w-4 ml-1" />
                توليد
              </Button>
            </div>

            {/* Strength info */}
            {password && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Shield className="h-3 w-3" />
                  8+ أحرف
                </div>
                <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Shield className="h-3 w-3" />
                  أحرف كبيرة
                </div>
                <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Shield className="h-3 w-3" />
                  أرقام
                </div>
                <div className={`flex items-center gap-1 ${/[^a-zA-Z0-9]/.test(password) ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Shield className="h-3 w-3" />
                  رموز خاصة
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>طول كلمة المرور: {length[0]}</Label>
              <Slider
                value={length}
                onValueChange={setLength}
                min={4}
                max={128}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>أحرف صغيرة (a-z)</Label>
                <Switch checked={useLower} onCheckedChange={setUseLower} />
              </div>
              <div className="flex items-center justify-between">
                <Label>أحرف كبيرة (A-Z)</Label>
                <Switch checked={useUpper} onCheckedChange={setUseUpper} />
              </div>
              <div className="flex items-center justify-between">
                <Label>أرقام (0-9)</Label>
                <Switch checked={useNumbers} onCheckedChange={setUseNumbers} />
              </div>
              <div className="flex items-center justify-between">
                <Label>رموز خاصة (!@#$...)</Label>
                <Switch checked={useSymbols} onCheckedChange={setUseSymbols} />
              </div>
            </div>

            <PremiumGate feature="خزنة كلمات المرور - حفظ وإدارة كلمات المرور بأمان">
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  خزنة كلمات المرور
                </div>
                <p className="text-xs text-muted-foreground">
                  احفظ وأدِر كلمات مرورك بأمان مع التشفير
                </p>
              </div>
            </PremiumGate>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AdBanner slot="password-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
