import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ChevronDown, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RechargeProps {
  points: number;
  onSpendPoints: (amount: number, description?: string) => boolean;
  onNavigate: (page: 'dashboard' | 'recharge' | 'profile' | 'earnings' | 'settings') => void;
}

const RECHARGE_COST = 28;
const operators = ['Jio', 'Airtel', 'Vi (Vodafone Idea)', 'BSNL'];

export const Recharge = ({ points, onSpendPoints, onNavigate }: RechargeProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecharge = () => {
    if (mobileNumber.length < 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!operator) {
      setStatus('error');
      setErrorMessage('Please select an operator');
      return;
    }

    if (points < RECHARGE_COST) {
      setStatus('error');
      setErrorMessage(`Insufficient points. You need ${RECHARGE_COST - points} more points.`);
      return;
    }

    const success = onSpendPoints(RECHARGE_COST, `Mobile recharge - ${operator}`);
    if (success) {
      setStatus('success');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    }
  };

  const canAfford = points >= RECHARGE_COST;

  return (
    <div className="flex-1 flex flex-col px-6 py-8 overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Smartphone className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Mobile Recharge</h2>
        <p className="text-muted-foreground text-sm mt-1">Recharge your mobile using points</p>
      </motion.div>

      {/* Status Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-accent/10 border border-accent rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <CheckCircle className="text-accent" size={24} />
          <div>
            <p className="font-semibold text-accent">Recharge Successful!</p>
            <p className="text-sm text-muted-foreground">28 points deducted</p>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-destructive/10 border border-destructive rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle className="text-destructive" size={24} />
          <p className="text-sm text-destructive">{errorMessage}</p>
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-6 shadow-lg border border-border space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter 10-digit number"
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
              setStatus('idle');
            }}
            className="h-12 text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label>Select Operator</Label>
          <Select value={operator} onValueChange={(v) => { setOperator(v); setStatus('idle'); }}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose your operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cost Display */}
        <div className={`rounded-2xl p-4 flex items-center justify-between ${canAfford ? 'bg-muted' : 'bg-destructive/10'}`}>
          <div className="flex items-center gap-2">
            <Zap className={canAfford ? 'text-primary' : 'text-destructive'} size={20} />
            <span className="font-medium">Recharge Cost</span>
          </div>
          <span className={`font-bold text-lg ${canAfford ? 'text-foreground' : 'text-destructive'}`}>
            {RECHARGE_COST} Points
          </span>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Your balance: <span className="font-semibold text-foreground">{points} Points</span>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Button
          onClick={handleRecharge}
          disabled={!canAfford || status === 'success'}
          className="w-full h-14 text-base font-bold gradient-primary hover:opacity-90 transition-opacity"
        >
          {status === 'success' ? 'Redirecting...' : 'PROCEED RECHARGE'}
        </Button>
      </motion.div>
    </div>
  );
};
