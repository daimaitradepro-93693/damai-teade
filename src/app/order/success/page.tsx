'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  ShoppingBag,
  Truck,
  Mail,
  Phone,
  Clock,
  Copy,
  ChevronDown,
  FileText,
  Printer,
} from 'lucide-react';

interface OrderInfo {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  currency: string;
  items: { name: string; quantity: number; price: number }[];
  shippingMethod: string;
  paymentMethod: string;
  estimatedDelivery: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'DM2024011800001';
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 模拟订单数据
    const mockOrder: OrderInfo = {
      id: orderId,
      status: 'confirmed',
      createdAt: new Date().toLocaleString('zh-CN'),
      total: 10989.00,
      currency: 'USD',
      items: [
        { name: '日用百货套装', quantity: 100, price: 14.99 },
        { name: '智能电子设备', quantity: 20, price: 79.99 },
        { name: '纺织品批发', quantity: 500, price: 7.8 },
      ],
      shippingMethod: 'DHL Express',
      paymentMethod: 'T/T 电汇',
      estimatedDelivery: '5-7个工作日',
    };
    setOrder(mockOrder);
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printOrder = () => {
    window.print();
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 成功头部 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">订单提交成功！</h1>
          <p className="text-gray-600 mt-2">感谢您的订购，我们将尽快为您处理</p>
        </div>

        {/* 订单信息卡片 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span className="font-medium">订单编号</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{order.id}</span>
                <button
                  onClick={copyOrderId}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="复制订单号"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">下单时间</span>
                <p className="font-medium">{order.createdAt}</p>
              </div>
              <div>
                <span className="text-gray-500">订单状态</span>
                <p className="font-medium text-green-600">已确认</p>
              </div>
              <div>
                <span className="text-gray-500">支付方式</span>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <span className="text-gray-500">运输方式</span>
                <p className="font-medium">{order.shippingMethod}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">预计送达时间</span>
              </div>
              <span className="font-medium">{order.estimatedDelivery}</span>
            </div>
          </CardContent>
        </Card>

        {/* 商品明细 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between"
            >
              <span className="font-medium">商品明细</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
            
            {showDetails && (
              <div className="mt-4 space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">订单总额</span>
                  <span className="text-lg font-bold text-blue-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 下一步操作 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">接下来</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium">确认付款</p>
                  <p className="text-sm text-gray-500">请按照支付指引完成付款</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-500 font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-400">订单处理</p>
                  <p className="text-sm text-gray-400">收到付款后我们将在24小时内处理</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-500 font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-400">发货通知</p>
                  <p className="text-sm text-gray-400">发货后将发送邮件通知您</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={printOrder} className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            打印订单
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            查看发票
          </Button>
          <Button onClick={() => router.push('/')} className="flex-1">
            继续购物
          </Button>
        </div>

        {/* 客服支持 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-2">如有问题，请联系我们</p>
          <div className="flex justify-center gap-4">
            <a href="mailto:support@damai.com" className="flex items-center gap-1 text-blue-600 hover:underline">
              <Mail className="w-4 h-4" />
              support@damai.com
            </a>
            <a href="tel:+86-159-9966-0432" className="flex items-center gap-1 text-blue-600 hover:underline">
              <Phone className="w-4 h-4" />
              +86-159-9966-0432
            </a>
          </div>
        </div>

        {/* 跳转链接 */}
        <div className="mt-6 text-center text-sm">
          <a href="/order/track" className="text-blue-600 hover:underline">
            查看订单状态
          </a>
          <span className="mx-2">·</span>
          <a href="/orders" className="text-blue-600 hover:underline">
            我的订单
          </a>
        </div>
      </div>
    </div>
  );
}
