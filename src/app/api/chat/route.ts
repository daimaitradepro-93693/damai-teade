import { NextRequest, NextResponse } from 'next/server';

// 公司信息
const COMPANY_INFO = {
  name: '大迈国际贸易有限公司',
  nameEn: 'Daimai International Trade Co., Ltd.',
  phone: '159-9966-0432',
  email: 'daimai.tradepro@gmail.com',
  address: '中国海南',
  established: '2019年',
  countries: '50+',
  products: '1000+'
};

// 外贸专业术语库
const TRADE_TERMS: Record<string, { zh: string; en: string; desc: string }> = {
  'FOB': { zh: '离岸价', en: 'Free On Board', desc: '卖方将货物装上船，风险在装船时转移给买方' },
  'CIF': { zh: '到岸价', en: 'Cost Insurance and Freight', desc: '卖方支付运费和保险费到目的港' },
  'EXW': { zh: '工厂交货', en: 'Ex Works', desc: '买方承担所有费用和风险' },
  'DDP': { zh: '完税后交货', en: 'Delivered Duty Paid', desc: '卖方承担所有费用包括进口关税' },
  'LC': { zh: '信用证', en: 'Letter of Credit', desc: '银行担保付款，常用于大额交易' },
  'TT': { zh: '电汇', en: 'Telegraphic Transfer', desc: '快速安全的跨境付款方式' },
  'HS': { zh: '海关编码', en: 'Harmonized System', desc: '国际通用的商品分类编码系统' },
  'MOQ': { zh: '最低起订量', en: 'Minimum Order Quantity', desc: '供应商要求的最小订单数量' },
  'OEM': { zh: '代工生产', en: 'Original Equipment Manufacturer', desc: '按客户要求定制生产' },
  'ODM': { zh: '原创设计', en: 'Original Design Manufacturer', desc: '提供设计和生产服务' },
  'SGS': { zh: '验货服务', en: 'Société Générale de Surveillance', desc: '第三方检验机构' },
  'CIQ': { zh: '出入境检验', en: 'China Entry-Exit Inspection', desc: '中国检验检疫' }
};

// 物流时效信息
const SHIPPING_INFO = [
  { route: '中国 → 东南亚', days: '5-10天', method: '海运/空运' },
  { route: '中国 → 中东', days: '15-25天', method: '海运' },
  { route: '中国 → 欧洲', days: '25-35天', method: '海运' },
  { route: '中国 → 非洲', days: '25-40天', method: '海运' },
  { route: '中国 → 美洲', days: '20-35天', method: '海运' },
  { route: '中国 → 大洋洲', days: '15-25天', method: '海运' }
];

// 支付方式详情
const PAYMENT_TERMS = [
  { type: 'T/T 电汇', desc: '30%预付，70%发货前付清', popular: true },
  { type: 'L/C 信用证', desc: '适用于大额订单，银行担保', popular: false },
  { type: 'PayPal', desc: '适合小额订单，的手续费2.9%', popular: false },
  { type: '西联汇款', desc: '快速到账，适合小金额', popular: false },
  { type: '支付宝/微信', desc: '支持人民币结算', popular: false }
];

// 产品分类
const PRODUCT_CATEGORIES = [
  { id: '1', name: '日用百货', nameEn: 'Daily Necessaries', desc: '家居用品、厨房用品、清洁用品等' },
  { id: '2', name: '建材家居', nameEn: 'Building Materials', desc: '钢材、水泥、陶瓷、照明设备等' },
  { id: '3', name: '智能设备', nameEn: 'Smart Devices', desc: '智能农机、无人机、智能家居等' },
  { id: '4', name: '化工能源', nameEn: 'Chemical & Energy', desc: '塑料制品、橡胶制品等' },
  { id: '5', name: '纺织品', nameEn: 'Textiles', desc: '服装面料、家纺用品等' }
];

// 服务项目
const SERVICES = [
  { name: '进出口代理', nameEn: 'Import/Export Agency', desc: '一站式进出口代理服务' },
  { name: '国际物流', nameEn: 'International Logistics', desc: '海运、空运、陆运多式联运' },
  { name: '报关报检', nameEn: 'Customs Clearance', desc: '专业报关报检服务' },
  { name: '仓储配送', nameEn: 'Warehousing & Distribution', desc: '国内外仓储物流配送' },
  { name: '跨境电商', nameEn: 'Cross-border E-commerce', desc: '跨境电商平台运营支持' },
  { name: '商检认证', nameEn: 'Inspection & Certification', desc: 'SGS、CE、FDA等认证服务' }
];

