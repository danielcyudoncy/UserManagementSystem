import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/users/StatsCards";
import { UserTable } from "@/components/users/UserTable";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = () => {
    // TODO: Implement add user functionality
    console.log("Add user clicked");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="User Management"
          subtitle="Manage users, roles, and permissions"
          showAddUser
          onAddUser={handleAddUser}
          showSearch
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Stats Cards */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <StatsCards />
        </div>

        {/* User Table */}
        <div className="flex-1 p-6 overflow-y-auto">
          <UserTable searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
}
