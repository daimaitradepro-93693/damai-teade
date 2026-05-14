'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Globe,
  ArrowLeft,
  RefreshCw,
  Calendar,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Star,
  Target,
  Zap,
  FileText,
} from 'lucide-react';

interface DashboardStats {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    totalCustomers: number;
    customersGrowth: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  orders: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  customers: {
    b2b: number;
    b2c: number;
    new: number;
    active: number;
    levelDistribution: { normal: number; silver: number; gold: number; diamond: number };
  };
  topProducts: { name: string; sales: number; revenue: number }[];
  topCountries: { country: string; orders: number; revenue: number }[];
  recentActivity: { type: string; message: string; time: string }[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, [router, period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 模拟数据 - 实际应从API获取
      const mockStats: DashboardStats = {
        overview: {
          totalRevenue: 256890,
          revenueGrowth: 15.8,
          totalOrders: 342,
          ordersGrowth: 12.3,
          totalCustomers: 1289,
          customersGrowth: 8.5,
          conversionRate: 3.2,
          avgOrderValue: 751,
        },
        orders: {
          pending: 28,
          processing: 45,
          shipped: 67,
          delivered: 185,
          cancelled: 17,
        },
        customers: {
          b2b: 156,
          b2c: 1133,
          new: 89,
          active: 456,
          levelDistribution: { normal: 890, silver: 245, gold: 112, diamond: 42 },
        },
        topProducts: [
          { name: '日用百货套装', sales: 456, revenue: 45600 },
          { name: '智能设备套装', sales: 234, revenue: 69800 },
          { name: '纺织品批发', sales: 189, revenue: 56700 },
          { name: '建材家居套装', sales: 167, revenue: 83500 },
          { name: '电子产品配件', sales: 145, revenue: 29000 },
        ],
        topCountries: [
          { country: '美国', orders: 89, revenue: 89000 },
          { country: '中国', orders: 67, revenue: 45000 },
          { country: '法国', orders: 45, revenue: 56000 },
          { country: '日本', orders: 38, revenue: 38000 },
          { country: '德国', orders: 28, revenue: 28000 },
        ],
        recentActivity: [
          { type: 'order', message: '新订单 DM2024011800001 来自 John Smith', time: '5分钟前' },
          { type: 'rfq', message: '新询盘 RFQ2024011800001 来自 Marie Dubois', time: '12分钟前' },
          { type: 'payment', message: '订单 DM202401170003 收到T/T付款 $15,000', time: '25分钟前' },
          { type: 'shipping', message: '订单 DM202401150001 已发货 DHL123456789', time: '1小时前' },
          { type: 'customer', message: '新会员注册 张三 (深圳)', time: '2小时前' },
        ],
      };
      setStats(mockStats);
    } catch (error) {
      console.error('获取统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 顶部导航 */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              返回后台
            </Link>
            <Separator orientation="vertical" className="h-6 bg-gray-600" />
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              数据看板
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今日</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="year">本年度</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchStats} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">总营收</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(stats.overview.totalRevenue)}</p>
                  <div className={`flex items-center gap-1 mt-2 ${stats.overview.revenueGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.overview.revenueGrowth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {formatPercent(stats.overview.revenueGrowth)}
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-blue-300 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">订单总数</p>
                  <p className="text-3xl font-bold mt-1">{stats.overview.totalOrders}</p>
                  <div className={`flex items-center gap-1 mt-2 ${stats.overview.ordersGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.overview.ordersGrowth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {formatPercent(stats.overview.ordersGrowth)}
                  </div>
                </div>
                <ShoppingCart className="w-12 h-12 text-purple-300 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-200 text-sm">客户总数</p>
                  <p className="text-3xl font-bold mt-1">{stats.overview.totalCustomers.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 mt-2 ${stats.overview.customersGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.overview.customersGrowth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {formatPercent(stats.overview.customersGrowth)}
                  </div>
                </div>
                <Users className="w-12 h-12 text-emerald-300 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-amber-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">转化率</p>
                  <p className="text-3xl font-bold mt-1">{stats.overview.conversionRate}%</p>
                  <p className="text-amber-300 text-sm mt-2">客单价 {formatCurrency(stats.overview.avgOrderValue)}</p>
                </div>
                <Target className="w-12 h-12 text-amber-300 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 订单状态分布 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                订单状态分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>待处理</span>
                  </div>
                  <span className="font-bold">{stats.orders.pending}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(stats.orders.pending / stats.overview.totalOrders) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>处理中</span>
                  </div>
                  <span className="font-bold">{stats.orders.processing}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${(stats.orders.processing / stats.overview.totalOrders) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span>运输中</span>
                  </div>
                  <span className="font-bold">{stats.orders.shipped}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${(stats.orders.shipped / stats.overview.totalOrders) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>已完成</span>
                  </div>
                  <span className="font-bold">{stats.orders.delivered}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${(stats.orders.delivered / stats.overview.totalOrders) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>已取消</span>
                  </div>
                  <span className="font-bold">{stats.orders.cancelled}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(stats.orders.cancelled / stats.overview.totalOrders) * 100}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 客户分析 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                客户分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{stats.customers.b2b}</p>
                  <p className="text-sm text-gray-400">B2B客户</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">{stats.customers.b2c}</p>
                  <p className="text-sm text-gray-400">B2C客户</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">会员等级分布</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <Star className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                    <p className="font-bold">{stats.customers.levelDistribution.normal}</p>
                    <p className="text-xs text-gray-500">普通</p>
                  </div>
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <Star className="w-4 h-4 mx-auto text-gray-300 mb-1" />
                    <p className="font-bold">{stats.customers.levelDistribution.silver}</p>
                    <p className="text-xs text-gray-500">银牌</p>
                  </div>
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <Crown className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                    <p className="font-bold">{stats.customers.levelDistribution.gold}</p>
                    <p className="text-xs text-gray-500">金牌</p>
                  </div>
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <Crown className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
                    <p className="font-bold">{stats.customers.levelDistribution.diamond}</p>
                    <p className="text-xs text-gray-500">钻石</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">新客户</p>
                    <p className="text-lg font-bold">{stats.customers.new}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">活跃客户</p>
                    <p className="text-lg font-bold">{stats.customers.active}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-700 last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'order' ? 'bg-blue-900 text-blue-400' :
                      activity.type === 'payment' ? 'bg-green-900 text-green-400' :
                      activity.type === 'shipping' ? 'bg-indigo-900 text-indigo-400' :
                      activity.type === 'rfq' ? 'bg-purple-900 text-purple-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'shipping' && <Package className="w-4 h-4" />}
                      {activity.type === 'rfq' && <FileText className="w-4 h-4" />}
                      {activity.type === 'customer' && <Users className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 热销产品 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                热销产品 TOP 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      i === 0 ? 'bg-amber-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-amber-700 text-white' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">销量: {product.sales}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 主要市场 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                主要市场 TOP 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCountries.map((country, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      i === 0 ? 'bg-cyan-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-cyan-700 text-white' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{country.country}</p>
                      <p className="text-sm text-gray-400">订单: {country.orders}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(country.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
