'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Eye,
  Truck,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Mail,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Order {
  id: string;
  orderNo: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    type: 'B2B' | 'B2C';
    level?: string;
  };
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    currency: string;
  };
  shipping: {
    method: string;
    carrier?: string;
    trackingNumber?: string;
    address: {
      country: string;
      city: string;
      address: string;
    };
  };
  payment: {
    method: string;
    status: string;
  };
  status: string;
  statusHistory: { status: string; time: string; note?: string }[];
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: '待确认', color: 'bg-yellow-500', icon: <Clock className="w-4 h-4" /> },
  confirmed: { label: '已确认', color: 'bg-blue-500', icon: <CheckCircle className="w-4 h-4" /> },
  paid: { label: '已付款', color: 'bg-green-500', icon: <DollarSign className="w-4 h-4" /> },
  processing: { label: '处理中', color: 'bg-purple-500', icon: <Package className="w-4 h-4" /> },
  shipped: { label: '已发货', color: 'bg-indigo-500', icon: <Truck className="w-4 h-4" /> },
  delivered: { label: '已送达', color: 'bg-emerald-500', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: '已取消', color: 'bg-red-500', icon: <XCircle className="w-4 h-4" /> },
  refunded: { label: '已退款', color: 'bg-gray-500', icon: <AlertCircle className="w-4 h-4" /> },
};

export default function OrdersAdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0,
    totalAmount: 0, b2bCount: 0, b2cCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !search || 
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesType = typeFilter === 'all' || o.customer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: updateStatus,
          trackingNumber
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        setShowDetail(false);
        setTrackingNumber('');
      }
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency === 'CNY' ? 'CNY' : currency
    }).format(amount);
  };

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
            <h1 className="text-xl font-bold">订单管理</h1>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">总订单</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">待处理</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-gray-400">运输中</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.shipped}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">已完成</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.delivered}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">B2B/B2C</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.b2bCount}/{stats.b2cCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">总金额</span>
              </div>
              <p className="text-2xl font-bold mt-1">${stats.totalAmount.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索订单号、客户名、邮箱..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                  <SelectValue placeholder="订单状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待确认</SelectItem>
                  <SelectItem value="paid">已付款</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="shipped">已发货</SelectItem>
                  <SelectItem value="delivered">已送达</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                  <SelectValue placeholder="客户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="B2B">B2B客户</SelectItem>
                  <SelectItem value="B2C">B2C客户</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 订单列表 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-400">订单号</TableHead>
                  <TableHead className="text-gray-400">客户信息</TableHead>
                  <TableHead className="text-gray-400">商品</TableHead>
                  <TableHead className="text-gray-400">金额</TableHead>
                  <TableHead className="text-gray-400">支付</TableHead>
                  <TableHead className="text-gray-400">状态</TableHead>
                  <TableHead className="text-gray-400">日期</TableHead>
                  <TableHead className="text-gray-400">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      暂无订单
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium">{order.orderNo}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            {order.customer.name}
                            <Badge variant={order.customer.type === 'B2B' ? 'default' : 'secondary'} className="text-xs">
                              {order.customer.type}
                            </Badge>
                            {order.customer.level && (
                              <Badge className="text-xs bg-amber-500">{order.customer.level}</Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{order.customer.email}</div>
                          {order.customer.company && (
                            <div className="text-xs text-gray-500">{order.customer.company}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.map((item, i) => (
                            <div key={i}>{item.productName} x{item.quantity}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(order.pricing.total, order.pricing.currency)}
                        </div>
                        {order.pricing.discount > 0 && (
                          <div className="text-xs text-green-400">
                            优惠 -{formatCurrency(order.pricing.discount, order.pricing.currency)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.payment.method}</div>
                        <Badge 
                          className={`text-xs ${order.payment.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        >
                          {order.payment.status === 'paid' ? '已付款' : '待付款'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[order.status]?.color} text-white`}>
                          <span className="flex items-center gap-1">
                            {statusConfig[order.status]?.icon}
                            {statusConfig[order.status]?.label}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrder(order);
                            setUpdateStatus(order.status);
                            setShowDetail(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 订单详情弹窗 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>订单详情 - {selectedOrder?.orderNo}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* 客户信息 */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">客户信息</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><span className="text-gray-400">姓名：</span>{selectedOrder.customer.name}</p>
                    <p><span className="text-gray-400">邮箱：</span>{selectedOrder.customer.email}</p>
                    <p><span className="text-gray-400">电话：</span>{selectedOrder.customer.phone}</p>
                    {selectedOrder.customer.company && (
                      <p><span className="text-gray-400">公司：</span>{selectedOrder.customer.company}</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">收货地址</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p>{selectedOrder.shipping.address.country}, {selectedOrder.shipping.address.city}</p>
                    <p>{selectedOrder.shipping.address.address}</p>
                    {selectedOrder.shipping.trackingNumber && (
                      <p className="mt-2">
                        <span className="text-gray-400">运单号：</span>
                        <span className="text-blue-400">{selectedOrder.shipping.trackingNumber}</span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 商品列表 */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">商品明细</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-600">
                        <TableHead className="text-gray-400">商品</TableHead>
                        <TableHead className="text-gray-400">单价</TableHead>
                        <TableHead className="text-gray-400">数量</TableHead>
                        <TableHead className="text-gray-400">小计</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, i) => (
                        <TableRow key={i} className="border-gray-600">
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{formatCurrency(item.unitPrice, selectedOrder.pricing.currency)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.totalPrice, selectedOrder.pricing.currency)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 text-right space-y-1 text-sm">
                    <p>小计：{formatCurrency(selectedOrder.pricing.subtotal, selectedOrder.pricing.currency)}</p>
                    {selectedOrder.pricing.discount > 0 && (
                      <p className="text-green-400">优惠：-{formatCurrency(selectedOrder.pricing.discount, selectedOrder.pricing.currency)}</p>
                    )}
                    <p>运费：{formatCurrency(selectedOrder.pricing.shipping, selectedOrder.pricing.currency)}</p>
                    <p className="text-lg font-bold">总计：{formatCurrency(selectedOrder.pricing.total, selectedOrder.pricing.currency)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 状态历史 */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">订单状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((history, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`${statusConfig[history.status]?.color} w-2 h-2 rounded-full`} />
                        <span className="text-gray-400">{new Date(history.time).toLocaleString('zh-CN')}</span>
                        <Badge className={`${statusConfig[history.status]?.color}`}>
                          {statusConfig[history.status]?.label}
                        </Badge>
                        {history.note && <span className="text-gray-400">- {history.note}</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 更新状态 */}
              <div className="grid grid-cols-3 gap-4">
                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="输入运单号（可选）"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
                <Button onClick={handleUpdateStatus}>更新状态</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
