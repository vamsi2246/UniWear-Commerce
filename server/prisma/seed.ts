import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ShopMyUniform premium database seed...\n");

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

  // Seed Categories (Industries)
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

  // Seed 30+ Products (Product-focused apparel only, no random backgrounds)
  const productsData = [
    // 1. Medical
    {
      name: "Pro-Flex Unisex Scrub Top",
      slug: "pro-flex-unisex-scrub-top",
      description: "Antimicrobial Medical Scrub Top. Breathable stretch blend with double utility breast slots and side seam vents.",
      price: 1199.00,
      comparePrice: 1599.00,
      images: [
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600",
        "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600"
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Navy Blue", "Royal Blue", "Hunter Green"],
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
      name: "Pro-Flex Jogger Scrub Pants",
      slug: "pro-flex-jogger-scrub-pants",
      description: "Medical jogger pants featuring elastic drawstring waistband, knit cuffs, and 6 utility cargo pockets.",
      price: 1399.00,
      comparePrice: 1899.00,
      images: [
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600"
      ],
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
      name: "Classic Professional Lab Coat",
      slug: "classic-professional-lab-coat",
      description: "Full-length white lab coat with soil-release protection. Side slits provide easy pocket access.",
      price: 1899.00,
      comparePrice: 2499.00,
      images: [
        "https://images.unsplash.com/photo-1622445262465-2481c8573226?w=600",
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600"
      ],
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
      name: "Premium Wrinkle-Free Oxford Shirt",
      slug: "premium-wrinkle-free-oxford-shirt",
      description: "Executive long-sleeve corporate uniform shirt. Features non-iron design, fused collar, and adjustable cuffs.",
      price: 1499.00,
      comparePrice: 1999.00,
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
        "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Sky Blue"],
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
      name: "Structured Executive Business Blazer",
      slug: "structured-executive-business-blazer",
      description: "Lined single-breasted corporate blazer with structured shoulder padding and notched lapels.",
      price: 3899.00,
      comparePrice: 4999.00,
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
        "https://images.unsplash.com/photo-1598961008151-3a56cc5c26b9?w=600"
      ],
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
      name: "Executive Tailored Fit Chinos",
      slug: "executive-tailored-fit-chinos",
      description: "Flat-front tailored corporate trousers with dynamic stretch waistband and deep rear welt pockets.",
      price: 1799.00,
      comparePrice: 2299.00,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      ],
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
      name: "Classic Pique School Polo Shirt",
      slug: "classic-pique-school-polo-shirt",
      description: "Shrink-resistant school polo shirt. Double-needle hemmed sleeves and tagless collar for ultimate schoolyard comfort.",
      price: 699.00,
      comparePrice: 899.00,
      images: [
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600"
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Navy Blue", "Red"],
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
      name: "Pleated School Uniform Skirt",
      slug: "pleated-school-uniform-skirt",
      description: "Navy blue pleated school skirt with elastic back closure and wrinkle-resistant fabric finish.",
      price: 999.00,
      comparePrice: 1299.00,
      images: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600",
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600"
      ],
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
      name: "Classic V-Neck School Uniform Sweater",
      slug: "classic-v-neck-school-uniform-sweater",
      description: "Fine-gauge knit school uniform sweater vest. Features anti-pilling thread structure and ribbed v-neck collar.",
      price: 1199.00,
      comparePrice: 1599.00,
      images: [
        "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600"
      ],
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
      name: "Flame-Resistant Heavyweight Work Jacket",
      slug: "flame-resistant-heavyweight-work-jacket",
      description: "NFPA 2112 certified heavy-duty work jacket with brass front zipper and dual reinforced utility chest pockets.",
      price: 2499.00,
      comparePrice: 2999.00,
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600"
      ],
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Navy Blue", "Khaki"],
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
      name: "Reinforced Knee Safety Cargo Pants",
      slug: "reinforced-knee-safety-cargo-pants",
      description: "Canvas trousers featuring cordura-reinforced knee pad slots and triple-stitched seams.",
      price: 1899.00,
      comparePrice: 2299.00,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      ],
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
      name: "Waterproof Heavy-Duty Work Overalls",
      slug: "waterproof-heavy-duty-work-overalls",
      description: "Insulated utility overalls with sealed seams. Heavy-duty elastic buckles and front zipper entry.",
      price: 2999.00,
      comparePrice: 3599.00,
      images: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600",
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600"
      ],
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
      name: "Executive Double-Breasted Chef Coat",
      slug: "executive-double-breasted-chef-coat",
      description: "Premium executive chef coat with cloth-covered buttons, French cuffs, and left sleeve thermometer pocket.",
      price: 2199.00,
      comparePrice: 2799.00,
      images: [
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600",
        "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600"
      ],
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
      name: "Heavy-Duty Cotton Bib Apron",
      slug: "heavy-duty-cotton-bib-apron",
      description: "Bib apron with reinforced double front utility slots and adjustable neck strap.",
      price: 699.00,
      comparePrice: 999.00,
      images: [
        "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600",
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600"
      ],
      sizes: ["One Size"],
      colors: ["Black", "Burgundy", "Navy"],
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
      name: "Tailored Restaurant Server Vest",
      slug: "tailored-restaurant-server-vest",
      description: "Waitstaff vest featuring front button closure, welt chest slots, and adjustable back satin belt.",
      price: 1199.00,
      comparePrice: 1599.00,
      images: [
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600",
        "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600"
      ],
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
      name: "Class A Security Officer Shirt",
      slug: "class-a-security-officer-shirt",
      description: "Class A short sleeve security uniform shirt. Features structured shoulder epaulets and pleated chest pockets.",
      price: 1399.00,
      comparePrice: 1699.00,
      images: [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600",
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600"
      ],
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
      name: "Reinforced Security Duty Pants",
      slug: "reinforced-security-duty-pants",
      description: "Officer duty trousers with silicone shirt-grip waistband and reinforced tactical cargo utility pockets.",
      price: 1899.00,
      comparePrice: 2299.00,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      ],
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
      name: "Security Windbreaker Officer Jacket",
      slug: "security-windbreaker-officer-jacket",
      description: "Officer bomber utility jacket with zip-out thermal fleece liner and side badge tabs.",
      price: 2799.00,
      comparePrice: 3499.00,
      images: [
        "https://images.unsplash.com/photo-1590102426859-ac915147c10f?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
      ],
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
      name: "Retail Staff Comfort Polo",
      slug: "retail-staff-comfort-polo",
      description: "Anti-snag knit retail uniform polo shirt. Features odor-repelling fabric thread and double-needle seams.",
      price: 899.00,
      comparePrice: 1199.00,
      images: [
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600"
      ],
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
      name: "Snag-Resistant Retail Service Apron",
      slug: "snag-resistant-retail-service-apron",
      description: "Low-waist server associate apron with 3 horizontal pockets and adjustable strap binds.",
      price: 599.00,
      comparePrice: 799.00,
      images: [
        "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600",
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600"
      ],
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
      name: "Retail Staff Flat-Front Chinos",
      slug: "retail-staff-flat-front-chinos",
      description: "Easy-wash flat-front store associate chinos. Comfort stretch thread provides daily mobility.",
      price: 1499.00,
      comparePrice: 1999.00,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      ],
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
      name: "Class 2 High-Visibility Safety Vest",
      slug: "class-2-high-visibility-safety-vest",
      description: "Bright yellow mesh traffic vest with class 2 visibility. Dual horizontal 3M reflective tape bands.",
      price: 499.00,
      comparePrice: 699.00,
      images: [
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600",
        "https://images.unsplash.com/photo-1590102426859-ac915147c10f?w=600"
      ],
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
      name: "Class 3 Waterproof Safety Parka",
      slug: "class-3-waterproof-safety-parka",
      description: "Class 3 waterproof high-vis parka. Features storm-seal cuffs, heavy hood, and warm thermal padding.",
      price: 3299.00,
      comparePrice: 3999.00,
      images: [
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"
      ],
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
      name: "Construction Reinforced Utility Cargo Pants",
      slug: "construction-reinforced-utility-cargo-pants",
      description: "Heavy-duty canvas site cargo trousers. Features Cordura pocket covers and triple stitches.",
      price: 1999.00,
      comparePrice: 2499.00,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      ],
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
      name: "Athletic Team Training Jersey",
      slug: "athletic-team-training-jersey",
      description: "Lightweight mesh athletic jersey. Moisture-wicking technology handles heavy drills and warm-ups.",
      price: 799.00,
      comparePrice: 1099.00,
      images: [
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600"
      ],
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
      name: "Athletic Team Training Shorts",
      slug: "athletic-team-training-shorts",
      description: "Performance athletic training shorts. Inner mesh brief lining and secure side waistband adjustments.",
      price: 699.00,
      comparePrice: 899.00,
      images: [
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600"
      ],
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
      name: "Snag-Free Performance Team Polo",
      slug: "snag-free-performance-team-polo",
      description: "Breathable snag-free athletic team polo. Mesh side panels provide dynamic temperature control.",
      price: 999.00,
      comparePrice: 1299.00,
      images: [
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600"
      ],
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
      name: "CleanShield Housekeeping Tunic",
      slug: "cleanshield-housekeeping-tunic",
      description: "Dual pocket tunics with side snap closure. Engineered to withstand high chlorine wash temps and stain buildup.",
      price: 1199.00,
      comparePrice: 1499.00,
      images: [
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600",
        "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600"
      ],
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
      name: "CleanShield Comfort Elastic Waist Pants",
      slug: "cleanshield-comfort-elastic-waist-pants",
      description: "Housekeeping utility trousers featuring comfort stretch back and flat front styling.",
      price: 999.00,
      comparePrice: 1299.00,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
      ],
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
      name: "Unisex Housekeeping Service Apron",
      slug: "unisex-housekeeping-service-apron",
      description: "Waist-length housekeeping apron with deep slots for sprays, towels, and keys.",
      price: 499.00,
      comparePrice: 699.00,
      images: [
        "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600",
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600"
      ],
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
    await prisma.product.create({
      data: {
        ...dbData,
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
