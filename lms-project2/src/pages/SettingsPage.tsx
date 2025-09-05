import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Mail, Lock, Bell, Moon, Sun } from "lucide-react";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    bio: "Passionate learner exploring futuristic technologies.",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    reminders: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: Mail },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: theme === "dark" ? Moon : Sun },
  ];

  const Button = ({ children }: { children: React.ReactNode }) => (
    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition">
      {children}
    </button>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition">
      {children}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-md transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button>Save Changes</Button>
          </div>
        </Card>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>
          <div className="space-y-4 max-w-md">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPass}
              onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button>Update Password</Button>
          </div>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.keys(notifications).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-gray-700 dark:text-gray-300">{key} notifications</span>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
                  }
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button>Save Preferences</Button>
          </div>
        </Card>
      )}

      {/* Appearance */}
      {activeTab === "appearance" && (
        <Card>
          <h2 className="text-xl font-semibold mb-6">Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
