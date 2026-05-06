"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Hop as Home, User, Building2, FileText, Calendar, Settings } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function SimpleContent() {
  const { user, profile, company, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <aside className="w-64 bg-white dark:bg-[#171717] border-r-2 border-gray-200 dark:border-gray-800 p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Prolify</h2>
        </div>
        <nav className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: Home },
            { id: "profile", label: "Profile", icon: User },
            { id: "company", label: "Company", icon: Building2 },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="bg-white dark:bg-[#171717] border-b-2 border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Welcome back, {userName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">
              {activeSection === "dashboard" && "Dashboard"}
              {activeSection === "profile" && "Profile"}
              {activeSection === "company" && "Company Information"}
              {activeSection === "documents" && "Documents"}
              {activeSection === "calendar" && "Calendar"}
              {activeSection === "settings" && "Settings"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This is a simplified dashboard. Content for {activeSection} would appear here.
            </p>

            {company && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Company Name</p>
                <p className="font-semibold text-black dark:text-white">{company.name}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SimpleDashboard() {
  return (
    <ProtectedRoute>
      <SimpleContent />
    </ProtectedRoute>
  );
}
