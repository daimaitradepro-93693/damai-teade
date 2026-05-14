import { NextResponse } from 'next/server';

// RFQ状态枚举
type RFQStatus = 'new' | 'reviewing' | 'quoted' | 'negotiating' | 'accepted' | 'rejected' | 'expired';

// RFQ优先级
type Priority = 'low' | 'normal' | 'high' | 'urgent';

// RFQ询盘接口
interface RFQ {
  id: string;
  rfqNo: string;
  status: RFQStatus;
  priority: Priority;
  
  // 客户信息
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    country: string;
    type: 'B2B' | 'B2C';
  };
  
  // 产品需求
  products: {
    productId?: string;
    productName: string;
    sku?: string;
    quantity: number;
    unit?: string;
    targetPrice?: number;
    specifications?: Record<string, string>;
    images?: string[];
    attachments?: string[];
    notes?: string;
  }[];
  
  // 报价信息
  quote?: {
    totalPrice: number;
    currency: string;
    validity: string;
    paymentTerms: string;
    leadTime: string;
    shippingTerms: string;
    items: {
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    notes?: string;
    sentAt?: string;
  };
  
  // 跟进信息
  followUps: {
    id: string;
    type: 'email' | 'phone' | 'meeting' | 'whatsapp';
    content: string;
    createdAt: string;
    createdBy: string;
    nextFollowUp?: string;
  }[];
  
  // 标签
  tags: string[];
  
  // 分配信息
  assignedTo?: string;
  department?: string;
  
  // 时间信息
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  
  // 备注
  internalNotes?: string;
}

// 模拟RFQ数据
let rfqs: RFQ[] = [
  {
    id: 'rfq_001',
    rfqNo: 'RFQ202401150001',
    status: 'negotiating',
    priority: 'high',
    customer: {
      id: 'mem_001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-555-0123',
      company: 'ABC Trading Co.',
      country: 'USA',
      type: 'B2B'
    },
    products: [
      {
        productName: '日用百货套装',
        sku: 'DN-001-SET',
        quantity: 1000,
        unit: 'sets',
        targetPrice: 12,
        specifications: { 材质: '塑料/不锈钢', 包装: '纸箱', 定制: '需要Logo' },
        notes: '需要定制包装，印有我司Logo'
      }
    ],
    quote: {
      totalPrice: 11500,
      currency: 'USD',
      validity: '30 days',
      paymentTerms: 'T/T 30% deposit',
      leadTime: '25 days',
      shippingTerms: 'FOB Shenzhen',
      items: [
        { productName: '日用百货套装', quantity: 1000, unitPrice: 11.5, totalPrice: 11500 }
      ],
      notes: '含Logo定制费用，大批量可再议价',
      sentAt: '2024-01-16T10:00:00Z'
    },
    followUps: [
      {
        id: 'fu_001',
        type: 'email',
        content: '已发送报价，等待客户回复',
        createdAt: '2024-01-16T10:00:00Z',
        createdBy: 'sales_zhang',
        nextFollowUp: '2024-01-18'
      }
    ],
    tags: ['大客户', '定制需求', '美国市场'],
    assignedTo: 'sales_zhang',
    department: '美国区',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'rfq_002',
    rfqNo: 'RFQ202401160002',
    status: 'new',
    priority: 'normal',
    customer: {
      name: 'Marie Dubois',
      email: 'marie@company.fr',
      phone: '+33-1-2345-6789',
      company: 'Fashion Europe SAS',
      country: 'France',
      type: 'B2B'
    },
    products: [
      {
        productName: '纺织品',
        quantity: 5000,
        unit: 'meters',
        targetPrice: 8,
        specifications: { 材质: '纯棉', 宽度: '150cm', 颜色: '多色' }
      }
    ],
    followUps: [],
    tags: ['欧洲市场', '纺织品'],
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z'
  },
  {
    id: 'rfq_003',
    rfqNo: 'RFQ202401170003',
    status: 'quoted',
    priority: 'urgent',
    customer: {
      id: 'mem_003',
      name: '田中太郎',
      email: 'tanaka@company.jp',
      phone: '+81-3-1234-5678',
      company: '田中商事株式会社',
      country: 'Japan',
      type: 'B2B'
    },
    products: [
      {
        productName: '智能设备',
        sku: 'SD-002',
        quantity: 200,
        unit: 'pcs',
        targetPrice: 280,
        specifications: { 电压: '110V', 认证: 'CE/FCC', 说明书: '日语' }
      }
    ],
    quote: {
      totalPrice: 56000,
      currency: 'USD',
      validity: '15 days',
      paymentTerms: 'L/C',
      leadTime: '30 days',
      shippingTerms: 'CIF Tokyo',
      items: [
        { productName: '智能设备', quantity: 200, unitPrice: 280, totalPrice: 56000 }
      ],
      sentAt: '2024-01-17T09:00:00Z'
    },
    followUps: [
      {
        id: 'fu_002',
        type: 'email',
        content: '已发送报价，含日语说明书定制',
        createdAt: '2024-01-17T09:00:00Z',
        createdBy: 'sales_wang'
      }
    ],
    tags: ['日本市场', '电子产品', '紧急'],
    assignedTo: 'sales_wang',
    department: '亚洲区',
    createdAt: '2024-01-17T08:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z'
  }
];

