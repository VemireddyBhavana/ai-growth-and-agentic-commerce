import { NextRequest, NextResponse } from 'next/server';
import { ASSISTANT_CATALOG, PRECONFIGURED_BUNDLES } from '@/lib/assistant/catalog-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const maxPrice = searchParams.get('maxPrice');
    const query = searchParams.get('q');
    const featured = searchParams.get('featured');

    let products = [...ASSISTANT_CATALOG];

    if (category && category !== 'All') {
      products = products.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (maxPrice) {
      const num = parseFloat(maxPrice);
      if (!isNaN(num)) {
        products = products.filter((p) => p.price <= num);
      }
    }

    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }

    return NextResponse.json({
      products,
      bundles: PRECONFIGURED_BUNDLES,
      total: products.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch catalog', details: String(error) },
      { status: 500 }
    );
  }
}
