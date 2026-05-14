import { NextResponse } from 'next/server';

// 模拟数据存储
let products = [
  {
    id: 'prod_001',
    name: '日用百货',
    nameEn: 'Daily Necessaries',
    category: '日用百货',
    categoryEn: 'Daily Necessaries',
    subcategory: '家居用品',
    subcategoryEn: 'Home Supplies',
    description: '各类日用消费品，包括厨房用品、清洁用品等',
    descriptionEn: 'Various daily consumer goods including kitchen supplies, cleaning products, etc.',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
    price: '面议',
    specifications: { 材质: '多种', 规格: '标准', 产地: '中国' },
    featured: true,
    status: 'active',
    views: 156,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'prod_002',
    name: '建材家居',
    nameEn: 'Building Materials',
    category: '建材家居',
    categoryEn: 'Building Materials',
    subcategory: '装饰材料',
    subcategoryEn: 'Decoration Materials',
    description: '建筑钢材、水泥、陶瓷、照明设备等',
    descriptionEn: 'Steel, cement, ceramics, lighting equipment, etc.',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'],
    price: '面议',
    specifications: { 材质: '优质钢材/水泥', 规格: '国标', 产地: '中国' },
    featured: true,
    status: 'active',
    views: 203,
    createdAt: '2024-01-16T08:00:00Z'
  },
  {
    id: 'prod_003',
    name: '智能设备',
    nameEn: 'Smart Devices',
    category: '智能设备',
    categoryEn: 'Smart Devices',
    subcategory: '智能家居',
    subcategoryEn: 'Smart Home',
    description: '智能农机装备、无人机、智能家居设备等',
    descriptionEn: 'Smart agricultural machinery, drones, smart home devices, etc.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    price: '面议',
    specifications: { 类型: '智能设备', 保修: '1年', 产地: '中国' },
    featured: true,
    status: 'active',
    views: 189,
    createdAt: '2024-01-17T08:00:00Z'
  },
  {
    id: 'prod_004',
    name: '化工能源',
    nameEn: 'Chemical & Energy',
    category: '化工能源',
    categoryEn: 'Chemical & Energy',
    subcategory: '化工产品',
    subcategoryEn: 'Chemical Products',
    description: '塑料制品、橡胶、石油制品、煤炭、矿石等',
    descriptionEn: 'Plastics, rubber, petroleum products, coal, minerals, etc.',
    images: ['https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600'],
    price: '面议',
    specifications: { 类型: '化工/能源', 规格: '工业级', 产地: '中国' },
    featured: false,
    status: 'active',
    views: 134,
    createdAt: '2024-01-18T08:00:00Z'
  },
  {
    id: 'prod_005',
    name: '纺织品皮革',
    nameEn: 'Textiles & Leather',
    category: '纺织品皮革',
    categoryEn: 'Textiles & Leather',
    subcategory: '纺织品',
    subcategoryEn: 'Textiles',
    description: '针纺织品、皮革制品、家纺产品等',
    descriptionEn: 'Knitwear, leather goods, home textiles, etc.',
    images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600'],
    price: '面议',
    specifications: { 材质: '棉/皮革', 规格: '标准', 产地: '中国' },
    featured: false,
    status: 'active',
    views: 98,
    createdAt: '2024-01-19T08:00:00Z'
  }
];

// GET - 获取产品列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category === category || p.subcategory === category
    );
  }

  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(p => p.featured);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.nameEn.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.descriptionEn.toLowerCase().includes(searchLower)
    );
  }

  // 获取所有分类
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products.map(p => p.subcategory))];

  return NextResponse.json({
    success: true,
    data: filteredProducts,
    categories,
    subcategories,
    total: filteredProducts.length
  });
}

// POST - 添加产品
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...body,
      views: 0,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    
    return NextResponse.json({
      success: true,
      message: '产品添加成功',
      data: newProduct
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '产品添加失败'
    }, { status: 400 });
  }
}

// PUT - 批量更新产品
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ids, action, data } = body;

    if (action === 'batchDelete' && ids) {
      products = products.filter(p => !ids.includes(p.id));
      return NextResponse.json({
        success: true,
        message: `成功删除 ${ids.length} 个产品`
      });
    }

    if (action === 'batchUpdate' && ids && data) {
      products = products.map(p => 
        ids.includes(p.id) ? { ...p, ...data } : p
      );
      return NextResponse.json({
        success: true,
        message: `成功更新 ${ids.length} 个产品`
      });
    }

    return NextResponse.json({
      success: false,
      message: '无效的操作'
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '操作失败'
    }, { status: 400 });
  }
}
