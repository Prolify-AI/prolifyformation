"use client";

export const dynamic = 'force-dynamic';

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function TestContent() {
  const { user, profile, company } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard Test</h1>

        <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Auth Status</h2>
          <div className="space-y-2">
            <p>User: {user ? "Logged in" : "Not logged in"}</p>
            <p>Email: {user?.email || "N/A"}</p>
            <p>Profile: {profile ? "Loaded" : "Not loaded"}</p>
            <p>Company: {company ? company.name : "Not loaded"}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Test Complete</h2>
          <p>If you can see this, the basic dashboard structure is working.</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardTestPage() {
  return (
    <ProtectedRoute>
      <TestContent />
    </ProtectedRoute>
  );
}
