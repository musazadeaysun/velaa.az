
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Camera, Tag, DollarSign, FileText, ChevronDown, CheckCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchProductByIdentifier,
  updateLocalProduct,
} from "@/lib/products";
import Link from "next/link";

const categoryMap: Record<string, any> = {
  bridal: "WOMEN",
  evening: "WOMEN",
  mens: "MEN",
  kids: "KIDS",
  none: "UNISEX",
};

const EditListingPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "rent",
    rentPrice: "",
    sellPrice: "",
    description: "",
    size: "",
    occasion: "",
    phoneNumber: "",
    city: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductByIdentifier(productId);
        setForm({
          title: product.name,
          category: product.category.toLowerCase().includes("women") ? "evening" : "none", // Simplification
          type: product.rentPrice && product.sellPrice ? "both" : product.rentPrice ? "rent" : "sell",
          rentPrice: product.rentPrice.toString(),
          sellPrice: product.sellPrice.toString(),
          description: product.description || "",
          size: product.size || "",
          occasion: product.occasion || "",
          phoneNumber: product.phoneNumber || "",
          city: product.city || "",
        });
      } catch (err) {
        setError("Məhsul tapılmadı.");
      } finally {
        setLoading(false);
      }
    };
    void loadProduct();
  }, [productId]);

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
    setSubmitting(true);
    setError("");

    try {
      // Yeniləmə yalnız Lokal məhsullar üçün işləyir (Backend API update hələ yoxdur)
      updateLocalProduct(Number(productId), {
        name: form.title,
        description: form.description,
        rentPrice: Number(form.rentPrice || 0),
        sellPrice: Number(form.sellPrice || 0),
        price: Number(form.sellPrice || form.rentPrice || 0),
        size: form.size,
        occasion: form.occasion,
        phoneNumber: form.phoneNumber,
        city: form.city,
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2000);
    } catch (err) {
      setError("Xəta baş verdi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5]">
      <div className="w-10 h-10 border-4 border-[#8E6969] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg">
          <CheckCircle className="mx-auto mb-6 text-[#8E6969]" size={56} strokeWidth={1.5} />
          <h2 className="text-2xl font-serif font-bold text-[#4A3728] mb-3">
            Elan Yeniləndi!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Dəyişikliklər uğurla yadda saxlanıldı. Dashboard-a yönləndirilirsiniz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F5] pb-20">
      <section className="bg-[#4A3728] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/user/dashboard" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-serif font-bold tracking-wide">
            Elanı Redaktə Et
          </h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-[#4A3728] font-serif font-bold text-xl flex items-center gap-2">
              <FileText size={20} className="text-[#A37A7A]" /> Əsas Məlumatlar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Başlıq</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Kateqoriya</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50 appearance-none pr-10"
                >
                  <option value="evening">Ziyafət</option>
                  <option value="bridal">Gəlinlik</option>
                  <option value="mens">Kişi</option>
                  <option value="kids">Uşaq</option>
                  <option value="none">Digər</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-10 text-gray-400" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Ölçü</label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Telefon</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Şəhər</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50 appearance-none pr-10"
                >
                  <option value="Bakı">Bakı</option>
                  <option value="Sumqayıt">Sumqayıt</option>
                  <option value="Gəncə">Gəncə</option>
                  <option value="Digər">Digər</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-10 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-6">
            <h2 className="text-[#4A3728] font-serif font-bold text-xl flex items-center gap-2">
              <DollarSign size={20} className="text-[#A37A7A]" /> Qiymət Məlumatları
            </h2>
            
            <div className="flex gap-3 mb-4">
              {['rent', 'sell', 'both'].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleTypeToggle(val)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition ${form.type === val ? "bg-[#8E6969] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {val === 'rent' ? 'İcarə' : val === 'sell' ? 'Satış' : 'Hər ikisi'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(form.type === 'rent' || form.type === 'both') && (
                <input
                  type="number"
                  name="rentPrice"
                  value={form.rentPrice}
                  onChange={handleChange}
                  placeholder="İcarə qiyməti"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                />
              )}
              {(form.type === 'sell' || form.type === 'both') && (
                <input
                  type="number"
                  name="sellPrice"
                  value={form.sellPrice}
                  onChange={handleChange}
                  placeholder="Satış qiyməti"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E6969] bg-gray-50"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link 
              href="/user/dashboard"
              className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition"
            >
              Ləğv Et
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#8E6969] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-[#725454] transition disabled:opacity-50"
            >
              {submitting ? "Yadda saxlanır..." : "Dəyişiklikləri Yadda Saxla"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EditListingPage;
