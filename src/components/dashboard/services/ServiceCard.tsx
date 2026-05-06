"use client";

import { ShoppingCart, Check, RefreshCw, Star } from "lucide-react";
import type { Service } from "@/lib/services-catalog";

interface ServiceCardProps {
  service: Service;
  inCart: boolean;
  onToggleCart: (service: Service) => void;
}

export default function ServiceCard({ service, inCart, onToggleCart }: ServiceCardProps) {
  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
        inCart
          ? "border-[#FFC107] bg-[#FFC107]/5 dark:bg-[#FFC107]/8 shadow-md shadow-[#FFC107]/10"
          : "border-black/8 dark:border-white/8 bg-white dark:bg-[#111] hover:border-[#FFC107]/40 hover:shadow-sm"
      }`}
    >
      {service.popular && (
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#FFC107] text-black text-[9px] font-bold rounded-full">
            <Star className="h-2 w-2" strokeWidth={3} />
            Popular
          </span>
        </div>
      )}

      <div className="p-3 flex-1">
        <h3 className="font-bold text-black dark:text-white text-xs leading-tight mb-1.5 pr-10">
          {service.name}
        </h3>
        <p className="text-[11px] text-black/50 dark:text-white/50 leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>

      <div className="px-3 pb-3 flex items-center justify-between gap-2">
        <div>
          <span className="text-base font-black text-black dark:text-white">
            ${service.price}
          </span>
          {service.recurring && (
            <span className="text-[10px] text-black/40 dark:text-white/40 ml-1 flex items-center gap-0.5 inline-flex">
              <RefreshCw className="h-2 w-2" />
              {service.recurringLabel}
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleCart(service)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all duration-150 whitespace-nowrap ${
            inCart
              ? "bg-[#FFC107] text-black hover:bg-[#FFB300]"
              : "bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80"
          }`}
        >
          {inCart ? (
            <>
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-2.5 w-2.5" />
              Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
