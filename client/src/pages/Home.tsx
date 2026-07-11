import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw, Building2, ShieldCheck, HeartPulse, GraduationCap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productService.getFeatured(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const featured = featuredData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="space-y-20 pb-16">
      {/* Premium B2B Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-zinc-950 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600"
            alt="Corporate and Industrial Uniforms"
            className="w-full h-full object-cover filter contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Premium Uniform Solutions for Enterprises & Teams</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-2xl text-zinc-50"
            >
              Workwear built with <br />
              <span className="text-zinc-400">durability & pride.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-300 max-w-xl"
            >
              ShopMyUniform supplies high-performance scrubs, industrial workwear, and corporate attire designed for everyday endurance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="xl" className="bg-white text-zinc-950 hover:bg-zinc-200" asChild>
                <Link to="/products">
                  Shop B2B Catalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white/20 hover:bg-white/10 text-white" asChild>
                <Link to="/products?featured=true">View Best Sellers</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y py-10 bg-card rounded-xl px-6 border">
          {[
            { icon: ShieldCheck, title: "Industrial Grade Quality", desc: "Reinforced stitching, stretch gussets, and stain-resistant finishes." },
            { icon: Truck, title: "Corporate Bulk Logistics", desc: "Customized embroidery services and tiered corporate volume discounts." },
            { icon: RotateCcw, title: "Hassle-Free Fit Exchange", desc: "Easy size swaps for teams within 30 days of shipment." },
          ].map((item, i) => (
            <div key={item.title} className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border">
                <item.icon className="h-6 w-6 text-zinc-800" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Industry (Featured Industries Grid) */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Industry Solutions</h2>
          <p className="text-muted-foreground">Expertly tailored collections optimized for specific professional fields.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Healthcare & Labs", slug: "medical-scrubs", image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600", desc: "Antimicrobial & stretch fabrics", icon: HeartPulse },
            { name: "Construction & Safety", slug: "industrial-safety", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600", desc: "Hi-vis and heavy-duty ripstop", icon: ShieldCheck },
            { name: "Executive Corporate", slug: "corporate-office", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600", desc: "Wrinkle-resistant class looks", icon: Building2 },
          ].map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-80 rounded-xl overflow-hidden shadow-sm border"
            >
              <img src={ind.image} alt={ind.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <ind.icon className="h-5 w-5 text-zinc-400" />
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{ind.desc}</span>
                </div>
                <h3 className="text-xl font-bold">{ind.name}</h3>
                <Link to={`/products?category=${ind.slug}`} className="inline-flex items-center text-sm font-semibold text-white group-hover:underline pt-2">
                  Browse Catalog
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex items-end justify-between border-b pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Best Selling Uniforms</h2>
            <p className="text-muted-foreground">Trusted by procurement teams for fit, wearability, and lifespan.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products" className="gap-1">
              Shop All Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loadingFeatured ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bulk Orders Request Custom CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-zinc-950 text-white rounded-2xl p-8 md:p-16 relative overflow-hidden border">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Volume Procurement Solutions</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Need custom embroidery or bulk logistics?</h2>
            <p className="text-zinc-300 text-lg">
              ShopMyUniform provides customized portals and dedicated pricing for healthcare providers, industrial firms, hotels, and schools with 10+ employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="xl" className="bg-white text-zinc-950 hover:bg-zinc-200" asChild>
                <Link to="/products">Start Bulk Checkout</Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Contact B2B Accounts
              </Button>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-20 hidden lg:block">
            <Building2 className="h-80 w-80 text-white" />
          </div>
        </div>
      </section>

      {/* Trusted By Businesses Logos */}
      <section className="container mx-auto px-4 py-8 border-t text-center space-y-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Proudly Outfitting Teams At</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 contrast-200">
          <span className="text-xl font-bold tracking-wider">APEX CARE HOSPITALS</span>
          <span className="text-xl font-bold tracking-wider">SAFE ROAD CIVIL</span>
          <span className="text-xl font-bold tracking-wider">GRAND HOTEL GROUP</span>
          <span className="text-xl font-bold tracking-wider">ELITE ACADEMY</span>
        </div>
      </section>
    </div>
  );
}
