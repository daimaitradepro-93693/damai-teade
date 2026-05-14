'use client';

import { useState } from 'react';
import { Shield, CreditCard, Building2, Lock, Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const paymentMethods = [
  {
    id: 'paypal',
    name: 'PayPal',
    description: '全球最受欢迎的在线支付方式，安全便捷',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    url: 'https://www.paypal.com',
    features: ['即时到账', '买家保护', '多币种支持'],
    recommended: true,
  },
  {
    id: 'alibaba',
    name: '阿里巴巴 Trade Assurance',
    description: '阿里国际站官方担保交易，保障双方权益',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Alibaba_Group.svg',
    url: 'https://www.alibaba.com',
    features: ['货到付款', '质量保障', '纠纷处理'],
    recommended: false,
  },
  {
    id: 'tt',
    name: 'T/T 电汇',
    description: '传统的国际贸易付款方式，大额交易首选',
    logo: 'https://cdn-icons-png.flaticon.com/512/2338/2338769.png',
    url: '/contact',
    features: ['无手续费', '银行担保', '适合大额'],
    recommended: false,
    hasDetails: true,
    details: {
      title: 'T/T 电汇详情',
      content: 'T/T（Telegraphic Transfer）电汇是一种传统的国际贸易付款方式，通过银行电汇系统将款项直接转入供应商账户。',
      steps: [
        '客户与我司确认订单详情和总金额',
        '我司提供银行账户信息（账户名、开户行、账号）',
        '客户通过银行将款项汇入我司账户',
        '我司收到汇款水单后确认收款',
        '安排生产/备货并按约定时间发货',
      ],
      tips: '建议单笔金额超过10,000美元时使用，汇款手续费由付款方承担。',
    },
  },
  {
    id: 'lc',
    name: 'L/C 信用证',
    description: '银行信用担保，最安全的支付方式',
    logo: 'https://cdn-icons-png.flaticon.com/512/2338/2338769.png',
    url: '/contact',
    features: ['银行担保', '100%安全', '适合大额订单'],
    recommended: false,
    hasDetails: true,
    details: {
      title: 'L/C 信用证详情',
      content: 'L/C（Letter of Credit）信用证是由银行根据买方的申请，向卖方开立的一种有条件的书面付款保证。',
      steps: [
        '买卖双方签订购销合同，约定使用L/C结算',
        '买方向其银行申请开立信用证',
        '买方的银行向卖方的银行开立信用证',
        '我司按信用证要求提交单据（发票、装箱单、提单等）',
        '我司银行审核单据无误后，向我司付款',
      ],
      tips: 'L/C是最安全的支付方式，适合大额订单，建议订单金额超过50,000美元时使用。',
    },
  },
];

const steps = [
  {
    step: 1,
    title: '选择商品',
    description: '浏览产品目录，选择您需要的商品',
    icon: '📦',
  },
  {
    step: 2,
    title: '提交询价',
    description: '联系我们的销售团队获取报价',
    icon: '💬',
  },
  {
    step: 3,
    title: '确认订单',
    description: '确认商品信息、数量和价格',
    icon: '✅',
  },
  {
    step: 4,
    title: '完成支付',
    description: '选择您方便的支付方式完成付款',
    icon: '💳',
  },
  {
    step: 5,
    title: '发货验收',
    description: '我们安排发货，您验收货物',
    icon: '🚢',
  },
];

export default function PaymentPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePaymentClick = (method: typeof paymentMethods[0]) => {
    if (method.hasDetails) {
      toggleDetails(method.id);
    } else if (method.url !== '#') {
      window.open(method.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">安全支付</h1>
          <p className="text-gray-600">多种支付方式，保障您的交易安全</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-10 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-10 w-10" />
            <div>
              <h2 className="text-xl font-bold">交易安全保障</h2>
              <p className="text-blue-100">所有交易均受SSL加密保护，您的资金安全有保障</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-200" />
              <span className="text-sm">SSL加密</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-200" />
              <span className="text-sm">买家保护</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-200" />
              <span className="text-sm">银行监管</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-200" />
              <span className="text-sm">售后无忧</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">支付方式</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden ${
                method.recommended ? 'ring-2 ring-blue-500' : ''
              } ${method.hasDetails && expandedId === method.id ? 'ring-2 ring-green-500' : ''}`}
            >
              {method.recommended && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  推荐
                </div>
              )}
              <button
                onClick={() => handlePaymentClick(method)}
                className="w-full text-left"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{method.name}</h3>
                        {method.hasDetails && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            可查看详情
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {method.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <span>{method.hasDetails ? '查看详情' : '立即使用'}</span>
                    {method.hasDetails ? (
                      expandedId === method.id ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </div>
              </button>

              {method.hasDetails && expandedId === method.id && method.details && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <h4 className="font-bold text-gray-900 mb-2">{method.details.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{method.details.content}</p>
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 text-sm mb-2">操作流程：</h5>
                    <ol className="space-y-1">
                      {method.details.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">温馨提示：</span>
                      {method.details.tips}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-gray-600">
                      <span>如有疑问，请联系：</span>
                      <a href="tel:159-9966-0432" className="text-blue-600 font-medium hover:underline">159-9966-0432</a>
                    </div>
                    <a
                      href="mailto:sales@damai-trade.com"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <span>发送邮件咨询</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">交易流程</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">支付小贴士</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>首次交易建议使用 PayPal 或阿里巴巴 Trade Assurance，可享受买家保护</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>大额订单（超过10万美元）建议使用 T/T 或 L/C，通过银行监管更安全</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>支付前请务必与我司确认商品信息、价格和交货期限</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>如有任何支付问题，请联系我们的客服：159-9966-0432</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>支持多种信用卡</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <span>256位SSL加密</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>资金安全保障</span>
          </div>
        </div>
      </div>
    </div>
  );
}
