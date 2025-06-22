import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, UserPlus, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  onAddUser?: () => void;
  showAddUser?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

export function Header({ 
  title, 
  subtitle, 
  onAddUser, 
  showAddUser = false,
  searchValue = "",
  onSearchChange,
  showSearch = false
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {showSearch && onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
          {showAddUser && onAddUser && (
            <Button onClick={onAddUser} className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
