"use client";

import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Lock, CreditCard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/lib/supabase/client";

export default function SettingsSection() {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
  });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    tax_reminders: true,
    compliance_alerts: true,
    marketing_emails: false,
  });

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const tabs = [
    { id: "profile", label: t.settings.profileTab, icon: User },
    { id: "notifications", label: t.settings.notificationsTab, icon: Bell },
    { id: "security", label: t.settings.securityTab, icon: Lock },
    { id: "billing", label: t.settings.billingTab, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
          <SettingsIcon className="h-7 w-7" />
          {t.settings.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t.settings.description}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white dark:bg-[#171717] border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                    {t.settings.profileInformation}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.settings.fullName}
                      </label>
                      <Input
                        value={profileData.full_name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, full_name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.settings.email}
                      </label>
                      <Input value={profileData.email} disabled className="opacity-60" />
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {t.settings.emailCannotChange}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.settings.phoneNumber}
                      </label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="bg-black dark:bg-white text-white dark:text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t.settings.saveChanges}
                </Button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t.settings.notificationPreferences}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      key: "email_notifications",
                      label: t.settings.emailNotifications,
                      description: t.settings.emailNotificationsDesc,
                    },
                    {
                      key: "tax_reminders",
                      label: t.settings.taxReminders,
                      description: t.settings.taxRemindersDesc,
                    },
                    {
                      key: "compliance_alerts",
                      label: t.settings.complianceAlerts,
                      description: t.settings.complianceAlertsDesc,
                    },
                    {
                      key: "marketing_emails",
                      label: t.settings.marketingEmails,
                      description: t.settings.marketingEmailsDesc,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-black dark:text-white">{item.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t.settings.securitySettings}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.settings.currentPassword}
                    </label>
                    <Input type="password" placeholder={t.settings.enterCurrentPassword} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.settings.newPassword}
                    </label>
                    <Input type="password" placeholder={t.settings.enterNewPassword} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.settings.confirmNewPassword}
                    </label>
                    <Input type="password" placeholder={t.settings.confirmNewPasswordPlaceholder} />
                  </div>
                  <Button className="bg-black dark:bg-white text-white dark:text-black">
                    {t.settings.updatePassword}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {t.settings.billingSubscription}
                </h3>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-black dark:text-white">{t.settings.currentPlan}</p>
                      <p className="text-2xl font-bold text-black dark:text-white mt-1">
                        Business-in-a-Box
                      </p>
                    </div>
                    <Button variant="outline">{t.settings.changePlan}</Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.settings.nextBilling} March 1, 2026
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-3">
                    {t.settings.paymentMethod}
                  </h4>
                  <div className="bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-semibold text-black dark:text-white">•••• 4242</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {t.settings.update}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
