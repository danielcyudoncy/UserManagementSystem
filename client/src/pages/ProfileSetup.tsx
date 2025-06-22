import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { ListTodo } from "lucide-react";
import { useCreateUser } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

const roles = [
  "Reporter",
  "Cameraman", 
  "Assignment Editor",
  "Head of Department",
  "Admin"
];

export default function ProfileSetup() {
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const createUser = useCreateUser();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error", 
        description: "No authenticated user found",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUser.mutateAsync({
        uid: user.uid,
        fullName,
        email: user.email || "",
        role: selectedRole,
        photoUrl: user.photoURL || "",
        fcmToken: "",
        profileComplete: true,
      });

      toast({
        title: "Success",
        description: "Profile created successfully!",
      });

      // Force a page reload to refresh auth state and redirect
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <ListTodo className="text-primary-foreground text-xl" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Choose your role to get started</p>
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
                disabled={createUser.isPending}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole} disabled={createUser.isPending}>
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
                disabled={createUser.isPending}
                className="w-full"
              >
                {createUser.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Profile...
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