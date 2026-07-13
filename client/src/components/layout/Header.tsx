import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, LogOut, Sun, Moon, Menu, X, Search, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">UniWear</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shop All
            </Link>
            <Link to="/products?category=medical-scrubs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Medical
            </Link>
            <Link to="/products?category=corporate-office" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Corporate
            </Link>
            <Link to="/products?category=school-uniforms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              School
            </Link>
            <Link to="/products?category=hospitality-culinary" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Hospitality
            </Link>
            <Link to="/products?category=security-operations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Security
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Cart */}
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link to="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </Link>
                </Button>

                {/* Admin */}
                {isAdmin && (
                  <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                    <Link to="/admin">
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                  </Button>
                )}

                {/* User Menu */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/orders">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t"
            >
              <div className="py-4 space-y-2">
                <Link to="/products" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Shop All</Link>
                <Link to="/products?category=medical-scrubs" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Medical</Link>
                <Link to="/products?category=corporate-office" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Corporate</Link>
                <Link to="/products?category=school-uniforms" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>School</Link>
                <Link to="/products?category=hospitality-culinary" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Hospitality</Link>
                <Link to="/products?category=security-operations" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Security</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/orders" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>My Orders</Link>
                    {isAdmin && <Link to="/admin" className="block py-2 text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-sm text-destructive">Logout</button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1"><Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link></Button>
                    <Button size="sm" asChild className="flex-1"><Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link></Button>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
