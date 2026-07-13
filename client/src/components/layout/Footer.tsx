import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <ShoppingBag className="h-6 w-6 text-primary" />
              UniWear
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium fashion for everyone. Discover the latest trends and timeless classics.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=medical-scrubs" className="hover:text-foreground transition-colors">Medical</Link></li>
              <li><Link to="/products?category=corporate-office" className="hover:text-foreground transition-colors">Corporate</Link></li>
              <li><Link to="/products?category=school-uniforms" className="hover:text-foreground transition-colors">School</Link></li>
              <li><Link to="/products?category=hospitality-culinary" className="hover:text-foreground transition-colors">Hospitality</Link></li>
              <li><Link to="/products?category=security-operations" className="hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-foreground transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-foreground transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-foreground transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Free shipping on orders over ₹2,999</li>
              <li>30-day return policy</li>
              <li>Secure checkout</li>
              <li>Customer support 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} UniWear Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
