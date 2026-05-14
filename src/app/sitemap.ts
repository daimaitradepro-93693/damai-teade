import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://daimai.coze.cn';
  
  const staticPages = [
    '',
    '/about',
    '/services',
    '/products',
    '/contact',
    '/categories/1',
    '/categories/2',
    '/categories/3',
    '/categories/4',
    '/categories/5',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 产品页面
  const productPages = [
    '/products/101',
    '/products/102',
    '/products/103',
    '/products/104',
    '/products/201',
    '/products/202',
    '/products/203',
    '/products/204',
    '/products/301',
    '/products/302',
    '/products/303',
    '/products/304',
    '/products/401',
    '/products/402',
    '/products/403',
    '/products/404',
    '/products/501',
    '/products/502',
    '/products/503',
    '/products/504',
  ];

  const productRoutes = productPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
