"use client";

import { useState } from "react";
import { X, ArrowLeft, Check, Hash, Building2, MapPin, Users, Shield, Briefcase, FileText, UserCheck, ClipboardList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Step =
  | "select-company"
  | "entity-info"
  | "business-address"
  | "controlling-officers"
  | "ein-responsible"
  | "business-activity"
  | "business-details"
  | "expected-employees"
  | "responsible-party"
  | "review-submit";

const STEPS: { id: Step; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "select-company", label: "Select Company", desc: "Choose your company", icon: <Building2 className="w-4 h-4" /> },
  { id: "entity-info", label: "Entity Information", desc: "Entity name & type", icon: <FileText className="w-4 h-4" /> },
  { id: "business-address", label: "Business Address", desc: "Principal place of business", icon: <MapPin className="w-4 h-4" /> },
  { id: "controlling-officers", label: "Controlling Officers", desc: "Who manages the entity", icon: <Users className="w-4 h-4" /> },
  { id: "ein-responsible", label: "EIN Responsible Party", desc: "Responsible party for EIN", icon: <Shield className="w-4 h-4" /> },
  { id: "business-activity", label: "Business Activity", desc: "Main business activity", icon: <Briefcase className="w-4 h-4" /> },
  { id: "business-details", label: "Business Details", desc: "Business specifics", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "expected-employees", label: "Expected Employees", desc: "Headcount projection", icon: <UserCheck className="w-4 h-4" /> },
  { id: "responsible-party", label: "Responsible Party", desc: "Final confirmation", icon: <Shield className="w-4 h-4" /> },
  { id: "review-submit", label: "Review & Submit", desc: "Submit your application", icon: <Check className="w-4 h-4" /> },
];

interface EINRequestModalProps {
  open: boolean;
  onClose: () => void;
  companyName?: string;
}

