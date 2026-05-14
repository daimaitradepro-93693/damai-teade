import { NextRequest, NextResponse } from 'next/server';

// 模拟退款记录
let refunds = [
  {
    id: 'ref_001',
    refundNo: 'RF202401150001',
    orderId: 'ord_001',
    orderNo: 'DM2024011500001',
    customer: {
      id: 'cust_001',
      name: 'John Smith',
      email: 'john@example.com'
    },
    items: [
      {
        productId: 'prod_001',
        productName: '日用百货套装',
        quantity: 50,
        unitPrice: 12.5,
        amount: 625
      }
    ],
    refundAmount: 625,
    refundCurrency: 'USD',
    reason: '产品质量问题',
    reasonDetail: '部分产品包装破损，客户要求退货退款',
    status: 'processing',
    type: 'partial',
    paymentMethod: 'T/T',
    transactionId: 'TT20240115001',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    timeline: [
      { time: '2024-01-15T14:00:00Z', action: '客户提交退款申请', operator: '客户' },
      { time: '2024-01-15T14:30:00Z', action: '客服审核中', operator: '客服张三' }
    ]
  },
  {
    id: 'ref_002',
    refundNo: 'RF202401140001',
    orderId: 'ord_002',
    orderNo: 'DM2024011400001',
    customer: {
      id: 'cust_002',
      name: '李四',
      email: 'lisi@163.com'
    },
    items: [
      {
        productId: 'prod_002',
        productName: '建材家居套装',
        quantity: 100,
        unitPrice: 25,
        amount: 2500
      }
    ],
    refundAmount: 2500,
    refundCurrency: 'CNY',
    reason: '订单取消',
    reasonDetail: '客户改变主意，取消订单',
    status: 'approved',
    type: 'full',
    paymentMethod: 'PayPal',
    transactionId: 'PP20240114002',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    timeline: [
      { time: '2024-01-14T10:00:00Z', action: '客户提交退款申请', operator: '客户' },
      { time: '2024-01-14T11:00:00Z', action: '客服审核通过', operator: '客服张三' },
      { time: '2024-01-14T16:00:00Z', action: '财务审批通过', operator: '财务王五' }
    ]
  },
  {
    id: 'ref_003',
    refundNo: 'RF202401130001',
    orderId: 'ord_003',
    orderNo: 'DM2024011300001',
    customer: {
      id: 'cust_003',
      name: 'Maria Garcia',
      email: 'maria@gmail.com'
    },
    items: [
      {
        productId: 'prod_003',
        productName: '电子产品套装',
        quantity: 30,
        unitPrice: 45,
        amount: 1350
      }
    ],
    refundAmount: 1350,
    refundCurrency: 'USD',
    reason: '发货延迟',
    reasonDetail: '发货延迟超过承诺时间，客户要求退款',
    status: 'completed',
    type: 'full',
    paymentMethod: 'Stripe',
    transactionId: 'ST20240113003',
    refundTransactionId: 'REF-ST20240113003',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-13T18:00:00Z',
    completedAt: '2024-01-13T18:00:00Z',
    timeline: [
      { time: '2024-01-13T09:00:00Z', action: '客户提交退款申请', operator: '客户' },
      { time: '2024-01-13T10:00:00Z', action: '客服审核通过', operator: '客服张三' },
      { time: '2024-01-13T14:00:00Z', action: '财务审批通过', operator: '财务王五' },
      { time: '2024-01-13T18:00:00Z', action: '退款已到账', operator: '系统' }
    ]
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filteredRefunds = [...refunds];

  // 应用过滤条件
  if (status) {
    filteredRefunds = filteredRefunds.filter(r => r.status === status);
  }
  if (search) {
    filteredRefunds = filteredRefunds.filter(r =>
      r.refundNo.toLowerCase().includes(search.toLowerCase()) ||
      r.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (startDate) {
    filteredRefunds = filteredRefunds.filter(r =>
      new Date(r.createdAt) >= new Date(startDate)
    );
  }
  if (endDate) {
    filteredRefunds = filteredRefunds.filter(r =>
      new Date(r.createdAt) <= new Date(endDate)
    );
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const paginatedRefunds = filteredRefunds.slice(startIndex, startIndex + limit);

  // 统计
  const stats = {
    total: refunds.length,
    totalAmount: refunds.reduce((sum, r) => sum + r.refundAmount, 0),
    pending: refunds.filter(r => r.status === 'pending').length,
    processing: refunds.filter(r => r.status === 'processing').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    completed: refunds.filter(r => r.status === 'completed').length,
    rejected: refunds.filter(r => r.status === 'rejected').length,
    byReason: refunds.reduce((acc, r) => {
      acc[r.reason] = (acc[r.reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return NextResponse.json({
    success: true,
    data: {
      refunds: paginatedRefunds,
      pagination: {
        page,
        limit,
        total: filteredRefunds.length,
        totalPages: Math.ceil(filteredRefunds.length / limit)
      },
      stats
    }
  });
}

// 更新退款状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, operator, note } = body;

    const refund = refunds.find(r => r.id === id);
    if (!refund) {
      return NextResponse.json({
        success: false,
        message: '退款记录不存在'
      }, { status: 404 });
    }

    const now = new Date().toISOString();
    refund.updatedAt = now;

    switch (action) {
      case 'approve':
        refund.status = 'approved';
        refund.timeline.push({
          time: now,
          action: note || '审核通过',
          operator
        });
        break;
      case 'reject':
        refund.status = 'rejected';
        refund.timeline.push({
          time: now,
          action: note || '审核拒绝',
          operator
        });
        break;
      case 'complete':
        refund.status = 'completed';
        refund.completedAt = now;
        refund.refundTransactionId = `REF-${Date.now()}`;
        refund.timeline.push({
          time: now,
          action: note || '退款已完成',
          operator
        });
        break;
      default:
        return NextResponse.json({
          success: false,
          message: '无效的操作'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: '操作成功',
      data: refund
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '操作失败'
    }, { status: 500 });
  }
}

// 创建退款申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, orderNo, customerId, customerName, customerEmail, items, refundAmount, refundCurrency, reason, reasonDetail, paymentMethod, transactionId } = body;

    const newRefund = {
      id: `ref_${Date.now()}`,
      refundNo: `RF${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(refunds.length + 1).padStart(4, '0')}`,
      orderId,
      orderNo,
      customer: {
        id: customerId,
        name: customerName,
        email: customerEmail
      },
      items,
      refundAmount,
      refundCurrency,
      reason,
      reasonDetail,
      status: 'pending',
      type: refundAmount === items.reduce((sum: number, i: { amount: number }) => sum + i.amount, 0) ? 'full' : 'partial',
      paymentMethod,
      transactionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        { time: new Date().toISOString(), action: '创建退款申请', operator: '系统' }
      ]
    };

    refunds.unshift(newRefund);

    return NextResponse.json({
      success: true,
      message: '退款申请已创建',
      data: newRefund
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '创建失败'
    }, { status: 500 });
  }
}
