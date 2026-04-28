import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ToolBoxPro-SEO/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    const html = await response.text();

    // Parse basic SEO elements
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/is);
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["']/is);
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["']/i);
    const ogMatch = html.match(/<meta[^>]*property=["']og:/i);
    const twitterMatch = html.match(/<meta[^>]*name=["']twitter:/i);
    const faviconMatch = html.match(/<link[^>]*rel=["'][^"']*icon[^"']*["']/i);

    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const imageCount = imgMatches.length;
    const imagesWithoutAlt = imgMatches.filter((img) => !/alt=["'][^"']+["']/i.test(img)).length;

    const linkMatches = html.match(/<a[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
    const linkCount = linkMatches.length;
    const externalLinks = linkMatches.filter((link) => {
      const hrefMatch = link.match(/href=["'](https?:\/\/[^"']+)["']/i);
      if (!hrefMatch) return false;
      try {
        const linkHost = new URL(hrefMatch[1]).hostname;
        const urlHost = new URL(url).hostname;
        return linkHost !== urlHost;
      } catch {
        return false;
      }
    }).length;

    const isHttps = url.startsWith('https://');
    const title = titleMatch ? titleMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';

    // Check robots.txt and sitemap
    let hasRobots = false;
    let hasSitemap = false;
    try {
      const robotsRes = await fetch(new URL('/robots.txt', url).href, { signal: AbortSignal.timeout(5000) });
      hasRobots = robotsRes.ok;
      if (hasRobots) {
        const robotsTxt = await robotsRes.text();
        const sitemapMatch = robotsTxt.match(/Sitemap:\s*(.+)/i);
        if (sitemapMatch) {
          hasSitemap = true;
        }
      }
    } catch { /* ignore */ }

    if (!hasSitemap) {
      try {
        const sitemapRes = await fetch(new URL('/sitemap.xml', url).href, { signal: AbortSignal.timeout(5000) });
        hasSitemap = sitemapRes.ok;
      } catch { /* ignore */ }
    }

    // Calculate score
    let score = 0;
    const suggestions: Array<{ type: 'good' | 'warning' | 'error'; text: string }> = [];

    // HTTPS (10 pts)
    if (isHttps) {
      score += 10;
      suggestions.push({ type: 'good', text: 'الموقع يستخدم HTTPS - آمن لمحركات البحث' });
    } else {
      suggestions.push({ type: 'error', text: 'الموقع لا يستخدم HTTPS - هذا يؤثر سلباً على الترتيب' });
    }

    // Title (15 pts)
    if (title) {
      if (title.length >= 30 && title.length <= 60) {
        score += 15;
        suggestions.push({ type: 'good', text: `عنوان الصفحة مناسب (${title.length} حرف)` });
      } else if (title.length < 30) {
        score += 8;
        suggestions.push({ type: 'warning', text: `عنوان الصفحة قصير جداً (${title.length} حرف). يُنصح بـ 30-60 حرف` });
      } else {
        score += 8;
        suggestions.push({ type: 'warning', text: `عنوان الصفحة طويل جداً (${title.length} حرف). يُنصح بـ 30-60 حرف` });
      }
    } else {
      suggestions.push({ type: 'error', text: 'لا يوجد عنوان للصفحة - هذا مهم جداً لـ SEO' });
    }

    // Description (15 pts)
    if (description) {
      if (description.length >= 120 && description.length <= 160) {
        score += 15;
        suggestions.push({ type: 'good', text: `وصف Meta مناسب (${description.length} حرف)` });
      } else if (description.length < 120) {
        score += 8;
        suggestions.push({ type: 'warning', text: `وصف Meta قصير (${description.length} حرف). يُنصح بـ 120-160 حرف` });
      } else {
        score += 8;
        suggestions.push({ type: 'warning', text: `وصف Meta طويل (${description.length} حرف). يُنصح بـ 120-160 حرف` });
      }
    } else {
      suggestions.push({ type: 'error', text: 'لا يوجد وصف Meta - هذا مهم لظهور الصفحة في نتائج البحث' });
    }

    // H1 (10 pts)
    if (h1Count === 1) {
      score += 10;
      suggestions.push({ type: 'good', text: 'يوجد عنوان H1 واحد - مثالي' });
    } else if (h1Count === 0) {
      suggestions.push({ type: 'error', text: 'لا يوجد عنوان H1 - يجب إضافة عنوان H1 رئيسي' });
    } else {
      score += 5;
      suggestions.push({ type: 'warning', text: `يوجد ${h1Count} عناوين H1 - يُنصح باستخدام واحد فقط` });
    }

    // Images alt (10 pts)
    if (imageCount > 0) {
      if (imagesWithoutAlt === 0) {
        score += 10;
        suggestions.push({ type: 'good', text: 'جميع الصور تحتوي على نص بديل (alt)' });
      } else {
        const altScore = Math.round(((imageCount - imagesWithoutAlt) / imageCount) * 10);
        score += altScore;
        suggestions.push({ type: 'warning', text: `${imagesWithoutAlt} من ${imageCount} صورة بدون نص بديل (alt)` });
      }
    } else {
      score += 5;
    }

    // Viewport (10 pts)
    if (viewportMatch) {
      score += 10;
      suggestions.push({ type: 'good', text: 'توجد خاصية Viewport - الموقع متجاوب' });
    } else {
      suggestions.push({ type: 'error', text: 'لا توجد خاصية Viewport - الموقع قد لا يكون متجاوباً مع الأجهزة المحمولة' });
    }

    // Canonical (5 pts)
    if (canonicalMatch) {
      score += 5;
      suggestions.push({ type: 'good', text: 'يوجد رابط Canonical' });
    } else {
      suggestions.push({ type: 'warning', text: 'لا يوجد رابط Canonical - يساعد في تجنب المحتوى المكرر' });
    }

    // Open Graph (5 pts)
    if (ogMatch) {
      score += 5;
      suggestions.push({ type: 'good', text: 'توجد علامات Open Graph - جيد للتواصل الاجتماعي' });
    } else {
      suggestions.push({ type: 'warning', text: 'لا توجد علامات Open Graph - مهمة للمشاركة على وسائل التواصل' });
    }

    // Favicon (5 pts)
    if (faviconMatch) {
      score += 5;
      suggestions.push({ type: 'good', text: 'يوجد Favicon' });
    } else {
      suggestions.push({ type: 'warning', text: 'لا يوجد Favicon - أضف أيقونة للموقع' });
    }

    // Robots.txt (5 pts)
    if (hasRobots) {
      score += 5;
      suggestions.push({ type: 'good', text: 'يوجد ملف robots.txt' });
    } else {
      suggestions.push({ type: 'warning', text: 'لا يوجد ملف robots.txt' });
    }

    // Sitemap (5 pts)
    if (hasSitemap) {
      score += 5;
      suggestions.push({ type: 'good', text: 'يوجد ملف Sitemap' });
    } else {
      suggestions.push({ type: 'warning', text: 'لا يوجد ملف Sitemap.xml' });
    }

    // H2 tags (5 pts bonus)
    if (h2Count > 0) {
      score += 5;
      suggestions.push({ type: 'good', text: `توجد ${h2Count} عناوين H2` });
    }

    // Cap score at 100
    score = Math.min(score, 100);

    return NextResponse.json({
      url,
      score,
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      h1Count,
      h2Count,
      h3Count,
      imageCount,
      imagesWithoutAlt,
      linkCount,
      externalLinks,
      hasFavicon: !!faviconMatch,
      hasViewport: !!viewportMatch,
      hasCanonical: !!canonicalMatch,
      hasOpenGraph: !!ogMatch,
      hasTwitterCard: !!twitterMatch,
      hasRobots,
      hasSitemap,
      https: isHttps,
      loadTime: 0,
      suggestions,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 500 });
  }
}
