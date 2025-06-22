import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Demo from "@/pages/Demo";
import ProfileSetup from "@/pages/ProfileSetup";
import AdminDashboard from "@/pages/AdminDashboard";
import UserManagement from "@/pages/UserManagement";
import AdminTaskManagement from "@/pages/AdminTaskManagement";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminSettings from "@/pages/AdminSettings";
import ReporterDashboard from "@/pages/ReporterDashboard";
import CameramanDashboard from "@/pages/CameramanDashboard";
import NotFound from "@/pages/not-found";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, canManageUsers } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (!canManageUsers) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function RoleBasedRoute({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (!appUser) {
    return <Redirect to="/profile-setup" />;
  }

  return <>{children}</>;
}

function Router() {
  const { user, appUser, loading } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {!loading && user ? (
          appUser ? (
            appUser.role === "Admin" || appUser.role === "Assignment Editor" || appUser.role === "Head of Department" 
              ? <Redirect to="/admin" />
              : <Redirect to="/dashboard" />
          ) : <Redirect to="/profile-setup" />
        ) : <Login />}
      </Route>

      <Route path="/signup">
        {!loading && !user ? <Signup /> : <Redirect to="/" />}
      </Route>

      <Route path="/demo">
        <Demo />
      </Route>

      <Route path="/profile-setup">
        {!loading && user && !appUser ? <ProfileSetup /> : <Redirect to="/" />}
      </Route>
      
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/users">
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/tasks">
        <ProtectedRoute>
          <AdminTaskManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/analytics">
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/settings">
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard">
        <RoleBasedRoute>
          {appUser?.role === "Reporter" ? <ReporterDashboard /> : 
           appUser?.role === "Cameraman" ? <CameramanDashboard /> :
           <AdminDashboard />}
        </RoleBasedRoute>
      </Route>
      
      <Route path="/">
        {!loading ? (
          user ? (
            appUser ? (
              appUser.profileComplete ? (
                appUser.role === "Admin" || appUser.role === "Assignment Editor" || appUser.role === "Head of Department" 
                  ? <Redirect to="/admin" />
                  : <Redirect to="/dashboard" />
              ) : <Redirect to="/profile-setup" />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )
          ) : <Redirect to="/login" />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
