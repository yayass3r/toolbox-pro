'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link2, Copy, QrCode, ExternalLink, Trash2, Lock, BarChart3, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface ShortenedLink {
  id: string;
  original: string;
  short: string;
  alias?: string;
  clicks: number;
  createdAt: string;
  qrDataUrl?: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 6);
}

export function LinkShortener() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [links, setLinks] = useState<ShortenedLink[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('toolbox-shortened-links');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });
  const [selectedLink, setSelectedLink] = useState<ShortenedLink | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem('toolbox-shortened-links', JSON.stringify(links));
    }
  }, [links]);

  useEffect(() => {
    if (selectedLink) {
      QRCode.toDataURL(selectedLink.short, { width: 200, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(''));
    }
  }, [selectedLink]);

  const shortenUrl = useCallback(() => {
    if (!url.trim()) return;

    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'https://' + url;
    }

    const hash = simpleHash(processedUrl + Date.now().toString());
    const shortUrl = `https://tbp.link/${customAlias || hash}`;

    const newLink: ShortenedLink = {
      id: Date.now().toString(),
      original: processedUrl,
      short: shortUrl,
      alias: customAlias || undefined,
      clicks: 0,
      createdAt: new Date().toLocaleDateString('ar'),
    };

    setLinks([newLink, ...links]);
    setUrl('');
    setCustomAlias('');
    setSelectedLink(newLink);

    toast({ title: 'تم التقصير', description: 'تم إنشاء الرابط المختصر بنجاح' });
  }, [url, customAlias, links, toast]);

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرابط إلى الحافظة' });
  };

  const simulateClick = (id: string) => {
    setLinks(links.map((l) => l.id === id ? { ...l, clicks: l.clicks + 1 } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    if (selectedLink?.id === id) setSelectedLink(null);
    localStorage.setItem('toolbox-shortened-links', JSON.stringify(links.filter((l) => l.id !== id)));
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
    toast({ title: 'تم التحميل', description: 'تم تحميل رمز QR' });
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مقص الروابط"
        description="قص الروابط الطويلة وأنشئ رموز QR وتتبع النقرات"
        icon={<Link2 className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>الرابط الطويل</Label>
                <div className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="أدخل الرابط هنا... مثال: example.com/very/long/url"
                    dir="ltr"
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
                  />
                  <Button onClick={shortenUrl} className="bg-teal-600 hover:bg-teal-700 whitespace-nowrap">
                    تقصير
                  </Button>
                </div>
              </div>

              <PremiumGate feature="اسم مخصص للرابط المختصر">
                <div className="space-y-2">
                  <Label>اسم مخصص (اختياري)</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground" dir="ltr">tbp.link/</span>
                    <Input
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                      placeholder="اسم-مخصص"
                      dir="ltr"
                      className="flex-1"
                    />
                  </div>
                </div>
              </PremiumGate>
            </CardContent>
          </Card>

          {/* Links List */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">الروابط المختصرة</h3>
                <Badge variant="secondary">{links.length} رابط</Badge>
              </div>
              {links.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedLink?.id === link.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/20' : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLink(link)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-teal-700" dir="ltr">{link.short}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); copyLink(link.short); }}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); simulateClick(link.id); }}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); deleteLink(link.id); }}>
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate" dir="ltr">{link.original}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          <BarChart3 className="h-3 w-3 inline ml-1" />
                          {link.clicks} نقرة
                        </span>
                        <span className="text-xs text-muted-foreground">{link.createdAt}</span>
                        {link.alias && <Badge variant="outline" className="text-[10px] px-1 py-0">مخصص</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Link2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">لم يتم تقصير أي روابط بعد</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Code & Stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-bold mb-4">رمز QR للرابط المختصر</h3>
              {selectedLink && qrDataUrl ? (
                <>
                  <div className="inline-block p-4 bg-white rounded-lg shadow-sm mb-4">
                    <img src={qrDataUrl} alt="QR Code" className="h-48 w-48" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3" dir="ltr">{selectedLink.short}</p>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" onClick={() => copyLink(selectedLink.short)}>
                      <Copy className="h-4 w-4 ml-1" /> نسخ الرابط
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadQR}>
                      <Download className="h-4 w-4 ml-1" /> تحميل QR
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-12">
                  <QrCode className="h-16 w-16 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">اختر رابطاً لعرض رمز QR</p>
                </div>
              )}
            </CardContent>
          </Card>

          <PremiumGate feature="إحصائيات مفصلة وتحليلات النقرات">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-3">تحليلات النقرات</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{links.reduce((s, l) => s + l.clicks, 0)}</p>
                      <p className="text-xs text-muted-foreground">إجمالي النقرات</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{links.length}</p>
                      <p className="text-xs text-muted-foreground">روابط</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{links.length > 0 ? (links.reduce((s, l) => s + l.clicks, 0) / links.length).toFixed(1) : '0'}</p>
                      <p className="text-xs text-muted-foreground">متوسط النقرات</p>
                    </div>
                  </div>
                  {links.slice(0, 5).map((link) => (
                    <div key={link.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1" dir="ltr">{link.short}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${Math.min(100, (link.clicks / Math.max(1, links[0]?.clicks || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs w-8 text-left">{link.clicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </PremiumGate>
        </div>
      </div>

      <div className="mt-6">
        <AdBanner slot="link-shortener-bottom" format="horizontal" />
      </div>
    </div>
  );
}
