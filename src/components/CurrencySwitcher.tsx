'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const currencies = [
  { code: 'CNY', symbol: '¥', name: '人民币' },
  { code: 'USD', symbol: '$', name: '美元' },
  { code: 'EUR', symbol: '€', name: '欧元' },
  { code: 'GBP', symbol: '£', name: '英镑' },
  { code: 'JPY', symbol: '¥', name: '日元' },
  { code: 'KRW', symbol: '₩', name: '韩元' },
];

const exchangeRates = {
  CNY: 1,
  USD: 0.14,
  EUR: 0.13,
  GBP: 0.11,
  JPY: 20.5,
  KRW: 185.5,
};

interface CurrencySwitcherProps {
  price?: string;
}

export function CurrencySwitcher({ price }: CurrencySwitcherProps) {
  const [currentCurrency, setCurrentCurrency] = useState('CNY');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) setCurrentCurrency(saved);
  }, []);

  const handleSelect = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem('currency', code);
    setIsOpen(false);
  };

  const current = currencies.find(c => c.code === currentCurrency);
  const rate = exchangeRates[currentCurrency as keyof typeof exchangeRates];

  // 解析价格（如果是数字，转换汇率）
  const convertPrice = () => {
    if (!price) return null;
    if (price === '面议') return price;
    
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (isNaN(numPrice)) return price;
    
    const converted = numPrice * rate;
    return `${current?.symbol}${converted.toFixed(2)}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
      >
        <span>{current?.symbol}</span>
        <span>{currentCurrency}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[120px]">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleSelect(currency.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                currency.code === currentCurrency ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span className="font-medium">{currency.symbol}</span>
              <span>{currency.code}</span>
              <span className="text-gray-500 text-xs">{currency.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function useCurrency() {
  const [currentCurrency, setCurrentCurrency] = useState('CNY');

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) setCurrentCurrency(saved);
  }, []);

  const convertPrice = (price: string) => {
    if (price === '面议') return price;
    
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (isNaN(numPrice)) return price;
    
    const current = currencies.find(c => c.code === currentCurrency);
    const rate = exchangeRates[currentCurrency as keyof typeof exchangeRates];
    const converted = numPrice * rate;
    return `${current?.symbol}${converted.toFixed(2)}`;
  };

  return { currentCurrency, setCurrentCurrency, convertPrice };
}
