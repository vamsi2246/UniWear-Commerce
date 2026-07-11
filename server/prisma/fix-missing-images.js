const fs = require("fs");
const path = require("path");

const clientPublicPath = path.resolve(__dirname, "../../client/public");
const imagesBaseDir = path.join(clientPublicPath, "images");

// The 30 products list from seed.ts
const products = [
  // Medical
  { category: "medical", slug: "apex-stretch-v-neck-scrub-top" },
  { category: "medical", slug: "apex-comfort-jogger-scrub-pants" },
  { category: "medical", slug: "classic-antimicrobial-lab-coat" },
  // Corporate
  { category: "corporate", slug: "premium-non-iron-oxford-shirt" },
  { category: "corporate", slug: "structured-single-breasted-blazer" },
  { category: "corporate", slug: "executive-stretch-flat-front-trousers" },
  // School
  { category: "school", slug: "heavy-duty-pique-school-polo" },
  { category: "school", slug: "pleated-permanent-crease-skirt" },
  { category: "school", slug: "school-uniform-v-neck-vest" },
  // Industrial
  { category: "industrial", slug: "flame-resistant-utility-work-jacket" },
  { category: "industrial", slug: "cordura-knee-safety-cargo-pants" },
  { category: "industrial", slug: "waterproof-insulated-coveralls" },
  // Hospitality
  { category: "hospitality", slug: "chef-masterclass-double-breasted-jacket" },
  { category: "hospitality", slug: "heavyweight-cotton-canvas-bib-apron" },
  { category: "hospitality", slug: "classic-dining-room-server-vest" },
  // Security
  { category: "security", slug: "officer-grade-long-sleeve-uniform-shirt" },
  { category: "security", slug: "tactical-combat-duty-pants" },
  { category: "security", slug: "all-weather-security-bomber-jacket" },
  // Retail
  { category: "retail", slug: "snag-resistant-service-associate-polo" },
  { category: "retail", slug: "multi-pocket-retail-waist-apron" },
  { category: "retail", slug: "retail-comfort-chino-trousers" },
  // Construction
  { category: "construction", slug: "class-2-high-visibility-mesh-vest" },
  { category: "construction", slug: "class-3-high-vis-waterproof-parka" },
  { category: "construction", slug: "industrial-site-utility-cargo-pants" },
  // Sports
  { category: "sports", slug: "breathable-athletic-mesh-jersey" },
  { category: "sports", slug: "performance-athletic-training-shorts" },
  { category: "sports", slug: "cooldry-moisture-wicking-team-polo" },
  // Housekeeping
  { category: "housekeeping", slug: "service-front-zip-housekeeper-tunic" },
  { category: "housekeeping", slug: "service-flex-waist-comfort-trousers" },
  { category: "housekeeping", slug: "unisex-front-service-apron" }
];

const views = ["front.jpg", "back.jpg", "side.jpg", "detail.jpg"];

// Find a single valid, successfully downloaded image to use as fallback
let fallbackSrc = null;
for (const prod of products) {
  const file = path.join(imagesBaseDir, prod.category, `${prod.slug}-front.jpg`);
  if (fs.existsSync(file)) {
    fallbackSrc = file;
    break;
  }
}

if (!fallbackSrc) {
  console.error("❌ No successful images found to use as fallback!");
  process.exit(1);
}

console.log(`ℹ️  Using fallback template source: ${fallbackSrc}`);

let fixCount = 0;
for (const prod of products) {
  const prodDir = path.join(imagesBaseDir, prod.category);
  for (const view of views) {
    const filePath = path.join(prodDir, `${prod.slug}-${view}`);
    if (!fs.existsSync(filePath)) {
      // Copy fallback image to this missing path
      fs.copyFileSync(fallbackSrc, filePath);
      console.log(`   ⚡ Fixed missing: /images/${prod.category}/${prod.slug}-${view}`);
      fixCount++;
    }
  }
}

console.log(`\n🎉 Completed image fallback configuration. Copied ${fixCount} missing files.`);
