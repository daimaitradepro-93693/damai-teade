import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function getInquiries() {
  try {
    await ensureDataDir();
    if (!existsSync(INQUIRIES_FILE)) {
      return [];
    }
    const data = await readFile(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveInquiries(inquiries: unknown[]) {
  await ensureDataDir();
  await writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
}

// GET - 获取所有咨询（管理员用）
export async function GET() {
  try {
    const inquiries = await getInquiries();
    // 按时间倒序排列
    inquiries.sort((a: { createdAt: string }, b: { createdAt: string }) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取数据失败' }, { status: 500 });
  }
}

// POST - 提交新咨询
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // 验证必填字段
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: '请填写必填字段（姓名、邮箱、咨询内容）' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    const inquiries = await getInquiries();
    
    const newInquiry = {
      id: `inquiry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || '常规咨询',
      message: message.trim(),
      status: 'pending', // pending, read, replied
      createdAt: new Date().toISOString(),
    };

    inquiries.push(newInquiry);
    await saveInquiries(inquiries);

    return NextResponse.json({
      success: true,
      message: '咨询提交成功，我们会尽快与您联系',
      data: { id: newInquiry.id }
    });
  } catch (error) {
    console.error('提交咨询失败:', error);
    return NextResponse.json(
      { success: false, error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// PATCH - 更新咨询状态
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const inquiries = await getInquiries();
    const index = inquiries.findIndex((i: { id: string }) => i.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: '咨询不存在' },
        { status: 404 }
      );
    }

    inquiries[index].status = status;
    inquiries[index].updatedAt = new Date().toISOString();
    await saveInquiries(inquiries);

    return NextResponse.json({ success: true, message: '状态更新成功' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除咨询
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少咨询ID' },
        { status: 400 }
      );
    }

    let inquiries = await getInquiries();
    const initialLength = inquiries.length;
    inquiries = inquiries.filter((i: { id: string }) => i.id !== id);

    if (inquiries.length === initialLength) {
      return NextResponse.json(
        { success: false, error: '咨询不存在' },
        { status: 404 }
      );
    }

    await saveInquiries(inquiries);

    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
  }
}
