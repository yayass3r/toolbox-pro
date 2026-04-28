'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, Clock, StopCircle, Trophy, Lock, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ToolHeader } from '@/components/shared/tool-header';
import { AdBanner } from '@/components/shared/ad-banner';
import { PremiumGate } from '@/components/shared/premium-gate';
import { useToast } from '@/hooks/use-toast';

const timerPresets = [
  { label: '1 دقيقة', seconds: 60 },
  { label: '3 دقائق', seconds: 180 },
  { label: '5 دقائق', seconds: 300 },
  { label: '10 دقائق', seconds: 600 },
  { label: '15 دقيقة', seconds: 900 },
  { label: '30 دقيقة', seconds: 1800 },
];

const pomodoroDefaults = { work: 25, shortBreak: 5, longBreak: 15, rounds: 4 };

export function TimerStopwatch() {
  const { toast } = useToast();

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');

  // Stopwatch state
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(pomodoroDefaults.work * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomodoroRound, setPomodoroRound] = useState(1);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopwatchInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pomodoroInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTick = useRef<number>(0);

  const playNotification = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 300);
    } catch { /* audio not available */ }
  }, []);

  const handlePomodoroPhaseEnd = useCallback(() => {
    setPomodoroRunning(false);
    playNotification();

    setPomodoroPhase((currentPhase) => {
      if (currentPhase === 'work') {
        setPomodoroSessions((prev) => {
          const newSessions = prev + 1;
          if (newSessions % pomodoroDefaults.rounds === 0) {
            setPomodoroTime(pomodoroDefaults.longBreak * 60);
            toast({ title: 'استراحة طويلة!', description: 'استرح 15 دقيقة' });
            return newSessions;
          } else {
            setPomodoroTime(pomodoroDefaults.shortBreak * 60);
            toast({ title: 'استراحة قصيرة!', description: 'استرح 5 دقائق' });
            return newSessions;
          }
        });
        return 'shortBreak';
      } else {
        setPomodoroRound((prev) => prev + 1);
        setPomodoroTime(pomodoroDefaults.work * 60);
        toast({ title: 'وقت العمل!', description: 'ركز لمدة 25 دقيقة' });
        return 'work';
      }
    });
  }, [playNotification, toast]);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerInterval.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            playNotification();
            toast({ title: 'انتهى الوقت!', description: 'انتهى العداد التنازلي' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [timerRunning, timerSeconds, toast, playNotification]);

  // Stopwatch logic
  useEffect(() => {
    if (stopwatchRunning) {
      lastTick.current = Date.now();
      stopwatchInterval.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastTick.current;
        lastTick.current = now;
        setStopwatchMs((prev) => prev + delta);
      }, 10);
    } else {
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
    }
    return () => { if (stopwatchInterval.current) clearInterval(stopwatchInterval.current); };
  }, [stopwatchRunning]);

  // Pomodoro logic
  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroInterval.current = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            handlePomodoroPhaseEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (pomodoroInterval.current) clearInterval(pomodoroInterval.current); };
  }, [pomodoroRunning, pomodoroTime, handlePomodoroPhaseEnd]);

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerTotal(seconds);
    setTimerRunning(true);
  };

  const startCustomTimer = () => {
    const mins = parseInt(customMinutes);
    if (mins > 0) {
      startTimer(mins * 60);
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
    setTimerTotal(0);
  };

  const toggleStopwatch = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([stopwatchMs, ...laps]);
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroPhase('work');
    setPomodoroTime(pomodoroDefaults.work * 60);
    setPomodoroRound(1);
    setPomodoroSessions(0);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatMs = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const timerProgress = timerTotal > 0 ? ((timerTotal - timerSeconds) / timerTotal) * 100 : 0;
  const pomodoroProgress = pomodoroPhase === 'work'
    ? ((pomodoroDefaults.work * 60 - pomodoroTime) / (pomodoroDefaults.work * 60)) * 100
    : pomodoroPhase === 'shortBreak'
    ? ((pomodoroDefaults.shortBreak * 60 - pomodoroTime) / (pomodoroDefaults.shortBreak * 60)) * 100
    : ((pomodoroDefaults.longBreak * 60 - pomodoroTime) / (pomodoroDefaults.longBreak * 60)) * 100;

  return (
    <div className="animate-fade-in">
      <ToolHeader
        title="عداد ومؤقت"
        description="عداد تنازلي، ساعة إيقاف، ومؤقت بومودورو مع تنبيهات صوتية"
        icon={<Timer className="h-5 w-5" />}
      />

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="timer">
            <Clock className="h-4 w-4 ml-1" />
            عداد تنازلي
          </TabsTrigger>
          <TabsTrigger value="stopwatch">
            <StopCircle className="h-4 w-4 ml-1" />
            ساعة إيقاف
          </TabsTrigger>
          <TabsTrigger value="pomodoro">
            <Coffee className="h-4 w-4 ml-1" />
            بومودورو
          </TabsTrigger>
        </TabsList>

        {/* Countdown Timer */}
        <TabsContent value="timer" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">اختر المدة</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {timerPresets.map((preset) => (
                    <Button
                      key={preset.seconds}
                      variant="outline"
                      size="sm"
                      onClick={() => startTimer(preset.seconds)}
                      disabled={timerRunning}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    placeholder="دقائق مخصصة"
                    disabled={timerRunning}
                  />
                  <Button onClick={startCustomTimer} disabled={timerRunning || !customMinutes}>
                    ابدأ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-48 h-48 rounded-full border-8 border-muted flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                      <circle
                        cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="6"
                        className="text-teal-500"
                        strokeDasharray={`${2 * Math.PI * 92}`}
                        strokeDashoffset={`${2 * Math.PI * 92 * (1 - timerProgress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-3xl font-mono font-bold">{formatTime(timerSeconds)}</span>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => setTimerRunning(!timerRunning)}
                    disabled={timerSeconds === 0}
                    className={timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'}
                  >
                    {timerRunning ? <><Pause className="h-4 w-4 ml-1" /> إيقاف</> : <><Play className="h-4 w-4 ml-1" /> استئناف</>}
                  </Button>
                  <Button variant="outline" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4 ml-1" /> إعادة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stopwatch */}
        <TabsContent value="stopwatch" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <span className="text-5xl font-mono font-bold">{formatMs(stopwatchMs)}</span>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={toggleStopwatch}
                    className={stopwatchRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'}
                  >
                    {stopwatchRunning ? <><Pause className="h-4 w-4 ml-1" /> إيقاف</> : <><Play className="h-4 w-4 ml-1" /> ابدأ</>}
                  </Button>
                  {stopwatchMs > 0 && (
                    <Button variant="outline" onClick={addLap} disabled={!stopwatchRunning}>
                      <Trophy className="h-4 w-4 ml-1" /> لفة
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetStopwatch}>
                    <RotateCcw className="h-4 w-4 ml-1" /> إعادة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">اللفات</h3>
                  <Badge variant="secondary">{laps.length} لفة</Badge>
                </div>
                {laps.length > 0 ? (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {laps.map((lap, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                        <span className="text-muted-foreground">لفة {laps.length - idx}</span>
                        <span className="font-mono font-medium">{formatMs(lap)}</span>
                        {idx < laps.length - 1 && (
                          <span className="text-xs text-muted-foreground font-mono">+{formatMs(lap - laps[idx + 1])}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">اضغط &quot;لفة&quot; أثناء التشغيل لتسجيل اللفات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pomodoro */}
        <TabsContent value="pomodoro" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Badge className={`mb-3 ${pomodoroPhase === 'work' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                  {pomodoroPhase === 'work' ? 'تركيز' : pomodoroPhase === 'shortBreak' ? 'استراحة قصيرة' : 'استراحة طويلة'}
                </Badge>
                <div className="relative inline-block mb-4">
                  <div className="w-56 h-56 rounded-full border-8 border-muted flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
                      <circle cx="120" cy="120" r="112" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                      <circle
                        cx="120" cy="120" r="112" fill="none" stroke="currentColor" strokeWidth="6"
                        className={pomodoroPhase === 'work' ? 'text-red-500' : 'text-green-500'}
                        strokeDasharray={`${2 * Math.PI * 112}`}
                        strokeDashoffset={`${2 * Math.PI * 112 * (1 - pomodoroProgress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-4xl font-mono font-bold">{formatTime(pomodoroTime)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-4">
                <Button
                  onClick={() => setPomodoroRunning(!pomodoroRunning)}
                  className={pomodoroRunning ? 'bg-amber-600 hover:bg-amber-700' : pomodoroPhase === 'work' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                >
                  {pomodoroRunning ? <><Pause className="h-4 w-4 ml-1" /> إيقاف</> : <><Play className="h-4 w-4 ml-1" /> ابدأ</>}
                </Button>
                <Button variant="outline" onClick={resetPomodoro}>
                  <RotateCcw className="h-4 w-4 ml-1" /> إعادة
                </Button>
              </div>

              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-lg">{pomodoroRound}</p>
                  <p className="text-muted-foreground">الجولة</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{pomodoroSessions}</p>
                  <p className="text-muted-foreground">جلسات مكتملة</p>
                </div>
              </div>

              <Progress value={pomodoroProgress} className="mt-4" />
            </CardContent>
          </Card>

          <PremiumGate feature="فترات مخصصة وسجل الجلسات">
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">إعدادات بومودورو المخصصة</h3>
                <p className="text-xs text-muted-foreground mb-3">غيّر مدة العمل والاستراحة واحفظ سجل الجلسات</p>
              </CardContent>
            </Card>
          </PremiumGate>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <AdBanner slot="timer-stopwatch-bottom" format="horizontal" />
      </div>
    </div>
  );
}
