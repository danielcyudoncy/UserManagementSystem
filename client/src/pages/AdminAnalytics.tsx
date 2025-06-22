import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BarChart3, TrendingUp, Users, CheckSquare, Clock, AlertTriangle } from "lucide-react";

export default function AdminAnalytics() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: users, isLoading: usersLoading } = useUsers();

  if (tasksLoading || usersLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress').length || 0;
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(u => u.isActive).length || 0;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

  // Role distribution
  const roleStats = users?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Priority distribution
  const priorityStats = tasks?.reduce((acc, task) => {
    const priority = task.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Analytics"
          subtitle="Insights and performance metrics for your organization"
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Task Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
                    <p className="text-xs text-gray-500">of {totalUsers} total</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Tasks</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {tasks?.filter(t => 
                        t.dueDate && 
                        new Date(t.dueDate) < new Date() && 
                        t.status !== 'completed'
                      ).length || 0}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Task Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{completedTasks}</span>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{inProgressTasks}</span>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{pendingTasks}</span>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(roleStats).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          role === 'Admin' ? 'bg-blue-500' :
                          role === 'Assignment Editor' ? 'bg-purple-500' :
                          role === 'Head of Department' ? 'bg-indigo-500' :
                          role === 'Reporter' ? 'bg-green-500' :
                          role === 'Cameraman' ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="text-sm">{role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              role === 'Admin' ? 'bg-blue-500' :
                              role === 'Assignment Editor' ? 'bg-purple-500' :
                              role === 'Head of Department' ? 'bg-indigo-500' :
                              role === 'Reporter' ? 'bg-green-500' :
                              role === 'Cameraman' ? 'bg-orange-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${totalUsers > 0 ? (count / totalUsers) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Task Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(priorityStats).map(([priority, count]) => (
                  <div key={priority} className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 ${
                      priority === 'high' ? 'bg-red-500' :
                      priority === 'medium' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}>
                      {count}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{priority} Priority</p>
                    <p className="text-xs text-gray-500">
                      {totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(1) : 0}% of all tasks
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}