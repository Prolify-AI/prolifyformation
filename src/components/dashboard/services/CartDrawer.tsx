"use client";

import { X, Trash2, ShoppingCart, ArrowRight, Loader as Loader2 } from "lucide-react";
import type { Service } from "@/lib/services-catalog";

interface CartDrawerProps {
  open: boolean;
  items: Service[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onCheckout: () => void;
  loading: boolean;
}

export default function CartDrawer({ open, items, onRemove, onClose, onCheckout, loading }: CartDrawerProps) {
  const total = items.reduce((sum, s) => sum + s.price, 0);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-[#0a0a0a] border-l border-black/8 dark:border-white/8 shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 dark:border-white/8">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-black dark:text-white" />
            <h2 className="font-bold text-black dark:text-white text-base">
              Cart
            </h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-[#FFC107] text-black text-xs font-black rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/8 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-black/50 dark:text-white/50" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-black/30 dark:text-white/30" />
              </div>
              <p className="text-sm font-semibold text-black/40 dark:text-white/40">
                Your cart is empty
              </p>
              <p className="text-xs text-black/30 dark:text-white/30">
                Add services to get started
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/5">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black dark:text-white leading-tight mb-0.5">
                      {item.name}
                    </p>
                    <p className="text-xs text-black/40 dark:text-white/40">
                      {item.categoryLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-black text-black dark:text-white">
                      ${item.price}
                    </span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="w-6 h-6 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-black/30 dark:text-white/30 hover:text-red-500" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-black/8 dark:border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-black/60 dark:text-white/60">
                Subtotal ({items.length} service{items.length > 1 ? "s" : ""})
              </span>
              <span className="text-xl font-black text-black dark:text-white">
                ${total}
              </span>
            </div>
            <p className="text-xs text-black/40 dark:text-white/40">
              State filing fees may apply at checkout
            </p>
            <button
              onClick={onCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFC107] hover:bg-[#FFB300] disabled:bg-[#FFC107]/50 text-black font-bold rounded-xl text-sm transition-all shadow-md shadow-[#FFC107]/20"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
