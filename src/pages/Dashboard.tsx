import { motion } from 'framer-motion';
import { Zap, Clock, Target } from 'lucide-react';
import { CircularProgress } from '@/components/CircularProgress';
import { MiningButton } from '@/components/MiningButton';

interface DashboardProps {
  points: number;
  progress: number;
  timeDisplay: string;
  isMining: boolean;
  onToggleMining: () => void;
}

export const Dashboard = ({
  points,
  progress,
  timeDisplay,
  isMining,
  onToggleMining
}: DashboardProps) => {
  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gradient mb-1">POINT MINING</h2>
        <p className="text-muted-foreground text-sm">Mine points by keeping the timer running</p>
      </motion.div>

      {/* Points Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-6 shadow-lg border border-border mb-8 w-full max-w-xs"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <motion.p
              key={points}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-4xl font-extrabold text-foreground"
            >
              {points}
            </motion.p>
            <p className="text-muted-foreground text-sm">Total Points</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={`mb-8 ${isMining ? 'animate-pulse-glow' : ''}`}
      >
        <CircularProgress progress={progress} size={240} strokeWidth={14}>
          <div className="text-center">
            <motion.p
              key={timeDisplay}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-3xl font-mono-display font-bold text-foreground"
            >
              {timeDisplay}
            </motion.p>
            <div className="flex items-center justify-center gap-1 mt-1 text-muted-foreground">
              <Clock size={14} />
              <span className="text-xs">of 05:00:00</span>
            </div>
          </div>
        </CircularProgress>
      </motion.div>

      {/* Mining Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <MiningButton isMining={isMining} onClick={onToggleMining} />
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex items-center gap-3 text-muted-foreground bg-muted/50 px-4 py-3 rounded-xl"
      >
        <Target size={18} className="text-primary" />
        <span className="text-sm">Goal: 5 hours mining = 1 Point</span>
      </motion.div>
    </div>
  );
};
