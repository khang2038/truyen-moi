import { NextResponse } from 'next/server';
import { getAdsTxt } from '@/lib/api';

export async function GET() {
  try {
    const content = await getAdsTxt();
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    return new NextResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

