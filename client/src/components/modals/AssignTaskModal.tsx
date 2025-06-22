import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from "@/hooks/useTasks";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (taskId: string) => void;
  userName: string;
  isAssigning: boolean;
}

export function AssignTaskModal({ 
  isOpen, 
  onClose, 
  onAssign, 
  userName, 
  isAssigning 
}: AssignTaskModalProps) {
  const { data: tasks, isLoading } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const handleAssign = () => {
    if (selectedTaskId) {
      onAssign(selectedTaskId);
    }
  };

  const handleClose = () => {
    setSelectedTaskId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Assign a task to <span className="font-medium text-gray-900 dark:text-white">{userName}</span>
          </p>
          <div>
            <label htmlFor="taskSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Task
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a task..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks?.map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAssigning}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedTaskId || isAssigning}
            className="flex-1"
          >
            {isAssigning ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Assigning...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Assign Task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
