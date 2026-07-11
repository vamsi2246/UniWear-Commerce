import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@uniwear.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("👤 Created users");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "T-Shirts",
        slug: "t-shirts",
        description: "Comfortable everyday tees in premium cotton and blended fabrics",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
      },
    }),
    prisma.category.create({
      data: {
        name: "Jeans",
        slug: "jeans",
        description: "Classic and modern denim styles for every occasion",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
      },
    }),
    prisma.category.create({
      data: {
        name: "Dresses",
        slug: "dresses",
        description: "Elegant dresses for casual outings and formal events",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
      },
    }),
    prisma.category.create({
      data: {
        name: "Jackets",
        slug: "jackets",
        description: "Layering essentials from light windbreakers to heavy winter coats",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
      },
    }),
    prisma.category.create({
      data: {
        name: "Activewear",
        slug: "activewear",
        description: "Performance wear designed for workouts and active lifestyles",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      },
    }),
  ]);

  const [tshirts, jeans, dresses, jackets, activewear] = categories;

  console.log("📁 Created categories");

  // Create Products
  const products = await Promise.all([
    // T-Shirts (7 products)
    prisma.product.create({
      data: {
        name: "Classic White Cotton Tee",
        slug: "classic-white-cotton-tee",
        description: "A timeless white t-shirt crafted from 100% organic cotton. Features a relaxed fit with reinforced stitching for lasting comfort. Perfect for layering or wearing solo.",
        price: 1299,
        comparePrice: 1799,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
          "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["White", "Off-White"],
        stock: 150,
        categoryId: tshirts.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Midnight Black Crew Neck",
        slug: "midnight-black-crew-neck",
        description: "Premium black crew neck t-shirt with a modern slim fit. Made from soft combed cotton blend that retains color wash after wash.",
        price: 1499,
        comparePrice: 1999,
        images: [
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black"],
        stock: 200,
        categoryId: tshirts.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Ocean Blue Striped Tee",
        slug: "ocean-blue-striped-tee",
        description: "Nautical-inspired striped t-shirt with horizontal blue and white stripes. Relaxed fit with a slightly longer hem for a modern silhouette.",
        price: 1699,
        images: [
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "White"],
        stock: 80,
        categoryId: tshirts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Olive Green Pocket Tee",
        slug: "olive-green-pocket-tee",
        description: "Casual olive green t-shirt with a chest pocket detail. Perfect for everyday wear with a slightly oversized fit.",
        price: 1399,
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Olive", "Sage"],
        stock: 120,
        categoryId: tshirts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Graphic Print Urban Tee",
        slug: "graphic-print-urban-tee",
        description: "Bold graphic t-shirt featuring urban art-inspired prints. Made from 180 GSM cotton for a substantial, premium feel.",
        price: 1899,
        comparePrice: 2499,
        images: [
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Charcoal"],
        stock: 90,
        categoryId: tshirts.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Heather Grey V-Neck",
        slug: "heather-grey-v-neck",
        description: "Soft heather grey V-neck t-shirt with a flattering neckline. Perfect mid-weight cotton blend for year-round wear.",
        price: 1199,
        images: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Grey", "Light Grey"],
        stock: 100,
        categoryId: tshirts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Rust Orange Oversized Tee",
        slug: "rust-orange-oversized-tee",
        description: "Trendy oversized t-shirt in a warm rust orange shade. Dropped shoulders and extended length for a street-style look.",
        price: 1599,
        images: [
          "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Rust", "Terracotta"],
        stock: 60,
        categoryId: tshirts.id,
      },
    }),

    // Jeans (6 products)
    prisma.product.create({
      data: {
        name: "Slim Fit Dark Wash Jeans",
        slug: "slim-fit-dark-wash-jeans",
        description: "Classic slim fit jeans in dark indigo wash. Made from premium stretch denim (98% cotton, 2% elastane) for all-day comfort without sacrificing style.",
        price: 2999,
        comparePrice: 3999,
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
        ],
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Dark Blue", "Indigo"],
        stock: 100,
        categoryId: jeans.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Relaxed Fit Light Blue Jeans",
        slug: "relaxed-fit-light-blue-jeans",
        description: "Comfortable relaxed fit jeans with a light blue vintage wash. Features a slightly tapered leg and mid-rise waist.",
        price: 2799,
        images: [
          "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600",
        ],
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Light Blue"],
        stock: 75,
        categoryId: jeans.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "High-Rise Skinny Black Jeans",
        slug: "high-rise-skinny-black-jeans",
        description: "Sleek high-rise skinny jeans in jet black. Super stretch denim that moves with you, featuring a classic 5-pocket design.",
        price: 3299,
        comparePrice: 4299,
        images: [
          "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600",
        ],
        sizes: ["24", "26", "28", "30", "32", "34"],
        colors: ["Black"],
        stock: 110,
        categoryId: jeans.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Straight Leg Medium Wash",
        slug: "straight-leg-medium-wash",
        description: "Timeless straight leg jeans in medium wash. Balanced proportions from hip to hem, ideal for both casual and smart casual looks.",
        price: 2599,
        images: [
          "https://images.unsplash.com/photo-1475178626620-a4d074967571?w=600",
        ],
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Medium Blue"],
        stock: 85,
        categoryId: jeans.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Distressed Boyfriend Jeans",
        slug: "distressed-boyfriend-jeans",
        description: "Trendy boyfriend-style jeans with artful distressing. Relaxed through the hip and thigh with a tapered ankle for a flattering shape.",
        price: 3499,
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
        ],
        sizes: ["24", "26", "28", "30", "32"],
        colors: ["Vintage Blue", "Washed Black"],
        stock: 55,
        categoryId: jeans.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Carpenter Wide Leg Jeans",
        slug: "carpenter-wide-leg-jeans",
        description: "Utilitarian-inspired wide leg jeans with carpenter details. Features a high waist and full-length wide leg for a contemporary silhouette.",
        price: 3799,
        images: [
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
        ],
        sizes: ["26", "28", "30", "32", "34"],
        colors: ["Tan", "Khaki"],
        stock: 40,
        categoryId: jeans.id,
      },
    }),

    // Dresses (6 products)
    prisma.product.create({
      data: {
        name: "Floral Midi Wrap Dress",
        slug: "floral-midi-wrap-dress",
        description: "Elegant midi wrap dress in a delicate floral print. Flattering V-neckline and adjustable waist tie. Flows beautifully with every step.",
        price: 3999,
        comparePrice: 5499,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral Pink", "Floral Blue"],
        stock: 65,
        categoryId: dresses.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Little Black Dress",
        slug: "little-black-dress",
        description: "A wardrobe essential – the perfect little black dress. Structured bodice with an A-line skirt, hitting just above the knee for timeless elegance.",
        price: 4499,
        images: [
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600",
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black"],
        stock: 45,
        categoryId: dresses.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Summer Linen Shirt Dress",
        slug: "summer-linen-shirt-dress",
        description: "Breezy linen shirt dress perfect for warm days. Button-through front with a relaxed fit and optional waist belt for shape.",
        price: 3499,
        images: [
          "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Natural", "White", "Sky Blue"],
        stock: 70,
        categoryId: dresses.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Emerald Satin Evening Gown",
        slug: "emerald-satin-evening-gown",
        description: "Show-stopping satin evening gown in rich emerald green. Featuring a cowl neckline, fitted bodice, and flowing floor-length skirt.",
        price: 7999,
        comparePrice: 9999,
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Emerald", "Burgundy"],
        stock: 25,
        categoryId: dresses.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Casual Denim Shirt Dress",
        slug: "casual-denim-shirt-dress",
        description: "Relaxed denim shirt dress that transitions effortlessly from day to night. Soft chambray fabric with snap button closure.",
        price: 2999,
        images: [
          "https://images.unsplash.com/photo-1502716119720-b23a1e3b3a34?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Light Wash", "Mid Wash"],
        stock: 50,
        categoryId: dresses.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Boho Maxi Sundress",
        slug: "boho-maxi-sundress",
        description: "Free-spirited bohemian maxi dress with tiered ruffle details. Lightweight viscose fabric with adjustable spaghetti straps.",
        price: 3299,
        images: [
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Terracotta", "Olive", "Cream"],
        stock: 55,
        categoryId: dresses.id,
      },
    }),

    // Jackets (5 products)
    prisma.product.create({
      data: {
        name: "Classic Leather Biker Jacket",
        slug: "classic-leather-biker-jacket",
        description: "Iconic biker jacket crafted from genuine leather. Features asymmetric zip closure, belt detail, and quilted lining. Ages beautifully over time.",
        price: 12999,
        comparePrice: 16999,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
          "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Brown"],
        stock: 30,
        categoryId: jackets.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Quilted Puffer Jacket",
        slug: "quilted-puffer-jacket",
        description: "Warm quilted puffer jacket with recycled synthetic fill. Water-resistant outer shell with elastic cuffs and adjustable hem.",
        price: 5999,
        comparePrice: 7999,
        images: [
          "https://images.unsplash.com/photo-1544923246-77307dd270cb?w=600",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Olive"],
        stock: 50,
        categoryId: jackets.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Linen Blend Blazer",
        slug: "linen-blend-blazer",
        description: "Sophisticated linen-blend blazer with a relaxed, unstructured fit. Perfect for smart casual occasions or layering over a tee.",
        price: 6499,
        images: [
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige", "Light Grey", "Navy"],
        stock: 40,
        categoryId: jackets.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Windbreaker Track Jacket",
        slug: "windbreaker-track-jacket",
        description: "Lightweight windbreaker with color-block design. Packable into its own pocket, making it perfect for unpredictable weather.",
        price: 3499,
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black/White", "Navy/Red", "Forest Green"],
        stock: 70,
        categoryId: jackets.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Corduroy Trucker Jacket",
        slug: "corduroy-trucker-jacket",
        description: "Retro-inspired corduroy trucker jacket with a sherpa-lined collar. Warm enough for autumn and cool enough for late spring.",
        price: 4999,
        images: [
          "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Camel", "Chocolate", "Forest Green"],
        stock: 35,
        categoryId: jackets.id,
      },
    }),

    // Activewear (4 products)
    prisma.product.create({
      data: {
        name: "Performance Running Shorts",
        slug: "performance-running-shorts",
        description: "Ultra-lightweight running shorts with built-in liner and moisture-wicking fabric. Features a secure zip pocket and reflective accents.",
        price: 1999,
        comparePrice: 2499,
        images: [
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Grey"],
        stock: 100,
        categoryId: activewear.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "High-Waist Yoga Leggings",
        slug: "high-waist-yoga-leggings",
        description: "Buttery-soft high-waist yoga leggings with 4-way stretch. Squat-proof, moisture-wicking, and featuring a hidden waistband pocket.",
        price: 2499,
        comparePrice: 3299,
        images: [
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Charcoal", "Deep Navy", "Burgundy"],
        stock: 120,
        categoryId: activewear.id,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Dry-Fit Training Tank",
        slug: "dry-fit-training-tank",
        description: "Breathable training tank top with mesh back panel for maximum airflow. Cut for freedom of movement during high-intensity workouts.",
        price: 1299,
        images: [
          "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Neon Green"],
        stock: 90,
        categoryId: activewear.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Zip-Up Training Hoodie",
        slug: "zip-up-training-hoodie",
        description: "Versatile zip-up hoodie made from premium tech fleece. Thumb holes, side pockets, and a fitted hood keep you comfortable pre and post workout.",
        price: 3999,
        comparePrice: 4999,
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Charcoal", "Black", "Navy"],
        stock: 60,
        categoryId: activewear.id,
        isFeatured: true,
      },
    }),
  ]);

  console.log(`📦 Created ${products.length} products`);

  // Create Coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: "WELCOME10",
        discountPct: 10,
        minOrder: 999,
        maxDiscount: 500,
        usageLimit: 100,
        expiresAt: new Date("2027-12-31"),
      },
    }),
    prisma.coupon.create({
      data: {
        code: "SUMMER25",
        discountPct: 25,
        minOrder: 2999,
        maxDiscount: 2000,
        usageLimit: 50,
        expiresAt: new Date("2027-09-30"),
      },
    }),
    prisma.coupon.create({
      data: {
        code: "FLAT500",
        discountPct: 100,
        minOrder: 3000,
        maxDiscount: 500,
        usageLimit: 200,
        expiresAt: new Date("2027-12-31"),
      },
    }),
  ]);

  console.log("🎟️  Created coupons");

  // Create some sample reviews
  const productIds = products.map((p) => p.id);
  await Promise.all([
    prisma.review.create({
      data: {
        userId: customer.id,
        productId: productIds[0],
        rating: 5,
        comment: "Amazing quality! The cotton is so soft and the fit is perfect. Already ordered two more.",
      },
    }),
    prisma.review.create({
      data: {
        userId: customer.id,
        productId: productIds[7],
        rating: 4,
        comment: "Great jeans, very comfortable. The stretch is nice for everyday wear. Runs slightly large.",
      },
    }),
    prisma.review.create({
      data: {
        userId: admin.id,
        productId: productIds[0],
        rating: 4,
        comment: "Good basic tee. Washes well and holds its shape nicely.",
      },
    }),
  ]);

  console.log("⭐ Created sample reviews");

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("   Admin: admin@uniwear.com / password123");
  console.log("   User:  john@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
