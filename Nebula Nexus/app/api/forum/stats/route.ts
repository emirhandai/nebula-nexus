import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('📊 Fetching forum stats...');

    // Bu haftanın başlangıcını hesapla (Pazartesi)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Pazar, 1 = Pazartesi, ...
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Pazartesi'ye kadar olan gün sayısı
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);

    // Toplam post sayısı
    const totalPosts = await prisma.forumPost.count();

    // Bu hafta oluşturulan post sayısı
    const thisWeekPosts = await prisma.forumPost.count({
      where: {
        createdAt: {
          gte: startOfWeek
        }
      }
    });

    // Aktif kullanıcı sayısı (son 30 gün içinde post yazan)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const activeUsersCount = await prisma.forumPost.groupBy({
      by: ['authorId'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const stats = {
      totalPosts,
      activeUsers: activeUsersCount.length,
      thisWeekPosts
    };

    console.log('✅ Forum stats loaded:', stats);

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('❌ Forum stats fetch error:', error);
    
    // Fallback istatistikler
    const fallbackStats = {
      totalPosts: 0,
      activeUsers: 0, 
      thisWeekPosts: 0
    };

    return NextResponse.json({ 
      success: true, 
      stats: fallbackStats,
      fallback: true 
    });
  }
}