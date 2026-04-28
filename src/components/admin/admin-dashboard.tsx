'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BarChart3,
  DollarSign,
  Mail,
  Megaphone,
  Settings,
  Lock,
  Crown,
  TrendingUp,
  Eye,
  MousePointerClick,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { ToolHeader } from '@/components/shared/tool-header';
import { databases, Query, COLLECTIONS, DATABASE_ID } from '@/lib/appwrite';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0d9488', '#059669', '#10b981', '#2dd4bf', '#34d399', '#6ee7b7'];

const toolUsageData = [
  { name: 'مولّد QR', uses: 1250 },
  { name: 'كلمات المرور', uses: 980 },
  { name: 'منسق JSON', uses: 870 },
  { name: 'مشفر Base64', uses: 650 },
  { name: 'منتقي الألوان', uses: 540 },
  { name: 'عداد النص', uses: 430 },
  { name: 'مولّد الهاش', uses: 380 },
  { name: 'أدوات PDF', uses: 320 },
  { name: 'مولّد CSS', uses: 290 },
  { name: 'محول الصور', uses: 250 },
];

const revenueData = [
  { month: 'يناير', revenue: 120 },
  { month: 'فبراير', revenue: 180 },
  { month: 'مارس', revenue: 220 },
  { month: 'أبريل', revenue: 310 },
  { month: 'مايو', revenue: 380 },
  { month: 'يونيو', revenue: 450 },
];

const subscriptionBreakdown = [
  { name: 'مجاني', value: 4200, color: '#0d9488' },
  { name: 'مميز', value: 680, color: '#059669' },
  { name: 'تجريبي', value: 320, color: '#2dd4bf' },
];

