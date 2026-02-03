import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  title: string;
  onBack: () => void;
}

export const ComingSoon = ({ title, onBack }: ComingSoonProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6"
        >
          <Construction className="text-muted-foreground" size={48} />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-8">This feature is coming soon!</p>
        
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};
