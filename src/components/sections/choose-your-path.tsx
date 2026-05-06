"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) {
    return <CheckCircle className="w-5 h-5 text-[#16A34A] mx-auto" />;
  }
  if (val === false) {
    return <XCircle className="w-5 h-5 text-red-400 mx-auto" />;
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
      {val}
    </span>
  );
}

const ChooseYourPath = () => {
  const { t } = useI18n();

  const COMPARISON = [
    {
      feature: t.choosePath.setupTime,
      prolify: t.choosePath.setupTimeProlify,
      diy: t.choosePath.setupTimeDiy,
      vendors: t.choosePath.setupTimeVendors,
    },
    {
      feature: t.choosePath.totalCost,
      prolify: t.choosePath.totalCostProlify,
      diy: t.choosePath.totalCostDiy,
      vendors: t.choosePath.totalCostVendors,
    },
    {
      feature: t.choosePath.formation,
      prolify: true,
      diy: t.choosePath.formationDiy,
      vendors: true,
    },
    {
      feature: t.choosePath.bankingSetup,
      prolify: true,
      diy: false,
      vendors: t.choosePath.bankingVendors,
    },
    {
      feature: t.choosePath.bookkeeping,
      prolify: true,
      diy: false,
      vendors: t.choosePath.bookkeepingVendors,
    },
    {
      feature: t.choosePath.taxFiling,
      prolify: true,
      diy: t.choosePath.taxFilingDiy,
      vendors: t.choosePath.taxFilingVendors,
    },
    {
      feature: t.choosePath.compliance,
      prolify: true,
      diy: false,
      vendors: t.choosePath.complianceDiy,
    },
    {
      feature: t.choosePath.singleDashboard,
      prolify: true,
      diy: false,
      vendors: false,
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,193,7,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            {t.choosePath.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            {t.choosePath.title}
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            {t.choosePath.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-black/8 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8">
                <th className="py-4 px-5 text-left text-xs font-bold uppercase tracking-widest text-black/40 w-[30%]">
                  {t.choosePath.featureCol}
                </th>
                <th className="py-4 px-5 text-center bg-black text-xs font-bold uppercase tracking-widest text-[#FFC107] w-[23%]">
                  {t.choosePath.prolifyCol}
                </th>
                <th className="py-4 px-5 text-center text-xs font-bold uppercase tracking-widest text-black/40 w-[23%]">
                  {t.choosePath.diyCol}
                </th>
                <th className="py-4 px-5 text-center text-xs font-bold uppercase tracking-widest text-black/40 w-[24%]">
                  {t.choosePath.multipleVendors}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-black/6 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
                >
                  <td className="py-4 px-5 font-semibold text-black/70">{row.feature}</td>
                  <td className="py-4 px-5 text-center bg-black/[0.03] font-bold text-black">
                    {typeof row.prolify === "boolean" ? (
                      <CellValue val={row.prolify} />
                    ) : (
                      <span className="text-xs font-bold text-black bg-[#FFC107] px-2 py-0.5 rounded-full">
                        {row.prolify}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <CellValue val={row.diy} />
                  </td>
                  <td className="py-4 px-5 text-center">
                    <CellValue val={row.vendors} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-2xl bg-black text-white font-bold text-sm tracking-tight overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <span className="absolute inset-0 bg-[#FFC107] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">{t.choosePath.chooseProlify}</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-2xl border-2 border-black/10 text-black/70 font-bold text-sm hover:border-black hover:text-black transition-all duration-200"
          >
            {t.choosePath.comparePlans}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChooseYourPath;
