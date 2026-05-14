'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
  Shield,
  FileText,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const returnConditions = [
    { icon: Package, title: '商品完好', desc: '商品及包装完好，未使用、未拆封' },
    { icon: Clock, title: '退换期限', desc: '收货后7天内可申请退换货' },
    { icon: FileText, title: '相关凭证', desc: '需提供购买凭证和原始发票' },
    { icon: Shield, title: '质量保障', desc: '质量问题30天内免费换货' },
  ];

  const returnSteps = [
    { step: 1, title: '提交申请', desc: '登录账户，在订单详情页提交退换货申请' },
    { step: 2, title: '审核确认', desc: '客服1-2个工作日内审核申请' },
    { step: 3, title: '寄回商品', desc: '按指引将商品寄回指定地址' },
    { step: 4, title: '验收处理', desc: '收到商品后3-5个工作日内处理退款' },
  ];

  const faqs = [
    {
      q: '退换货运费由谁承担？',
      a: '因质量问题产生的退换货，运费由我司承担；因个人原因退换货，运费由买家承担。',
    },
    {
      q: '退款多久能到账？',
      a: '验收通过后，退款将在3-5个工作日内原路返回，具体到账时间取决于支付方式。',
    },
    {
      q: '定制商品可以退换吗？',
      a: '定制商品（如刻字、特殊规格）不支持无理由退换，但质量问题除外。',
    },
    {
      q: '收到商品损坏怎么办？',
      a: '请立即拍照并联系客服，我们会在24小时内处理，安排补发或退款。',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">退换货政策</h1>
          <p className="text-gray-600">更新时间：2024年1月1日</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Return Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  退换货条件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {returnConditions.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <item.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Return Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  退换货流程
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returnSteps.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-medium">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  重要说明
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    商品退回时需保持原包装完整，配件齐全
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    特价商品、清仓商品不支持退换（质量问题除外）
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    食品类、个人护理类商品非质量问题不支持退换
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    海关已清关商品退换需买家自行承担相关税费
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>常见问题</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span className="font-medium">{faq.q}</span>
                      {openFaq === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  需要帮助？
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  如果您在退换货过程中遇到任何问题，请联系我们的客服团队。
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>+86 159-9966-0432</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>support@damai-trade.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">相关链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/shipping-policy" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Truck className="h-4 w-4" />
                  配送政策
                </Link>
                <Link href="/privacy" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Shield className="h-4 w-4" />
                  隐私政策
                </Link>
                <Link href="/terms" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <FileText className="h-4 w-4" />
                  使用条款
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
