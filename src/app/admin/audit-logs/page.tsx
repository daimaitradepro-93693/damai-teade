'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  History,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  module: string;
  description: string;
  details: Record<string, unknown>;
  ip: string;
  userAgent: string;
  status: string;
}

interface ActionType {
  label: string;
  color: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTypes, setActionTypes] = useState<Record<string, ActionType>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    byModule: {} as Record<string, number>,
    byAction: {} as Record<string, number>
  });

  // 过滤条件
  const [filters, setFilters] = useState({
    module: '',
    action: '',
    status: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });
      
      const response = await fetch(`/api/audit-logs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data.logs);
        setPagination(prev => ({ ...prev, ...data.data.pagination }));
        setStats(data.data.stats);
        setActionTypes(data.data.actionTypes);
      }
    } catch (error) {
      console.error('获取日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async () => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/audit-logs?${params}`);
    const data = await response.json();
    
    if (data.success) {
      const csv = [
        '时间,用户,角色,操作,模块,描述,IP,状态',
        ...data.data.logs.map((log: AuditLog) => 
          `${log.timestamp},${log.user.name},${log.user.role},${log.action},${log.module},"${log.description}",${log.ip},${log.status}`
        )
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadge = (action: string) => {
    const actionInfo = actionTypes[action] || { label: action, color: 'gray' };
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={colorMap[actionInfo.color] || colorMap.gray}>
        {actionInfo.label}
      </Badge>
    );
  };

  const moduleOptions = ['产品管理', '订单管理', '用户管理', '询盘管理', '系统设置'];
  const actionOptions = Object.keys(actionTypes);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <History className="w-6 h-6" />
                操作日志
              </h1>
              <p className="text-gray-500 mt-1">查看系统操作记录和审计日志</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" onClick={fetchLogs}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-gray-500 text-sm">总操作数</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <div className="text-gray-500 text-sm">成功操作</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-gray-500 text-sm">失败操作</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(stats.byModule).length}
                </div>
                <div className="text-gray-500 text-sm">涉及模块</div>
              </CardContent>
            </Card>
          </div>

          {/* 筛选区域 */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">模块</label>
                    <Select value={filters.module} onValueChange={(v) => setFilters({...filters, module: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="全部模块" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部模块</SelectItem>
                        {moduleOptions.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">操作类型</label>
                    <Select value={filters.action} onValueChange={(v) => setFilters({...filters, action: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="全部操作" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部操作</SelectItem>
                        {actionOptions.map(a => (
                          <SelectItem key={a} value={a}>
                            {actionTypes[a]?.label || a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">状态</label>
                    <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部状态</SelectItem>
                        <SelectItem value="success">成功</SelectItem>
                        <SelectItem value="failed">失败</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">用户ID</label>
                    <Input
                      placeholder="输入用户ID"
                      value={filters.userId}
                      onChange={(e) => setFilters({...filters, userId: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">开始日期</label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">结束日期</label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setFilters({
                    module: '', action: '', status: '', userId: '', startDate: '', endDate: ''
                  })}>
                    重置筛选
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 日志列表 */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>用户</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>IP地址</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDate(log.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{log.user.name}</div>
                              <div className="text-xs text-gray-500">{log.user.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.module}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                        <TableCell>
                          {log.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedLog(log)}>
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

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500">
                第 {pagination.page} / {pagination.totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* 日志详情弹窗 */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>操作详情</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">时间</label>
                  <p className="font-medium">{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">状态</label>
                  <p className="flex items-center gap-1">
                    {selectedLog.status === 'success' ? (
                      <><CheckCircle className="w-4 h-4 text-green-500" /> 成功</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-500" /> 失败</>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">操作用户</label>
                  <p className="font-medium">{selectedLog.user.name}</p>
                  <p className="text-xs text-gray-500">ID: {selectedLog.user.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">用户角色</label>
                  <p className="font-medium">{selectedLog.user.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">操作类型</label>
                  <p>{getActionBadge(selectedLog.action)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">所属模块</label>
                  <p className="font-medium">{selectedLog.module}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">操作描述</label>
                <p className="font-medium">{selectedLog.description}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">详细信息</label>
                <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Monitor className="w-4 h-4" /> IP地址
                  </label>
                  <p className="font-mono">{selectedLog.ip}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">User Agent</label>
                  <p className="text-sm">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
