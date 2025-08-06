import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Basit şifreleme anahtarı (production'da environment variable kullanılmalı)
const ENCRYPTION_KEY = process.env.CHAT_ENCRYPTION_KEY || 'your-secret-key-32-chars-long!';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, messageId, content, password } = body;

    switch (action) {
      case 'encrypt-message':
        return await encryptMessage(content, password);
      case 'decrypt-message':
        return await decryptMessage(content, password);
      case 'hide-message':
        return await hideMessage(messageId, session.user.id);
      case 'unhide-message':
        return await unhideMessage(messageId, session.user.id);
      case 'set-message-password':
        return await setMessagePassword(messageId, password, session.user.id);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Security API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function encryptText(text: string, password: string): string {
  try {
    // Password'den key türet
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // IV'yi encrypted text ile birleştir
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
}

function decryptText(encryptedText: string, password: string): string {
  try {
    // IV ve encrypted text'i ayır
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    // Password'den key türet
    const key = crypto.scryptSync(password, 'salt', 32);
    
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed - wrong password or corrupted data');
  }
}

async function encryptMessage(content: string, password: string) {
  try {
    if (!password) {
      return NextResponse.json({ error: 'Password is required for encryption' }, { status: 400 });
    }

    const encryptedContent = encryptText(content, password);
    
    return NextResponse.json({
      success: true,
      encryptedContent,
      message: 'Message encrypted successfully'
    });

  } catch (error) {
    console.error('Error encrypting message:', error);
    return NextResponse.json({ error: 'Failed to encrypt message' }, { status: 500 });
  }
}

async function decryptMessage(encryptedContent: string, password: string) {
  try {
    if (!password) {
      return NextResponse.json({ error: 'Password is required for decryption' }, { status: 400 });
    }

    const decryptedContent = decryptText(encryptedContent, password);
    
    return NextResponse.json({
      success: true,
      decryptedContent,
      message: 'Message decrypted successfully'
    });

  } catch (error) {
    console.error('Error decrypting message:', error);
    return NextResponse.json({ 
      error: 'Failed to decrypt message - wrong password or corrupted data' 
    }, { status: 400 });
  }
}

async function hideMessage(messageId: string, userId: string) {
  try {
    // Mesajın kullanıcıya ait olduğunu kontrol et
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        session: {
          userId: userId
        }
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found or access denied' }, { status: 404 });
    }

    // Mesajı gizle (soft delete)
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { 
        isHidden: true,
        hiddenAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message hidden successfully'
    });

  } catch (error) {
    console.error('Error hiding message:', error);
    return NextResponse.json({ error: 'Failed to hide message' }, { status: 500 });
  }
}

async function unhideMessage(messageId: string, userId: string) {
  try {
    // Mesajın kullanıcıya ait olduğunu kontrol et
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        session: {
          userId: userId
        }
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found or access denied' }, { status: 404 });
    }

    // Mesajı göster
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { 
        isHidden: false,
        hiddenAt: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message unhidden successfully'
    });

  } catch (error) {
    console.error('Error unhiding message:', error);
    return NextResponse.json({ error: 'Failed to unhide message' }, { status: 500 });
  }
}

async function setMessagePassword(messageId: string, password: string, userId: string) {
  try {
    // Mesajın kullanıcıya ait olduğunu kontrol et
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        session: {
          userId: userId
        }
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found or access denied' }, { status: 404 });
    }

    // Password hash'le
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Mesaja password ekle
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { 
        passwordHash: passwordHash,
        isPasswordProtected: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message password set successfully'
    });

  } catch (error) {
    console.error('Error setting message password:', error);
    return NextResponse.json({ error: 'Failed to set message password' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const messageId = searchParams.get('messageId');

    switch (action) {
      case 'check-message-protection':
        return await checkMessageProtection(messageId, session.user.id);
      case 'get-hidden-messages':
        return await getHiddenMessages(session.user.id);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Security API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkMessageProtection(messageId: string | null, userId: string) {
  try {
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        session: {
          userId: userId
        }
      },
      select: {
        id: true,
        isPasswordProtected: true,
        isHidden: true,
        passwordHash: true
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      isPasswordProtected: message.isPasswordProtected || false,
      isHidden: message.isHidden || false,
      hasPassword: !!message.passwordHash
    });

  } catch (error) {
    console.error('Error checking message protection:', error);
    return NextResponse.json({ error: 'Failed to check message protection' }, { status: 500 });
  }
}

async function getHiddenMessages(userId: string) {
  try {
    const hiddenMessages = await prisma.chatMessage.findMany({
      where: {
        session: {
          userId: userId
        },
        isHidden: true
      },
      select: {
        id: true,
        content: true,
        role: true,
        timestamp: true,
        hiddenAt: true,
        session: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        hiddenAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      hiddenMessages
    });

  } catch (error) {
    console.error('Error getting hidden messages:', error);
    return NextResponse.json({ error: 'Failed to get hidden messages' }, { status: 500 });
  }
} 