'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher, useLanguage } from '@/i18n';
import {
  Globe,
  Ship,
  FileCheck,
  Package,
  Users,
  Award,
  TrendingUp,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle,
  ArrowRight,
  Building2,
  Handshake,
  Linkedin,
  Twitter,
  Facebook,
  Search,
  MessageCircle,
  ArrowUp,
  Bot,
  ExternalLink,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react';

import AIChat from '@/components/AIChat';

// Navigation component
function Navbar({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.products, href: '#products' },
    { label: t.nav.cases, href: '#cases' },
    { label: '博客', href: '/blog' },
    { label: 'HS编码', href: '/hscode' },
    { label: '支付', href: '/payment' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const router = useRouter();

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    } else if (href.startsWith('/')) {
      router.push(href);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">大迈国际</span>
              <span className="hidden text-xs text-gray-500 sm:block">Trade</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                {item.label}
              </button>
            ))}
            <LanguageSwitcher />
            <button
              onClick={onSearchOpen}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              title="搜索"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              title="购物车"
            >
              <Package className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
            </button>
            <button
              onClick={() => router.push('/member')}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              title="会员中心"
            >
              <Users className="h-5 w-5" />
            </button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleNavClick('#contact')}
            >
              {t.nav.consultNow}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => router.push('/cart')}
              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <Package className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
            </button>
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t bg-white py-4 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 pt-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleNavClick('#contact')}
              >
                {t.nav.consultNow}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20">
            <Globe className="mr-1 h-3 w-3" />
            {t.hero.badge}
          </Badge>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">{t.hero.companyName}</span>
            <span className="block text-blue-300">{t.hero.companyNameSub}</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-3xl text-lg text-blue-100 sm:text-xl md:text-2xl">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-white px-8 text-blue-900 hover:bg-blue-50"
              onClick={() =>
                document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t.hero.exploreServices}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-2 border-white bg-transparent px-8 text-white hover:bg-white/10"
              onClick={() =>
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t.hero.contactUs}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '10+', label: t.hero.stats.experience },
              { value: '1000+', label: t.hero.stats.cases },
              { value: '50+', label: t.hero.stats.countries },
              { value: '98%', label: t.hero.stats.satisfaction },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-12 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="h-2 w-2 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}

