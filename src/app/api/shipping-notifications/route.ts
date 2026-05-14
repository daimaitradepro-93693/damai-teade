import { NextRequest, NextResponse } from 'next/server';

// 发货通知服务

interface ShipmentNotification {
  id: string;
  orderId: string;
  orderNo: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  shippedAt: string;
  status: 'sent' | 'delivered' | 'failed';
  notificationType: 'email' | 'sms' | 'both';
  emailSent: boolean;
  smsSent: boolean;
  createdAt: string;
}

// 模拟通知记录
let notifications: ShipmentNotification[] = [
  {
    id: 'notif_001',
    orderId: 'ord_001',
    orderNo: 'DM2024011500001',
    customerEmail: 'john@example.com',
    customerPhone: '+1-555-0123',
    customerName: 'John Smith',
    trackingNumber: 'DHL123456789',
    carrier: 'DHL Express',
    estimatedDelivery: '2024-01-20',
    shippedAt: '2024-01-15T10:00:00Z',
    status: 'sent',
    notificationType: 'both',
    emailSent: true,
    smsSent: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'notif_002',
    orderId: 'ord_002',
    orderNo: 'DM2024011400001',
    customerEmail: 'lisi@163.com',
    customerPhone: '13800138000',
    customerName: '李四',
    trackingNumber: 'SF987654321',
    carrier: '顺丰速运',
    estimatedDelivery: '2024-01-16',
    shippedAt: '2024-01-14T14:00:00Z',
    status: 'delivered',
    notificationType: 'both',
    emailSent: true,
    smsSent: true,
    createdAt: '2024-01-14T14:00:00Z'
  }
];

// 邮件模板
const emailTemplate = (data: {
  customerName: string;
  orderNo: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>您的订单已发货 - 大迈国际贸易</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0;">📦 您的订单已发货</h1>
  </div>
  
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">尊敬的 <strong>${data.customerName}</strong>，</p>
    <p>您的订单已经发货，以下是物流信息：</p>
    
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #64748b;">订单号</td>
          <td style="padding: 10px 0; font-weight: bold;">${data.orderNo}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b;">快递公司</td>
          <td style="padding: 10px 0; font-weight: bold;">${data.carrier}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b;">运单号</td>
          <td style="padding: 10px 0; font-weight: bold; color: #3b82f6;">${data.trackingNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b;">预计送达</td>
          <td style="padding: 10px 0; font-weight: bold; color: #22c55e;">${data.estimatedDelivery}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.dhl.com/cn-zh/home/tracking/tracking-parcel.html?submit=1&tracking-id=${data.trackingNumber}" 
         style="background: #3b82f6; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block;">
        查看物流详情
      </a>
    </div>
    
    <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
      如有任何问题，请随时联系我们：<br>
      📧 邮箱：daimai.tradepro@gmail.com<br>
      📞 电话：159-9966-0432
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
      © 2024 大迈国际贸易有限公司 版权所有
    </div>
  </div>
</body>
</html>
`;

// SMS模板
const smsTemplate = (data: {
  customerName: string;
  orderNo: string;
  trackingNumber: string;
  carrier: string;
}) => `【大迈国际贸易】尊敬的${data.customerName}，您的订单${data.orderNo}已发货。快递：${data.carrier}，运单号：${data.trackingNumber}。如有疑问请致电159-9966-0432。`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');

  let filteredNotifications = [...notifications];

  if (status) {
    filteredNotifications = filteredNotifications.filter(n => n.status === status);
  }

  const startIndex = (page - 1) * limit;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + limit);

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    delivered: notifications.filter(n => n.status === 'delivered').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    emailSent: notifications.filter(n => n.emailSent).length,
    smsSent: notifications.filter(n => n.smsSent).length
  };

  return NextResponse.json({
    success: true,
    data: {
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: filteredNotifications.length,
        totalPages: Math.ceil(filteredNotifications.length / limit)
      },
      stats
    }
  });
}

// 发送发货通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      orderNo, 
      customerEmail, 
      customerPhone, 
      customerName, 
      trackingNumber, 
      carrier, 
      estimatedDelivery,
      notificationType = 'both'
    } = body;

    // 创建通知记录
    const notification: ShipmentNotification = {
      id: `notif_${Date.now()}`,
      orderId,
      orderNo,
      customerEmail,
      customerPhone,
      customerName,
      trackingNumber,
      carrier,
      estimatedDelivery,
      shippedAt: new Date().toISOString(),
      status: 'sent',
      notificationType: notificationType as 'email' | 'sms' | 'both',
      emailSent: notificationType === 'email' || notificationType === 'both',
      smsSent: notificationType === 'sms' || notificationType === 'both',
      createdAt: new Date().toISOString()
    };

    notifications.unshift(notification);

    // 模拟发送邮件
    const emailContent = emailTemplate({
      customerName,
      orderNo,
      trackingNumber,
      carrier,
      estimatedDelivery
    });

    // 模拟发送SMS
    const smsContent = smsTemplate({
      customerName,
      orderNo,
      trackingNumber,
      carrier
    });

    return NextResponse.json({
      success: true,
      message: '发货通知已发送',
      data: {
        notification,
        emailPreview: notification.emailSent ? emailContent : null,
        smsPreview: notification.smsSent ? smsContent : null
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '发送失败'
    }, { status: 500 });
  }
}

// 批量发送通知
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders } = body;

    const results = orders.map((order: {
      orderId: string;
      orderNo: string;
      customerEmail: string;
      customerPhone: string;
      customerName: string;
      trackingNumber: string;
      carrier: string;
      estimatedDelivery: string;
    }) => {
      const notification: ShipmentNotification = {
        id: `notif_${Date.now()}_${order.orderId}`,
        orderId: order.orderId,
        orderNo: order.orderNo,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerName: order.customerName,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        estimatedDelivery: order.estimatedDelivery,
        shippedAt: new Date().toISOString(),
        status: 'sent',
        notificationType: 'both',
        emailSent: true,
        smsSent: true,
        createdAt: new Date().toISOString()
      };

      notifications.unshift(notification);
      return notification;
    });

    return NextResponse.json({
      success: true,
      message: `成功发送 ${results.length} 条发货通知`,
      data: results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '批量发送失败'
    }, { status: 500 });
  }
}
