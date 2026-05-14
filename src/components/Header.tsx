'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GlobalSearch } from './GlobalSearch';
import {
  Building2,
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Phone,
  Mail,
  Globe,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
];

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/products/1', label: '产品中心' },
  { href: '/ar-factory', label: 'AR验厂' },
  { href: '/blog', label: '博客' },
  { href: '/quote', label: '报价计算' },
  { href: '/tracking', label: '物流追踪' },
  { href: '/member', label: '会员中心' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              +86 159-9966-0432
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              info@damai-trade.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-400">
                <Globe className="h-4 w-4" />
                中文
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map(lang => (
                  <DropdownMenuItem key={lang.code}>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">大迈国际</span>
              <span className="hidden md:inline text-xs text-gray-500 ml-2">DAMAI INTERNATIONAL</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/member">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin" className="hidden md:block">
              <Button variant="outline" size="sm">
                管理后台
              </Button>
            </Link>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                管理后台
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>

    <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
