'use client';

import { useState } from 'react';
import { Ruler, ArrowRightLeft, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';

interface UnitCategory {
  name: string;
  nameAr: string;
  units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
}

const categories: UnitCategory[] = [
  {
    name: 'length',
    nameAr: 'الطول',
    units: [
      { id: 'mm', name: 'مليمتر', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'cm', name: 'سنتيمتر', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'm', name: 'متر', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'كيلومتر', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'in', name: 'بوصة', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'ft', name: 'قدم', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'yd', name: 'ياردة', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'mi', name: 'ميل', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    ],
  },
  {
    name: 'weight',
    nameAr: 'الوزن',
    units: [
      { id: 'mg', name: 'ملليغرام', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'g', name: 'غرام', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'kg', name: 'كيلوغرام', toBase: (v) => v, fromBase: (v) => v },
      { id: 't', name: 'طن', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'oz', name: 'أونصة', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 'lb', name: 'رطل', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    ],
  },
  {
    name: 'temperature',
    nameAr: 'الحرارة',
    units: [
      { id: 'c', name: 'مئوية', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'فهرنهايت', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
      { id: 'k', name: 'كلفن', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: 'speed',
    nameAr: 'السرعة',
    units: [
      { id: 'ms', name: 'متر/ثانية', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kmh', name: 'كيلومتر/ساعة', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'ميل/ساعة', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'kn', name: 'عقدة', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
];

export function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  const currentCategory = categories.find((c) => c.name === category)!;
  const fromUnitObj = currentCategory.units.find((u) => u.id === fromUnit);
  const toUnitObj = currentCategory.units.find((u) => u.id === toUnit);

  const convert = (value: string, from: string, to: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || !fromUnitObj || !toUnitObj) {
      setToValue('');
      return;
    }
    const base = fromUnitObj.toBase(num);
    const result = toUnitObj.fromBase(base);
    setToValue(result.toPrecision(10).replace(/\.?0+$/, ''));
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const newCat = categories.find((c) => c.name === cat)!;
    setFromUnit(newCat.units[0].id);
    setToUnit(newCat.units[1]?.id || newCat.units[0].id);
    setFromValue('1');
    convert('1', newCat.units[0].id, newCat.units[1]?.id || newCat.units[0].id);
  };

  const swapUnits = () => {
    const tempFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempFrom);
    if (toValue) {
      setFromValue(toValue);
      convert(toValue, toUnit, tempFrom);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="محول الوحدات"
        description="حوّل بين وحدات الطول والوزن والحرارة والسرعة بسهولة"
        icon={<Ruler className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="p-6">
          {/* Category Tabs */}
          <Tabs value={category} onValueChange={handleCategoryChange}>
            <TabsList className="w-full grid grid-cols-4 mb-6">
              {categories.map((cat) => (
                <TabsTrigger key={cat.name} value={cat.name}>
                  {cat.nameAr}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.name} value={cat.name} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                  {/* From */}
                  <div className="space-y-3">
                    <Label>من</Label>
                    <Select value={fromUnit} onValueChange={(v) => { setFromUnit(v); convert(fromValue, v, toUnit); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cat.units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={fromValue}
                      onChange={(e) => {
                        setFromValue(e.target.value);
                        convert(e.target.value, fromUnit, toUnit);
                      }}
                      dir="ltr"
                      className="text-lg font-mono"
                    />
                  </div>

                  {/* Swap Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={swapUnits}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>

                  {/* To */}
                  <div className="space-y-3">
                    <Label>إلى</Label>
                    <Select value={toUnit} onValueChange={(v) => { setToUnit(v); convert(fromValue, fromUnit, v); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cat.units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      value={toValue}
                      readOnly
                      dir="ltr"
                      className="text-lg font-mono bg-muted"
                    />
                  </div>
                </div>

                {/* Quick conversions */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cat.units
                    .filter((u) => u.id !== fromUnit)
                    .slice(0, 4)
                    .map((unit) => {
                      const val = fromUnitObj && parseFloat(fromValue)
                        ? unit.fromBase(fromUnitObj.toBase(parseFloat(fromValue)))
                        : 0;
                      return (
                        <div
                          key={unit.id}
                          className="p-3 bg-muted rounded-lg text-center cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => { setToUnit(unit.id); convert(fromValue, fromUnit, unit.id); }}
                        >
                          <p className="text-xs text-muted-foreground">{unit.name}</p>
                          <p className="font-mono text-sm font-semibold">
                            {val ? val.toPrecision(6).replace(/\.?0+$/, '') : '0'}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6">
        <PremiumGate feature="وحدات مخصصة - أضف وحدات التحويل الخاصة بك">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">وحدات مخصصة</p>
                  <p className="text-xs text-muted-foreground">أضف وحدات التحويل الخاصة بك</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PremiumGate>
      </div>

      <div className="mt-6">
        <AdBanner slot="unit-tool-bottom" format="horizontal" />
      </div>
    </div>
  );
}
