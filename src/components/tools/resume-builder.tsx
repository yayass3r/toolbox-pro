'use client';

import { useState, useRef } from 'react';
import { FileText, Download, Plus, Trash2, Eye, Lock, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

const templates = [
  { id: 'modern', name: 'عصري', premium: false, color: 'from-teal-500 to-emerald-500' },
  { id: 'classic', name: 'كلاسيكي', premium: false, color: 'from-slate-600 to-slate-700' },
  { id: 'minimal', name: 'بسيط', premium: false, color: 'from-gray-400 to-gray-500' },
  { id: 'creative', name: 'إبداعي', premium: true, color: 'from-purple-500 to-pink-500' },
  { id: 'executive', name: 'تنفيذي', premium: true, color: 'from-amber-600 to-amber-700' },
  { id: 'tech', name: 'تقني', premium: true, color: 'from-cyan-500 to-blue-500' },
  { id: 'elegant', name: 'أنيق', premium: true, color: 'from-rose-500 to-rose-600' },
  { id: 'bold', name: 'جريء', premium: true, color: 'from-red-600 to-red-700' },
];

const defaultPersonalInfo: PersonalInfo = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
};

export function ResumeBuilder() {
  const { isPremium } = useAppStore();
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      company: '', position: '', startDate: '', endDate: '', description: '',
    }]);
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      institution: '', degree: '', field: '', startDate: '', endDate: '',
    }]);
  };

  const addSkill = () => {
    setSkills([...skills, { id: Date.now().toString(), name: '', level: 70 }]);
  };

  const addLanguage = () => {
    setLanguages([...languages, { id: Date.now().toString(), name: '', level: 'متوسط' }]);
  };

  const removeItem = (list: { id: string }[], setList: (v: { id: string }[]) => void, id: string) => {
    setList(list.filter((item) => item.id !== id));
  };

  const exportToPDF = async () => {
    if (!resumeRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
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

      pdf.save(`resume-${personalInfo.name || 'untitled'}.pdf`);
      toast({ title: 'تم التصدير', description: isPremium ? 'تم تصدير السيرة الذاتية بنجاح' : 'تم التصدير مع علامة مائية - قم بالترقية لإزالتها' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل في تصدير PDF', variant: 'destructive' });
    }
  };

  const renderTemplatePreview = () => {
    const t = selectedTemplate;
    return (
      <div ref={resumeRef} className="bg-white text-black p-6 min-h-[600px] max-w-[210mm] mx-auto shadow-lg" dir="rtl">
        {t === 'modern' && (
          <div>
            <div className="bg-gradient-to-l from-teal-600 to-emerald-600 text-white p-6 -m-6 mb-6">
              <h1 className="text-2xl font-bold">{personalInfo.name || 'الاسم الكامل'}</h1>
              <p className="text-teal-100 mt-1">{personalInfo.title || 'المسمى الوظيفي'}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-teal-100">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
            </div>
            {personalInfo.summary && (
              <div className="mb-4">
                <h2 className="text-lg font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">نبذة شخصية</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}
            {experiences.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">الخبرات المهنية</h2>
                {experiences.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{exp.position || 'المنصب'}</h3>
                        <p className="text-sm text-teal-600">{exp.company || 'الشركة'}</p>
                      </div>
                      <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'الآن'}</span>
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            {education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">التعليم</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{edu.degree || 'الدرجة'}</h3>
                        <p className="text-sm text-teal-600">{edu.institution || 'المؤسسة'}{edu.field ? ` - ${edu.field}` : ''}</p>
                      </div>
                      <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {skills.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">المهارات</h2>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 w-24">{skill.name || 'مهارة'}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">اللغات</h2>
                <div className="flex flex-wrap gap-3">
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                      {lang.name || 'لغة'} - {lang.level}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {t === 'classic' && (
          <div className="font-serif">
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
              <h1 className="text-3xl font-bold">{personalInfo.name || 'الاسم الكامل'}</h1>
              <p className="text-lg text-gray-600 mt-1">{personalInfo.title || 'المسمى الوظيفي'}</p>
              <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm text-gray-500">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>│ {personalInfo.phone}</span>}
                {personalInfo.location && <span>│ {personalInfo.location}</span>}
              </div>
            </div>
            {personalInfo.summary && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-2">الملخص المهني</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}
            {experiences.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-2">الخبرة المهنية</h2>
                {experiences.map((exp) => (
                  <div key={exp.id} className="mb-3 border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{exp.position || 'المنصب'} - <span className="font-normal text-gray-600">{exp.company || 'الشركة'}</span></h3>
                      <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'الآن'}</span>
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            {education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-2">التعليم</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{edu.degree || 'الدرجة'}{edu.field ? ` في ${edu.field}` : ''}</h3>
                      <span className="text-xs text-gray-500">{edu.institution}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {skills.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-2">المهارات</h2>
                <p className="text-sm text-gray-700">{skills.map((s) => s.name || 'مهارة').join(' • ')}</p>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide mb-2">اللغات</h2>
                <p className="text-sm text-gray-700">{languages.map((l) => `${l.name || 'لغة'} (${l.level})`).join(' • ')}</p>
              </div>
            )}
          </div>
        )}

        {t === 'minimal' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-light">{personalInfo.name || 'الاسم'}</h1>
              <p className="text-gray-400 text-sm mt-1">{personalInfo.title || 'المسمى الوظيفي'}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-400">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
              </div>
            </div>
            {personalInfo.summary && (
              <div className="mb-5 text-sm text-gray-600 leading-relaxed">{personalInfo.summary}</div>
            )}
            {experiences.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">الخبرة</p>
                {experiences.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{exp.position}</span>
                      <span className="text-xs text-gray-400">{exp.startDate} → {exp.endDate || 'الآن'}</span>
                    </div>
                    <p className="text-xs text-gray-500">{exp.company}</p>
                    {exp.description && <p className="text-xs text-gray-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            {education.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">التعليم</p>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <span className="text-sm font-medium">{edu.degree}</span>
                    <span className="text-xs text-gray-500 mr-2">— {edu.institution}</span>
                  </div>
                ))}
              </div>
            )}
            {skills.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">المهارات</p>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s) => (
                    <span key={s.id} className="text-xs border border-gray-200 px-2 py-0.5 rounded">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">اللغات</p>
                <div className="flex gap-3">
                  {languages.map((l) => (
                    <span key={l.id} className="text-xs text-gray-600">{l.name} · {l.level}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isPremium && (
          <div className="absolute bottom-2 left-2 text-[8px] text-gray-300">
            Created with ToolBox Pro - Free Version
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="منشئ السيرة الذاتية"
        description="أنشئ سيرتك الذاتية الاحترافية بسهولة مع قوالب متعددة وتصدير PDF"
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-bold">اختر القالب</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={showPreview ? 'outline' : 'default'}
                  onClick={() => setShowPreview(false)}
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant={showPreview ? 'default' : 'outline'}
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 ml-1" />
                  معاينة
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    if (tmpl.premium && !isPremium) return;
                    setSelectedTemplate(tmpl.id);
                  }}
                  className={`relative rounded-lg p-2 text-center transition-all border-2 ${
                    selectedTemplate === tmpl.id
                      ? 'border-teal-500 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  } ${tmpl.premium && !isPremium ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className={`h-8 rounded bg-gradient-to-l ${tmpl.color} mb-1`} />
                  <span className="text-xs">{tmpl.name}</span>
                  {tmpl.premium && !isPremium && (
                    <Lock className="absolute top-1 left-1 h-3 w-3 text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {showPreview ? (
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">معاينة السيرة الذاتية</h3>
                  <div className="flex gap-2">
                    <Button onClick={exportToPDF} size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <Download className="h-4 w-4 ml-1" />
                      تصدير PDF
                    </Button>
                    {!isPremium && (
                      <Badge variant="outline" className="text-amber-600 text-xs">
                        <Lock className="h-3 w-3 ml-1" />
                        مع علامة مائية
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="overflow-auto max-h-[700px] border rounded-lg relative">
                  {renderTemplatePreview()}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-4">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
                  <TabsTrigger value="personal" className="flex-1">المعلومات الشخصية</TabsTrigger>
                  <TabsTrigger value="experience" className="flex-1">الخبرات</TabsTrigger>
                  <TabsTrigger value="education" className="flex-1">التعليم</TabsTrigger>
                  <TabsTrigger value="skills" className="flex-1">المهارات</TabsTrigger>
                  <TabsTrigger value="languages" className="flex-1">اللغات</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>الاسم الكامل</Label>
                          <Input value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} placeholder="أحمد محمد" />
                        </div>
                        <div className="space-y-1">
                          <Label>المسمى الوظيفي</Label>
                          <Input value={personalInfo.title} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} placeholder="مطور ويب" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>البريد الإلكتروني</Label>
                          <Input value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="email@example.com" dir="ltr" />
                        </div>
                        <div className="space-y-1">
                          <Label>رقم الهاتف</Label>
                          <Input value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="+966 5XX XXX XXXX" dir="ltr" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>الموقع</Label>
                        <Input value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} placeholder="الرياض، السعودية" />
                      </div>
                      <div className="space-y-1">
                        <Label>نبذة شخصية</Label>
                        <Textarea value={personalInfo.summary} onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك..." rows={4} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-3 mt-4">
                  {experiences.map((exp) => (
                    <Card key={exp.id}>
                      <CardContent className="p-4 space-y-3 relative">
                        <Button variant="ghost" size="sm" className="absolute top-2 left-2 h-7 w-7 p-0" onClick={() => removeItem(experiences, setExperiences as (v: { id: string }[]) => void, exp.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>الشركة</Label>
                            <Input value={exp.company} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x))} placeholder="اسم الشركة" />
                          </div>
                          <div className="space-y-1">
                            <Label>المنصب</Label>
                            <Input value={exp.position} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, position: e.target.value } : x))} placeholder="المسمى الوظيفي" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>تاريخ البدء</Label>
                            <Input value={exp.startDate} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, startDate: e.target.value } : x))} placeholder="يناير 2020" />
                          </div>
                          <div className="space-y-1">
                            <Label>تاريخ الانتهاء</Label>
                            <Input value={exp.endDate} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, endDate: e.target.value } : x))} placeholder="دائم أو تاريخ" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>الوصف</Label>
                          <Textarea value={exp.description} onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, description: e.target.value } : x))} placeholder="وصف المهام والإنجازات..." rows={2} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full">
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة خبرة
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-3 mt-4">
                  {education.map((edu) => (
                    <Card key={edu.id}>
                      <CardContent className="p-4 space-y-3 relative">
                        <Button variant="ghost" size="sm" className="absolute top-2 left-2 h-7 w-7 p-0" onClick={() => removeItem(education, setEducation as (v: { id: string }[]) => void, edu.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>المؤسسة</Label>
                            <Input value={edu.institution} onChange={(e) => setEducation(education.map((x) => x.id === edu.id ? { ...x, institution: e.target.value } : x))} placeholder="اسم الجامعة" />
                          </div>
                          <div className="space-y-1">
                            <Label>الدرجة العلمية</Label>
                            <Input value={edu.degree} onChange={(e) => setEducation(education.map((x) => x.id === edu.id ? { ...x, degree: e.target.value } : x))} placeholder="بكالوريوس" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>التخصص</Label>
                            <Input value={edu.field} onChange={(e) => setEducation(education.map((x) => x.id === edu.id ? { ...x, field: e.target.value } : x))} placeholder="علوم الحاسب" />
                          </div>
                          <div className="space-y-1">
                            <Label>من</Label>
                            <Input value={edu.startDate} onChange={(e) => setEducation(education.map((x) => x.id === edu.id ? { ...x, startDate: e.target.value } : x))} placeholder="2016" />
                          </div>
                          <div className="space-y-1">
                            <Label>إلى</Label>
                            <Input value={edu.endDate} onChange={(e) => setEducation(education.map((x) => x.id === edu.id ? { ...x, endDate: e.target.value } : x))} placeholder="2020" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full">
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة تعليم
                  </Button>
                </TabsContent>

                <TabsContent value="skills" className="space-y-3 mt-4">
                  {skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <Input value={skill.name} onChange={(e) => setSkills(skills.map((s) => s.id === skill.id ? { ...s, name: e.target.value } : s))} placeholder="اسم المهارة" className="flex-1" />
                        <Input type="range" min={10} max={100} value={skill.level} onChange={(e) => setSkills(skills.map((s) => s.id === skill.id ? { ...s, level: Number(e.target.value) } : s))} className="w-24" />
                        <span className="text-xs text-muted-foreground w-8">{skill.level}%</span>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeItem(skills, setSkills as (v: { id: string }[]) => void, skill.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addSkill} className="w-full">
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة مهارة
                  </Button>
                </TabsContent>

                <TabsContent value="languages" className="space-y-3 mt-4">
                  {languages.map((lang) => (
                    <Card key={lang.id}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <Input value={lang.name} onChange={(e) => setLanguages(languages.map((l) => l.id === lang.id ? { ...l, name: e.target.value } : l))} placeholder="اللغة" className="flex-1" />
                        <Select value={lang.level} onValueChange={(v) => setLanguages(languages.map((l) => l.id === lang.id ? { ...l, level: v } : l))}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                            <SelectItem value="متوسط">متوسط</SelectItem>
                            <SelectItem value="متقدم">متقدم</SelectItem>
                            <SelectItem value="لغة أم">لغة أم</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeItem(languages, setLanguages as (v: { id: string }[]) => void, lang.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addLanguage} className="w-full">
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة لغة
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            {/* Live Mini Preview */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">معاينة مباشرة</h3>
                    <Button size="sm" onClick={() => setShowPreview(true)} variant="outline">
                      <Eye className="h-3 w-3 ml-1" />
                      تكبير
                    </Button>
                  </div>
                  <div className="transform scale-[0.45] origin-top-right h-[400px] -m-16">
                    <div className="border rounded-lg overflow-hidden">
                      {renderTemplatePreview()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PremiumGate feature="تصدير بدون علامة مائية">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <h3 className="font-bold mb-1">نسخة مميزة</h3>
                    <p className="text-xs text-muted-foreground mb-3">تصدير بدون علامة مائية + قوالب إضافية</p>
                    <Button onClick={exportToPDF} className="w-full bg-teal-600 hover:bg-teal-700">
                      <Download className="h-4 w-4 ml-1" />
                      تصدير PDF
                    </Button>
                  </CardContent>
                </Card>
              </PremiumGate>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <AdBanner slot="resume-builder-bottom" format="horizontal" />
      </div>
    </div>
  );
}
