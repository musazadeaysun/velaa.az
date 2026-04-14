"use client";

import React, { useEffect, useState } from "react";
import { Camera, Tag, DollarSign, FileText, ChevronDown, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  createProduct,
  getApiErrorMessage,
  getStoreByUserId,
} from "@/lib/api/client";
import { getSessionUser } from "@/lib/api/session";
import type { ProductCategory } from "@/lib/api/types";
import { getLocalStores } from "@/lib/stores";
import { saveLocalProduct } from "@/lib/products";

const categoryMap: Record<string, ProductCategory> = {
  bridal: "WOMEN",
  evening: "WOMEN",
  mens: "MEN",
  kids: "KIDS",
  none: "UNISEX",
};

const CreateListingPage = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [storeLoading, setStoreLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeState, setStoreState] = useState<{
    id: number | null;
    isActive: boolean;
  }>({
    id: null,
    isActive: false,
  });
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "rent",
    rentPrice: "",
    sellPrice: "",
    description: "",
    size: "",
    occasion: "",
    photos: [] as File[],
    phoneNumber: "",
    city: "",
  });

  useEffect(() => {
    const user = getSessionUser();
    if (!user) {
      setStoreLoading(false);
      return;
    }

    void getStoreByUserId(user.id)
      .then((store) =>
        setStoreState({
          id: store.id,
          isActive: store.active,
        }),
      )
      .catch(() => {
        // Fallback to local store detection
        const localStores = getLocalStores();
        if (localStores.length > 0) {
          setStoreState({
            id: localStores[0].id,
            isActive: true,
          });
        } else {
          setStoreState({
            id: null,
            isActive: false,
          });
        }
      })
      .finally(() => setStoreLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeToggle = (value: string) => {
    setForm({ ...form, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeState.id) {
      setError("Əvvəlcə hesabınız üçün mağaza yaradılmalıdır.");
      return;
    }

    if (!storeState.isActive) {
      setError("Mağazanız hələ aktiv deyil. Təsdiqdən sonra elan yerləşdirə biləcəksiniz.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const category = categoryMap[form.category] || "UNISEX";
      
      await createProduct(storeState.id, {
        name: form.title,
        description: form.description,
        price: Number(form.sellPrice || form.rentPrice || 0),
        dailyPrice: Number(form.rentPrice || form.sellPrice || 0),
        category: category,
        stockQuantity: 1,
        size: form.size || undefined,
        occasion: form.occasion || undefined,
        phoneNumber: form.phoneNumber || undefined,
        city: form.city || undefined,
      });

      setSubmitted(true);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Elan yaradılmadı."));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg">
          <CheckCircle className="mx-auto mb-6 text-[#8E6969]" size={56} strokeWidth={1.5} />
          <h2 className="text-2xl font-serif font-bold text-[#4A3728] mb-3">
            {t("create_listing.success_title")}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {t("create_listing.success_desc")}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-[#8E6969] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#725454] transition"
          >
            {t("create_listing.new_btn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F5]">
      <section className="bg-[#4A3728] text-white py-14 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide mb-3">
          {t("create_listing.hero_title")}
        </h1>
        <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
          {t("create_listing.hero_desc")}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-[#4A3728] font-serif font-bold text-xl flex items-center gap-2">
              <FileText size={20} className="text-[#A37A7A]" /> {t("create_listing.basic_info")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  {t("create_listing.title_label")}
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] focus:ring-1 focus:ring-[#8E6969] transition bg-gray-50"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  {t("create_listing.cat_label")}
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50 appearance-none pr-10"
                >
                  <option value="">{t("create_listing.select")}</option>
                  <option value="bridal">{t("create_listing.cat_1")}</option>
                  <option value="evening">{t("create_listing.cat_2")}</option>
                  <option value="mens">{t("create_listing.cat_3")}</option>
                  <option value="kids">{t("create_listing.cat_4")}</option>
                  <option value="none">{t("create_listing.cat_none")}</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-10 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Ölçü
                </label>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50 appearance-none pr-10"
                >
                  <option value="">Seçin</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-10 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Münasibət
                </label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50 appearance-none pr-10"
                >
                  <option value="">Seçin</option>
                  <option value="Toy">Toy</option>
                  <option value="Ziyafət">Ziyafət</option>
                  <option value="Nişan">Nişan</option>
                  <option value="Məzuniyyət">Məzuniyyət</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-10 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  {t("create_listing.phone_label")}
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+994"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  {t("create_listing.city_label")}
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50 appearance-none pr-10"
                >
                  <option value="">Seçin</option>
                  <option value="Bakı">Bakı</option>
                  <option value="Sumqayıt">Sumqayıt</option>
                  <option value="Gəncə">Gəncə</option>
                  <option value="Digər">Digər</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-10 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-[#4A3728] font-serif font-bold text-xl flex items-center gap-2">
              <DollarSign size={20} className="text-[#A37A7A]" /> Qiymət və Elan Növü
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                Elan Növü
              </label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { val: "rent", label: "Kirayə" },
                  { val: "sell", label: "Satış" },
                  { val: "both", label: "Kirayə + Satış" },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.val}
                    onClick={() => handleTypeToggle(option.val)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition border ${
                      form.type === option.val
                        ? "bg-[#8E6969] text-white border-[#8E6969]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#8E6969]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(form.type === "rent" || form.type === "both") && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Kirayə Qiyməti (AZN)
                  </label>
                  <input
                    type="number"
                    name="rentPrice"
                    value={form.rentPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                  />
                </div>
              )}
              {(form.type === "sell" || form.type === "both") && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Satış Qiyməti (AZN)
                  </label>
                  <input
                    type="number"
                    name="sellPrice"
                    value={form.sellPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-[#4A3728] font-serif font-bold text-xl flex items-center gap-2">
              <Tag size={20} className="text-[#A37A7A]" /> Ətraflı Məlumat
            </h2>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] focus:ring-1 focus:ring-[#8E6969] transition bg-gray-50 resize-none"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-4">
            <h2 className="text-[#4A3728] font-serif font-bold text-xl flex items-center gap-2">
              <Camera size={20} className="text-[#A37A7A]" /> Şəkillər
            </h2>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#A37A7A]/40 rounded-xl cursor-not-allowed bg-[#FAF7F5] transition opacity-80">
              <Camera size={32} className="text-[#A37A7A] mb-2" strokeWidth={1.5} />
              <span className="text-sm font-medium text-[#8E6969]">
                Şəkil yükləmə tezliklə aktiv olacaq
              </span>
              <span className="mt-2 text-xs text-stone-400">
                Hazırkı backend kontraktında şəkil upload endpointi görünmür
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled
                onChange={() => undefined}
              />
            </label>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="bg-[#4A3728]/5 border border-[#4A3728]/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
              {storeLoading
                ? "Mağaza məlumatları yoxlanılır..."
                : storeState.id
                  ? storeState.isActive
                    ? "Mağazanız aktivdir. Elan birbaşa backend-ə göndəriləcək."
                    : "Mağazanız yaradılıb, amma hələ aktiv deyil. Təsdiqdən sonra elan yerləşdirə biləcəksiniz."
                  : "Bu bölmədən yalnız mağaza sahibləri istifadə edə bilər."}
            </p>
            <button
              type="submit"
              disabled={submitting || storeLoading}
              className="shrink-0 bg-[#8E6969] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#725454] transition-all duration-300 shadow-lg disabled:opacity-60"
            >
              {submitting ? "Göndərilir..." : t("create_listing.submit")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateListingPage;
