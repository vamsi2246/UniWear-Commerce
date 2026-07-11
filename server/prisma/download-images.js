const fs = require("fs");
const path = require("path");
const axios = require("axios");

const clientPublicPath = path.resolve(__dirname, "../../client/public");
const imagesBaseDir = path.join(clientPublicPath, "images");

// Make sure target directories exist
const categories = [
  "medical",
  "corporate",
  "school",
  "industrial",
  "hospitality",
  "security",
  "retail",
  "construction",
  "sports",
  "housekeeping"
];

categories.forEach((cat) => {
  const dir = path.join(imagesBaseDir, cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Mapping of products to clean, isolated apparel images on Unsplash
const productsImages = [
  // 1. Medical
  {
    category: "medical",
    slug: "apex-stretch-v-neck-scrub-top",
    unsplashId: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "medical",
    slug: "apex-comfort-jogger-scrub-pants",
    unsplashId: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "medical",
    slug: "classic-antimicrobial-lab-coat",
    unsplashId: "https://images.unsplash.com/photo-1622445262465-2481c8573226?w=600&auto=format&fit=crop&q=80"
  },

  // 2. Corporate
  {
    category: "corporate",
    slug: "premium-non-iron-oxford-shirt",
    unsplashId: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "corporate",
    slug: "structured-single-breasted-blazer",
    unsplashId: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "corporate",
    slug: "executive-stretch-flat-front-trousers",
    unsplashId: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
  },

  // 3. School
  {
    category: "school",
    slug: "heavy-duty-pique-school-polo",
    unsplashId: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "school",
    slug: "pleated-permanent-crease-skirt",
    unsplashId: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "school",
    slug: "school-uniform-v-neck-vest",
    unsplashId: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80"
  },

  // 4. Industrial
  {
    category: "industrial",
    slug: "flame-resistant-utility-work-jacket",
    unsplashId: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "industrial",
    slug: "cordura-knee-safety-cargo-pants",
    unsplashId: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "industrial",
    slug: "waterproof-insulated-coveralls",
    unsplashId: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80"
  },

  // 5. Hospitality
  {
    category: "hospitality",
    slug: "chef-masterclass-double-breasted-jacket",
    unsplashId: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "hospitality",
    slug: "heavyweight-cotton-canvas-bib-apron",
    unsplashId: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "hospitality",
    slug: "classic-dining-room-server-vest",
    unsplashId: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80"
  },

  // 6. Security
  {
    category: "security",
    slug: "officer-grade-long-sleeve-uniform-shirt",
    unsplashId: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "security",
    slug: "tactical-combat-duty-pants",
    unsplashId: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "security",
    slug: "all-weather-security-bomber-jacket",
    unsplashId: "https://images.unsplash.com/photo-1590102426859-ac915147c10f?w=600&auto=format&fit=crop&q=80"
  },

  // 7. Retail
  {
    category: "retail",
    slug: "snag-resistant-service-associate-polo",
    unsplashId: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "retail",
    slug: "multi-pocket-retail-waist-apron",
    unsplashId: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "retail",
    slug: "retail-comfort-chino-trousers",
    unsplashId: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
  },

  // 8. Construction
  {
    category: "construction",
    slug: "class-2-high-visibility-mesh-vest",
    unsplashId: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "construction",
    slug: "class-3-high-vis-waterproof-parka",
    unsplashId: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "construction",
    slug: "industrial-site-utility-cargo-pants",
    unsplashId: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
  },

  // 9. Sports
  {
    category: "sports",
    slug: "breathable-athletic-mesh-jersey",
    unsplashId: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "sports",
    slug: "performance-athletic-training-shorts",
    unsplashId: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "sports",
    slug: "cooldry-moisture-wicking-team-polo",
    unsplashId: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"
  },

  // 10. Housekeeping
  {
    category: "housekeeping",
    slug: "service-front-zip-housekeeper-tunic",
    unsplashId: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "housekeeping",
    slug: "service-flex-waist-comfort-trousers",
    unsplashId: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
  },
  {
    category: "housekeeping",
    slug: "unisex-front-service-apron",
    unsplashId: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80"
  }
];

async function downloadImage(url, destPath) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (err) {
    console.error(`❌ Failed to download from: ${url} - Error: ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log("🚀 Starting isolated product images downloader...");
  let successCount = 0;

  for (const item of productsImages) {
    const prodDir = path.join(imagesBaseDir, item.category);
    
    // Output names on disk
    const views = ["front.jpg", "back.jpg", "side.jpg", "detail.jpg"];

    console.log(`\n📦 Downloading assets for: ${item.slug}`);
    
    // We use the high-quality product image for all angles (in a real store the user can place manual variations)
    // To ensure they are fully populated immediately:
    for (const view of views) {
      const destFile = path.join(prodDir, `${item.slug}-${view}`);
      try {
        await downloadImage(item.unsplashId, destFile);
        console.log(`   ✔ Saved: /images/${item.category}/${item.slug}-${view}`);
        successCount++;
      } catch (e) {
        console.log(`   ❌ Failed to save: /images/${item.category}/${item.slug}-${view}`);
      }
    }
  }

  console.log(`\n🎉 Image download completed! Total successfully written: ${successCount} assets.`);
}

main().catch(err => console.error("Script failed:", err));
