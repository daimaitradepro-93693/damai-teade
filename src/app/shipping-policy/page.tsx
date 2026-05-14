'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Truck,
  Globe,
  Clock,
  Package,
  MapPin,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPolicyPage() {
  const shippingMethods = [
    {
      name: 'DHL国际快递',
      time: '3-5个工作日',
      price: '按重量计算',
      desc: '适合急件，全程可追踪',
    },
    {
      name: 'FedEx联邦快递',
      time: '4-6个工作日',
      price: '按重量计算',
      desc: '北美地区优势明显',
    },
    {
      name: 'UPS联合包裹',
      time: '5-7个工作日',
      price: '按重量计算',
      desc: '全球覆盖范围广',
    },
    {
      name: '顺丰国际',
      time: '5-10个工作日',
      price: '按重量计算',
      desc: '亚洲地区性价比高',
    },
  ];

  const shippingZones = [
    { zone: '亚洲地区', time: '3-7个工作日', price: '¥50起' },
    { zone: '欧洲地区', time: '5-10个工作日', price: '¥80起' },
    { zone: '北美地区', time: '5-10个工作日', price: '¥100起' },
    { zone: '大洋洲', time: '7-12个工作日', price: '¥90起' },
    { zone: '南美地区', time: '10-15个工作日', price: '¥120起' },
    { zone: '非洲地区', time: '12-20个工作日', price: '¥150起' },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">配送政策</h1>
          <p className="text-gray-600">更新时间：2024年1月1日</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  配送方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {shippingMethods.map((method, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                      <h4 className="font-semibold">{method.name}</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{method.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{method.price}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">{method.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Zones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  配送区域及时效
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">区域</th>
                        <th className="text-left py-3 px-4">预计时效</th>
                        <th className="text-left py-3 px-4">起步价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingZones.map((zone, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{zone.zone}</td>
                          <td className="py-3 px-4">{zone.time}</td>
                          <td className="py-3 px-4">{zone.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  注意事项
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    订单金额满$200免运费（限亚洲地区）
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    所有包裹均提供物流追踪号码
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    偏远地区可能需要额外费用及更长时间
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    海关清关时间不包含在配送时效内
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  物流咨询
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>+86 159-9966-0432</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>logistics@damai-trade.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">快速链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/tracking" className="block text-sm text-blue-600 hover:underline">
                  → 物流追踪
                </Link>
                <Link href="/return-policy" className="block text-sm text-blue-600 hover:underline">
                  → 退换货政策
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
