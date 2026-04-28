'use client';

import { useState } from 'react';
import { Braces, Copy, Minus, Plus, Check, FileDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

function formatJson(str: string, indent: number = 2): string {
  return JSON.stringify(JSON.parse(str), null, indent);
}

function minifyJson(str: string): string {
  return JSON.stringify(JSON.parse(str));
}

function validateJson(str: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(str);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

function jsonToTreeView(obj: unknown, depth: number = 0): string {
  const indent = '  '.repeat(depth);
  if (obj === null) return `${indent}null`;
  if (typeof obj === 'string') return `${indent}"${obj}"`;
  if (typeof obj === 'number' || typeof obj === 'boolean') return `${indent}${obj}`;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return `${indent}[]`;
    return obj
      .map((item) => jsonToTreeView(item, depth + 1))
      .join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return `${indent}{}`;
    return entries
      .map(([key, value]) => {
        const val = typeof value === 'object' && value !== null
          ? '\n' + jsonToTreeView(value, depth + 1)
          : ` ${jsonToTreeView(value, 0).trim()}`;
        return `${indent}"${key}":${val}`;
      })
      .join('\n');
  }

  return `${indent}${obj}`;
}

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const validation = input ? validateJson(input) : null;

  const handleFormat = () => {
    try {
      setOutput(formatJson(input, indent));
      toast({ title: 'تم التنسيق', description: 'تم تنسيق JSON بنجاح' });
    } catch (e) {
      toast({ title: 'خطأ في التنسيق', description: (e as Error).message, variant: 'destructive' });
    }
  };

  const handleMinify = () => {
    try {
      setOutput(minifyJson(input));
      toast({ title: 'تم الضغط', description: 'تم ضغط JSON بنجاح' });
    } catch (e) {
      toast({ title: 'خطأ', description: (e as Error).message, variant: 'destructive' });
    }
  };

  const handleTreeView = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToTreeView(parsed));
      toast({ title: 'عرض الشجرة', description: 'تم إنشاء عرض الشجرة بنجاح' });
    } catch (e) {
      toast({ title: 'خطأ', description: (e as Error).message, variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ النتيجة إلى الحافظة' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="منسق JSON"
        description="نسّق وضغط وتحقق من صحة بيانات JSON مع عرض شجري تفاعلي"
        icon={<Braces className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>الإدخال</Label>
              {validation && (
                <Badge variant={validation.valid ? 'default' : 'destructive'} className="text-xs">
                  {validation.valid ? '✓ صالح' : '✗ غير صالح'}
                </Badge>
              )}
            </div>
            <Textarea
              placeholder='{"name": "أحمد", "age": 30}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-sm min-h-[300px] direction-ltr"
              dir="ltr"
            />
            {validation && !validation.valid && (
              <p className="text-xs text-destructive">{validation.error}</p>
            )}
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>الناتج</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              className="font-mono text-sm min-h-[300px] direction-ltr"
              dir="ltr"
              placeholder="النتيجة ستظهر هنا..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button onClick={handleFormat} disabled={!input} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 ml-1" />
          تنسيق
        </Button>
        <Button onClick={handleMinify} variant="outline" disabled={!input}>
          <Minus className="h-4 w-4 ml-1" />
          ضغط
        </Button>
        <Button onClick={handleTreeView} variant="outline" disabled={!input}>
          🌳 عرض شجري
        </Button>
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-sm text-muted-foreground">المسافة البادئة:</span>
          {[2, 4, 8].map((v) => (
            <Button
              key={v}
              variant={indent === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIndent(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {/* Premium Features */}
      <div className="mt-6">
        <PremiumGate feature="تحويل JSON إلى CSV/Excel">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">تحويل إلى CSV/Excel</p>
                  <p className="text-xs text-muted-foreground">حوّل بيانات JSON إلى جداول بيانات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PremiumGate>
      </div>

      <div className="mt-6">
        <AdBanner slot="json-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}

function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props}>{children}</label>;
}