// Trust Badges Section
function TrustBadgesSection() {
  const { t } = useLanguage();
  
  const trustItems = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'ISO 9001认证',
      desc: '质量管理体系认证',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: '安全支付',
      desc: 'SSL加密/PayPal认证',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: '全球物流',
      desc: 'DHL/FedEx/UPS合作',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: '质量保证',
      desc: 'CE/FCC/FDA认证',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: '退换保障',
      desc: '30天无忧退换',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '24/7客服',
      desc: '全天候在线支持',
    },
  ];

  return (
    <section className="bg-white py-8 border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg p-4 text-center transition-all hover:bg-gray-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {item.icon}
              </div>
              <h4 className="mt-3 text-sm font-semibold text-gray-900">{item.title}</h4>
              <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AR Factory Tour Section
function ARFactorySection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
              🎯 创新体验
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              AR虚拟验厂
            </h2>
            <p className="mb-6 text-white/90 max-w-xl">
              足不出户，360°全景参观我们的现代化工厂和生产车间。通过AR技术，您可以身临其境地了解我们的生产流程、设备设施和质量管理体系。
            </p>
            <Link href="/ar-factory">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                开始虚拟参观
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">360°</div>
              <div className="text-sm text-white/80">全景视角</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/80">随时参观</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">HD</div>
              <div className="text-sm text-white/80">高清画质</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const { t } = useLanguage();

  const advantages = [
    {
      icon: Shield,
      title: t.about.advantages.professional.title,
      description: t.about.advantages.professional.desc,
    },
    {
      icon: Clock,
      title: t.about.advantages.efficient.title,
      description: t.about.advantages.efficient.desc,
    },
    {
      icon: TrendingUp,
      title: t.about.advantages.cost.title,
      description: t.about.advantages.cost.desc,
    },
    {
      icon: Users,
      title: t.about.advantages.service.title,
      description: t.about.advantages.service.desc,
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Content */}
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              {t.about.badge}
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              {t.about.title}
            </h2>
            <p className="mb-6 text-gray-600 leading-relaxed">
              {t.about.description1}
            </p>
            <p className="mb-8 text-gray-600 leading-relaxed">
              {t.about.description2}
            </p>

            {/* Values */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.about.vision}</h3>
              <p className="text-gray-600">
                {t.about.visionText}
              </p>
              <h3 className="text-lg font-semibold text-gray-900">{t.about.mission}</h3>
              <p className="text-gray-600">
                {t.about.missionText}
              </p>
            </div>
          </div>

          {/* Right Column - Advantages */}
          <div className="grid gap-6 sm:grid-cols-2">
            {advantages.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const { t, locale } = useLanguage();

  const services = [
    {
      icon: Package,
      title: t.services.items.importExport.title,
      description: t.services.items.importExport.description,
      features: t.services.items.importExport.features,
    },
    {
      icon: Ship,
      title: t.services.items.logistics.title,
      description: t.services.items.logistics.description,
      features: t.services.items.logistics.features,
    },
    {
      icon: FileCheck,
      title: t.services.items.customs.title,
      description: t.services.items.customs.description,
      features: t.services.items.customs.features,
    },
    {
      icon: Globe,
      title: t.services.items.ecommerce.title,
      description: t.services.items.ecommerce.description,
      features: t.services.items.ecommerce.features,
    },
    {
      icon: Shield,
      title: t.services.items.finance.title,
      description: t.services.items.finance.description,
      features: t.services.items.finance.features,
    },
    {
      icon: Handshake,
      title: t.services.items.consulting.title,
      description: t.services.items.consulting.description,
      features: t.services.items.consulting.features,
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            {t.services.badge}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {t.services.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 transition-transform group-hover:scale-110">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mb-4 text-gray-600">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Products Section
function ProductsSection() {
  const { t } = useLanguage();

  const products = [
    {
      id: 1,
      image: '/daily-goods.jpg',
      category: t.products.items.dailyGoods.category,
      title: t.products.items.dailyGoods.title,
      description: t.products.items.dailyGoods.description,
    },
    {
      id: 2,
      image: '/building-materials.jpg',
      category: t.products.items.buildingMaterials.category,
      title: t.products.items.buildingMaterials.title,
      description: t.products.items.buildingMaterials.description,
    },
    {
      id: 3,
      image: '/smart-devices.jpg',
      category: t.products.items.smartDevices.category,
      title: t.products.items.smartDevices.title,
      description: t.products.items.smartDevices.description,
    },
    {
      id: 4,
      image: '/chemical-products.jpg',
      category: t.products.items.chemicals.category,
      title: t.products.items.chemicals.title,
      description: t.products.items.chemicals.description,
    },
    {
      id: 5,
      image: '/textile-products.jpg',
      category: t.products.items.textiles.category,
      title: t.products.items.textiles.title,
      description: t.products.items.textiles.description,
    },
  ];

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{t.products.badge}</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            {t.products.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 mb-8">
            {t.products.subtitle}
          </p>
          {/* Stats */}
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">6+</div>
              <div className="text-sm text-gray-500">产品类别</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-500">合作品牌</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-500">国家覆盖</div>
            </div>
          </div>
        </div>

        {/* Products Grid - Enhanced Design */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-gray-100 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer rounded-2xl"
              onClick={() => window.location.href = '/#contact'}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-120"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                {/* Category Badge */}
                <div className="absolute left-4 top-4">
                  <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm shadow-lg px-3 py-1 font-medium">
                    {product.category}
                  </Badge>
                </div>
                {/* Hover Arrow */}
                <div className="absolute right-4 top-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 shadow-lg">
                  <ArrowRight className="w-5 h-5 text-gray-900" />
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="p-6 bg-white relative">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="mb-5 text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold transition-all duration-300 group/link"
                    onClick={(e) => { e.stopPropagation(); window.location.href = '/#contact'; }}
                  >
                    <span>{t.products.learnMore}</span>
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                  </Button>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.href = '/#contact'}
          >
            <span className="mr-2">获取完整产品目录</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t.testimonials.items.customer1.name,
      position: t.testimonials.items.customer1.position,
      company: t.testimonials.items.customer1.company,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      content: t.testimonials.items.customer1.content,
      rating: 5,
    },
    {
      name: t.testimonials.items.customer2.name,
      position: t.testimonials.items.customer2.position,
      company: t.testimonials.items.customer2.company,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      content: t.testimonials.items.customer2.content,
      rating: 5,
    },
    {
      name: t.testimonials.items.customer3.name,
      position: t.testimonials.items.customer3.position,
      company: t.testimonials.items.customer3.company,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      content: t.testimonials.items.customer3.content,
      rating: 5,
    },
  ];

  const partners = [
    '机械设备行业客户',
    '建材贸易行业客户',
    '纺织品行业客户',
    '化工产品行业客户',
    '智能设备行业客户',
    '日用百货行业客户',
  ];

  return (
    <section id="cases" className="py-20 bg-blue-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">
            {t.testimonials.badge}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {t.testimonials.title}
          </h2>
          <p className="mx-auto max-w-2xl text-blue-200">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 text-blue-50 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-200">
                      {testimonial.position}，{testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partners */}
        <div className="mt-16">
          <p className="mb-8 text-center text-blue-200">{t.testimonials.partners}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-white/10 px-6 py-3 text-white"
              >
                <Award className="mr-2 h-4 w-4" />
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(t.contact.form.error);
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError(t.contact.form.errorEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.company.trim() || t.contact.form.subjectDefault,
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || t.contact.form.error);
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(t.contact.form.errorServer);
      console.error('提交失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            {t.contact.badge}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {t.contact.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h3 className="mb-8 text-2xl font-semibold text-gray-900">
              {t.contact.contactInfo.title}
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.contactInfo.address}</h4>
                  <p className="text-gray-600">
                    {t.contact.contactInfo.addressValue}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.contactInfo.phone}</h4>
                  <p className="text-gray-600">{t.contact.contactInfo.phoneValue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.contactInfo.email}</h4>
                  <p className="text-gray-600">{t.contact.contactInfo.emailValue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.contact.contactInfo.hours}</h4>
                  <p className="text-gray-600">{t.contact.contactInfo.hoursValue1}</p>
                  <p className="text-gray-600">{t.contact.contactInfo.hoursValue2}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <h4 className="mb-4 font-semibold text-gray-900">海南省海口市</h4>
              <div className="rounded-lg overflow-hidden h-64 border border-gray-200">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=110.3%2C20.0%2C110.4%2C20.1&layer=mapnik&marker=20.0500%2C110.3500"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="公司位置地图"
                />
              </div>
              <a 
                href="https://www.openstreetmap.org/?mlat=20.0500&mlon=110.3500#map=12/20.0500/110.3500"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
                在大地图中查看
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="mb-4 font-semibold text-gray-900">{t.contact.followUs}</h4>
              <div className="flex gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                {t.contact.form.title}
              </h3>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    {t.contact.form.successTitle}
                  </h4>
                  <p className="text-gray-600">
                    {t.contact.form.successMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {t.contact.form.name}
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.contact.form.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {t.contact.form.company}
                      </label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={t.contact.form.companyPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {t.contact.form.email}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.contact.form.emailPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {t.contact.form.phone}
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t.contact.form.phonePlaceholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {t.contact.form.message}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contact.form.messagePlaceholder}
                      rows={4}
                    />
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.contact.form.submitting : t.contact.form.submit}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">大迈国际</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-white">{t.nav.about}</a></li>
              <li><a href="#services" className="hover:text-white">{t.nav.services}</a></li>
              <li><a href="#products" className="hover:text-white">{t.nav.products}</a></li>
              <li><a href="#cases" className="hover:text-white">{t.nav.cases}</a></li>
              <li><a href="#contact" className="hover:text-white">{t.nav.contact}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-white">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t.services.items.importExport.title}</li>
              <li>{t.services.items.logistics.title}</li>
              <li>{t.services.items.customs.title}</li>
              <li>{t.services.items.ecommerce.title}</li>
              <li>{t.services.items.finance.title}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-white">{t.footer.contact}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t.contact.contactInfo.phoneValue}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t.contact.contactInfo.emailValue}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{t.contact.contactInfo.addressValue}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Policy Links */}
        <div className="grid gap-8 md:grid-cols-4 mb-8 pt-8 border-t border-gray-800">
          <div>
            <h4 className="mb-4 font-semibold text-white">政策条款</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/privacy" className="hover:text-white">隐私政策</a></li>
              <li><a href="/terms" className="hover:text-white">使用条款</a></li>
              <li><a href="/return-policy" className="hover:text-white">退换货政策</a></li>
              <li><a href="/shipping-policy" className="hover:text-white">配送政策</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">工具服务</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/tracking" className="hover:text-white">物流追踪</a></li>
              <li><a href="/quote" className="hover:text-white">报价计算器</a></li>
              <li><a href="/vat-calculator" className="hover:text-white">VAT计算器</a></li>
              <li><a href="/hscode" className="hover:text-white">HS编码查询</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">会员服务</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/member" className="hover:text-white">登录/注册</a></li>
              <li><a href="/member/dashboard" className="hover:text-white">会员中心</a></li>
              <li><a href="/cart" className="hover:text-white">购物车</a></li>
              <li><a href="/invoices" className="hover:text-white">电子发票</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">内容资讯</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/blog" className="hover:text-white">博客文章</a></li>
              <li><a href="/products/1" className="hover:text-white">产品中心</a></li>
              <li><a href="/payment" className="hover:text-white">支付方式</a></li>
              <li><a href="/admin" className="hover:text-white">后台管理</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col items-center gap-4 text-sm text-gray-400">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="/sitemap.xml" className="hover:text-white">网站地图</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Main Page Component
export default function Home() {
  const { t } = useLanguage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 滚动到联系区域提示用户留言
      handleNavClick('#contact');
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
      <HeroSection />
      <TrustBadgesSection />
      <ARFactorySection />
      <AboutSection />
      <ServicesSection />
      <ProductsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/50">
          <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center p-4">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索产品、服务、资讯..."
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="border-t px-4 py-3 bg-gray-50">
              <p className="text-sm text-gray-500">
                按 Enter 搜索，或浏览我们的
                <button
                  onClick={() => { handleNavClick('#products'); setIsSearchOpen(false); }}
                  className="text-blue-600 hover:underline mx-1"
                >
                  产品
                </button>
                /
                <button
                  onClick={() => { handleNavClick('#services'); setIsSearchOpen(false); }}
                  className="text-blue-600 hover:underline mx-1"
                >
                  服务
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Buttons - Phone & Email & WhatsApp (Right side, above AI) */}
      <div className="fixed right-4 bottom-48 z-40 flex flex-col gap-3">
        {/* Phone */}
        <a
          href="tel:15999660432"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all hover:scale-110"
          title={t.contact.contactInfo.phone}
        >
          <Phone className="h-6 w-6" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-sm text-white group-hover:block">
            {t.contact.contactInfo.phoneValue}
          </span>
        </a>
        {/* WhatsApp */}
        <button
          onClick={() => setIsWhatsAppOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5A] transition-all hover:scale-110 cursor-pointer"
          title="WhatsApp"
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-sm text-white group-hover:block">
            WhatsApp在线咨询
          </span>
        </button>
        {/* Email */}
        <a
          href="mailto:daimai.tradepro@gmail.com"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all hover:scale-110"
          title={t.contact.contactInfo.email}
        >
          <Mail className="h-6 w-6" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-sm text-white group-hover:block">
            {t.contact.contactInfo.emailValue}
          </span>
        </a>
        {/* AI Chat */}
        <AIChat />
      </div>

      {/* WhatsApp QR Code Modal */}
      {isWhatsAppOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsWhatsAppOpen(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsWhatsAppOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] mb-3">
                <svg className="h-9 w-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">WhatsApp在线咨询</h3>
              <p className="text-gray-500 text-sm mt-1">扫码添加微信好友，获取专属服务</p>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-xl border-2 border-gray-100 shadow-inner">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wa.me/8615999660432?text=Hello%2C%20I%20am%20interested%20in%20your%20products`}
                  alt="WhatsApp QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            {/* Direct Link Button */}
            <a
              href="https://wa.me/8615999660432?text=Hello%2C%20I%20am%20interested%20in%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#20BD5A] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              直接打开WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-4 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700 transition-all hover:scale-110"
          aria-label="返回顶部"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
