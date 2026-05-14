import { NextResponse } from 'next/server';

// 会员等级枚举
type MemberLevel = 'normal' | 'silver' | 'gold' | 'diamond';

// 会员类型枚举
type MemberType = 'B2B' | 'B2C';

// 会员接口
interface Member {
  id: string;
  type: MemberType;
  level: MemberLevel;
  name: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  avatar?: string;
  verified: boolean;
  
  // B2B专属字段
  businessLicense?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string;
  assignedSales?: string;
  
  // B2C专属字段
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  
  // 会员积分
  points: number;
  totalSpent: number;
  orderCount: number;
  
  // 地址管理
  addresses: {
    id: string;
    label: string;
    isDefault: boolean;
    country: string;
    province: string;
    city: string;
    address: string;
    zipCode: string;
    phone: string;
  }[];
  
  // 时间信息
  registeredAt: string;
  lastLoginAt?: string;
  lastOrderAt?: string;
  
  // 标签和备注
  tags: string[];
  notes?: string;
  
  // 会员状态
  status: 'active' | 'inactive' | 'blocked';
}

// 会员等级配置
const levelConfig = {
  normal: { name: '普通会员', minSpent: 0, discount: 1.0, pointsRate: 1 },
  silver: { name: '银牌会员', minSpent: 5000, discount: 0.95, pointsRate: 1.2 },
  gold: { name: '金牌会员', minSpent: 20000, discount: 0.9, pointsRate: 1.5 },
  diamond: { name: '钻石会员', minSpent: 100000, discount: 0.85, pointsRate: 2.0 }
};

// 模拟会员数据
let members: Member[] = [
  {
    id: 'mem_001',
    type: 'B2B',
    level: 'gold',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0123',
    company: 'ABC Trading Co.',
    country: 'USA',
    verified: true,
    businessLicense: 'US-ABC-12345',
    taxId: 'EIN: 12-3456789',
    creditLimit: 50000,
    paymentTerms: 'Net 30',
    assignedSales: 'sales_zhang',
    points: 15680,
    totalSpent: 156800,
    orderCount: 28,
    addresses: [
      {
        id: 'addr_001',
        label: '公司地址',
        isDefault: true,
        country: 'USA',
        province: 'California',
        city: 'Los Angeles',
        address: '123 Main St, Suite 100',
        zipCode: '90001',
        phone: '+1-555-0123'
      }
    ],
    registeredAt: '2023-06-15T08:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
    lastOrderAt: '2024-01-15T08:00:00Z',
    tags: ['VIP客户', '月度采购', '按时付款'],
    status: 'active'
  },
  {
    id: 'mem_002',
    type: 'B2C',
    level: 'silver',
    name: '张三',
    email: 'zhangsan@163.com',
    phone: '13800138000',
    country: 'China',
    verified: true,
    birthday: '1990-05-20',
    gender: 'male',
    points: 1250,
    totalSpent: 8560,
    orderCount: 12,
    addresses: [
      {
        id: 'addr_002',
        label: '家',
        isDefault: true,
        country: 'China',
        province: '广东',
        city: '深圳',
        address: '南山区科技园路100号',
        zipCode: '518000',
        phone: '13800138000'
      }
    ],
    registeredAt: '2023-09-20T10:00:00Z',
    lastLoginAt: '2024-01-16T15:00:00Z',
    lastOrderAt: '2024-01-16T14:00:00Z',
    tags: ['活跃用户'],
    status: 'active'
  },
  {
    id: 'mem_003',
    type: 'B2B',
    level: 'diamond',
    name: 'Marie Dubois',
    email: 'marie@company.fr',
    phone: '+33-1-2345-6789',
    company: 'Fashion Europe SAS',
    country: 'France',
    verified: true,
    businessLicense: 'FR-FASH-78901',
    taxId: 'VAT: FR12345678901',
    creditLimit: 200000,
    paymentTerms: 'Net 60',
    assignedSales: 'sales_wang',
    points: 58900,
    totalSpent: 589000,
    orderCount: 85,
    addresses: [
      {
        id: 'addr_003',
        label: '总部',
        isDefault: true,
        country: 'France',
        province: 'Île-de-France',
        city: 'Paris',
        address: '25 Avenue des Champs-Élysées',
        zipCode: '75008',
        phone: '+33-1-2345-6789'
      }
    ],
    registeredAt: '2022-03-10T09:00:00Z',
    lastLoginAt: '2024-01-17T08:00:00Z',
    lastOrderAt: '2024-01-17T09:00:00Z',
    tags: ['大客户', '欧洲市场', '长期合作', '推荐客户'],
    notes: '欧洲主要合作伙伴，年采购额超50万欧元',
    status: 'active'
  },
  {
    id: 'mem_004',
    type: 'B2B',
    level: 'silver',
    name: '田中太郎',
    email: 'tanaka@company.jp',
    phone: '+81-3-1234-5678',
    company: '田中商事株式会社',
    country: 'Japan',
    verified: true,
    businessLicense: 'JP-TANAKA-456',
    creditLimit: 30000,
    paymentTerms: 'Net 30',
    points: 8500,
    totalSpent: 42500,
    orderCount: 15,
    addresses: [
      {
        id: 'addr_004',
        label: '本社',
        isDefault: true,
        country: 'Japan',
        province: '东京都',
        city: '东京',
        address: '千代田区丸の内1-1-1',
        zipCode: '100-0001',
        phone: '+81-3-1234-5678'
      }
    ],
    registeredAt: '2023-08-20T08:00:00Z',
    lastLoginAt: '2024-01-10T09:00:00Z',
    lastOrderAt: '2024-01-08T10:00:00Z',
    tags: ['日本市场', '新客户'],
    status: 'active'
  },
  {
    id: 'mem_005',
    type: 'B2C',
    level: 'normal',
    name: '李四',
    email: 'lisi@qq.com',
    phone: '13900139000',
    country: 'China',
    verified: false,
    points: 120,
    totalSpent: 1200,
    orderCount: 3,
    addresses: [],
    registeredAt: '2024-01-10T14:00:00Z',
    lastLoginAt: '2024-01-10T14:00:00Z',
    tags: ['新注册'],
    status: 'active'
  }
];

