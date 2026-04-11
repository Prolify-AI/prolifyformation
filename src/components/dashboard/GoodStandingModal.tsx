"use client";

import { useState } from "react";
import { ArrowLeft, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usStates } from "@/lib/us-states";

type Step =
  | "select-company"
  | "company-details"
  | "state-of-formation"
  | "delivery-options"
  | "review-submit";

const STEPS: { id: Step; label: string; desc: string }[] = [
  {
    id: "select-company",
    label: "Select Company",
    desc: "Which company needs a Certificate of Good Standing?",
  },
  {
    id: "company-details",
    label: "Company Details",
    desc: "Confirm the details of your company.",
  },
  {
    id: "state-of-formation",
    label: "State of Formation",
    desc: "In which state was your company formed?",
  },
  {
    id: "delivery-options",
    label: "Delivery Options",
    desc: "How would you like to receive your certificate?",
  },
  {
    id: "review-submit",
    label: "Review & Submit",
    desc: "Review all information and submit your request.",
  },
];

interface GoodStandingModalProps {
  open: boolean;
  onClose: () => void;
  companyName?: string;
}

export default function GoodStandingModal({
  open,
  onClose,
  companyName,
}: GoodStandingModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("select-company");
  const [selectedCompany, setSelectedCompany] = useState(companyName || "");
  const [formData, setFormData] = useState({
    entityName: companyName || "",
    entityType: "",
    formationState: "",
    deliveryMethod: "",
    expedited: false,
    email: "",
  });

  if (!open) return null;

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const update = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setCurrentStep("select-company");
    setSelectedCompany(companyName || "");
    setFormData({
      entityName: companyName || "",
      entityType: "",
      formationState: "",
      deliveryMethod: "",
      expedited: false,
      email: "",
    });
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "select-company":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select Company
              </h2>
              <p className="text-gray-500">
                Which company needs a Certificate of Good Standing?
              </p>
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-full h-12 border border-gray-300 rounded-lg">
                <SelectValue placeholder="Select an existing company" />
              </SelectTrigger>
              <SelectContent>
                {companyName && (
                  <SelectItem value={companyName}>{companyName}</SelectItem>
                )}
                <SelectItem value="new">+ Add a new company</SelectItem>
              </SelectContent>
            </Select>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 font-medium mb-1">
                What is a Certificate of Good Standing?
              </p>
              <p className="text-sm text-amber-700">
                A Certificate of Good Standing (also called a Certificate of
                Existence) is an official document from the state confirming your
                company is legally registered, has paid all fees, and is
                authorized to conduct business.
              </p>
            </div>
          </div>
        );

      case "company-details":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Company Details
              </h2>
              <p className="text-gray-500">
                Confirm the details of your company.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Legal Entity Name
                </Label>
                <Input
                  value={formData.entityName}
                  onChange={(e) => update("entityName", e.target.value)}
                  placeholder="Enter your company's legal name"
                  className="h-12"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Entity Type
                </Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(v) => update("entityType", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llc">
                      Limited Liability Company (LLC)
                    </SelectItem>
                    <SelectItem value="c-corp">C-Corporation</SelectItem>
                    <SelectItem value="s-corp">S-Corporation</SelectItem>
                    <SelectItem value="lp">Limited Partnership</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "state-of-formation":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                State of Formation
              </h2>
              <p className="text-gray-500">
                In which state was your company formed?
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Formation State
              </Label>
              <Select
                value={formData.formationState}
                onValueChange={(v) => update("formationState", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                The certificate will be requested from the Secretary of State in
                the state where your company was originally formed.
              </p>
            </div>
          </div>
        );

      case "delivery-options":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delivery Options
              </h2>
              <p className="text-gray-500">
                How would you like to receive your certificate?
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: "digital",
                  label: "Digital Copy (PDF)",
                  desc: "Delivered to your email within 3-5 business days",
                  price: "$75",
                },
                {
                  id: "mail",
                  label: "Physical Copy (Mailed)",
                  desc: "Mailed to your address within 7-10 business days",
                  price: "$99",
                },
                {
                  id: "both",
                  label: "Digital + Physical Copy",
                  desc: "Get both a digital and physical copy",
                  price: "$125",
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => update("deliveryMethod", option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    formData.deliveryMethod === option.id
                      ? "border-[#FFC107] bg-[#FFC107]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {option.desc}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {option.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => update("expedited", !formData.expedited)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  formData.expedited
                    ? "bg-[#FFC107] border-[#FFC107]"
                    : "border-gray-300"
                }`}
              >
                {formData.expedited && (
                  <Check className="h-3 w-3 text-black" strokeWidth={3} />
                )}
              </button>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Expedited Processing (+$50)
                </p>
                <p className="text-xs text-gray-500">
                  Receive your certificate 2x faster
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Email for Delivery
              </Label>
              <Input
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="your@email.com"
                type="email"
                className="h-12"
              />
            </div>
          </div>
        );

      case "review-submit": {
        const deliveryLabels: Record<string, string> = {
          digital: "Digital Copy (PDF)",
          mail: "Physical Copy (Mailed)",
          both: "Digital + Physical Copy",
        };
        const deliveryPrices: Record<string, number> = {
          digital: 75,
          mail: 99,
          both: 125,
        };
        const basePrice = deliveryPrices[formData.deliveryMethod] || 0;
        const expeditedFee = formData.expedited ? 50 : 0;
        const total = basePrice + expeditedFee;

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Review & Submit
              </h2>
              <p className="text-gray-500">
                Review all information and submit your request.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Company", value: formData.entityName },
                { label: "Entity Type", value: formData.entityType },
                {
                  label: "State of Formation",
                  value:
                    usStates.find((s) => s.code === formData.formationState)
                      ?.name || formData.formationState,
                },
                {
                  label: "Delivery Method",
                  value: deliveryLabels[formData.deliveryMethod] || "",
                },
                {
                  label: "Expedited",
                  value: formData.expedited ? "Yes (+$50)" : "No",
                },
                { label: "Email", value: formData.email },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {value || "\u2014"}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ${total}
                </span>
              </div>
              {formData.expedited && (
                <p className="text-xs text-gray-500 mt-1">
                  Includes $50 expedited processing fee
                </p>
              )}
            </div>
            <Button
              className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold h-12 rounded-lg text-base"
              onClick={handleClose}
            >
              Submit Request
            </Button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <button
          onClick={currentIndex === 0 ? handleClose : goPrev}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentIndex === 0 ? "Exit" : "Back"}
        </button>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[380px] flex-shrink-0 bg-amber-50 border-r border-amber-100 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">
              Certificate of
              <br />
              Good Standing
            </h1>
            <p className="text-sm text-gray-500">
              Request an official certificate for your business
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[26px] top-0 bottom-0 w-px bg-amber-200" />
            <div className="space-y-0">
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentIndex;
                return (
                  <div key={step.id} className="flex gap-4 pb-6 relative">
                    <div
                      className={`w-[52px] h-[52px] flex-shrink-0 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 ${
                        isActive
                          ? "border-[#FFC107] bg-white text-[#D4A200]"
                          : isCompleted
                            ? "border-[#FFC107] bg-[#FFC107] text-black"
                            : "border-amber-200 bg-white text-amber-300"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-semibold leading-tight ${isActive ? "text-gray-900" : isCompleted ? "text-[#D4A200]" : "text-gray-400"}`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 leading-snug ${isActive ? "text-gray-500" : "text-gray-300"}`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-xl">
            {renderStepContent()}

            {currentStep !== "review-submit" && (
              <div className="mt-8">
                <Button
                  onClick={goNext}
                  className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold px-8 h-12 rounded-lg text-base"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
