
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Check,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Phone,
  MessageCircle,
} from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  fetchProductByIdentifier,
  fetchProductsByBackendCategory,
} from "@/lib/products";
import type { Product } from "@/app/(main)/collections/productSlice";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, wishlist } = useCart();
  const { t, language } = useLanguage();

  const [priceType, setPriceType] = useState<"rent" | "buy">("rent");
  const [isCopied, setIsCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const localizedProduct = product as unknown as Record<string, string | undefined>;

  useEffect(() => {
    const identifier = params.id as string;
    if (!identifier) {
      return;
    }

    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const nextProduct = await fetchProductByIdentifier(identifier);
        if (cancelled) {
          return;
        }

        setProduct(nextProduct);

        if (nextProduct.backendCategory) {
          const related = await fetchProductsByBackendCategory(
            nextProduct.backendCategory as "WOMEN" | "MEN" | "KIDS" | "UNISEX",
          );

          if (!cancelled) {
            setRelatedProducts(
              related
                .filter((item) => item.id !== nextProduct.id)
                .slice(0, 4),
            );
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getApiErrorMessage(loadError, "Product could not be loaded."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const isInWishlist = wishlist.find((item) => item.id === product?.id);

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl font-serif font-bold text-gray-800">
          {error || t("product.not_found")}
        </h1>
        <button
          onClick={() => router.push("/collections")}
          className="text-[#8E6969] font-bold uppercase tracking-widest text-xs hover:underline"
        >
          {t("product.back_to_coll")}
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleAction = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t("product.back")}</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:text-[#8E6969] hover:border-[#8E6969]/20 transition"
            title={t("product.copy_link")}
          >
            {isCopied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="relative">
          <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-50 sticky top-8">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isNew && (
              <span className="absolute top-8 left-8 bg-[#8E6969]/90 backdrop-blur-md text-white text-xs uppercase font-black px-4 py-2 rounded-xl tracking-widest shadow-xl">
                {t("product.new_coll")}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-stone-100 text-stone-500 text-[10px] uppercase font-bold tracking-widest rounded-md">
                {localizedProduct[`category_${language.toLowerCase()}`] || product.category}
              </span>
              <div className="h-[1px] w-8 bg-stone-200" />
              <span className="text-[10px] text-stone-400 uppercase font-medium tracking-wider">
                {t("product.code")}: VLA-{product.id}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              {localizedProduct[`name_${language.toLowerCase()}`] || product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" /> {t("product.in_stock")}
              </span>
              <span className="text-stone-300">|</span>
              <span>
                {t("product.size")}: <span className="font-bold text-black">{product.size}</span>
              </span>
            </div>

            {product.phoneNumber && (
              <div className="flex flex-col gap-2 py-4">
                <div className="flex items-center gap-3">
                  <a 
                    href={`tel:${product.phoneNumber}`}
                    className="flex-1 h-14 flex items-center justify-center gap-3 bg-[#8E6969]/5 text-[#8E6969] rounded-2xl border border-[#8E6969]/10 font-bold hover:bg-[#8E6969]/10 transition-colors"
                  >
                    <Phone size={18} />
                    {product.phoneNumber}
                  </a>
                  <a 
                    href={`https://wa.me/${product.phoneNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center bg-green-500 text-white rounded-2xl shadow-lg shadow-green-500/20 hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={22} />
                  </a>
                </div>
                {product.city && (
                  <p className="text-xs text-gray-400 italic px-1">
                    📍 {product.city}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-2 bg-stone-50 rounded-3xl flex gap-2 border border-stone-100">
            <button
              onClick={() => setPriceType("rent")}
              className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                priceType === "rent"
                  ? "bg-white text-[#8E6969] shadow-md border-stone-100"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {t("product.rent")}
            </button>
            <button
              onClick={() => setPriceType("buy")}
              className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                priceType === "buy"
                  ? "bg-[#8E6969] text-white shadow-lg shadow-[#8E6969]/20"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {t("product.buy")}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black tracking-tighter text-stone-400">
              {t("product.final_price")}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900">
                {priceType === "rent" ? product.rentPrice : product.sellPrice}
              </span>
              <span className="text-xl font-bold text-[#8E6969]">AZN</span>
            </div>
          </div>

          <div className="flex gap-4 relative">
            {showWarning && (
              <div className="absolute -top-14 left-0 right-0 z-50">
                <div className="bg-yellow-400 text-black text-xs font-black px-6 py-3 rounded-2xl shadow-2xl border border-yellow-500 flex items-center justify-center gap-3">
                  {t("product.not_active")}
                </div>
              </div>
            )}
            <button
              onClick={handleAction}
              className="flex-[3] h-16 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <ShoppingBag size={20} />
              {priceType === "rent" ? t("product.rent_now") : t("product.buy_now")}
            </button>
            <button
              onClick={() =>
                isInWishlist
                  ? removeFromWishlist(product.id)
                  : addToWishlist({
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      price: product.rentPrice,
                      image: product.image,
                    })
              }
              className={`flex-1 h-16 rounded-2xl border transition-all flex items-center justify-center ${
                isInWishlist
                  ? "bg-red-50 border-red-100 text-red-500"
                  : "border-gray-200 text-gray-400 hover:border-[#8E6969] hover:text-[#8E6969]"
              }`}
            >
              <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-[#8E6969]">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest">{t("product.quality")}</h4>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-[#8E6969]">
                <RotateCcw size={24} />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest">{t("product.return")}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-32 space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-gray-900">{t("product.suggested")}</h2>
          <div className="w-20 h-1 bg-[#8E6969] rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
