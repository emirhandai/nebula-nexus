import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Admin API çalışıyor!',
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test API hatası' },
      { status: 500 }
    );
  }
} 