'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Trash2,
  CheckCircle,
  Search,
  RefreshCw,
  LogOut,
  User,
  Settings,
  Package,
  FileText,
  BarChart3,
  Globe,
  ShoppingCart,
  Users,
  Newspaper,
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
  updatedAt?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 检查登录状态
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  // 获取咨询列表
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
        setFilteredInquiries(data.data);
      }
    } catch (error) {
      console.error('获取咨询失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载数据
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      fetchInquiries();
    }
  }, [fetchInquiries]);

  // 搜索和筛选
  useEffect(() => {
    let filtered = inquiries;

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.email.toLowerCase().includes(term) ||
          i.subject.toLowerCase().includes(term) ||
          i.message.toLowerCase().includes(term)
      );
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter]);

  // 查看详情
  const handleView = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailOpen(true);

    // 如果是待处理状态，标记为已读
    if (inquiry.status === 'pending') {
      await handleStatusChange(inquiry.id, 'read');
    }
  };

  // 更新状态
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: status as Inquiry['status'] });
        }
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  // 删除咨询
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条咨询吗？')) return;

    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
        if (selectedInquiry?.id === id) {
          setIsDetailOpen(false);
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 导出Excel
  const handleExportExcel = () => {
    // 生成CSV格式的数据
    const headers = ['编号', '姓名', '公司', '邮箱', '电话', '咨询主题', '咨询内容', '状态', '提交时间'];
    const rows = filteredInquiries.map((inquiry, index) => [
      index + 1,
      inquiry.name,
      inquiry.company || '-',
      inquiry.email,
      inquiry.phone || '-',
      inquiry.subject,
      inquiry.message,
      inquiry.status === 'pending' ? '待处理' : inquiry.status === 'read' ? '已查看' : '已回复',
      formatDate(inquiry.createdAt)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // 添加BOM以支持Excel正确显示中文
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `咨询记录_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 登出
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">待处理</Badge>;
      case 'read':
        return <Badge variant="default">已查看</Badge>;
      case 'replied':
        return <Badge variant="secondary">已回复</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  // 统计数据
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === 'pending').length,
    read: inquiries.filter((i) => i.status === 'read').length,
    replied: inquiries.filter((i) => i.status === 'replied').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">管理后台</h1>
              <nav className="flex items-center gap-4 text-sm">
                <a href="/admin" className="flex items-center gap-1 text-blue-600 font-medium">
                  <MessageSquare className="w-4 h-4" />
                  咨询管理
                </a>
                <a href="/admin/products" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <Package className="w-4 h-4" />
                  产品管理
                </a>
                <a href="/admin/orders" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <ShoppingCart className="w-4 h-4" />
                  订单管理
                </a>
                <a href="/admin/members" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <Users className="w-4 h-4" />
                  会员管理
                </a>
                <a href="/admin/rfq" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <FileText className="w-4 h-4" />
                  RFQ询盘
                </a>
                <a href="/admin/news" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <Newspaper className="w-4 h-4" />
                  新闻管理
                </a>
                <a href="/admin/analytics" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <BarChart3 className="w-4 h-4" />
                  数据看板
                </a>
                <a href="/admin/audit-logs" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <FileText className="w-4 h-4" />
                  操作日志
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.push('/')} variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                查看网站
              </Button>
              <Button onClick={() => router.push('/admin/settings')} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                网站设置
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-500">总咨询数</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
              <p className="text-sm text-gray-500">待处理</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.read}</div>
              <p className="text-sm text-gray-500">已查看</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
              <p className="text-sm text-gray-500">已回复</p>
            </CardContent>
          </Card>
        </div>

        {/* 筛选和搜索 */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索姓名、邮箱、主题或内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  全部
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  待处理
                </Button>
                <Button
                  variant={statusFilter === 'read' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('read')}
                >
                  已查看
                </Button>
                <Button
                  variant={statusFilter === 'replied' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('replied')}
                >
                  已回复
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                  className="ml-2"
                >
                  导出Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 咨询列表 */}
        <Card>
          <CardHeader>
            <CardTitle>咨询列表</CardTitle>
            <CardDescription>
              共 {filteredInquiries.length} 条咨询
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">加载中...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? '没有找到匹配的咨询'
                  : '暂无咨询记录'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>状态</TableHead>
                      <TableHead>姓名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>主题</TableHead>
                      <TableHead>时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry) => (
                      <TableRow
                        key={inquiry.id}
                        className={inquiry.status === 'pending' ? 'bg-red-50' : ''}
                      >
                        <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                        <TableCell>{inquiry.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {inquiry.subject}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(inquiry)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(inquiry.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* 详情弹窗 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>咨询详情</DialogTitle>
            <DialogDescription>
              提交时间：{selectedInquiry && formatDate(selectedInquiry.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{selectedInquiry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>{selectedInquiry.subject}</span>
                </div>
              </div>

              <Separator />

              {/* 咨询内容 */}
              <div>
                <h4 className="font-medium mb-2">咨询内容</h4>
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* 状态操作 */}
              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">状态：</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <div className="flex gap-2">
                  {selectedInquiry.status !== 'read' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'read')}
                    >
                      标记已查看
                    </Button>
                  )}
                  {selectedInquiry.status !== 'replied' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(selectedInquiry.id, 'replied')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      标记已回复
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              关闭
            </Button>
            {selectedInquiry && (
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedInquiry.id)}
              >
                删除
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
