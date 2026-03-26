import { useState } from "react";
import { motion } from "framer-motion";
import {
  Key, Globe, Bell, Save,
  Eye, EyeOff, Plus, Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const defaultLanguages = [
  { code: "en", name: "English", enabled: true },
  { code: "es", name: "Spanish", enabled: true },
  { code: "fr", name: "French", enabled: true },
  { code: "zh", name: "Chinese", enabled: true },
  { code: "ar", name: "Arabic", enabled: false },
  { code: "hi", name: "Hindi", enabled: false },
  { code: "ja", name: "Japanese", enabled: false },
  { code: "ko", name: "Korean", enabled: false },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Settings = () => {
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production API Key", key: "sk-prod-xxxxxxxxxxxxxxxxxx", visible: false },
    { id: "2", name: "Development API Key", key: "sk-dev-xxxxxxxxxxxxxxxxxx", visible: false },
  ]);
  const [languages, setLanguages] = useState(defaultLanguages);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    usageWarnings: true,
    weeklyReport: false,
    newUserNotify: true,
    errorAlerts: true,
    maintenanceUpdates: false,
  });

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const removeKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast.success("API key removed");
  };

  const addKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: "New API Key",
      key: `sk-new-${Math.random().toString(36).slice(2, 20)}`,
      visible: false,
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success("New API key generated");
  };

  const toggleLanguage = (code: string) => {
    setLanguages(languages.map(l => l.code === code ? { ...l, enabled: !l.enabled } : l));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your UniSpeak AI configuration.</p>
        </div>
        <Button variant="hero" onClick={handleSave} className="hidden sm:flex">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </motion.div>

      {/* API Keys */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Key className="w-4 h-4 text-royal" />
              API Keys
            </CardTitle>
            <CardDescription>Manage your API keys for accessing UniSpeak AI services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{apiKey.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1 truncate">
                    {apiKey.visible ? apiKey.key : "••••••••••••••••••••"}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="h-8 w-8"
                  >
                    {apiKey.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeKey(apiKey.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addKey} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language Preferences */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-azure" />
              Language Preferences
            </CardTitle>
            <CardDescription>Choose which languages are active for translation processing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-royal/10 flex items-center justify-center text-xs font-bold text-royal uppercase">
                      {lang.code}
                    </span>
                    <span className="text-sm font-medium text-foreground">{lang.name}</span>
                  </div>
                  <Switch
                    checked={lang.enabled}
                    onCheckedChange={() => toggleLanguage(lang.code)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-royal" />
              Notifications
            </CardTitle>
            <CardDescription>Configure when and how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "emailAlerts" as const, label: "Email Alerts", desc: "Receive important alerts via email" },
              { key: "usageWarnings" as const, label: "Usage Warnings", desc: "Alert when approaching API limits" },
              { key: "weeklyReport" as const, label: "Weekly Report", desc: "Receive weekly analytics summary" },
              { key: "newUserNotify" as const, label: "New User Notifications", desc: "Notify when new users sign up" },
              { key: "errorAlerts" as const, label: "Error Alerts", desc: "Immediate alerts on system errors" },
              { key: "maintenanceUpdates" as const, label: "Maintenance Updates", desc: "Notify about scheduled maintenance" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [item.key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Mobile save button */}
      <motion.div variants={itemVariants} className="sm:hidden">
        <Button variant="hero" onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
