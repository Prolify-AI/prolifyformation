"use client";

import { useState } from "react";
import {
  X,
  Search,
  Building2,
  MapPin,
  Users,
  Shield,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usStates } from "@/lib/us-states";

interface AddExistingCompanyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ENTITY_TYPES = [
  "LLC (Limited Liability Company)",
  "Corporation (C-Corp)",
  "S-Corporation (S-Corp)",
  "Partnership",
  "Sole Proprietorship",
  "Non-Profit",
  "Professional LLC (PLLC)",
  "Limited Partnership (LP)",
];

const STEPS = [
  { id: 1, label: "Find Company", icon: Search, description: "Lookup my company information." },
  { id: 2, label: "Entity Information", icon: Building2, description: "Provide information about your entity." },
  { id: 3, label: "Business Address", icon: MapPin, description: "Where is your principal place of business?" },
  { id: 4, label: "Controlling Officers", icon: Users, description: "Who is authorized to manage and control this entity?" },
  { id: 5, label: "Registered Agent", icon: Shield, description: "Would you like to enroll in registered agent service?" },
  { id: 6, label: "Review & Submit", icon: ClipboardCheck, description: "Review all information and submit." },
];

type FormData = {
  formation_state: string;
  entity_type: string;
  company_name: string;
  ein: string;
  formation_date: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  officer_first_name: string;
  officer_last_name: string;
  officer_title: string;
  officer_email: string;
  registered_agent: string;
  registered_agent_address: string;
};

export default function AddExistingCompanyModal({ onClose, onSuccess }: AddExistingCompanyModalProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    formation_state: "",
    entity_type: "",
    company_name: "",
    ein: "",
    formation_date: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    officer_first_name: "",
    officer_last_name: "",
    officer_title: "",
    officer_email: "",
    registered_agent: "",
    registered_agent_address: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.formation_state && formData.entity_type && formData.company_name;
    if (currentStep === 2) return formData.ein || formData.formation_date;
    if (currentStep === 3) return formData.street && formData.city && formData.state && formData.zip;
    if (currentStep === 4) return formData.officer_first_name && formData.officer_last_name;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await supabase.from("user_companies").insert({
        user_id: user.id,
        name: formData.company_name,
        entity_type: formData.entity_type,
        formation_state: formData.formation_state,
        ein: formData.ein || null,
        formation_date: formData.formation_date || null,
        address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`.trim(),
        officer_first_name: formData.officer_first_name,
        officer_last_name: formData.officer_last_name,
        officer_title: formData.officer_title || null,
        officer_email: formData.officer_email || null,
        registered_agent: formData.registered_agent || null,
      });

      onSuccess();
    } catch (err) {
      console.error("Error saving company:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="w-full md:w-72 bg-[#f5f5f0] dark:bg-[#1a1a1a] p-6 flex-shrink-0">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add an existing company</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an existing company to your account</p>
          </div>

          <div className="space-y-1">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-start gap-3 py-2">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                        isCompleted
                          ? "bg-[#FFC107] text-black"
                          : isCurrent
                          ? "bg-black dark:bg-white text-white dark:text-black border-2 border-[#FFC107]"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.id}
                    </div>
                    {step.id < STEPS.length && (
                      <div className={`w-0.5 h-6 mt-1 ${isCompleted ? "bg-[#FFC107]" : "bg-gray-200 dark:bg-gray-700"}`} />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-gray-900 dark:text-white" : isCompleted ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Find Company</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Lookup my company information.</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State of formation</label>
                      <Select value={formData.formation_state} onValueChange={(v) => update("formation_state", v)}>
                        <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {usStates.map((s) => (
                            <SelectItem key={s.code} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Entity type</label>
                      <Select value={formData.entity_type} onValueChange={(v) => update("entity_type", v)}>
                        <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]">
                          <SelectValue placeholder="Select an entity type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ENTITY_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company name</label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => update("company_name", e.target.value)}
                      placeholder="Acme"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Entity Information</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Provide information about your entity.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">EIN (Employer Identification Number)</label>
                    <Input
                      value={formData.ein}
                      onChange={(e) => update("ein", e.target.value)}
                      placeholder="XX-XXXXXXX"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of formation</label>
                    <Input
                      type="date"
                      value={formData.formation_date}
                      onChange={(e) => update("formation_date", e.target.value)}
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Business Address</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Where is your principal place of business?</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street address</label>
                    <Input
                      value={formData.street}
                      onChange={(e) => update("street", e.target.value)}
                      placeholder="123 Main Street"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="New York"
                        className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State</label>
                      <Select value={formData.state} onValueChange={(v) => update("state", v)}>
                        <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {usStates.map((s) => (
                            <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ZIP code</label>
                    <Input
                      value={formData.zip}
                      onChange={(e) => update("zip", e.target.value)}
                      placeholder="10001"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Controlling Officers</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Who is authorized to manage and control this entity?</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First name</label>
                      <Input
                        value={formData.officer_first_name}
                        onChange={(e) => update("officer_first_name", e.target.value)}
                        placeholder="John"
                        className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last name</label>
                      <Input
                        value={formData.officer_last_name}
                        onChange={(e) => update("officer_last_name", e.target.value)}
                        placeholder="Doe"
                        className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title / Role</label>
                    <Input
                      value={formData.officer_title}
                      onChange={(e) => update("officer_title", e.target.value)}
                      placeholder="CEO, Manager, President..."
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.officer_email}
                      onChange={(e) => update("officer_email", e.target.value)}
                      placeholder="john@company.com"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Registered Agent</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Would you like to enroll in registered agent service?</p>
                <div className="space-y-5">
                  <div
                    className="p-5 rounded-xl border-2 border-[#FFC107] bg-[#FFC107]/5 cursor-pointer"
                    onClick={() => update("registered_agent", "Prolify Registered Agent Service")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.registered_agent === "Prolify Registered Agent Service" ? "border-[#FFC107] bg-[#FFC107]" : "border-gray-300"}`}>
                        {formData.registered_agent === "Prolify Registered Agent Service" && <Check className="h-3 w-3 text-black" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Yes, use Prolify as my Registered Agent</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">We handle all legal mail and compliance notices.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Or enter your own registered agent</label>
                    <Input
                      value={formData.registered_agent === "Prolify Registered Agent Service" ? "" : formData.registered_agent}
                      onChange={(e) => update("registered_agent", e.target.value)}
                      placeholder="Registered Agent Name or Company"
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Review & Submit</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Review all information and submit.</p>
                <div className="space-y-4">
                  {[
                    { label: "Company Name", value: formData.company_name },
                    { label: "Entity Type", value: formData.entity_type },
                    { label: "Formation State", value: formData.formation_state },
                    { label: "EIN", value: formData.ein || "Not provided" },
                    { label: "Address", value: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}` },
                    { label: "Officer", value: `${formData.officer_first_name} ${formData.officer_last_name} ${formData.officer_title ? `(${formData.officer_title})` : ""}`.trim() },
                    { label: "Registered Agent", value: formData.registered_agent || "Not specified" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-36 flex-shrink-0">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <Button
                onClick={() => setCurrentStep((s) => s - 1)}
                variant="outline"
                className="border-2 border-gray-200 dark:border-gray-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length ? (
              <Button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canProceed()}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-6"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold px-8"
              >
                {submitting ? "Submitting..." : "Submit"}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
