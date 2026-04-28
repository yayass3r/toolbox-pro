'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  FileText,
  Upload,
  Download,
  Scissors,
  Combine,
  Minimize2,
  ImageIcon,
  FileImage,
  Lock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

export function PdfTools() {
  const { toast } = useToast();
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPageNum, setSplitPageNum] = useState('1');
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = useCallback(async () => {
    if (mergeFiles.length < 2) {
      toast({ title: 'خطأ', description: 'يرجى اختيار ملفين PDF على الأقل', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of mergeFiles) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: 'تم بنجاح', description: 'تم دمج الملفات بنجاح' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في دمج الملفات', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [mergeFiles, toast]);

  const handleSplit = useCallback(async () => {
    if (!splitFile) {
      toast({ title: 'خطأ', description: 'يرجى اختيار ملف PDF', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const bytes = await splitFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const totalPages = pdf.getPageCount();
      const splitAt = parseInt(splitPageNum);

      if (splitAt < 1 || splitAt >= totalPages) {
        toast({ title: 'خطأ', description: `رقم الصفحة يجب أن يكون بين 1 و ${totalPages - 1}`, variant: 'destructive' });
        setIsProcessing(false);
        return;
      }

      // First part
      const pdf1 = await PDFDocument.create();
      const pages1 = await pdf1.copyPages(pdf, Array.from({ length: splitAt }, (_, i) => i));
      pages1.forEach((p) => pdf1.addPage(p));
      const bytes1 = await pdf1.save();

      // Second part
      const pdf2 = await PDFDocument.create();
      const pages2 = await pdf2.copyPages(pdf, Array.from({ length: totalPages - splitAt }, (_, i) => i + splitAt));
      pages2.forEach((p) => pdf2.addPage(p));
      const bytes2 = await pdf2.save();

      // Download both
      [{ data: bytes1, name: 'part1.pdf' }, { data: bytes2, name: 'part2.pdf' }].forEach(({ data, name }) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
        URL.revokeObjectURL(url);
      });

      toast({ title: 'تم بنجاح', description: 'تم تقسيم الملف إلى جزئين' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تقسيم الملف', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [splitFile, splitPageNum, toast]);

  const handleCompress = useCallback(async () => {
    if (!compressFile) {
      toast({ title: 'خطأ', description: 'يرجى اختيار ملف PDF', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const bytes = await compressFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      // Simple compression by re-saving (removes redundant data)
      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      const originalSize = compressFile.size;
      const compressedSize = compressedBytes.byteLength;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'compressed.pdf';
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'تم الضغط',
        description: `تم تقليل الحجم بنسبة ${reduction}% (${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB)`,
      });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في ضغط الملف', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [compressFile, toast]);

  const handleImageToPdf = useCallback(async () => {
    if (imageFiles.length === 0) {
      toast({ title: 'خطأ', description: 'يرجى اختيار صورة واحدة على الأقل', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of imageFiles) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(bytes);
        } else if (file.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(bytes);
        } else {
          // Convert other formats using canvas
          const img = new window.Image();
          img.src = URL.createObjectURL(file);
          await new Promise((resolve) => { img.onload = resolve; });
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const jpgBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
          });
          const jpgBytes = await jpgBlob.arrayBuffer();
          image = await pdfDoc.embedJpg(jpgBytes);
          URL.revokeObjectURL(img.src);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images.pdf';
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: 'تم بنجاح', description: 'تم تحويل الصور إلى PDF' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تحويل الصور', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [imageFiles, toast]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="أدوات PDF"
        description="ادمج، قسم، اضغط، وحوّل ملفات PDF بسهولة"
        icon={<FileText className="h-5 w-5" />}
      />

      <Tabs defaultValue="merge" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="merge" className="flex-1 min-w-[100px]">
            <Combine className="h-4 w-4 ml-1" />
            دمج PDF
          </TabsTrigger>
          <TabsTrigger value="split" className="flex-1 min-w-[100px]">
            <Scissors className="h-4 w-4 ml-1" />
            تقسيم PDF
          </TabsTrigger>
          <TabsTrigger value="compress" className="flex-1 min-w-[100px]">
            <Minimize2 className="h-4 w-4 ml-1" />
            ضغط PDF
          </TabsTrigger>
          <TabsTrigger value="pdf-to-image" className="flex-1 min-w-[100px]">
            <ImageIcon className="h-4 w-4 ml-1" />
            PDF لصورة
          </TabsTrigger>
          <TabsTrigger value="image-to-pdf" className="flex-1 min-w-[100px]">
            <FileImage className="h-4 w-4 ml-1" />
            صورة لـ PDF
          </TabsTrigger>
        </TabsList>

        {/* Merge Tab */}
        <TabsContent value="merge" className="mt-4">
          <PremiumGate feature="دمج ملفات PDF متعددة">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">اختر ملفات PDF للدمج</p>
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 ml-1" />
                      اختيار ملفات PDF
                      <input
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files ? Array.from(e.target.files) : [];
                          setMergeFiles(files);
                        }}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>

                {mergeFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">الملفات المختارة ({mergeFiles.length}):</p>
                    {mergeFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleMerge}
                  disabled={mergeFiles.length < 2 || isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isProcessing ? 'جاري الدمج...' : 'دمج الملفات'}
                  <Download className="h-4 w-4 mr-1" />
                </Button>
              </CardContent>
            </Card>
          </PremiumGate>
        </TabsContent>

        {/* Split Tab */}
        <TabsContent value="split" className="mt-4">
          <PremiumGate feature="تقسيم ملفات PDF إلى أجزاء">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">اختر ملف PDF للتقسيم</p>
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 ml-1" />
                      اختيار ملف PDF
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSplitFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>

                {splitFile && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{splitFile.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatFileSize(splitFile.size)}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>التقسيم عند الصفحة رقم</Label>
                  <Input
                    type="number"
                    min="1"
                    value={splitPageNum}
                    onChange={(e) => setSplitPageNum(e.target.value)}
                    placeholder="أدخل رقم الصفحة"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إنشاء ملفين: من الصفحة 1 إلى {splitPageNum}، ومن الصفحة {parseInt(splitPageNum) + 1} إلى النهاية
                  </p>
                </div>

                <Button
                  onClick={handleSplit}
                  disabled={!splitFile || isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isProcessing ? 'جاري التقسيم...' : 'تقسيم الملف'}
                  <Scissors className="h-4 w-4 mr-1" />
                </Button>
              </CardContent>
            </Card>
          </PremiumGate>
        </TabsContent>

        {/* Compress Tab */}
        <TabsContent value="compress" className="mt-4">
          <PremiumGate feature="ضغط ملفات PDF لتقليل حجمها">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">اختر ملف PDF للضغط</p>
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 ml-1" />
                      اختيار ملف PDF
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCompressFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>

                {compressFile && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{compressFile.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatFileSize(compressFile.size)}</span>
                  </div>
                )}

                <Button
                  onClick={handleCompress}
                  disabled={!compressFile || isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isProcessing ? 'جاري الضغط...' : 'ضغط الملف'}
                  <Minimize2 className="h-4 w-4 mr-1" />
                </Button>
              </CardContent>
            </Card>
          </PremiumGate>
        </TabsContent>

        {/* PDF to Image Tab */}
        <TabsContent value="pdf-to-image" className="mt-4">
          <PremiumGate feature="تحويل صفحات PDF إلى صور">
            <Card>
              <CardContent className="p-6 text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground mb-2">
                  قم بتحميل ملف PDF وسيتم تحويل كل صفحة إلى صورة PNG
                </p>
                <p className="text-xs text-muted-foreground">
                  متاح فقط في النسخة المميزة
                </p>
                <Badge className="mt-3">
                  <Lock className="h-3 w-3 ml-1" />
                  ميزة مميزة
                </Badge>
              </CardContent>
            </Card>
          </PremiumGate>
        </TabsContent>

        {/* Image to PDF Tab */}
        <TabsContent value="image-to-pdf" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">مجاني</Badge>
                <span className="text-xs text-muted-foreground">(بدون علامة مائية)</span>
              </div>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">اختر صورة أو أكثر لتحويلها إلى PDF</p>
                <Button variant="outline" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 ml-1" />
                    اختيار الصور
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        setImageFiles(files);
                      }}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>

              {imageFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">الصور المختارة ({imageFiles.length}):</p>
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileImage className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={handleImageToPdf}
                disabled={imageFiles.length === 0 || isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isProcessing ? 'جاري التحويل...' : 'تحويل إلى PDF'}
                <Download className="h-4 w-4 mr-1" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <AdBanner slot="pdf-tools-bottom" format="horizontal" />
      </div>
    </div>
  );
}
