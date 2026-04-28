import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const width = parseInt(request.nextUrl.searchParams.get('width') || '1280');
  const height = parseInt(request.nextUrl.searchParams.get('height') || '800');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Use thum.io as a free screenshot service
    const screenshotUrl = `https://image.thum.io/get/width/${width}/${url}`;

    const response = await fetch(screenshotUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ToolBoxPro/1.0)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error('Failed to capture screenshot');
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}
