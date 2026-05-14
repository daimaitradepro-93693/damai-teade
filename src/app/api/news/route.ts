import { NextResponse } from 'next/server';

// 模拟数据存储
let news = [
  {
    id: 'news_001',
    title: '大迈国际贸易获得2024年度最佳进出口企业奖',
    titleEn: 'Daimai International Trade Wins 2024 Best Import-Export Enterprise Award',
    category: '公司新闻',
    categoryEn: 'Company News',
    summary: '近日，我司在2024年度国际贸博览会上荣获"最佳进出口企业"称号，这是对我司专业服务的肯定。',
    summaryEn: 'Recently, our company won the "Best Import-Export Enterprise" award at the 2024 International Trade Expo.',
    content: '近日，我司在2024年度国际贸博览会上荣获"最佳进出口企业"称号...',
    contentEn: 'Recently, our company won the "Best Import-Export Enterprise" award...',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    author: '管理员',
    pinned: true,
    featured: true,
    views: 523,
    status: 'published',
    publishedAt: '2024-12-01T08:00:00Z',
    createdAt: '2024-12-01T08:00:00Z'
  },
  {
    id: 'news_002',
    title: '海南自贸港政策解读与外贸新机遇研讨会',
    titleEn: 'Hainan Free Trade Port Policy Interpretation and New Trade Opportunities Seminar',
    category: '行业动态',
    categoryEn: 'Industry News',
    summary: '探讨海南自贸港政策对外贸企业的影响及新的发展机遇。',
    summaryEn: 'Exploring the impact of Hainan Free Trade Port policies on foreign trade enterprises.',
    content: '本次研讨会邀请了多位业内专家...',
    contentEn: 'This seminar invited several industry experts...',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    author: '管理员',
    pinned: false,
    featured: true,
    views: 386,
    status: 'published',
    publishedAt: '2024-11-28T08:00:00Z',
    createdAt: '2024-11-28T08:00:00Z'
  },
  {
    id: 'news_003',
    title: '我司成功完成首笔跨境电商订单',
    titleEn: 'Our Company Successfully Completed First Cross-Border E-commerce Order',
    category: '公司新闻',
    categoryEn: 'Company News',
    summary: '标志着公司正式开启跨境电商业务新篇章。',
    summaryEn: 'Marking the official launch of our company\'s cross-border e-commerce business.',
    content: '近日，我司成功完成了首笔跨境电商订单...',
    contentEn: 'Recently, our company successfully completed its first cross-border e-commerce order...',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    author: '管理员',
    pinned: false,
    featured: false,
    views: 245,
    status: 'published',
    publishedAt: '2024-11-25T08:00:00Z',
    createdAt: '2024-11-25T08:00:00Z'
  },
  {
    id: 'news_004',
    title: '2024年全球贸易形势分析报告',
    titleEn: '2024 Global Trade Situation Analysis Report',
    category: '市场分析',
    categoryEn: 'Market Analysis',
    summary: '深入分析当前全球贸易形势及未来发展趋势。',
    summaryEn: 'In-depth analysis of current global trade situation and future trends.',
    content: '本报告将从多个维度分析...',
    contentEn: 'This report will analyze from multiple dimensions...',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
    author: '管理员',
    pinned: false,
    featured: false,
    views: 412,
    status: 'published',
    publishedAt: '2024-11-20T08:00:00Z',
    createdAt: '2024-11-20T08:00:00Z'
  }
];

// GET - 获取新闻列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const pinned = searchParams.get('pinned');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filteredNews = [...news];

  if (category) {
    filteredNews = filteredNews.filter(n => n.category === category);
  }

  if (featured === 'true') {
    filteredNews = filteredNews.filter(n => n.featured);
  }

  if (pinned === 'true') {
    filteredNews = filteredNews.filter(n => n.pinned);
  }

  // 置顶文章排在最前
  filteredNews.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // 分页
  const total = filteredNews.length;
  const start = (page - 1) * limit;
  const paginatedNews = filteredNews.slice(start, start + limit);

  // 获取所有分类
  const categories = [...new Set(news.map(n => n.category))];

  return NextResponse.json({
    success: true,
    data: paginatedNews,
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

// POST - 添加新闻
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNews = {
      id: `news_${Date.now()}`,
      ...body,
      views: 0,
      status: 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    news.unshift(newNews);
    
    return NextResponse.json({
      success: true,
      message: '新闻添加成功',
      data: newNews
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '新闻添加失败'
    }, { status: 400 });
  }
}

// PUT - 批量更新新闻
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ids, action, data } = body;

    if (action === 'batchDelete' && ids) {
      news = news.filter(n => !ids.includes(n.id));
      return NextResponse.json({
        success: true,
        message: `成功删除 ${ids.length} 条新闻`
      });
    }

    if (action === 'batchUpdate' && ids && data) {
      news = news.map(n => 
        ids.includes(n.id) ? { ...n, ...data } : n
      );
      return NextResponse.json({
        success: true,
        message: `成功更新 ${ids.length} 条新闻`
      });
    }

    return NextResponse.json({
      success: false,
      message: '无效的操作'
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '操作失败'
    }, { status: 400 });
  }
}
