import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    message: 'Security headers test endpoint',
    timestamp: new Date().toISOString(),
    headers: {
      'x-test-header': 'security-test',
      'x-security-version': '1.0.0'
    }
  });

  // Test security headers
  response.headers.set('X-Test-Security', 'enabled');
  response.headers.set('X-Security-Audit', 'passed');

  return response;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Test input validation
  if (!body.test || typeof body.test !== 'string') {
    return NextResponse.json(
      { error: 'Invalid test data' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: 'Security test passed',
    received: body.test,
    timestamp: new Date().toISOString()
  });
} 