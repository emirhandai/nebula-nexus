import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { privacy } = await request.json();

    // Session'dan user'ı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    console.log('Privacy API - Received data:', { userId: user.id, privacy });

    if (!privacy) {
      console.log('Privacy API - Missing required fields');
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Privacy ayarlarını güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        showEmail: privacy.showEmail,
        showPhone: privacy.showPhone,
        showLocation: privacy.showLocation,
        showStats: privacy.showStats,
        emailNotifications: privacy.emailNotifications,
        pushNotifications: privacy.pushNotifications,
        smsNotifications: privacy.smsNotifications
      },
      select: {
        id: true,
        name: true,
        email: true,
        showEmail: true,
        showPhone: true,
        showLocation: true,
        showStats: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: true
      }
    });

    return NextResponse.json({
      success: true,
      privacy: {
        showEmail: updatedUser.showEmail,
        showPhone: updatedUser.showPhone,
        showLocation: updatedUser.showLocation,
        showStats: updatedUser.showStats,
        emailNotifications: updatedUser.emailNotifications,
        pushNotifications: updatedUser.pushNotifications,
        smsNotifications: updatedUser.smsNotifications
      }
    });
  } catch (error) {
    console.error('Privacy update error:', error);
    return NextResponse.json(
      { error: 'Gizlilik ayarları güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
} 