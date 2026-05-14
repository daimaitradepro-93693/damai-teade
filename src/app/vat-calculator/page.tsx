'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calculator,
  Globe,
  DollarSign,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const vatRates: Record<string, { rate: number; name: string }> = {
  '英国': { rate: 20, name: 'VAT' },
  '德国': { rate: 19, name: 'MwSt' },
  '法国': { rate: 20, name: 'TVA' },
  '意大利': { rate: 22, name: 'IVA' },
  '西班牙': { rate: 21, name: 'IVA' },
  '荷兰': { rate: 21, name: 'BTW' },
  '波兰': { rate: 23, name: 'PTU' },
};

export default function VATCalculatorPage() {
  const [formData, setFormData] = useState({
    amount: '',
    country: '德国',
    isVATIncluded: false,
  });
  const [result, setResult] = useState<{
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    rate: number;
  } | null>(null);

  const handleCalculate = () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return;

    const rate = vatRates[formData.country]?.rate || 19;
    
    let netAmount: number;
    let vatAmount: number;
    let grossAmount: number;

    if (formData.isVATIncluded) {
      grossAmount = amount;
      netAmount = amount / (1 + rate / 100);
      vatAmount = grossAmount - netAmount;
    } else {
      netAmount = amount;
      vatAmount = amount * (rate / 100);
      grossAmount = netAmount + vatAmount;
    }

    setResult({
      netAmount,
      vatAmount,
      grossAmount,
      rate,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VAT税务计算器</h1>
          <p className="text-gray-600">欧盟VAT增值税自动计算工具</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                计算VAT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>金额</Label>
                <Input
                  type="number"
                  placeholder="输入金额"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>国家/地区</Label>
                <select
                  className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  {Object.keys(vatRates).map((country) => (
                    <option key={country} value={country}>
                      {country} - {vatRates[country].rate}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vatIncluded"
                  checked={formData.isVATIncluded}
                  onChange={(e) => setFormData({ ...formData, isVATIncluded: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="vatIncluded" className="font-normal">
                  金额已含VAT
                </Label>
              </div>

              <Button onClick={handleCalculate} className="w-full">
                计算VAT
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="space-y-6">
            {result ? (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="h-5 w-5" />
                    计算结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span>净价（不含税）</span>
                      <span className="font-semibold">€{result.netAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span>VAT ({result.rate}%)</span>
                      <span className="font-semibold text-orange-600">€{result.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-blue-600 text-white rounded-lg px-3">
                      <span className="font-semibold">总价（含税）</span>
                      <span className="text-xl font-bold">€{result.grossAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-100">
                <CardContent className="pt-6 text-center text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>输入金额后点击计算按钮</p>
                </CardContent>
              </Card>
            )}

            {/* VAT Rates Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-5 w-5 text-blue-600" />
                  欧盟VAT税率参考
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">国家</th>
                        <th className="text-right py-2">标准税率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(vatRates).map(([country, info]) => (
                        <tr key={country} className="border-b">
                          <td className="py-2">{country}</td>
                          <td className="py-2 text-right font-medium">{info.rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">VAT合规提醒</p>
                    <p className="text-yellow-700 mt-1">
                      欧盟境内B2C交易需要收取VAT，B2B交易可申请VAT反向征收。
                      具体税务问题请咨询专业税务顾问。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
