'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Lock,
  Globe,
  Truck,
  AlertCircle,
  Building,
  Wallet,
  QrCode,
  Clock,
} from 'lucide-react';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  zipCode: string;
  phone: string;
  email: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'CNY' | 'EUR'>('USD');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    state: '',
    city: '',
    address1: '',
    address2: '',
    zipCode: '',
    phone: '',
    email: '',
  });

  const [cartItems] = useState<CheckoutItem[]>([
    { id: '1', name: '日用百货套装', price: 14.99, quantity: 100 },
    { id: '2', name: '智能电子设备', price: 79.99, quantity: 20 },
    { id: '3', name: '纺织品批发', price: 7.8, quantity: 500 },
  ]);

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '💳',
      description: '安全便捷的国际支付',
      fee: '3.9% + $0.30',
    },
    {
      id: 'stripe',
      name: '信用卡 (Stripe)',
      icon: '💳',
      description: '支持 Visa, MasterCard, American Express',
      fee: '3.9% + $0.30',
    },
    {
      id: 'tt',
      name: 'T/T 电汇',
      icon: '🏦',
      description: '大额订单推荐，手续费低',
      fee: '银行手续费自理',
    },
    {
      id: 'lc',
      name: 'L/C 信用证',
      icon: '📜',
      description: '大额交易安全保障',
      fee: '银行手续费',
    },
    {
      id: 'alipay',
      name: '支付宝国际',
      icon: '📱',
      description: '中国用户首选',
      fee: '2.5%',
    },
    {
      id: 'wechat',
      name: '微信支付',
      icon: '📱',
      description: '中国用户便捷支付',
      fee: '2.5%',
    },
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CN', name: 'China' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IN', name: 'India' },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 45;
  const total = subtotal + shippingCost;

  const currencySymbols = { USD: '$', CNY: '¥', EUR: '€' };
  const exchangeRates = { USD: 1, CNY: 7.2, EUR: 0.92 };

  const formatPrice = (price: number) => {
    const converted = price * exchangeRates[currency];
    return `${currencySymbols[currency]}${converted.toFixed(2)}`;
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['firstName', 'lastName', 'country', 'city', 'address1', 'zipCode', 'phone', 'email'];
    return required.every(field => address[field as keyof ShippingAddress].trim() !== '');
  };

  const nextStep = () => {
    if (step === 'address' && validateAddress()) {
      setStep('payment');
    } else if (step === 'payment' && selectedPayment) {
      setStep('confirm');
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    // 模拟订单提交
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    router.push('/order/success?id=DM2024011800001');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部进度 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => step === 'address' ? router.back() : setStep(step === 'confirm' ? 'payment' : 'address')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              返回
            </button>
            <h1 className="text-xl font-bold">结算</h1>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-500">安全结账</span>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="flex items-center justify-center mt-6 gap-4">
            {['address', 'payment', 'confirm'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === s ? 'bg-blue-600 text-white' :
                  ['address', 'payment', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {['address', 'payment', 'confirm'].indexOf(step) > i ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`ml-2 text-sm ${step === s ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {s === 'address' ? '收货地址' : s === 'payment' ? '支付方式' : '确认订单'}
                </span>
                {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    收货地址
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">名 *</label>
                      <Input
                        value={address.firstName}
                        onChange={(e) => handleAddressChange('firstName', e.target.value)}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">姓 *</label>
                      <Input
                        value={address.lastName}
                        onChange={(e) => handleAddressChange('lastName', e.target.value)}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">公司名称 (可选)</label>
                    <Input
                      value={address.company}
                      onChange={(e) => handleAddressChange('company', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">国家/地区 *</label>
                      <Select value={address.country} onValueChange={(v) => handleAddressChange('country', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择国家" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">省/州 *</label>
                      <Input
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="State/Province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">城市 *</label>
                      <Input
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">邮编 *</label>
                      <Input
                        value={address.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        placeholder="Zip/Postal Code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">详细地址 *</label>
                    <Input
                      value={address.address1}
                      onChange={(e) => handleAddressChange('address1', e.target.value)}
                      placeholder="Street Address"
                    />
                    <Input
                      value={address.address2}
                      onChange={(e) => handleAddressChange('address2', e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">电话 *</label>
                      <Input
                        value={address.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        placeholder="+1 (xxx) xxx-xxxx"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">邮箱 *</label>
                      <Input
                        type="email"
                        value={address.email}
                        onChange={(e) => handleAddressChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">订单备注</label>
                    <Textarea placeholder="如有特殊要求请填写..." />
                  </div>

                  <Button onClick={nextStep} disabled={!validateAddress()} className="w-full">
                    继续选择支付方式
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    选择支付方式
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">手续费: {method.fee}</p>
                          {selectedPayment === method.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>大额订单建议使用T/T电汇或L/C信用证，手续费更低</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('address')}>
                      返回修改地址
                    </Button>
                    <Button onClick={nextStep} disabled={!selectedPayment} className="flex-1">
                      确认订单
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'confirm' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    确认订单
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 收货地址 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">收货地址</span>
                      <Button variant="ghost" size="sm" onClick={() => setStep('address')}>
                        修改
                      </Button>
                    </div>
                    <p className="text-gray-600">
                      {address.firstName} {address.lastName}<br />
                      {address.address1}<br />
                      {address.city}, {address.state} {address.zipCode}<br />
                      {countries.find(c => c.code === address.country)?.name}<br />
                      电话: {address.phone}<br />
                      邮箱: {address.email}
                    </p>
                  </div>

                  {/* 支付方式 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">支付方式</span>
                      <Button variant="ghost" size="sm" onClick={() => setStep('payment')}>
                        修改
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {paymentMethods.find(m => m.id === selectedPayment)?.icon}
                      </span>
                      <span>{paymentMethods.find(m => m.id === selectedPayment)?.name}</span>
                    </div>
                  </div>

                  {/* 商品列表 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="font-medium">商品清单</span>
                    <div className="mt-2 space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 条款 */}
                  <div className="text-sm text-gray-500">
                    <p>下单即表示您同意我们的</p>
                    <div className="flex gap-2 mt-1">
                      <a href="/terms" className="text-blue-600 hover:underline">使用条款</a>
                      <span>·</span>
                      <a href="/privacy" className="text-blue-600 hover:underline">隐私政策</a>
                      <span>·</span>
                      <a href="/shipping" className="text-blue-600 hover:underline">配送政策</a>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('payment')}>
                      返回修改支付方式
                    </Button>
                    <Button
                      onClick={placeOrder}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          处理中...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          提交订单 {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 订单摘要 */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">小计</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    运费 (DHL)
                  </span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>总计</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>安全支付保障</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>SSL加密传输</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>实时汇率更新</span>
                  </div>
                </div>

                {/* 货币切换 */}
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium">选择货币</label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'CNY' | 'EUR')}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD $ 美元</SelectItem>
                      <SelectItem value="CNY">CNY ¥ 人民币</SelectItem>
                      <SelectItem value="EUR">EUR € 欧元</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