// GET - 获取会员列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const level = searchParams.get('level');
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  let filtered = [...members];

  // 类型筛选
  if (type && type !== 'all') {
    filtered = filtered.filter(m => m.type === type);
  }

  // 等级筛选
  if (level && level !== 'all') {
    filtered = filtered.filter(m => m.level === level);
  }

  // 状态筛选
  if (status && status !== 'all') {
    filtered = filtered.filter(m => m.status === status);
  }

  // 搜索
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(s) ||
      m.email.toLowerCase().includes(s) ||
      m.phone.includes(s) ||
      (m.company && m.company.toLowerCase().includes(s))
    );
  }

  // 统计数据
  const stats = {
    total: members.length,
    b2bCount: members.filter(m => m.type === 'B2B').length,
    b2cCount: members.filter(m => m.type === 'B2C').length,
    activeCount: members.filter(m => m.status === 'active').length,
    verifiedCount: members.filter(m => m.verified).length,
    levelDistribution: {
      normal: members.filter(m => m.level === 'normal').length,
      silver: members.filter(m => m.level === 'silver').length,
      gold: members.filter(m => m.level === 'gold').length,
      diamond: members.filter(m => m.level === 'diamond').length
    },
    totalPoints: members.reduce((sum, m) => sum + m.points, 0),
    totalSpent: members.reduce((sum, m) => sum + m.totalSpent, 0)
  };

  return NextResponse.json({
    success: true,
    data: filtered,
    stats,
    levelConfig
  });
}

// POST - 创建会员
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 检查邮箱是否已存在
    if (members.some(m => m.email === body.email)) {
      return NextResponse.json({
        success: false,
        message: '该邮箱已被注册'
      }, { status: 400 });
    }

    const newMember: Member = {
      id: `mem_${Date.now()}`,
      type: body.type || 'B2C',
      level: 'normal',
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      country: body.country || 'China',
      verified: false,
      points: 0,
      totalSpent: 0,
      orderCount: 0,
      addresses: body.address || [],
      registeredAt: new Date().toISOString(),
      tags: ['新注册'],
      status: 'active',
      ...body
    };

    members.unshift(newMember);

    return NextResponse.json({
      success: true,
      data: newMember,
      message: '会员创建成功'
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '会员创建失败'
    }, { status: 400 });
  }
}

// PUT - 更新会员信息
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = members.findIndex(m => m.id === id);
    if (index === -1) {
      return NextResponse.json({
        success: false,
        message: '会员不存在'
      }, { status: 404 });
    }

    // 自动升级会员等级
    if (updates.totalSpent !== undefined) {
      const spent = updates.totalSpent;
      if (spent >= 100000) updates.level = 'diamond';
      else if (spent >= 20000) updates.level = 'gold';
      else if (spent >= 5000) updates.level = 'silver';
      else updates.level = 'normal';
    }

    members[index] = { ...members[index], ...updates };

    return NextResponse.json({
      success: true,
      data: members[index],
      message: '会员信息更新成功'
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '会员信息更新失败'
    }, { status: 400 });
  }
}

// DELETE - 删除会员
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      success: false,
      message: '缺少会员ID'
    }, { status: 400 });
  }

  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: '会员不存在'
    }, { status: 404 });
  }

  // 软删除 - 改为blocked状态
  members[index].status = 'blocked';

  return NextResponse.json({
    success: true,
    message: '会员已禁用'
  });
}
