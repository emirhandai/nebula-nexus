import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { logSecurityEvent, SecurityEventType, SecuritySeverity, detectSuspiciousActivity, checkIPReputation } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      await logSecurityEvent({
        action: SecurityEventType.LOGIN_ATTEMPT,
        ipAddress,
        userAgent,
        details: { error: 'Missing credentials' },
        severity: SecuritySeverity.WARNING
      });
      
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for suspicious activity
    if (detectSuspiciousActivity(ipAddress, email + password)) {
      await logSecurityEvent({
        action: SecurityEventType.SUSPICIOUS_ACTIVITY,
        ipAddress,
        userAgent,
        details: { type: 'suspicious_login_attempt', email },
        severity: SecuritySeverity.WARNING
      });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check IP reputation
    const reputation = await checkIPReputation(ipAddress);
    if (reputation.isSuspicious) {
      await logSecurityEvent({
        action: SecurityEventType.SUSPICIOUS_ACTIVITY,
        ipAddress,
        userAgent,
        details: { type: 'suspicious_ip', reason: reputation.reason },
        severity: SecuritySeverity.WARNING
      });
    }

    // Database'den kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      await logSecurityEvent({
        action: SecurityEventType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        details: { email, reason: 'User not found' },
        severity: SecuritySeverity.INFO
      });
      
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Güvenli şifre kontrolü - bcrypt kullan
    let isValidPassword = false;
    
    if (user.password) {
      // Hash'lenmiş şifre varsa bcrypt ile kontrol et
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // Eski sistem için geçici kontrol (sadece development)
      if (process.env.NODE_ENV === 'development') {
        if (email === 'admin@example.com') {
          isValidPassword = password === 'admin123';
        } else if (email === 'test@example.com') {
          isValidPassword = password === '123456';
        } else {
          isValidPassword = password === '123456';
        }
      } else {
        await logSecurityEvent({
          action: SecurityEventType.LOGIN_FAILED,
          ipAddress,
          userAgent,
          details: { email, reason: 'No password hash' },
          severity: SecuritySeverity.WARNING
        });
        
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    if (!isValidPassword) {
      await logSecurityEvent({
        action: SecurityEventType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        details: { email, reason: 'Invalid password' },
        severity: SecuritySeverity.INFO
      });
      
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Banlı kullanıcıların girişini engelle
    if ((user as any).isBanned) {
      await logSecurityEvent({
        action: SecurityEventType.LOGIN_FAILED,
        ipAddress,
        userAgent,
        details: { email, reason: 'Banned user' },
        severity: SecuritySeverity.WARNING
      });
      
      return NextResponse.json(
        { error: 'Account is banned' },
        { status: 403 }
      );
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Log successful login
    await logSecurityEvent({
      userId: user.id,
      action: SecurityEventType.LOGIN_SUCCESS,
      ipAddress,
      userAgent,
      details: { email },
      severity: SecuritySeverity.INFO
    });

    // Kullanıcı bilgilerini döndür
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: email === 'admin@example.com' ? 'admin' : 'user',
      avatar: user.image,
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    
    await logSecurityEvent({
      action: SecurityEventType.LOGIN_FAILED,
      ipAddress,
      userAgent,
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      severity: SecuritySeverity.ERROR
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 