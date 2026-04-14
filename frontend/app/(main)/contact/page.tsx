"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CiMail } from "react-icons/ci";
import { BsTelephoneInbound } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useLanguage } from "@/context/LanguageContext";

const Page = () => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="relative w-[95%] max-w-6xl shadow-2xl mx-auto my-10 rounded-xl p-8 bg-white border border-stone-50">
      <div
        className="text-[28px] absolute right-6 top-6 cursor-pointer hover:text-[#8E6969] transition"
        onClick={() => router.push("/")}
      >
        <IoMdClose />
      </div>
      
      <div className="flex flex-col items-center justify-center text-center space-y-10 py-10">
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-[32px] md:text-[45px] font-serif font-bold text-[#4A3728]">
            {t("contact.title")}
          </h2>

          <p className="text-[17px] text-gray-600 leading-relaxed">
            {t("contact.teklif_irad")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <a
            href="mailto:vela7az@gmail.com"
            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[#FAF7F5] border border-stone-100 hover:border-[#8E6969] transition group shadow-sm"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#8E6969] shadow-inner group-hover:scale-110 transition">
              <CiMail size={28} />
            </div>
            <p className="font-bold text-lg text-gray-800 tracking-tight">vela7az@gmail.com</p>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold whitespace-nowrap">
              E-poçt vasitəsilə yazın
            </span>
          </a>

          <a
            href="tel:+994771279759"
            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[#FAF7F5] border border-stone-100 hover:border-[#8E6969] transition group shadow-sm"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#8E6969] shadow-inner group-hover:scale-110 transition">
              <BsTelephoneInbound size={24} />
            </div>
            <p className="font-bold text-lg text-gray-800 tracking-tight">+994 77 127 97 59</p>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold whitespace-nowrap">
              Zəng edin və ya WhatsApp
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
