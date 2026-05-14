'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2, Package, FileText, HelpCircle, Phone, Building, Truck } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'product' | 'blog' | 'page' | 'faq' | 'contact';
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  url: string;
  icon: React.ReactNode;
  tags?: string[];
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock search data - in production, this would come from API
const searchIndex: SearchResult[] = [
  // Products
  { id: 'p1', type: 'product', title: '工业机械设备', titleEn: 'Industrial Machinery', description: '高效能工业机械设备，适用于各种生产线', url: '/products/1', icon: <Package className="h-4 w-4" />, tags: ['机械', '设备', '工业'] },
  { id: 'p2', type: 'product', title: '电子产品', titleEn: 'Electronics', description: '各类电子元器件及消费电子产品', url: '/products/2', icon: <Package className="h-4 w-4" />, tags: ['电子', '数码'] },
  { id: 'p3', type: 'product', title: '纺织品', titleEn: 'Textiles', description: '各类纺织品、面料及服装', url: '/products/3', icon: <Package className="h-4 w-4" />, tags: ['纺织', '服装'] },
  { id: 'p4', type: 'product', title: '化工产品', titleEn: 'Chemicals', description: '工业化学品及原材料', url: '/products/4', icon: <Package className="h-4 w-4" />, tags: ['化工', '原材料'] },
  { id: 'p5', type: 'product', title: '建材家居', titleEn: 'Building Materials', description: '建筑钢材、水泥、陶瓷等建材', url: '/products/5', icon: <Package className="h-4 w-4" />, tags: ['建材', '家居'] },
  { id: 'p6', type: 'product', title: '日用百货', titleEn: 'Daily Necessities', description: '各类日用消费品', url: '/products/6', icon: <Package className="h-4 w-4" />, tags: ['日用品', '百货'] },

  // Blog
  { id: 'b1', type: 'blog', title: '2024年外贸趋势分析', titleEn: '2024 Trade Trends', description: '深入分析2024年国际贸易发展趋势', url: '/blog/1', icon: <FileText className="h-4 w-4" />, tags: ['趋势', '分析'] },
  { id: 'b2', type: 'blog', title: '如何选择可靠的供应商', titleEn: 'How to Choose Reliable Suppliers', description: '供应商选择的关键要素和注意事项', url: '/blog/2', icon: <FileText className="h-4 w-4" />, tags: ['供应商', '采购'] },
  { id: 'b3', type: 'blog', title: '跨境支付方式比较', titleEn: 'Cross-border Payment Comparison', description: '各种跨境支付方式的优缺点分析', url: '/blog/3', icon: <FileText className="h-4 w-4" />, tags: ['支付', '跨境'] },

  // Pages
  { id: 'pg1', type: 'page', title: '关于我们', titleEn: 'About Us', description: '了解大迈国际贸易有限公司', url: '/#about', icon: <Building className="h-4 w-4" />, tags: ['公司', '介绍'] },
  { id: 'pg2', type: 'page', title: '产品中心', titleEn: 'Products', description: '浏览我们的全部产品', url: '/products', icon: <Package className="h-4 w-4" />, tags: ['产品'] },
  { id: 'pg3', type: 'page', title: '物流追踪', titleEn: 'Tracking', description: '查询您的订单物流状态', url: '/tracking', icon: <Truck className="h-4 w-4" />, tags: ['物流', '快递'] },
  { id: 'pg4', type: 'page', title: '报价计算器', titleEn: 'Quote Calculator', description: '获取实时产品报价', url: '/quote', icon: <FileText className="h-4 w-4" />, tags: ['报价', '价格'] },
  { id: 'pg5', type: 'page', title: '会员中心', titleEn: 'Member Center', description: '管理您的账户和订单', url: '/member/dashboard', icon: <Building className="h-4 w-4" />, tags: ['会员', '账户'] },
  { id: 'pg6', type: 'page', title: '购物车', titleEn: 'Cart', description: '查看购物车商品', url: '/cart', icon: <Package className="h-4 w-4" />, tags: ['购物'] },
  { id: 'pg7', type: 'page', title: '退换货政策', titleEn: 'Return Policy', description: '了解退换货流程和规则', url: '/return-policy', icon: <FileText className="h-4 w-4" />, tags: ['退换货', '政策'] },
  { id: 'pg8', type: 'page', title: '配送政策', titleEn: 'Shipping Policy', description: '配送方式和时效说明', url: '/shipping-policy', icon: <Truck className="h-4 w-4" />, tags: ['配送', '物流'] },
  { id: 'pg9', type: 'page', title: '隐私政策', titleEn: 'Privacy Policy', description: '数据隐私保护说明', url: '/privacy', icon: <FileText className="h-4 w-4" />, tags: ['隐私', '数据'] },
  { id: 'pg10', type: 'page', title: '使用条款', titleEn: 'Terms of Use', description: '网站使用条款和条件', url: '/terms', icon: <FileText className="h-4 w-4" />, tags: ['条款'] },
  { id: 'pg11', type: 'page', title: 'VAT税务计算器', titleEn: 'VAT Calculator', description: '欧盟VAT自动计算', url: '/vat-calculator', icon: <FileText className="h-4 w-4" />, tags: ['税务', 'VAT'] },
  { id: 'pg12', type: 'page', title: 'HS编码查询', titleEn: 'HS Code Lookup', description: '海关编码查询工具', url: '/hscode', icon: <FileText className="h-4 w-4" />, tags: ['HS', '海关'] },
  { id: 'pg13', type: 'page', title: '电子发票', titleEn: 'Invoices', description: '查看和下载电子发票', url: '/invoices', icon: <FileText className="h-4 w-4" />, tags: ['发票'] },

  // FAQ
  { id: 'f1', type: 'faq', title: '如何下单？', titleEn: 'How to order?', description: '浏览产品，加入购物车，填写收货信息，选择支付方式完成订单', url: '/#faq', icon: <HelpCircle className="h-4 w-4" />, tags: ['下单', '订单'] },
  { id: 'f2', type: 'faq', title: '支持哪些支付方式？', titleEn: 'Payment methods?', description: '支持T/T电汇、L/C信用证、PayPal、支付宝、微信等多种支付方式', url: '/payment', icon: <HelpCircle className="h-4 w-4" />, tags: ['支付'] },
  { id: 'f3', type: 'faq', title: '如何查询物流？', titleEn: 'How to track shipment?', description: '在物流追踪页面输入运单号即可查询', url: '/tracking', icon: <HelpCircle className="h-4 w-4" />, tags: ['物流', '追踪'] },
  { id: 'f4', type: 'faq', title: '起订量是多少？', titleEn: 'MOQ?', description: '不同产品起订量不同，具体请查看产品详情或咨询客服', url: '/#faq', icon: <HelpCircle className="h-4 w-4" />, tags: ['起订量', 'MOQ'] },

  // Contact
  { id: 'c1', type: 'contact', title: '联系客服', titleEn: 'Contact Us', description: '电话: 159-9966-0432 | 邮箱: daimai.tradepro@gmail.com', url: '/#contact', icon: <Phone className="h-4 w-4" />, tags: ['客服', '联系'] },
];

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);

  // Save search to recent
  const saveToRecent = useCallback((searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = searchIndex.filter(item => {
        const matchTitle = item.title.toLowerCase().includes(lowerQuery);
        const matchTitleEn = item.titleEn?.toLowerCase().includes(lowerQuery);
        const matchDesc = item.description.toLowerCase().includes(lowerQuery);
        const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        return matchTitle || matchTitleEn || matchDesc || matchTags;
      });

      setResults(filtered);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    saveToRecent(query);
    onOpenChange(false);
    setQuery('');
    router.push(result.url);
  };

  const handleRecentClick = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const typeLabels: Record<string, string> = {
    product: '产品',
    blog: '博客',
    page: '页面',
    faq: '常见问题',
    contact: '联系方式',
  };

  const typeColors: Record<string, string> = {
    product: 'bg-blue-100 text-blue-700',
    blog: 'bg-green-100 text-green-700',
    page: 'bg-purple-100 text-purple-700',
    faq: 'bg-orange-100 text-orange-700',
    contact: 'bg-pink-100 text-pink-700',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            全站搜索
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索产品、博客、页面..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-2">最近搜索</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleRecentClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>未找到相关结果</p>
              <p className="text-sm mt-1">试试其他关键词</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
                >
                  <div className="mt-0.5 text-muted-foreground">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{result.title}</span>
                      {result.titleEn && (
                        <span className="text-xs text-muted-foreground truncate">
                          ({result.titleEn})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {result.description}
                    </p>
                    {result.tags && (
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className={`text-xs ${typeColors[result.type]}`}>
                          {typeLabels[result.type]}
                        </Badge>
                        {result.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t bg-muted/50 text-xs text-muted-foreground flex justify-between">
          <span>按 ESC 关闭</span>
          <span>输入关键词搜索全站内容</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
