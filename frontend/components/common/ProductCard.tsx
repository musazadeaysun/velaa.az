
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2, MessageCircle, Copy, Check, ShoppingBag, Trash2, Phone } from "lucide-react";
import { Product } from "@/app/(main)/collections/productSlice";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProductHref, deleteLocalProduct } from "@/lib/products";
import { getSessionUser } from "@/lib/api/session";

interface ProductCardProps {
  product: Product;
  activeTab?: "rent" | "buy";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, activeTab = "rent" }) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useCart();
  const { t, language } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [priceType, setPriceType] = useState<"rent" | "buy">(activeTab);
  const localizedKey = language.toLowerCase();
  const localizedProduct = product as unknown as Record<string, string | undefined>;
  const user = getSessionUser();
  const isAdmin = user?.role === "ADMIN";

  const handleDeleteProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Bu elanı silmək istədiyinizə əminsiniz?")) {
      deleteLocalProduct(product.id);
      window.location.reload();
    }
  };

  const isInWishlist = wishlist.find((w) => w.id === product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.rentPrice,
        image: product.image,
      });
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(
      `Buna bax: ${product.name} - ${window.location.origin}${getProductHref(product)}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowShareMenu(false);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${getProductHref(product)}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setShowShareMenu(false);
    });
  };

  const [showWarning, setShowWarning] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-[#8E6969]/10">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-[#8E6969]/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest shadow-sm">
              {t("product.new")}
            </span>
          )}
        </div>

        {/* Action Overlays */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          {(isAdmin || product.isLocal) && (
            <button
              onClick={handleDeleteProduct}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 text-red-500 hover:bg-red-500 hover:text-white"
              title="Elanı sil"
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 ${
              isInWishlist ? "text-red-500" : "text-gray-400 hover:text-[#8E6969]"
            }`}
          >
            <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 text-gray-400 hover:text-[#8E6969]"
            >
              <Share2 size={18} strokeWidth={1.5} />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#FDF8F6] rounded-xl transition"
                >
                  <MessageCircle size={18} className="text-green-500" />
                  <span>{t("product.share_wa")}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-[#FDF8F6] rounded-xl transition"
                >
                  {isCopied ? <Check size={18} className="text-blue-500" /> : <Copy size={18} />}
                  <span>{isCopied ? t("product.copied") : t("product.copy_link")}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hover Action Overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPriceType("rent");
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 border ${
                priceType === "rent" 
                  ? "bg-white text-[#8E6969] border-white" 
                  : "bg-white/20 text-white border-white/40 hover:bg-white/40"
              }`}
            >
              {t("product.rent")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPriceType("buy");
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 border ${
                priceType === "buy" 
                  ? "bg-[#8E6969] text-white border-[#8E6969]" 
                  : "bg-white/20 text-white border-white/40 hover:bg-white/40"
              }`}
            >
              {t("product.buy")}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-start capitalize">
            <h3 className="text-sm font-semibold text-gray-800 tracking-tight group-hover:text-[#8E6969] transition duration-300">
              {localizedProduct[`name_${localizedKey}`] || product.name}
            </h3>
            <span className="text-[10px] text-[#A37A7A] bg-[#A37A7A]/10 px-2 py-0.5 rounded-md font-bold">
              {product.size}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest flex justify-between items-center">
            <span>{localizedProduct[`category_${localizedKey}`] || product.category}</span>
            <span className="flex items-center gap-1">
              {product.city && <span className="text-[10px] lowercase opacity-70 italic">{product.city}</span>}
              {!product.phoneNumber && product.isLocal && <span className="text-[8px] text-red-300 font-normal"> (no-num)</span>}
            </span>
          </p>

          {/* Aggressive Prominent Phone Number Display */}
          {product.phoneNumber && (
            <div className="pt-1">
              <a 
                href={`tel:${product.phoneNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8E6969] text-white text-[12px] font-black shadow-md hover:bg-[#725454] transition-all transform hover:scale-105"
              >
                <Phone size={12} fill="white" />
                <span>{product.phoneNumber}</span>
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {showWarning && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-white/20 backdrop-blur-[2px]">
              <div className="bg-yellow-400 text-black text-[10px] font-bold px-4 py-2 rounded-lg shadow-xl animate-bounce border border-yellow-500 flex items-center gap-2">
                <span className="text-sm">⚠️</span> {t("product.not_active")}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-50 pt-3">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                {priceType === "rent" ? t("product.rent_price") : t("product.buy_price")}
              </span>
              <span className="text-xl font-black text-gray-900">
                {priceType === "rent" ? product.rentPrice : product.sellPrice} <span className="text-sm font-bold">AZN</span>
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FAF7F5] text-[#8E6969] hover:bg-[#8E6969] hover:text-white transition-all duration-300"
              title={t("product.add_to_cart")}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
