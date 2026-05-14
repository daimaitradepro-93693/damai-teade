'use client';

import Link from 'next/link';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

const footerLinks = {
  products: [
    { label: '机械设备', href: '/products/1' },
    { label: '电子产品', href: '/products/1' },
    { label: '纺织品', href: '/products/1' },
    { label: '化工产品', href: '/products/1' },
  ],
  services: [
    { label: '进出口代理', href: '/#services' },
    { label: '国际物流', href: '/#services' },
    { label: '报关报检', href: '/#services' },
    { label: '跨境电商', href: '/#services' },
  ],
  support: [
    { label: '退换货政策', href: '/return-policy' },
    { label: '配送政策', href: '/shipping-policy' },
    { label: '使用条款', href: '/terms' },
  ],
  tools: [
    { label: '报价计算器', href: '/quote' },
    { label: '物流追踪', href: '/tracking' },
    { label: 'VAT计算器', href: '/vat-calculator' },
    { label: '电子发票', href: '/invoices' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">大迈国际贸易有限公司</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              专业从事机械设备、电子产品、纺织品等进出口贸易，
              提供一站式国际贸易解决方案，服务全球客户。
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+86 159-9966-0432</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@damai-trade.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>海南省海口市龙华区国贸路1号</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">产品中心</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.products.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">服务项目</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.services.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Tools */}
          <div>
            <h4 className="font-semibold mb-4">帮助中心</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.tools.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="font-semibold mb-4">订阅资讯</h4>
            <p className="text-gray-400 text-sm mb-3">获取最新产品信息和优惠活动</p>
            <form className="flex gap-2" onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.target as HTMLFormElement).email.value;
              if (email) {
                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  });
                  if (res.ok) {
                    alert('订阅成功！');
                    (e.target as HTMLFormElement).reset();
                  }
                } catch {
                  alert('订阅失败，请稍后重试');
                }
              }
            }}>
              <input 
                type="email" 
                name="email"
                placeholder="请输入邮箱" 
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                订阅
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 大迈国际贸易有限公司 版权所有
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">
              网站地图
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
