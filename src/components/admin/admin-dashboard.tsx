'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Users, BarChart3, DollarSign, Mail, Megaphone, Settings,
  Lock, Crown, TrendingUp, Eye, MousePointerClick, ArrowRight,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Menu, X,
  FileText, Activity, Heart, Zap, Globe, Server, Bell, Plus,
  Download, Trash2, Edit3, Search, RefreshCw, CheckCircle,
  AlertTriangle, Clock, CalendarDays, PieChart, LineChart,
  LayoutDashboard, Wrench, CreditCard, Send, FileBarChart,
  Cog, UserPlus, Filter, MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { databases, Query, COLLECTIONS, DATABASE_ID } from '@/lib/appwrite';
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line, CartesianGrid, Legend,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#0d9488', '#059669', '#10b981', '#2dd4bf', '#34d399', '#6ee7b7', '#14b8a6', '#0f766e'];

type Section = 'overview' | 'users' | 'tools' | 'revenue' | 'ads' | 'newsletter' | 'reports' | 'settings';

const sidebarItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'users', label: 'إدارة المستخدمين', icon: <Users className="h-5 w-5" /> },
  { id: 'tools', label: 'إدارة الأدوات', icon: <Wrench className="h-5 w-5" /> },
  { id: 'revenue', label: 'الإيرادات والاشتراكات', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'ads', label: 'الإعلانات', icon: <Megaphone className="h-5 w-5" /> },
  { id: 'newsletter', label: 'النشرة البريدية', icon: <Mail className="h-5 w-5" /> },
  { id: 'reports', label: 'التقارير', icon: <FileBarChart className="h-5 w-5" /> },
  { id: 'settings', label: 'الإعدادات', icon: <Cog className="h-5 w-5" /> },
];

// Sample data
const toolUsageData = [
  { name: 'مولّد QR', uses: 1250, revenue: 45 },
  { name: 'كلمات المرور', uses: 980, revenue: 30 },
  { name: 'منسق JSON', uses: 870, revenue: 25 },
  { name: 'مشفر Base64', uses: 650, revenue: 20 },
  { name: 'السيرة الذاتية', uses: 580, revenue: 120 },
  { name: 'الفواتير', uses: 450, revenue: 95 },
  { name: 'مقص الروابط', uses: 420, revenue: 15 },
  { name: 'مغير الصور', uses: 380, revenue: 18 },
  { name: 'أدوات PDF', uses: 320, revenue: 65 },
  { name: 'مولّد CSS', uses: 290, revenue: 22 },
];

const revenueData = [
  { month: 'يناير', revenue: 1200, subscriptions: 840, ads: 300, affiliates: 60 },
  { month: 'فبراير', revenue: 1800, subscriptions: 1260, ads: 450, affiliates: 90 },
  { month: 'مارس', revenue: 2200, subscriptions: 1540, ads: 550, affiliates: 110 },
  { month: 'أبريل', revenue: 3100, subscriptions: 2170, ads: 775, affiliates: 155 },
  { month: 'مايو', revenue: 3800, subscriptions: 2660, ads: 950, affiliates: 190 },
  { month: 'يونيو', revenue: 4500, subscriptions: 3150, ads: 1125, affiliates: 225 },
  { month: 'يوليو', revenue: 5200, subscriptions: 3640, ads: 1300, affiliates: 260 },
  { month: 'أغسطس', revenue: 4800, subscriptions: 3360, ads: 1200, affiliates: 240 },
];

const userGrowthData = [
  { month: 'يناير', users: 3200 },
  { month: 'فبراير', users: 3800 },
  { month: 'مارس', users: 4100 },
  { month: 'أبريل', users: 4600 },
  { month: 'مايو', users: 5200 },
  { month: 'يونيو', users: 5800 },
  { month: 'يوليو', users: 6500 },
  { month: 'أغسطس', users: 7200 },
];

const subscriptionBreakdown = [
  { name: 'مجاني', value: 5800, color: '#0d9488' },
  { name: 'مميز', value: 980, color: '#059669' },
  { name: 'تجريبي', value: 420, color: '#2dd4bf' },
];

