import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { userInputSchema, sanitizers, handleValidationError } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validation
    const validationResult = userInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: handleValidationError(validationResult.error) },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Additional sanitization
    const sanitizedName = sanitizers.name(name);
    const sanitizedEmail = sanitizers.email(email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Hash password with higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with sanitized data
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isBanned: false,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 