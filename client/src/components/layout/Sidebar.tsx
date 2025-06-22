import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Settings, 
  LogOut,
  ListTodo
} from "lucide-react";
import { Link, useLocation } from "wouter";

export function Sidebar() {
  const { appUser, logout } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Task Management", href: "/admin/tasks", icon: CheckSquare },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-blue-600 text-white";
      case "Assignment Editor":
        return "bg-purple-600 text-white";
      case "Head of Department":
        return "bg-indigo-600 text-white";
      case "Reporter":
        return "bg-green-600 text-white";
      case "Cameraman":
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ListTodo className="text-primary-foreground text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskManager</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={appUser?.photoUrl || ""} alt="Profile" />
            <AvatarFallback>
              {appUser?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {appUser?.fullName || "User"}
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(appUser?.role || "")}`}>
              {appUser?.role || "User"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start space-x-3 ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
