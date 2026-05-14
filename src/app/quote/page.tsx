'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calculator,
  Package,
  DollarSign,
  Truck,
  Users,
  Info,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '100',
    unit: 'pieces',
    destination: '美国',
    shippingMethod: 'DHL',
  });
  const [quoteResult, setQuoteResult] = useState<{
    productCost: number;
    shippingCost: number;
    customsFee: number;
    total: number;
  } | null>(null);

  const handleCalculate = () => {
    // Mock calculation
    const productCost = 5.5 * parseInt(formData.quantity);
    const shippingCost = formData.destination === '美国' ? 150 : 100;
    const customsFee = productCost * 0.08;
    const total = productCost + shippingCost + customsFee;

    setQuoteResult({
      productCost,
      shippingCost,
      customsFee,
      total,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">实时报价计算器</h1>
          <p className="text-gray-600">快速获取产品价格和物流费用估算</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                产品信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>产品类型</Label>
                <select
                  className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                >
                  <option value="">请选择产品类型</option>
                  <option value="electronics">电子产品</option>
                  <option value="machinery">机械设备</option>
                  <option value="textiles">纺织品</option>
                  <option value="chemicals">化工产品</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>数量</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>单位</Label>
                  <select
                    className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="pieces">件</option>
                    <option value="kg">千克</option>
                    <option value="sets">套</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>目的地国家</Label>
                <select
                  className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  <option value="美国">美国</option>
                  <option value="英国">英国</option>
                  <option value="德国">德国</option>
                  <option value="法国">法国</option>
                  <option value="澳大利亚">澳大利亚</option>
                  <option value="日本">日本</option>
                </select>
              </div>

              <div>
                <Label>物流方式</Label>
                <select
                  className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3"
                  value={formData.shippingMethod}
                  onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                >
                  <option value="DHL">DHL国际快递</option>
                  <option value="FedEx">FedEx联邦快递</option>
                  <option value="UPS">UPS联合包裹</option>
                  <option value="顺丰">顺丰国际</option>
                </select>
              </div>

              <Button onClick={handleCalculate} className="w-full">
                计算报价
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="space-y-6">
            {quoteResult ? (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    报价结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        产品成本
                      </span>
                      <span className="font-semibold">${quoteResult.productCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        物流费用
                      </span>
                      <span className="font-semibold">${quoteResult.shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        关税预估
                      </span>
                      <span className="font-semibold">${quoteResult.customsFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-green-600 text-white rounded-lg px-3">
                      <span className="font-semibold">总计</span>
                      <span className="text-xl font-bold">${quoteResult.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded-lg text-sm text-gray-600">
                    <Info className="h-4 w-4 inline mr-2" />
                    以上为预估价格，实际价格以最终订单为准
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button className="flex-1">立即下单</Button>
                    <Button variant="outline" className="flex-1">发送询盘</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-100">
                <CardContent className="pt-6 text-center text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>填写产品信息后点击计算按钮</p>
                </CardContent>
              </Card>
            )}

            {/* B2B Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-blue-600" />
                  B2B批量采购优势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    100+件享受5%折扣
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    500+件享受10%折扣
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    1000+件享受15%折扣
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    定制订单支持OEM/ODM
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
