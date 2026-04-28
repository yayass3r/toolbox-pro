'use client';

import { useState, useMemo } from 'react';
import { Calendar, Gift, Star, Heart, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { useToast } from '@/hooks/use-toast';

const zodiacSigns = [
  { name: 'الحمل', symbol: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: 'الثور', symbol: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: 'الجوزاء', symbol: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'السرطان', symbol: '♋', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'الأسد', symbol: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'العذراء', symbol: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'الميزان', symbol: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'العقرب', symbol: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'القوس', symbol: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { name: 'الجدي', symbol: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: 'الدلو', symbol: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: 'الحوت', symbol: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

const funFacts = [
  'قلبك نبض حوالي 100,000 مرة في اليوم',
  'جسمك يحتوي على حوالي 37 تريليون خلية',
  'تتنفس حوالي 20,000 مرة في اليوم',
  'شعرك ينمو حوالي 15 سم في السنة',
  'عظامك أقوى من الفولاذ بنفس الوزن',
  'دمك يقطع حوالي 19,000 كم في اليوم',
  'عينك يمكنها التمييز بين 10 ملايين لون',
  'دماغك يولد حوالي 70,000 فكرة في اليوم',
  'تبتلع حوالي 600 مرة في اليوم',
  'الإنسان يضحك في المتوسط 15 مرة في اليوم',
];

function getZodiacSign(month: number, day: number) {
  for (const sign of zodiacSigns) {
    if (sign.startMonth === sign.endMonth) continue;
    if (sign.startMonth > sign.endMonth) {
      // Capricorn: Dec 22 - Jan 19
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    }
  }
  return zodiacSigns[0];
}

function getDayOfWeek(date: Date): string {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[date.getDay()];
}

export function AgeCalculator() {
  const { toast } = useToast();
  const [birthDate, setBirthDate] = useState('');
  const [calculated, setCalculated] = useState(false);

  const ageData = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) return null;

    // Exact age
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalMonths = years * 12 + months;

    // Next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac
    const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate());

    // Day of week born
    const dayOfWeek = getDayOfWeek(birth);

    // Life statistics
    const heartbeats = totalDays * 100000;
    const breaths = totalDays * 20000;
    const sleeps = Math.floor(totalDays / 3); // ~8 hours per day
    const meals = totalDays * 3;

    // Year progress
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;

    // Random fun fact based on age
    const factIndex = (years + months) % funFacts.length;

    return {
      years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalMonths,
      daysUntilBirthday, nextBirthday, zodiac, dayOfWeek, heartbeats, breaths, sleeps, meals,
      yearProgress, funFact: funFacts[factIndex],
    };
  }, [birthDate]);

  const calculateAge = () => {
    if (!birthDate) {
      toast({ title: 'خطأ', description: 'يرجى اختيار تاريخ الميلاد', variant: 'destructive' });
      return;
    }
    setCalculated(true);
  };

  const formatNumber = (n: number) => n.toLocaleString('ar-SA');

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="حاسبة العمر"
        description="احسب عمرك بالتفصيل مع عد تنازلي لعيد ميلادك القادم وحقائق ممتعة"
        icon={<Calendar className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>تاريخ الميلاد</Label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => { setBirthDate(e.target.value); setCalculated(false); }}
                max={new Date().toISOString().split('T')[0]}
                dir="ltr"
              />
            </div>
            <Button onClick={calculateAge} className="w-full bg-teal-600 hover:bg-teal-700">
              احسب عمرك
            </Button>

            {calculated && ageData && (
              <div className="space-y-4 mt-6">
                {/* Exact Age */}
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">عمرك الحالي</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-teal-700">{ageData.years}</span>
                      <p className="text-xs text-muted-foreground">سنة</p>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-emerald-700">{ageData.months}</span>
                      <p className="text-xs text-muted-foreground">شهر</p>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-green-700">{ageData.days}</span>
                      <p className="text-xs text-muted-foreground">يوم</p>
                    </div>
                  </div>
                </div>

                {/* Zodiac */}
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <span className="text-3xl">{ageData.zodiac.symbol}</span>
                  <p className="font-bold mt-1">برج {ageData.zodiac.name}</p>
                  <p className="text-xs text-muted-foreground">ولدت يوم {ageData.dayOfWeek}</p>
                </div>

                {/* Next Birthday */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-center">
                  <Gift className="h-6 w-6 mx-auto mb-1 text-amber-600" />
                  <p className="text-sm font-bold">عيد ميلادك القادم بعد</p>
                  <p className="text-2xl font-bold text-amber-700">{ageData.daysUntilBirthday} يوم</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-4">
          {calculated && ageData ? (
            <>
              {/* Time Breakdown */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    عمرك بالتفصيل
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{formatNumber(ageData.totalMonths)}</p>
                      <p className="text-xs text-muted-foreground">شهر</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{formatNumber(ageData.totalWeeks)}</p>
                      <p className="text-xs text-muted-foreground">أسبوع</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{formatNumber(ageData.totalDays)}</p>
                      <p className="text-xs text-muted-foreground">يوم</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{formatNumber(ageData.totalHours)}</p>
                      <p className="text-xs text-muted-foreground">ساعة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Life Statistics */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    إحصائيات حياتك
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">نبضات القلب</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(ageData.heartbeats)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💨</span>
                        <span className="text-sm">الأنفاس</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(ageData.breaths)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">😴</span>
                        <span className="text-sm">أيام النوم</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(ageData.sleeps)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🍽️</span>
                        <span className="text-sm">الوجبات</span>
                      </div>
                      <span className="text-sm font-bold">{formatNumber(ageData.meals)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Year Progress & Fun Fact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      تقدم السنة
                    </h3>
                    <Progress value={ageData.yearProgress} className="mb-2" />
                    <p className="text-center text-sm text-muted-foreground">{ageData.yearProgress.toFixed(1)}% من السنة</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      هل تعلم؟
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ageData.funFact}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center p-8">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-lg font-medium mb-2">أدخل تاريخ ميلادك</p>
                <p className="text-sm text-muted-foreground">اكتشف عمرك بالتفصيل وإحصائيات ممتعة عن حياتك</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6">
        <AdBanner slot="age-calculator-bottom" format="horizontal" />
      </div>
    </div>
  );
}