const sampleUsers = [
  { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', plan: 'premium', joined: '2024/01/15', lastActive: 'منذ ساعة', tools: 45 },
  { id: '2', name: 'سارة علي', email: 'sara@example.com', plan: 'free', joined: '2024/02/20', lastActive: 'منذ 3 ساعات', tools: 12 },
  { id: '3', name: 'خالد حسن', email: 'khaled@example.com', plan: 'premium', joined: '2024/03/10', lastActive: 'منذ يوم', tools: 67 },
  { id: '4', name: 'نورة سعيد', email: 'noura@example.com', plan: 'free', joined: '2024/04/05', lastActive: 'منذ ساعتين', tools: 8 },
  { id: '5', name: 'عمر يوسف', email: 'omar@example.com', plan: 'trial', joined: '2024/05/18', lastActive: 'منذ 30 دقيقة', tools: 23 },
  { id: '6', name: 'فاطمة أحمد', email: 'fatima@example.com', plan: 'premium', joined: '2024/06/01', lastActive: 'منذ 5 ساعات', tools: 89 },
  { id: '7', name: 'محمد عبدالله', email: 'moh@example.com', plan: 'free', joined: '2024/06/15', lastActive: 'منذ يومين', tools: 3 },
  { id: '8', name: 'ريم خالد', email: 'reem@example.com', plan: 'trial', joined: '2024/07/01', lastActive: 'منذ ساعة', tools: 15 },
];

const allTools = [
  { id: 'qr-generator', name: 'مولّد QR', active: true, uses: 1250, revenue: 45, category: 'مجاني' },
  { id: 'password-generator', name: 'مولّد كلمات المرور', active: true, uses: 980, revenue: 30, category: 'مجاني' },
  { id: 'json-formatter', name: 'منسق JSON', active: true, uses: 870, revenue: 25, category: 'مجاني' },
  { id: 'resume-builder', name: 'منشئ السيرة الذاتية', active: true, uses: 580, revenue: 120, category: 'مميز' },
  { id: 'invoice-generator', name: 'منشئ الفواتير', active: true, uses: 450, revenue: 95, category: 'مميز' },
  { id: 'pdf-tools', name: 'أدوات PDF', active: true, uses: 320, revenue: 65, category: 'مميز' },
  { id: 'link-shortener', name: 'مقص الروابط', active: true, uses: 420, revenue: 15, category: 'مجاني' },
  { id: 'image-resizer', name: 'مغير حجم الصور', active: true, uses: 380, revenue: 18, category: 'مجاني' },
  { id: 'video-to-gif', name: 'محول فيديو إلى GIF', active: true, uses: 220, revenue: 35, category: 'مجاني' },
  { id: 'timer-stopwatch', name: 'عداد ومؤقت', active: true, uses: 310, revenue: 8, category: 'مجاني' },
  { id: 'age-calculator', name: 'حاسبة العمر', active: true, uses: 290, revenue: 6, category: 'مجاني' },
  { id: 'word-cloud', name: 'سحابة الكلمات', active: true, uses: 180, revenue: 12, category: 'مجاني' },
  { id: 'seo-analyzer', name: 'محلل SEO', active: false, uses: 150, revenue: 40, category: 'مميز' },
  { id: 'screenshot-tool', name: 'لقطات الشاشة', active: true, uses: 260, revenue: 22, category: 'مميز' },
  { id: 'css-generator', name: 'مولّد CSS', active: true, uses: 290, revenue: 22, category: 'مجاني' },
  { id: 'markdown-editor', name: 'محرر Markdown', active: true, uses: 210, revenue: 18, category: 'مميز' },
];

const recentTransactions = [
  { id: '1', user: 'أحمد محمد', type: 'اشتراك', amount: '$9.99', date: '2024/08/15', status: 'مكتمل' },
  { id: '2', user: 'خالد حسن', type: 'تجديد', amount: '$9.99', date: '2024/08/14', status: 'مكتمل' },
  { id: '3', user: 'فاطمة أحمد', type: 'اشتراك', amount: '$9.99', date: '2024/08/13', status: 'مكتمل' },
  { id: '4', user: 'عمر يوسف', type: 'إلغاء', amount: '$0.00', date: '2024/08/12', status: 'ملغى' },
  { id: '5', user: 'ريم خالد', type: 'تجربة', amount: '$0.00', date: '2024/08/11', status: 'نشط' },
];

const adSlots = [
  { id: 'home-top', name: 'الرئيسية - أعلى', active: true, impressions: '45K', clicks: 890, revenue: '$180', ctr: '1.98%' },
  { id: 'home-middle', name: 'الرئيسية - وسط', active: true, impressions: '38K', clicks: 720, revenue: '$145', ctr: '1.89%' },
  { id: 'home-bottom', name: 'الرئيسية - أسفل', active: false, impressions: '22K', clicks: 340, revenue: '$68', ctr: '1.55%' },
  { id: 'tool-bottom', name: 'الأدوات - أسفل', active: true, impressions: '85K', clicks: 1700, revenue: '$340', ctr: '2.00%' },
  { id: 'tool-sidebar', name: 'الأدوات - جانبي', active: true, impressions: '32K', clicks: 580, revenue: '$116', ctr: '1.81%' },
];

const recentActivities = [
  { icon: <UserPlus className="h-4 w-4 text-teal-600" />, text: 'مستخدم جديد: أحمد محمد', time: 'منذ 5 دقائق' },
  { icon: <Crown className="h-4 w-4 text-amber-600" />, text: 'ترقية اشتراك: سارة علي', time: 'منذ 15 دقيقة' },
  { icon: <Zap className="h-4 w-4 text-green-600" />, text: '1,250 استخدام لمولّد QR', time: 'منذ ساعة' },
  { icon: <DollarSign className="h-4 w-4 text-emerald-600" />, text: 'إيراد جديد: $9.99', time: 'منذ ساعتين' },
  { icon: <Mail className="h-4 w-4 text-blue-600" />, text: '50 مشترك جديد في النشرة', time: 'منذ 3 ساعات' },
  { icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, text: 'ارتفاع استخدام الخادم: 78%', time: 'منذ 4 ساعات' },
  { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'نسخة احتياطية مكتملة', time: 'منذ 6 ساعات' },
  { icon: <Users className="h-4 w-4 text-teal-600" />, text: 'تجاوز 7000 مستخدم', time: 'منذ يوم' },
  { icon: <Megaphone className="h-4 w-4 text-purple-600" />, text: 'تحديث إعلانات الصفحة الرئيسية', time: 'منذ يومين' },
  { icon: <Wrench className="h-4 w-4 text-gray-600" />, text: 'أداة جديدة: حاسبة العمر', time: 'منذ 3 أيام' },
];

function AnimatedCounter({ target, duration = 1500, prefix = '', suffix = '' }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = 0;
    const increment = (target - start) / (duration / 16);
    let value = start;
    const timer = setInterval(() => {
      value += increment;
      if (value >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(value));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{prefix}{current.toLocaleString('ar')}{suffix}</span>;
}

export function AdminDashboard() {
  const { user } = useAppStore();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(sampleUsers);
  const [tools, setTools] = useState(allTools);
  const [subscribers, setSubscribers] = useState<Array<{ email: string; date: string }>>([
    { email: 'ahmed@example.com', date: '2024/08/15' },
    { email: 'sara@example.com', date: '2024/08/14' },
    { email: 'khaled@example.com', date: '2024/08/13' },
    { email: 'noura@example.com', date: '2024/08/12' },
    { email: 'omar@example.com', date: '2024/08/11' },
  ]);
  const [settings, setSettings] = useState({
    siteName: 'ToolBox Pro',
    siteDescription: 'مجموعة أدوات أونلاين مجانية',
    metaTitle: 'ToolBox Pro - أدوات أونلاين مجانية',
    metaDescription: 'أدوات مجانية وسريعة تعمل في المتصفح',
    metaKeywords: 'أدوات, مجانية, أونلاين, QR, PDF',
    googleAnalyticsId: '',
    adsenseClientId: '',
    stripePublicKey: '',
    stripeSecretKey: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    maintenanceMode: false,
    adPlacement: true,
    adHomeTop: true,
    adHomeMiddle: true,
    adHomeBottom: false,
    adToolBottom: true,
    adToolSidebar: true,
  });
  const [liveVisitors, setLiveVisitors] = useState(42);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const usersRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [Query.limit(50)]);
        if (usersRes.documents.length > 0) {
          setUsers(usersRes.documents.map((doc) => ({
            id: doc.$id,
            name: doc.name || 'مستخدم',
            email: doc.email || '',
            plan: doc.plan || 'free',
            joined: doc.$createdAt ? new Date(doc.$createdAt).toLocaleDateString('ar') : '',
            lastActive: 'منذ ساعة',
            tools: Math.floor(Math.random() * 100),
          })));
        }
      } catch { /* collection not ready */ }
      try {
        const subRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NEWSLETTER, [Query.limit(50)]);
        if (subRes.documents.length > 0) {
          setSubscribers(subRes.documents.map((doc) => ({
            email: doc.email || '',
            date: doc.$createdAt ? new Date(doc.$createdAt).toLocaleDateString('ar') : '',
          })));
        }
      } catch { /* collection not ready */ }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Simulate live visitors
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => Math.max(5, prev + Math.floor(Math.random() * 7) - 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isAdmin = user?.email === 'yayass3r@gmail.com';

  if (!isAdmin) {
    return (
      <div className="animate-fade-in">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h2 className="text-xl font-bold mb-2">وصول مقيّد</h2>
            <p className="text-muted-foreground mb-4">هذه الصفحة متاحة فقط للمسؤولين</p>
            <Badge variant="secondary">yayass3r@gmail.com</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    u.name.includes(searchQuery) || u.email.includes(searchQuery)
  );

  const exportCSV = (data: Record<string, unknown>[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'تم التصدير', description: `تم تصدير ${filename}.csv` });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection liveVisitors={liveVisitors} />;
      case 'users':
        return <UsersSection users={filteredUsers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setUsers={setUsers} exportCSV={exportCSV} />;
      case 'tools':
        return <ToolsSection tools={tools} setTools={setTools} />;
      case 'revenue':
        return <RevenueSection />;
      case 'ads':
        return <AdsSection />;
      case 'newsletter':
        return <NewsletterSection subscribers={subscribers} subject={newsletterSubject} setSubject={setNewsletterSubject} body={newsletterBody} setBody={setNewsletterBody} exportCSV={exportCSV} />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection settings={settings} setSettings={setSettings} />;
      default:
        return <OverviewSection liveVisitors={liveVisitors} />;
    }
  };

  return (
    <div className="animate-fade-in flex gap-0 -mx-4 -my-6" dir="rtl">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-64 bg-gray-900 text-white
        transform transition-transform duration-200 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${!sidebarOpen ? 'lg:w-16' : 'lg:w-64'}
        flex flex-col
      `}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <h2 className="font-bold text-lg">لوحة الإدارة</h2>}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => {
              if (window.innerWidth < 1024) setMobileSidebarOpen(false);
              else setSidebarOpen(!sidebarOpen);
            }}
          >
            {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-sm font-bold">م</div>
              <div>
                <p className="text-sm font-medium">المسؤول</p>
                <p className="text-xs text-gray-400" dir="ltr">{user?.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">
                {sidebarItems.find((i) => i.id === activeSection)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Activity className="h-3 w-3 ml-1" />
              {liveVisitors} متصل
            </Badge>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 ml-1" />
              يعمل
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : (
            renderSection()
          )}
        </div>
      </main>
    </div>
  );
}

// ========== OVERVIEW SECTION ==========
function OverviewSection({ liveVisitors }: { liveVisitors: number }) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Users className="h-5 w-5" />, label: 'إجمالي المستخدمين', value: 7200, trend: '+12%', color: 'bg-teal-100 dark:bg-teal-900/30', textColor: 'text-teal-600 dark:text-teal-400' },
          { icon: <Crown className="h-5 w-5" />, label: 'مستخدمين مميزين', value: 980, trend: '+8%', color: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-600 dark:text-emerald-400' },
          { icon: <Zap className="h-5 w-5" />, label: 'استخدام الأدوات', value: 48500, trend: '+22%', color: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400' },
          { icon: <DollarSign className="h-5 w-5" />, label: 'الإيرادات ($)', value: 4800, trend: '+18%', color: 'bg-cyan-100 dark:bg-cyan-900/30', textColor: 'text-cyan-600 dark:text-cyan-400' },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center ${stat.textColor}`}>
                  {stat.icon}
                </div>
                <Badge variant="secondary" className="text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 ml-1" />{stat.trend}
                </Badge>
              </div>
              <p className="text-2xl font-bold"><AnimatedCounter target={stat.value} /></p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tool Usage Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">استخدام الأدوات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={toolUsageData.slice(0, 8)} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="uses" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Live Visitors */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-sm">الزوار المباشرون</h3>
              </div>
              <div className="text-center py-4">
                <span className="text-4xl font-bold text-green-600">{liveVisitors}</span>
                <p className="text-sm text-muted-foreground mt-1">متصل الآن</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Server className="h-3 w-3" />
                <span>حالة الخادم: <span className="text-green-600 font-medium">يعمل</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Globe className="h-3 w-3" />
                <span>وقت التشغيل: <span className="font-medium">99.9%</span></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-sm mb-3">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs h-9">
                  <UserPlus className="h-3 w-3 ml-1" /> إضافة مستخدم
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-9">
                  <Mail className="h-3 w-3 ml-1" /> إرسال نشرة
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-9">
                  <Download className="h-3 w-3 ml-1" /> تصدير تقرير
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-9">
                  <RefreshCw className="h-3 w-3 ml-1" /> تحديث البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5">{activity.icon}</div>
                <div className="flex-1">
                  <span>{activity.text}</span>
                  <span className="text-xs text-muted-foreground mr-2">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== USERS SECTION ==========
function UsersSection({ users, searchQuery, setSearchQuery, setUsers, exportCSV }: {
  users: typeof sampleUsers;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setUsers: React.Dispatch<React.SetStateAction<typeof sampleUsers>>;
  exportCSV: (data: Record<string, unknown>[], filename: string) => void;
}) {
  const { toast } = useToast();
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.includes(searchQuery) || u.email.includes(searchQuery);
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{users.filter((u) => u.plan === 'premium').length}</p>
            <p className="text-xs text-muted-foreground">مميز</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{users.filter((u) => u.plan === 'free').length}</p>
            <p className="text-xs text-muted-foreground">مجاني</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{users.filter((u) => u.plan === 'trial').length}</p>
            <p className="text-xs text-muted-foreground">تجريبي</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث..." className="pr-8" />
              </div>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="free">مجاني</SelectItem>
                  <SelectItem value="premium">مميز</SelectItem>
                  <SelectItem value="trial">تجريبي</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => exportCSV(users as unknown as Record<string, unknown>[], 'users')}>
                <Download className="h-4 w-4 ml-1" /> CSV
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد</TableHead>
                    <TableHead>الخطة</TableHead>
                    <TableHead>نشط منذ</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell dir="ltr" className="text-sm">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.plan === 'premium' ? 'default' : u.plan === 'trial' ? 'secondary' : 'outline'}>
                          {u.plan === 'premium' ? 'مميز' : u.plan === 'trial' ? 'تجريبي' : 'مجاني'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{u.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => {
                            setUsers((prev) => prev.map((usr) => usr.id === u.id ? { ...usr, plan: 'premium' } : usr));
                            toast({ title: 'تمت الترقية' });
                          }}>
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => {
                            setUsers((prev) => prev.map((usr) => usr.id === u.id ? { ...usr, plan: 'free' } : usr));
                            toast({ title: 'تم التخفيض' });
                          }}>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 text-xs px-2 text-red-600">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف المستخدم</AlertDialogTitle>
                                <AlertDialogDescription>هل أنت متأكد من حذف {u.name}؟</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                  setUsers((prev) => prev.filter((usr) => usr.id !== u.id));
                                  toast({ title: 'تم الحذف' });
                                }}>حذف</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">توزيع الخطط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={subscriptionBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {subscriptionBreakdown.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx]} />)}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">نمو المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#0d9488" strokeWidth={2} dot={false} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ========== TOOLS SECTION ==========
