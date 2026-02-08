import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';

interface TopNavProps {
  onMenuClick: () => void;
  points: number;
}

export const TopNav = ({ onMenuClick, points }: TopNavProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-black h-16 flex items-center justify-between px-4 shadow-lg relative z-30">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="text-white p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={24} />
        </motion.button>
        
        <AnimatePresence mode="wait">
          {!searchOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold tracking-wide" style={{ color: '#7BDFFF', textShadow: '0 0 10px #7BDFFF, 0 0 20px #7BDFFF80, 0 0 40px #7BDFFF40' }}>RAJVIR WALA</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence mode="wait">
        {searchOpen ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-1 mx-4"
          >
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-4 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-colors"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="hidden sm:flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
              <span className="text-brand-cyan text-sm font-semibold">{points} Points</span>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Search size={22} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
