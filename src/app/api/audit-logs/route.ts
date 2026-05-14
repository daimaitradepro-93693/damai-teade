import { NextRequest, NextResponse } from 'next/server';

// 模拟操作日志数据
const auditLogs = [
  {
    id: 'log_001',
    timestamp: '2024-01-15T10:30:00Z',
    user: {
      id: 'user_001',
      name: '管理员',
      role: 'admin'
    },
    action: 'product.create',
    module: '产品管理',
    description: '创建产品：工业机械设备',
    details: {
      productId: 'prod_001',
      productName: '工业机械设备'
    },
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    status: 'success'
  },
  {
    id: 'log_002',
    timestamp: '2024-01-15T10:25:00Z',
    user: {
      id: 'user_001',
      name: '管理员',
      role: 'admin'
    },
    action: 'order.update',
    module: '订单管理',
    description: '更新订单状态：DM2024011500001',
    details: {
      orderId: 'ord_001',
      oldStatus: 'pending',
      newStatus: 'processing'
    },
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    status: 'success'
  },
  {
    id: 'log_003',
    timestamp: '2024-01-15T10:20:00Z',
    user: {
      id: 'user_001',
      name: '管理员',
      role: 'admin'
    },
    action: 'member.login',
    module: '用户管理',
    description: '用户登录成功',
    details: {},
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    status: 'success'
  },
  {
    id: 'log_004',
    timestamp: '2024-01-15T10:15:00Z',
    user: {
      id: 'user_002',
      name: '销售员张三',
      role: 'sales'
    },
    action: 'rfq.create',
    module: '询盘管理',
    description: '创建询盘报价：RFQ202401150001',
    details: {
      rfqId: 'rfq_001',
      customer: 'ABC Trading Co.'
    },
    ip: '192.168.1.101',
    userAgent: 'Firefox 121.0',
    status: 'success'
  },
  {
    id: 'log_005',
    timestamp: '2024-01-15T10:10:00Z',
    user: {
      id: 'user_001',
      name: '管理员',
      role: 'admin'
    },
    action: 'settings.update',
    module: '系统设置',
    description: '更新网站设置',
    details: {
      fields: ['siteName', 'contactEmail']
    },
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    status: 'success'
  },
  {
    id: 'log_006',
    timestamp: '2024-01-15T09:30:00Z',
    user: {
      id: 'unknown',
      name: '未知用户',
      role: 'guest'
    },
    action: 'auth.failed',
    module: '用户管理',
    description: '登录失败：密码错误',
    details: {
      email: 'test@example.com',
      reason: 'invalid_password'
    },
    ip: '203.0.113.50',
    userAgent: 'Chrome 120.0',
    status: 'failed'
  }
];

// 操作类型配置
const actionTypes = {
  'product.create': { label: '创建产品', color: 'green' },
  'product.update': { label: '更新产品', color: 'blue' },
  'product.delete': { label: '删除产品', color: 'red' },
  'order.create': { label: '创建订单', color: 'green' },
  'order.update': { label: '更新订单', color: 'blue' },
  'order.cancel': { label: '取消订单', color: 'red' },
  'member.login': { label: '用户登录', color: 'blue' },
  'member.logout': { label: '用户登出', color: 'gray' },
  'member.register': { label: '用户注册', color: 'green' },
  'rfq.create': { label: '创建询盘', color: 'green' },
  'rfq.update': { label: '更新询盘', color: 'blue' },
  'settings.update': { label: '更新设置', color: 'orange' },
  'auth.failed': { label: '登录失败', color: 'red' },
  'export.data': { label: '数据导出', color: 'purple' },
  'import.data': { label: '数据导入', color: 'purple' }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const module = searchParams.get('module');
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const status = searchParams.get('status');

  let filteredLogs = [...auditLogs];

  // 应用过滤条件
  if (module) {
    filteredLogs = filteredLogs.filter(log => log.module === module);
  }
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action === action);
  }
  if (userId) {
    filteredLogs = filteredLogs.filter(log => log.user.id === userId);
  }
  if (status) {
    filteredLogs = filteredLogs.filter(log => log.status === status);
  }
  if (startDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) >= new Date(startDate)
    );
  }
  if (endDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) <= new Date(endDate)
    );
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);

  // 统计信息
  const stats = {
    total: filteredLogs.length,
    success: filteredLogs.filter(l => l.status === 'success').length,
    failed: filteredLogs.filter(l => l.status === 'failed').length,
    byModule: filteredLogs.reduce((acc, log) => {
      acc[log.module] = (acc[log.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byAction: filteredLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return NextResponse.json({
    success: true,
    data: {
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / limit)
      },
      stats,
      actionTypes
    }
  });
}

// 记录新的操作日志
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userRole, action, module, description, details } = body;

    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: {
        id: userId || 'unknown',
        name: userName || '未知用户',
        role: userRole || 'guest'
      },
      action,
      module,
      description,
      details: details || {},
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'success'
    };

    // 在实际项目中应该保存到数据库
    auditLogs.unshift(newLog);

    return NextResponse.json({
      success: true,
      data: newLog
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '记录日志失败'
    }, { status: 500 });
  }
}
