import { NextRequest, NextResponse } from 'next/server';

// 网站设置管理
const defaultSettings = {
  siteName: '大迈国际贸易有限公司',
  siteTitle: '专业进出口贸易服务',
  siteDescription: '专业从事进出口贸易、国际物流、报关清关、跨境电商等外贸服务',
  keywords: ['进出口贸易', '国际物流', '报关清关', '外贸服务'],
  contact: {
    phone: '15999660432',
    email: 'daimai.tradepro@gmail.com',
    address: '中国海南',
  },
  social: {
    wechat: '',
    twitter: '',
    facebook: '',
    linkedin: '',
  },
  updatedAt: new Date().toISOString(),
};

let settings = { ...defaultSettings };

export async function GET() {
  return NextResponse.json({
    success: true,
    data: settings,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    settings = {
      ...settings,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({
      success: true,
      message: '设置保存成功',
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '保存设置失败' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
