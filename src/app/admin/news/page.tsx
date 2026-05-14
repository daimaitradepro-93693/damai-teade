'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Star,
  Pin,
  Eye,
  Search,
  ArrowLeft,
  Calendar,
  User,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface News {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  image: string;
  author: string;
  pinned: boolean;
  featured: boolean;
  views: number;
  status: string;
  publishedAt: string;
  createdAt: string;
}

interface NewsForm {
  title: string;
  titleEn: string;
  category: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  image: string;
  author: string;
  pinned: boolean;
  featured: boolean;
}

const defaultForm: NewsForm = {
  title: '',
  titleEn: '',
  category: '',
  summary: '',
  summaryEn: '',
  content: '',
  contentEn: '',
  image: '',
  author: '大迈国际贸易',
  pinned: false,
  featured: false,
};

const categoryOptions = [
  { zh: '公司动态', en: 'Company News' },
  { zh: '行业资讯', en: 'Industry News' },
  { zh: '产品发布', en: 'Product Release' },
  { zh: '展会活动', en: 'Exhibition' },
  { zh: '合作伙伴', en: 'Partners' },
];

export default function NewsAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNews, setSelectedNews] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [form, setForm] = useState<NewsForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchNews();
  }, [router]);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) {
        setNews(data.data);
        setCategories(data.categories || categoryOptions.map(c => c.zh));
      }
    } catch (error) {
      console.error('获取新闻失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  const filteredNews = news.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSelect = (id: string) => {
    setSelectedNews(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNews.length === filteredNews.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(filteredNews.map(n => n.id));
    }
  };

  const batchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedNews.length} 条新闻吗？`)) return;
    
    try {
      await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedNews, action: 'batchDelete' })
      });
      setSelectedNews([]);
      fetchNews();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const togglePinned = async (item: News) => {
    try {
      await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [item.id],
          action: 'batchUpdate',
          data: { pinned: !item.pinned }
        })
      });
      fetchNews();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const toggleFeatured = async (item: News) => {
    try {
      await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [item.id],
          action: 'batchUpdate',
          data: { featured: !item.featured }
        })
      });
      fetchNews();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingNews(null);
    setShowAddModal(true);
  };

  const openEditModal = (item: News) => {
    setForm({
      title: item.title,
      titleEn: item.titleEn,
      category: item.category,
      summary: item.summary,
      summaryEn: item.summaryEn || '',
      content: item.content,
      contentEn: item.contentEn || '',
      image: item.image,
      author: item.author,
      pinned: item.pinned,
      featured: item.featured,
    });
    setEditingNews(item);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) {
      alert('请填写新闻标题和分类');
      return;
    }

    setSaving(true);
    try {
      const categoryInfo = categoryOptions.find(c => c.zh === form.category);
      const newsData = {
        title: form.title,
        titleEn: form.titleEn,
        category: form.category,
        categoryEn: categoryInfo?.en || form.category,
        summary: form.summary,
        summaryEn: form.summaryEn,
        content: form.content,
        contentEn: form.contentEn,
        image: form.image,
        author: form.author,
        pinned: form.pinned,
        featured: form.featured,
      };

      if (editingNews) {
        // 更新新闻
        await fetch('/api/news', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ids: [editingNews.id],
            action: 'batchUpdate',
            data: newsData
          })
        });
      } else {
        // 添加新新闻
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsData)
        });
      }

      setShowAddModal(false);
      fetchNews();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('确定删除此新闻？')) return;
    try {
      await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], action: 'batchDelete' })
      });
      fetchNews();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">新闻管理</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            退出登录
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索新闻标题..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Batch Actions */}
            {selectedNews.length > 0 && (
              <button
                onClick={batchDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                批量删除 ({selectedNews.length})
              </button>
            )}

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加新闻
            </button>
          </div>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">新闻</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">置顶</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">热门</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">浏览量</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">发布时间</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredNews.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedNews.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{item.titleEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePinned(item)}
                        className={`p-1 rounded ${item.pinned ? 'text-red-500' : 'text-gray-300'}`}
                        title="置顶"
                      >
                        <Pin className="w-5 h-5 fill-current" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(item)}
                        className={`p-1 rounded ${item.featured ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNews(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredNews.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无新闻</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">新闻总数</p>
            <p className="text-2xl font-bold text-gray-900">{news.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">置顶新闻</p>
            <p className="text-2xl font-bold text-red-500">{news.filter(n => n.pinned).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">热门新闻</p>
            <p className="text-2xl font-bold text-yellow-500">{news.filter(n => n.featured).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">总浏览量</p>
            <p className="text-2xl font-bold text-green-500">
              {news.reduce((sum, n) => sum + n.views, 0)}
            </p>
          </div>
        </div>
      </main>

      {/* 添加/编辑新闻弹窗 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {editingNews ? '编辑新闻' : '添加新闻'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新闻标题（中文）<span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="输入中文标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新闻标题（英文）
                </label>
                <Input
                  value={form.titleEn}
                  onChange={e => setForm({...form, titleEn: e.target.value})}
                  placeholder="输入英文标题"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新闻分类<span className="text-red-500">*</span>
                </label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat.zh} value={cat.zh}>{cat.zh}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作者
                </label>
                <Input
                  value={form.author}
                  onChange={e => setForm({...form, author: e.target.value})}
                  placeholder="输入作者名称"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                封面图片URL
              </label>
              <Input
                value={form.image}
                onChange={e => setForm({...form, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                摘要（中文）
              </label>
              <Textarea
                value={form.summary}
                onChange={e => setForm({...form, summary: e.target.value})}
                placeholder="输入新闻摘要"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                摘要（英文）
              </label>
              <Textarea
                value={form.summaryEn}
                onChange={e => setForm({...form, summaryEn: e.target.value})}
                placeholder="输入英文摘要"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                新闻内容（中文）
              </label>
              <Textarea
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                placeholder="输入新闻正文内容"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                新闻内容（英文）
              </label>
              <Textarea
                value={form.contentEn}
                onChange={e => setForm({...form, contentEn: e.target.value})}
                placeholder="输入英文正文内容"
                rows={6}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={form.pinned}
                  onChange={e => setForm({...form, pinned: e.target.checked})}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="pinned" className="text-sm text-gray-700 flex items-center gap-1">
                  <Pin className="w-4 h-4" />
                  置顶
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm({...form, featured: e.target.checked})}
                  className="w-4 h-4 text-yellow-600 rounded"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  热门
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
