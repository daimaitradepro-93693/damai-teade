'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<typeof mockTracking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockTracking = {
    status: '运输中',
    carrier: 'DHL国际快递',
    origin: '中国深圳',
    destination: '美国洛杉矶',
    estimatedDelivery: '2024年1月15日',
    timeline: [
      { time: '2024-01-12 14:30', status: '清关完成', location: '洛杉矶海关', completed: true },
      { time: '2024-01-11 08:00', status: '到达目的地', location: '洛杉矶转运中心', completed: true },
      { time: '2024-01-09 16:20', status: '航班起飞', location: '香港国际机场', completed: true },
      { time: '2024-01-08 10:00', status: '货物发出', location: '深圳仓库', completed: true },
    ],
  };

  const handleTrack = () => {
    if (!trackingNumber.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setTrackingData(mockTracking);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">物流追踪</h1>
          <p className="text-gray-600">实时查询您的包裹物流状态</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Search Box */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="请输入运单号（如：DHL123456789）"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  onClick={handleTrack} 
                  disabled={isLoading}
                  className="h-12 px-8"
                >
                  {isLoading ? (
                    '查询中...'
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      查询
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                支持DHL、FedEx、UPS、顺丰等主流物流商运单号查询
              </p>
            </CardContent>
          </Card>

          {/* Tracking Result */}
          {trackingData && (
            <div className="space-y-6">
              {/* Status Summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">当前状态</p>
                      <p className="font-semibold text-green-600 flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        {trackingData.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">承运商</p>
                      <p className="font-semibold">{trackingData.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">发货地</p>
                      <p className="font-semibold">{trackingData.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">目的地</p>
                      <p className="font-semibold">{trackingData.destination}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <Clock className="h-4 w-4 inline mr-2 text-blue-600" />
                      预计送达：<span className="font-semibold">{trackingData.estimatedDelivery}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    物流轨迹
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {trackingData.timeline.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-6">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {index < trackingData.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.status}</span>
                            {item.completed && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{item.location}</p>
                          <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips */}
          <Card className="mt-6 bg-gray-100">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                温馨提示
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 运单号通常在订单发货后24小时内生效</li>
                <li>• 如查询不到物流信息，请联系客服确认</li>
                <li>• 清关期间物流信息可能暂时不更新</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
