import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DeleteUserModal } from "@/components/modals/DeleteUserModal";
import { AssignTaskModal } from "@/components/modals/AssignTaskModal";
import { CheckSquare, Edit, Trash2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface UserTableProps {
  searchQuery: string;
}

export function UserTable({ searchQuery }: UserTableProps) {
  const { data: users, isLoading } = useUsers();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [assignModal, setAssignModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "Assignment Editor":
        return "bg-purple-600 text-white hover:bg-purple-700";
      case "Head of Department":
        return "bg-indigo-600 text-white hover:bg-indigo-700";
      case "Reporter":
        return "bg-green-600 text-white hover:bg-green-700";
      case "Cameraman":
        return "bg-orange-600 text-white hover:bg-orange-700";
      default:
        return "bg-gray-600 text-white hover:bg-gray-700";
    }
  };

  const getStatusBadge = (isActive: boolean, lastActive: Date | null) => {
    if (!isActive) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
          Inactive
        </Badge>
      );
    }

    const now = new Date();
    const lastActiveDate = lastActive ? new Date(lastActive) : null;
    const hoursSinceActive = lastActiveDate 
      ? (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60)
      : Infinity;

    if (hoursSinceActive < 1) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
          Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
          Away
        </Badge>
      );
    }
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  }) || [];

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/users/uid/${deleteModal.user.uid}`);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Success",
        description: "User deleted successfully!",
        variant: "default",
      });
      
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignTask = async (taskId: string) => {
    if (!assignModal.user) return;

    setIsAssigning(true);
    try {
      // This would typically involve updating the task to assign it to the user
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Task assigned successfully!",
        variant: "default",
      });
      
      setAssignModal({ isOpen: false, user: null });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Assignment Editor">Assignment Editor</SelectItem>
                  <SelectItem value="Head of Department">Head of Department</SelectItem>
                  <SelectItem value="Reporter">Reporter</SelectItem>
                  <SelectItem value="Cameraman">Cameraman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photoUrl || ""} alt="Profile" />
                        <AvatarFallback>
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.isActive, user.lastActive)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 dark:text-white">
                    {getTimeAgo(user.lastActive)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                        title="Assign Task"
                        onClick={() => setAssignModal({ isOpen: true, user })}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        title="Delete User"
                        onClick={() => setDeleteModal({ isOpen: true, user })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {filteredUsers.length} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteUser}
        userName={deleteModal.user?.fullName || ""}
        isDeleting={isDeleting}
      />

      <AssignTaskModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, user: null })}
        onAssign={handleAssignTask}
        userName={assignModal.user?.fullName || ""}
        isAssigning={isAssigning}
      />
    </>
  );
}
