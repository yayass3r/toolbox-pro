'use client';

import { useState, useCallback } from 'react';
import { Smile, Search, Copy, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

interface EmojiItem {
  emoji: string;
  name: string;
  category: string;
}

const emojiCategories: Record<string, { label: string; icon: string; emojis: EmojiItem[] }> = {
  smileys: {
    label: 'وجوه تعبيرية',
    icon: '😊',
    emojis: [
      { emoji: '😀', name: 'وجه مبتسم', category: 'smileys' },
      { emoji: '😃', name: 'وجه مبتسم بعيون كبيرة', category: 'smileys' },
      { emoji: '😄', name: 'وجه مبتسم جداً', category: 'smileys' },
      { emoji: '😁', name: 'وجه يبتسم بعيون', category: 'smileys' },
      { emoji: '😆', name: 'وجه يضحك بعيون مغلقة', category: 'smileys' },
      { emoji: '😅', name: 'وجه مبتسم بعرق', category: 'smileys' },
      { emoji: '🤣', name: 'وجه يضحك بشدة', category: 'smileys' },
      { emoji: '😂', name: 'وجه يبكي من الضحك', category: 'smileys' },
      { emoji: '🙂', name: 'وجه مبتسم قليلاً', category: 'smileys' },
      { emoji: '😉', name: 'وجه يغمز', category: 'smileys' },
      { emoji: '😊', name: 'وجه مبتسم بخدين', category: 'smileys' },
      { emoji: '😇', name: 'وجه بهالة', category: 'smileys' },
      { emoji: '🥰', name: 'وجه محب', category: 'smileys' },
      { emoji: '😍', name: 'وجه بعيون قلب', category: 'smileys' },
      { emoji: '🤩', name: 'وجه متحمس', category: 'smileys' },
      { emoji: '😘', name: 'وجه يرسل قبلة', category: 'smileys' },
      { emoji: '😋', name: 'وجه لذيذ', category: 'smileys' },
      { emoji: '😛', name: 'وجه بلسان', category: 'smileys' },
      { emoji: '😜', name: 'وجه يغمز بلسان', category: 'smileys' },
      { emoji: '🤪', name: 'وجه مجنون', category: 'smileys' },
      { emoji: '😎', name: 'وجه بنظارة شمسية', category: 'smileys' },
      { emoji: '🤓', name: 'وجه بنظارة ذكية', category: 'smileys' },
      { emoji: '🥳', name: 'وجه يحتفل', category: 'smileys' },
      { emoji: '😏', name: 'وجه ابتسامة ماكرة', category: 'smileys' },
      { emoji: '😒', name: 'وجه غير مبالٍ', category: 'smileys' },
      { emoji: '😞', name: 'وجه خائب', category: 'smileys' },
      { emoji: '😔', name: 'وجه متأمل', category: 'smileys' },
      { emoji: '😟', name: 'وجه قلق', category: 'smileys' },
      { emoji: '😢', name: 'وجه يبكي', category: 'smileys' },
      { emoji: '😭', name: 'وجه يبكي بشدة', category: 'smileys' },
      { emoji: '😤', name: 'وجه غاضب', category: 'smileys' },
      { emoji: '😡', name: 'وجه متجهم', category: 'smileys' },
      { emoji: '🤬', name: 'وجه يلعن', category: 'smileys' },
      { emoji: '🤯', name: 'وجه منفجر', category: 'smileys' },
      { emoji: '😳', name: 'وجه متورد', category: 'smileys' },
      { emoji: '🥺', name: 'وجه متوسل', category: 'smileys' },
      { emoji: '😱', name: 'وجه خائف', category: 'smileys' },
      { emoji: '😨', name: 'وجه مرعوب', category: 'smileys' },
      { emoji: '😴', name: 'وجه نائم', category: 'smileys' },
      { emoji: '🤮', name: 'وجه يتقيأ', category: 'smileys' },
    ],
  },
  animals: {
    label: 'حيوانات وطبيعة',
    icon: '🐾',
    emojis: [
      { emoji: '🐶', name: 'كلب', category: 'animals' },
      { emoji: '🐱', name: 'قطة', category: 'animals' },
      { emoji: '🐭', name: 'فأر', category: 'animals' },
      { emoji: '🐹', name: 'هامستر', category: 'animals' },
      { emoji: '🐰', name: 'أرنب', category: 'animals' },
      { emoji: '🦊', name: 'ثعلب', category: 'animals' },
      { emoji: '🐻', name: 'دب', category: 'animals' },
      { emoji: '🐼', name: 'باندا', category: 'animals' },
      { emoji: '🐨', name: 'كوالا', category: 'animals' },
      { emoji: '🐯', name: 'نمر', category: 'animals' },
      { emoji: '🦁', name: 'أسد', category: 'animals' },
      { emoji: '🐮', name: 'بقرة', category: 'animals' },
      { emoji: '🐷', name: 'خنزير', category: 'animals' },
      { emoji: '🐸', name: 'ضفدع', category: 'animals' },
      { emoji: '🐵', name: 'قرد', category: 'animals' },
      { emoji: '🐔', name: 'دجاجة', category: 'animals' },
      { emoji: '🐧', name: 'بطريق', category: 'animals' },
      { emoji: '🐦', name: 'طائر', category: 'animals' },
      { emoji: '🦅', name: 'نسر', category: 'animals' },
      { emoji: '🦋', name: 'فراشة', category: 'animals' },
      { emoji: '🐛', name: 'دودة', category: 'animals' },
      { emoji: '🦄', name: 'يونيكورن', category: 'animals' },
      { emoji: '🐙', name: 'أخطبوط', category: 'animals' },
      { emoji: '🐠', name: 'سمكة استوائية', category: 'animals' },
      { emoji: '🐬', name: 'دلفين', category: 'animals' },
      { emoji: '🐳', name: 'حوت', category: 'animals' },
      { emoji: '🐊', name: 'تمساح', category: 'animals' },
      { emoji: '🐢', name: 'سلحفاة', category: 'animals' },
      { emoji: '🦎', name: 'سحلية', category: 'animals' },
      { emoji: '🐍', name: 'ثعبان', category: 'animals' },
    ],
  },
  food: {
    label: 'طعام وشراب',
    icon: '🍕',
    emojis: [
      { emoji: '🍎', name: 'تفاحة', category: 'food' },
      { emoji: '🍊', name: 'برتقالة', category: 'food' },
      { emoji: '🍋', name: 'ليمون', category: 'food' },
      { emoji: '🍌', name: 'موزة', category: 'food' },
      { emoji: '🍉', name: 'بطيخة', category: 'food' },
      { emoji: '🍇', name: 'عنب', category: 'food' },
      { emoji: '🍓', name: 'فراولة', category: 'food' },
      { emoji: '🫐', name: 'توت', category: 'food' },
      { emoji: '🍑', name: 'خوخ', category: 'food' },
      { emoji: '🥭', name: 'مانجو', category: 'food' },
      { emoji: '🍕', name: 'بيتزا', category: 'food' },
      { emoji: '🍔', name: 'برجر', category: 'food' },
      { emoji: '🍟', name: 'بطاطس مقلية', category: 'food' },
      { emoji: '🌭', name: 'هوت دوج', category: 'food' },
      { emoji: '🥪', name: 'ساندويتش', category: 'food' },
      { emoji: '🌮', name: 'تاكو', category: 'food' },
      { emoji: '🍣', name: 'سوشي', category: 'food' },
      { emoji: '🍜', name: 'شعرية', category: 'food' },
      { emoji: '🍲', name: 'حساء', category: 'food' },
      { emoji: '☕', name: 'قهوة', category: 'food' },
      { emoji: '🍵', name: 'شاي', category: 'food' },
      { emoji: '🧃', name: 'عصير', category: 'food' },
      { emoji: '🍺', name: 'بيرة', category: 'food' },
      { emoji: '🍷', name: 'نبيذ', category: 'food' },
      { emoji: '🥤', name: 'كوب', category: 'food' },
      { emoji: '🧁', name: 'كب كيك', category: 'food' },
      { emoji: '🍰', name: 'كعكة', category: 'food' },
      { emoji: '🎂', name: 'كعكة عيد ميلاد', category: 'food' },
      { emoji: '🍩', name: 'دونات', category: 'food' },
      { emoji: '🍪', name: 'كوكيز', category: 'food' },
    ],
  },
  travel: {
    label: 'سفر وأماكن',
    icon: '✈️',
    emojis: [
      { emoji: '🚗', name: 'سيارة', category: 'travel' },
      { emoji: '🚕', name: 'تاكسي', category: 'travel' },
      { emoji: '🚌', name: 'حافلة', category: 'travel' },
      { emoji: '🚎', name: 'ترولي', category: 'travel' },
      { emoji: '🏎️', name: 'سيارة سباق', category: 'travel' },
      { emoji: '🚓', name: 'سيارة شرطة', category: 'travel' },
      { emoji: '🚑', name: 'سيارة إسعاف', category: 'travel' },
      { emoji: '🚒', name: 'سيارة إطفاء', category: 'travel' },
      { emoji: '✈️', name: 'طائرة', category: 'travel' },
      { emoji: '🚀', name: 'صاروخ', category: 'travel' },
      { emoji: '🚁', name: 'هليكوبتر', category: 'travel' },
      { emoji: '⛵', name: 'شراع', category: 'travel' },
      { emoji: '🚢', name: 'سفينة', category: 'travel' },
      { emoji: '🏠', name: 'منزل', category: 'travel' },
      { emoji: '🏢', name: 'مكتب', category: 'travel' },
      { emoji: '🏗️', name: 'بناء', category: 'travel' },
      { emoji: '🌍', name: 'أفريقيا وأوروبا', category: 'travel' },
      { emoji: '🌎', name: 'أمريكا', category: 'travel' },
      { emoji: '🌏', name: 'آسيا وأستراليا', category: 'travel' },
      { emoji: '🗺️', name: 'خريطة', category: 'travel' },
    ],
  },
  activities: {
    label: 'أنشطة',
    icon: '⚽',
    emojis: [
      { emoji: '⚽', name: 'كرة قدم', category: 'activities' },
      { emoji: '🏀', name: 'كرة سلة', category: 'activities' },
      { emoji: '🏈', name: 'كرة أمريكية', category: 'activities' },
      { emoji: '⚾', name: 'بيسبول', category: 'activities' },
      { emoji: '🎾', name: 'تنس', category: 'activities' },
      { emoji: '🏐', name: 'كرة طائرة', category: 'activities' },
      { emoji: '🎱', name: 'بلياردو', category: 'activities' },
      { emoji: '🎮', name: 'جيم باد', category: 'activities' },
      { emoji: '🎯', name: 'هدف', category: 'activities' },
      { emoji: '🎲', name: 'نرد', category: 'activities' },
      { emoji: '🧩', name: 'لغز', category: 'activities' },
      { emoji: '🎭', name: 'مسرح', category: 'activities' },
      { emoji: '🎨', name: 'لوحة ألوان', category: 'activities' },
      { emoji: '🎬', name: 'سينما', category: 'activities' },
      { emoji: '🎤', name: 'ميكروفون', category: 'activities' },
      { emoji: '🎧', name: 'سماعات', category: 'activities' },
      { emoji: '🎵', name: 'نوتة موسيقية', category: 'activities' },
      { emoji: '🎸', name: 'جيتار', category: 'activities' },
      { emoji: '🎹', name: 'بيانو', category: 'activities' },
      { emoji: '🏆', name: 'كأس', category: 'activities' },
    ],
  },
  objects: {
    label: 'أشياء',
    icon: '💡',
    emojis: [
      { emoji: '⌚', name: 'ساعة يد', category: 'objects' },
      { emoji: '📱', name: 'هاتف', category: 'objects' },
      { emoji: '💻', name: 'لابتوب', category: 'objects' },
      { emoji: '⌨️', name: 'لوحة مفاتيح', category: 'objects' },
      { emoji: '🖥️', name: 'شاشة', category: 'objects' },
      { emoji: '🖨️', name: 'طابعة', category: 'objects' },
      { emoji: '💡', name: 'مصباح', category: 'objects' },
      { emoji: '🔦', name: 'كشاف', category: 'objects' },
      { emoji: '📔', name: 'دفتر', category: 'objects' },
      { emoji: '📖', name: 'كتاب', category: 'objects' },
      { emoji: '✏️', name: 'قلم رصاص', category: 'objects' },
      { emoji: '🖊️', name: 'قلم حبر', category: 'objects' },
      { emoji: '📎', name: 'مشبك ورق', category: 'objects' },
      { emoji: '📐', name: 'مسطرة مثلثة', category: 'objects' },
      { emoji: '✂️', name: 'مقص', category: 'objects' },
      { emoji: '🔑', name: 'مفتاح', category: 'objects' },
      { emoji: '🔒', name: 'قفل', category: 'objects' },
      { emoji: '💰', name: 'كيس مال', category: 'objects' },
      { emoji: '💎', name: 'ألماس', category: 'objects' },
      { emoji: '🧲', name: 'مغناطيس', category: 'objects' },
    ],
  },
  symbols: {
    label: 'رموز',
    icon: '❤️',
    emojis: [
      { emoji: '❤️', name: 'قلب أحمر', category: 'symbols' },
      { emoji: '🧡', name: 'قلب برتقالي', category: 'symbols' },
      { emoji: '💛', name: 'قلب أصفر', category: 'symbols' },
      { emoji: '💚', name: 'قلب أخضر', category: 'symbols' },
      { emoji: '💙', name: 'قلب أزرق', category: 'symbols' },
      { emoji: '💜', name: 'قلب بنفسجي', category: 'symbols' },
      { emoji: '🖤', name: 'قلب أسود', category: 'symbols' },
      { emoji: '🤍', name: 'قلب أبيض', category: 'symbols' },
      { emoji: '💯', name: 'مئة', category: 'symbols' },
      { emoji: '✅', name: 'علامة خضراء', category: 'symbols' },
      { emoji: '❌', name: 'علامة حمراء', category: 'symbols' },
      { emoji: '⭐', name: 'نجمة', category: 'symbols' },
      { emoji: '🌟', name: 'نجمة متوهجة', category: 'symbols' },
      { emoji: '💫', name: 'نجمة دوارة', category: 'symbols' },
      { emoji: '🔥', name: 'نار', category: 'symbols' },
      { emoji: '💧', name: 'قطرة ماء', category: 'symbols' },
      { emoji: '⚡', name: 'برق', category: 'symbols' },
      { emoji: '🌈', name: 'قوس قزح', category: 'symbols' },
      { emoji: '🎉', name: 'حفلة', category: 'symbols' },
      { emoji: '🎊', name: 'كرنفال', category: 'symbols' },
    ],
  },
};

const RECENT_KEY = 'toolbox-emoji-recent';

export function EmojiPicker() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<EmojiItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const copyEmoji = useCallback((emoji: EmojiItem) => {
    navigator.clipboard.writeText(emoji.emoji);
    setCopiedEmoji(emoji.emoji);
    setTimeout(() => setCopiedEmoji(null), 1500);

    // Add to recent
    const newRecent = [emoji, ...recentEmojis.filter((r) => r.emoji !== emoji.emoji)].slice(0, 20);
    setRecentEmojis(newRecent);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
    } catch { /* ignore */ }

    toast({ title: 'تم النسخ', description: `تم نسخ ${emoji.emoji} إلى الحافظة` });
  }, [recentEmojis, toast]);

  const filteredEmojis = (category: string) => {
    const cats = emojiCategories[category];
    if (!cats) return [];
    if (!search.trim()) return cats.emojis;
    return cats.emojis.filter(
      (e) => e.name.includes(search) || e.emoji.includes(search)
    );
  };

  const allFilteredEmojis = search.trim()
    ? Object.values(emojiCategories).flatMap((cat) =>
        cat.emojis.filter((e) => e.name.includes(search) || e.emoji.includes(search))
      )
    : [];

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="منتقي الرموز التعبيرية"
        description="ابحث وانسخ رموز الإيموجي بسهولة"
        icon={<Smile className="h-5 w-5" />}
      />

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن رمز تعبيري..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Emojis */}
      {recentEmojis.length > 0 && !search.trim() && (
        <Card className="mb-4">
          <CardHeader className="pb-2 px-4 pt-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              المستخدمة مؤخراً
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="flex flex-wrap gap-1">
              {recentEmojis.slice(0, 16).map((emoji) => (
                <button
                  key={emoji.emoji}
                  onClick={() => copyEmoji(emoji)}
                  className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-xl"
                  title={emoji.name}
                >
                  {emoji.emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {search.trim() && allFilteredEmojis.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2 px-4 pt-3">
            <CardTitle className="text-sm">نتائج البحث ({allFilteredEmojis.length})</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="flex flex-wrap gap-1">
              {allFilteredEmojis.map((emoji) => (
                <button
                  key={emoji.emoji}
                  onClick={() => copyEmoji(emoji)}
                  className={`h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-xl ${
                    copiedEmoji === emoji.emoji ? 'bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500' : ''
                  }`}
                  title={emoji.name}
                >
                  {emoji.emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {search.trim() && allFilteredEmojis.length === 0 && (
        <Card className="mb-4">
          <CardContent className="p-8 text-center">
            <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">لا توجد نتائج لـ &quot;{search}&quot;</p>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {!search.trim() && (
        <Tabs defaultValue="smileys" className="w-full">
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
            {Object.entries(emojiCategories).map(([key, cat]) => (
              <TabsTrigger key={key} value={key} className="flex-1 min-w-[80px]">
                <span className="mr-1">{cat.icon}</span>
                <span className="text-xs hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(emojiCategories).map(([key, cat]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <Card>
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.label}
                    <Badge variant="secondary">{filteredEmojis(key).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="flex flex-wrap gap-1">
                    {filteredEmojis(key).map((emoji) => (
                      <button
                        key={emoji.emoji}
                        onClick={() => copyEmoji(emoji)}
                        className={`h-11 w-11 flex items-center justify-center rounded-lg hover:bg-muted transition-all text-xl hover:scale-110 ${
                          copiedEmoji === emoji.emoji ? 'bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500' : ''
                        }`}
                        title={emoji.name}
                      >
                        {emoji.emoji}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Premium Feature */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <PremiumGate feature="مجموعات إيموجي مخصصة">
            <div className="text-center py-4">
              <Star className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">أنشئ مجموعات إيموجي مخصصة واحفظ المفضلة</p>
            </div>
          </PremiumGate>
        </CardContent>
      </Card>

      <div className="mt-6">
        <AdBanner slot="emoji-picker-bottom" format="horizontal" />
      </div>
    </div>
  );
}
