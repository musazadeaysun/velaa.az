
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Settings, 
  LayoutDashboard,
  Calendar,
  Tag,
  Phone
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSessionUser } from "@/lib/api/session";
import { fetchProducts, deleteLocalProduct, getProductHref } from "@/lib/products";
import type { Product } from "@/app/(main)/collections/productSlice";

const UserDashboard = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = getSessionUser();
    setUser(session);
    
    const loadData = async () => {
      try {
        const allProducts = await fetchProducts();
        // Filtr: Yalnız bu istifadəçiyə aid olanlar (Local olanlar və ya mağazası varsa storeId ilə)
        // Sadəlik üçün hələlik bütün Local elanları göstəririk (çünki login məcburi deyildi)
        // Və store sahibidirsə store elanlarını
        const myProducts = allProducts.filter(p => p.isLocal || (session && p.storeId > 0)); 
        setProducts(myProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    void loadData();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("Bu elanı silmək istədiyinizə əminsiniz?")) {
      deleteLocalProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F5] pb-20">
      {/* Header Section */}
      <section className="bg-[#4A3728] text-white pt-16 pb-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8E6969] rounded-full flex items-center justify-center text-2xl font-bold shadow-xl border-2 border-white/20">
              {user?.username?.charAt(0).toUpperCase() || "V"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">
                {user?.username || "Xoş Gəlmisiniz"}
              </h1>
              <p className="text-gray-300 text-sm mt-1 flex items-center gap-2">
                <LayoutDashboard size={14} /> My Personal Dashboard
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/create-listing"
              className="bg-[#8E6969] hover:bg-[#725454] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-lg flex items-center gap-2"
            >
              <Plus size={16} /> Yeni Elan
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#8E6969] mb-4">Statistika</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm italic">Cəmi Elanlar</span>
                  <span className="font-bold text-lg">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm italic">Aktiv Elanlar</span>
                  <span className="font-bold text-lg text-green-600">{products.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
              <Link href="/user" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition text-gray-700 text-sm font-medium">
                <Settings size={18} className="text-gray-400" /> Profil Parametrləri
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition text-gray-700 text-sm font-medium border-t border-gray-50">
                <Package size={18} className="text-gray-400" /> Bəyəndiklərim
              </Link>
            </div>
          </div>

          {/* Listings List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 min-h-[500px]">
              <h2 className="text-[#4A3728] font-serif font-bold text-2xl mb-8 flex items-center gap-3">
                <Package className="text-[#A37A7A]" /> Mənim Elanlarım
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                  <div className="w-12 h-12 border-4 border-[#8E6969] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 text-sm italic">Elanlar yüklənir...</p>
                </div>
              ) : products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="group flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl border border-gray-50 hover:border-[#8E6969]/20 hover:bg-[#FAF7F5]/50 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative w-full md:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                        <Image 
                          src={product.image} 
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-between">
                          <h3 className="font-bold text-gray-800 group-hover:text-[#8E6969] transition">
                            {product.name}
                          </h3>
                          <span className="text-[10px] bg-stone-100 text-stone-500 px-3 py-1 rounded-full uppercase font-bold tracking-widest w-fit mx-auto md:mx-0">
                            ID: {product.id}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1.5"><Tag size={12} /> {product.category}</span>
                          <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(product.createdAt!).toLocaleDateString('az-AZ')}</span>
                          {product.phoneNumber && (
                            <span className="flex items-center gap-1.5 text-[#8E6969] font-bold">
                              <Phone size={12} /> {product.phoneNumber}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-6 mt-3">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-stone-400 tracking-tighter">Rent</span>
                            <span className="font-black text-[#8E6969]">{product.rentPrice} AZN</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-stone-400 tracking-tighter">Sell</span>
                            <span className="font-black text-gray-800">{product.sellPrice || product.price} AZN</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Link 
                          href={getProductHref(product)}
                          target="_blank"
                          className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#8E6969] hover:border-[#8E6969]/30 transition shadow-sm"
                          title="Bax"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/edit-listing/${product.id}`}
                          className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-500 hover:border-blue-200 transition shadow-sm"
                          title="Redaktə et"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 transition shadow-sm"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package className="text-stone-100 mb-4" size={80} />
                  <p className="text-gray-500 font-serif italic mb-6">Hələ heç bir elanınız yoxdur.</p>
                  <Link 
                    href="/create-listing"
                    className="bg-[#8E6969] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#725454] transition"
                  >
                    İlk Elanı Yarat
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default UserDashboard;
