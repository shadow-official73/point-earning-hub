import { motion, AnimatePresence } from 'framer-motion';
import { Home, Smartphone, User, BarChart3, Settings, X } from 'lucide-react';
import rajvirLogo from '@/assets/rajvir-logo.png';
import rLogo from '@/assets/r-logo.png';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  points: number;
  userName: string;
  userAvatar?: string | null;
}

const menuItems = [
  { icon: Home, label: 'Home', page: 'dashboard' },
  { icon: Smartphone, label: 'Recharge', page: 'recharge' },
  { icon: User, label: 'My Profile', page: 'profile' },
  { icon: BarChart3, label: 'My Earnings', page: 'earnings' },
  { icon: Settings, label: 'Settings', page: 'settings' },
];

export const Drawer = ({
  isOpen,
  onClose,
  onNavigate,
  currentPage,
  points,
  userName,
  userAvatar
}: DrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-[78%] max-w-[320px] bg-card z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-black p-6 pb-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-background/20 backdrop-blur flex items-center justify-center mb-4 border-2 border-white/30 overflow-hidden"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </motion.div>
              
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-white font-semibold text-lg"
              >
                {userName}
              </motion.h3>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-brand-cyan mt-1"
              >
                <img src={rLogo} alt="R" className="w-4 h-4" />
                <span className="font-medium">{points} Points</span>
              </motion.div>
            </div>
            
            {/* Menu Items */}
            <nav className="flex-1 py-4">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                
                return (
                  <motion.button
                    key={item.page}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.page);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border-r-4 border-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
            
            {/* Footer */}
            <div className="p-6 border-t border-border flex justify-center">
              <img src={rajvirLogo} alt="RAJVIR WALA" className="h-6 opacity-60" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
