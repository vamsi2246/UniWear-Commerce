import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ShopMyUniform premium consistent database seed...\n");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleaned existing database tables");

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash("password123", 12);
  const userPasswordHash = await bcrypt.hash("password123", 12);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "ShopMyUniform Admin",
      email: "admin@uniwear.com",
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const shopper = await prisma.user.create({
    data: {
      name: "Procurement Manager (Apex Care)",
      email: "john@example.com",
      password: userPasswordHash,
      role: "USER",
    },
  });

  // Create Cart for shopper
  await prisma.cart.create({
    data: {
      userId: shopper.id,
    },
  });

  console.log("👤 Created Admin and Shopper accounts");

  // Seed Categories (Industries) with high-quality category banners
  const categoriesData = [
    {
      name: "Medical",
      slug: "medical-scrubs",
      description: "Antimicrobial scrubs, doctor lab coats, and nursing apparel designed for healthcare settings.",
      image: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600",
    },
    {
      name: "Corporate",
      slug: "corporate-office",
      description: "Tailored blazers, wrinkle-free dress shirts, and executive trousers for a professional business look.",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
    },
    {
      name: "School",
      slug: "school-uniforms",
      description: "Pique polo shirts, pleated skirts, and school blazers built to withstand daily campus wear.",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
    },
    {
      name: "Industrial",
      slug: "industrial-safety",
      description: "Flame-resistant shirts, cargo work pants, and utility coveralls for shop floor environments.",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
    },
    {
      name: "Hospitality",
      slug: "hospitality-culinary",
      description: "Chef coats, aprons, waitstaff shirts, and server vests designed for culinary arts.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600",
    },
    {
      name: "Security",
      slug: "security-operations",
      description: "Tactical shirts, duty trousers, and officer windbreakers constructed for presence and performance.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600",
    },
    {
      name: "Retail",
      slug: "retail-uniforms",
      description: "Snag-resistant staff polos, service aprons, and easy-wear chinos for store associate teams.",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
    },
    {
      name: "Construction",
      slug: "construction-safety",
      description: "High-visibility safety vests, class 3 parkas, and reinforced utility canvas trousers.",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600",
    },
    {
      name: "Sports",
      slug: "sports-team",
      description: "Athletic team jerseys, training shorts, and moisture-wicking team polo shirts.",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600",
    },
    {
      name: "Housekeeping",
      slug: "housekeeping-uniforms",
      description: "Zippered housekeeper tunics, clean-shield comfort pants, and unisex service aprons.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600",
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = created.id;
  }

  console.log("📁 Created 10 industry uniform categories");

  // Helper function to build consistent placeholders mimicking Nike/Shopify styling
  // Uses light gray (#F4F4F5) background with dark (#18181B) text, portrait 600x800 aspect ratio.
  const getMockImages = (sku: string, name: string, fabric: string) => {
    const cleanName = encodeURIComponent(name);
    const cleanFabric = encodeURIComponent(fabric);
    return [
      `https://placehold.co/600x800/F4F4F5/18181B?text=${sku}+Front%0A${cleanName}`,
      `https://placehold.co/600x800/F4F4F5/18181B?text=${sku}+Back%0A${cleanName}`,
      `https://placehold.co/600x800/F4F4F5/18181B?text=${sku}+Side%0A${cleanName}`,
      `https://placehold.co/600x800/F4F4F5/18181B?text=${sku}+Close-Up%0A${cleanFabric}`
    ];
  };

  // Seed 30+ Products (Consistent, mock product images only, no random backgrounds)
  const productsData = [
    // 1. Medical
    {
      name: "Apex Stretch V-Neck Scrub Top",
      slug: "apex-stretch-v-neck-scrub-top",
      description: "Antimicrobial Medical Scrub Top. Breathable stretch blend with double utility breast slots and side seam vents.",
      price: 1199.00,
      comparePrice: 1599.00,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Navy Blue", "Royal Blue", "Teal", "Hunter Green"],
      stock: 120,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-MED-SCT-01",
      brand: "Advantage Scrubs",
      fabricDetails: "72% Polyester, 21% Rayon, 7% Spandex",
      categorySlug: "medical-scrubs",
    },
    {
      name: "Apex Comfort Jogger Scrub Pants",
      slug: "apex-comfort-jogger-scrub-pants",
      description: "Medical jogger pants featuring elastic drawstring waistband, knit cuffs, and 6 utility cargo pockets.",
      price: 1399.00,
      comparePrice: 1899.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Navy Blue", "Royal Blue", "Teal"],
      stock: 90,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-MED-SCP-02",
      brand: "Advantage Scrubs",
      fabricDetails: "72% Polyester, 21% Rayon, 7% Spandex",
      categorySlug: "medical-scrubs",
    },
    {
      name: "Classic Antimicrobial Lab Coat",
      slug: "classic-antimicrobial-lab-coat",
      description: "Full-length white lab coat with soil-release protection. Side slits provide easy pocket access.",
      price: 1899.00,
      comparePrice: 2499.00,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White"],
      stock: 50,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-MED-LAB-03",
      brand: "ShopMyUniform Elite",
      fabricDetails: "65% Polyester, 35% Cotton Twill",
      categorySlug: "medical-scrubs",
    },

    // 2. Corporate
    {
      name: "Premium Non-Iron Oxford Shirt",
      slug: "premium-non-iron-oxford-shirt",
      description: "Executive long-sleeve corporate uniform shirt. Features non-iron design, fused collar, and adjustable cuffs.",
      price: 1499.00,
      comparePrice: 1999.00,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Sky Blue", "French Blue"],
      stock: 140,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-COR-SHR-01",
      brand: "ShopMyUniform Elite",
      fabricDetails: "100% Egyptian Cotton Twill",
      categorySlug: "corporate-office",
    },
    {
      name: "Structured Single-Breasted Blazer",
      slug: "structured-single-breasted-blazer",
      description: "Lined single-breasted corporate blazer with structured shoulder padding and notched lapels.",
      price: 3899.00,
      comparePrice: 4999.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Charcoal", "Navy"],
      stock: 35,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-COR-BLZ-02",
      brand: "ShopMyUniform Elite",
      fabricDetails: "70% Wool, 25% Polyester, 5% Spandex Stretch",
      categorySlug: "corporate-office",
    },
    {
      name: "Executive Stretch Flat-Front Trousers",
      slug: "executive-stretch-flat-front-trousers",
      description: "Flat-front tailored corporate trousers with dynamic stretch waistband and deep rear welt pockets.",
      price: 1799.00,
      comparePrice: 2299.00,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Black", "Navy", "Khaki"],
      stock: 75,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-COR-TRS-03",
      brand: "ShopMyUniform Elite",
      fabricDetails: "65% Polyester, 35% Viscose",
      categorySlug: "corporate-office",
    },

    // 3. School
    {
      name: "Heavy-Duty Pique School Polo",
      slug: "heavy-duty-pique-school-polo",
      description: "Shrink-resistant school polo shirt. Double-needle hemmed sleeves and tagless collar for ultimate schoolyard comfort.",
      price: 699.00,
      comparePrice: 899.00,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Navy Blue", "Red", "Hunter Green"],
      stock: 180,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-SCH-POL-01",
      brand: "ShopMyUniform Pro",
      fabricDetails: "60% Cotton, 40% Polyester Pique",
      categorySlug: "school-uniforms",
    },
    {
      name: "Pleated Permanent Crease Skirt",
      slug: "pleated-permanent-crease-skirt",
      description: "Navy blue pleated school skirt with elastic back closure and wrinkle-resistant fabric finish.",
      price: 999.00,
      comparePrice: 1299.00,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Navy Blue", "Khaki"],
      stock: 80,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-SCH-SKR-02",
      brand: "ShopMyUniform Pro",
      fabricDetails: "100% Polyester Gabardine",
      categorySlug: "school-uniforms",
    },
    {
      name: "School Uniform V-Neck Vest",
      slug: "school-uniform-v-neck-vest",
      description: "Fine-gauge knit school uniform sweater vest. Features anti-pilling thread structure and ribbed v-neck collar.",
      price: 1199.00,
      comparePrice: 1599.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Navy Blue", "Charcoal Grey"],
      stock: 55,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-SCH-SWT-03",
      brand: "ShopMyUniform Pro",
      fabricDetails: "100% Fine Acrylic knit",
      categorySlug: "school-uniforms",
    },

    // 4. Industrial
    {
      name: "Flame-Resistant Utility Work Jacket",
      slug: "flame-resistant-utility-work-jacket",
      description: "NFPA 2112 certified heavy-duty work jacket with brass front zipper and dual reinforced utility chest pockets.",
      price: 2499.00,
      comparePrice: 2999.00,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Navy Blue", "Khaki", "Charcoal"],
      stock: 65,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-IND-JKT-01",
      brand: "Red Kap Pro",
      fabricDetails: "88% Cotton, 12% Heavy Nylon Twill",
      categorySlug: "industrial-safety",
    },
    {
      name: "Cordura Knee Safety Cargo Pants",
      slug: "cordura-knee-safety-cargo-pants",
      description: "Canvas trousers featuring cordura-reinforced knee pad slots and triple-stitched seams.",
      price: 1899.00,
      comparePrice: 2299.00,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Charcoal", "Black", "Navy Blue"],
      stock: 110,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-IND-PAN-02",
      brand: "Red Kap Pro",
      fabricDetails: "65% Polyester, 35% Cotton Canvas",
      categorySlug: "industrial-safety",
    },
    {
      name: "Waterproof Insulated Coveralls",
      slug: "waterproof-insulated-coveralls",
      description: "Insulated utility overalls with sealed seams. Heavy-duty elastic buckles and front zipper entry.",
      price: 2999.00,
      comparePrice: 3599.00,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Navy Blue", "Khaki"],
      stock: 45,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-IND-COV-03",
      brand: "Red Kap Pro",
      fabricDetails: "300D Oxford Polyester with PU lining",
      categorySlug: "industrial-safety",
    },

    // 5. Hospitality
    {
      name: "Chef Masterclass Double-Breasted Jacket",
      slug: "chef-masterclass-double-breasted-jacket",
      description: "Premium executive chef coat with cloth-covered buttons, French cuffs, and left sleeve thermometer pocket.",
      price: 2199.00,
      comparePrice: 2799.00,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black"],
      stock: 60,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-HOS-COA-01",
      brand: "Culinary Pro",
      fabricDetails: "100% Egyptian Cotton Twill",
      categorySlug: "hospitality-culinary",
    },
    {
      name: "Heavyweight Cotton Canvas Bib Apron",
      slug: "heavyweight-cotton-canvas-bib-apron",
      description: "Bib apron with reinforced double front utility slots and adjustable neck strap.",
      price: 699.00,
      comparePrice: 999.00,
      sizes: ["One Size"],
      colors: ["Black", "Burgundy", "Navy Blue"],
      stock: 250,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-HOS-APR-02",
      brand: "Culinary Pro",
      fabricDetails: "100% Cotton Canvas",
      categorySlug: "hospitality-culinary",
    },
    {
      name: "Classic Dining Room Server Vest",
      slug: "classic-dining-room-server-vest",
      description: "Waitstaff vest featuring front button closure, welt chest slots, and adjustable back satin belt.",
      price: 1199.00,
      comparePrice: 1599.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Burgundy"],
      stock: 50,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-HOS-VST-03",
      brand: "Culinary Pro",
      fabricDetails: "100% Polyester Twill Front",
      categorySlug: "hospitality-culinary",
    },

    // 6. Security
    {
      name: "Officer Grade Long Sleeve Uniform Shirt",
      slug: "officer-grade-long-sleeve-uniform-shirt",
      description: "Class A short sleeve security uniform shirt. Features structured shoulder epaulets and pleated chest pockets.",
      price: 1399.00,
      comparePrice: 1699.00,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Sky Blue", "Silver Tan", "Dark Navy"],
      stock: 80,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-SEC-SHR-01",
      brand: "ShopMyUniform Pro",
      fabricDetails: "65% Polyester, 35% Cotton Poplin",
      categorySlug: "security-operations",
    },
    {
      name: "Tactical Combat Duty Pants",
      slug: "tactical-combat-duty-pants",
      description: "Officer duty trousers with silicone shirt-grip waistband and reinforced tactical cargo utility pockets.",
      price: 1899.00,
      comparePrice: 2299.00,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Dark Navy", "Black"],
      stock: 60,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-SEC-PAN-02",
      brand: "ShopMyUniform Pro",
      fabricDetails: "65% Polyester, 35% Cotton Twill",
      categorySlug: "security-operations",
    },
    {
      name: "All-Weather Security Bomber Jacket",
      slug: "all-weather-security-bomber-jacket",
      description: "Officer bomber utility jacket with zip-out thermal fleece liner and side badge tabs.",
      price: 2799.00,
      comparePrice: 3499.00,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Dark Navy", "Black"],
      stock: 25,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-SEC-JKT-03",
      brand: "ShopMyUniform Pro",
      fabricDetails: "100% Nylon Oxford with waterproof backing",
      categorySlug: "security-operations",
    },

    // 7. Retail
    {
      name: "Snag-Resistant Service Associate Polo",
      slug: "snag-resistant-service-associate-polo",
      description: "Anti-snag knit retail uniform polo shirt. Features odor-repelling fabric thread and double-needle seams.",
      price: 899.00,
      comparePrice: 1199.00,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Red", "Royal Blue", "Black"],
      stock: 140,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-RET-POL-01",
      brand: "Cintas Work",
      fabricDetails: "100% Comfort Micro-Polyester Pique",
      categorySlug: "retail-uniforms",
    },
    {
      name: "Multi-Pocket Retail Waist Apron",
      slug: "multi-pocket-retail-waist-apron",
      description: "Low-waist server associate apron with 3 horizontal pockets and adjustable strap binds.",
      price: 599.00,
      comparePrice: 799.00,
      sizes: ["One Size"],
      colors: ["Black", "Hunter Green"],
      stock: 200,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      sku: "SMU-RET-APR-02",
      brand: "Cintas Work",
      fabricDetails: "65% Polyester, 35% Cotton Twill",
      categorySlug: "retail-uniforms",
    },
    {
      name: "Retail Comfort Chino Trousers",
      slug: "retail-comfort-chino-trousers",
      description: "Easy-wash flat-front store associate chinos. Comfort stretch thread provides daily mobility.",
      price: 1499.00,
      comparePrice: 1999.00,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Khaki", "Black", "Navy Blue"],
      stock: 90,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-RET-TRS-03",
      brand: "Cintas Work",
      fabricDetails: "60% Cotton, 38% Polyester, 2% Spandex",
      categorySlug: "retail-uniforms",
    },

    // 8. Construction
    {
      name: "Class 2 High-Visibility Mesh Vest",
      slug: "class-2-high-visibility-mesh-vest",
      description: "Bright yellow mesh traffic vest with class 2 visibility. Dual horizontal 3M reflective tape bands.",
      price: 499.00,
      comparePrice: 699.00,
      sizes: ["M", "L", "XL"],
      colors: ["Safety Yellow", "Safety Orange"],
      stock: 300,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-CON-VST-01",
      brand: "SafeRoad Safety",
      fabricDetails: "100% Breathable Polyester Mesh",
      categorySlug: "construction-safety",
    },
    {
      name: "Class 3 High-Vis Waterproof Parka",
      slug: "class-3-high-vis-waterproof-parka",
      description: "Class 3 waterproof high-vis parka. Features storm-seal cuffs, heavy hood, and warm thermal padding.",
      price: 3299.00,
      comparePrice: 3999.00,
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Safety Yellow", "Safety Orange"],
      stock: 50,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-CON-PRK-02",
      brand: "SafeRoad Safety",
      fabricDetails: "300D Polyester Oxford with PU sealing",
      categorySlug: "construction-safety",
    },
    {
      name: "Industrial Site Utility Cargo Pants",
      slug: "industrial-site-utility-cargo-pants",
      description: "Heavy-duty canvas site cargo trousers. Features Cordura pocket covers and triple stitches.",
      price: 1999.00,
      comparePrice: 2499.00,
      sizes: ["30", "32", "34", "36", "38"],
      colors: ["Charcoal", "Dark Khaki"],
      stock: 120,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-CON-PAN-03",
      brand: "Red Kap Pro",
      fabricDetails: "65% Polyester, 35% Cotton Heavy Twill",
      categorySlug: "construction-safety",
    },

    // 9. Sports
    {
      name: "Breathable Athletic Mesh Jersey",
      slug: "breathable-athletic-mesh-jersey",
      description: "Lightweight mesh athletic jersey. Moisture-wicking technology handles heavy drills and warm-ups.",
      price: 799.00,
      comparePrice: 1099.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Royal Blue", "Red"],
      stock: 110,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      sku: "SMU-SPT-JER-01",
      brand: "ShopMyUniform Pro",
      fabricDetails: "100% Interlock Mesh Polyester",
      categorySlug: "sports-team",
    },
    {
      name: "Performance Athletic Training Shorts",
      slug: "performance-athletic-training-shorts",
      description: "Performance athletic training shorts. Inner mesh brief lining and secure side waistband adjustments.",
      price: 699.00,
      comparePrice: 899.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy Blue"],
      stock: 95,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-SPT-SHT-02",
      brand: "ShopMyUniform Pro",
      fabricDetails: "100% Micro-polyester Knit",
      categorySlug: "sports-team",
    },
    {
      name: "Cooldry Moisture-Wicking Team Polo",
      slug: "cooldry-moisture-wicking-team-polo",
      description: "Breathable snag-free athletic team polo. Mesh side panels provide dynamic temperature control.",
      price: 999.00,
      comparePrice: 1299.00,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Navy Blue", "Red"],
      stock: 120,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      sku: "SMU-SPT-POL-03",
      brand: "ShopMyUniform Pro",
      fabricDetails: "100% Cool-Dry Mesh Polyester",
      categorySlug: "sports-team",
    },

    // 10. Housekeeping
    {
      name: "Service Front-Zip Housekeeper Tunic",
      slug: "service-front-zip-housekeeper-tunic",
      description: "Dual pocket tunics with side snap closure. Engineered to withstand high chlorine wash temps and stain buildup.",
      price: 1199.00,
      comparePrice: 1499.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Light Blue", "Navy Blue", "Teal"],
      stock: 75,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      sku: "SMU-HSK-TUN-01",
      brand: "ShopMyUniform Pro",
      fabricDetails: "65% Polyester, 35% Cotton Poplin",
      categorySlug: "housekeeping-uniforms",
    },
    {
      name: "Service Flex Waist Comfort Trousers",
      slug: "service-flex-waist-comfort-trousers",
      description: "Housekeeping utility trousers featuring comfort stretch back and flat front styling.",
      price: 999.00,
      comparePrice: 1299.00,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Navy Blue", "Black"],
      stock: 65,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      sku: "SMU-HSK-PAN-02",
      brand: "ShopMyUniform Pro",
      fabricDetails: "65% Polyester, 35% Cotton Poplin",
      categorySlug: "housekeeping-uniforms",
    },
    {
      name: "Unisex Front Service Apron",
      slug: "unisex-front-service-apron",
      description: "Waist-length housekeeping apron with deep slots for sprays, towels, and keys.",
      price: 499.00,
      comparePrice: 699.00,
      sizes: ["One Size"],
      colors: ["Black", "Navy Blue"],
      stock: 140,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      sku: "SMU-HSK-APR-03",
      brand: "Cintas Work",
      fabricDetails: "65% Polyester, 35% Cotton Twill",
      categorySlug: "housekeeping-uniforms",
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoriesMap[prod.categorySlug];
    if (!categoryId) {
      console.error(`Category mapping missing for slug: ${prod.categorySlug}`);
      continue;
    }

    const { categorySlug: _, ...dbData } = prod;
    const images = getMockImages(prod.sku, prod.name, prod.fabricDetails);

    await prisma.product.create({
      data: {
        ...dbData,
        images,
        categoryId,
        slug: prod.slug,
      },
    });
  }

  console.log(`📦 Seeded 30 realistic premium B2B ShopMyUniform products`);

  // Seed active bulk and client Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "UNIFORM20",
        discountPct: 20,
        minOrder: 1000.00,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
      {
        code: "BULK10",
        discountPct: 10,
        minOrder: 5000.00,
        maxDiscount: 2000.00,
        usageLimit: 50,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  });

  console.log("🎟️  Seeded active bulk discount coupons");

  console.log("\n✅ ShopMyUniform B2B database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
