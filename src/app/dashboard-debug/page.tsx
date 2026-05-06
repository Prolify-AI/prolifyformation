"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Hop as Home, TriangleAlert as AlertTriangle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function DebugContent() {
  const { user, profile, company } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const runTests = async () => {
      const results: Record<string, boolean> = {};
      const errorList: string[] = [];

      try {
        results["Auth Context"] = !!user;
        if (!user) errorList.push("User not authenticated");

        results["Profile Loaded"] = !!profile;
        if (!profile) errorList.push("Profile not loaded");

        results["Company Loaded"] = !!company;
        if (!company) errorList.push("Company not loaded");

        setTestResults(results);
        setErrors(errorList);
      } catch (error) {
        errorList.push(`Test error: ${error}`);
        setErrors(errorList);
      }
    };

    runTests();
  }, [user, profile, company]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Home className="h-8 w-8" />
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard Debug</h1>
        </div>

        <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">System Status</h2>
          <div className="space-y-3">
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{key}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    value
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {value ? "✓ OK" : "✗ Failed"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">Errors Detected</h3>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">User Data</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Email:</span>{" "}
              <span className="text-black dark:text-white">{user?.email || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Full Name:</span>{" "}
              <span className="text-black dark:text-white">{profile?.full_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Company:</span>{" "}
              <span className="text-black dark:text-white">{company?.name || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Next Steps</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {errors.length === 0
              ? "All systems operational. You can proceed to the main dashboard."
              : "Please complete your profile and company setup to access all features."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DebugDashboard() {
  return (
    <ProtectedRoute>
      <DebugContent />
    </ProtectedRoute>
  );
}
