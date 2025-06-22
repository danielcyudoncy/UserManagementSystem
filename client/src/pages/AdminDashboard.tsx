import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/users/StatsCards";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          subtitle="Overview of your task management system"
        />
        <div className="flex-1 p-6 overflow-y-auto">
          <StatsCards />
          
          {/* Additional dashboard content can go here */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <p className="text-gray-600 dark:text-gray-400">Activity feed will be displayed here</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <p className="text-gray-600 dark:text-gray-400">Quick action buttons will be displayed here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
