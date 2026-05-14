'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  Search,
  ArrowLeft,
  Check,
  X,
  Image as ImageIcon,
  LayoutGrid,
  ChevronDown,
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
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  subcategory: string;
  description: string;
  descriptionEn: string;
  images: string[];
  price: string;
  specifications: Record<string, string>;
  featured: boolean;
  status: string;
  views: number;
  createdAt: string;
}

interface ProductForm {
  name: string;
  nameEn: string;
  category: string;
  subcategory: string;
  description: string;
  descriptionEn: string;
  price: string;
  images: string;
  specifications: string;
  featured: boolean;
}

const defaultForm: ProductForm = {
  name: '',
  nameEn: '',
  category: '',
  subcategory: '',
  description: '',
  descriptionEn: '',
  price: '',
  images: '',
  specifications: '',
  featured: false,
};

const categoryOptions = [
  '机械设备',
  '电子产品',
  '纺织品',
  '化工产品',
  '建筑材料',
  '食品饮料',
  '家居用品',
  '五金工具'
];

export default function ProductsAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setCategories(data.categories || categoryOptions);
      }
    } catch (error) {
      console.error('获取产品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || p.featured;
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const batchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedProducts.length} 个产品吗？`)) return;
    
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedProducts, action: 'batchDelete' })
      });
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [product.id],
          action: 'batchUpdate',
          data: { featured: !product.featured }
        })
      });
      fetchProducts();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setForm({
      name: product.name,
      nameEn: product.nameEn,
      category: product.category,
      subcategory: product.subcategory || '',
      description: product.description,
      descriptionEn: product.descriptionEn || '',
      price: product.price,
      images: product.images.join('\n'),
      specifications: JSON.stringify(product.specifications || {}, null, 2),
      featured: product.featured,
    });
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category) {
      alert('请填写产品名称和分类');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: form.name,
        nameEn: form.nameEn,
        category: form.category,
        subcategory: form.subcategory,
        description: form.description,
        descriptionEn: form.descriptionEn,
        price: form.price,
        images: form.images.split('\n').filter(url => url.trim()),
        specifications: form.specifications ? JSON.parse(form.specifications) : {},
        featured: form.featured,
      };

      if (editingProduct) {
        // 更新产品
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ids: [editingProduct.id],
            action: 'batchUpdate',
            data: productData
          })
        });
      } else {
        // 添加新产品
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }

      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请检查规格参数格式是否正确（JSON格式）');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('确定删除此产品？')) return;
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], action: 'batchDelete' })
      });
      fetchProducts();
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
            <Package className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">产品管理</h1>
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
                placeholder="搜索产品..."
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

            {/* Featured Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={e => setShowFeaturedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">仅显示热门</span>
            </label>

            {/* Batch Actions */}
            {selectedProducts.length > 0 && (
              <button
                onClick={batchDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                批量删除 ({selectedProducts.length})
              </button>
            )}

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加产品
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">产品</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">价格</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">热门</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">浏览量</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">添加时间</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.category}
                      {product.subcategory && (
                        <span className="text-gray-400"> / {product.subcategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      {product.price}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`p-1 rounded ${product.featured ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {product.views}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
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

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无产品</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">产品总数</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">热门产品</p>
            <p className="text-2xl font-bold text-yellow-500">{products.filter(p => p.featured).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">产品分类</p>
            <p className="text-2xl font-bold text-blue-500">{categories.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">总浏览量</p>
            <p className="text-2xl font-bold text-green-500">
              {products.reduce((sum, p) => sum + p.views, 0)}
            </p>
          </div>
        </div>
      </main>

      {/* 添加/编辑产品弹窗 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              {editingProduct ? '编辑产品' : '添加产品'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品名称（中文）<span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="输入中文名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品名称（英文）
                </label>
                <Input
                  value={form.nameEn}
                  onChange={e => setForm({...form, nameEn: e.target.value})}
                  placeholder="输入英文名称"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品分类<span className="text-red-500">*</span>
                </label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  子分类
                </label>
                <Input
                  value={form.subcategory}
                  onChange={e => setForm({...form, subcategory: e.target.value})}
                  placeholder="输入子分类"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                价格
              </label>
              <Input
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                placeholder="如：$99.00 或 面议"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品描述（中文）
              </label>
              <Textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="输入产品描述"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品描述（英文）
              </label>
              <Textarea
                value={form.descriptionEn}
                onChange={e => setForm({...form, descriptionEn: e.target.value})}
                placeholder="输入英文描述"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品图片（每行一个URL）
              </label>
              <Textarea
                value={form.images}
                onChange={e => setForm({...form, images: e.target.value})}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                规格参数（JSON格式）
              </label>
              <Textarea
                value={form.specifications}
                onChange={e => setForm({...form, specifications: e.target.value})}
                placeholder='{"尺寸": "100x50x30cm", "重量": "5kg", "材质": "不锈钢"}'
                rows={3}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={e => setForm({...form, featured: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                设为热门产品
              </label>
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
