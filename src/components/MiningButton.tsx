import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';

interface MiningButtonProps {
  isMining: boolean;
  onClick: () => void;
}

export const MiningButton = ({ isMining, onClick }: MiningButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        flex items-center justify-center gap-3
        px-10 py-4 rounded-2xl
        font-bold text-base tracking-wide
        transition-all duration-300
        ${isMining 
          ? 'bg-destructive text-destructive-foreground shadow-lg' 
          : 'gradient-accent text-white glow-accent shadow-xl'
        }
      `}
    >
      {/* Animated background effect when mining */}
      {isMining && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-destructive via-red-400 to-destructive"
          animate={{
            x: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ opacity: 0.3 }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-3">
        {isMining ? (
          <>
            <Square size={20} className="fill-current" />
            STOP MINING
          </>
        ) : (
          <>
            <Play size={20} className="fill-current" />
            START MINING
          </>
        )}
      </span>
    </motion.button>
  );
};
