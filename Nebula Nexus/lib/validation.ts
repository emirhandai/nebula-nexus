import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Geçerli bir email adresi girin')
  .min(1, 'Email adresi gerekli')
  .max(255, 'Email adresi çok uzun')
  .transform(email => email.toLowerCase().trim());

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalı')
  .max(128, 'Şifre çok uzun')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermeli');

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'İsim en az 2 karakter olmalı')
  .max(50, 'İsim çok uzun')
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içermeli')
  .transform(name => name.trim());

// User input validation schema
export const userInputSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Chat message validation schema
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Mesaj boş olamaz')
    .max(2000, 'Mesaj çok uzun')
    .transform(msg => msg.trim()),
  userId: z.string().min(1, 'User ID gerekli'),
  sessionId: z.string().nullable().optional(),
  selectedField: z.string().optional(),
  category: z.enum(['casual', 'career', 'education', 'technical']).optional(),
});

// Test result validation schema
export const testResultSchema = z.object({
  userId: z.string().min(1, 'User ID gerekli'),
  scores: z.object({
    openness: z.number().min(0).max(100),
    conscientiousness: z.number().min(0).max(100),
    extraversion: z.number().min(0).max(100),
    agreeableness: z.number().min(0).max(100),
    neuroticism: z.number().min(0).max(100),
  }),
  answers: z.array(z.number()).min(1, 'Cevaplar gerekli'),
  testDuration: z.number().min(1, 'Test süresi gerekli'),
  questionsAnswered: z.number().min(1, 'Cevaplanan soru sayısı gerekli'),
});

// XSS Prevention - HTML entities encode
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// SQL Injection Prevention - Basic sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"'\\]/g, '')
    .replace(/script/gi, '')
    .replace(/javascript/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// Rate limiting helper
export function validateRateLimit(ip: string, store: Map<string, { count: number; resetTime: number }>, limit: number = 100, window: number = 60000): boolean {
  const now = Date.now();
  const userData = store.get(ip);

  if (!userData || now > userData.resetTime) {
    store.set(ip, { count: 1, resetTime: now + window });
    return true;
  }

  if (userData.count >= limit) {
    return false;
  }

  userData.count++;
  return true;
}

// CSRF Token validation
export function validateCSRFToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  
  try {
    // Basic CSRF token validation
    const [csrfToken, hash] = token.split('|');
    const expectedHash = require('crypto').createHash('sha256').update(`${csrfToken}${secret}`).digest('hex');
    return hash === expectedHash;
  } catch {
    return false;
  }
}

// Input sanitization for different types
export const sanitizers = {
  email: (email: string) => email.toLowerCase().trim().replace(/[^a-zA-Z0-9@._-]/g, ''),
  name: (name: string) => name.trim().replace(/[<>\"'\\]/g, ''),
  message: (message: string) => message.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
  url: (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      return '';
    }
  }
};

// Validation error handler
export function handleValidationError(error: z.ZodError): string {
  const firstError = error.errors[0];
  return firstError?.message || 'Geçersiz veri formatı';
} 