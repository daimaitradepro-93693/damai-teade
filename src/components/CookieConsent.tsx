'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Cookie,
  X,
  Settings,
  Shield,
  Check,
} from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie_consent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie_consent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto shadow-2xl border-gray-200">
        <CardContent className="p-6">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Cookie className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">我们使用Cookie</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    我们使用Cookie和类似技术来提供、改进和个性化我们的服务。通过点击"全部接受"，您同意我们使用所有Cookie。
                    您可以点击"设置"来选择您的Cookie偏好设置。更多信息请参阅我们的
                    <Link href="/privacy" className="text-blue-600 hover:underline ml-1">隐私政策</Link>
                    和<Link href="/cookies" className="text-blue-600 hover:underline ml-1">Cookie政策</Link>。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={acceptAll}>全部接受</Button>
                    <Button variant="outline" onClick={() => setShowSettings(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      设置
                    </Button>
                    <Button variant="ghost" onClick={rejectAll}>
                      拒绝非必要Cookie
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Cookie偏好设置
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* 必要Cookie */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">必要Cookie</p>
                    <p className="text-sm text-gray-500">网站正常运行所必需的Cookie</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-500">始终启用</span>
                  </div>
                </div>

                {/* 分析Cookie */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">分析Cookie</p>
                    <p className="text-sm text-gray-500">帮助我们了解访客如何使用网站</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* 营销Cookie */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">营销Cookie</p>
                    <p className="text-sm text-gray-500">用于个性化广告和营销活动</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* 功能性Cookie */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">功能性Cookie</p>
                    <p className="text-sm text-gray-500">提供增强功能如记住偏好设置</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={acceptAll}>全部接受</Button>
                <Button variant="outline" onClick={savePreferences}>
                  保存设置
                </Button>
                <Button variant="ghost" onClick={rejectAll}>
                  拒绝非必要
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
