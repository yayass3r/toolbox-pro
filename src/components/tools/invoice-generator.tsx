'use client';

import { useState, useRef } from 'react';
import { Receipt, Download, Plus, Trash2, Eye, Lock, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string | null;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function InvoiceGenerator() {
  const { isPremium } = useAppStore();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [vatEnabled, setVatEnabled] = useState(true);
  const [vatRate, setVatRate] = useState(15);
  const [discountType, setDiscountType] = useState<'none' | 'percentage' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [company, setCompany] = useState<CompanyInfo>({
    name: '', email: '', phone: '', address: '', logo: null,
  });
  const [client, setClient] = useState<ClientInfo>({
    name: '', email: '', phone: '', address: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountType === 'fixed' ? discountValue : 0;
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = vatEnabled ? (afterDiscount * vatRate) / 100 : 0;
  const total = afterDiscount + vatAmount;

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = { SAR: '﷼', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', KWD: 'د.ك' };
    return `${amount.toFixed(2)} ${symbols[currency] || currency}`;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCompany({ ...company, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const exportToPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      if (!isPremium) {
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Created with ToolBox Pro - Free Version', pdfWidth / 2, pdfHeight + 5, { align: 'center' });
      }

      pdf.save(`invoice-${invoiceNumber}.pdf`);
      toast({ title: 'تم التصدير', description: isPremium ? 'تم تصدير الفاتورة بنجاح' : 'تم التصدير مع علامة مائية' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تصدير PDF', variant: 'destructive' });
    }
  };

  const renderInvoicePreview = () => (
    <div ref={invoiceRef} className="bg-white text-black p-8 min-h-[297mm] max-w-[210mm] mx-auto shadow-lg" dir="rtl">
      <div className="flex justify-between items-start mb-8">
        <div>
          {company.logo && <img src={company.logo} alt="Logo" className="h-16 mb-2 object-contain" />}
          <h1 className="text-2xl font-bold text-teal-700">{company.name || 'اسم الشركة'}</h1>
          {company.email && <p className="text-sm text-gray-500">{company.email}</p>}
          {company.phone && <p className="text-sm text-gray-500">{company.phone}</p>}
          {company.address && <p className="text-sm text-gray-500">{company.address}</p>}
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-bold text-teal-600">فاتورة</h2>
          <p className="text-sm text-gray-600 mt-1">رقم: {invoiceNumber}</p>
          <p className="text-sm text-gray-600">التاريخ: {invoiceDate}</p>
          {dueDate && <p className="text-sm text-gray-600">تاريخ الاستحقاق: {dueDate}</p>}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-bold text-gray-500 mb-2">فاتورة إلى:</h3>
        <p className="font-bold">{client.name || 'اسم العميل'}</p>
        {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
        {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
        {client.address && <p className="text-sm text-gray-600">{client.address}</p>}
      </div>

      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="bg-teal-600 text-white">
            <th className="text-right p-3 rounded-tr-lg">الوصف</th>
            <th className="text-center p-3 w-20">الكمية</th>
            <th className="text-center p-3 w-28">سعر الوحدة</th>
            <th className="text-left p-3 rounded-tl-lg w-28">المجموع</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="p-3">{item.description || 'وصف العنصر'}</td>
              <td className="text-center p-3">{item.quantity}</td>
              <td className="text-center p-3">{formatCurrency(item.unitPrice)}</td>
              <td className="text-left p-3">{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mr-auto w-64 text-sm">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">المجموع الفرعي</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountType !== 'none' && discountAmount > 0 && (
          <div className="flex justify-between py-2 text-red-600">
            <span>الخصم {discountType === 'percentage' ? `(${discountValue}%)` : ''}</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        {vatEnabled && (
          <div className="flex justify-between py-2">
            <span className="text-gray-600">ضريبة القيمة المضافة ({vatRate}%)</span>
            <span>{formatCurrency(vatAmount)}</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t-2 border-teal-600 mt-2 font-bold text-lg">
          <span>الإجمالي</span>
          <span className="text-teal-700">{formatCurrency(total)}</span>
        </div>
      </div>

      {notes && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-500 mb-1">ملاحظات</h3>
          <p className="text-sm text-gray-600">{notes}</p>
        </div>
      )}

      {!isPremium && (
        <div className="mt-8 text-center text-[8px] text-gray-300">
          Created with ToolBox Pro - Free Version
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="منشئ الفواتير"
        description="أنشئ فواتير احترافية مع حساب تلقائي للضرائب والخصومات وتصدير PDF"
        icon={<Receipt className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">الإجمالي: {formatCurrency(total)}</Badge>
              {vatEnabled && <Badge variant="outline">ضريبة {vatRate}%: {formatCurrency(vatAmount)}</Badge>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={showPreview ? 'outline' : 'default'} onClick={() => setShowPreview(false)}>
                تعديل
              </Button>
              <Button size="sm" variant={showPreview ? 'default' : 'outline'} onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 ml-1" /> معاينة
              </Button>
              <Button size="sm" onClick={exportToPDF} className="bg-teal-600 hover:bg-teal-700">
                <Download className="h-4 w-4 ml-1" /> PDF
              </Button>
              {!isPremium && (
                <Badge variant="outline" className="text-amber-600 text-xs self-center">
                  <Lock className="h-3 w-3 ml-1" /> علامة مائية
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {showPreview ? (
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4">
                <div className="overflow-auto max-h-[700px] border rounded-lg">
                  {renderInvoicePreview()}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="lg:col-span-2 space-y-4">
              <Tabs defaultValue="company" className="w-full">
                <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
                  <TabsTrigger value="company" className="flex-1">الشركة</TabsTrigger>
                  <TabsTrigger value="client" className="flex-1">العميل</TabsTrigger>
                  <TabsTrigger value="items" className="flex-1">العناصر</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">الإعدادات</TabsTrigger>
                </TabsList>

                <TabsContent value="company" className="mt-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-16 w-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-500 transition-colors" onClick={() => document.getElementById('logo-upload')?.click()}>
                          {company.logo ? <img src={company.logo} alt="Logo" className="h-14 w-14 object-contain" /> : <Upload className="h-6 w-6 text-gray-400" />}
                        </div>
                        <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <div className="text-sm text-muted-foreground">شعار الشركة</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>اسم الشركة</Label>
                          <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} placeholder="اسم شركتك" />
                        </div>
                        <div className="space-y-1">
                          <Label>البريد الإلكتروني</Label>
                          <Input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} placeholder="email@company.com" dir="ltr" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>الهاتف</Label>
                          <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} placeholder="+966..." dir="ltr" />
                        </div>
                        <div className="space-y-1">
                          <Label>العنوان</Label>
                          <Input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} placeholder="العنوان" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="client" className="mt-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>اسم العميل</Label>
                          <Input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="اسم العميل" />
                        </div>
                        <div className="space-y-1">
                          <Label>البريد الإلكتروني</Label>
                          <Input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} placeholder="client@example.com" dir="ltr" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>الهاتف</Label>
                          <Input value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} placeholder="+966..." dir="ltr" />
                        </div>
                        <div className="space-y-1">
                          <Label>العنوان</Label>
                          <Input value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} placeholder="عنوان العميل" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="items" className="mt-4 space-y-3">
                  {items.map((item, idx) => (
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <span className="text-sm text-muted-foreground mt-2 w-6">{idx + 1}.</span>
                          <div className="flex-1 grid grid-cols-6 gap-2">
                            <div className="col-span-3 space-y-1">
                              <Label className="text-xs">الوصف</Label>
                              <Input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="وصف العنصر" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">الكمية</Label>
                              <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">السعر</Label>
                              <Input type="number" min={0} step={0.01} value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">المجموع</Label>
                              <div className="h-9 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                                {formatCurrency(item.quantity * item.unitPrice)}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mt-5" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addItem} className="w-full">
                    <Plus className="h-4 w-4 ml-1" /> إضافة عنصر
                  </Button>
                </TabsContent>

                <TabsContent value="settings" className="mt-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label>رقم الفاتورة</Label>
                          <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} dir="ltr" />
                        </div>
                        <div className="space-y-1">
                          <Label>تاريخ الفاتورة</Label>
                          <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} dir="ltr" />
                        </div>
                        <div className="space-y-1">
                          <Label>تاريخ الاستحقاق</Label>
                          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} dir="ltr" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>العملة</Label>
                        <div className="flex gap-2">
                          {['SAR', 'USD', 'EUR', 'AED', 'KWD', 'GBP'].map((c) => (
                            <Button key={c} size="sm" variant={currency === c ? 'default' : 'outline'} onClick={() => setCurrency(c)}>
                              {c}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>ضريبة القيمة المضافة</Label>
                          <p className="text-xs text-muted-foreground">تفعيل حساب ضريبة القيمة المضافة</p>
                        </div>
                        <Switch checked={vatEnabled} onCheckedChange={setVatEnabled} />
                      </div>
                      {vatEnabled && (
                        <div className="space-y-1">
                          <Label>نسبة الضريبة (%)</Label>
                          <Input type="number" min={0} max={100} value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} />
                        </div>
                      )}

                      <div className="space-y-1">
                        <Label>الخصم</Label>
                        <div className="flex gap-2">
                          <Button size="sm" variant={discountType === 'none' ? 'default' : 'outline'} onClick={() => setDiscountType('none')}>بدون</Button>
                          <Button size="sm" variant={discountType === 'percentage' ? 'default' : 'outline'} onClick={() => setDiscountType('percentage')}>نسبة %</Button>
                          <Button size="sm" variant={discountType === 'fixed' ? 'default' : 'outline'} onClick={() => setDiscountType('fixed')}>مبلغ ثابت</Button>
                        </div>
                      </div>
                      {discountType !== 'none' && (
                        <div className="space-y-1">
                          <Label>{discountType === 'percentage' ? 'نسبة الخصم (%)' : 'مبلغ الخصم'}</Label>
                          <Input type="number" min={0} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
                        </div>
                      )}

                      <div className="space-y-1">
                        <Label>ملاحظات</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." rows={3} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-3">ملخص الفاتورة</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span>{formatCurrency(subtotal)}</span></div>
                    {discountType !== 'none' && discountAmount > 0 && (
                      <div className="flex justify-between text-red-600"><span>الخصم</span><span>-{formatCurrency(discountAmount)}</span></div>
                    )}
                    {vatEnabled && (
                      <div className="flex justify-between"><span className="text-muted-foreground">الضريبة ({vatRate}%)</span><span>{formatCurrency(vatAmount)}</span></div>
                    )}
                    <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>الإجمالي</span><span className="text-teal-700">{formatCurrency(total)}</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-2">معاينة مصغرة</h3>
                  <div className="transform scale-[0.35] origin-top-right h-[280px] -m-24">
                    <div className="border rounded-lg overflow-hidden">
                      {renderInvoicePreview()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <AdBanner slot="invoice-generator-bottom" format="horizontal" />
      </div>
    </div>
  );
}
