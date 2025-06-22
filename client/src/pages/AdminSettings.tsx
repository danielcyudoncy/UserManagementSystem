import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Save,
  RotateCcw
} from "lucide-react";

export default function AdminSettings() {
  const { appUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Organization Settings
    organizationName: "News Organization",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    autoAssignTasks: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    deadlineAlerts: 24, // hours before deadline
    
    // Security Settings
    passwordRequirements: true,
    twoFactorAuth: false,
    sessionTimeout: 8, // hours
    
    // System Settings
    backupFrequency: "daily",
    logRetention: 90, // days
    maxFileSize: 50, // MB
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      organizationName: "News Organization",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      autoAssignTasks: true,
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      deadlineAlerts: 24,
      passwordRequirements: true,
      twoFactorAuth: false,
      sessionTimeout: 8,
      backupFrequency: "daily",
      logRetention: 90,
      maxFileSize: 50,
    });
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Settings"
          subtitle="Configure system preferences and organization settings"
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Organization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={settings.organizationName}
                    onChange={(e) => setSettings(prev => ({ ...prev, organizationName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    value={settings.timezone}
                    onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    value={settings.dateFormat}
                    onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoAssign">Auto-assign Tasks</Label>
                    <p className="text-sm text-gray-500">Automatically assign tasks based on workload</p>
                  </div>
                  <Switch
                    id="autoAssign"
                    checked={settings.autoAssignTasks}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAssignTasks: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifs">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications for important events</p>
                  </div>
                  <Switch
                    id="emailNotifs"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifs">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Send browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifs"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="taskReminders">Task Reminders</Label>
                    <p className="text-sm text-gray-500">Remind users about upcoming deadlines</p>
                  </div>
                  <Switch
                    id="taskReminders"
                    checked={settings.taskReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, taskReminders: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadlineAlerts">Deadline Alert (hours before)</Label>
                  <Input
                    id="deadlineAlerts"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.deadlineAlerts}
                    onChange={(e) => setSettings(prev => ({ ...prev, deadlineAlerts: parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordReqs">Strong Password Requirements</Label>
                    <p className="text-sm text-gray-500">Enforce complex password rules</p>
                  </div>
                  <Switch
                    id="passwordReqs"
                    checked={settings.passwordRequirements}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordRequirements: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="24"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings & Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="backupFreq">Backup Frequency</Label>
                  <select
                    id="backupFreq"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logRetention">Log Retention (days)</Label>
                  <Input
                    id="logRetention"
                    type="number"
                    min="7"
                    max="365"
                    value={settings.logRetention}
                    onChange={(e) => setSettings(prev => ({ ...prev, logRetention: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    min="1"
                    max="500"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                  />
                </div>

                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}