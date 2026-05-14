import { NextResponse } from 'next/server';

// 物流轨迹接口
interface TrackingEvent {
  time: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingResult {
  success: boolean;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'customs' | 'out_for_delivery' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
  weight?: string;
  dimensions?: string;
  service?: string;
}

// 模拟物流数据
const mockTrackingData: Record<string, TrackingResult> = {
  'DHL123456789': {
    success: true,
    carrier: 'DHL Express',
    trackingNumber: 'DHL123456789',
    status: 'in_transit',
    origin: 'Shenzhen, China',
    destination: 'Los Angeles, USA',
    estimatedDelivery: '2024-01-20',
    weight: '25.5 kg',
    dimensions: '60x40x30 cm',
    service: 'DHL Express Worldwide',
    events: [
      { time: '2024-01-17 14:30', status: 'in_transit', location: 'Anchorage, USA', description: '包裹已到达中转站' },
      { time: '2024-01-16 22:15', status: 'in_transit', location: 'Hong Kong', description: '包裹已离港' },
      { time: '2024-01-16 18:00', status: 'in_transit', location: 'Hong Kong', description: '包裹已到达香港转运中心' },
      { time: '2024-01-16 10:00', status: 'in_transit', location: 'Shenzhen', description: '包裹已离港' },
      { time: '2024-01-16 08:30', status: 'in_transit', location: 'Shenzhen', description: '包裹正在运输中' },
      { time: '2024-01-15 16:00', status: 'pending', location: 'Shenzhen', description: '已发货' }
    ]
  },
  'SF987654321': {
    success: true,
    carrier: '顺丰速运',
    trackingNumber: 'SF987654321',
    status: 'delivered',
    origin: '广州',
    destination: '深圳',
    estimatedDelivery: '2024-01-18',
    weight: '2.3 kg',
    service: '顺丰标快',
    events: [
      { time: '2024-01-18 10:15', status: 'delivered', location: '深圳', description: '已签收，签收人：本人' },
      { time: '2024-01-18 08:30', status: 'out_for_delivery', location: '深圳南山区', description: '快递员正在派送' },
      { time: '2024-01-18 06:00', status: 'in_transit', location: '深圳', description: '包裹已到达深圳集散中心' },
      { time: '2024-01-17 22:00', status: 'in_transit', location: '广州', description: '包裹已离港' },
      { time: '2024-01-17 18:00', status: 'pending', location: '广州', description: '已揽收' }
    ]
  }
};

// 物流公司配置
const carriers = [
  { code: 'DHL', name: 'DHL Express', url: 'https://www.dhl.com', apiKey: 'demo' },
  { code: 'FedEx', name: 'FedEx', url: 'https://www.fedex.com', apiKey: 'demo' },
  { code: 'UPS', name: 'UPS', url: 'https://www.ups.com', apiKey: 'demo' },
  { code: 'SF', name: '顺丰速运', url: 'https://www.sf-express.com', apiKey: 'demo' },
  { code: 'EMS', name: 'EMS', url: 'https://www.ems.com.cn', apiKey: 'demo' },
  { code: 'TNT', name: 'TNT Express', url: 'https://www.tnt.com', apiKey: 'demo' }
];

// 运费计算接口
interface ShippingQuote {
  carrier: string;
  service: string;
  estimatedDays: number;
  basePrice: number;
  fuelSurcharge: number;
  totalPrice: number;
  currency: string;
}

// GET - 物流追踪
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingNumber = searchParams.get('tracking');
  const carrier = searchParams.get('carrier');
  const action = searchParams.get('action');

  // 获取物流公司列表
  if (action === 'carriers') {
    return NextResponse.json({
      success: true,
      data: carriers
    });
  }

  // 如果没有tracking参数，返回物流列表
  if (!trackingNumber) {
    return NextResponse.json({
      success: true,
      message: '请提供运单号进行查询',
      data: {
        carriers: carriers,
        recentShipments: Object.values(mockTrackingData).map(t => ({
          trackingNumber: t.trackingNumber,
          carrier: t.carrier,
          status: t.status,
          destination: t.destination
        }))
      }
    });
  }

  // 物流追踪查询
  // 查找模拟数据
  const result = mockTrackingData[trackingNumber];
  
  if (result) {
    return NextResponse.json({
      success: true,
      data: result
    });
  }

  // 生成模拟数据
  const mockResult: TrackingResult = {
    success: true,
    carrier: carrier || 'DHL Express',
    trackingNumber,
    status: 'in_transit',
    origin: 'Shenzhen, China',
    destination: 'International',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    events: [
      { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: 'in_transit', location: 'Shenzhen', description: '包裹正在运输中' },
      { time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 16), status: 'pending', location: 'Shenzhen', description: '已发货' }
    ]
  };

  return NextResponse.json({
    success: true,
    data: mockResult
  });
}

// POST - 运费计算
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      origin, 
      destination, 
      weight, 
      length, 
      width, 
      height,
      value,
      currency = 'USD'
    } = body;

    // 模拟运费计算
    const volumeWeight = (length * width * height) / 5000; // 体积重
    const chargeableWeight = Math.max(weight, volumeWeight);
    
    const quotes: ShippingQuote[] = [];

    // DHL报价
    const dhlBasePrice = chargeableWeight * 12 + 50;
    quotes.push({
      carrier: 'DHL',
      service: 'DHL Express Worldwide',
      estimatedDays: 3,
      basePrice: dhlBasePrice,
      fuelSurcharge: dhlBasePrice * 0.15,
      totalPrice: dhlBasePrice * 1.15,
      currency
    });

    // FedEx报价
    const fedexBasePrice = chargeableWeight * 11 + 45;
    quotes.push({
      carrier: 'FedEx',
      service: 'FedEx International Priority',
      estimatedDays: 4,
      basePrice: fedexBasePrice,
      fuelSurcharge: fedexBasePrice * 0.12,
      totalPrice: fedexBasePrice * 1.12,
      currency
    });

    // UPS报价
    const upsBasePrice = chargeableWeight * 10 + 40;
    quotes.push({
      carrier: 'UPS',
      service: 'UPS Worldwide Express',
      estimatedDays: 4,
      basePrice: upsBasePrice,
      fuelSurcharge: upsBasePrice * 0.13,
      totalPrice: upsBasePrice * 1.13,
      currency
    });

    // 顺丰报价
    const sfBasePrice = chargeableWeight * 8 + 30;
    quotes.push({
      carrier: 'SF',
      service: '顺丰国际标快',
      estimatedDays: 5,
      basePrice: sfBasePrice,
      fuelSurcharge: sfBasePrice * 0.1,
      totalPrice: sfBasePrice * 1.1,
      currency
    });

    return NextResponse.json({
      success: true,
      data: {
        chargeableWeight,
        volumeWeight,
        quotes: quotes.sort((a, b) => a.totalPrice - b.totalPrice)
      }
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: '运费计算失败'
    }, { status: 400 });
  }
}