export default function EINRequestModal({ open, onClose, companyName }: EINRequestModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("select-company");
  const [selectedCompany, setSelectedCompany] = useState(companyName || "");
  const [formData, setFormData] = useState({
    entityName: companyName || "",
    entityType: "",
    ein: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    officerName: "",
    officerTitle: "",
    officerSSN: "",
    responsibleName: "",
    responsibleSSN: "",
    businessActivity: "",
    businessDetails: "",
    employeeCount: "",
    startDate: "",
  });

  if (!open) return null;

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) setCurrentStep(STEPS[currentIndex + 1].id);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentStep(STEPS[currentIndex - 1].id);
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fieldClass = "w-full h-11 px-3 bg-white dark:bg-black border-2 border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white text-sm focus:border-[#FFC107] focus:outline-none transition-colors placeholder:text-black/30 dark:placeholder:text-white/30";
  const labelClass = "block text-xs font-bold text-black/60 dark:text-white/60 mb-1.5 uppercase tracking-wide";

  const renderStepContent = () => {
    switch (currentStep) {
      case "select-company":
        return (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Select Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-full h-11 border-2 border-black/15 dark:border-white/15 rounded-xl focus:border-[#FFC107] bg-white dark:bg-black text-black dark:text-white">
                  <SelectValue placeholder="Select an existing company" />
                </SelectTrigger>
                <SelectContent>
                  {companyName && <SelectItem value={companyName}>{companyName}</SelectItem>}
                  <SelectItem value="new">+ Add a new company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "entity-info":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Legal Entity Name</label>
              <input value={formData.entityName} onChange={(e) => update("entityName", e.target.value)} placeholder="Enter legal entity name" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Entity Type</label>
              <Select value={formData.entityType} onValueChange={(v) => update("entityType", v)}>
                <SelectTrigger className="w-full h-11 border-2 border-black/15 dark:border-white/15 rounded-xl focus:border-[#FFC107] bg-white dark:bg-black text-black dark:text-white">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="c-corp">C-Corporation</SelectItem>
                  <SelectItem value="s-corp">S-Corporation</SelectItem>
                  <SelectItem value="sole-prop">Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "business-address":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Street Address</label>
              <input value={formData.street} onChange={(e) => update("street", e.target.value)} placeholder="123 Main St" className={fieldClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input value={formData.city} onChange={(e) => update("city", e.target.value)} placeholder="New York" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input value={formData.state} onChange={(e) => update("state", e.target.value)} placeholder="NY" className={fieldClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>ZIP Code</label>
                <input value={formData.zip} onChange={(e) => update("zip", e.target.value)} placeholder="10001" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input value={formData.country} onChange={(e) => update("country", e.target.value)} placeholder="US" className={fieldClass} />
              </div>
            </div>
          </div>
        );

      case "controlling-officers":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Officer Full Name</label>
              <input value={formData.officerName} onChange={(e) => update("officerName", e.target.value)} placeholder="John Doe" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Title / Role</label>
              <Select value={formData.officerTitle} onValueChange={(v) => update("officerTitle", v)}>
                <SelectTrigger className="w-full h-11 border-2 border-black/15 dark:border-white/15 rounded-xl focus:border-[#FFC107] bg-white dark:bg-black text-black dark:text-white">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="president">President</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelClass}>SSN / ITIN</label>
              <input value={formData.officerSSN} onChange={(e) => update("officerSSN", e.target.value)} placeholder="XXX-XX-XXXX" className={fieldClass} type="password" />
            </div>
          </div>
        );

      case "ein-responsible":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Responsible Party Name</label>
              <input value={formData.responsibleName} onChange={(e) => update("responsibleName", e.target.value)} placeholder="Full legal name" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>SSN / ITIN / EIN</label>
              <input value={formData.responsibleSSN} onChange={(e) => update("responsibleSSN", e.target.value)} placeholder="XXX-XX-XXXX" className={fieldClass} type="password" />
            </div>
          </div>
        );

      case "business-activity":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Primary Business Activity</label>
              <Select value={formData.businessActivity} onValueChange={(v) => update("businessActivity", v)}>
                <SelectTrigger className="w-full h-11 border-2 border-black/15 dark:border-white/15 rounded-xl focus:border-[#FFC107] bg-white dark:bg-black text-black dark:text-white">
                  <SelectValue placeholder="Select business activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail / E-commerce</SelectItem>
                  <SelectItem value="consulting">Consulting / Services</SelectItem>
                  <SelectItem value="technology">Technology / Software</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="finance">Finance / Investment</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "business-details":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Business Start Date</label>
              <input value={formData.startDate} onChange={(e) => update("startDate", e.target.value)} type="date" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Business Description</label>
              <textarea
                value={formData.businessDetails}
                onChange={(e) => update("businessDetails", e.target.value)}
                placeholder="Describe what your business does..."
                className="w-full h-28 px-3 py-3 bg-white dark:bg-black border-2 border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white text-sm resize-none focus:border-[#FFC107] focus:outline-none transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            </div>
          </div>
        );

      case "expected-employees":
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Expected Employee Count (First Year)</label>
              <Select value={formData.employeeCount} onValueChange={(v) => update("employeeCount", v)}>
                <SelectTrigger className="w-full h-11 border-2 border-black/15 dark:border-white/15 rounded-xl focus:border-[#FFC107] bg-white dark:bg-black text-black dark:text-white">
                  <SelectValue placeholder="Select employee count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 (No employees)</SelectItem>
                  <SelectItem value="1-5">1 - 5</SelectItem>
                  <SelectItem value="6-20">6 - 20</SelectItem>
                  <SelectItem value="21-100">21 - 100</SelectItem>
                  <SelectItem value="100+">100+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "responsible-party":
        return (
          <div className="space-y-5">
            <div className="bg-[#FFC107]/10 border-2 border-[#FFC107]/30 rounded-xl p-4">
              <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
                The responsible party is the individual who has a level of control over, or entitlement to, the funds or assets in the entity that, as a practical matter, enables the individual to directly or indirectly control, manage, or direct the entity and the disposition of its funds and assets.
              </p>
            </div>
            <div>
              <label className={labelClass}>Confirm Responsible Party Name</label>
              <input value={formData.responsibleName} onChange={(e) => update("responsibleName", e.target.value)} placeholder="Full legal name" className={fieldClass} />
            </div>
          </div>
        );

      case "review-submit":
        return (
          <div className="space-y-5">
            <div className="border-2 border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
              {[
                { label: "Company", value: selectedCompany },
                { label: "Entity Name", value: formData.entityName },
                { label: "Entity Type", value: formData.entityType },
                { label: "Address", value: [formData.street, formData.city, formData.state, formData.zip].filter(Boolean).join(", ") },
                { label: "Officer", value: formData.officerName },
                { label: "Business Activity", value: formData.businessActivity },
                { label: "Employees", value: formData.employeeCount },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={`flex justify-between items-center px-4 py-3 ${i < arr.length - 1 ? "border-b border-black/8 dark:border-white/8" : ""} ${i % 2 === 0 ? "bg-black/2 dark:bg-white/2" : ""}`}>
                  <span className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wide">{label}</span>
                  <span className="text-sm font-semibold text-black dark:text-white">{value || "—"}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-black h-12 rounded-xl text-sm transition-colors"
            >
              Submit EIN Application
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const stepInfo = STEPS[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black/8 dark:border-white/8">
        <button
          onClick={currentIndex === 0 ? onClose : goPrev}
          className="flex items-center gap-2 text-sm font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentIndex === 0 ? "Exit" : "Back"}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFC107] flex items-center justify-center">
            <Hash className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-black text-black dark:text-white">EIN Request</span>
        </div>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/8 dark:hover:bg-white/8 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] flex-shrink-0 bg-black dark:bg-[#111] border-r-2 border-black/10 dark:border-white/10 overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#FFC107] flex items-center justify-center flex-shrink-0">
                <Hash className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-white font-black text-sm leading-tight">Employer ID Number</p>
                <p className="text-white/40 text-xs">Federal Tax Identification</p>
              </div>
            </div>
          </div>

          <div className="p-4 flex-1">
            <div className="relative">
              <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-white/10" />
              <div className="space-y-1">
                {STEPS.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = index < currentIndex;
                  return (
                    <div key={step.id} className={`flex gap-3 p-2.5 rounded-xl transition-colors relative ${isActive ? "bg-white/8" : ""}`}>
                      <div
                        className={`w-[38px] h-[38px] flex-shrink-0 rounded-xl flex items-center justify-center text-xs font-black z-10 transition-all ${
                          isActive
                            ? "bg-[#FFC107] text-black shadow-lg shadow-[#FFC107]/30"
                            : isCompleted
                            ? "bg-[#FFC107]/20 text-[#FFC107]"
                            : "bg-white/5 text-white/20"
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p className={`text-xs font-bold leading-tight truncate ${isActive ? "text-white" : isCompleted ? "text-white/60" : "text-white/25"}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-0.5 truncate ${isActive ? "text-white/50" : "text-white/15"}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs font-semibold">Progress</span>
              <span className="text-[#FFC107] text-xs font-black">{currentIndex + 1} / {STEPS.length}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFC107] rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto px-10 py-10">
            {/* Step header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#FFC107]/15 flex items-center justify-center text-[#FFC107]">
                  {stepInfo.icon}
                </div>
                <span className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">
                  Step {currentIndex + 1} of {STEPS.length}
                </span>
              </div>
              <h2 className="text-2xl font-black text-black dark:text-white mb-1">{stepInfo.label}</h2>
              <p className="text-sm text-black/50 dark:text-white/50">{stepInfo.desc}</p>
            </div>

            {renderStepContent()}

            {currentStep !== "review-submit" && (
              <div className="mt-8">
                <button
                  onClick={goNext}
                  className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-black px-8 h-11 rounded-xl text-sm transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
