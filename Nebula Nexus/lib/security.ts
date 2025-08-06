import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Security event types
export enum SecurityEventType {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGE = 'password_change',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_TOKEN = 'invalid_token',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  CSRF_ATTEMPT = 'csrf_attempt',
  FILE_UPLOAD_ATTEMPT = 'file_upload_attempt',
  API_ABUSE = 'api_abuse'
}

// Security severity levels
export enum SecuritySeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Security log interface
export interface SecurityLogData {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  severity: SecuritySeverity;
}

// Log security event
export async function logSecurityEvent(data: SecurityLogData): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        details: data.details ? JSON.stringify(data.details) : null,
        severity: data.severity
      }
    });
  } catch (error) {
    console.error('Security log error:', error);
  }
}

// Detect suspicious activity
export function detectSuspiciousActivity(ipAddress: string, action: string, userId?: string): boolean {
  // Rate limiting check
  const rateLimitKey = `${ipAddress}:${action}`;
  const currentTime = Date.now();
  
  // Check if this IP has been flagged before
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /on\w+=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i
  ];
  
  // Check for suspicious patterns in action
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(action)) {
      return true;
    }
  }
  
  return false;
}

// IP reputation check
export async function checkIPReputation(ipAddress: string): Promise<{ isSuspicious: boolean; reason?: string }> {
  try {
    // Check recent security logs for this IP
    const recentLogs = await prisma.securityLog.findMany({
      where: {
        ipAddress,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        },
        severity: {
          in: ['warning', 'error', 'critical']
        }
      }
    });
    
    if (recentLogs.length > 10) {
      return { isSuspicious: true, reason: 'High number of security events' };
    }
    
    // Check for failed login attempts
    const failedLogins = recentLogs.filter(log => log.action === SecurityEventType.LOGIN_FAILED);
    if (failedLogins.length > 5) {
      return { isSuspicious: true, reason: 'Multiple failed login attempts' };
    }
    
    return { isSuspicious: false };
  } catch (error) {
    console.error('IP reputation check error:', error);
    return { isSuspicious: false };
  }
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Hash sensitive data
export function hashSensitiveData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Validate file upload
export function validateFileUpload(file: any): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large' };
  }
  
  return { isValid: true };
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

// Check for SQL injection patterns
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(--|\/\*|\*\/|;)/,
    /(\b(and|or)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(and|or)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

// Check for XSS patterns
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

// Rate limiting with Redis-like in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit: number = 100, window: number = 60000): boolean {
  const now = Date.now();
  const data = rateLimitStore.get(key);
  
  if (!data || now > data.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + window });
    return true;
  }
  
  if (data.count >= limit) {
    return false;
  }
  
  data.count++;
  return true;
}

// Clean up old rate limit entries
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

// Security middleware helper
export function createSecurityMiddleware() {
  return async (req: any, res: any, next: any) => {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Check IP reputation
    const reputation = await checkIPReputation(ipAddress);
    if (reputation.isSuspicious) {
      await logSecurityEvent({
        action: SecurityEventType.SUSPICIOUS_ACTIVITY,
        ipAddress,
        userAgent,
        details: { reason: reputation.reason },
        severity: SecuritySeverity.WARNING
      });
    }
    
    // Check rate limiting
    const rateLimitKey = `${ipAddress}:${req.method}:${req.path}`;
    if (!checkRateLimit(rateLimitKey)) {
      await logSecurityEvent({
        action: SecurityEventType.RATE_LIMIT_EXCEEDED,
        ipAddress,
        userAgent,
        details: { path: req.path, method: req.method },
        severity: SecuritySeverity.WARNING
      });
      
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    next();
  };
} 

// Admin kontrolü için güvenli fonksiyon
export function isAdminUser(userEmail: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL environment variable is not set');
    return false;
  }
  
  return userEmail === adminEmail;
}

// Admin kontrolü için session tabanlı fonksiyon
export function isAdminSession(session: any): boolean {
  if (!session?.user?.email) {
    return false;
  }
  
  return isAdminUser(session.user.email);
} 