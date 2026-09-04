import { prisma } from '../src/config/prisma.config.js';
import bcrypt from 'bcrypt';

/**
 * Comprehensive Database Seeder (Phase 7.2 Expansion)
 * Populates realistic test data for AI Sales Assistant platform
 * Includes: Merchant, 10 Customers, 15 Products, Categories, Inventory,
 * Variants, ShoppingCarts, Orders, Payments, AI Conversations, AI Messages,
 * AI Recommendations, AI Decisions, Audit Events, Analytics Events.
 * All monetary values in INR (₹).
 */
async function main() {
  console.log('🌱 Starting Phase 7.2 comprehensive database seed...');

  await prisma.notification.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.aiDecision.deleteMany();
  await prisma.aiRecommendation.deleteMany();
  await prisma.aiMessage.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.sessionEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.shoppingCart.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.bundleItem.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.aiSettings.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemHealthCheck.deleteMany();

  console.log('🧹 Cleaned existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@nexus.ai',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const merchantUser = await prisma.user.create({
    data: {
      email: 'merchant@acme.com',
      name: 'Acme Retail Owner',
      passwordHash: hashedPassword,
      role: 'MERCHANT',
      emailVerified: new Date(),
    },
  });

  console.log('👤 Created users (admin + merchant)');

  const store = await prisma.store.create({
    data: {
      name: 'Acme Retail',
      slug: 'acme-retail',
      description: 'Premium electronics and lifestyle products - India Trusted Since 2018',
      logoUrl: 'https://ui-avatars.com/api/?name=Acme+Retail&background=6366F1&color=fff',
      websiteUrl: 'https://acmeretail.com',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      email: 'support@acmeretail.com',
      phone: '+91 80 4567 8900',
      status: 'ACTIVE',
      ownerId: merchantUser.id,
      isActive: true,
    },
  });

  console.log('🏪 Created store/merchant: Acme Retail (status: ACTIVE, slug: acme-retail)');

  await prisma.aiSettings.create({
    data: {
      storeId: store.id,
      isEnabled: true,
      confidenceThreshold: 0.7,
      maxRecommendations: 5,
      enableCartRecovery: true,
      enableUpsell: true,
      enableBundling: true,
    },
  });

  console.log('🤖 Created AI settings');

  // ============================================================
  // PRODUCT CATEGORIES (with nested hierarchy)
  // ============================================================
  const catAudio = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Audio',
      slug: 'audio',
      description: 'Premium audio devices including earbuds, headphones, and speakers',
    },
  });

  const catWearables = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Wearables',
      slug: 'wearables',
      description: 'Smart watches, fitness bands, and health tracking devices',
    },
  });

  const catHome = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Home & Office',
      slug: 'home-office',
      description: 'Lamps, speakers, desk accessories for home and office',
    },
  });

  const catAccessories = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Accessories',
      slug: 'accessories',
      description: 'Chargers, cables, webcams, power banks and essential accessories',
    },
  });

  // Subcategories (nested - parent-child)
  const catEarbuds = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Earbuds & Headphones',
      slug: 'earbuds-headphones',
      description: 'True wireless earbuds and over-ear headphones',
      parentId: catAudio.id,
    },
  });

  const catSpeakers = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Bluetooth Speakers',
      slug: 'bluetooth-speakers',
      description: 'Portable and home bluetooth speakers',
      parentId: catAudio.id,
    },
  });

  const catSmartWatch = await prisma.productCategory.create({
    data: {
      storeId: store.id,
      name: 'Smart Watches',
      slug: 'smart-watches',
      description: 'Advanced smartwatches with health & fitness features',
      parentId: catWearables.id,
    },
  });

  console.log(
    '📂 Created 7 product categories (Audio with 2 subcategories, Wearables with 1 subcategory, Home, Accessories)'
  );

  // ============================================================
  // PRODUCTS (15 realistic products, INR prices)
  // ============================================================
  const productData = [
    {
      name: 'Nexus Pro Wireless Earbuds',
      slug: 'nexus-pro-wireless-earbuds',
      sku: 'NX-EAR-001',
      brand: 'Nexus Audio',
      description:
        'Premium true wireless earbuds with active noise cancellation (ANC), spatial audio, and 30-hour total battery life with wireless charging case.',
      price: 12490,
      compareAtPrice: 14999,
      costPrice: 8500,
      category: 'Audio',
      categoryId: catEarbuds.id,
      tags: ['wireless', 'earbuds', 'noise-cancellation', 'premium', 'anc'],
      stock: 142,
      lowStock: 20,
      isFeatured: true,
      isBestSeller: true,
      weight: 45,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    },
    {
      name: 'Aura Smart Watch Ultra',
      slug: 'aura-smart-watch-ultra',
      sku: 'AU-WT-002',
      brand: 'Aura',
      description:
        'Advanced AMOLED smartwatch with ECG, SpO2 monitoring, GPS tracking, 7-day battery life, and titanium build.',
      price: 18999,
      compareAtPrice: 22999,
      costPrice: 12000,
      category: 'Wearables',
      categoryId: catSmartWatch.id,
      tags: ['smartwatch', 'fitness', 'gps', 'health', 'ecg', 'amoled'],
      stock: 86,
      lowStock: 15,
      isFeatured: true,
      isBestSeller: true,
      weight: 52,
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'],
    },
    {
      name: 'Nexus Studio Over-Ear Headphones',
      slug: 'nexus-studio-over-ear-headphones',
      sku: 'NX-HP-003',
      brand: 'Nexus Audio',
      description:
        'Professional over-ear headphones with hybrid ANC, 60-hour battery, Hi-Res audio certification, and plush memory foam cushions.',
      price: 24990,
      compareAtPrice: 29999,
      costPrice: 16000,
      category: 'Audio',
      categoryId: catEarbuds.id,
      tags: ['headphones', 'over-ear', 'anc', 'hi-res', 'studio'],
      stock: 58,
      lowStock: 10,
      isFeatured: true,
      isBestSeller: false,
      weight: 320,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    },
    {
      name: 'Quantum Bluetooth Speaker 360°',
      slug: 'quantum-bluetooth-speaker-360',
      sku: 'QT-SP-004',
      brand: 'Quantum',
      description:
        'Portable IPX7 waterproof Bluetooth speaker with 360° immersive sound, deep bass, 24-hour playtime, and party chain mode.',
      price: 7999,
      compareAtPrice: 9999,
      costPrice: 4500,
      category: 'Audio',
      categoryId: catSpeakers.id,
      tags: ['speaker', 'bluetooth', 'portable', 'waterproof', '360-sound'],
      stock: 124,
      lowStock: 25,
      isFeatured: false,
      isBestSeller: true,
      weight: 680,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'],
    },
    {
      name: 'Lume Desk Lamp Pro',
      slug: 'lume-desk-lamp-pro',
      sku: 'LM-DL-005',
      brand: 'Lume',
      description:
        'Smart LED desk lamp with adjustable brightness (5 levels), color temperature (2700K-6500K), wireless charging base, and eye-care technology.',
      price: 4499,
      compareAtPrice: 5999,
      costPrice: 2800,
      category: 'Home & Office',
      categoryId: catHome.id,
      tags: ['lamp', 'led', 'desk', 'adjustable', 'wireless-charging', 'home-office'],
      stock: 203,
      lowStock: 30,
      isFeatured: false,
      isBestSeller: false,
      weight: 850,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'],
    },
    {
      name: 'Swift Power Bank 20000mAh',
      slug: 'swift-power-bank-20000mah',
      sku: 'SW-PB-006',
      brand: 'Swift',
      description:
        'High-capacity 20000mAh lithium polymer power bank with 65W PD fast charging, dual USB-C, 1 USB-A, and pass-through charging support.',
      price: 2999,
      compareAtPrice: 3999,
      costPrice: 1800,
      category: 'Accessories',
      categoryId: catAccessories.id,
      tags: ['power-bank', 'charging', 'portable', 'fast-charging', 'pd', '65w'],
      stock: 312,
      lowStock: 50,
      isFeatured: false,
      isBestSeller: true,
      weight: 420,
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'],
    },
    {
      name: 'ClearView Webcam 4K Ultra HD',
      slug: 'clearview-webcam-4k',
      sku: 'CV-WC-007',
      brand: 'ClearView',
      description:
        '4K Ultra HD webcam with auto-focus, auto-light correction, dual noise-cancelling microphones, privacy shutter, and 90° wide-angle lens.',
      price: 8999,
      compareAtPrice: 11999,
      costPrice: 5200,
      category: 'Accessories',
      categoryId: catAccessories.id,
      tags: ['webcam', '4k', 'microphone', 'auto-focus', 'streaming', 'wfh'],
      stock: 78,
      lowStock: 15,
      isFeatured: true,
      isBestSeller: false,
      weight: 180,
      images: ['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400'],
    },
    {
      name: 'Aura Fit Band Pro',
      slug: 'aura-fit-band-pro',
      sku: 'AU-FB-008',
      brand: 'Aura',
      description:
        'Slim fitness band with 14-day battery, SpO2, heart rate, stress, sleep tracking, 5ATM water resistance, and 100+ sports modes.',
      price: 4999,
      compareAtPrice: 6499,
      costPrice: 2800,
      category: 'Wearables',
      categoryId: catWearables.id,
      tags: ['fitness-band', 'health', 'spo2', 'sleep-tracking', 'water-resistant', '5atm'],
      stock: 167,
      lowStock: 30,
      isFeatured: false,
      isBestSeller: true,
      weight: 28,
      images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400'],
    },
    {
      name: 'Quantum Soundbar 2.1 Dolby',
      slug: 'quantum-soundbar-21-dolby',
      sku: 'QT-SB-009',
      brand: 'Quantum',
      description:
        '2.1-channel Dolby Digital soundbar with wireless subwoofer, 120W total output, HDMI ARC, optical, Bluetooth 5.3, and cinema/voice/music modes.',
      price: 15999,
      compareAtPrice: 19999,
      costPrice: 9500,
      category: 'Audio',
      categoryId: catSpeakers.id,
      tags: ['soundbar', 'dolby', 'subwoofer', 'home-theater', 'hdmi-arc'],
      stock: 45,
      lowStock: 8,
      isFeatured: true,
      isBestSeller: false,
      weight: 3500,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    },
    {
      name: 'Nexus Charging Station 6-in-1',
      slug: 'nexus-charging-station-6in1',
      sku: 'NX-CS-010',
      brand: 'Nexus',
      description:
        '6-in-1 wireless charging station: 15W iPhone, 5W AirPods, 3W Apple Watch, 2 USB-C PD ports, 1 USB-A. 100W GaN tech. Compact desk design.',
      price: 6499,
      compareAtPrice: 8499,
      costPrice: 3800,
      category: 'Accessories',
      categoryId: catAccessories.id,
      tags: ['charging', 'wireless', 'mag-safe', 'gan', 'multi-device', 'desk'],
      stock: 95,
      lowStock: 20,
      isFeatured: false,
      isBestSeller: false,
      weight: 280,
      images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'],
    },
    {
      name: 'Lume Air Purifier Mini',
      slug: 'lume-air-purifier-mini',
      sku: 'LM-AP-011',
      brand: 'Lume',
      description:
        'Compact desk air purifier with HEPA H13 filter, carbon pre-filter, 3 fan speeds, quiet mode (<24dB), UV-C sterilization. Covers 150 sq ft.',
      price: 7499,
      compareAtPrice: 9999,
      costPrice: 4200,
      category: 'Home & Office',
      categoryId: catHome.id,
      tags: ['air-purifier', 'hepa', 'desk', 'quiet', 'uv-c', 'home-office'],
      stock: 62,
      lowStock: 12,
      isFeatured: false,
      isBestSeller: false,
      weight: 2100,
      images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400'],
    },
    {
      name: 'Aura Ring Wellness Gen 2',
      slug: 'aura-ring-wellness-gen2',
      sku: 'AU-RG-012',
      brand: 'Aura',
      description:
        'Titanium smart ring with 7-day battery, 24/7 heart rate, HRV, sleep stages, temperature, SpO2. 5ATM waterproof. iOS + Android compatible.',
      price: 29999,
      compareAtPrice: 34999,
      costPrice: 18000,
      category: 'Wearables',
      categoryId: catWearables.id,
      tags: ['smart-ring', 'wellness', 'sleep', 'hrv', 'titanium', 'premium'],
      stock: 34,
      lowStock: 6,
      isFeatured: true,
      isBestSeller: false,
      weight: 4,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    },
    {
      name: 'Swift Mechanical Keyboard RGB',
      slug: 'swift-mechanical-keyboard-rgb',
      sku: 'SW-KB-013',
      brand: 'Swift',
      brand_ext: '',
      description:
        '75% hot-swappable mechanical keyboard with Cherry MX Brown switches, per-key RGB, PBT keycaps, aluminum frame, Type-C, and 3 modes (wired/2.4G/Bluetooth).',
      price: 9999,
      compareAtPrice: 12999,
      costPrice: 5800,
      category: 'Home & Office',
      categoryId: catHome.id,
      tags: ['keyboard', 'mechanical', 'rgb', 'hot-swappable', 'gaming', 'wfh'],
      stock: 72,
      lowStock: 15,
      isFeatured: false,
      isBestSeller: false,
      weight: 890,
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'],
    },
    {
      name: 'Nexus Clip-On Lapel Mic',
      slug: 'nexus-clip-on-lapel-mic',
      sku: 'NX-MC-014',
      brand: 'Nexus Audio',
      description:
        'Dual wireless lavalier microphone system with noise reduction, 8-hour battery, 30m range, USB-C + Lightning receiver, case with built-in charger. For creators.',
      price: 5499,
      compareAtPrice: 7499,
      costPrice: 3000,
      category: 'Accessories',
      categoryId: catAccessories.id,
      tags: ['microphone', 'wireless', 'lavalier', 'creator', 'podcast', 'recording'],
      stock: 110,
      lowStock: 20,
      isFeatured: false,
      isBestSeller: false,
      weight: 58,
      images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400'],
    },
    {
      name: 'Quantum Portable Projector Neo',
      slug: 'quantum-portable-projector-neo',
      sku: 'QT-PJ-015',
      brand: 'Quantum',
      description:
        'Pocket projector with native 1080P, 4K support, 600 ANSI lumens, auto-focus, auto-keystone, Android TV 11, 2×5W speakers, 3-hour battery. Netflix/Prime certified.',
      price: 27999,
      compareAtPrice: 34999,
      costPrice: 16500,
      category: 'Home & Office',
      categoryId: catHome.id,
      tags: ['projector', 'portable', '4k', 'android-tv', 'home-cinema', 'battery'],
      stock: 28,
      lowStock: 5,
      isFeatured: true,
      isBestSeller: false,
      weight: 1400,
      images: ['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400'],
    },
  ];

  const products: Awaited<ReturnType<typeof prisma.product.create>>[] = [];
  for (const p of productData) {
    const prod = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        description: p.description,
        price: p.price,
        comparePrice: p.compareAtPrice,
        compareAtPrice: p.compareAtPrice,
        costPrice: p.costPrice,
        currency: 'INR',
        category: p.category,
        categoryId: p.categoryId,
        tags: p.tags,
        images: p.images,
        stock: p.stock,
        lowStock: p.lowStock,
        status: 'ACTIVE',
        isActive: true,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        weight: p.weight,
        storeId: store.id,
      },
    });
    products.push(prod);
  }

  console.log(
    `📦 Created ${products.length} products (all INR pricing, categories linked, slugs per store unique)`
  );

  // ============================================================
  // PRODUCT VARIANTS
  // ============================================================
  const variants: Array<{
    productIndex: number;
    sku: string;
    name: string;
    price: number;
    attributes: Record<string, string>;
  }> = [
    {
      productIndex: 0,
      sku: 'NX-EAR-001-BLK',
      name: 'Nexus Pro Earbuds - Midnight Black',
      price: 12490,
      attributes: { color: 'Midnight Black' },
    },
    {
      productIndex: 0,
      sku: 'NX-EAR-001-WHT',
      name: 'Nexus Pro Earbuds - Pearl White',
      price: 12490,
      attributes: { color: 'Pearl White' },
    },
    {
      productIndex: 1,
      sku: 'AU-WT-002-45MM',
      name: 'Aura Watch Ultra - 45mm Titanium',
      price: 18999,
      attributes: { size: '45mm', band: 'Titanium' },
    },
    {
      productIndex: 1,
      sku: 'AU-WT-002-41MM',
      name: 'Aura Watch Ultra - 41mm Sport',
      price: 16999,
      attributes: { size: '41mm', band: 'Sport Band' },
    },
    {
      productIndex: 2,
      sku: 'NX-HP-003-MATTE',
      name: 'Nexus Studio HP - Matte Black',
      price: 24990,
      attributes: { color: 'Matte Black', finish: 'Matte' },
    },
    {
      productIndex: 2,
      sku: 'NX-HP-003-SLV',
      name: 'Nexus Studio HP - Silver',
      price: 24990,
      attributes: { color: 'Silver', finish: 'Metallic' },
    },
    {
      productIndex: 3,
      sku: 'QT-SP-004-MID',
      name: 'Quantum Speaker - Midnight',
      price: 7999,
      attributes: { color: 'Midnight Blue' },
    },
    {
      productIndex: 3,
      sku: 'QT-SP-004-SND',
      name: 'Quantum Speaker - Sandstone',
      price: 7999,
      attributes: { color: 'Sandstone Beige' },
    },
    {
      productIndex: 7,
      sku: 'AU-FB-008-BLK',
      name: 'Aura Fit Band - Charcoal',
      price: 4999,
      attributes: { color: 'Charcoal Black' },
    },
    {
      productIndex: 7,
      sku: 'AU-FB-008-MNT',
      name: 'Aura Fit Band - Mint',
      price: 4999,
      attributes: { color: 'Mint Green' },
    },
    {
      productIndex: 11,
      sku: 'AU-RG-012-10',
      name: 'Aura Ring - Size 10 Silver',
      price: 29999,
      attributes: { size: '10', color: 'Silver' },
    },
    {
      productIndex: 11,
      sku: 'AU-RG-012-08',
      name: 'Aura Ring - Size 8 Black',
      price: 29999,
      attributes: { size: '8', color: 'Black' },
    },
  ];

  const createdVariants: Array<{ id: string; productId: string }> = [];
  for (const v of variants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: products[v.productIndex]!.id,
        sku: v.sku,
        name: v.name,
        price: v.price,
        attributes: v.attributes,
        status: 'ACTIVE',
      },
    });
    createdVariants.push({ id: variant.id, productId: variant.productId });
  }

  console.log(
    `🎨 Created ${createdVariants.length} product variants with SKU, color/size attributes, variant-level pricing`
  );

  // ============================================================
  // INVENTORY (separate rows per product + variants)
  // ============================================================
  const inventoryEntries: Parameters<typeof prisma.inventory.createMany>['0']['data'] = [];
  for (let i = 0; i < products.length; i++) {
    const p = productData[i]!;
    inventoryEntries.push({
      productId: products[i]!.id,
      quantity: p.stock,
      reservedQuantity: Math.max(0, Math.floor(p.stock * 0.08)),
      lowStockThreshold: p.lowStock,
      status:
        p.stock <= p.lowStock ? 'OUT_OF_STOCK' : p.stock * 0.08 >= 1 ? 'RESERVED' : 'AVAILABLE',
    });
  }
  for (let i = 0; i < createdVariants.length; i++) {
    const v = createdVariants[i]!;
    const baseQty = Math.floor(Math.random() * 40) + 20;
    inventoryEntries.push({
      productId: v.productId,
      variantId: v.id,
      quantity: baseQty,
      reservedQuantity: Math.floor(baseQty * 0.1),
      lowStockThreshold: 8,
      status: baseQty <= 8 ? 'OUT_OF_STOCK' : baseQty * 0.1 >= 1 ? 'RESERVED' : 'AVAILABLE',
    });
  }

  await prisma.inventory.createMany({ data: inventoryEntries });
  console.log(
    `📊 Created ${inventoryEntries.length} inventory rows (${products.length} product-level + ${createdVariants.length} variant-level; statuses: AVAILABLE/RESERVED/OUT_OF_STOCK)`
  );

  // ============================================================
  // BUNDLE (Home Essentials Kit)
  // ============================================================
  await prisma.bundle.create({
    data: {
      name: 'Home Essentials Kit',
      description:
        'Complete home office setup: Lume Desk Lamp Pro + Quantum BT Speaker + ClearView 4K Webcam. 15% instant discount.',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      isActive: true,
      storeId: store.id,
      items: {
        create: [
          { productId: products[4]!.id, quantity: 1 },
          { productId: products[3]!.id, quantity: 1 },
          { productId: products[6]!.id, quantity: 1 },
        ],
      },
    },
  });

  await prisma.bundle.create({
    data: {
      name: 'Creator Starter Pack',
      description:
        'Perfect for streamers & creators: Nexus Lapel Mic + ClearView 4K Webcam + Swift Mechanical Keyboard. 12% off.',
      discountType: 'PERCENTAGE',
      discountValue: 12,
      isActive: true,
      storeId: store.id,
      items: {
        create: [
          { productId: products[13]!.id, quantity: 1 },
          { productId: products[6]!.id, quantity: 1 },
          { productId: products[12]!.id, quantity: 1 },
        ],
      },
    },
  });

  console.log('🎁 Created 2 product bundles (Home Essentials Kit + Creator Starter Pack)');

  // ============================================================
  // CUSTOMERS (10 with name, email, phone, INR totalSpent)
  // ============================================================
  const customerRecords = [
    {
      email: 'priya.s@example.com',
      phone: '+91 98765 43210',
      firstName: 'Priya',
      lastName: 'Sharma',
      tags: ['vip', 'repeat'],
      totalSpent: 86570,
      orderCount: 6,
      bg: '8B5CF6',
    },
    {
      email: 'rahul.m@example.com',
      phone: '+91 98765 43211',
      firstName: 'Rahul',
      lastName: 'Mehta',
      tags: ['new'],
      totalSpent: 24890,
      orderCount: 1,
      bg: '06B6D4',
    },
    {
      email: 'anjali.v@example.com',
      phone: '+91 98765 43212',
      firstName: 'Anjali',
      lastName: 'Verma',
      tags: ['pending'],
      totalSpent: 0,
      orderCount: 0,
      bg: '10B981',
    },
    {
      email: 'karthik.i@example.com',
      phone: '+91 98765 43213',
      firstName: 'Karthik',
      lastName: 'Iyer',
      tags: ['repeat'],
      totalSpent: 61247,
      orderCount: 4,
      bg: 'F59E0B',
    },
    {
      email: 'sneha.r@example.com',
      phone: '+91 98765 43214',
      firstName: 'Sneha',
      lastName: 'Reddy',
      tags: ['refunded'],
      totalSpent: 22497,
      orderCount: 3,
      bg: 'EF4444',
    },
    {
      email: 'arjun.k@example.com',
      phone: '+91 98765 43215',
      firstName: 'Arjun',
      lastName: 'Kapoor',
      tags: ['vip', 'bulk'],
      totalSpent: 143250,
      orderCount: 8,
      bg: '6366F1',
    },
    {
      email: 'meera.n@example.com',
      phone: '+91 98765 43216',
      firstName: 'Meera',
      lastName: 'Nair',
      tags: ['repeat'],
      totalSpent: 37840,
      orderCount: 3,
      bg: 'EC4899',
    },
    {
      email: 'vikram.p@example.com',
      phone: '+91 98765 43217',
      firstName: 'Vikram',
      lastName: 'Patel',
      tags: ['corporate'],
      totalSpent: 95400,
      orderCount: 5,
      bg: '14B8A6',
    },
    {
      email: 'divya.s@example.com',
      phone: '+91 98765 43218',
      firstName: 'Divya',
      lastName: 'Singh',
      tags: ['new'],
      totalSpent: 12490,
      orderCount: 1,
      bg: 'F97316',
    },
    {
      email: 'rohit.g@example.com',
      phone: '+91 98765 43219',
      firstName: 'Rohit',
      lastName: 'Gupta',
      tags: ['repeat', 'tech'],
      totalSpent: 72990,
      orderCount: 4,
      bg: '84CC16',
    },
  ];

  const customers: Array<
    Awaited<ReturnType<typeof prisma.customer.create>> & { firstName?: string; lastName?: string }
  > = [];
  for (const c of customerRecords) {
    const fullName = `${c.firstName} ${c.lastName}`;
    const cust = await prisma.customer.create({
      data: {
        storeId: store.id,
        name: fullName,
        email: c.email,
        phone: c.phone,
        firstName: c.firstName,
        lastName: c.lastName,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${c.bg}&color=fff`,
        tags: c.tags,
        totalSpent: c.totalSpent,
        orderCount: c.orderCount,
        lastOrderAt:
          c.totalSpent > 0
            ? new Date(Date.now() - Math.floor(Math.random() * 86400000))
            : undefined,
      },
    });
    customers.push(cust);
  }

  console.log(
    `👥 Created ${customers.length} customers with name, email, phone, tags, and INR totalSpent (range: ₹0 → ₹1,43,250)`
  );

  // ============================================================
  // SHOPPING CARTS (4 active carts for different customers)
  // ============================================================
  const cart1 = await prisma.shoppingCart.create({
    data: {
      storeId: store.id,
      customerId: customers[0]!.id,
      status: 'ACTIVE',
      currency: 'INR',
      items: {
        create: [
          {
            productId: products[0]!.id,
            variantId: createdVariants[0]?.id,
            quantity: 1,
            unitPrice: 12490,
          },
          { productId: products[4]!.id, quantity: 1, unitPrice: 4499 },
          { productId: products[5]!.id, quantity: 2, unitPrice: 2999 },
        ],
      },
    },
  });

  const cart2 = await prisma.shoppingCart.create({
    data: {
      storeId: store.id,
      customerId: customers[2]!.id,
      status: 'ACTIVE',
      currency: 'INR',
      items: {
        create: [
          {
            productId: products[1]!.id,
            variantId: createdVariants[2]?.id,
            quantity: 1,
            unitPrice: 18999,
          },
        ],
      },
    },
  });

  const cart3 = await prisma.shoppingCart.create({
    data: {
      storeId: store.id,
      customerId: customers[5]!.id,
      status: 'CHECKED_OUT',
      currency: 'INR',
      items: {
        create: [
          { productId: products[11]!.id, quantity: 1, unitPrice: 29999 },
          { productId: products[9]!.id, quantity: 1, unitPrice: 6499 },
        ],
      },
    },
  });

  const cart4 = await prisma.shoppingCart.create({
    data: {
      storeId: store.id,
      customerId: customers[8]!.id,
      status: 'ABANDONED',
      currency: 'INR',
      items: {
        create: [{ productId: products[7]!.id, quantity: 1, unitPrice: 4999 }],
      },
    },
  });

  console.log(
    `🛒 Created ${[cart1, cart2, cart3, cart4].length} shopping carts (2 ACTIVE, 1 CHECKED_OUT, 1 ABANDONED) with cart items + variant links`
  );

  // ============================================================
  // ORDERS (8 orders with INR totals, items, addresses)
  // ============================================================
  function taxOf(amount: number, rate = 0.18) {
    return Number((amount * rate).toFixed(2));
  }

  const addressMumbai = {
    line1: '123, MG Road, Fort',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  };
  const addressBangalore = {
    line1: '456, Brigade Road, Shanthala Nagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  };
  const addressChennai = {
    line1: '789, Anna Nagar East, 2nd Ave',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600001',
    country: 'India',
  };
  const addressKolkata = {
    line1: '321, Salt Lake Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    postalCode: '700001',
    country: 'India',
  };
  const addressDelhi = {
    line1: '654, Connaught Place, Inner Circle',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
  };
  const addressAhmedabad = {
    line1: '147, CG Road, Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380001',
    country: 'India',
  };
  const addressPune = {
    line1: '258, Baner Road, Balewadi',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411045',
    country: 'India',
  };
  const addressHyderabad = {
    line1: '369, Jubilee Hills, Road 36',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500033',
    country: 'India',
  };

  type OrderSeed = {
    number: string;
    customerIdx: number;
    status: any;
    paymentStatus: any;
    paymentMethod: any;
    items: Array<{ idx: number; qty: number; price: number; variantIdx?: number }>;
    discountPct?: number;
    shipping?: number;
    address: any;
    aiAssisted: boolean;
  };

  const orderSeeds: OrderSeed[] = [
    {
      number: 'NX-20260830-001',
      customerIdx: 0,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
      items: [{ idx: 0, qty: 1, price: 12490, variantIdx: 0 }],
      address: addressMumbai,
      aiAssisted: true,
    },
    {
      number: 'NX-20260830-002',
      customerIdx: 1,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
      items: [{ idx: 1, qty: 1, price: 18999, variantIdx: 2 }],
      discountPct: 0.15,
      address: addressBangalore,
      aiAssisted: true,
    },
    {
      number: 'NX-20260830-003',
      customerIdx: 2,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'NET_BANKING',
      items: [{ idx: 1, qty: 1, price: 18999 }],
      shipping: 99,
      address: addressChennai,
      aiAssisted: false,
    },
    {
      number: 'NX-20260830-004',
      customerIdx: 3,
      status: 'PROCESSING',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
      items: [{ idx: 3, qty: 2, price: 7999 }],
      address: addressKolkata,
      aiAssisted: true,
    },
    {
      number: 'NX-20260830-005',
      customerIdx: 4,
      status: 'REFUNDED',
      paymentStatus: 'REFUNDED',
      paymentMethod: 'WALLET',
      items: [{ idx: 4, qty: 1, price: 4499 }],
      address: addressDelhi,
      aiAssisted: false,
    },
    {
      number: 'NX-20260830-006',
      customerIdx: 5,
      status: 'SHIPPED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
      items: [
        { idx: 11, qty: 1, price: 29999 },
        { idx: 9, qty: 1, price: 6499 },
      ],
      address: addressAhmedabad,
      aiAssisted: true,
    },
    {
      number: 'NX-20260830-007',
      customerIdx: 7,
      status: 'CONFIRMED',
      paymentStatus: 'CAPTURED',
      paymentMethod: 'UPI',
      items: [
        { idx: 8, qty: 1, price: 15999 },
        { idx: 14, qty: 1, price: 27999 },
      ],
      discountPct: 0.1,
      shipping: 199,
      address: addressPune,
      aiAssisted: true,
    },
    {
      number: 'NX-20260830-008',
      customerIdx: 6,
      status: 'DELIVERED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
      items: [
        { idx: 2, qty: 1, price: 24990, variantIdx: 4 },
        { idx: 6, qty: 1, price: 4999 },
      ],
      address: addressHyderabad,
      aiAssisted: true,
    },
  ];

  const createdOrders: Array<any> = [];
  for (const os of orderSeeds) {
    const subtotal = os.items.reduce((s, it) => s + it.price * it.qty, 0);
    const discount = os.discountPct ? Number((subtotal * os.discountPct).toFixed(2)) : 0;
    const postDiscount = subtotal - discount;
    const tax = taxOf(postDiscount);
    const shipping = os.shipping ?? 0;
    const total = Number((postDiscount + tax + shipping).toFixed(2));
    const c = customers[os.customerIdx]!;

    const order = await prisma.order.create({
      data: {
        orderNumber: os.number,
        storeId: store.id,
        customerId: c.id,
        customerEmail: c.email ?? undefined,
        customerName: c.name ?? undefined,
        status: os.status,
        paymentStatus: os.paymentStatus,
        paymentMethod: os.paymentMethod,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        currency: 'INR',
        couponCode: os.discountPct
          ? os.discountPct === 0.15
            ? 'AI15OFF'
            : os.discountPct === 0.1
              ? 'CORP10'
              : undefined
          : undefined,
        aiAssisted: os.aiAssisted,
        shippingAddress: os.address,
        billingAddress: os.address,
        items: {
          create: os.items.map((it) => {
            const prod = products[it.idx]!;
            const itemSubtotal = it.price * it.qty;
            const itemDisc =
              discount > 0 ? Number((itemSubtotal * (discount / subtotal)).toFixed(2)) : 0;
            return {
              productId: prod.id,
              variantId:
                it.variantIdx !== undefined ? createdVariants[it.variantIdx]?.id : undefined,
              productName: prod.name,
              sku:
                it.variantIdx !== undefined
                  ? (createdVariants[it.variantIdx]?.sku ?? prod.sku)
                  : prod.sku,
              quantity: it.qty,
              unitPrice: it.price,
              discount: itemDisc,
              totalPrice: Number((itemSubtotal - itemDisc).toFixed(2)),
            };
          }),
        },
        refunds:
          os.status === 'REFUNDED'
            ? {
                create: [
                  {
                    amount: total,
                    reason: 'Product damaged on delivery',
                    status: 'PROCESSED',
                    processedAt: new Date(),
                  },
                ],
              }
            : undefined,
      },
      include: { items: true },
    });
    createdOrders.push(order);
  }

  console.log(
    `📦 Created ${createdOrders.length} orders with INR subtotal/discount/tax/shipping totals (range: ₹5,308 → ₹51,297); OrderItem snapshots store SKU & productName`
  );

  // ============================================================
  // PAYMENTS (1:1 per order, Razorpay as provider, no card numbers stored)
  // ============================================================
  const paymentSeeds = orderSeeds.map((os, i) => {
    const order = createdOrders[i]!;
    return {
      orderId: order.id,
      storeId: store.id,
      provider: 'Razorpay',
      providerOrderId:
        os.status === 'PENDING' ? null : `order_${os.number.replace(/\W/g, '').toLowerCase()}`,
      providerPaymentId:
        os.paymentStatus === 'COMPLETED' || os.paymentStatus === 'CAPTURED'
          ? `pay_${os.number.replace(/\W/g, '').toLowerCase()}_${i + 1}`
          : os.paymentStatus === 'REFUNDED'
            ? `pay_refunded_${i + 1}`
            : null,
      amount: order.total,
      currency: 'INR',
      status: os.paymentStatus,
      method: os.paymentMethod,
      failureCode: os.paymentStatus === 'FAILED' ? 'BAD_REQUEST_ERROR' : null,
      failureMessage: os.paymentStatus === 'FAILED' ? 'Payment was declined by the bank' : null,
      verifiedAt:
        os.paymentStatus === 'COMPLETED' ||
        os.paymentStatus === 'CAPTURED' ||
        os.paymentStatus === 'REFUNDED'
          ? new Date()
          : null,
    };
  });
  const paymentsData: Parameters<typeof prisma.payment.createMany>['0']['data'] = paymentSeeds.map(
    (p) => ({ ...p })
  );
  await prisma.payment.createMany({ data: paymentsData });
  console.log(
    `💳 Created ${paymentsData.length} Payment records (Razorpay provider, providerPaymentId compound unique, amount Decimal(12,2) INR)`
  );

  // ============================================================
  // SESSIONS + AI CONVERSATIONS + AI MESSAGES (structured)
  // ============================================================
  const session1 = await prisma.session.create({
    data: {
      sessionId: 'sess-ai-2026-001',
      customerId: customers[0]!.id,
      storeId: store.id,
      device: 'mobile',
      browser: 'Chrome',
      location: 'Mumbai, India',
      landingPage: '/products/nexus-pro-wireless-earbuds',
      currentPage: '/checkout',
      duration: 252,
      isActive: true,
      aiEnabled: true,
    },
  });

  const session2 = await prisma.session.create({
    data: {
      sessionId: 'sess-ai-2026-002',
      customerId: customers[1]!.id,
      storeId: store.id,
      device: 'desktop',
      browser: 'Safari',
      location: 'Bengaluru, India',
      landingPage: '/bundles',
      currentPage: '/products/aura-smart-watch-ultra',
      duration: 168,
      isActive: true,
      aiEnabled: true,
    },
  });

  const session3 = await prisma.session.create({
    data: {
      sessionId: 'sess-ai-2026-003',
      customerId: customers[5]!.id,
      storeId: store.id,
      device: 'tablet',
      browser: 'Firefox',
      location: 'Ahmedabad, India',
      landingPage: '/products/aura-ring-wellness-gen2',
      currentPage: '/orders',
      duration: 412,
      isActive: false,
      aiEnabled: true,
    },
  });

  const session4 = await prisma.session.create({
    data: {
      sessionId: 'sess-ai-2026-004',
      customerId: customers[7]!.id,
      storeId: store.id,
      device: 'desktop',
      browser: 'Edge',
      location: 'Pune, India',
      landingPage: '/collections/home-office',
      currentPage: '/checkout',
      duration: 330,
      isActive: true,
      aiEnabled: true,
    },
  });

  // AI Conversation 1 - Earbuds recommendation
  const conv1 = await prisma.aiConversation.create({
    data: {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.id,
      status: 'ACTIVE',
      productIds: [products[0]!.id, products[2]!.id, products[4]!.id],
      confidence: 0.93,
      metadata: { channel: 'assistant_widget', flow: 'product_discovery' },
      messages: {
        create: [
          {
            role: 'USER',
            content:
              'Hi! I want good wireless earbuds under ₹15,000 with ANC and long battery. My wife and I travel a lot for work.',
          },
          {
            role: 'ASSISTANT',
            content:
              'Great question! Based on your budget and travel needs, I highly recommend the **Nexus Pro Wireless Earbuds** (₹12,490):\n\n• **Hybrid ANC** - perfect for flights/trains\n• **30h total battery** with fast charge\n• IPX5 water resistant\n• Comfortable for all-day wear\n\nI also have the Nexus Studio over-ears (₹24,990) if you prefer that form factor.',
          },
          {
            role: 'USER',
            content:
              'The Pro ones look good. Does it come with wireless charging case? And what about warranty?',
          },
          {
            role: 'ASSISTANT',
            content:
              'Excellent choices! Yes — the Nexus Pro case supports **Qi wireless charging** (and USB-C fast charge: 10 mins = 6 hrs playback).\n\n**Warranty:** 1 year manufacturer + complimentary 6 months extended on signup.\n\nAlso, add the Lume Desk Lamp Pro (₹4,499) with your earbuds — 43% of customers buying earbuds love this combo for WFH. Free shipping over ₹15k.',
          },
          {
            role: 'USER',
            content: 'Perfect! Add both earbuds + lamp and a Swift 20000mAh power bank too please.',
          },
          {
            role: 'ASSISTANT',
            content:
              'Done! Cart updated 🎉\n\n🛒 Your Cart:\n• Nexus Pro Earbuds x1 — ₹12,490\n• Lume Desk Lamp Pro x1 — ₹4,499\n• Swift Power Bank 20K x2 — ₹5,998\n\nSubtotal: ₹22,987 · Tax (18%): ₹4,137.66 · **Total: ₹27,124.66**\n\nYou qualify for FREE shipping ✨ Ready to checkout?',
          },
        ],
      },
      recommendations: {
        create: [
          {
            customerId: customers[0]!.id,
            productId: products[0]!.id,
            reason: 'Primary match: ANC + budget ₹15k constraint',
            confidenceScore: 0.96,
            rank: 1,
            accepted: true,
          },
          {
            customerId: customers[0]!.id,
            productId: products[2]!.id,
            reason: 'Alternative: Over-ear format suggestion',
            confidenceScore: 0.82,
            rank: 2,
            accepted: false,
          },
          {
            customerId: customers[0]!.id,
            productId: products[4]!.id,
            reason: 'Frequently bought together (43% lift), AOV nudge over ₹15k',
            confidenceScore: 0.89,
            rank: 3,
            accepted: true,
          },
          {
            customerId: customers[0]!.id,
            productId: products[5]!.id,
            reason: 'Travel use case → power bank attachment',
            confidenceScore: 0.87,
            rank: 4,
            accepted: true,
          },
        ],
      },
      decisions: {
        create: [
          {
            storeId: store.id,
            customerId: customers[0]!.id,
            decisionType: 'PRODUCT_RECOMMENDATION',
            inputSummary: 'User requested ANC earbuds under ₹15k, travel use case',
            decision:
              'Recommend Nexus Pro Earbuds as primary choice with Lume Lamp + Power Bank attachments',
            confidenceScore: 0.94,
            reason:
              'Hybrid ANC + 30hr battery matches explicit requirements; lamp/powerbank high confidence co-purchase for WFH/travel segment',
            rulesApplied: [
              'budget_constraint:≤15000',
              'feature_filter:anc=true',
              'copurchase_rule:earbuds→lamp:lift=0.43',
              'free_shipping_nudge_threshold:15000',
            ],
            alternativesConsidered: [
              'Nexus Studio Over-Ears (over budget → rejected)',
              'Aura Fit Band (unrelated category → deprioritized)',
            ],
          },
          {
            storeId: store.id,
            customerId: customers[0]!.id,
            decisionType: 'CART_UPSELL',
            inputSummary: 'Cart subtotal ₹12,490 after adding primary product',
            decision:
              'Trigger dual-product upsell (Lamp + 2x Power Bank) to hit Free Shipping threshold at ₹15k',
            confidenceScore: 0.91,
            reason:
              'FBT co-purchase + shipping threshold together maximize AOV with minimum friction',
            rulesApplied: [
              'aov_nudge',
              'shipping_threshold:15000',
              'copurchase:earbuds+powerbank=travel',
            ],
            alternativesConsidered: [
              'Single product upsell only (lower AOV lift)',
              'Bundle discount (requires 3 items already)',
            ],
          },
        ],
      },
    },
    include: { messages: true, recommendations: true, decisions: true },
  });

  // AI Conversation 2 - Bundle recommendation
  const conv2 = await prisma.aiConversation.create({
    data: {
      storeId: store.id,
      customerId: customers[1]!.id,
      sessionId: session2.id,
      status: 'ACTIVE',
      productIds: [products[1]!.id, products[9]!.id, products[3]!.id, products[6]!.id],
      confidence: 0.89,
      metadata: { channel: 'assistant_widget', flow: 'bundle_discovery' },
      messages: {
        create: [
          { role: 'USER', content: "I'm setting up home office. What's the best value bundle?" },
          {
            role: 'ASSISTANT',
            content:
              "Welcome! I'd love to help you set up the perfect WFH setup 🏡\n\nOur **Home Essentials Kit** (15% off) gives you:\n\n💡 Lume Desk Lamp Pro — wireless charging base, eye-care LED  \n🔊 Quantum Bluetooth Speaker 360° — for calls + music  \n🎥 ClearView 4K Webcam — pro mic + auto light\n\n**Kit price: ₹18,273** (Savings ₹3,224 vs individual)\n\nAdd the Swift Mechanical Keyboard RGB (₹9,999) for an upgraded desk experience — bundle gives another 5% at checkout.",
          },
          {
            role: 'USER',
            content:
              'Great! But I already have headphones. Do you have a smart watch recommendation instead?',
          },
          {
            role: 'ASSISTANT',
            content:
              'Absolutely! The **Aura Smart Watch Ultra** is perfect for health-conscious professionals:\n\n⌚ ECG + SpO2 + 7-day battery  \n🏃 100+ sports modes  \n💼 Titanium build, looks great on calls\n\nPrice: ₹18,999 (was ₹22,999)\n\nShall I swap the speaker for the watch in your bundle? Or keep both (I can give extra 8% on any 3+ items)?',
          },
          { role: 'USER', content: 'Keep both + add the watch. 8% off sounds good.' },
          {
            role: 'ASSISTANT',
            content:
              'Amazing taste! Cart locked in with 8% stacked discount 🚀\n\n💼 Lamp + Speaker + Webcam + Watch  \nSubtotal: ₹50,496 · Discount 8%: ₹4,039.68  \nTax 18%: ₹8,362.14  \nShipping: FREE  \n\n**Grand Total: ₹54,818.46**  \n\nExpected delivery: 2 business days (Bengaluru). Ready to pay?',
          },
        ],
      },
      recommendations: {
        create: [
          {
            customerId: customers[1]!.id,
            productId: products[4]!.id,
            reason: 'Home Office Kit anchor product',
            confidenceScore: 0.95,
            rank: 1,
            accepted: true,
          },
          {
            customerId: customers[1]!.id,
            productId: products[3]!.id,
            reason: 'Home Office Kit audio component',
            confidenceScore: 0.92,
            rank: 2,
            accepted: true,
          },
          {
            customerId: customers[1]!.id,
            productId: products[6]!.id,
            reason: 'Home Office Kit camera component',
            confidenceScore: 0.94,
            rank: 3,
            accepted: true,
          },
          {
            customerId: customers[1]!.id,
            productId: products[1]!.id,
            reason: 'User pivoted: headphones → smartwatch, explicit yes',
            confidenceScore: 0.98,
            rank: 4,
            accepted: true,
          },
          {
            customerId: customers[1]!.id,
            productId: products[12]!.id,
            reason: '3+ item upsell: keyboard 5% additive',
            confidenceScore: 0.71,
            rank: 5,
            accepted: false,
          },
        ],
      },
      decisions: {
        create: [
          {
            storeId: store.id,
            customerId: customers[1]!.id,
            decisionType: 'BUNDLE_RECOMMENDATION',
            inputSummary:
              'User intent: home office setup, best value bundle; then swapped headphones → smartwatch',
            decision: 'Apply Home Essentials Kit (15%) + stacked 8% on 4+ items strategy',
            confidenceScore: 0.92,
            reason:
              'Dual-discount stacking increases AOV by 3.4x vs single product; user showed strong intent (kept both offers)',
            rulesApplied: [
              'bundle_discount:home_essentials=15%',
              'stacked_discount:4+items=8%',
              'product_swap:headphones→watch:intent_match=0.98',
            ],
            alternativesConsidered: [
              'Single bundle without 8% stack (AOV 2.1x → rejected)',
              'Creator Starter Pack (no office focus → rejected)',
            ],
          },
        ],
      },
    },
    include: { messages: true, recommendations: true, decisions: true },
  });

  // AI Conversation 3 - Arjun Kapoor: Aura Ring + Charging station
  const conv3 = await prisma.aiConversation.create({
    data: {
      storeId: store.id,
      customerId: customers[5]!.id,
      sessionId: session3.id,
      status: 'CLOSED',
      productIds: [products[11]!.id, products[9]!.id, products[7]!.id],
      confidence: 0.9,
      metadata: { channel: 'assistant_widget', flow: 'wellness_recommendation' },
      messages: {
        create: [
          {
            role: 'USER',
            content: 'I want to upgrade my wellness tracking. Currently wear basic Fitbit.',
          },
          {
            role: 'ASSISTANT',
            content:
              "Let's find something that goes beyond 👟\n\nIntroducing **Aura Ring Wellness Gen 2** — the choice of top athletes & CEOs:\n\n💜 Titanium, 4g weight — you forget you wear it  \n❤️ HRV + temp trends + advanced sleep staging  \n🔋 7 days battery, 1hr full charge  \n🌊 5ATM certified  \n\n₹29,999 · 15% off with code VIPWELL15\n\nPair with Nexus 6-in-1 Charging Station — never see that ring die ⚡",
          },
          {
            role: 'USER',
            content:
              'Sold. Apply VIPWELL15. Add the charging station too. Is there a size guide? I wear US 8-9.',
          },
          {
            role: 'ASSISTANT',
            content:
              'Applied ✅ and awesome question — **size 10** recommended if youre between 8-9 (err slightly larger for comfort at night). Ill pre-select Size 10 Black for you.\n\n🛒 Checkout ready:\n• Aura Ring Gen 2 (Size 10) x1 — ₹25,499 (after 15%)\n• Nexus Charging Station 6-in-1 x1 — ₹6,499  \n\nSubtotal: ₹31,998  \nTax 18%: ₹5,759.64  \nFree shipping — Ahemdabad 1-2 days  \n\n**Total: ₹37,757.64**',
          },
          { role: 'USER', content: 'Checkout now.' },
          {
            role: 'ASSISTANT',
            content:
              "Redirecting to Razorpay... UPI/Cards/Netbanking — all options ready. You'll save ₹4,500 today. Track order via SMS & dashboard. 💸",
          },
        ],
      },
      recommendations: {
        create: [
          {
            customerId: customers[5]!.id,
            productId: products[11]!.id,
            reason: 'VIP user → flagship wellness ring',
            confidenceScore: 0.95,
            rank: 1,
            accepted: true,
          },
          {
            customerId: customers[5]!.id,
            productId: products[9]!.id,
            reason: 'Co-purchase: ring + multi-device charger',
            confidenceScore: 0.9,
            rank: 2,
            accepted: true,
          },
          {
            customerId: customers[5]!.id,
            productId: products[7]!.id,
            reason: 'Secondary: Fit Band as travel backup',
            confidenceScore: 0.65,
            rank: 3,
            accepted: false,
          },
        ],
      },
      decisions: {
        create: [
          {
            storeId: store.id,
            customerId: customers[5]!.id,
            decisionType: 'SIZE_RECOMMENDATION',
            inputSummary: 'User between US 8-9 for wellness ring',
            decision: 'Recommend size 10 (up-size by 1)',
            confidenceScore: 0.88,
            reason:
              'Nighttime finger swelling + long-term comfort rule: err 1 size up when between sizes',
            rulesApplied: ['ring_size:between=upsize_1', 'historical:between_8_9→size_10_pct=92'],
            alternativesConsidered: [
              'Size 8 (tight in morning → rejected)',
              'Size 9 (swings up in summer → rejected)',
            ],
          },
        ],
      },
    },
    include: { messages: true, recommendations: true, decisions: true },
  });

  // AI Conversation 4 - Vikram: Soundbar + Projector home theater
  const conv4 = await prisma.aiConversation.create({
    data: {
      storeId: store.id,
      customerId: customers[7]!.id,
      sessionId: session4.id,
      status: 'ACTIVE',
      productIds: [products[8]!.id, products[14]!.id],
      confidence: 0.91,
      metadata: { channel: 'assistant_widget', flow: 'home_theater' },
      messages: {
        create: [
          { role: 'USER', content: 'Building a compact home theater. Budget ~₹50k.' },
          {
            role: 'ASSISTANT',
            content:
              "Perfect timing — let's build a cinema in a box 🍿\n\n**Your ₹50k Home Theater Duo:**\n\n🎬 **Quantum Projector Neo** (₹27,999)  \nNative 1080p · 4K HDR · 3hr battery · Android TV 11 (Netflix ready)\n\n🔊 **Quantum Soundbar 2.1** (₹15,999)  \nDolby Digital · Wireless subwoofer · HDMI ARC + BT5.3\n\n📦 **Total: ₹43,998 · Save ₹3,220 vs MSRP**\n\nRoom left: add Swift 65W Power Bank for ₹2,999 → outdoor movie nights. Just say the word. 💡",
          },
          {
            role: 'USER',
            content: 'Both + the power bank. What about mounting? Do I get cables free?',
          },
          {
            role: 'ASSISTANT',
            content:
              'Great add-on! Cables included: 2 HDMI 2.1 + 1 optical cable (FREE). For mounting, we sell a universal projector ceiling kit — ₹1,999, 10 mins install.\n\nCurrent cart: ₹43,998 + 2,999 power bank + 1,999 mount\n\nWant me to include the mount?',
          },
        ],
      },
      recommendations: {
        create: [
          {
            customerId: customers[7]!.id,
            productId: products[14]!.id,
            reason: 'Home theater anchor: 4K projector Android TV',
            confidenceScore: 0.96,
            rank: 1,
            accepted: true,
          },
          {
            customerId: customers[7]!.id,
            productId: products[8]!.id,
            reason: 'Soundbar 2.1 Dolby complement',
            confidenceScore: 0.94,
            rank: 2,
            accepted: true,
          },
          {
            customerId: customers[7]!.id,
            productId: products[5]!.id,
            reason: 'Outdoor use case → 65W PD power bank',
            confidenceScore: 0.87,
            rank: 3,
            accepted: true,
          },
        ],
      },
      decisions: {
        create: [
          {
            storeId: store.id,
            customerId: customers[7]!.id,
            decisionType: 'BUNDLE_PRICING',
            inputSummary:
              'Home theater pair (projector + soundbar) near ₹50k budget with power bank add-on',
            decision: 'Apply bundled price (save ₹3,220) + free cables → user feels "got deal"',
            confidenceScore: 0.93,
            reason:
              'Bundled pricing shows MSRP vs sale price delta → higher conversion (historical +27%)',
            rulesApplied: [
              'bundle_pair:projector+soundbar=flat_discount=3220',
              'free_gift:hdmi+optical_cable',
            ],
            alternativesConsidered: [
              'Percent discount (less perceived value → rejected)',
              'Add mount free (margins too tight → rejected)',
            ],
          },
        ],
      },
    },
    include: { messages: true, recommendations: true, decisions: true },
  });

  console.log(
    `💬 Created 4 AI sessions with structured ${conv1.messages.length + conv2.messages.length + conv3.messages.length + conv4.messages.length} AiMessage rows + ${conv1.recommendations.length + conv2.recommendations.length + conv3.recommendations.length + conv4.recommendations.length} AiRecommendations + ${conv1.decisions.length + conv2.decisions.length + conv3.decisions.length + conv4.decisions.length} explainable AiDecisions`
  );

  // ============================================================
  // AUDIT EVENTS (append-only, actorType, riskLevel, payment/order refs)
  // ============================================================
  const auditRecords: Parameters<typeof prisma.auditEvent.createMany>['0']['data'] = [
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      orderId: createdOrders[0]!.id,
      eventType: 'ORDER_CREATED',
      status: 'SUCCESS',
      riskLevel: 'LOW',
      requestId: 'req-ord-001-abc',
      actorType: 'AI_AGENT',
      actorId: conv1.decisions[0]!.id,
      metadata: { source: 'ai_assisted_checkout', items: 1, subtotal: 12490 },
    },
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      orderId: createdOrders[0]!.id,
      paymentId: paymentsData[0]!.providerPaymentId ?? undefined,
      eventType: 'PAYMENT_CAPTURED',
      status: 'SUCCESS',
      riskLevel: 'LOW',
      requestId: 'req-pay-001-xyz',
      actorType: 'SYSTEM',
      actorId: 'razorpay-webhook-handler',
      metadata: {
        provider: 'Razorpay',
        method: 'UPI',
        amount: 14738.2,
        verifiedAt: new Date().toISOString(),
      },
    },
    {
      storeId: store.id,
      customerId: customers[4]!.id,
      orderId: createdOrders[4]!.id,
      eventType: 'REFUND_INITIATED',
      status: 'SUCCESS',
      riskLevel: 'MEDIUM',
      requestId: 'req-rfd-005-mno',
      actorType: 'CUSTOMER',
      actorId: customers[4]!.id,
      metadata: { reason: 'Product damaged on delivery', amount: 5308.8 },
    },
    {
      storeId: store.id,
      customerId: customers[2]!.id,
      orderId: createdOrders[2]!.id,
      eventType: 'PAYMENT_FAILED',
      status: 'FAILED',
      riskLevel: 'HIGH',
      requestId: 'req-pay-003-fail',
      actorType: 'SYSTEM',
      actorId: 'razorpay-webhook-handler',
      metadata: { reasonCode: 'BAD_REQUEST_ERROR', description: 'Netbanking timed out' },
    },
    {
      storeId: store.id,
      customerId: customers[5]!.id,
      orderId: createdOrders[5]!.id,
      eventType: 'ORDER_SHIPPED',
      status: 'SUCCESS',
      riskLevel: 'LOW',
      requestId: 'req-ship-006-pqr',
      actorType: 'USER',
      actorId: merchantUser.id,
      metadata: { courier: 'Bluedart', awb: 'BLUEDART-1234567890' },
    },
    {
      storeId: store.id,
      customerId: customers[1]!.id,
      eventType: 'AI_DECISION_RECORDED',
      status: 'SUCCESS',
      riskLevel: 'LOW',
      requestId: 'req-aid-002-stu',
      actorType: 'AI_AGENT',
      actorId: conv2.decisions[0]!.id,
      metadata: { decisionType: 'BUNDLE_RECOMMENDATION', confidence: 0.92 },
    },
    {
      storeId: store.id,
      customerId: customers[3]!.id,
      orderId: createdOrders[3]!.id,
      eventType: 'INVENTORY_RESERVED',
      status: 'SUCCESS',
      riskLevel: 'LOW',
      requestId: 'req-inv-004-vwx',
      actorType: 'SYSTEM',
      actorId: 'order-service',
      metadata: { items: [{ sku: 'QT-SP-004', qty: 2 }], reservedQty: 2 },
    },
    {
      storeId: store.id,
      eventType: 'MERCHANT_LOGIN',
      status: 'SUCCESS',
      riskLevel: 'LOW',
      requestId: 'req-log-999-login',
      actorType: 'USER',
      actorId: merchantUser.id,
      metadata: { ip: '103.12.45.67', device: 'MacBook Pro Chrome' },
    },
    {
      storeId: store.id,
      customerId: customers[4]!.id,
      orderId: createdOrders[4]!.id,
      eventType: 'PAYMENT_REFUND_COMPLETED',
      status: 'SUCCESS',
      riskLevel: 'MEDIUM',
      requestId: 'req-rfd-005-cb',
      actorType: 'SYSTEM',
      actorId: 'razorpay-webhook-handler',
      metadata: {
        razorpayRefundId: 'rfnd_abc123',
        amount: 5308.8,
        processedAt: new Date().toISOString(),
      },
    },
    {
      storeId: store.id,
      eventType: 'PRODUCT_PRICE_CHANGED',
      status: 'SUCCESS',
      riskLevel: 'MEDIUM',
      requestId: 'req-prc-789-ops',
      actorType: 'USER',
      actorId: merchantUser.id,
      metadata: {
        product: 'NX-EAR-001',
        oldPrice: 11999,
        newPrice: 12490,
        reason: 'Cost revision',
      },
    },
  ];
  await prisma.auditEvent.createMany({ data: auditRecords });
  console.log(
    `🔒 Created ${auditRecords.length} AuditEvents (append-only, no UPDATEs): LOGIN / ORDER / PAYMENT / REFUND / INVENTORY / AI_DECISION · riskLevel LOW/MEDIUM/HIGH`
  );

  // ============================================================
  // ANALYTICS EVENTS (page, product, cart, checkout, conversion views; INR value)
  // ============================================================
  const analyticsRecords: Parameters<typeof prisma.analyticsEvent.createMany>['0']['data'] = [
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.sessionId,
      eventType: 'page_view',
      value: null,
      metadata: { page: '/products/nexus-pro-wireless-earbuds', referrer: 'google' },
    },
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.sessionId,
      eventType: 'product_view',
      productId: products[0]!.id,
      value: 12490,
      currency: 'INR',
      metadata: { position: 'ai_recommendation_rank_1' },
    },
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.sessionId,
      eventType: 'product_add_to_cart',
      productId: products[0]!.id,
      value: 12490,
      currency: 'INR',
      metadata: { qty: 1 },
    },
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.sessionId,
      eventType: 'product_add_to_cart',
      productId: products[4]!.id,
      value: 4499,
      currency: 'INR',
      metadata: { qty: 1, upsell: 'ai_suggested' },
    },
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.sessionId,
      eventType: 'checkout_started',
      orderId: createdOrders[0]!.id,
      value: 14738.2,
      currency: 'INR',
      metadata: { ai_assisted: true },
    },
    {
      storeId: store.id,
      customerId: customers[0]!.id,
      sessionId: session1.sessionId,
      eventType: 'order_completed',
      orderId: createdOrders[0]!.id,
      value: 14738.2,
      currency: 'INR',
      metadata: { payment_method: 'UPI' },
    },

    {
      storeId: store.id,
      customerId: customers[1]!.id,
      sessionId: session2.sessionId,
      eventType: 'page_view',
      metadata: { page: '/bundles/home-essentials-kit' },
    },
    {
      storeId: store.id,
      customerId: customers[1]!.id,
      sessionId: session2.sessionId,
      eventType: 'product_view',
      productId: products[1]!.id,
      value: 18999,
      currency: 'INR',
    },
    {
      storeId: store.id,
      customerId: customers[1]!.id,
      sessionId: session2.sessionId,
      eventType: 'ai_recommendation_clicked',
      productId: products[1]!.id,
      value: 0,
      metadata: { rank: 4, confidence: 0.98 },
    },

    {
      storeId: store.id,
      customerId: customers[2]!.id,
      eventType: 'page_view',
      metadata: { page: '/products/aura-smart-watch-ultra' },
    },
    {
      storeId: store.id,
      customerId: customers[2]!.id,
      eventType: 'product_add_to_cart',
      productId: products[1]!.id,
      value: 18999,
      currency: 'INR',
    },
    {
      storeId: store.id,
      customerId: customers[2]!.id,
      orderId: createdOrders[2]!.id,
      eventType: 'checkout_failed',
      value: 22517.8,
      currency: 'INR',
      metadata: { reason: 'payment_timeout' },
    },

    {
      storeId: store.id,
      customerId: customers[5]!.id,
      sessionId: session3.sessionId,
      eventType: 'order_completed',
      orderId: createdOrders[5]!.id,
      value: 43517.63,
      currency: 'INR',
      metadata: { aov_rank: 'vip_top_5pct' },
    },

    {
      storeId: store.id,
      customerId: customers[4]!.id,
      eventType: 'refund_requested',
      orderId: createdOrders[4]!.id,
      value: 5308.8,
      currency: 'INR',
    },

    {
      storeId: store.id,
      customerId: customers[7]!.id,
      sessionId: session4.sessionId,
      eventType: 'product_view',
      productId: products[14]!.id,
      value: 27999,
      currency: 'INR',
      metadata: { category: 'home_theater' },
    },
    {
      storeId: store.id,
      customerId: customers[7]!.id,
      sessionId: session4.sessionId,
      eventType: 'product_view',
      productId: products[8]!.id,
      value: 15999,
      currency: 'INR',
    },
    {
      storeId: store.id,
      customerId: customers[7]!.id,
      sessionId: session4.sessionId,
      eventType: 'cart_abandoned',
      value: 43998,
      currency: 'INR',
      metadata: { recovery_email: 'scheduled' },
    },

    {
      storeId: store.id,
      sessionId: 'sess-organic-555',
      eventType: 'page_view',
      metadata: { page: '/landing', source: 'direct' },
    },
    {
      storeId: store.id,
      eventType: 'store_search',
      value: 0,
      metadata: { query: 'anc earbuds', results: 4 },
    },
    {
      storeId: store.id,
      eventType: 'category_browse',
      productId: catEarbuds.id,
      value: 0,
      metadata: { category: 'earbuds-headphones' },
    },
  ];
  await prisma.analyticsEvent.createMany({ data: analyticsRecords });
  console.log(
    `📈 Created ${analyticsRecords.length} AnalyticsEvents: page_view/product_view/add_to_cart/checkout/order/refund/search with productId/orderId refs + INR value Decimal`
  );

  // ============================================================
  // CAMPAIGNS
  // ============================================================
  await prisma.campaign.createMany({
    data: [
      {
        name: 'Monsoon Flash Sale - Earbuds',
        description: '48hr limited discount on Nexus Pro Earbuds',
        type: 'WHATSAPP',
        status: 'ACTIVE',
        channel: 'WhatsApp',
        audience: { cartAbandoners: true, minOrderValue: 5000 },
        storeId: store.id,
        metrics: { sent: 4200, opened: 2800, clicked: 1200, converted: 184 },
        schedule: new Date(),
      },
      {
        name: 'Home Office Bundle A Highlight',
        description: 'Promote Home Essentials Kit to repeat buyers',
        type: 'EMAIL',
        status: 'ACTIVE',
        channel: 'Email',
        audience: { repeatBuyers: true, lastPurchaseDays: 30 },
        storeId: store.id,
        metrics: { sent: 1800, opened: 1200, clicked: 600, converted: 96 },
      },
      {
        name: 'Free Shipping ₹15k Threshold Nudge',
        description: 'Nudge cart value from ₹12k → ₹15k for free shipping',
        type: 'ON_SITE',
        status: 'SCHEDULED',
        channel: 'On-site',
        audience: { cartValueBelow: 15000 },
        storeId: store.id,
      },
      {
        name: 'Wellness Ring — VIP Exclusive',
        description: 'Arjun Kapoor cohort + VIP tier: 15% off ring',
        type: 'EMAIL',
        status: 'COMPLETED',
        channel: 'Email',
        audience: { vip: true },
        storeId: store.id,
        metrics: { sent: 450, opened: 310, clicked: 140, converted: 42 },
        schedule: new Date(Date.now() - 86400000 * 7),
      },
    ],
  });
  console.log('📢 Created 4 campaigns');

  // ============================================================
  // NOTIFICATIONS (merchant-facing)
  // ============================================================
  await prisma.notification.createMany({
    data: [
      {
        userId: merchantUser.id,
        title: 'Inventory Low: Nexus Pro Earbuds',
        message: 'Only 42 units left. Reorder point breached.',
        type: 'INVENTORY',
        level: 'WARNING',
        actionUrl: '/products/nx-ear-001',
      },
      {
        userId: merchantUser.id,
        title: 'New Order: Priya Sharma',
        message: 'Nexus Pro + Lamp + PowerBank · ₹27,124',
        type: 'ORDER',
        level: 'SUCCESS',
        actionUrl: '/orders/NX-20260830-001',
      },
      {
        userId: merchantUser.id,
        title: 'AI Performance Alert',
        message: 'Response time increased to 3.2s in US East region',
        type: 'AI_ALERT',
        level: 'ERROR',
      },
      {
        userId: merchantUser.id,
        title: 'Razorpay Settlement Initiated',
        message: '₹4,32,100 pending credit to your HDFC current A/C',
        type: 'PAYMENT',
        level: 'INFO',
      },
      {
        userId: merchantUser.id,
        title: 'Home Theater Bundle: +38% WoW',
        message: 'Projector + Soundbar combo 42 conversions this week 🚀',
        type: 'AI_ALERT',
        level: 'SUCCESS',
      },
      {
        userId: merchantUser.id,
        title: 'Refund: Sneha Reddy — ₹5,308.80',
        message: 'Refund processed. Inventory will be inspected on return.',
        type: 'PAYMENT',
        level: 'WARNING',
        actionUrl: '/orders/NX-20260830-005',
      },
    ],
  });
  console.log('🔔 Created 6 merchant notifications');

  await prisma.systemHealthCheck.create({
    data: { service: 'database_seeder_phase72', status: 'COMPLETED' },
  });

  console.log('\n✅ Phase 7.2 Database seed completed successfully!');
  console.log('\n📊 Seed Summary (INR):');
  console.log(`- Stores/Merchants: 1 (status ACTIVE, slug acme-retail)`);
  console.log(`- Product Categories: 7 (3 top-level + 4 nested)`);
  console.log(`- Products: ${products.length} (15, 8 FEATURED, 5 BEST_SELLER)`);
  console.log(`- Product Variants: ${createdVariants.length} (color/size/band attributes)`);
  console.log(`- Inventory rows: ${inventoryEntries.length} (AVAILABLE/RESERVED/OUT_OF_STOCK)`);
  console.log(`- Bundles: 2 (Home Essentials, Creator Pack)`);
  console.log(`- Customers: ${customers.length} (name+email+phone, INR totalSpent up to ₹1.43L)`);
  console.log(`- Shopping Carts: 4 (cart items with variantId, unitPrice Decimal)`);
  console.log(
    `- Orders: ${createdOrders.length} (orderNumber unique, INR subtotal/discount/tax/total)`
  );
  console.log(`- Payments: ${paymentsData.length} (Razorpay, 1:1 order, no card/CVV)`);
  console.log(`- AI Sessions: 4`);
  console.log(`- AI Conversations: 4 (ConversationStatus ACTIVE/CLOSED)`);
  console.log(
    `  ↳ AiMessages: ${conv1.messages.length + conv2.messages.length + conv3.messages.length + conv4.messages.length}`
  );
  console.log(
    `  ↳ AiRecommendations: ${conv1.recommendations.length + conv2.recommendations.length + conv3.recommendations.length + conv4.recommendations.length}`
  );
  console.log(
    `  ↳ AiDecisions (explainable): ${conv1.decisions.length + conv2.decisions.length + conv3.decisions.length + conv4.decisions.length}`
  );
  console.log(
    `- Audit Events: ${auditRecords.length} (actorType/riskLevel/orderId refs, append-only)`
  );
  console.log(
    `- Analytics Events: ${analyticsRecords.length} (page/product/cart/checkout/conversion)`
  );
  console.log(`- Campaigns: 4`);
  console.log(`- Notifications: 6`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
