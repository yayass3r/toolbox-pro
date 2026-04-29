'use client';

import { Button } from '@/components/ui/button';
import {
  Twitter,
  Facebook,
  Linkedin,
  Share2,
  Link2,
  MessageCircle,
  Copy,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const SITE_URL = 'https://toolbox-pro-three.vercel.app';
const SITE_TITLE = 'ToolBox Pro - أدوات مجانية أونلاين';
const SITE_DESC = 'مجموعة شاملة من أكثر من 24 أداة مجانية أونلاين لكل احتياجاتك الرقمية';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  compact?: boolean;
}

export function SocialShareButtons({
  url = SITE_URL,
  title = SITE_TITLE,
  description = SITE_DESC,
  compact = false,
}: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'تويتر/X',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 dark:hover:bg-sky-950/30',
    },
    {
      name: 'فيسبوك',
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/30',
    },
    {
      name: 'لينكدإن',
      icon: <Linkedin className="h-4 w-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/30',
    },
    {
      name: 'واتساب',
      icon: <MessageCircle className="h-4 w-4" />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-950/30',
    },
    {
      name: 'تليجرام',
      icon: <Share2 className="h-4 w-4" />,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 dark:hover:bg-cyan-950/30',
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: 'تم نسخ الرابط!', description: 'يمكنك الآن مشاركته مع أصدقائك' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'خطأ في نسخ الرابط' });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // User cancelled
      }
    } else {
      copyLink();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="icon"
            className={`h-8 w-8 ${link.color}`}
            onClick={() => window.open(link.url, '_blank', 'width=600,height=400')}
            title={link.name}
          >
            {link.icon}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:hover:bg-emerald-950/30"
          onClick={handleNativeShare}
          title="مشاركة"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg">شارك الموقع مع أصدقائك</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            className={`gap-2 ${link.color}`}
            onClick={() => window.open(link.url, '_blank', 'width=600,height=400')}
          >
            {link.icon}
            {link.name}
          </Button>
        ))}
        <Button
          variant="outline"
          className="gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:hover:bg-emerald-950/30"
          onClick={copyLink}
        >
          {copied ? <Copy className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'تم النسخ!' : 'نسخ الرابط'}
        </Button>
        <Button
          variant="outline"
          className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          onClick={handleNativeShare}
        >
          <Share2 className="h-4 w-4" />
          مشاركة
        </Button>
      </div>
    </div>
  );
}