export function AdminDashboard() {
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 5200,
    premiumUsers: 680,
    toolUsage: 48500,
    revenue: 4520,
  });
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; plan: string; joined: string }>>([]);
  const [subscribers, setSubscribers] = useState<Array<{ email: string; date: string }>>([]);
  const [settings, setSettings] = useState({
    siteName: 'ToolBox Pro',
    adPlacement: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Try to load real data from Appwrite
      try {
        const usersRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [Query.limit(50)]);
        const mappedUsers = usersRes.documents.map(doc => ({
          id: doc.$id,
          name: doc.name || 'مستخدم',
          email: doc.email || '',
          plan: doc.plan || 'free',
          joined: doc.$createdAt ? new Date(doc.$createdAt).toLocaleDateString('ar') : '',
        }));
        if (mappedUsers.length > 0) setUsers(mappedUsers);
        setStats(prev => ({ ...prev, totalUsers: usersRes.total }));
      } catch { /* collection might not exist yet */ }

      try {
        const subRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NEWSLETTER, [Query.limit(50)]);
        const mappedSubs = subRes.documents.map(doc => ({
          email: doc.email || '',
          date: doc.$createdAt ? new Date(doc.$createdAt).toLocaleDateString('ar') : '',
        }));
        if (mappedSubs.length > 0) setSubscribers(mappedSubs);
      } catch { /* collection might not exist yet */ }
    } finally {
      setIsLoading(false);
    }
  };

  // Admin check
  const isAdmin = user?.email === 'yayass3r@gmail.com';

  if (!isAdmin) {
    return (
      <div className="animate-fade-in">
        <ToolHeader
          title="لوحة الإدارة"
          description="الوصول مقيّد للمسؤولين فقط"
          icon={<Shield className="h-5 w-5" />}
        />
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h2 className="text-xl font-bold mb-2">وصول مقيّد</h2>
            <p className="text-muted-foreground mb-4">
              هذه الصفحة متاحة فقط للمسؤولين. يرجى تسجيل الدخول بحساب المسؤول.
            </p>
            <Badge variant="secondary">yayass3r@gmail.com</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="لوحة الإدارة"
        description="إدارة شاملة لموقع ToolBox Pro"
        icon={<Shield className="h-5 w-5" />}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 ml-1" />
                +12%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString('ar')}</p>
            <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Crown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 ml-1" />
                +8%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{stats.premiumUsers.toLocaleString('ar')}</p>
            <p className="text-xs text-muted-foreground">مستخدمين مميزين</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 ml-1" />
                +22%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{stats.toolUsage.toLocaleString('ar')}</p>
            <p className="text-xs text-muted-foreground">استخدام الأدوات</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 ml-1" />
                +18%
              </Badge>
            </div>
            <p className="text-2xl font-bold">${stats.revenue.toLocaleString('ar')}</p>
            <p className="text-xs text-muted-foreground">إيرادات تقديرية</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="analytics" className="flex-1 min-w-[100px]">
            <BarChart3 className="h-4 w-4 ml-1" />
            التحليلات
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 min-w-[100px]">
            <Users className="h-4 w-4 ml-1" />
            المستخدمين
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex-1 min-w-[100px]">
            <DollarSign className="h-4 w-4 ml-1" />
            الإيرادات
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex-1 min-w-[100px]">
            <Mail className="h-4 w-4 ml-1" />
            النشرة البريدية
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex-1 min-w-[100px]">
            <Megaphone className="h-4 w-4 ml-1" />
            الإعلانات
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 min-w-[100px]">
            <Settings className="h-4 w-4 ml-1" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">استخدام الأدوات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={toolUsageData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="uses" fill="#0d9488" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">أدوات الأكثر شعبية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {toolUsageData.slice(0, 6).map((tool, idx) => (
                    <div key={tool.name} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">#{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{tool.name}</span>
                          <span className="text-xs text-muted-foreground">{tool.uses.toLocaleString('ar')} استخدام</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-teal-500 to-emerald-500"
                            style={{ width: `${(tool.uses / toolUsageData[0].uses) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">إدارة المستخدمين</CardTitle>
                <Badge variant="secondary">{users.length || stats.totalUsers} مستخدم</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد</TableHead>
                        <TableHead>الخطة</TableHead>
                        <TableHead>تاريخ الانضمام</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell dir="ltr" className="text-sm">{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.plan === 'premium' ? 'default' : 'secondary'}>
                              {u.plan === 'premium' ? 'مميز' : 'مجاني'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{u.joined}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setUsers(prev => prev.map(usr =>
                                    usr.id === u.id ? { ...usr, plan: 'premium' } : usr
                                  ));
                                }}
                              >
                                <ChevronUp className="h-3 w-3 ml-1" />
                                ترقية
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setUsers(prev => prev.map(usr =>
                                    usr.id === u.id ? { ...usr, plan: 'free' } : usr
                                  ));
                                }}
                              >
                                <ChevronDown className="h-3 w-3 ml-1" />
                                تخفيض
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    لم يتم العثور على بيانات مستخدمين من Appwrite بعد. تأكد من إنشاء المجموعات.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    إجمالي المستخدمين التقديري: {stats.totalUsers.toLocaleString('ar')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">الإيرادات الشهرية ($)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">توزيع الاشتراكات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {subscriptionBreakdown.map((entry, idx) => (
                          <Cell key={entry.name} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {subscriptionBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.name} ({item.value.toLocaleString('ar')})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ملخص الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">اشتراكات شهرية</p>
                  <p className="text-lg font-bold">${(stats.premiumUsers * 9.99 * 0.7).toFixed(0)}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">إعلانات تقديرية</p>
                  <p className="text-lg font-bold">$1,200</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">روابط شركات</p>
                  <p className="text-lg font-bold">$350</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                  <p className="text-lg font-bold gradient-text">${(stats.premiumUsers * 9.99 * 0.7 + 1200 + 350).toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newsletter Tab */}
        <TabsContent value="newsletter" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">المشتركون في النشرة البريدية</CardTitle>
                <Badge variant="secondary">{subscribers.length} مشترك</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {subscribers.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>تاريخ الاشتراك</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((sub, idx) => (
                        <TableRow key={idx}>
                          <TableCell dir="ltr">{sub.email}</TableCell>
                          <TableCell>{sub.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    لا يوجد مشتركون بعد. ستظهر البيانات من Appwrite عند توفرها.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">أداء Google AdSense</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Eye className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">مشاهدات الصفحة</p>
                  <p className="text-lg font-bold">125K</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <MousePointerClick className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">نقرات الإعلانات</p>
                  <p className="text-lg font-bold">2.4K</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <BarChart3 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-lg font-bold">1.92%</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">RPM تقديري</p>
                  <p className="text-lg font-bold">$9.60</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="text-center py-4">
                <Megaphone className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground mb-2">
                  ربط Google AdSense لعرض بيانات الأداء الفعلية
                </p>
                <Badge variant="outline">في انتظار التفعيل</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">إعدادات الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>اسم الموقع</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">عرض الإعلانات</p>
                  <p className="text-sm text-muted-foreground">تفعيل أو تعطيل مساحات الإعلانات</p>
                </div>
                <Switch
                  checked={settings.adPlacement}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, adPlacement: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">وضع الصيانة</p>
                  <p className="text-sm text-muted-foreground">تعطيل الموقع مؤقتاً للصيانة</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>

              <Separator />

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
