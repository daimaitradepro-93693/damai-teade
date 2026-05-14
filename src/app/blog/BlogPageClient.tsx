'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Search,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

// 模拟博客数据
const blogPosts = [
  {
    id: 1,
    title: '2024年国际贸易趋势分析：跨境电商新机遇',
    excerpt: '深入分析2024年全球贸易格局变化，探讨跨境电商发展趋势和企业应对策略...',
    content: '',
    author: '李明',
    date: '2024-03-15',
    category: '行业动态',
    tags: ['国际贸易', '跨境电商', '趋势分析'],
    readTime: '8分钟',
    views: 1256,
    likes: 89,
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    featured: true,
  },
  {
    id: 2,
    title: '如何选择合适的国际物流方式？DHL vs FedEx vs UPS对比',
    excerpt: '详细对比三大国际物流公司的服务特点、价格优势和适用场景，助您做出最佳选择...',
    content: '',
    author: '王芳',
    date: '2024-03-12',
    category: '物流指南',
    tags: ['国际物流', 'DHL', 'FedEx', 'UPS'],
    readTime: '6分钟',
    views: 892,
    likes: 67,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    featured: false,
  },
  {
    id: 3,
    title: '出口退税政策解读：企业如何最大化退税收益',
    excerpt: '全面解读最新出口退税政策，分享实用的退税技巧和注意事项...',
    content: '',
    author: '张伟',
    date: '2024-03-10',
    category: '政策解读',
    tags: ['出口退税', '政策', '外贸'],
    readTime: '10分钟',
    views: 1534,
    likes: 112,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    featured: true,
  },
  {
    id: 4,
    title: '产品质量检验全流程指南：从工厂到港口',
    excerpt: '详细介绍国际贸易中产品质量检验的标准流程和关键控制点...',
    content: '',
    author: '刘洋',
    date: '2024-03-08',
    category: '质量管理',
    tags: ['质量检验', 'QC', '品控'],
    readTime: '12分钟',
    views: 678,
    likes: 45,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    featured: false,
  },
  {
    id: 5,
    title: 'RCEP协定对中小企业的影响与机遇',
    excerpt: '分析RCEP协定生效后对中小企业进出口贸易的影响和潜在机遇...',
    content: '',
    author: '陈静',
    date: '2024-03-05',
    category: '行业动态',
    tags: ['RCEP', '自贸协定', '中小企业'],
    readTime: '7分钟',
    views: 923,
    likes: 78,
    image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800',
    featured: false,
  },
  {
    id: 6,
    title: '外贸付款方式详解：L/C、T/T、D/P、D/A的区别与选择',
    excerpt: '深入解析四种主流外贸付款方式的优缺点和适用场景...',
    content: '',
    author: '赵强',
    date: '2024-03-01',
    category: '支付结算',
    tags: ['付款方式', 'L/C', 'T/T', '外贸结算'],
    readTime: '9分钟',
    views: 1876,
    likes: 156,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    featured: true,
  },
];

const categories = [
  { name: '全部', count: 24 },
  { name: '行业动态', count: 8 },
  { name: '物流指南', count: 5 },
  { name: '政策解读', count: 4 },
  { name: '质量管理', count: 3 },
  { name: '支付结算', count: 4 },
];

export default function BlogPageClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const filteredPosts =
    selectedCategory === '全部'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">大迈国际</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
              首页
            </Link>
            <Link href="/blog" className="text-sm font-medium text-blue-600">
              博客
            </Link>
            <Link href="/products" className="text-sm text-gray-600 hover:text-blue-600">
              产品
            </Link>
            <Link href="/hscode" className="text-sm text-gray-600 hover:text-blue-600">
              HS编码
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索文章..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/')}>
              返回首页
            </Button>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold">国际贸易博客</h1>
          <p className="mt-4 text-lg text-blue-100">行业资讯 · 政策解读 · 实战经验</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">精选文章</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredPosts.slice(0, 2).map((post) => (
                  <Card
                    key={post.id}
                    className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <Badge className="absolute left-4 top-4 bg-blue-600">{post.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold group-hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Posts */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">全部文章</h2>
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group cursor-pointer transition-shadow hover:shadow-lg"
                  >
                    <CardContent className="flex gap-6 p-6">
                      <div className="hidden h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg sm:block">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-gray-500">{post.readTime}</span>
                        </div>
                        <h3 className="mb-2 text-lg font-bold group-hover:text-blue-600">
                          {post.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button className="bg-blue-600">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">文章分类</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <Badge variant="secondary">{cat.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '国际贸易',
                    '跨境电商',
                    '物流',
                    'L/C',
                    'T/T',
                    '质量检验',
                    'RCEP',
                    '出口退税',
                  ].map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardContent className="p-6">
                <h3 className="mb-2 font-bold">订阅资讯</h3>
                <p className="mb-4 text-sm text-blue-100">
                  获取最新国际贸易资讯和独家分析报告
                </p>
                <Input placeholder="输入您的邮箱" className="mb-3 bg-white/90 text-gray-900" />
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  立即订阅
                </Button>
              </CardContent>
            </Card>

            {/* Social Share */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">关注我们</h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.778-.773 1.778-1.729v-20.542c0-.955-.8-1.729-1.778-1.729z" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-900 py-8 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm">© 2024 大迈国际贸易有限公司 版权所有</p>
        </div>
      </footer>
    </div>
  );
}
