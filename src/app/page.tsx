'use client';

import { useEffect } from 'react';
import { useAppStore, type PageId } from '@/lib/store';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { HomePage } from '@/components/home-page';
import { QrGenerator } from '@/components/tools/qr-generator';
import { PasswordGenerator } from '@/components/tools/password-generator';
import { JsonFormatter } from '@/components/tools/json-formatter';
import { Base64Tool } from '@/components/tools/base64';
import { ColorPicker } from '@/components/tools/color-picker';
import { TextCounter } from '@/components/tools/text-counter';
import { HashGenerator } from '@/components/tools/hash-generator';
import { LoremIpsum } from '@/components/tools/lorem-ipsum';
import { ImageConverter } from '@/components/tools/image-converter';
import { UnitConverter } from '@/components/tools/unit-converter';
import { PdfTools } from '@/components/tools/pdf-tools';
import { SeoAnalyzer } from '@/components/tools/seo-analyzer';
import { ScreenshotTool } from '@/components/tools/screenshot-tool';
import { EmojiPicker } from '@/components/tools/emoji-picker';
import { CssGenerator } from '@/components/tools/css-generator';
import { MarkdownEditor } from '@/components/tools/markdown-editor';
import { ResumeBuilder } from '@/components/tools/resume-builder';
import { InvoiceGenerator } from '@/components/tools/invoice-generator';
import { LinkShortener } from '@/components/tools/link-shortener';
import { ImageResizer } from '@/components/tools/image-resizer';
import { VideoToGif } from '@/components/tools/video-to-gif';
import { TimerStopwatch } from '@/components/tools/timer-stopwatch';
import { AgeCalculator } from '@/components/tools/age-calculator';
import { WordCloud } from '@/components/tools/word-cloud';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { PremiumPage } from '@/components/premium-page';
import { ProfilePage } from '@/components/auth/profile';
import { account } from '@/lib/appwrite';

function PageRenderer({ page }: { page: PageId }) {
  switch (page) {
    case 'home':
      return <HomePage />;
    case 'qr-generator':
      return <QrGenerator />;
    case 'password-generator':
      return <PasswordGenerator />;
    case 'json-formatter':
      return <JsonFormatter />;
    case 'base64':
      return <Base64Tool />;
    case 'color-picker':
      return <ColorPicker />;
    case 'text-counter':
      return <TextCounter />;
    case 'hash-generator':
      return <HashGenerator />;
    case 'lorem-ipsum':
      return <LoremIpsum />;
    case 'image-converter':
      return <ImageConverter />;
    case 'unit-converter':
      return <UnitConverter />;
    case 'pdf-tools':
      return <PdfTools />;
    case 'seo-analyzer':
      return <SeoAnalyzer />;
    case 'screenshot-tool':
      return <ScreenshotTool />;
    case 'emoji-picker':
      return <EmojiPicker />;
    case 'css-generator':
      return <CssGenerator />;
    case 'markdown-editor':
      return <MarkdownEditor />;
    case 'resume-builder':
      return <ResumeBuilder />;
    case 'invoice-generator':
      return <InvoiceGenerator />;
    case 'link-shortener':
      return <LinkShortener />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'video-to-gif':
      return <VideoToGif />;
    case 'timer-stopwatch':
      return <TimerStopwatch />;
    case 'age-calculator':
      return <AgeCalculator />;
    case 'word-cloud':
      return <WordCloud />;
    case 'admin':
      return <AdminDashboard />;
    case 'premium':
      return <PremiumPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <HomePage />;
  }
}

export default function Home() {
  const { currentPage, setUser } = useAppStore();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setUser({ name: user.name, email: user.email });
      } catch {
        // No active session
      }
    };
    checkSession();
  }, [setUser]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage !== 'admin' && <Navbar />}
      <AuthDialog />
      <main className={currentPage === 'admin' ? 'flex-1' : 'flex-1 container mx-auto px-4 py-6'}>
        <PageRenderer page={currentPage} />
      </main>
      {currentPage !== 'admin' && <Footer />}
    </div>
  );
}
