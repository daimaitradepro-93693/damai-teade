'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Package,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  Building2,
  Crown,
  Star,
  Gift,
  CreditCard,
  MapPin,
  Bell,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';

export default function MemberDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('overview');

  // 模拟用户数据
  const user = {
    name: '张先生',
    email: 'zhang@company.com',
    company: 'ABC Trading Co., Ltd.',
    level: 'gold',
    points: 2580,
    nextLevelPoints: 5000,
    memberSince: '2024-01-15',
    type: 'b2b',
  };

  // 模拟订单数据
  const recentOrders = [
    { id: 'ORD-2024-001', date: '2024-03-15', status: 'shipped', total: 15800, items: 5 },
    { id: 'ORD-2024-002', date: '2024-03-10', status: 'delivered', total: 23500, items: 8 },
    { id: 'ORD-2024-003', date: '2024-03-05', status: 'processing', total: 8900, items: 3 },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: typeof Package }> = {
      processing: { label: '处理中', className: 'bg-blue-100 text-blue-700', icon: Clock },
      shipped: { label: '已发货', className: 'bg-yellow-100 text-yellow-700', icon: Truck },
      delivered: { label: '已完成', className: 'bg-green-100 text-green-700', icon: CheckCircle },
      cancelled: { label: '已取消', className: 'bg-red-100 text-red-700', icon: XCircle },
    };
    const s = statusMap[status] || statusMap.processing;
    return (
      <Badge className={s.className}>
        <s.icon className="mr-1 h-3 w-3" />
        {s.label}
      </Badge>
    );
  };

  const menuItems = [
    { id: 'overview', label: '概览', icon: User },
    { id: 'orders', label: '我的订单', icon: Package },
    { id: 'favorites', label: '收藏夹', icon: Heart },
    { id: 'inquiries', label: '询盘记录', icon: MessageCircle },
    { id: 'points', label: '积分中心', icon: Gift },
    { id: 'addresses', label: '收货地址', icon: MapPin },
    { id: 'payment', label: '支付方式', icon: CreditCard },
    { id: 'settings', label: '账户设置', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">大迈国际</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => router.push('/')}>
              返回首页
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* User Info */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge className="mt-2 bg-yellow-100 text-yellow-700">
                    <Star className="mr-1 h-3 w-3" />
                    金卡会员
                  </Badge>
                </div>

                {/* Points Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">当前积分</span>
                    <span className="font-bold text-yellow-600">{user.points}</span>
                  </div>
                  <Progress value={(user.points / user.nextLevelPoints) * 100} className="mt-2 h-2" />
                  <p className="mt-1 text-xs text-gray-500">
                    还需 {user.nextLevelPoints - user.points} 积分升级钻石会员
                  </p>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        activeMenu === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => router.push('/member')}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm">退出登录</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="mx-auto h-8 w-8 text-blue-600" />
                  <p className="mt-2 text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-500">全部订单</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="mx-auto h-8 w-8 text-yellow-600" />
                  <p className="mt-2 text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-500">运输中</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="mx-auto h-8 w-8 text-red-600" />
                  <p className="mt-2 text-2xl font-bold">28</p>
                  <p className="text-sm text-gray-500">收藏商品</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Gift className="mx-auto h-8 w-8 text-purple-600" />
                  <p className="mt-2 text-2xl font-bold">2580</p>
                  <p className="text-sm text-gray-500">可用积分</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>近期订单</CardTitle>
                <Button variant="ghost" size="sm">
                  查看全部
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {order.date} · {order.items} 件商品
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">¥{order.total.toLocaleString()}</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <Button variant="outline" size="sm">
                          详情
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">发起询盘</p>
                    <p className="text-sm text-gray-500">获取专属报价</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">样品申请</p>
                    <p className="text-sm text-gray-500">免费获取样品</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">积分兑换</p>
                    <p className="text-sm text-gray-500">兑换优惠券</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
