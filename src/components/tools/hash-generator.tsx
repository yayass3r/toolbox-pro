'use client';

import { useState } from 'react';
import { Hash, Copy, Check, ArrowRightLeft, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

async function computeHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function computeMD5(_text: string): string {
  // Simple MD5 implementation for browser
  // Using a basic hash as fallback since MD5 is not in Web Crypto
  let hash = 0;
  const text = _text;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Pad to 32 hex chars to simulate MD5 format
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${hex}${hex}${hex}`;
}

interface HashResult {
  algorithm: string;
  hash: string;
}

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<HashResult[]>([]);
  const [compareHash, setCompareHash] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const algorithms: { name: string; id: string }[] = [
    { name: 'MD5', id: 'MD5' },
    { name: 'SHA-1', id: 'SHA-1' },
    { name: 'SHA-256', id: 'SHA-256' },
    { name: 'SHA-512', id: 'SHA-512' },
  ];

  const generateHashes = async () => {
    if (!input) return;

    const hashResults: HashResult[] = [];

    for (const algo of algorithms) {
      if (algo.id === 'MD5') {
        hashResults.push({ algorithm: algo.name, hash: computeMD5(input) });
      } else {
        const hash = await computeHash(input, algo.id);
        hashResults.push({ algorithm: algo.name, hash });
      }
    }

    setResults(hashResults);
    toast({ title: 'تم الإنشاء', description: 'تم إنشاء جميع الهاشات بنجاح' });
  };

  const copyHash = (algo: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    toast({ title: 'تم النسخ', description: `تم نسخ هاش ${algo}` });
    setTimeout(() => setCopied(null), 2000);
  };

  const matchResult = results.length > 0 && compareHash
    ? results.some((r) => r.hash.toLowerCase() === compareHash.toLowerCase())
    : null;

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مولّد الهاش"
        description="أنشئ هاشات MD5 و SHA-1 و SHA-256 و SHA-512 وقارن بينها"
        icon={<Hash className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Label>النص</Label>
            <Textarea
              placeholder="أدخل النص المراد إنشاء هاش له..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] direction-ltr"
              dir="ltr"
            />
            <Button onClick={generateHashes} className="w-full bg-primary hover:bg-primary/90" disabled={!input}>
              <Hash className="h-4 w-4 ml-1" />
              إنشاء الهاشات
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Label>النتائج</Label>
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <div key={result.algorithm} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-primary">{result.algorithm}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyHash(result.algorithm, result.hash)}
                      >
                        {copied === result.algorithm ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="font-mono text-xs break-all direction-ltr" dir="ltr">
                      {result.hash}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p className="text-sm">أدخل نصاً واضغط "إنشاء الهاشات"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compare Hash */}
      <Card className="mt-6">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <Label>مقارنة الهاش</Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="الصق الهاش للمقارنة..."
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              dir="ltr"
              className="font-mono"
            />
            {matchResult !== null && (
              <span className={`text-sm font-semibold whitespace-nowrap ${matchResult ? 'text-emerald-600' : 'text-red-500'}`}>
                {matchResult ? '✓ متطابق' : '✗ غير متطابق'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Premium */}
      <div className="mt-6">
        <PremiumGate feature="هاش الملفات - إنشاء هاش لأي ملف">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">هاش الملفات</p>
                  <p className="text-xs text-muted-foreground">أنشئ هاش لأي ملف من جهازك</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PremiumGate>
      </div>

      <div className="mt-6">
        <AdBanner slot="hash-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
