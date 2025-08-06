import crypto from 'crypto';

// CSRF token oluşturma
export function generateCSRFToken(secret: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(`${token}${secret}`).digest('hex');
  return `${token}|${hash}`;
}

// CSRF token doğrulama
export function validateCSRFToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  
  try {
    const [csrfToken, hash] = token.split('|');
    if (!csrfToken || !hash) return false;
    
    const expectedHash = crypto.createHash('sha256').update(`${csrfToken}${secret}`).digest('hex');
    return hash === expectedHash;
  } catch {
    return false;
  }
}

// CSRF middleware
export function csrfMiddleware(secret: string) {
  return function(req: any, res: any, next: any) {
    if (req.method === 'GET') {
      // GET request'ler için CSRF token oluştur
      const csrfToken = generateCSRFToken(secret);
      res.setHeader('X-CSRF-Token', csrfToken);
    } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      // POST/PUT/DELETE request'ler için CSRF token doğrula
      const csrfToken = req.headers['x-csrf-token'] || req.body?.csrfToken;
      
      if (!csrfToken || !validateCSRFToken(csrfToken, secret)) {
        return res.status(403).json({ error: 'CSRF token validation failed' });
      }
    }
    
    next();
  };
} 