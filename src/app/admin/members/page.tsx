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
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Eye,
  Users,
  Crown,
  Star,
  Award,
  Diamond,
  Mail,
  Phone,
  Building,
  Globe,
  Calendar,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  CreditCard,
  MapPin,
  Tag,
} from 'lucide-react';

interface Member {
  id: string;
  type: 'B2B' | 'B2C';
  level: 'normal' | 'silver' | 'gold' | 'diamond';
  name: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  avatar?: string;
  verified: boolean;
  businessLicense?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string;
  assignedSales?: string;
  birthday?: string;
  points: number;
  totalSpent: number;
  orderCount: number;
  addresses: {
    label: string;
    country: string;
    city: string;
    address: string;
  }[];
  tags: string[];
  status: string;
  registeredAt: string;
  lastLoginAt?: string;
}

const levelConfig = {
  normal: { name: '普通会员', icon: <Star className="w-4 h-4" />, color: 'text-gray-400', bg: 'bg-gray-500' },
  silver: { name: '银牌会员', icon: <Award className="w-4 h-4" />, color: 'text-gray-300', bg: 'bg-gray-400' },
  gold: { name: '金牌会员', icon: <Crown className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500' },
  diamond: { name: '钻石会员', icon: <Diamond className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-500' }
};

export default function MembersAdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState({
    total: 0, b2bCount: 0, b2cCount: 0, activeCount: 0, verifiedCount: 0,
    levelDistribution: { normal: 0, silver: 0, gold: 0, diamond: 0 },
    totalPoints: 0, totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    fetchMembers();
  }, [router]);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取会员失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = !search || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      (m.company && m.company.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    const matchesLevel = levelFilter === 'all' || m.level === levelFilter;
    return matchesSearch && matchesType && matchesLevel;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
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
            <h1 className="text-xl font-bold">会员管理</h1>
          </div>
          <Button onClick={fetchMembers} variant="outline" size="sm">
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
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">总会员</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">B2B客户</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.b2bCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">B2C客户</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.b2cCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-gray-400">金/钻会员</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {stats.levelDistribution.gold + stats.levelDistribution.diamond}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">总消费</span>
              </div>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalSpent)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">总积分</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalPoints.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* 等级分布 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(levelConfig).map(([key, config]) => (
            <Card key={key} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  {config.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{config.name}</p>
                  <p className="text-xl font-bold">
                    {stats.levelDistribution[key as keyof typeof stats.levelDistribution]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 筛选栏 */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索姓名、邮箱、电话、公司..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
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
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600">
                  <SelectValue placeholder="会员等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  <SelectItem value="normal">普通会员</SelectItem>
                  <SelectItem value="silver">银牌会员</SelectItem>
                  <SelectItem value="gold">金牌会员</SelectItem>
                  <SelectItem value="diamond">钻石会员</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 会员列表 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-400">会员</TableHead>
                  <TableHead className="text-gray-400">类型/等级</TableHead>
                  <TableHead className="text-gray-400">联系方式</TableHead>
                  <TableHead className="text-gray-400">国家/公司</TableHead>
                  <TableHead className="text-gray-400">消费统计</TableHead>
                  <TableHead className="text-gray-400">积分</TableHead>
                  <TableHead className="text-gray-400">注册时间</TableHead>
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
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      暂无会员
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gray-600">
                              {member.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              {member.name}
                              {member.verified && (
                                <Badge className="text-xs bg-blue-500">已验证</Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={member.type === 'B2B' ? 'default' : 'secondary'}>
                            {member.type}
                          </Badge>
                          <div className={`flex items-center gap-1 ${levelConfig[member.level].color}`}>
                            {levelConfig[member.level].icon}
                            <span className="text-xs">{levelConfig[member.level].name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {member.phone}
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs truncate max-w-[150px]">{member.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            {member.country}
                          </div>
                          {member.company && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Building className="w-3 h-3" />
                              <span className="text-xs truncate max-w-[120px]">{member.company}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>消费：{formatCurrency(member.totalSpent)}</div>
                          <div className="text-gray-400">订单：{member.orderCount}笔</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          {member.points.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(member.registeredAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedMember(member);
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

      {/* 会员详情弹窗 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>会员详情</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback className="bg-gray-600 text-xl">
                    {selectedMember.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                    <Badge variant={selectedMember.type === 'B2B' ? 'default' : 'secondary'}>
                      {selectedMember.type}
                    </Badge>
                    <div className={`flex items-center gap-1 ${levelConfig[selectedMember.level].color}`}>
                      {levelConfig[selectedMember.level].icon}
                      {levelConfig[selectedMember.level].name}
                    </div>
                    {selectedMember.verified && (
                      <Badge className="bg-blue-500">已验证</Badge>
                    )}
                  </div>
                  <div className="text-gray-400 mt-1">
                    {selectedMember.company && `${selectedMember.company} · `}
                    {selectedMember.country}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 联系信息 */}
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">联系信息</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedMember.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedMember.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      注册于 {new Date(selectedMember.registeredAt).toLocaleDateString('zh-CN')}
                    </div>
                  </CardContent>
                </Card>

                {/* 消费统计 */}
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">消费统计</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">总消费</span>
                      <span className="font-bold">{formatCurrency(selectedMember.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">订单数</span>
                      <span>{selectedMember.orderCount}笔</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">积分余额</span>
                      <span className="text-yellow-400">{selectedMember.points.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* B2B专属信息 */}
              {selectedMember.type === 'B2B' && (
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">B2B企业信息</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedMember.businessLicense && (
                        <div><span className="text-gray-400">营业执照：</span>{selectedMember.businessLicense}</div>
                      )}
                      {selectedMember.taxId && (
                        <div><span className="text-gray-400">税务号：</span>{selectedMember.taxId}</div>
                      )}
                      {selectedMember.creditLimit && (
                        <div><span className="text-gray-400">信用额度：</span>{formatCurrency(selectedMember.creditLimit)}</div>
                      )}
                      {selectedMember.paymentTerms && (
                        <div><span className="text-gray-400">付款条款：</span>{selectedMember.paymentTerms}</div>
                      )}
                      {selectedMember.assignedSales && (
                        <div><span className="text-gray-400">销售代表：</span>{selectedMember.assignedSales}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 标签 */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    标签
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="border-gray-500">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 地址 */}
              {selectedMember.addresses.length > 0 && (
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      收货地址
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedMember.addresses.map((addr, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium">{addr.label}</span>
                          <span className="text-gray-400 ml-2">
                            {addr.country}, {addr.city}, {addr.address}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
