"use client";

import React from "react";
import { Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SellerAgreementPage = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-[#4A3728] text-white py-20 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-widest mb-4 uppercase">
          {t("seller_agreement.title")}
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto font-sans leading-relaxed">
          {t("seller_agreement.desc")}
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto py-16 px-6 lg:px-0">
        <div className="space-y-12 font-sans text-gray-800 leading-relaxed">

          {/* Giriş */}
          <div className="bg-[#FAF7F5] border border-[#F2EBE6] p-8 rounded-2xl">
            <p className="text-gray-700">
              {t("seller_agreement.intro")}
            </p>
          </div>

          {/* 1. XİDMƏTİN MAHİYYƏTİ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">01.</span> {t("seller_agreement.s1_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>1.1.</strong> {t("seller_agreement.s1_1")}</p>
              <p><strong>1.2.</strong> {t("seller_agreement.s1_2")}</p>
              <p><strong>1.3.</strong> {t("seller_agreement.s1_3")}</p>
              <p><strong>1.4.</strong> {t("seller_agreement.s1_4")}</p>
            </div>
          </div>

          {/* 2. SATICININ HÜQUQ VƏ ÖHDƏLİKLƏRİ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">02.</span> {t("seller_agreement.s2_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>2.1.</strong> {t("seller_agreement.s2_1")}</p>
              <p><strong>2.2.</strong> {t("seller_agreement.s2_2")}</p>
              <p><strong>2.3.</strong> {t("seller_agreement.s2_3")}</p>
              <p><strong>2.4.</strong> {t("seller_agreement.s2_4")}</p>
            </div>
          </div>

          {/* 3. QADAĞAN OLUNMUŞ FƏALİYYƏTLƏR */}
          <div className="bg-red-50 border border-red-100 p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-serif font-bold text-red-800 flex items-center gap-3">
              <span className="text-red-600">03.</span> {t("seller_agreement.s3_title")}
            </h2>
            <div className="pl-10 space-y-4 text-red-900/80">
              <div>
                <p className="font-semibold mb-2">{t("seller_agreement.s3_1_head")}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t("seller_agreement.s3_1_a")}</li>
                  <li>{t("seller_agreement.s3_1_b")}</li>
                  <li>{t("seller_agreement.s3_1_c")}</li>
                  <li>{t("seller_agreement.s3_1_d")}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">{t("seller_agreement.s3_2_head")}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t("seller_agreement.s3_2_a")}</li>
                  <li>{t("seller_agreement.s3_2_b")}</li>
                  <li>{t("seller_agreement.s3_2_c")}</li>
                </ul>
              </div>
              <p><strong>3.3.</strong> {t("seller_agreement.s3_3")}</p>
            </div>
          </div>

          {/* 4. MƏSULİYYƏTİN MƏHDUDLAŞDIRILMASI */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">04.</span> {t("seller_agreement.s4_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>4.1.</strong> {t("seller_agreement.s4_1")}</p>
              <p><strong>4.2.</strong> {t("seller_agreement.s4_2")}</p>
              <p><strong>4.3.</strong> {t("seller_agreement.s4_3")}</p>
              <p><strong>4.4.</strong> {t("seller_agreement.s4_4")}</p>
            </div>
          </div>

          {/* 5. PLATFORMANIN HÜQUQLARI */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">05.</span> {t("seller_agreement.s5_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>5.1.</strong> {t("seller_agreement.s5_1")}</p>
              <p><strong>5.2.</strong> {t("seller_agreement.s5_2")}</p>
              <p><strong>5.3.</strong> {t("seller_agreement.s5_3")}</p>
            </div>
          </div>

          {/* 6. MÜDDƏT VƏ LƏĞVETMƏ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">06.</span> {t("seller_agreement.s6_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>6.1.</strong> {t("seller_agreement.s6_1")}</p>
              <p><strong>6.2.</strong> {t("seller_agreement.s6_2")}</p>
              <p><strong>6.3.</strong> {t("seller_agreement.s6_3")}</p>
            </div>
          </div>

          {/* 7. MƏXFİLİK */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">07.</span> {t("seller_agreement.s7_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>7.1.</strong> {t("seller_agreement.s7_1")}</p>
              <p><strong>7.2.</strong> {t("seller_agreement.s7_2")}</p>
            </div>
          </div>

          {/* 8. ƏLAQƏ VƏ BİLDİRİŞLƏR */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#4A3728] flex items-center gap-3">
              <span className="text-[#A37A7A]">08.</span> {t("seller_agreement.s8_title")}
            </h2>
            <div className="pl-10 space-y-3 text-gray-700">
              <p><strong>8.1.</strong> {t("seller_agreement.s8_1")}</p>
              <p><strong>8.2.</strong> {t("seller_agreement.s8_2")}</p>
              <p className="flex items-center gap-2">
                <strong>8.3.</strong> {t("seller_agreement.s8_3_pre")}
                <Mail size={16} className="inline text-[#A37A7A]" />
                <a href="mailto:info@vela.az" className="text-[#A37A7A] hover:underline font-semibold">info@vela.az</a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 Vela.az – Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SellerAgreementPage;