// GET - 获取RFQ列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');
  const assignedTo = searchParams.get('assignedTo');

  let filtered = [...rfqs];

  // 状态筛选
  if (status && status !== 'all') {
    filtered = filtered.filter(r => r.status === status);
  }

  // 优先级筛选
  if (priority && priority !== 'all') {
    filtered = filtered.filter(r => r.priority === priority);
  }

  // 分配人筛选
  if (assignedTo && assignedTo !== 'all') {
    filtered = filtered.filter(r => r.assignedTo === assignedTo);
  }

  // 搜索
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(r => 
      r.rfqNo.toLowerCase().includes(s) ||
      r.customer.name.toLowerCase().includes(s) ||
      r.customer.company?.toLowerCase().includes(s) ||
      r.products.some(p => p.productName.toLowerCase().includes(s))
    );
  }

  // 统计
  const stats = {
    total: rfqs.length,
    new: rfqs.filter(r => r.status === 'new').length,
    reviewing: rfqs.filter(r => r.status === 'reviewing').length,
    quoted: rfqs.filter(r => r.status === 'quoted').length,
    negotiating: rfqs.filter(r => r.status === 'negotiating').length,
    accepted: rfqs.filter(r => r.status === 'accepted').length,
    rejected: rfqs.filter(r => r.status === 'rejected').length,
    urgent: rfqs.filter(r => r.priority === 'urgent').length,
    totalValue: rfqs.reduce((sum, r) => sum + (r.quote?.totalPrice || 0), 0)
  };

  return NextResponse.json({
    success: true,
    data: filtered,
    stats
  });
}

// POST - 创建RFQ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newRFQ: RFQ = {
      id: `rfq_${Date.now()}`,
      rfqNo: `RFQ${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(rfqs.length + 1).padStart(4, '0')}`,
      status: 'new',
      priority: body.priority || 'normal',
      customer: body.customer,
      products: body.products,
      followUps: [],
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    rfqs.unshift(newRFQ);

    return NextResponse.json({
      success: true,
      data: newRFQ,
      message: '询盘已提交，我们将在24小时内联系您'
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '询盘提交失败'
    }, { status: 400 });
  }
}

// PUT - 更新RFQ
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = rfqs.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json({
        success: false,
        message: '询盘不存在'
      }, { status: 404 });
    }

    rfqs[index] = {
      ...rfqs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: rfqs[index],
      message: '询盘更新成功'
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '询盘更新失败'
    }, { status: 400 });
  }
}

// DELETE - 删除RFQ
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      success: false,
      message: '缺少询盘ID'
    }, { status: 400 });
  }

  const index = rfqs.findIndex(r => r.id === id);
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: '询盘不存在'
    }, { status: 404 });
  }

  rfqs.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: '询盘已删除'
  });
}
