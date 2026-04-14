"use client";

import React, { useEffect, useState } from "react";
import { Trash2, ExternalLink, MapPin, Mail, Phone } from "lucide-react";
import { fetchStores, Store, deleteLocalStore } from "@/lib/stores";
import { approveStore, rejectStore } from "@/lib/api/client";
import Image from "next/image";
import Link from "next/link";

interface StoreTableProps {
  searchTerm: string;
}

const StoreTable: React.FC<StoreTableProps> = ({ searchTerm }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchStores();
    setStores(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("Bu mağazanı və bütün məhsullarını silmək istədiyinizə əminsiniz?")) {
      deleteLocalStore(id);
      void loadData();
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveStore(id);
      alert("Mağaza təsdiqləndi.");
      void loadData();
    } catch (err) {
      alert("Xəta baş verdi.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectStore(id);
      alert("Mağaza ləğv edildi.");
      void loadData();
    } catch (err) {
      alert("Xəta baş verdi.");
    }
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 font-bold text-gray-700 text-[11px] uppercase tracking-wider">Mağaza</th>
              <th className="text-left py-4 px-6 font-bold text-gray-700 text-[11px] uppercase tracking-wider">Əlaqə</th>
              <th className="text-left py-4 px-6 font-bold text-gray-700 text-[11px] uppercase tracking-wider">Ünvan</th>
              <th className="text-center py-4 px-6 font-bold text-gray-700 text-[11px] uppercase tracking-wider">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic">Yüklənir...</td></tr>
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image 
                          src={store.logoUrl || "https://images.unsplash.com/photo-1541013517358-397d16739665?auto=format&fit=crop&w=100&h=100"} 
                          alt={store.name}
                          fill
                          className="object-cover p-1"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{store.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{store.isLocal ? "Lokal" : "API"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 italic text-sm text-gray-500">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2"><Mail size={12} strokeWidth={3} className="text-[#8E6969]" /> {store.email}</div>
                      <div className="flex items-center gap-2"><Phone size={12} strokeWidth={3} className="text-[#8E6969]" /> {store.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-gray-300" />
                       {store.address}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      {!store.active && !store.isLocal && (
                        <>
                          <button 
                            onClick={() => handleApprove(store.id)}
                            className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-green-600 hover:text-white transition"
                          >
                            Təsdiqlə
                          </button>
                          <button 
                            onClick={() => handleReject(store.id)}
                            className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-600 hover:text-white transition"
                          >
                            Ləğv et
                          </button>
                        </>
                      )}
                      <Link href={`/stores/${store.id}`} target="_blank">
                        <button className="p-2.5 hover:bg-[#FAF7F5] rounded-xl transition text-stone-400 hover:text-[#8E6969]">
                          <ExternalLink size={18} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(store.id)}
                        className="p-2.5 hover:bg-red-50 rounded-xl transition text-stone-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic text-sm">Mağaza tapılmadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreTable;
