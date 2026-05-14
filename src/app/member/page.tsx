'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Shield,
  Gift,
  Crown,
  Star,
} from 'lucide-react';

export default function MemberPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    type: 'b2c',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟登录成功
    router.push('/member/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟注册成功
    router.push('/member/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">大迈国际</span>
          </Link>
          <Button variant="ghost" onClick={() => router.push('/')}>
            返回首页
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left - Form */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>欢迎回来</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">邮箱</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="请输入邮箱"
                            className="pl-10"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="请输入密码"
                            className="pl-10 pr-10"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          记住我
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">
                          忘记密码？
                        </a>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        登录
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-2 text-gray-500">或使用以下方式登录</span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button variant="outline" className="w-full">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#07C160">
                            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z" />
                            <path d="M23.996 14.086c0-3.383-3.247-6.132-7.259-6.132-4.019 0-7.259 2.749-7.259 6.132 0 3.391 3.24 6.133 7.259 6.133.847 0 1.66-.113 2.42-.33a.714.714 0 01.589.082l1.518.886a.268.268 0 00.139.045c.133 0 .24-.11.24-.244 0-.058-.024-.116-.04-.175l-.307-1.18a.49.49 0 01.176-.546c1.46-1.076 2.424-2.67 2.424-4.671zm-9.643-1.025a.96.96 0 01-.957-.963c0-.535.428-.964.957-.964.53 0 .957.43.957.964a.96.96 0 01-.957.963zm4.768 0a.96.96 0 01-.957-.963c0-.535.428-.964.957-.964.53 0 .957.43.957.964a.96.96 0 01-.957.963z" />
                          </svg>
                          微信
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>创建账户</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={registerForm.type === 'b2b' ? 'default' : 'outline'}
                          className={registerForm.type === 'b2b' ? 'bg-blue-600' : ''}
                          onClick={() => setRegisterForm({ ...registerForm, type: 'b2b' })}
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          B2B企业客户
                        </Button>
                        <Button
                          type="button"
                          variant={registerForm.type === 'b2c' ? 'default' : 'outline'}
                          className={registerForm.type === 'b2c' ? 'bg-blue-600' : ''}
                          onClick={() => setRegisterForm({ ...registerForm, type: 'b2c' })}
                        >
                          <User className="mr-2 h-4 w-4" />
                          B2C个人客户
                        </Button>
                      </div>

                      {registerForm.type === 'b2b' && (
                        <div className="space-y-2">
                          <Label htmlFor="company">公司名称</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="company"
                              placeholder="请输入公司名称"
                              className="pl-10"
                              value={registerForm.company}
                              onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="register-email">邮箱</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="请输入邮箱"
                            className="pl-10"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-phone">手机号</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            type="tel"
                            placeholder="请输入手机号"
                            className="pl-10"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="请输入密码"
                            className="pl-10 pr-10"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">确认密码</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="请再次输入密码"
                            className="pl-10"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1 rounded" required />
                        <span className="text-gray-600">
                          我已阅读并同意{' '}
                          <a href="/terms" className="text-blue-600 hover:underline">
                            服务条款
                          </a>{' '}
                          和{' '}
                          <a href="/privacy" className="text-blue-600 hover:underline">
                            隐私政策
                          </a>
                        </span>
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        注册
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right - Benefits */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">会员专属权益</h2>
              <p className="mt-2 text-gray-600">成为会员，享受更多专属服务和优惠</p>
            </div>

            {/* B2B Benefits */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-5 w-5" />
                  B2B企业客户
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  '阶梯价格 - 订单越大优惠越多',
                  '专属客户经理 - 一对一服务',
                  '定制报价 - 特殊需求特殊处理',
                  '信用账期 - 最高60天账期',
                  '优先发货 - 优先排产发货',
                  '样品申请 - 免费样品寄送',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* B2C Benefits */}
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <User className="h-5 w-5" />
                  B2C个人客户
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  '积分返现 - 消费送积分',
                  '生日礼遇 - 专属生日优惠',
                  '新品试用 - 优先体验新品',
                  '会员专享价 - 特定商品折扣',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Member Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  会员等级体系
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { level: '普通', icon: User, color: 'text-gray-500', bg: 'bg-gray-100' },
                    { level: '银卡', icon: Star, color: 'text-gray-400', bg: 'bg-gray-200' },
                    { level: '金卡', icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { level: '钻石', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50' },
                  ].map((item, index) => (
                    <div key={index} className={`rounded-lg p-3 ${item.bg}`}>
                      <item.icon className={`mx-auto h-6 w-6 ${item.color}`} />
                      <p className="mt-1 text-xs font-medium">{item.level}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-xs">安全支付</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span className="text-xs">隐私保护</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-xs">正品保证</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
