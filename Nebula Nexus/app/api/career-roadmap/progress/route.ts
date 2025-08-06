import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, roadmapId, itemId, itemType } = await request.json();

    if (!userId || !roadmapId || !itemId || !itemType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mevcut roadmap'i bul
    const roadmap = await prisma.careerRoadmap.findFirst({
      where: {
        id: roadmapId,
        userId: userId
      }
    });

    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    // İlerleme kaydını oluştur
    await prisma.progressTracking.create({
      data: {
        userId,
        roadmapId,
        itemId,
        itemType,
        progress: 100,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // Toplam tamamlanan öğe sayısını hesapla
    const completedItems = await prisma.progressTracking.count({
      where: {
        userId,
        roadmapId,
        isCompleted: true
      }
    });

    // Basit ilerleme hesaplama
    const progress = Math.min(100, completedItems * 10); // Her öğe %10 ilerleme

    // Roadmap'i güncelle
    await prisma.careerRoadmap.update({
      where: { id: roadmapId },
      data: {
        currentLevel: Math.min(roadmap.totalLevels, Math.floor(progress / 20) + 1)
      }
    });

    return NextResponse.json({
      success: true,
      progress,
      completedItems,
      currentLevel: roadmap.currentLevel
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 