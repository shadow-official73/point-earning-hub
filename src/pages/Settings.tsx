import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Bell, BellOff, LogOut, Trash2, Info, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import rLogo from '@/assets/r-logo.png';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

const SETTINGS_KEY = 'rajvirwala_settings';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
];

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
}

const getInitialSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    notifications: true,
    language: 'en',
  };
};
 
 export const Settings = ({ onBack, onLogout }: SettingsProps) => {
   const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
   const { toast } = useToast();
 
   useEffect(() => {
     localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
     
     // Apply dark mode
     if (settings.darkMode) {
       document.documentElement.classList.add('dark');
     } else {
       document.documentElement.classList.remove('dark');
     }
   }, [settings]);
 
   const toggleDarkMode = () => {
     setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
     toast({
       title: settings.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode',
       description: `Switched to ${settings.darkMode ? 'light' : 'dark'} mode`,
     });
   };
 
   const toggleNotifications = () => {
     setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
     toast({
       title: settings.notifications ? '🔕 Notifications Off' : '🔔 Notifications On',
       description: `Notifications ${settings.notifications ? 'disabled' : 'enabled'}`,
     });
   };
 
  const handleLogout = () => {
    localStorage.removeItem('rajvirwala_data');
    localStorage.removeItem(SETTINGS_KEY);
    onLogout();
    toast({
      title: '👋 Logged Out',
      description: 'All data has been cleared',
    });
  };

  const handleLanguageChange = (value: string) => {
    setSettings(prev => ({ ...prev, language: value }));
    const langName = LANGUAGES.find(l => l.code === value)?.name || value;
    toast({
      title: '🌐 Language Changed',
      description: `Language set to ${langName}`,
    });
  };
 
   const settingsItems = [
     {
       icon: settings.darkMode ? Moon : Sun,
       title: 'Dark Mode',
       description: 'Switch between light and dark theme',
       action: (
         <Switch
           checked={settings.darkMode}
           onCheckedChange={toggleDarkMode}
         />
       ),
     },
     {
       icon: settings.notifications ? Bell : BellOff,
       title: 'Notifications',
       description: 'Get notified when mining goals are reached',
       action: (
         <Switch
           checked={settings.notifications}
           onCheckedChange={toggleNotifications}
         />
       ),
     },
   ];
 
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-black p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-white/80 text-sm">
          Customize your app experience
        </p>
      </div>
 
       {/* Content */}
       <div className="flex-1 p-4 -mt-4 space-y-4">
         {/* Settings Options */}
         <Card className="rounded-2xl border-0 shadow-lg">
           <CardContent className="p-0">
             {settingsItems.map((item, index) => {
               const Icon = item.icon;
               return (
                 <motion.div
                   key={item.title}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className={`flex items-center justify-between p-4 ${
                     index !== settingsItems.length - 1 ? 'border-b border-border' : ''
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                       <Icon size={20} className="text-primary" />
                     </div>
                     <div>
                       <h3 className="font-medium text-foreground">{item.title}</h3>
                       <p className="text-sm text-muted-foreground">{item.description}</p>
                     </div>
                   </div>
                   {item.action}
                 </motion.div>
               );
             })}
           </CardContent>
         </Card>
 
          {/* Language Setting */}
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Language</h3>
                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                  </div>
                </div>
                <Select value={settings.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center">
                  <img src={rLogo} alt="RAJVIR WALA" className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">About RAJVIR WALA</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
 
         {/* Danger Zone */}
         <Card className="rounded-2xl border-0 shadow-lg border-destructive/20">
           <CardContent className="p-4 space-y-4">
             <h3 className="font-medium text-destructive flex items-center gap-2">
               <Trash2 size={18} />
               Danger Zone
             </h3>
             
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="destructive" className="w-full">
                   <LogOut size={18} />
                   Clear All Data & Logout
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This will permanently delete all your points, mining progress, and settings. This action cannot be undone.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={handleLogout}>
                     Yes, clear everything
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 };