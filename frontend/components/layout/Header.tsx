
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { navigation } from "@/data/header/header";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import SearchOverlay from "./SearchOverlay";
import { fetchProducts } from "@/lib/products";
import { getSessionUser } from "@/lib/api/session";
import type { Product } from "@/app/(main)/collections/productSlice";

const Header = () => {
  const { cart, wishlist } = useCart();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();
  const user = getSessionUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void fetchProducts({ page: 0, size: 12 })
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const navLabel = (href: string) =>
    t("nav." + (href === "/" ? "home" : href.replace("/", "")));

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
      />
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">
        <div className="flex items-center">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Menyunu bağla" : "Menyunu aç"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 hover:text-black transition z-[101] relative"
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={1.8} /> : <Menu size={28} strokeWidth={1.8} />}
          </button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-[2rem] sm:text-[2.25rem] font-semibold tracking-[0.22em] text-[#231F20] z-10"
        >
          VELA
        </Link>

        {/* Desktop Nav hidden */}
        <nav className="hidden">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>{navLabel(item.href)}</Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
          <div className="flex items-center space-x-4 text-gray-700">
            {mounted && user && (
              <Link 
                href="/user/dashboard" 
                className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#8E6969] hover:opacity-70 transition border-r pr-4 border-gray-100"
              >
                <LayoutDashboard size={18} strokeWidth={1.5} />
                <span>Panel</span>
              </Link>
            )}
            
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex hover:text-black transition"
              aria-label="Axtar"
            >
              <Search size={22} strokeWidth={1.2} />
            </button>
            <Link
              href="/wishlist"
              className="hover:text-black transition relative"
              aria-label="Wishlist"
            >
              <Heart size={22} strokeWidth={1.2} />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#a37a7a] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="hover:text-black transition relative"
              aria-label="Cart"
            >
              <ShoppingBag size={22} strokeWidth={1.2} />
              {mounted && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#a37a7a] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {/* User icon removed as per request */}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full sm:w-80 sm:left-4 z-[100] border border-t-0 border-gray-100 bg-white shadow-[0_18px_40px_-22px_rgba(0,0,0,0.22)] rounded-b-xl overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-0.5">
            {user && (
              <Link
                href="/user/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#8E6969] border-b border-gray-50"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}
            
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-gray-700 border-b border-gray-100 last:border-b-0"
              >
                {navLabel(item.href)}
              </Link>
            ))}

            <div className="mt-4 space-y-2">
              <Link
                href="/create-store"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-[#8E6969] text-[#8E6969] text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-[#8E6969] hover:text-white transition-all duration-300"
              >
                {t("header.create_store")}
              </Link>
              <Link
                href="/create-listing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-[#8E6969] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-[#725454] transition-all duration-300"
              >
                {t("header.create_listing")}
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-1.5">
                {(["AZ", "RU", "EN"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-8 h-8 rounded-full border text-[9px] font-bold transition flex items-center justify-center ${
                      language === lang ? "bg-[#8E6969] text-white border-[#8E6969]" : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <User size={20} strokeWidth={1.5} />
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <UserPlus size={20} strokeWidth={1.5} />
                    </Link>
                  </>
                ) : (
                  <Link href="/user" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
