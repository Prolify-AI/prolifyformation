"use client";

import { useEffect, useState } from "react";
import {
  X,
  Briefcase,
  Plus,
  FileText,
  Shield,
  Building2,
  Award,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GetStartedModalProps {
  userName: string;
  onClose: () => void;
  onAction: (action: string) => void;
}

const actions = [
  {
    id: "form-company",
    icon: Briefcase,
    label: "Form a New Company",
    buttonText: "Get Started",
  },
  {
    id: "add-company",
    icon: Plus,
    label: "Add an Existing Company",
    buttonText: "Add Company",
  },
  {
    id: "annual-report",
    icon: FileText,
    label: "Stay Compliant - File Your Annual Report",
    buttonText: "File Now",
  },
  {
    id: "registered-agent",
    icon: Shield,
    label: "Manage Registered Agent",
    buttonText: "Manage Now",
  },
  {
    id: "ein",
    icon: Building2,
    label: "Request an EIN",
    buttonText: "Get Your EIN",
  },
  {
    id: "good-standing",
    icon: Award,
    label: "Certificate of Good Standing",
    buttonText: "Get Certificate",
  },
];

export default function GetStartedModal({ userName, onClose, onAction }: GetStartedModalProps) {
  const [phase, setPhase] = useState<"welcome" | "tabs">("welcome");

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

      <div className="relative bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-lg mx-auto animate-in zoom-in-95 fade-in duration-200 overflow-hidden border border-black/8 dark:border-white/8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/12 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4 text-black/50 dark:text-white/50" />
        </button>

        {phase === "welcome" ? (
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
              Your account is ready. Let's set up your business and get you on the path to success.
            </p>

            <Button
              onClick={() => setPhase("tabs")}
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-10 py-6 rounded-xl shadow-lg shadow-[#FFC107]/20 hover:shadow-xl transition-all text-base"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

           
          </div>
        ) : (
          <>
            <div className="px-6 pt-8 pb-4">
              <h2
                id="get-started-title"
                className="text-2xl font-bold text-black dark:text-white text-center"
              >
                Hi <span className="text-[#FFC107]">{firstName}</span>
                {", what would you like to do today?"}
              </h2>
            </div>

            <div className="px-6 pb-4 space-y-2.5 max-h-[55vh] overflow-y-auto">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
  key={action.id}
  onClick={() => onAction(action.id)}
  className="w-full flex items-center gap-4 bg-[#FFC107] hover:bg-[#FFB300] active:bg-[#FFA000] rounded-xl px-4 py-4 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
  aria-label={action.label}
>
  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-black/20 flex items-center justify-center">
    <Icon className="h-5 w-5 text-black" />
  </div>
  <span className="flex-1 font-semibold text-black text-sm leading-tight">
    {action.label}
  </span>
  <span className="flex-shrink-0 px-4 py-2 bg-black rounded-lg text-white font-bold text-xs whitespace-nowrap">
    {action.buttonText}
  </span>
</button>
                );
              })}
            </div>

            <div className="px-6 pb-8 pt-2">
              <div className="border-t border-black/8 dark:border-white/8 pt-5 flex flex-col items-center gap-3">
                <p className="text-sm font-semibold text-black/60 dark:text-white/60">Need help?</p>
                <Button
                  onClick={() => onAction("chat")}
                  className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-8 py-2.5 rounded-xl shadow-md shadow-[#FFC107]/20 hover:shadow-lg transition-all"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Us
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
