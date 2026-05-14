'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Truck,
  CreditCard,
  ShieldCheck,
  Calculator,
  ChevronDown,
  ChevronUp,
  Gift,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  price: number;
  quantity: number;
  moq: number;
  tierPrices: { minQty: number; price: number }[];
  attributes: Record<string, string>;
  certifications: string[];
}

interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  cost: number;
  estimatedDays: string;
  tracking: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'CNY' | 'EUR'>('USD');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showTiers, setShowTiers] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
    fetchShippingMethods();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    // 模拟购物车数据
    const mockItems: CartItem[] = [
      {
        id: '1',
        name: '日用百货套装',
        nameEn: 'Daily Necessities Set',
        image: '/products/daily-set.jpg',
        price: 15.99,
        quantity: 100,
        moq: 50,
        tierPrices: [
          { minQty: 50, price: 15.99 },
          { minQty: 100, price: 14.99 },
          { minQty: 500, price: 12.99 },
          { minQty: 1000, price: 10.99 },
        ],
        attributes: { color: 'Mixed', packaging: 'Export Carton' },
        certifications: ['CE', 'ISO9001'],
      },
      {
        id: '2',
        name: '智能电子设备',
        nameEn: 'Smart Electronic Device',
        image: '/products/electronics.jpg',
        price: 89.99,
        quantity: 20,
        moq: 10,
        tierPrices: [
          { minQty: 10, price: 89.99 },
          { minQty: 50, price: 79.99 },
          { minQty: 100, price: 69.99 },
        ],
        attributes: { voltage: '110-240V', warranty: '1 Year' },
        certifications: ['FCC', 'CE', 'RoHS'],
      },
      {
        id: '3',
        name: '纺织品批发',
        nameEn: 'Textile Wholesale',
        image: '/products/textile.jpg',
        price: 8.5,
        quantity: 500,
        moq: 100,
        tierPrices: [
          { minQty: 100, price: 8.5 },
          { minQty: 500, price: 7.8 },
          { minQty: 1000, price: 6.9 },
        ],
        attributes: { material: '100% Cotton', size: 'Custom' },
        certifications: ['OEKO-TEX'],
      },
    ];
    setCartItems(mockItems);
    setLoading(false);
  };

  const fetchShippingMethods = async () => {
    const mockMethods: ShippingMethod[] = [
      { id: 'dhl', name: 'DHL Express', carrier: 'DHL', cost: 45, estimatedDays: '3-5', tracking: true },
      { id: 'fedex', name: 'FedEx International', carrier: 'FedEx', cost: 42, estimatedDays: '4-6', tracking: true },
      { id: 'ups', name: 'UPS Worldwide', carrier: 'UPS', cost: 40, estimatedDays: '5-7', tracking: true },
      { id: 'ems', name: 'EMS China Post', carrier: 'China Post', cost: 25, estimatedDays: '10-15', tracking: true },
      { id: 'sea', name: 'Sea Freight (LCL)', carrier: 'Various', cost: 180, estimatedDays: '25-35', tracking: false },
    ];
    setShippingMethods(mockMethods);
    setSelectedShipping('dhl');
  };

  const updateQuantity = (id: string, newQty: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const qty = Math.max(item.moq, newQty);
          // 根据阶梯价格计算实际价格
          let actualPrice = item.price;
          for (const tier of item.tierPrices) {
            if (qty >= tier.minQty) {
              actualPrice = tier.price;
            }
          }
          return { ...item, quantity: qty, price: actualPrice };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTierPrice = (item: CartItem) => {
    for (const tier of item.tierPrices) {
      if (item.quantity >= tier.minQty) {
        return tier.price;
      }
    }
    return item.price;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateTierPrice(item) * item.quantity, 0);
  const shippingCost = shippingMethods.find(m => m.id === selectedShipping)?.cost || 0;
  const total = subtotal - discount + shippingCost;

  const currencySymbols = { USD: '$', CNY: '¥', EUR: '€' };
  const exchangeRates = { USD: 1, CNY: 7.2, EUR: 0.92 };

  const formatPrice = (price: number) => {
    const converted = price * exchangeRates[currency];
    return `${currencySymbols[currency]}${converted.toFixed(2)}`;
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
    } else if (couponCode.toUpperCase() === 'VIP20') {
      setDiscount(subtotal * 0.2);
    } else {
      alert('无效的优惠券代码');
    }
  };

  const checkout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              继续购物
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              购物车
              <Badge variant="secondary">{cartItems.length}</Badge>
            </h1>
            <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'CNY' | 'EUR')}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD $</SelectItem>
                <SelectItem value="CNY">CNY ¥</SelectItem>
                <SelectItem value="EUR">EUR €</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-600">购物车是空的</h2>
            <p className="text-gray-400 mt-2">快去挑选心仪的商品吧</p>
            <Button className="mt-6" onClick={() => router.push('/')}>
              去购物
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 购物车列表 */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* 产品图片 */}
                      <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Product';
                          }}
                        />
                      </div>
                      
                      {/* 产品信息 */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.nameEn}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(item.attributes).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.certifications.map((cert) => (
                                <span key={cert} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>

                        {/* 阶梯价格 */}
                        <div className="mt-3">
                          <button
                            onClick={() => setShowTiers(showTiers === item.id ? null : item.id)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Calculator className="w-4 h-4" />
                            查看阶梯价格
                            {showTiers === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {showTiers === item.id && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-gray-500">
                                    <th className="text-left">数量</th>
                                    <th className="text-right">单价</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.tierPrices.map((tier, i) => (
                                    <tr key={i} className={item.quantity >= tier.minQty ? 'text-green-600 font-medium' : ''}>
                                      <td>≥{tier.minQty}</td>
                                      <td className="text-right">{formatPrice(tier.price)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* 数量和价格 */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">MOQ: {item.moq}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 10)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || item.moq)}
                              className="w-20 text-center h-8"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 10)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{formatPrice(calculateTierPrice(item) * item.quantity)}</p>
                            <p className="text-sm text-gray-500">{formatPrice(calculateTierPrice(item))} / 件</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 订单摘要 */}
            <div className="space-y-4">
              {/* 运输方式 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    运输方式
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedShipping(method.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedShipping === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">
                            {method.tracking && <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" />}
                            {method.estimatedDays} 天
                          </p>
                        </div>
                        <p className="font-bold">{formatPrice(method.cost)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 优惠券 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    优惠券
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入优惠码"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyCoupon}>
                      应用
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 text-green-600 text-sm flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      已优惠 {formatPrice(discount)}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-gray-500">
                    试一下: SAVE10 或 VIP20
                  </div>
                </CardContent>
              </Card>

              {/* 订单摘要 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">订单摘要</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">小计 ({cartItems.length} 件)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>折扣</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>总计</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={checkout}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    结算
                  </Button>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-3">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      安全支付
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      实时汇率
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