// 智能回复生成器
function generateResponse(message: string, locale: 'zh' | 'en' = 'zh'): string {
  const msg = message.toLowerCase().trim();
  
  // 检测语言
  const isEnglish = /^[a-zA-Z]/.test(message.trim()) && message.split(' ').length > 1;
  const lang = isEnglish ? 'en' : 'zh';

  // 问候语
  const greetings = ['hi', 'hello', 'hey', '你好', '您好', '嗨', '嗨', 'hi there', 'greetings'];
  if (greetings.some(g => msg.includes(g))) {
    if (lang === 'en') {
      return `Hello! Welcome to ${COMPANY_INFO.nameEn}! 👋

I'm your professional trade consultant. How can I assist you today?

💼 Our Services:
• Import/Export Agency
• International Logistics  
• Customs Clearance
• Cross-border E-commerce

📞 Contact: ${COMPANY_INFO.phone}
📧 Email: ${COMPANY_INFO.email}

What would you like to know?`;
    }
    return `您好！欢迎来到${COMPANY_INFO.name}！👋

我是您的专业贸易顾问，很高兴为您服务！

💼 我们的服务：
• 进出口代理
• 国际物流
• 报关报检
• 跨境电商

📞 咨询热线：${COMPANY_INFO.phone}
📧 邮箱：${COMPANY_INFO.email}

请问有什么可以帮到您？`;
  }

  // 公司介绍
  if (msg.includes('公司') || msg.includes('简介') || msg.includes('about') || msg.includes('company') || msg.includes('who')) {
    if (lang === 'en') {
      return `${COMPANY_INFO.nameEn}

Established in ${COMPANY_INFO.established}, we are a professional international trade company.

📊 Company Profile:
• Business Coverage: ${COMPANY_INFO.countries} countries
• Product Categories: ${COMPANY_INFO.products}+ items
• Location: ${COMPANY_INFO.address}

🌍 Trade Terms We Support:
• FOB, CIF, EXW, DDP, FCA
• T/T, L/C, PayPal

💼 Main Services:
${SERVICES.map(s => `• ${s.nameEn}: ${s.desc}`).join('\n')}

📞 Hotline: ${COMPANY_INFO.phone}
Would you like to learn more about any specific service?`;
    }
    return `${COMPANY_INFO.name}

成立于${COMPANY_INFO.established}，是一家专业从事国际贸易的企业。

📊 公司概况：
• 业务覆盖：${COMPANY_INFO.countries}个国家
• 产品品类：${COMPANY_INFO.products}+种商品
• 总部地址：${COMPANY_INFO.address}

🌍 支持的国际贸易术语：
• 离岸价(FOB)、到岸价(CIF)、工厂交货(EXW)、完税后交货(DDP)

💼 主营业务：
${SERVICES.map(s => `• ${s.name}：${s.desc}`).join('\n')}

📞 咨询热线：${COMPANY_INFO.phone}
请问您想了解哪方面的服务？`;
  }

  // 联系方式
  if (msg.includes('电话') || msg.includes('联系') || msg.includes('phone') || msg.includes('contact') || msg.includes('email')) {
    if (lang === 'en') {
      return `📞 Contact Information

☎️ Phone: ${COMPANY_INFO.phone}
📧 Email: ${COMPANY_INFO.email}
📍 Address: ${COMPANY_INFO.address}

⏰ Service Hours: Mon-Fri 9:00-18:00

💬 Online consultation available now!

Feel free to reach out during business hours!`;
    }
    return `📞 联系方式

☎️ 电话：${COMPANY_INFO.phone}
📧 邮箱：${COMPANY_INFO.email}
📍 地址：${COMPANY_INFO.address}

⏰ 服务时间：周一至周五 9:00-18:00

💬 现在就可以在线咨询！

欢迎随时联系我们！`;
  }

  // 物流时效
  if (msg.includes('物流') || msg.includes('快递') || msg.includes('运输') || msg.includes('时效') || msg.includes('多久') || 
      msg.includes('shipping') || msg.includes('delivery') || msg.includes('logistics') || msg.includes('how long')) {
    if (lang === 'en') {
      return `🚢 Shipping Information

Estimated delivery times to major regions:

${SHIPPING_INFO.map(s => `• ${s.route}: ${s.days} (${s.method})`).join('\n')}

📌 Notes:
• Times are estimates, may vary by season and customs
• Express shipping available for urgent orders
• Door-to-door service options

💡 For accurate quotes, please provide:
1. Destination country/city
2. Cargo type and weight
3. Preferred shipping method

📞 Get a quote: ${COMPANY_INFO.phone}`;
    }
    return `🚢 物流时效参考

主要地区运输时效：

${SHIPPING_INFO.map(s => `• ${s.route}：${s.days}（${s.method}）`).join('\n')}

📌 注意事项：
• 时效为参考值，因季节和海关情况可能有所变化
• 加急空运可缩短一半时间
• 可提供门到门服务

💡 获取精准报价，请提供：
1. 目的国家/城市
2. 货物类型和重量
3. 偏好的运输方式

📞 获取报价：${COMPANY_INFO.phone}`;
  }

  // 贸易术语
  const tradeTermKeys = Object.keys(TRADE_TERMS);
  for (const term of tradeTermKeys) {
    if (msg.includes(term.toLowerCase())) {
      const info = TRADE_TERMS[term];
      if (lang === 'en') {
        return `📚 Trade Term: ${info.en}

🔤 Abbreviation: ${term}
🇨🇳 Chinese: ${info.zh}
📝 Description: ${info.desc}

💡 We handle all major trade terms including FOB, CIF, EXW, DDP, FCA, CFR.

Need more details about trade terms or pricing?`;
      }
      return `📚 贸易术语：${info.en}

🔤 缩写：${term}
🇨🇳 中文：${info.zh}
📝 说明：${info.desc}

💡 我们支持FOB、CIF、EXW、DDP、FCA、CFR等主要贸易术语。

需要了解更多贸易术语或报价细节吗？`;
    }
  }

  // 支付方式
  if (msg.includes('支付') || msg.includes('付款') || msg.includes('账期') || 
      msg.includes('payment') || msg.includes('pay') || msg.includes('money')) {
    if (lang === 'en') {
      return `💳 Payment Methods

${PAYMENT_TERMS.map((p, i) => `${p.popular ? '⭐' : '•'} ${p.type}${p.popular ? ' (Popular)' : ''}\n  ${p.desc}`).join('\n\n')}

📌 For First-time Buyers:
• Small orders: PayPal or T/T 100%
• Regular orders: T/T 30/70
• Large orders: L/C at sight

💡 We ensure secure transactions for all payment methods.

Questions about payment?`;
    }
    return `💳 支付方式

${PAYMENT_TERMS.map((p, i) => `${p.popular ? '⭐' : '•'} ${p.type}${p.popular ? '（推荐）' : ''}\n  ${p.desc}`).join('\n\n')}

📌 给新买家的建议：
• 小额订单：PayPal 或 T/T 100%
• 常规订单：T/T 30/70
• 大额订单：即期信用证L/C

💡 我们确保所有支付方式的安全交易。

对支付方式有疑问吗？`;
  }

  // 产品类别
  if (msg.includes('产品') || msg.includes('商品') || msg.includes('catalog') || msg.includes('product') || 
      msg.includes('catalog') || msg.includes('catalog')) {
    if (lang === 'en') {
      return `📦 Product Categories

${PRODUCT_CATEGORIES.map(p => `🔹 ${p.nameEn} (${p.name})\n   ${p.desc}`).join('\n\n')}

📞 For full catalog and quotes: ${COMPANY_INFO.phone}

💡 MOQ (Minimum Order Quantity) varies by product.
We also accept OEM/ODM orders!

Which category interests you?`;
    }
    return `📦 产品分类

${PRODUCT_CATEGORIES.map(p => `🔹 ${p.name}（${p.nameEn}）\n   ${p.desc}`).join('\n\n')}

📞 获取完整产品目录和报价：${COMPANY_INFO.phone}

💡 不同产品起订量(MOQ)不同。
我们还接受OEM/ODM定制订单！

请问您对哪类产品感兴趣？`;
  }

  // 服务项目
  if (msg.includes('服务') || msg.includes('业务') || msg.includes('service') || msg.includes('business')) {
    if (lang === 'en') {
      return `💼 Our Services

${SERVICES.map(s => `✅ ${s.nameEn}\n   ${s.desc}`).join('\n\n')}

🌟 Why Choose Us:
• 5+ years experience in international trade
• Professional team with customs expertise
• Network covering 50+ countries
• One-stop service from order to delivery

📞 Consult now: ${COMPANY_INFO.phone}`;
    }
    return `💼 我们的服务

${SERVICES.map(s => `✅ ${s.name}\n   ${s.desc}`).join('\n\n')}

🌟 选择我们的理由：
• 5年以上国际贸易经验
• 专业团队，熟悉各国海关政策
• 业务网络覆盖50+国家
• 从下单到配送一站式服务

📞 立即咨询：${COMPANY_INFO.phone}`;
  }

  // 报价/价格
  if (msg.includes('价格') || msg.includes('报价') || msg.includes('price') || msg.includes('quote') || 
      msg.includes('cost') || msg.includes('报价')) {
    if (lang === 'en') {
      return `💰 Get a Quote

To provide you with an accurate quote, please share:

1️⃣ Product name or HS code
2️⃣ Order quantity (MOQ applies)
3️⃣ Destination country
4️⃣ Preferred trade term (FOB/CIF/DDP...)
5️⃣ Preferred payment method

📞 Quick Quote: ${COMPANY_INFO.phone}
📧 Email: ${COMPANY_INFO.email}

⏰ We respond within 2 hours!`;
    }
    return `💰 获取报价

为了给您提供精准报价，请提供：

1️⃣ 产品名称或海关编码(HS)
2️⃣ 订购数量（最低起订量）
3️⃣ 目的国家
4️⃣ 贸易术语偏好（FOB/CIF/DDP...）
5️⃣ 付款方式偏好

📞 快速报价：${COMPANY_INFO.phone}
📧 邮箱：${COMPANY_INFO.email}

⏰ 我们将在2小时内回复！`;
  }

  // 出口退税
  if (msg.includes('退税') || msg.includes('tax') || msg.includes('refund')) {
    if (lang === 'en') {
      return `🧾 Export Tax Rebate

China offers VAT refund for qualified exports:

📌 Requirements:
• Valid export contract
• Proof of customs export declaration
• Taxable sales invoice

💡 We can assist with:
• Tax rebate documentation
• Export compliance
• Professional customs clearance

📞 For details: ${COMPANY_INFO.phone}`;
    }
    return `🧾 出口退税

中国对符合条件的出口商品提供增值税退税：

📌 基本条件：
• 有效的出口合同
• 出口报关单证
• 增值税发票

💡 我们可以协助：
• 退税单证办理
• 出口合规咨询
• 专业报关服务

📞 了解更多：${COMPANY_INFO.phone}`;
  }

  // 验货/验厂
  if (msg.includes('验货') || msg.includes('验厂') || msg.includes('inspect') || msg.includes('sgs')) {
    if (lang === 'en') {
      return `🔍 Inspection Services

We offer comprehensive inspection:

✅ Pre-shipment Inspection (PSI)
✅ Factory Audit
✅ Container Loading Supervision
✅ SGS/CCIC Certification

📌 Why Inspect?
• Ensure quality compliance
• Reduce trade risks
• Protect buyer interests

💡 We recommend inspection for orders over $10,000.

📞 Book inspection: ${COMPANY_INFO.phone}`;
    }
    return `🔍 验货/验厂服务

我们提供全面的检验服务：

✅ 出货前检验 (PSI)
✅ 工厂审计
✅ 装柜监督
✅ SGS/CCIC 认证

📌 为什么需要验货？
• 确保货物质量符合要求
• 降低贸易风险
• 保护买方权益

💡 建议订单金额超过1万美元的进行验货。

📞 预约验货：${COMPANY_INFO.phone}`;
  }

  // 样品
  if (msg.includes('样品') || msg.includes('sample')) {
    if (lang === 'en') {
      return `📦 Sample Service

We offer sample options:

🔹 Stock Samples: Available for quick check
   • Usually in small quantities
   • Shipping cost applies

🔹 Custom Samples: Made per your specs
   • Lead time: 7-15 days
   • Sample fee + shipping

📌 Sample Policy:
• Sample cost refundable with bulk order
• DHL/FedEx for international shipping
• We can send to your warehouse

📞 Order samples: ${COMPANY_INFO.phone}`;
    }
    return `📦 样品服务

我们提供样品选项：

🔹 库存样品：可快速发货
   • 通常少量即可
   • 需支付运费

🔹 定制样品：按您的要求制作
   • 周期：7-15天
   • 样品费 + 运费

📌 样品政策：
• 大货下单可退还样品费
• 国际快递发货（DHL/FedEx）
• 可发至您指定的仓库

📞 咨询样品：${COMPANY_INFO.phone}`;
  }

  // 保险
  if (msg.includes('保险') || msg.includes('insurance')) {
    if (lang === 'en') {
      return `🛡️ Cargo Insurance

We offer comprehensive cargo insurance:

📋 Coverage Options:
• All Risks Coverage
• War Risks Coverage
• TPND (Theft, Pilferage, Non-delivery)

💰 Typical Cost: 0.1-0.5% of cargo value

📌 We recommend insurance for:
• High-value shipments
• Fragile goods
• High-risk destinations

📞 Get insured: ${COMPANY_INFO.phone}`;
    }
    return `🛡️ 货运保险

我们提供全面的货运保险：

📋 保险选项：
• 综合险（All Risks）
• 战争险（War Risks）
• 偷窃险（TPND）

💰 费用参考：货值的0.1-0.5%

📌 建议购买保险的情况：
• 高价值货物
• 易碎品
• 高风险目的地

📞 咨询保险：${COMPANY_INFO.phone}`;
  }

  // 海关/清关
  if (msg.includes('海关') || msg.includes('清关') || msg.includes('customs') || msg.includes('clearance')) {
    if (lang === 'en') {
      return `🏛️ Customs Services

Professional customs clearance for:

✅ Export from China
✅ Import to destination country
✅ Transit clearance

📌 Our expertise includes:
• HS code classification
• Duty calculation
• Document preparation
• Compliance consulting

💡 We handle customs in major ports worldwide!

📞 Customs help: ${COMPANY_INFO.phone}`;
    }
    return `🏛️ 报关清关服务

专业报关清关服务：

✅ 中国出口报关
✅ 目的国进口清关
✅ 过境报关

📌 我们的专长：
• 海关编码归类
• 关税计算
• 单证制作
• 合规咨询

💡 我们在全球主要港口都有清关能力！

📞 报关咨询：${COMPANY_INFO.phone}`;
  }

  // 合作/代理
  if (msg.includes('合作') || msg.includes('代理') || msg.includes('partner') || msg.includes('cooperate') || 
      msg.includes('agent') || msg.includes('代理')) {
    if (lang === 'en') {
      return `🤝 Cooperation Options

We welcome partnerships:

🌟 Distributor Partners
• Exclusive regional rights
• Volume discounts
• Marketing support

🌟 Trading Partners
• Sourcing service
• Quality control
• Logistics solution

🌟 OEM/ODM Partners
• Customized products
• Brand cooperation
• Flexible MOQ

📞 Discuss partnership: ${COMPANY_INFO.phone}
📧 Email: ${COMPANY_INFO.email}`;
    }
    return `🤝 合作方式

我们欢迎各类合作伙伴：

🌟 区域代理
• 独家区域经营权
• 大客户折扣
• 营销支持

🌟 贸易合作
• 代采购服务
• 品质管控
• 物流方案

🌟 OEM/ODM合作
• 定制产品
• 品牌合作
• 灵活起订量

📞 洽谈合作：${COMPANY_INFO.phone}
📧 邮箱：${COMPANY_INFO.email}`;
  }

  // 谢谢/感谢
  if (msg.includes('谢谢') || msg.includes('感谢') || msg.includes('thank') || msg.includes('thanks')) {
    if (lang === 'en') {
      return `You're welcome! 🙏

We're here to help with all your import/export needs.

💼 Remember:
• 📞 Hotline: ${COMPANY_INFO.phone}
• 📧 Email: ${COMPANY_INFO.email}
• ⏰ Service: Mon-Fri 9AM-6PM

Feel free to contact us anytime!`;
    }
    return `不客气！很高兴为您服务 🙏

如有任何进出口需求，随时联系我们！

💼 联系方式：
• 📞 电话：${COMPANY_INFO.phone}
• 📧 邮箱：${COMPANY_INFO.email}
• ⏰ 时间：周一至周五 9:00-18:00

期待与您合作！`;
  }

  // 未知问题 - 友好引导
  if (lang === 'en') {
    return `I understand you're asking about: "${message}"

As a professional trade consultant for ${COMPANY_INFO.nameEn}, I'm happy to help with:

📋 Common Topics:
• Products & Catalog
• Pricing & Quotes
• Shipping & Logistics
• Payment Methods
• Trade Terms (FOB/CIF/DDP)
• Customs Clearance
• Inspection Services
• Cooperation

💬 How can I assist you today?

📞 Or call us: ${COMPANY_INFO.phone}`;
  }
  return `您好！我是大迈国际贸易的智能客服 😊

我理解您想了解："${message}"

作为您的专业外贸顾问，我可以帮您解答：

📋 常见话题：
• 产品与目录
• 价格与报价
• 物流与时效
• 支付方式
• 贸易术语（FOB/CIF/DDP）
• 报关清关
• 验货服务
• 合作洽谈

💬 请问您想了解什么呢？

📞 也可以直接拨打：${COMPANY_INFO.phone}`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, locale = 'zh' } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    // 生成回复
    const response = generateResponse(message.trim(), locale);

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '服务暂时不可用，请稍后再试或拨打热线 ' + COMPANY_INFO.phone 
      },
      { status: 500 }
    );
  }
}
