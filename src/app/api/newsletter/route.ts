import { NextRequest, NextResponse } from 'next/server';

// 模拟订阅者数据
let subscribers = [
  {
    id: 'sub_001',
    email: 'john@example.com',
    name: 'John Smith',
    company: 'ABC Trading Co.',
    country: 'USA',
    interests: ['机械', '电子产品'],
    source: 'website',
    status: 'active',
    subscribedAt: '2024-01-10T08:00:00Z',
    lastEmailSent: '2024-01-15T10:00:00Z',
    emailCount: 5,
    openRate: 0.8,
    clickRate: 0.4
  },
  {
    id: 'sub_002',
    email: 'zhangsan@163.com',
    name: '张三',
    company: '深圳贸易公司',
    country: 'China',
    interests: ['日用百货', '建材家居'],
    source: 'rfq',
    status: 'active',
    subscribedAt: '2024-01-08T08:00:00Z',
    lastEmailSent: '2024-01-14T10:00:00Z',
    emailCount: 7,
    openRate: 0.9,
    clickRate: 0.6
  },
  {
    id: 'sub_003',
    email: 'maria@gmail.com',
    name: 'Maria Garcia',
    company: 'Garcia Imports',
    country: 'Spain',
    interests: ['纺织品', '工艺品'],
    source: 'website',
    status: 'active',
    subscribedAt: '2024-01-05T08:00:00Z',
    lastEmailSent: '2024-01-13T10:00:00Z',
    emailCount: 8,
    openRate: 0.75,
    clickRate: 0.35
  }
];

// 邮件模板
const emailTemplates = [
  {
    id: 'tpl_001',
    name: '产品推荐',
    subject: '大迈国际贸易 - 本周精选产品推荐',
    type: 'product',
    lastUsed: '2024-01-15T10:00:00Z'
  },
  {
    id: 'tpl_002',
    name: '促销活动',
    subject: '限时优惠！大迈国际贸易春季促销',
    type: 'promotion',
    lastUsed: '2024-01-10T10:00:00Z'
  },
  {
    id: 'tpl_003',
    name: '新闻资讯',
    subject: '大迈国际贸易 - 行业资讯动态',
    type: 'newsletter',
    lastUsed: '2024-01-08T10:00:00Z'
  },
  {
    id: 'tpl_004',
    name: '欢迎邮件',
    subject: '欢迎订阅大迈国际贸易资讯',
    type: 'welcome',
    lastUsed: '2024-01-15T08:00:00Z'
  }
];

// 邮件发送历史
const emailHistory = [
  {
    id: 'mail_001',
    templateId: 'tpl_001',
    templateName: '产品推荐',
    subject: '大迈国际贸易 - 本周精选产品推荐',
    recipients: 1250,
    sentAt: '2024-01-15T10:00:00Z',
    status: 'sent',
    stats: {
      delivered: 1200,
      opened: 850,
      clicked: 320,
      bounced: 50
    }
  },
  {
    id: 'mail_002',
    templateId: 'tpl_002',
    templateName: '促销活动',
    subject: '限时优惠！大迈国际贸易春季促销',
    recipients: 1180,
    sentAt: '2024-01-10T10:00:00Z',
    status: 'sent',
    stats: {
      delivered: 1150,
      opened: 920,
      clicked: 450,
      bounced: 30
    }
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // 获取订阅者列表
  if (action === 'subscribers') {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredSubscribers = [...subscribers];

    if (status) {
      filteredSubscribers = filteredSubscribers.filter(s => s.status === status);
    }
    if (search) {
      filteredSubscribers = filteredSubscribers.filter(s => 
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: {
        subscribers: paginatedSubscribers,
        pagination: {
          page,
          limit,
          total: filteredSubscribers.length,
          totalPages: Math.ceil(filteredSubscribers.length / limit)
        },
        stats: {
          total: subscribers.length,
          active: subscribers.filter(s => s.status === 'active').length,
          unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
          bounced: subscribers.filter(s => s.status === 'bounced').length
        }
      }
    });
  }

  // 获取邮件模板
  if (action === 'templates') {
    return NextResponse.json({
      success: true,
      data: emailTemplates
    });
  }

  // 获取发送历史
  if (action === 'history') {
    return NextResponse.json({
      success: true,
      data: emailHistory
    });
  }

  // 默认返回概览
  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalSubscribers: subscribers.length,
        activeSubscribers: subscribers.filter(s => s.status === 'active').length,
        avgOpenRate: subscribers.reduce((sum, s) => sum + s.openRate, 0) / subscribers.length,
        avgClickRate: subscribers.reduce((sum, s) => sum + s.clickRate, 0) / subscribers.length,
        totalEmailsSent: emailHistory.reduce((sum, h) => sum + h.recipients, 0)
      },
      recentSubscribers: subscribers.slice(0, 5),
      recentEmails: emailHistory.slice(0, 5)
    }
  });
}

// 添加订阅者
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, name, company, country, interests, source, templateId, subject, content, recipients } = body;

    // 添加订阅
    if (action === 'subscribe') {
      // 检查是否已存在
      const existing = subscribers.find(s => s.email === email);
      if (existing) {
        if (existing.status === 'unsubscribed') {
          existing.status = 'active';
          return NextResponse.json({
            success: true,
            message: '重新订阅成功',
            data: existing
          });
        }
        return NextResponse.json({
          success: false,
          message: '该邮箱已订阅'
        }, { status: 400 });
      }

      const newSubscriber = {
        id: `sub_${Date.now()}`,
        email,
        name: name || '',
        company: company || '',
        country: country || '',
        interests: interests || [],
        source: source || 'website',
        status: 'active',
        subscribedAt: new Date().toISOString(),
        lastEmailSent: '',
        emailCount: 0,
        openRate: 0,
        clickRate: 0
      };

      subscribers.push(newSubscriber as any);

      return NextResponse.json({
        success: true,
        message: '订阅成功',
        data: newSubscriber
      });
    }

    // 取消订阅
    if (action === 'unsubscribe') {
      const subscriber = subscribers.find(s => s.email === email);
      if (subscriber) {
        subscriber.status = 'unsubscribed';
        return NextResponse.json({
          success: true,
          message: '取消订阅成功'
        });
      }
      return NextResponse.json({
        success: false,
        message: '未找到订阅记录'
      }, { status: 404 });
    }

    // 发送邮件
    if (action === 'send') {
      const newEmail = {
        id: `mail_${Date.now()}`,
        templateId,
        templateName: emailTemplates.find(t => t.id === templateId)?.name || '自定义邮件',
        subject,
        recipients: recipients?.length || subscribers.filter(s => s.status === 'active').length,
        sentAt: new Date().toISOString(),
        status: 'sending',
        stats: {
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0
        }
      };

      emailHistory.unshift(newEmail);

      return NextResponse.json({
        success: true,
        message: '邮件已开始发送',
        data: newEmail
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
    }, { status: 500 });
  }
}
