import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chatWithAI } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Sistem durumu kontrolü
    const healthChecks = {
      database: await checkDatabase(),
      ai: await checkAIService(),
      memory: await checkMemoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    const responseTime = Date.now() - startTime;
    
    // Genel durum belirleme
    const isHealthy = healthChecks.database.status === 'healthy' && 
                     healthChecks.ai.status === 'healthy';

    const statusCode = isHealthy ? 200 : 503;

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: healthChecks.timestamp,
      responseTime: `${responseTime}ms`,
      uptime: `${Math.floor(healthChecks.uptime)}s`,
      checks: healthChecks
    }, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}

async function checkDatabase() {
  try {
    const startTime = Date.now();
    
    // Veritabanı bağlantısını test et
    await prisma.$queryRaw`SELECT 1`;
    
    // Kullanıcı sayısını kontrol et
    const userCount = await prisma.user.count();
    
    // Test sonuçları sayısını kontrol et
    const testCount = await prisma.oceanResult.count();
    
    const responseTime = Date.now() - startTime;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      metrics: {
        userCount,
        testCount,
        connection: 'active'
      }
    };

  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database connection failed',
      metrics: {
        userCount: 0,
        testCount: 0,
        connection: 'failed'
      }
    };
  }
}

async function checkAIService() {
  try {
    const startTime = Date.now();
    
    // AI servisini test et (basit bir prompt ile)
    const response = await chatWithAI('Merhaba, bu bir sağlık kontrolüdür. Sadece "OK" yanıtla.', { category: 'casual' });
    
    const responseTime = Date.now() - startTime;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      metrics: {
        model: 'gemini-2.0-flash',
        response: response.substring(0, 50) + '...',
        connection: 'active'
      }
    };

  } catch (error) {
    console.error('AI service health check failed:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'AI service connection failed',
      metrics: {
        model: 'gemini-2.0-flash',
        response: 'failed',
        connection: 'failed'
      }
    };
  }
}

async function checkMemoryUsage() {
  try {
    const memUsage = process.memoryUsage();
    
    const memoryInfo = {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    };

    // Memory kullanımı %90'ın altındaysa sağlıklı
    const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    const isHealthy = heapUsagePercent < 90;

    return {
      status: isHealthy ? 'healthy' : 'warning',
      usage: memoryInfo,
      heapUsagePercent: Math.round(heapUsagePercent * 100) / 100
    };

  } catch (error) {
    console.error('Memory usage check failed:', error);
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Memory check failed'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'detailed-check':
        return await performDetailedHealthCheck();
      case 'performance-test':
        return await performPerformanceTest();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}

async function performDetailedHealthCheck() {
  try {
    const startTime = Date.now();
    
    // Detaylı veritabanı kontrolü
    const [totalUsers, totalTests, totalChats, totalRecommendations] = await Promise.all([
      prisma.user.count(),
      prisma.oceanResult.count(),
      prisma.chatSession.count(),
      prisma.careerRecommendation.count()
    ]);

    const dbDetails = {
      total_users: totalUsers,
      total_tests: totalTests,
      total_chats: totalChats,
      total_recommendations: totalRecommendations
    };

    // Sistem bilgileri
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: process.env.NODE_ENV || 'development',
      pid: process.pid
    };

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      database: {
        status: 'healthy',
        details: dbDetails
      },
      system: systemInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Detailed health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Detailed check failed'
    }, { status: 503 });
  }
}

async function performPerformanceTest() {
  try {
    const startTime = Date.now();
    
    // Veritabanı performans testi
    const dbStartTime = Date.now();
    await prisma.user.findMany({ take: 10 });
    const dbResponseTime = Date.now() - dbStartTime;

    // AI performans testi
    const aiStartTime = Date.now();
    await chatWithAI('Performans testi', { category: 'casual' });
    const aiResponseTime = Date.now() - aiStartTime;

    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      performance: {
        totalResponseTime: `${totalResponseTime}ms`,
        databaseResponseTime: `${dbResponseTime}ms`,
        aiResponseTime: `${aiResponseTime}ms`,
        databasePerformance: dbResponseTime < 100 ? 'excellent' : dbResponseTime < 500 ? 'good' : 'slow',
        aiPerformance: aiResponseTime < 2000 ? 'excellent' : aiResponseTime < 5000 ? 'good' : 'slow'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Performance test failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Performance test failed'
    }, { status: 503 });
  }
}

export async function HEAD(request: NextRequest) {
  try {
    // Quick health check for service worker
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
} 