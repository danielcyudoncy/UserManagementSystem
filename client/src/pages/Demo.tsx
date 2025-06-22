import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Camera, FileText, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

const demoUsers = [
  {
    id: "admin_user",
    name: "John Administrator",
    email: "admin@demo.com",
    role: "Admin",
    icon: Shield,
    description: "Full system access with user management capabilities",
    permissions: ["Create tasks", "Assign tasks", "Manage users", "View all tasks", "Admin dashboard"]
  },
  {
    id: "reporter_user", 
    name: "Sarah Reporter",
    email: "sarah@demo.com",
    role: "Reporter",
    icon: FileText,
    description: "Create and manage reporting tasks",
    permissions: ["Create tasks", "View assigned tasks", "Browse task archive", "Update task status"]
  },
  {
    id: "cameraman_user",
    name: "Mike Camera", 
    email: "mike@demo.com",
    role: "Cameraman",
    icon: Camera,
    description: "Manage video production tasks",
    permissions: ["Create video tasks", "View assigned tasks", "Browse task archive", "Update task status"]
  },
  {
    id: "editor_user",
    name: "Lisa Editor",
    email: "lisa@demo.com", 
    role: "Assignment Editor",
    icon: Settings,
    description: "Editorial oversight and task assignment",
    permissions: ["Create tasks", "Assign tasks", "Manage team tasks", "View all tasks", "Admin access"]
  }
];

export default function Demo() {
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleDemoLogin = async () => {
    if (!selectedUser) return;
    
    const user = demoUsers.find(u => u.id === selectedUser);
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Create a demo session
      const demoSession = {
        uid: user.id,
        email: user.email,
        displayName: user.name,
        photoURL: null,
        emailVerified: true
      };
      
      // Store demo session
      localStorage.setItem('demoSession', JSON.stringify(demoSession));
      localStorage.setItem('demoMode', 'true');
      
      // Navigate based on role after setting demo mode
      if (user.role === "Admin" || user.role === "Assignment Editor") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUserData = demoUsers.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Task Management System Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Explore role-based functionality without Firebase setup
          </p>
          <Badge variant="secondary" className="text-sm">
            Demo Mode - No authentication required
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Select Demo User
              </CardTitle>
              <CardDescription>
                Choose a role to experience different dashboard views and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a demo user..." />
                </SelectTrigger>
                <SelectContent>
                  {demoUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <user.icon className="w-4 h-4" />
                        <span>{user.name} - {user.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleDemoLogin} 
                disabled={!selectedUser || isLoading}
                className="w-full"
              >
                {isLoading ? "Starting Demo..." : "Enter Demo Mode"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>
                {selectedUserData ? "Permissions and capabilities" : "Select a user to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUserData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <selectedUserData.icon className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{selectedUserData.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedUserData.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {selectedUserData.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedUserData.description}
                  </p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Permissions:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {selectedUserData.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a demo user to view their details and permissions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What you can test:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-left">
                <div>
                  <h4 className="font-medium mb-1">Reporter/Cameraman:</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Create and manage tasks</li>
                    <li>• View assigned tasks</li>
                    <li>• Browse task archive with search</li>
                    <li>• Role-specific interfaces</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Admin/Assignment Editor:</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Full user management</li>
                    <li>• Task assignment capabilities</li>
                    <li>• System administration</li>
                    <li>• Comprehensive dashboards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}