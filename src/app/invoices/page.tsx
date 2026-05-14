'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const mockInvoices = [
  {
    id: 'INV-2024-001',
    date: '2024-01-10',
    amount: 2580.00,
    currency: 'USD',
    status: 'paid',
    items: '电子产品 x 50',
  },
  {
    id: 'INV-2024-002',
    date: '2024-01-08',
    amount: 4500.00,
    currency: 'USD',
    status: 'pending',
    items: '机械设备 x 2',
  },
  {
    id: 'INV-2024-003',
    date: '2024-01-05',
    amount: 890.00,
    currency: 'USD',
    status: 'paid',
    items: '纺织品 x 200',
  },
];

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = mockInvoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">电子发票</h1>
          <p className="text-gray-600">查看和下载您的电子发票</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总发票数</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">已支付</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">待支付</p>
                  <p className="text-2xl font-bold text-orange-500">4</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总金额</p>
                  <p className="text-2xl font-bold">$15,680</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>发票列表</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索发票..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">发票编号</th>
                    <th className="text-left py-3 px-4">日期</th>
                    <th className="text-left py-3 px-4">商品</th>
                    <th className="text-left py-3 px-4">金额</th>
                    <th className="text-left py-3 px-4">状态</th>
                    <th className="text-left py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{invoice.id}</td>
                      <td className="py-3 px-4">{invoice.date}</td>
                      <td className="py-3 px-4">{invoice.items}</td>
                      <td className="py-3 px-4 font-semibold">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                          className={invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                        >
                          {invoice.status === 'paid' ? '已支付' : '待支付'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              发票生成后24小时内可下载PDF格式文件
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
