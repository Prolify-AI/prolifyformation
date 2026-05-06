"use client";

import { useEffect, useState } from "react";
import { X, Briefcase, Plus, Building2, ArrowRight, Sparkles, CircleCheck as CheckCircle, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GetStartedModalProps {
  userName: string;
  onClose: () => void;
  onAction: (action: string) => void;
}

type Phase = "welcome" | "company-check";

export default function GetStartedModal({ userName, onClose, onAction }: GetStartedModalProps) {
  const [phase, setPhase] = useState<Phase>("welcome");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const firstName = userName.split(" ")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-started-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-in zoom-in-95 fade-in duration-200 overflow-hidden border border-black/8 dark:border-white/8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/12 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4 text-black/50 dark:text-white/50" />
        </button>

        {phase === "welcome" && (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC107] flex items-center justify-center mb-6 shadow-lg shadow-[#FFC107]/30">
              <Sparkles className="h-8 w-8 text-black" />
            </div>

            <h2
              id="get-started-title"
              className="text-3xl font-black text-black dark:text-white mb-3"
            >
              Welcome,{" "}
              <span className="text-[#FFC107]">{firstName}</span>!
            </h2>

            <p className="text-black/50 dark:text-white/50 text-base mb-8 max-w-sm">
              Your account is ready. Let's get your business set up in just a few seconds.
            </p>

            <Button
              onClick={() => setPhase("company-check")}
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-10 py-6 rounded-xl shadow-lg shadow-[#FFC107]/20 hover:shadow-xl transition-all text-base"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {phase === "company-check" && (
          <div className="flex flex-col px-8 py-10">
            <h2
              id="get-started-title"
              className="text-2xl font-black text-black dark:text-white text-center mb-2"
            >
              Do you already have a company?
            </h2>
            <p className="text-center text-sm text-black/50 dark:text-white/50 mb-8">
              We'll guide you to the right place based on your situation.
            </p>

            <div className="space-y-3">
              {/* Yes — existing company */}
              <button
                onClick={() => onAction("add-company")}
                className="w-full group flex items-center gap-4 p-5 rounded-xl border-2 border-black/8 dark:border-white/8 bg-white dark:bg-[#111] hover:border-[#FFC107] hover:bg-[#FFC107]/5 transition-all duration-150 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFC107]/15 group-hover:bg-[#FFC107]/25 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Building2 className="h-6 w-6 text-[#FFC107]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black dark:text-white text-sm">
                    Yes, I already have a company
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                    Add your existing company to manage it here
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-[#FFC107] opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
              </button>

              {/* No — form new company */}
              <button
                onClick={() => onAction("form-company")}
                className="w-full group flex items-center gap-4 p-5 rounded-xl border-2 border-black/8 dark:border-white/8 bg-white dark:bg-[#111] hover:border-[#FFC107] hover:bg-[#FFC107]/5 transition-all duration-150 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFC107]/15 group-hover:bg-[#FFC107]/25 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Briefcase className="h-6 w-6 text-[#FFC107]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black dark:text-white text-sm">
                    No, I want to form a new company
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                    Start the formation process from scratch
                  </p>
                </div>
                <CircleDashed className="h-5 w-5 text-[#FFC107] opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
              </button>

              {/* Skip for now */}
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 transition-colors py-2 font-medium"
              >
                I'll do this later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
