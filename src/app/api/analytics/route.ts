import { NextResponse } from 'next/server';

// 模拟数据存储
interface PageStat {
  views: number;
  uniqueVisitors: number;
}

interface Visit {
  time: string;
  path: string;
  referrer: string;
}

interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  pageStats: Record<string, PageStat>;
  referrers: Record<string, number>;
  topPages: { path: string; views: number }[];
  recentVisits: Visit[];
  lastUpdated: string;
}

const analytics: Analytics = {
  pageViews: 12847,
  uniqueVisitors: 4523,
  pageStats: {
    '/': { views: 8234, uniqueVisitors: 2345 },
    '/about': { views: 1523, uniqueVisitors: 890 },
    '/services': { views: 1245, uniqueVisitors: 567 },
    '/products': { views: 987, uniqueVisitors: 423 },
    '/news': { views: 658, uniqueVisitors: 298 },
    '/contact': { views: 200, uniqueVisitors: 100 }
  },
  referrers: {
    '直接访问': 3456,
    '百度': 1234,
    '谷歌': 567,
    '其他网站': 266
  },
  topPages: [
    { path: '/', views: 8234 },
    { path: '/about', views: 1523 },
    { path: '/services', views: 1245 },
    { path: '/products', views: 987 },
    { path: '/news', views: 658 }
  ],
  recentVisits: [],
  lastUpdated: new Date().toISOString()
};

// GET - 获取统计数据
export async function GET() {
  const todayViews = Math.floor(Math.random() * 50) + 20;
  const todayVisitors = Math.floor(Math.random() * 20) + 10;

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalViews: analytics.pageViews + todayViews,
        todayViews: todayViews,
        totalVisitors: analytics.uniqueVisitors + todayVisitors,
        todayVisitors: todayVisitors,
        avgVisitDuration: '3分24秒',
        bounceRate: '42.5%'
      },
      pageStats: analytics.pageStats,
      referrers: analytics.referrers,
      topPages: analytics.topPages,
      recentVisits: analytics.recentVisits.slice(0, 20)
    },
    lastUpdated: analytics.lastUpdated
  });
}

// POST - 记录访问
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer } = body;

    // 更新页面统计
    if (!analytics.pageStats[path]) {
      analytics.pageStats[path] = { views: 0, uniqueVisitors: 0 };
    }
    analytics.pageStats[path].views++;
    analytics.pageStats[path].uniqueVisitors++;

    // 更新来源统计
    if (referrer) {
      const source = getSource(referrer);
      analytics.referrers[source] = (analytics.referrers[source] || 0) + 1;
    }

    // 更新总统计
    analytics.pageViews++;
    analytics.uniqueVisitors++;

    // 更新热门页面
    analytics.topPages = Object.entries(analytics.pageStats)
      .map(([p, stats]) => ({ path: p, views: stats.views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // 记录最近访问
    analytics.recentVisits.unshift({
      time: new Date().toISOString(),
      path: path,
      referrer: referrer || '直接访问'
    });
    analytics.recentVisits = analytics.recentVisits.slice(0, 100);

    analytics.lastUpdated = new Date().toISOString();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// 辅助函数：判断来源
function getSource(referrer: string): string {
  if (!referrer || referrer === '直接访问') return '直接访问';
  if (referrer.includes('baidu.com') || referrer.includes('baidu.cn')) return '百度';
  if (referrer.includes('google.com') || referrer.includes('google.')) return '谷歌';
  if (referrer.includes('bing.com')) return '必应';
  if (referrer.includes('sogou.com')) return '搜狗';
  return '其他网站';
}
