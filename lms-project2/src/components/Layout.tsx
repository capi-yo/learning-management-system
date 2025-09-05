import React, { useState } from "react";
import { useAuth } from "../hooks/useMockAuth";
import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  if (!user) return <>{children}</>;

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block ${sidebarOpen ? "block" : "hidden"}`}
      >
        <div className="h-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-xl border-r border-gray-200/50 dark:border-gray-700/40 transition-all duration-500">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
      </aside>

      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-500">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/70 dark:bg-gray-900/60 border-b border-gray-200/40 dark:border-gray-700/40 shadow-sm transition-colors duration-500">
          <TopNavigation onMenuClick={openSidebar} />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto transition-all duration-500">
          <div className="rounded-2xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg border border-gray-200/40 dark:border-gray-700/40 transition-all duration-500 hover:shadow-blue-500/20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
