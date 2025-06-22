import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { ListTodo } from "lucide-react";
import { useUpdateUser } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";

const roles = [
  "Reporter",
  "Cameraman", 
  "Assignment Editor",
  "Head of Department",
  "Admin"
];

export default function ProfileSetup() {
  const { user, appUser } = useAuth();
  const { toast } = useToast();
  const updateUser = useUpdateUser();
  
  const [fullName, setFullName] = useState(appUser?.fullName || user?.displayName || "");
  const [selectedRole, setSelectedRole] = useState(appUser?.role || "");

  // Show loading spinner while data is being fetched
  if (!appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!user || !appUser) {
      toast({
        title: "Error", 
        description: "User data not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: appUser.id,
        data: {
          fullName: fullName.trim(),
          role: selectedRole,
          profileComplete: true,
        }
      });

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Force a page reload to refresh auth state and redirect
      window.location.href = "/";
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <ListTodo className="text-primary-foreground text-2xl" />
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tell us about yourself to get started
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={updateUser.isPending}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole} disabled={updateUser.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={updateUser.isPending}
                className="w-full"
              >
                {updateUser.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2" size="sm" />
                    Updating Profile...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}