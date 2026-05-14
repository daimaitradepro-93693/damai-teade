import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: '博客 - 大迈国际贸易有限公司',
  description: '国际贸易资讯、行业动态、产品知识分享',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
