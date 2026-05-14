import { NextRequest, NextResponse } from 'next/server';

// 模拟数据
const products = [
  { id: 1, name: '工业机械设备', nameEn: 'Industrial Machinery', category: '机械设备', price: 25000 },
  { id: 2, name: '电子产品', nameEn: 'Electronics', category: '电子产品', price: 1500 },
  { id: 3, name: '纺织面料', nameEn: 'Textile Fabrics', category: '纺织品', price: 25 },
  { id: 4, name: '化工原料', nameEn: 'Chemical Materials', category: '化工产品', price: 800 },
  { id: 5, name: '食品添加剂', nameEn: 'Food Additives', category: '食品', price: 50 },
  { id: 6, name: '建材家居', nameEn: 'Building Materials', category: '建材', price: 120 },
];

const news = [
  { id: 1, title: '大迈国际贸易获得2024年度最佳进出口企业奖', category: '公司新闻' },
  { id: 2, title: '跨境电商新政策解读', category: '行业资讯' },
  { id: 3, title: '物流时效提升公告', category: '公司新闻' },
];

const pages = [
  { id: 1, title: '关于我们', path: '/about' },
  { id: 2, title: '产品中心', path: '/products' },
  { id: 3, title: '博客资讯', path: '/blog' },
  { id: 4, title: '联系我们', path: '/contact' },
  { id: 5, title: '物流追踪', path: '/tracking' },
  { id: 6, title: '报价计算器', path: '/quote' },
  { id: 7, title: 'VAT计算器', path: '/vat-calculator' },
  { id: 8, title: 'HS编码查询', path: '/hscode' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({
      success: true,
      data: {
        products: [],
        news: [],
        pages: [],
      }
    });
  }

  // 搜索产品
  const matchedProducts = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.nameEn.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  // 搜索新闻
  const matchedNews = news.filter(n => 
    n.title.toLowerCase().includes(query) ||
    n.category.toLowerCase().includes(query)
  );

  // 搜索页面
  const matchedPages = pages.filter(p => 
    p.title.toLowerCase().includes(query)
  );

  return NextResponse.json({
    success: true,
    data: {
      products: matchedProducts,
      news: matchedNews,
      pages: matchedPages,
    }
  });
}
