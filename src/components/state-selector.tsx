"use client";

import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usStates, type USState } from "@/lib/us-states";
import { Input } from "@/components/ui/input";

interface StateSelectorProps {
  selectedState: string;
  onSelectState: (stateName: string) => void;
  onClose: () => void;
}

export function StateSelector({ selectedState, onSelectState, onClose }: StateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = usStates.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b-2 border-black dark:border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Choose a State
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredStates.map((state) => (
              <button
                key={state.code}
                onClick={() => {
                  onSelectState(state.name);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  state.name === selectedState
                    ? "border-[#FFC107] bg-[#FFC107]/10 shadow-[4px_4px_0px_0px_rgba(255,193,7,1)]"
                    : "border-black dark:border-white hover:border-[#FFC107] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(255,193,7,1)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-black dark:text-white">
                      {state.name}
                      {state.recommended && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ${state.fee.toFixed(2)} filing fee
                    </div>
                  </div>
                  {state.name === selectedState && (
                    <div className="w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center">
                      <Check className="h-4 w-4 text-black" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
