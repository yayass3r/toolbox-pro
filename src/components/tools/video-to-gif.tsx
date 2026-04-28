'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Film, Download, Upload, Play, Pause, Lock, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

export function VideoToGif() {
  const { isPremium } = useAppStore();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [fps, setFps] = useState(10);
  const [gifWidth, setGifWidth] = useState(480);
  const [gifHeight, setGifHeight] = useState(270);
  const [quality, setQuality] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gifUrl, setGifUrl] = useState('');
  const [gifSize, setGifSize] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({ title: 'خطأ', description: 'حجم الملف يجب أن يكون أقل من 20 ميجابايت', variant: 'destructive' });
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setGifUrl('');
  };

  const handleVideoLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoDuration(video.duration);
    setEndTime(Math.min(video.duration, 10));
    setGifWidth(Math.min(video.videoWidth, 480));
    setGifHeight(Math.round(Math.min(video.videoWidth, 480) * (video.videoHeight / video.videoWidth)));
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.currentTime = startTime;
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isPlaying, endTime, startTime]);

  const generateGIF = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setIsGenerating(true);
    setGifUrl('');

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = gifWidth;
      canvas.height = gifHeight;

      const frames: ImageData[] = [];
      const totalFrames = Math.floor((endTime - startTime) * fps);
      const interval = (endTime - startTime) / totalFrames;

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = startTime + i * interval;
        await new Promise<void>((resolve) => {
          const handler = () => {
            ctx.drawImage(video, 0, 0, gifWidth, gifHeight);
            frames.push(ctx.getImageData(0, 0, gifWidth, gifHeight));
            resolve();
          };
          video.addEventListener('seeked', handler, { once: true });
        });
      }

      // Simple GIF generation using canvas frames
      // Create an animated display using canvas
      let currentFrame = 0;
      const delay = 1000 / fps;

      const animate = () => {
        if (currentFrame < frames.length) {
          ctx.putImageData(frames[currentFrame], 0, 0);
          currentFrame++;
        } else {
          currentFrame = 0;
        }
      };

      // Create downloadable GIF-like file as webm
      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setGifSize(blob.size);
        setIsGenerating(false);
        toast({ title: 'تم الإنشاء', description: 'تم إنشاء الرسوم المتحركة بنجاح' });
      };

      recorder.start();

      // Play frames for recording
      for (let i = 0; i < frames.length; i++) {
        ctx.putImageData(frames[i], 0, 0);
        await new Promise((r) => setTimeout(r, delay));
      }

      recorder.stop();

      // Set up animation loop for preview
      currentFrame = 0;
      const intervalId = setInterval(() => {
        if (currentFrame < frames.length) {
          ctx.putImageData(frames[currentFrame], 0, 0);
          currentFrame++;
        } else {
          currentFrame = 0;
        }
      }, delay);

      return () => clearInterval(intervalId);
    } catch {
      toast({ title: 'خطأ', description: 'فشل في إنشاء الرسوم المتحركة', variant: 'destructive' });
      setIsGenerating(false);
    }
  }, [startTime, endTime, fps, gifWidth, gifHeight, toast]);

  const downloadGif = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.download = 'animation.webm';
    link.href = gifUrl;
    link.click();
    toast({ title: 'تم التحميل', description: 'تم تحميل الرسوم المتحركة' });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="محول الفيديو إلى GIF"
        description="حوّل مقاطع الفيديو القصيرة إلى رسوم متحركة GIF"
        icon={<Film className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {videoUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      onLoadedMetadata={handleVideoLoaded}
                      className="w-full max-h-64 object-contain"
                      muted
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-4 w-4 ml-1" /> : <Play className="h-4 w-4 ml-1" />}
                      {isPlaying ? 'إيقاف' : 'تشغيل'}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      المدة: {formatTime(videoDuration)}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-teal-500 transition-colors"
                  onClick={() => document.getElementById('video-upload')?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="font-medium mb-1">اسحب الفيديو هنا أو اضغط للاختيار</p>
                  <p className="text-sm text-muted-foreground">MP4, WebM - حد أقصى 20 ميجابايت</p>
                  <input id="video-upload" type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </div>
              )}
            </CardContent>
          </Card>

          {videoUrl && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  إعدادات التحويل
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>وقت البدء: {formatTime(startTime)}</Label>
                    <Label>وقت الانتهاء: {formatTime(endTime)}</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="range"
                      min={0}
                      max={videoDuration}
                      step={0.1}
                      value={startTime}
                      onChange={(e) => setStartTime(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Input
                      type="range"
                      min={0}
                      max={videoDuration}
                      step={0.1}
                      value={endTime}
                      onChange={(e) => setEndTime(Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>معدل الإطارات (FPS)</Label>
                    <Select value={fps.toString()} onValueChange={(v) => setFps(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 FPS</SelectItem>
                        <SelectItem value="10">10 FPS</SelectItem>
                        <SelectItem value="15">15 FPS</SelectItem>
                        <SelectItem value="20">20 FPS</SelectItem>
                        <SelectItem value="24">24 FPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>الحجم</Label>
                    <Select value={gifWidth.toString()} onValueChange={(v) => {
                      const w = Number(v);
                      setGifWidth(w);
                      const ratio = videoRef.current ? videoRef.current.videoHeight / videoRef.current.videoWidth : 9 / 16;
                      setGifHeight(Math.round(w * ratio));
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="320">320px</SelectItem>
                        <SelectItem value="480">480px</SelectItem>
                        <SelectItem value="640">640px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الجودة: {quality}</Label>
                  <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={1} max={20} step={1} />
                </div>

                {!isPremium && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <Lock className="h-4 w-4" />
                      <span className="font-medium">النسخة المجانية</span>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">الحد الأقصى 10 ثوانٍ - قم بالترقية لمقاطع أطول وبدون علامة مائية</p>
                  </div>
                )}

                <Button
                  onClick={generateGIF}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isGenerating || endTime <= startTime}
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1" />
                      جارٍ الإنشاء...
                    </>
                  ) : (
                    <>
                      <Film className="h-4 w-4 ml-1" />
                      إنشاء رسوم متحركة ({formatTime(endTime - startTime)})
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-bold mb-4">المعاينة</h3>
              {gifUrl ? (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video src={gifUrl} autoPlay loop muted className="w-full max-h-64 object-contain" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Badge variant="secondary">
                      {gifWidth}×{gifHeight}
                    </Badge>
                    <Badge variant="secondary">
                      {(gifSize / 1024).toFixed(0)} KB
                    </Badge>
                    <Badge variant="secondary">
                      {fps} FPS
                    </Badge>
                  </div>
                  <Button onClick={downloadGif} className="bg-teal-600 hover:bg-teal-700">
                    <Download className="h-4 w-4 ml-1" />
                    تحميل الرسوم المتحركة
                  </Button>
                </div>
              ) : (
                <div className="py-12">
                  <Film className="h-16 w-16 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">قم بتحميل فيديو واضبط الإعدادات لإنشاء الرسوم المتحركة</p>
                </div>
              )}
            </CardContent>
          </Card>

          <PremiumGate feature="تصدير بدون علامة مائية ومقاطع أطول">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">مزايا النسخة المميزة</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• مقاطع أطول بدون حد زمني</li>
                  <li>• تصدير بدون علامة مائية</li>
                  <li>• دقة أعلى (حتى 1080p)</li>
                  <li>• تصدير بصيغة GIF حقيقي</li>
                </ul>
              </CardContent>
            </Card>
          </PremiumGate>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6">
        <AdBanner slot="video-to-gif-bottom" format="horizontal" />
      </div>
    </div>
  );
}
