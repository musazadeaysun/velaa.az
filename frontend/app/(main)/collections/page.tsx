"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  fetchProducts,
  mapCategoryParamToBackendCategory,
} from "@/lib/products";
import type { Product } from "./productSlice";

const CollectionsPage = () => {
  const [activeTab, setActiveTab] = useState("rent");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryParam, setCategoryParam] = useState<string | null>(null);

  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setCategoryParam(params.get("cat"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const nextProducts = await fetchProducts({ page: 0, size: 12 });
        if (!cancelled) {
          setProducts(nextProducts);
        }
      } catch (loadError) {
        if (!cancelled) {
          setProducts([]);
          setError(
            getApiErrorMessage(
              loadError,
              "Məhsullar hələ yüklənmədi. Bir az sonra yenidən yoxlayın.",
            ),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const backendCategory = mapCategoryParamToBackendCategory(categoryParam);

    return products.filter((item) => {
      const currentPrice = activeTab === "rent" ? item.rentPrice : item.sellPrice;
      const matchesPrice = currentPrice <= priceRange;
      const matchesCategory = !backendCategory || item.backendCategory === backendCategory;
      const matchesSize = !selectedSize || item.size === selectedSize;
      const matchesOccasion = !selectedOccasion || item.occasion === selectedOccasion || item.category === selectedOccasion;

      return matchesPrice && matchesCategory && matchesSize && matchesOccasion;
    });
  }, [activeTab, categoryParam, priceRange, selectedSize, selectedOccasion, products]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8 space-y-6">
          <div className="flex bg-gray-100 p-1 rounded-full items-center">
            <button
              onClick={() => setActiveTab("rent")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === "rent"
                  ? "bg-[#8E6969] text-white shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {t("coll.rent_prices")}
            </button>
            <button
              onClick={() => setActiveTab("buy")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === "buy"
                  ? "bg-[#8E6969] text-white shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {t("coll.buy_prices")}
            </button>
          </div>

          <div className="w-full flex justify-start">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition"
            >
              <SlidersHorizontal size={16} />
              {t("coll.filters")}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-[#FAF7F5] rounded-xl p-8 mb-10 relative border border-stone-100">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E6969] mb-4">
                  {t("coll.assistant_size")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedSize === sz ? "bg-[#8E6969] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-[#8E6969]"}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E6969] mb-4">
                  {t("coll.assistant_price")} <span className="opacity-70 normal-case ml-1">({activeTab === "rent" ? t("coll.rent") : t("coll.buy")})</span>
                </h3>
                <span className="text-xs font-bold text-gray-700">{priceRange} AZN</span>
                <div className="pt-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#8E6969]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E6969] mb-4">
                  {t("coll.assistant_occasion")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[t("coll.all"), "Toy", "Ziyafət", "Nişan", "Məzuniyyət"].map((occ, idx) => {
                    const isAll = idx === 0;
                    const val = isAll ? null : occ;
                    return (
                      <button
                        key={occ}
                        onClick={() => setSelectedOccasion(val)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-grow sm:flex-none text-center ${selectedOccasion === val ? "bg-[#8E6969] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-[#8E6969]"}`}
                      >
                        {occ}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-400 italic">Loading products...</div>
        ) : (
          <>
            {error ? <div className="mb-6 text-center text-amber-700">{error}</div> : null}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.length > 0 ? (
              filteredItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  activeTab={activeTab as "rent" | "buy"}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 italic">
                {t("coll.not_found")}
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