function ToolsSection({ tools, setTools }: {
  tools: typeof allTools;
  setTools: React.Dispatch<React.SetStateAction<typeof allTools>>;
}) {
  const [sortBy, setSortBy] = useState<'name' | 'uses' | 'revenue'>('uses');
  const { toast } = useToast();

  const sortedTools = [...tools].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'ar');
    if (sortBy === 'uses') return b.uses - a.uses;
    return b.revenue - a.revenue;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm">ترتيب حسب:</Label>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'uses' | 'revenue')}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="uses">الاستخدام</SelectItem>
              <SelectItem value="revenue">الإيراد</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary">{tools.length} أداة</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedTools.map((tool) => (
          <Card key={tool.id} className={`transition-all ${!tool.active ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm">{tool.name}</h3>
                  <Badge variant={tool.category === 'مميز' ? 'default' : 'outline'} className="text-[10px] mt-1">
                    {tool.category}
                  </Badge>
                </div>
                <Switch
                  checked={tool.active}
                  onCheckedChange={(checked) => {
                    setTools(tools.map((t) => t.id === tool.id ? { ...t, active: checked } : t));
                    toast({ title: checked ? 'تم التفعيل' : 'تم التعطيل', description: tool.name });
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div className="bg-muted/50 rounded p-1.5">
                  <p className="text-xs text-muted-foreground">استخدام</p>
                  <p className="text-sm font-bold">{tool.uses.toLocaleString()}</p>
                </div>
                <div className="bg-muted/50 rounded p-1.5">
                  <p className="text-xs text-muted-foreground">إيراد</p>
                  <p className="text-sm font-bold">${tool.revenue}</p>
                </div>
                <div className="bg-muted/50 rounded p-1.5">
                  <p className="text-xs text-muted-foreground">الحالة</p>
                  <p className={`text-sm font-bold ${tool.active ? 'text-green-600' : 'text-red-500'}`}>
                    {tool.active ? 'نشط' : 'معطل'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ========== REVENUE SECTION ==========
function RevenueSection() {
  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">MRR</p>
            <p className="text-xl font-bold text-teal-700">$3,640</p>
            <Badge variant="secondary" className="text-xs text-green-600">+15%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">معدل التخلي</p>
            <p className="text-xl font-bold text-red-600">3.2%</p>
            <Badge variant="secondary" className="text-xs text-green-600">-0.5%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">LTV</p>
            <p className="text-xl font-bold">$89</p>
            <Badge variant="secondary" className="text-xs text-green-600">+8%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">ARPU</p>
            <p className="text-xl font-bold">$4.20</p>
            <Badge variant="secondary" className="text-xs text-green-600">+5%</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={revenueData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="subscriptions" stackId="a" fill="#0d9488" name="اشتراكات" />
                  <Bar dataKey="ads" stackId="a" fill="#059669" name="إعلانات" />
                  <Bar dataKey="affiliates" stackId="a" fill="#2dd4bf" name="شركات" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">توزيع الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={subscriptionBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {subscriptionBreakdown.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx]} />)}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">اشتراكات</p>
                <p className="font-bold text-sm">$3,150</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">إعلانات</p>
                <p className="font-bold text-sm">$1,125</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">شركات</p>
                <p className="font-bold text-sm">$225</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">آخر المعاملات</CardTitle>
            <Badge variant="outline" className="text-xs">Stripe: متصل</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-48 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm">{t.user}</TableCell>
                    <TableCell className="text-sm">{t.type}</TableCell>
                    <TableCell className="text-sm font-medium">{t.amount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'مكتمل' ? 'default' : t.status === 'ملغى' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== ADS SECTION ==========
function AdsSection() {
  const { toast } = useToast();
  const [slots, setSlots] = useState(adSlots);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">مشاهدات</p>
            <p className="text-xl font-bold">222K</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MousePointerClick className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">نقرات</p>
            <p className="text-xl font-bold">4.2K</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">CTR</p>
            <p className="text-xl font-bold">1.89%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">إجمالي الإيراد</p>
            <p className="text-xl font-bold">$849</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">إدارة مواضع الإعلانات</CardTitle>
            <Badge variant="outline" className="text-xs">AdSense: في انتظار التفعيل</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموضع</TableHead>
                  <TableHead>المشاهدات</TableHead>
                  <TableHead>النقرات</TableHead>
                  <TableHead>الإيراد</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>تفعيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="text-sm font-medium">{slot.name}</TableCell>
                    <TableCell className="text-sm">{slot.impressions}</TableCell>
                    <TableCell className="text-sm">{slot.clicks}</TableCell>
                    <TableCell className="text-sm font-medium">{slot.revenue}</TableCell>
                    <TableCell className="text-sm">{slot.ctr}</TableCell>
                    <TableCell>
                      <Switch
                        checked={slot.active}
                        onCheckedChange={(checked) => {
                          setSlots(slots.map((s) => s.id === slot.id ? { ...s, active: checked } : s));
                          toast({ title: checked ? 'تم التفعيل' : 'تم التعطيل' });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold text-sm mb-3">معاينة مواضع الإعلانات</h3>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="h-8 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground">شريط التنقل</div>
            <div className={`h-12 border border-dashed rounded flex items-center justify-center text-xs ${slots[0]?.active ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : 'bg-muted/30 text-muted-foreground'}`}>
              📢 إعلان أعلى الصفحة {slots[0]?.active ? '(نشط)' : '(معطل)'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-20 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground">محتوى</div>
              <div className="h-20 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground">محتوى</div>
              <div className={`h-20 border border-dashed rounded flex items-center justify-center text-xs ${slots[4]?.active ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : 'bg-muted/30 text-muted-foreground'}`}>
                📢 جانبي {slots[4]?.active ? '(نشط)' : '(معطل)'}
              </div>
            </div>
            <div className={`h-12 border border-dashed rounded flex items-center justify-center text-xs ${slots[1]?.active ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : 'bg-muted/30 text-muted-foreground'}`}>
              📢 إعلان وسط الصفحة {slots[1]?.active ? '(نشط)' : '(معطل)'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== NEWSLETTER SECTION ==========
function NewsletterSection({ subscribers, subject, setSubject, body, setBody, exportCSV }: {
  subscribers: Array<{ email: string; date: string }>;
  subject: string;
  setSubject: (s: string) => void;
  body: string;
  setBody: (b: string) => void;
  exportCSV: (data: Record<string, unknown>[], filename: string) => void;
}) {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">المشتركون</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{subscribers.length} مشترك</Badge>
                <Button size="sm" variant="outline" onClick={() => exportCSV(subscribers as unknown as Record<string, unknown>[], 'subscribers')}>
                  <Download className="h-3 w-3 ml-1" /> CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>البريد</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub, idx) => (
                    <TableRow key={idx}>
                      <TableCell dir="ltr" className="text-sm">{sub.email}</TableCell>
                      <TableCell className="text-sm">{sub.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">نمو المشتركين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={[
                  { month: 'يناير', subs: 120 },
                  { month: 'فبراير', subs: 180 },
                  { month: 'مارس', subs: 240 },
                  { month: 'أبريل', subs: 350 },
                  { month: 'مايو', subs: 420 },
                  { month: 'يونيو', subs: 510 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="subs" stroke="#0d9488" strokeWidth={2} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">إنشاء نشرة بريدية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الموضوع</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع النشرة البريدية..." />
          </div>
          <div className="space-y-2">
            <Label>المحتوى</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="اكتب محتوى النشرة..." rows={6} />
          </div>
          <div className="flex gap-2">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => toast({ title: 'تم الإرسال (تجريبي)', description: `تم إرسال النشرة إلى ${subscribers.length} مشترك` })}>
              <Send className="h-4 w-4 ml-1" /> إرسال للجميع
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'تم إرسال اختباري', description: 'تم إرسال نسخة اختبارية' })}>
              إرسال اختباري
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== REPORTS SECTION ==========
function ReportsSection() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const weeklyComparison = [
    { metric: 'مستخدمين جدد', thisWeek: 85, lastWeek: 72, change: '+18%' },
    { metric: 'استخدام الأدوات', thisWeek: 5200, lastWeek: 4300, change: '+21%' },
    { metric: 'إيرادات', thisWeek: '$1,200', lastWeek: '$980', change: '+22%' },
    { metric: 'إلغاءات', thisWeek: 3, lastWeek: 5, change: '-40%' },
    { metric: 'مشتركين النشرة', thisWeek: 28, lastWeek: 15, change: '+87%' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <Label className="text-xs">من</Label>
              <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} dir="ltr" className="w-40" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">إلى</Label>
              <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} dir="ltr" className="w-40" />
            </div>
            <Button className="mt-5 bg-teal-600 hover:bg-teal-700" onClick={() => toast({ title: 'تم إنشاء التقرير' })}>
              <FileBarChart className="h-4 w-4 ml-1" /> إنشاء تقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">مقارنة هذا الأسبوع vs الأسبوع الماضي</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المقياس</TableHead>
                <TableHead>هذا الأسبوع</TableHead>
                <TableHead>الأسبوع الماضي</TableHead>
                <TableHead>التغير</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyComparison.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{typeof row.thisWeek === 'number' ? row.thisWeek.toLocaleString() : row.thisWeek}</TableCell>
                  <TableCell>{typeof row.lastWeek === 'number' ? row.lastWeek.toLocaleString() : row.lastWeek}</TableCell>
                  <TableCell>
                    <Badge variant={row.change.startsWith('+') ? 'default' : 'secondary'} className={`text-xs ${row.change.startsWith('-') ? 'text-green-600' : ''}`}>
                      {row.change}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => toast({ title: 'تصدير PDF', description: 'جارٍ إنشاء تقرير PDF...' })}>
          <FileText className="h-4 w-4 ml-1" /> تصدير PDF
        </Button>
        <Button variant="outline" onClick={() => toast({ title: 'تصدير CSV' })}>
          <Download className="h-4 w-4 ml-1" /> تصدير CSV
        </Button>
      </div>
    </div>
  );
}

// ========== SETTINGS SECTION ==========
function SettingsSection({ settings, setSettings }: {
  settings: Record<string, unknown>;
  setSettings: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}) {
  const { toast } = useToast();
  const s = settings as Record<string, string | boolean>;
  const set = (key: string, value: string | boolean) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      {/* Site Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">إعدادات الموقع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم الموقع</Label>
              <Input value={s.siteName as string} onChange={(e) => set('siteName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>وصف الموقع</Label>
              <Input value={s.siteDescription as string} onChange={(e) => set('siteDescription', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">إعدادات SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان الصفحة (Meta Title)</Label>
            <Input value={s.metaTitle as string} onChange={(e) => set('metaTitle', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>وصف الصفحة (Meta Description)</Label>
            <Textarea value={s.metaDescription as string} onChange={(e) => set('metaDescription', e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>الكلمات المفتاحية</Label>
            <Input value={s.metaKeywords as string} onChange={(e) => set('metaKeywords', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">التكاملات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Google Analytics ID</Label>
            <Input value={s.googleAnalyticsId as string} onChange={(e) => set('googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>Google AdSense Client ID</Label>
            <Input value={s.adsenseClientId as string} onChange={(e) => set('adsenseClientId', e.target.value)} placeholder="ca-pub-XXXXXXXXXX" dir="ltr" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Stripe Public Key</Label>
            <Input value={s.stripePublicKey as string} onChange={(e) => set('stripePublicKey', e.target.value)} placeholder="pk_live_..." dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>Stripe Secret Key</Label>
            <Input value={s.stripeSecretKey as string} onChange={(e) => set('stripeSecretKey', e.target.value)} type="password" placeholder="sk_live_..." dir="ltr" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>SMTP Host</Label>
            <Input value={s.smtpHost as string} onChange={(e) => set('smtpHost', e.target.value)} placeholder="smtp.gmail.com" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input value={s.smtpPort as string} onChange={(e) => set('smtpPort', e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>SMTP User</Label>
              <Input value={s.smtpUser as string} onChange={(e) => set('smtpUser', e.target.value)} placeholder="email@gmail.com" dir="ltr" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>SMTP Password</Label>
            <Input value={s.smtpPass as string} onChange={(e) => set('smtpPass', e.target.value)} type="password" dir="ltr" />
          </div>
        </CardContent>
      </Card>

      {/* Toggle Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">التحكم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">وضع الصيانة</p><p className="text-sm text-muted-foreground">تعطيل الموقع مؤقتاً</p></div>
            <Switch checked={s.maintenanceMode as boolean} onCheckedChange={(v) => set('maintenanceMode', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="font-medium">عرض الإعلانات</p><p className="text-sm text-muted-foreground">تفعيل مساحات الإعلانات</p></div>
            <Switch checked={s.adPlacement as boolean} onCheckedChange={(v) => set('adPlacement', v)} />
          </div>
          <Separator />
          <p className="font-medium text-sm">مواضع الإعلانات</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'adHomeTop', label: 'الرئيسية - أعلى' },
              { key: 'adHomeMiddle', label: 'الرئيسية - وسط' },
              { key: 'adHomeBottom', label: 'الرئيسية - أسفل' },
              { key: 'adToolBottom', label: 'الأدوات - أسفل' },
              { key: 'adToolSidebar', label: 'الأدوات - جانبي' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm">{item.label}</span>
                <Switch checked={s[item.key] as boolean} onCheckedChange={(v) => set(item.key, v)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => toast({ title: 'تم حفظ الإعدادات', description: 'تم تحديث جميع الإعدادات بنجاح' })}>
        حفظ جميع الإعدادات
      </Button>
    </div>
  );
}
