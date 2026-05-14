import { NextResponse } from 'next/server';

// 模拟产品数据
const products = [
  {
    id: 1,
    name: '工业机械设备',
    nameEn: 'Industrial Machinery',
    category: '机械设备',
    price: 25000,
    currency: 'USD',
    minOrder: 1,
    unit: '台',
    description: '高效能工业机械设备，适用于各种生产线',
    descriptionEn: 'High-efficiency industrial machinery for various production lines',
    images: ['/images/product-1.jpg'],
    specifications: {
      power: '380V 50Hz',
      weight: '2500kg',
      dimensions: '3000x1500x2000mm',
      capacity: '5000 units/day'
    },
    certifications: ['CE', 'ISO9001', 'UL'],
    stock: 50,
    leadTime: '15-20 days',
    origin: 'China',
    hsCode: '8479.89.00'
  },
  {
    id: 2,
    name: '智能电子元器件',
    nameEn: 'Smart Electronic Components',
    category: '电子产品',
    price: 5.5,
    currency: 'USD',
    minOrder: 100,
    unit: '件',
    description: '高品质智能电子元器件，广泛应用于消费电子',
    descriptionEn: 'High-quality smart electronic components for consumer electronics',
    images: ['/images/product-2.jpg'],
    specifications: {
      voltage: '3.3V-5V',
      temperature: '-40°C to 85°C',
      package: 'SMD/QFP',
      rohs: 'Compliant'
    },
    certifications: ['CE', 'RoHS', 'FCC'],
    stock: 50000,
    leadTime: '7-10 days',
    origin: 'China',
    hsCode: '8542.31.00'
  },
  {
    id: 3,
    name: '高端纺织品面料',
    nameEn: 'Premium Textile Fabric',
    category: '纺织品',
    price: 12.8,
    currency: 'USD',
    minOrder: 500,
    unit: '米',
    description: '优质天然纤维面料，柔软舒适，适合高端服装',
    descriptionEn: 'Premium natural fiber fabric, soft and comfortable for high-end apparel',
    images: ['/images/product-3.jpg'],
    specifications: {
      composition: '100% Cotton',
      width: '150cm',
      weight: '180g/m²',
      color: 'Custom'
    },
    certifications: ['OEKO-TEX', 'GOTS', 'BCI'],
    stock: 100000,
    leadTime: '10-15 days',
    origin: 'China',
    hsCode: '5208.32.00'
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return NextResponse.json(
      { success: false, message: '产品不存在' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: product
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);
  const body = await request.json();
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return NextResponse.json(
      { success: false, message: '产品不存在' },
      { status: 404 }
    );
  }
  
  // 模拟更新
  return NextResponse.json({
    success: true,
    message: '产品更新成功',
    data: { ...products[productIndex], ...body }
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return NextResponse.json(
      { success: false, message: '产品不存在' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    message: '产品删除成功'
  });
}
