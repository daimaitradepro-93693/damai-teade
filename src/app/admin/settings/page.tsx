'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  Globe,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle,
  User,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    wechat: string;
    twitter: string;
    facebook: string;
    linkedin: string;
  };
}

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '大迈国际贸易有限公司',
    siteTitle: '专业进出口贸易服务',
    siteDescription: '专业从事进出口贸易、国际物流、报关清关、跨境电商等外贸服务',
    keywords: ['进出口贸易', '国际物流', '报关清关', '外贸服务'],
    contact: {
      phone: '15999660432',
      email: 'daimai.tradepro@gmail.com',
      address: '中国海南',
    },
    social: {
      wechat: '',
      twitter: '',
      facebook: '',
      linkedin: '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'DMadmin2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('密码错误');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('保存失败', err);
    }
    setSaving(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">网站设置管理</CardTitle>
            <CardDescription>请输入管理员密码</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="text-center"
                />
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                登录
              </Button>
              <div className="text-center">
                <Link href="/admin" className="text-sm text-blue-600 hover:underline">
                  返回管理后台
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">网站设置</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-blue-600 hover:underline">
              返回管理后台
            </Link>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? '保存中...' : saved ? <CheckCircle className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {saved ? '已保存' : '保存设置'}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic" className="gap-2">
              <Globe className="h-4 w-4" />
              基础设置
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="h-4 w-4" />
              联系方式
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <User className="h-4 w-4" />
              社交媒体
            </TabsTrigger>
          </TabsList>

          {/* Basic Settings */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>网站基本信息</CardTitle>
                <CardDescription>设置网站名称、标题、描述等SEO信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">网站名称</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="输入网站名称"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">网站标题</label>
                  <Input
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    placeholder="输入网站标题"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">网站描述</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    placeholder="输入网站描述（SEO）"
                    className="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">关键词（用逗号分隔）</label>
                  <Input
                    value={settings.keywords.join(', ')}
                    onChange={(e) => setSettings({
                      ...settings,
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                    })}
                    placeholder="关键词1, 关键词2, 关键词3"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>联系方式设置</CardTitle>
                <CardDescription>设置公司在网站上显示的联系方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" /> 联系电话
                  </label>
                  <Input
                    value={settings.contact.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })}
                    placeholder="输入联系电话"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" /> 电子邮箱
                  </label>
                  <Input
                    value={settings.contact.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })}
                    placeholder="输入邮箱地址"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> 公司地址
                  </label>
                  <Input
                    value={settings.contact.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, address: e.target.value }
                    })}
                    placeholder="输入公司地址"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Settings */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>社交媒体设置</CardTitle>
                <CardDescription>设置公司社交媒体链接</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">微信</label>
                  <Input
                    value={settings.social.wechat}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, wechat: e.target.value }
                    })}
                    placeholder="微信号或二维码图片链接"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Twitter</label>
                  <Input
                    value={settings.social.twitter}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, twitter: e.target.value }
                    })}
                    placeholder="Twitter 主页链接"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Facebook</label>
                  <Input
                    value={settings.social.facebook}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, facebook: e.target.value }
                    })}
                    placeholder="Facebook 主页链接"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <Input
                    value={settings.social.linkedin}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, linkedin: e.target.value }
                    })}
                    placeholder="LinkedIn 主页链接"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
