import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemap
Sitemap: https://daimai.coze.cn/sitemap.xml

# Disallow admin routes
Disallow: /admin/
Disallow: /api/

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
