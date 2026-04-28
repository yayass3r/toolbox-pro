'use client';

import { useState } from 'react';
import { account, OAuthProvider } from '@/lib/appwrite';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Chrome } from 'lucide-react';

export function AuthDialog() {
  const { isAuthDialogOpen, setIsAuthDialogOpen, setUser, authTab, setAuthTab } =
    useAppStore();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(loginEmail, loginPassword);
      const user = await account.get();
      setUser({ name: user.name, email: user.email });
      setIsAuthDialogOpen(false);
      toast({ title: 'تم تسجيل الدخول', description: `مرحباً ${user.name}!` });
    } catch (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'تحقق من البريد الإلكتروني وكلمة المرور',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await account.create('unique()', registerEmail, registerPassword, registerName);
      await account.createEmailPasswordSession(registerEmail, registerPassword);
      const user = await account.get();
      setUser({ name: user.name, email: user.email });
      setIsAuthDialogOpen(false);
      toast({ title: 'تم إنشاء الحساب', description: `مرحباً ${user.name}!` });
    } catch (error) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: 'قد يكون البريد الإلكتروني مستخدماً بالفعل',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      account.createOAuth2Session(
        OAuthProvider.Google,
        window.location.origin,
        window.location.origin
      );
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في تسجيل الدخول بجوجل',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center gradient-text text-xl">
            ToolBox Pro
          </DialogTitle>
        </DialogHeader>

        <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as 'login' | 'register')}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <Chrome className="h-4 w-4 ml-2" />
                  تسجيل الدخول بجوجل
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      أو
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="example@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      dir="ltr"
                      className="pr-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      dir="ltr"
                      className="pr-9"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading || !loginEmail || !loginPassword}
                >
                  {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <Chrome className="h-4 w-4 ml-2" />
                  التسجيل بجوجل
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      أو
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-name">الاسم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-name"
                      placeholder="أحمد محمد"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="example@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      dir="ltr"
                      className="pr-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="8 أحرف على الأقل"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      dir="ltr"
                      className="pr-9"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading || !registerName || !registerEmail || !registerPassword}
                >
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
