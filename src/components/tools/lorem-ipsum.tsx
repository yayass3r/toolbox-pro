'use client';

import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { useToast } from '@/hooks/use-toast';

const arabicLorem = [
  'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق.',
  'إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربي زيادة عدد الفقرات كما تريد، النص لن يبدو مقسماً ولا يحوي أخطاء لغوية.',
  'هذا النص يمكن أن يتم تركيبه على أي تصميم دون مشكلة فلن يبدو وكأنه نص منسوخ، غير منظم، غير منسق، أو حتى غير مفهوم.',
  'من المعروف أن القارئ سيتشتت بالمحتوى المقروء لصفحة ما عندما ينظر إلى تخطيطها. نقطة استخدام لوريم إبسوم هي أنها تحتوي على توزيع طبيعي للأحرف.',
  'على عكس الاعتقاد السائد، لوريم إبسوم ليس نصاً عشوائياً. له جذور في قطعة من الأدب الكلاسيكي اللاتيني من عام 45 قبل الميلاد، مما يجعله أكثر من 2000 عام.',
  'العديد من حزم النشر المكتبي وبرامج تحرير صفحات الويب تستخدم لوريم إبسوم كنموذج نصي افتراضي، والبحث عن "لوريم إبسوم" سيكشف عن العديد من المواقع في مراحله الأولى.',
  'هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات.',
  'الهدف من استخدام لوريم إبسوم هو أن له توزيعاً طبيعياً للأحرف إلى حد ما، بدلاً من استخدام "هنا يوجد محتوى نصي، هنا يوجد محتوى نصي" مما يجعله يبدو كعربية مقروءة.',
];

const latinLorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.',
  'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
  'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
];

const arabicWords = [
  'هذا', 'النص', 'مثال', 'يمكن', 'أن', 'يستبدل', 'نفس', 'المساحة', 'تم', 'توليد',
  'مولد', 'العربي', 'حيث', 'تولد', 'مثل', 'العديدة', 'النصوص', 'الأخرى', 'إضافة', 'زيادة',
  'عدد', 'الحروف', 'التطبيق', 'إذا', 'تحتاج', 'أكبر', 'الفقرات', 'يتيح', 'كما', 'تريد',
  'لن', 'يبدو', 'مقسماً', 'يحوي', 'أخطاء', 'لغوية', 'القارئ', 'سيتشتت', 'المحتوى', 'المقروء',
];

const latinWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
];

function generateParagraphs(count: number, isArabic: boolean): string {
  const source = isArabic ? arabicLorem : latinLorem;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(source[i % source.length]);
  }
  return result.join('\n\n');
}

function generateSentences(count: number, isArabic: boolean): string {
  const source = isArabic ? arabicLorem : latinLorem;
  const allSentences = source.flatMap((p) =>
    p.split(/[.؟!]/).filter((s) => s.trim().length > 5)
  );
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(allSentences[i % allSentences.length].trim());
  }
  return result.join('. ') + '.';
}

function generateWords(count: number, isArabic: boolean): string {
  const source = isArabic ? arabicWords : latinWords;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(source[i % source.length]);
  }
  return result.join(' ');
}

export function LoremIpsum() {
  const [count, setCount] = useState([3]);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [isArabic, setIsArabic] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generate = () => {
    let result = '';
    switch (type) {
      case 'paragraphs':
        result = generateParagraphs(count[0], isArabic);
        break;
      case 'sentences':
        result = generateSentences(count[0], isArabic);
        break;
      case 'words':
        result = generateWords(count[0], isArabic);
        break;
    }
    setOutput(result);
    toast({ title: 'تم التوليد', description: `تم توليد ${count[0]} ${type === 'paragraphs' ? 'فقرات' : type === 'sentences' ? 'جمل' : 'كلمات'}` });
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ النص إلى الحافظة' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="مولّد النص العشوائي"
        description="أنشئ نصاً عشوائياً للتصاميم والنماذج مع دعم النص العربي"
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Options */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>النوع</Label>
              <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="paragraphs">فقرات</TabsTrigger>
                  <TabsTrigger value="sentences">جمل</TabsTrigger>
                  <TabsTrigger value="words">كلمات</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>العدد: {count[0]}</Label>
              <Slider
                value={count}
                onValueChange={setCount}
                min={1}
                max={type === 'words' ? 200 : type === 'sentences' ? 50 : 20}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>نص عربي</Label>
              <Switch checked={isArabic} onCheckedChange={setIsArabic} />
            </div>

            <Button onClick={generate} className="w-full bg-primary hover:bg-primary/90">
              توليد النص
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label>الناتج</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 ml-1" />}
                  نسخ
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] resize-y"
              placeholder="اضغط توليد النص لإنشاء نص عشوائي..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <AdBanner slot="lorem-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
