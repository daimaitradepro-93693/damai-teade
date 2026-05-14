import { NextResponse } from 'next/server';

// 订单状态枚举
type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

// 订单接口
interface Order {
  id: string;
  orderNo: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    type: 'B2B' | 'B2C';
    level?: 'normal' | 'silver' | 'gold' | 'diamond';
  };
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image?: string;
    specifications?: Record<string, string>;
  }[];
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
  };
  shipping: {
    method: string;
    carrier?: string;
    trackingNumber?: string;
    address: {
      country: string;
      province: string;
      city: string;
      address: string;
      zipCode: string;
    };
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: string;
  };
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    time: string;
    note?: string;
    operator?: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟订单数据
let orders: Order[] = [
  {
    id: 'ord_001',
    orderNo: 'DM2024011500001',
    customer: {
      id: 'cust_001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-555-0123',
      company: 'ABC Trading Co.',
      type: 'B2B',
      level: 'gold'
    },
    items: [
      {
        productId: 'prod_001',
        productName: '日用百货套装',
        sku: 'DN-001-SET',
        quantity: 500,
        unitPrice: 12.5,
        totalPrice: 6250,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
        specifications: { 材质: '塑料/不锈钢', 包装: '纸箱' }
      }
    ],
    pricing: {
      subtotal: 6250,
      discount: 625,
      tax: 0,
      shipping: 350,
      total: 5975,
      currency: 'USD'
    },
    shipping: {
      method: 'DHL Express',
      carrier: 'DHL',
      trackingNumber: 'DHL123456789',
      address: {
        country: 'USA',
        province: 'California',
        city: 'Los Angeles',
        address: '123 Main St, Suite 100',
        zipCode: '90001'
      },
      estimatedDelivery: '2024-01-20'
    },
    payment: {
      method: 'T/T',
      status: 'paid',
      transactionId: 'TT20240115001',
      paidAt: '2024-01-15T10:30:00Z'
    },
    status: 'shipped',
    statusHistory: [
      { status: 'pending', time: '2024-01-15T08:00:00Z' },
      { status: 'confirmed', time: '2024-01-15T09:00:00Z', note: '订单已确认' },
      { status: 'paid', time: '2024-01-15T10:30:00Z', note: 'T/T付款已到账' },
      { status: 'processing', time: '2024-01-15T14:00:00Z', note: '仓库正在备货' },
      { status: 'shipped', time: '2024-01-16T10:00:00Z', note: '已发货，运单号: DHL123456789' }
    ],
    notes: 'B2B批发订单，享受9折优惠',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'ord_002',
    orderNo: 'DM2024011600002',
    customer: {
      id: 'cust_002',
      name: '张三',
      email: 'zhangsan@163.com',
      phone: '13800138000',
      type: 'B2C',
      level: 'silver'
    },
    items: [
      {
        productId: 'prod_002',
        productName: '智能设备套装',
        sku: 'SD-002-SET',
        quantity: 2,
        unitPrice: 299,
        totalPrice: 598,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'
      }
    ],
    pricing: {
      subtotal: 598,
      discount: 0,
      tax: 0,
      shipping: 0,
      total: 598,
      currency: 'CNY'
    },
    shipping: {
      method: '顺丰速运',
      carrier: 'SF',
      trackingNumber: 'SF987654321',
      address: {
        country: 'China',
        province: '广东',
        city: '深圳',
        address: '南山区科技园路100号',
        zipCode: '518000'
      },
      estimatedDelivery: '2024-01-18'
    },
    payment: {
      method: '支付宝',
      status: 'paid',
      transactionId: '2024011622001401234567890',
      paidAt: '2024-01-16T15:30:00Z'
    },
    status: 'delivered',
    statusHistory: [
      { status: 'pending', time: '2024-01-16T14:00:00Z' },
      { status: 'paid', time: '2024-01-16T15:30:00Z' },
      { status: 'shipped', time: '2024-01-16T18:00:00Z' },
      { status: 'delivered', time: '2024-01-18T10:00:00Z' }
    ],
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 'ord_003',
    orderNo: 'DM2024011700003',
    customer: {
      id: 'cust_003',
      name: 'Marie Dubois',
      email: 'marie@company.fr',
      phone: '+33-1-2345-6789',
      company: 'Fashion Europe SAS',
      type: 'B2B',
      level: 'diamond'
    },
    items: [
      {
        productId: 'prod_003',
        productName: '纺织品批发',
        sku: 'TX-003-BULK',
        quantity: 1000,
        unitPrice: 8.5,
        totalPrice: 8500,
        specifications: { 材质: '纯棉', 规格: '标准' }
      }
    ],
    pricing: {
      subtotal: 8500,
      discount: 1275,
      tax: 1700,
      shipping: 500,
      total: 9425,
      currency: 'EUR'
    },
    shipping: {
      method: 'FedEx International',
      carrier: 'FedEx',
      trackingNumber: '',
      address: {
        country: 'France',
        province: 'Île-de-France',
        city: 'Paris',
        address: '25 Avenue des Champs-Élysées',
        zipCode: '75008'
      }
    },
    payment: {
      method: 'L/C',
      status: 'pending'
    },
    status: 'pending',
    statusHistory: [
      { status: 'pending', time: '2024-01-17T09:00:00Z' }
    ],
    notes: 'L/C付款方式，等待银行确认',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z'
  }
];

