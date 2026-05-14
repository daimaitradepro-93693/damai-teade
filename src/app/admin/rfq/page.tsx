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
import { Textarea } from '@/components/ui/textarea';
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
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Globe,
  Package,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface RFQ {
  id: string;
  rfqNo: string;
  status: 'new' | 'reviewing' | 'quoted' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    country: string;
    type: 'B2B' | 'B2C';
  };
  products: {
    productName: string;
    quantity: number;
    unit?: string;
    targetPrice?: number;
    specifications?: Record<string, string>;
    notes?: string;
  }[];
  quote?: {
    totalPrice: number;
    currency: string;
    validity: string;
    paymentTerms: string;
    leadTime: string;
    items: { productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
    notes?: string;
  };
  followUps: { type: string; content: string; createdAt: string; createdBy: string }[];
  tags: string[];
  assignedTo?: string;
  createdAt: string;
}

const statusConfig = {
  new: { label: '新询盘', color: 'bg-blue-500', icon: <Clock className="w-4 h-4" /> },
  reviewing: { label: '审核中', color: 'bg-yellow-500', icon: <Eye className="w-4 h-4" /> },
  quoted: { label: '已报价', color: 'bg-purple-500', icon: <DollarSign className="w-4 h-4" /> },
  negotiating: { label: '谈判中', color: 'bg-indigo-500', icon: <MessageSquare className="w-4 h-4" /> },
  accepted: { label: '已成交', color: 'bg-green-500', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { label: '已拒绝', color: 'bg-red-500', icon: <XCircle className="w-4 h-4" /> },
  expired: { label: '已过期', color: 'bg-gray-500', icon: <AlertTriangle className="w-4 h-4" /> },
};

const priorityConfig = {
  low: { label: '低', color: 'bg-gray-400' },
  normal: { label: '普通', color: 'bg-blue-400' },
  high: { label: '高', color: 'bg-orange-400' },
  urgent: { label: '紧急', color: 'bg-red-500' },
};

export default function RFQAdminPage() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [stats, setStats] = useState({
    total: 0, new: 0, reviewing: 0, quoted: 0, negotiating: 0, accepted: 0, rejected: 0, urgent: 0, totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    currency: 'USD',
    validity: '30 days',
    paymentTerms: 'T/T 30% deposit',
    leadTime: '25 days',
    notes: ''
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    fetchRFQs();
  }, [router]);

  const fetchRFQs = async () => {
    try {
      const res = await fetch('/api/rfq');
      const data = await res.json();
      if (data.success) {
        setRfqs(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取询盘失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRFQs = rfqs.filter(r => {
    const matchesSearch = !search || 
      r.rfqNo.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateStatus = async (status: string) => {
    if (!selectedRFQ) return;
    
    try {
      const res = await fetch('/api/rfq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedRFQ.id, status })
      });
      const data = await res.json();
      if (data.success) {
        fetchRFQs();
        setSelectedRFQ(data.data);
      }
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency
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
            <h1 className="text-xl font-bold">RFQ询盘管理</h1>
          </div>
          <Button onClick={fetchRFQs} variant="outline" size="sm">
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
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">总询盘</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">新询盘</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.new}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">已报价</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.quoted}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-gray-400">谈判中</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.negotiating}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">已成交</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.accepted}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">总金额</span>
              </div>
              <p className="text-2xl font-bold mt-1">${stats.totalValue.toLocaleString()}</p>
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
                    placeholder="搜索询盘号、客户名、公司..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="new">新询盘</SelectItem>
                  <SelectItem value="reviewing">审核中</SelectItem>
                  <SelectItem value="quoted">已报价</SelectItem>
                  <SelectItem value="negotiating">谈判中</SelectItem>
                  <SelectItem value="accepted">已成交</SelectItem>
                  <SelectItem value="rejected">已拒绝</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部优先级</SelectItem>
                  <SelectItem value="urgent">紧急</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="normal">普通</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 询盘列表 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-400">询盘号</TableHead>
                  <TableHead className="text-gray-400">客户信息</TableHead>
                  <TableHead className="text-gray-400">产品需求</TableHead>
                  <TableHead className="text-gray-400">优先级</TableHead>
                  <TableHead className="text-gray-400">状态</TableHead>
                  <TableHead className="text-gray-400">报价金额</TableHead>
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
                ) : filteredRFQs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      暂无询盘
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRFQs.map((rfq) => (
                    <TableRow key={rfq.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium">{rfq.rfqNo}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            {rfq.customer.name}
                            <Badge variant={rfq.customer.type === 'B2B' ? 'default' : 'secondary'} className="text-xs">
                              {rfq.customer.type}
                            </Badge>
                          </div>
                          {rfq.customer.company && (
                            <div className="text-xs text-gray-400">{rfq.customer.company}</div>
                          )}
                          <div className="text-xs text-gray-500">{rfq.customer.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rfq.products.map((p, i) => (
                            <div key={i}>
                              {p.productName} x{p.quantity}{p.unit}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityConfig[rfq.priority].color}>
                          {priorityConfig[rfq.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[rfq.status].color} text-white`}>
                          <span className="flex items-center gap-1">
                            {statusConfig[rfq.status].icon}
                            {statusConfig[rfq.status].label}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rfq.quote ? (
                          <div className="font-medium text-green-400">
                            {formatCurrency(rfq.quote.totalPrice, rfq.quote.currency)}
                          </div>
                        ) : (
                          <span className="text-gray-500">未报价</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(rfq.createdAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedRFQ(rfq);
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

      {/* 询盘详情弹窗 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              询盘详情 - {selectedRFQ?.rfqNo}
              <Badge className={priorityConfig[selectedRFQ?.priority || 'normal'].color}>
                {priorityConfig[selectedRFQ?.priority || 'normal'].label}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRFQ && (
            <div className="space-y-4">
              {/* 状态操作栏 */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">状态：</span>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedRFQ.status === key ? 'default' : 'outline'}
                    className={selectedRFQ.status === key ? config.color : ''}
                    onClick={() => handleUpdateStatus(key)}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 客户信息 */}
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">客户信息</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {selectedRFQ.customer.name}
                      <Badge variant={selectedRFQ.customer.type === 'B2B' ? 'default' : 'secondary'}>
                        {selectedRFQ.customer.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedRFQ.customer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedRFQ.customer.phone}
                    </div>
                    {selectedRFQ.customer.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {selectedRFQ.customer.company}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {selectedRFQ.customer.country}
                    </div>
                  </CardContent>
                </Card>

                {/* 产品需求 */}
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">产品需求</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    {selectedRFQ.products.map((p, i) => (
                      <div key={i} className="p-2 bg-gray-600 rounded">
                        <div className="font-medium">{p.productName}</div>
                        <div className="text-gray-400">
                          数量: {p.quantity} {p.unit}
                          {p.targetPrice && ` · 目标价: ${p.targetPrice}`}
                        </div>
                        {p.specifications && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </div>
                        )}
                        {p.notes && <div className="text-xs text-blue-400 mt-1">{p.notes}</div>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 报价信息 */}
              {selectedRFQ.quote ? (
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      已发送报价
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-gray-400">产品</TableHead>
                          <TableHead className="text-gray-400">数量</TableHead>
                          <TableHead className="text-gray-400">单价</TableHead>
                          <TableHead className="text-gray-400">小计</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRFQ.quote.items.map((item, i) => (
                          <TableRow key={i} className="border-gray-600">
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatCurrency(item.unitPrice, selectedRFQ.quote!.currency)}</TableCell>
                            <TableCell>{formatCurrency(item.totalPrice, selectedRFQ.quote!.currency)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-between text-sm">
                      <div className="space-x-4 text-gray-400">
                        <span>有效期: {selectedRFQ.quote.validity}</span>
                        <span>付款: {selectedRFQ.quote.paymentTerms}</span>
                        <span>交期: {selectedRFQ.quote.leadTime}</span>
                      </div>
                      <div className="text-xl font-bold text-green-400">
                        总计: {formatCurrency(selectedRFQ.quote.totalPrice, selectedRFQ.quote.currency)}
                      </div>
                    </div>
                    {selectedRFQ.quote.notes && (
                      <div className="mt-2 text-sm text-gray-400 border-t border-gray-600 pt-2">
                        备注: {selectedRFQ.quote.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Button onClick={() => setShowQuote(true)} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  创建报价
                </Button>
              )}

              {/* 跟进记录 */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    跟进记录
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedRFQ.followUps.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRFQ.followUps.map((f, i) => (
                        <div key={i} className="text-sm p-2 bg-gray-600 rounded">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Badge variant="outline" className="text-xs">{f.type}</Badge>
                            <span>{new Date(f.createdAt).toLocaleString('zh-CN')}</span>
                            <span>by {f.createdBy}</span>
                          </div>
                          <div className="mt-1">{f.content}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">暂无跟进记录</div>
                  )}
                </CardContent>
              </Card>

              {/* 标签 */}
              <div className="flex items-center gap-2">
                {selectedRFQ.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-gray-500">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 报价弹窗 */}
      <Dialog open={showQuote} onOpenChange={setShowQuote}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>创建报价</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRFQ?.products.map((p, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center">
                <div className="col-span-2">{p.productName} x{p.quantity}</div>
                <Input type="number" placeholder="单价" className="bg-gray-700 border-gray-600" />
                <div className="text-right">= $0.00</div>
              </div>
            ))}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">币种</label>
                <Select value={quoteForm.currency} onValueChange={(v) => setQuoteForm({...quoteForm, currency: v})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="CNY">CNY</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400">报价有效期</label>
                <Input value={quoteForm.validity} onChange={(e) => setQuoteForm({...quoteForm, validity: e.target.value})} className="bg-gray-700 border-gray-600" />
              </div>
              <div>
                <label className="text-sm text-gray-400">付款条款</label>
                <Input value={quoteForm.paymentTerms} onChange={(e) => setQuoteForm({...quoteForm, paymentTerms: e.target.value})} className="bg-gray-700 border-gray-600" />
              </div>
              <div>
                <label className="text-sm text-gray-400">交货周期</label>
                <Input value={quoteForm.leadTime} onChange={(e) => setQuoteForm({...quoteForm, leadTime: e.target.value})} className="bg-gray-700 border-gray-600" />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">备注</label>
              <Textarea value={quoteForm.notes} onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})} className="bg-gray-700 border-gray-600" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuote(false)}>取消</Button>
            <Button onClick={() => setShowQuote(false)}>
              <Send className="w-4 h-4 mr-2" />
              发送报价
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