// GET - 获取订单列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  let filtered = [...orders];

  // 状态筛选
  if (status && status !== 'all') {
    filtered = filtered.filter(o => o.status === status);
  }

  // 客户类型筛选
  if (type && type !== 'all') {
    filtered = filtered.filter(o => o.customer.type === type);
  }

  // 搜索
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(o => 
      o.orderNo.toLowerCase().includes(s) ||
      o.customer.name.toLowerCase().includes(s) ||
      o.customer.email.toLowerCase().includes(s)
    );
  }

  // 日期筛选
  if (dateFrom) {
    filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(dateFrom));
  }
  if (dateTo) {
    filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(dateTo));
  }

  // 统计数据
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['confirmed', 'paid', 'processing'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalAmount: orders.reduce((sum, o) => sum + o.pricing.total, 0),
    b2bCount: orders.filter(o => o.customer.type === 'B2B').length,
    b2cCount: orders.filter(o => o.customer.type === 'B2C').length
  };

  return NextResponse.json({
    success: true,
    data: filtered,
    stats,
    pagination: {
      total: filtered.length,
      page: 1,
      pageSize: 20
    }
  });
}

// POST - 创建订单
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNo: `DM${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(orders.length + 1).padStart(5, '0')}`,
      ...body,
      status: 'pending',
      statusHistory: [
        { status: 'pending', time: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: '订单创建成功'
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '订单创建失败'
    }, { status: 400 });
  }
}

// PUT - 更新订单状态
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, note, trackingNumber, carrier } = body;

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({
        success: false,
        message: '订单不存在'
      }, { status: 404 });
    }

    const order = orders[orderIndex];
    
    // 更新状态
    if (status) {
      order.status = status;
      order.statusHistory.push({
        status,
        time: new Date().toISOString(),
        note
      });
    }

    // 更新物流信息
    if (trackingNumber) {
      order.shipping.trackingNumber = trackingNumber;
    }
    if (carrier) {
      order.shipping.carrier = carrier;
    }

    order.updatedAt = new Date().toISOString();
    orders[orderIndex] = order;

    return NextResponse.json({
      success: true,
      data: order,
      message: '订单更新成功'
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '订单更新失败'
    }, { status: 400 });
  }
}

// DELETE - 删除订单
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      success: false,
      message: '缺少订单ID'
    }, { status: 400 });
  }

  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: '订单不存在'
    }, { status: 404 });
  }

  orders.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: '订单已删除'
  });
}
